# The Drive listing the catalogue is built from

Two tab-separated files, exactly as the Drive API answers:
`tree.tsv` is `id, parent, kind, name` for the 221 folders and
`files.tsv` is `id, parent, name` for the 1,579 files.

`scripts/import-courses.ts --crawl scripts/fixtures/course-crawl`
turns them into `shared/courses.data.json`, and CI runs the same
command with `--check`, so the committed catalogue is always
reproducible from something in this repository rather than being a
file only one laptop with a credential could have produced.

## Refreshing it

Both files are written by the importer itself, so a refresh is one
command and never hand-editing:

    node scripts/import-courses.ts \
      --drive <folderId> --token ya29.... \
      --dump scripts/fixtures/course-crawl

Always pass `--dump` on a `--drive` run. Without it the catalogue
moves and this listing does not, and the next `--check` in CI fails
on a drift that is really just a stale fixture.

## Why the listing is committed and the credential is not

The folder is private, so walking it needs an OAuth access token
that lasts an hour. A generated file whose generator only one
person can run is a generated file that quietly becomes
hand-maintained, which is the failure `CLAUDE.md` opens with. This
listing is the part of that walk which needs no credential: it is
file names and ids, no content, and every id in it opens nothing
without permission on the folder itself.

## What is not in it

Two files of the 1,579 are not part of any lesson and are skipped:
the `About The content.txt` at the root of the download, and one
saved link named `grow.with.google`, whose last dot is a domain
rather than an extension. `check-courses.ts` measures that drop
rate and fails if it goes over one per cent, because a dropped file
is not a visible failure: the lesson still renders, with one fewer
thing under it. The first version of the parser dropped 133 of
1,579 this way and left two whole modules looking empty.
