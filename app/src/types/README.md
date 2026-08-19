# The site's own modules, described

**This directory is emptying, on purpose.** archive/TRANSITION.md Stage 13:
a module that moves to `aab/src/` as TypeScript emits its own
declaration here, and the hand-written one is deleted in the same
commit. `share-card.d.ts` is generated as of 16 August 2026 and
says so at the top of the file it came from; the rest are still
hand-written and still describe plain JavaScript. This directory
is done when it holds only this README.

**Do not edit a generated one.** `node scripts/build-modules.ts`
writes it and `--check` fails if what is committed differs.


Six of this site's modules are shared with every other page and are
not part of this app: `/auth.js` guards the door, `/app.js` draws the
furniture, `/api.js` does the fetching, `/content.js` is the manifest
of what exists, `/share-card.js` draws the picture a pasted link
shows, and `/photo.js` moves a photo out to R2. Vite leaves all six
external, so the built file imports them at runtime exactly as every
other page on this site does, and there is no second copy of any of
them inside `aab/desk/app.js`.

They are plain JavaScript, so TypeScript has nothing to go on. The
first version of this app answered that with a `@ts-expect-error`
above each import, which is a worse answer than it looks: it does not
describe the module, it only silences the complaint, and it silences
the next complaint too. `pieceUrl(slug, section)`, with the arguments
the wrong way round, would have compiled.

So each one is declared here instead, and `tsconfig.json` maps the
runtime path to the declaration:

```json
"paths": { "/app.js": ["./src/types/app.d.ts"] }
```

A module that has become TypeScript loses its declaration in the
same change and the mapping points at the module instead, which is
one description rather than two: `/content.js` is
`../shared/content.ts`.

A `paths` entry is a compile-time claim about a file the browser
fetches at runtime, so the two can disagree, and nothing here would
notice. Two things keep them honest:

- every signature below was read off the module it describes, and
- `node scripts/check-csp.ts` walks `app/src`, so an import of something
  that is not served by this origin fails a check rather than a page.

If one of these modules changes shape, this directory is the thing to
change with it. Everything in `app/src` that got it wrong then stops
compiling, which is the entire point of the arrangement.
