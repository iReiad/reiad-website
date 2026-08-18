# The Drive listing this catalogue was seeded from

Two tab-separated files, exactly as the Drive API answers:
`tree.tsv` is `id, parent, kind, name` for folders and
`files.tsv` is `id, parent, name` for everything else.

`scripts/import-courses.mjs --crawl scripts/fixtures/course-crawl`
turns them into `shared/courses.data.json`, and CI runs the same
command with `--check`, so the committed catalogue is always
reproducible from something in this repository rather than being a
file only one laptop could have produced.

## What it is and is not

It is a SNAPSHOT, taken when the section was written. It holds the
whole structure of the eight courses, all 43 modules and all 170
lesson groups, and the files of 12 of those groups. The other 158
are why most modules come back marked `pending`: nothing is
missing from the site's point of view, the ladder is complete and
every page renders, but those modules have no lessons in them yet.

Filling them needs no work here and no editing of anything. It
needs one command against the real folder, with a Drive OAuth
token, because the files are private and an API key will not open
them:

    node scripts/import-courses.mjs --drive <folderId> --token ya29....

After that run this fixture is superseded and the honest thing is
to replace it with a fresh `--crawl` export or to delete it and
change the CI step to `--drive`. It is committed rather than
thrown away because a generated file whose generator needs a
credential nobody has is a generated file that quietly becomes
hand-maintained, which is the failure `CLAUDE.md` opens with.

`.en.srt` caption files are deliberately absent: the `.en.txt`
transcript beside each one says the same thing and is what the
lesson page links to.
