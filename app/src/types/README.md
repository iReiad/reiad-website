# The site's own modules, described

**This directory is emptying, on purpose.** A module that moves to
`aab/src/` as TypeScript emits its own declaration here, and the
hand-written one is deleted in the same commit. This directory is
done when it holds only this README.

**Do not edit a generated one.** `node scripts/build-modules.ts`
writes it and `--check` fails if what is committed differs.

Six of this site's modules are shared with every other page and are
not part of this app: `/auth.js`, `/app.js`, `/api.js`,
`/content.js`, `/share-card.js` and `/photo.js`. Vite leaves all six
external, so the built file imports them at runtime exactly as every
other page does and there is no second copy inside
`aab/studio/app.js`.

They are plain JavaScript, so TypeScript has nothing to go on. Each
is declared here and `tsconfig.json` maps the runtime path to the
declaration:

```json
"paths": { "/app.js": ["./src/types/app.d.ts"] }
```

Never answer an untyped import with a `@ts-expect-error`: it does
not describe the module, it only silences the complaint, and it
silences the next one too. `pieceUrl(slug, section)` with the
arguments the wrong way round would compile.

A module that has become TypeScript loses its declaration in the
same change and the mapping points at the module instead:
`/content.js` is `../shared/content.ts`.

A `paths` entry is a compile-time claim about a file the browser
fetches at runtime, so the two can disagree. Two things keep them
honest: every signature here was read off the module it describes,
and `node scripts/check-csp.ts` walks `app/src`, so an import of
something this origin does not serve fails a check rather than a
page.
