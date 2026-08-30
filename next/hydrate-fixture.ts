/* ============================================================
   hydrate-fixture.ts: one component, server-rendered and then
   hydrated, in a real browser.

   Not a test. `insights-hub.test.ts` and `read-aloud.test.ts` both
   need the same four things before they can ask anything: the
   component rendered to HTML the way a route renders it, that HTML
   served with a script that hydrates it, a browser pointed at the
   result, and an honest answer about whether any of that was
   possible. This is those four things, once.

   ```ts
   const { SomeThing } = await load("export { SomeThing } from './components/x';");
   const fixture = await open({
     port: 8993,
     body: `<div id="root">${markup}</div>`,
     entry: `import { hydrateRoot } from "react-dom/client"; …`,
   });
   ```

   ---- why a fixture rather than the route ----

   `/insights` and an article are both `force-dynamic`, so
   neither is in `.next/server/app/` and `interactive.test.ts`
   cannot serve either. The other way in is `dev-worker.ts`, which
   is the OpenNext build on workerd with a database under it, and
   that is what `article.test.ts` and `parity.test.ts` use.

   This is the smaller question, asked where it can be asked
   quickly: does the COMPONENT do what the module it replaced did,
   once React has adopted the server's HTML. What the route puts on
   the page is the parity test's question and stays there.

   ---- the hydration is the point, not a detail ----

   The server's markup goes into the document and the browser
   hydrates it, rather than rendering it from scratch, because that
   is the arrangement every one of these components is really in
   and it is the one that has gone wrong here before. A mismatch
   shows up as React error #418 in the console, which every caller
   below watches for.
   ============================================================ */

import { createServer, type Server } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { access } from "node:fs/promises";
import type { Browser } from "playwright";

const here = dirname(fileURLToPath(import.meta.url));

/** Says why, and does not come back. `never` so that everything
    after a `skip()` knows the thing it needed exists. */
export const skip: (why: string) => never = (why) => {
  console.log(`SKIPPED: ${why}`);
  console.log("A skip is not a pass.\n");
  process.exit(0);
};

const exists = async (path: string): Promise<boolean> =>
  access(path).then(() => true, () => false);

/* Bundled rather than imported, because a `.tsx` is JSX and node
   strips types without transforming them, and because the result
   is imported as a `data:` URL, which cannot resolve a bare
   specifier. `next/comments.test.ts` says the same thing where it
   does it. */
async function esbuild(): Promise<typeof import("esbuild")> {
  return import("esbuild").catch(() => skip(
    "esbuild is not installed. It is a devDependency of next/ and of the root: "
    + "`cd next && npm install`."));
}

/**
 * One entry's worth of source, bundled for a browser.
 *
 * `contents` is resolved against `next/`, so it imports
 * `./components/…` the way a route does.
 */
export async function bundle(contents: string): Promise<string> {
  const { build } = await esbuild();
  const out = await build({
    stdin: { contents, resolveDir: here, loader: "tsx" },
    bundle: true,
    write: false,
    format: "esm",
    platform: "browser",
    jsx: "automatic",
    /* The same alias as `load()` above, and for the same reason:
       a bundle here should not depend on somebody having run
       `npm install` in `next/`. */
    alias: { "@reiad/shared": join(here, "..", "shared") },
    /* React reads this to decide whether to ship its development
       warnings, and the hydration mismatch is one of them. The
       minified numbered errors are what production gives, and
       `interactive.test.ts` matches on those; a readable message
       is worth more here, and both spellings are watched for. */
    define: { "process.env.NODE_ENV": '"development"' },
    logLevel: "silent",
  });
  return out.outputFiles[0].text;
}

/** The same bundle, imported into THIS process, for the server
    render. Whatever the source exports is what comes back. */
export async function load<T>(contents: string): Promise<T> {
  const { build } = await esbuild();
  const out = await build({
    stdin: { contents, resolveDir: here, loader: "tsx" },
    bundle: true,
    write: false,
    format: "esm",
    platform: "neutral",
    mainFields: ["module", "main"],
    conditions: ["import", "default"],
    jsx: "automatic",
    /* `@reiad/shared` is installed in `next/` and nowhere else,
       and `npm ci` runs at the root: pointing at the source means
       a bundle here does not depend on somebody having run
       `npm install` in `next/` first. `aab/schools/hub.test.ts`
       says the rest, having been the one that found it. */
    alias: { "@reiad/shared": join(here, "..", "shared") },
    define: { "process.env.NODE_ENV": '"development"' },
    logLevel: "silent",
  });
  const encoded = Buffer.from(out.outputFiles[0].text).toString("base64");
  return await import(`data:text/javascript;base64,${encoded}`) as T;
}

/** A file the fixture serves beside the page. */
export interface Extra {
  type: string;
  body: string;
}

export interface Fixture {
  origin: string;
  browser: Browser;
  /** Shut this one down and carry on, for a test that needs a
      second page with different markup on it. */
  stop: () => Promise<void>;
  /** The last thing a caller does, whether it passed or failed.
      esbuild keeps a child process alive, so a test that does not
      call this sits there with nothing to do. */
  close: (code?: number) => Promise<never>;
}

/**
 * Serve one page and open a browser on it.
 *
 * @param body    what goes inside `<body>`, which is the server's
 *                render with whatever wraps it.
 * @param entry   the module that hydrates it, as source. Served at
 *                `/hydrate.js` and loaded with `type="module"`.
 * @param files   anything else the page asks for by path, which is
 *                how a component's runtime module is stubbed.
 */
export async function open({ port, body, entry, files = {} }: {
  port: number;
  body: string;
  entry: string;
  files?: Record<string, Extra>;
}): Promise<Fixture> {
  /* The runtime import is the real path, because node resolves a
     file on disk; the types come through the `paths` entry in
     `tsconfig.json`. `article.test.ts` says the rest. */
  const PLAYWRIGHT = "../app/node_modules/playwright/index.mjs";
  const playwright = await import(PLAYWRIGHT)
    .then((m) => m as typeof import("playwright"), () => null);
  if (!playwright) {
    skip("playwright is not installed. It is a devDependency of app/: "
      + "`cd app && npm install`.");
  }

  const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
  const browserPath = process.env.CHROMIUM_PATH
    || (await exists(CHROME) ? CHROME : null);
  if (!browserPath) {
    try { playwright.chromium.executablePath(); } catch {
      skip("no browser. Point CHROMIUM_PATH at one, or `npx playwright install chromium`.");
    }
  }

  const page = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">`
    + `<title>fixture</title></head><body>${body}`
    + `<script type="module" src="/hydrate.js"></script></body></html>`;

  const routes: Record<string, Extra> = {
    "/": { type: "text/html; charset=utf-8", body: page },
    "/hydrate.js": { type: "text/javascript; charset=utf-8", body: await bundle(entry) },
    ...files,
  };

  const server: Server = createServer((req, res) => {
    const path = new URL(req.url ?? "/", "http://x").pathname;
    const file = routes[path];
    if (!file) { res.writeHead(404).end("not found"); return; }
    res.writeHead(200, { "Content-Type": file.type });
    res.end(file.body);
  });
  await new Promise<void>((resolve) => server.listen(port, resolve));

  const browser = await playwright.chromium.launch(
    browserPath ? { executablePath: browserPath } : {});

  const stop = async (): Promise<void> => {
    await browser.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  };

  return {
    origin: `http://localhost:${port}`,
    browser,
    stop,
    close: async (code = 0) => {
      await stop();
      process.exit(code);
    },
  };
}
