# reiad.co.uk, house rules

## Punctuation: no em dashes. Ever.

**Never use the em dash, U+2014, anywhere on this site.** It is not written
out anywhere in this repo on purpose: the check below greps for it, and a
rule that contains the character it bans always matches itself. Not in page copy,
not in headings, not in meta descriptions, not in Bangla, not in strings a
script writes into the DOM, not in commit messages or PR bodies.

This is not a preference about one character. A sentence that needs an em
dash is usually a sentence holding two ideas that have not been separated
properly, and the mark is doing the work that punctuation or a full stop
should be doing. Take the extra second and write it out.

What to use instead, in the order worth trying:

| The dash was doing this | Use |
| --- | --- |
| Introducing an explanation, a list, or a definition | a colon |
| Joining two clauses that could stand alone | a full stop, or a semicolon |
| Wrapping an aside mid-sentence | a pair of commas |
| Wrapping an aside that really is parenthetical | brackets |
| Tacking on an afterthought | a comma, or cut the afterthought |
| Nothing in particular (a pause for effect) | delete it and reflow the sentence |

Two dashes wrapping an aside become two commas or one pair of brackets,
never one comma and one bracket.

En dashes (U+2013) in number ranges are fine and are not affected by any of
this: `2024–26`, `৳50–100`.

The same rule applies to code comments in new work. The comments in this
repo are long and explanatory on purpose, and they read better without the
dash too.

Quick check before committing:

```sh
grep -rn $'\u2014' aab/ functions/
```

## Language

Bangla is the site's learning language, English the working one. Bangla
copy is written for a reader who should never have to read English to find
out that something exists in their own language. Keep it plain: short
sentences, everyday words, no transliterated jargon where a Bangla word
exists.

## Before deploying

Run the checks. They are fast and each one exists because something
shipped broken once:

```sh
node aab/check-routes.mjs   # redirect loops, dead links, bad article slugs
node aab/check-css.mjs      # a school's cascade layer styling the whole site
node aab/check-sw.mjs       # a precached file changed without a VERSION bump
```

If a precached file changed, bump `VERSION` in `aab/sw.js`, add a line to
the changelog at the top of that file saying what changed and why it needs
the bump, then run `node aab/check-sw.mjs --update`.

Generated pages are generated. Edit the source, never the output:

```sh
node aab/learn/build-lessons.mjs     # aab/learn/**  from curriculum + content
node aab/deutsch/build-deutsch.mjs   # aab/deutsch/** from content/ + data
node aab/build-meta.mjs              # feed.xml, sitemap.xml, robots.txt
```
