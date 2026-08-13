#!/bin/bash
# End-to-end exercise of every endpoint against the real Cloudflare runtime.
# Override with: PORT=8792 ./test-api.sh
B=http://127.0.0.1:${PORT:-8788}
J='Content-Type: application/json'
C=$(mktemp -t jar.XXXXXX)
rm -f $C
pass=0; fail=0
check() { # name expected_substring actual
  if [[ "$3" == *"$2"* ]]; then echo "  ok   $1"; pass=$((pass+1));
  else echo "  FAIL $1"; echo "       want ~ $2"; echo "       got    ${3:0:200}"; fail=$((fail+1)); fi
}

# The browser derives the key, so the suite has to as well: this is
# the same PBKDF2-SHA256 the Studio runs, standing in for it.
derive() { # salt_b64 iterations passphrase
  node -e 'const c=require("crypto");process.stdout.write(
    c.pbkdf2Sync(process.argv[3],Buffer.from(process.argv[1],"base64"),
                 +process.argv[2],32,"sha256").toString("base64"))' "$1" "$2" "$3"
}

PASSPHRASE="a properly long passphrase"

echo "── auth ───────────────────────────────"
PARAMS=$(curl -s $B/api/auth/params)
SALT=$(sed -n 's/.*"salt":"\([^"]*\)".*/\1/p' <<<"$PARAMS")
ITER=$(sed -n 's/.*"iterations":\([0-9]*\).*/\1/p' <<<"$PARAMS")
DK=$(derive "$SALT" "$ITER" "$PASSPHRASE")

check "params advertise the scheme" '"scheme":"pbkdf2c"' "$PARAMS"
check "params are strong"           "$ITER" "$([[ $ITER -ge 100000 ]] && echo $ITER)"

# The suite is idempotent: on a fresh database it exercises setup, and
# on one that already has a password it signs in instead.
CONFIGURED=$(curl -s $B/api/auth/me | grep -o '"configured":[a-z]*' | cut -d: -f2)
if [[ "$CONFIGURED" == "false" ]]; then
  check "setup rejects a weak stretch" 'weak-iterations' \
    "$(curl -s -X POST -H "$J" -d "{\"salt\":\"$SALT\",\"iterations\":1000,\"dk\":\"$DK\"}" $B/api/auth/setup)"
  check "setup rejects a junk key" 'bad-key' \
    "$(curl -s -X POST -H "$J" -d "{\"salt\":\"$SALT\",\"iterations\":$ITER,\"dk\":\"nope\"}" $B/api/auth/setup)"
  check "setup"         '"signedIn":true' \
    "$(curl -s -c $C -X POST -H "$J" -d "{\"salt\":\"$SALT\",\"iterations\":$ITER,\"dk\":\"$DK\"}" $B/api/auth/setup)"
else
  echo "  --   fresh-database checks skipped (already configured)"
  curl -s -c $C -X POST -H "$J" -d "{\"dk\":\"$DK\"}" $B/api/auth/login > /dev/null
fi
check "setup is one-shot" 'already-configured' \
  "$(curl -s -X POST -H "$J" -d "{\"salt\":\"$SALT\",\"iterations\":$ITER,\"dk\":\"$DK\"}" $B/api/auth/setup)"
check "session works"   '"signedIn":true' "$(curl -s -b $C $B/api/auth/me)"
check "no cookie = out"  '"signedIn":false' "$(curl -s $B/api/auth/me)"
check "bad password"    'bad-password' \
  "$(curl -s -X POST -H "$J" -d "{\"dk\":\"$(derive "$SALT" "$ITER" 'wrong wrong wrong')\"}" $B/api/auth/login)"
check "good password"   '"signedIn":true' \
  "$(curl -s -c $C -X POST -H "$J" -d "{\"dk\":\"$DK\"}" $B/api/auth/login)"
check "the passphrase never reaches the server" 'bad-password' \
  "$(curl -s -X POST -H "$J" -d "{\"password\":\"$PASSPHRASE\"}" $B/api/auth/login)"

echo "── articles ───────────────────────────"
check "write needs auth" 'unauthorised' \
  "$(curl -s -X POST -H "$J" -d '{"slug":"x","title":"x"}' $B/api/articles)"
# overwrite:true because the suite is idempotent and a second run is,
# by definition, a republish of a slug that already exists.
check "publish" '"slug":"sanchayapatra-vs-fdr"' \
  "$(curl -s -b $C -X POST -H "$J" -d '{
      "slug":"sanchayapatra-vs-fdr",
      "title":"Sanchayapatra vs bank FDR",
      "dek":"Where a saver'"'"'s taka works harder.",
      "tag":"Comparison · Savings","topics":["Savings","Beginner"],
      "status":"live","overwrite":true,
      "body":"<h2>The rates</h2><p>Gross rates are <strong>not</strong> what you receive.</p><script>alert(1)</script><p onclick=\"evil()\">Tax at source comes off first.</p><a href=\"javascript:evil()\">bad</a>"
    }' $B/api/articles)"

# The upsert used to be unguarded, so one repeated headline replaced a
# live piece with nothing to go back to.
check "a taken slug is refused" 'slug-exists' \
  "$(curl -s -b $C -X POST -H "$J" -d '{
      "slug":"sanchayapatra-vs-fdr","title":"Something else","body":"<p>no</p>"
    }' $B/api/articles)"
check "and says what it would have replaced" 'Sanchayapatra vs bank FDR' \
  "$(curl -s -b $C -X POST -H "$J" -d '{
      "slug":"sanchayapatra-vs-fdr","title":"Something else","body":"<p>no</p>"
    }' $B/api/articles)"
check "the refusal left the original alone" 'Sanchayapatra vs bank FDR' \
  "$(curl -s $B/api/articles/sanchayapatra-vs-fdr)"

# A body over the limit used to be silently sliced, which published
# half an article and closed the dangling tags on the way.
check "an oversized body is refused, not truncated" 'body-too-large' \
  "$(python3 -c '
import json,sys
sys.stdout.write(json.dumps({"slug":"too-big","title":"Too big",
  "body":"<p>" + "x"*1_100_000 + "</p>","overwrite":True}))' \
    | curl -s -b $C -X POST -H "$J" --data-binary @- $B/api/articles)"
check "and nothing was stored for it" 'not-found' \
  "$(curl -s -b $C $B/api/articles/too-big)"
check "script stripped"  'clean' \
  "$(curl -s $B/api/articles/sanchayapatra-vs-fdr | grep -qc '<script' && echo dirty || echo clean)"
check "onclick stripped" 'clean' \
  "$(curl -s $B/api/articles/sanchayapatra-vs-fdr | grep -qc 'onclick' && echo dirty || echo clean)"
check "reading time"     '"minutes":1' "$(curl -s $B/api/articles/sanchayapatra-vs-fdr)"
check "public list"      'sanchayapatra-vs-fdr' "$(curl -s $B/api/articles)"
check "draft hidden"     '"articles":[]' \
  "$(curl -s -b $C -X POST -H "$J" -d '{"slug":"secret-draft","title":"Draft","status":"draft","body":"<p>wip</p>"}' $B/api/articles >/dev/null; curl -s $B/api/articles | python3 -c 'import sys,json; d=json.load(sys.stdin); print(json.dumps({"articles":[a for a in d["articles"] if a["slug"]=="secret-draft"]},separators=(",",":")))')"
check "admin sees draft" 'secret-draft' "$(curl -s -b $C "$B/api/articles?all=1")"
check "draft 404s public" 'not-found' "$(curl -s $B/api/articles/secret-draft)"
check "publish via PATCH" '"status":"live"' \
  "$(curl -s -b $C -X PATCH -H "$J" -d '{"status":"live"}' $B/api/articles/secret-draft)"
# PATCH could only ever change a status, so fixing a typo in a dek
# meant republishing the whole body.
check "PATCH edits a field on its own" '"dek":"Fixed."' \
  "$(curl -s -b $C -X PATCH -H "$J" -d '{"dek":"Fixed."}' $B/api/articles/secret-draft)"
check "and leaves the rest alone" '"status":"live"' \
  "$(curl -s -b $C "$B/api/articles/secret-draft")"
check "an off-site cover is refused" '"cover":""' \
  "$(curl -s -b $C -X PATCH -H "$J" -d '{"cover":"https://evil.example.com/x.png"}' $B/api/articles/secret-draft)"
check "a /media cover is kept" '"cover":"/media/x/0123456789abcdef.webp"' \
  "$(curl -s -b $C -X PATCH -H "$J" -d '{"cover":"/media/x/0123456789abcdef.webp"}' $B/api/articles/secret-draft)"
check "delete"           '"deleted"' "$(curl -s -b $C -X DELETE $B/api/articles/secret-draft)"

# The lead photo becomes the article's own social image, instead of
# every piece sharing the one generic card.
check "publishing keeps a /media cover" '"cover":"/media/cover-test/0123456789abcdef.webp"' \
  "$(curl -s -b $C -X POST -H "$J" -d '{
      "slug":"cover-test","title":"With a cover","status":"live","overwrite":true,
      "cover":"/media/cover-test/0123456789abcdef.webp","body":"<p>Body.</p>"
    }' $B/api/articles)"
# The origin comes from SITE_ORIGIN, so match on the path only.
check "and the rendered page uses it as og:image" \
  '/media/cover-test/0123456789abcdef.webp' \
  "$(curl -s $B/insights/cover-test.html | grep 'og:image')"
check "an off-site cover is refused on publish" '"cover":""' \
  "$(curl -s -b $C -X POST -H "$J" -d '{
      "slug":"cover-test","title":"With a cover","status":"live","overwrite":true,
      "cover":"https://evil.example.com/x.png","body":"<p>Body.</p>"
    }' $B/api/articles)"
check "and then it falls back to the site default" '/og/insights.png' \
  "$(curl -s $B/insights/cover-test.html | grep 'og:image')"
curl -s -b $C -X DELETE $B/api/articles/cover-test > /dev/null

# Publishing replaces an article in place, and until versions existed
# a republish you regretted had nothing to go back to.
check "history needs auth" 'unauthorised' \
  "$(curl -s "$B/api/articles/sanchayapatra-vs-fdr/versions")"
check "the first publish has no history yet" '"versions":[]' \
  "$(curl -s -b $C -X POST -H "$J" -d '{"slug":"history-test","title":"First","status":"live","overwrite":true,"body":"<p>Version one.</p>"}' $B/api/articles >/dev/null; \
     curl -s -b $C "$B/api/articles/history-test/versions")"
check "overwriting keeps what it replaced" 'First' \
  "$(curl -s -b $C -X POST -H "$J" -d '{"slug":"history-test","title":"Second","status":"live","overwrite":true,"body":"<p>Version two.</p>"}' $B/api/articles >/dev/null; \
     curl -s -b $C "$B/api/articles/history-test/versions")"
check "the live copy is the new one" 'Version two' \
  "$(curl -s -b $C "$B/api/articles/history-test")"
VID=$(curl -s -b $C "$B/api/articles/history-test/versions" | python3 -c 'import sys,json;print(json.load(sys.stdin)["versions"][0]["id"])')
check "restoring puts the old body back" 'Version one' \
  "$(curl -s -b $C -X POST -H "$J" -d "{\"id\":$VID}" $B/api/articles/history-test/versions >/dev/null; \
     curl -s -b $C "$B/api/articles/history-test")"
# Going back must never be the thing that loses the newer version, so
# the restore is snapshotted too and "Second" is now in the history.
check "and the version it replaced is itself kept" 'Second' \
  "$(curl -s -b $C "$B/api/articles/history-test/versions")"
check "restoring a version that isn't ours is refused" 'not-found' \
  "$(curl -s -b $C -X POST -H "$J" -d '{"id":999999}' $B/api/articles/history-test/versions)"
check "deleting an article takes its history" '"versions":[]' \
  "$(curl -s -b $C -X DELETE $B/api/articles/history-test >/dev/null; \
     curl -s -b $C "$B/api/articles/history-test/versions")"

echo "── media ──────────────────────────────"
check "upload needs auth" 'unauthorised' \
  "$(curl -s -X POST -H 'Content-Type: image/webp' --data-binary 'x' $B/api/media)"
check "the listing needs auth" 'unauthorised' "$(curl -s $B/api/media)"
check "a non-image type is refused" 'unsupported-type' \
  "$(curl -s -b $C -X POST -H 'Content-Type: text/html' --data-binary '<b>x</b>' $B/api/media)"
check "an empty upload is refused" 'empty-body' \
  "$(curl -s -b $C -X POST -H 'Content-Type: image/webp' --data-binary '' $B/api/media)"
# A key is <slug>/<content-hash>.<ext> and nothing else, so that a
# path can't be talked into pointing somewhere it shouldn't. These go
# through --path-as-is, because curl resolves ".." itself otherwise
# and the request never reaches the guard being tested.
check "a shapeless key is refused"  'not-found' \
  "$(curl -s "$B/media/not-a-key")"
# The runtime resolves ".." out of the path before routing, so this
# never reaches the key guard at all: it stops being a /media URL
# and becomes an ordinary miss. What matters is the outcome, so that
# is what this asserts rather than which layer said no.
check "a traversal key leaks nothing" 'safe' \
  "$(curl -s --path-as-is "$B/media/a/../../../wrangler.toml" \
     | grep -qc 'database_id' && echo leaked || echo safe)"
check "a non-hash key is refused"   'not-found' \
  "$(curl -s "$B/media/piece/hello.webp")"
check "an odd extension is refused" 'not-found' \
  "$(curl -s "$B/media/piece/0123456789abcdef.exe")"
check "a well-formed but absent key is not found" 'not-found' \
  "$(curl -s "$B/media/nope/0123456789abcdef.webp")"

MEDIA=$(printf 'RIFF$\0\0\0WEBPVP8 \x18\0\0\0\x30\x01\0\x9d\x01\x2a\x01\0\x01\0\x0e\x25\xa4\0\x03\x70\0\xfe\xfb\xfd\x50\0' \
  | curl -s -b $C -X POST -H 'Content-Type: image/webp' --data-binary @- "$B/api/media?slug=test-piece")
check "upload returns a /media URL" '"url":"/media/test-piece/' "$MEDIA"
KEY=$(sed -n 's/.*"key":"\([^"]*\)".*/\1/p' <<<"$MEDIA")
check "the same bytes upload once" '"deduplicated":true' \
  "$(printf 'RIFF$\0\0\0WEBPVP8 \x18\0\0\0\x30\x01\0\x9d\x01\x2a\x01\0\x01\0\x0e\x25\xa4\0\x03\x70\0\xfe\xfb\xfd\x50\0' \
     | curl -s -b $C -X POST -H 'Content-Type: image/webp' --data-binary @- "$B/api/media?slug=test-piece")"
check "it serves back as an image" 'image/webp' \
  "$(curl -s -o /dev/null -D - "$B/media/$KEY" | tr -d '\r')"
# A content-hashed key can never point at different bytes later.
check "and says so with immutable" 'immutable' \
  "$(curl -s -o /dev/null -D - "$B/media/$KEY" | tr -d '\r')"
check "the listing shows it" "$KEY" "$(curl -s -b $C "$B/api/media?slug=test-piece")"
# A photo pasted from Google Docs is cross-origin, so the browser is
# blocked from fetching it to resize: the upload failed and the
# article silently kept an image hotlinked to someone else's server.
check "the fetch proxy needs auth" 'unauthorised' \
  "$(curl -s "$B/api/media/fetch?u=https%3A%2F%2Fexample.com%2Fx.png")"
check "it refuses plain http" 'https-only' \
  "$(curl -s -b $C "$B/api/media/fetch?u=http%3A%2F%2Fexample.com%2Fx.png")"
check "it refuses a private address" 'host-not-allowed' \
  "$(curl -s -b $C "$B/api/media/fetch?u=https%3A%2F%2F127.0.0.1%2Fx.png")"
check "it refuses a nonsense URL" 'bad-url' \
  "$(curl -s -b $C "$B/api/media/fetch?u=notaurl")"
check "and asks for one when it's missing" 'url-required' \
  "$(curl -s -b $C "$B/api/media/fetch")"
check "delete needs auth" 'unauthorised' "$(curl -s -X DELETE "$B/api/media/$KEY")"
check "delete"            '"deleted"' "$(curl -s -b $C -X DELETE "$B/api/media/$KEY")"

echo "── notion ─────────────────────────────"
check "status needs auth" 'unauthorised' "$(curl -s $B/api/notion/status)"
# Without NOTION_TOKEN the whole feature reports itself absent rather
# than half-working, which is what hides the Studio's button.
check "status answers even when unconfigured" '"configured":' \
  "$(curl -s -b $C $B/api/notion/status)"
NOTION_ON=$(curl -s -b $C $B/api/notion/status | grep -o '"configured":true')
if [[ -z "$NOTION_ON" ]]; then
  check "unconfigured Notion is 503, not an error" 'not-configured' \
    "$(curl -s -b $C $B/api/notion/pages)"
  check "and so is the sync the Cron trigger runs" 'not-configured' \
    "$(curl -s -b $C -X POST $B/api/notion/sync)"
  echo "  --   live Notion checks skipped (no NOTION_TOKEN)"
else
  check "the asset proxy needs auth" 'unauthorised' \
    "$(curl -s "$B/api/notion/asset?u=https://example.com/x.png")"
  # An open image proxy on someone else's domain is a gift to
  # whoever finds it.
  check "the proxy refuses a host that isn't Notion's" 'host-not-allowed' \
    "$(curl -s -b $C "$B/api/notion/asset?u=https%3A%2F%2Fevil.example.com%2Fx.png")"
  check "the proxy refuses a non-URL" 'bad-url' \
    "$(curl -s -b $C "$B/api/notion/asset?u=notaurl")"
  check "a junk page id is refused" 'bad-page-id' \
    "$(curl -s -b $C $B/api/notion/pages/nonsense)"
fi

RUN=$(date +%s)
echo "── questions ──────────────────────────"
check "ask"              '"queued":true' \
  "$(curl -s -X POST -H "$J" -d '{"slug":"sanchayapatra-vs-fdr","name":"Rumi","body":"Run '"$RUN"'– does the tax at source apply to the 5-year certificate too?"}' $B/api/questions)"
# The bot still hears success: it has nothing to learn from the reply.
check "honeypot swallowed" '"queued":true' \
  "$(curl -s -X POST -H "$J" -d '{"body":"buy cheap watches now click here","website":"http://spam"}' $B/api/questions)"
# …but the question is quarantined rather than destroyed. It used to be
# dropped on the floor, so a reader whose password manager filled the
# hidden field was told "Got it" and lost the question with no record.
check "and quarantined rather than destroyed" 'buy cheap watches' \
  "$(curl -s -b $C "$B/api/questions?status=spam")"
check "too short"        'too-short' \
  "$(curl -s -X POST -H "$J" -d '{"body":"hi"}' $B/api/questions)"
check "not public yet"   'clean' \
  "$(curl -s "$B/api/questions?slug=sanchayapatra-vs-fdr" | grep -q "Run $RUN" && echo leaked || echo clean)"
check "queue needs auth" 'unauthorised' "$(curl -s "$B/api/questions?status=pending")"
check "queue"            "Run $RUN" "$(curl -s -b $C "$B/api/questions?status=pending")"
# Archived and spam used to be unreachable: the desk asked only for
# pending and published, so a button labelled "Not spam, just private"
# removed a question from the interface permanently.
check "every status is reachable at once" 'buy cheap watches' \
  "$(curl -s -b $C "$B/api/questions?status=all")"
check "counts come back per status" '"spam":' \
  "$(curl -s -b $C "$B/api/questions?status=all")"
check "the queue is searchable" 'buy cheap watches' \
  "$(curl -s -b $C "$B/api/questions?status=all&q=cheap%20watches")"
check "a search matching nothing says so" '"questions":[]' \
  "$(curl -s -b $C "$B/api/questions?status=all&q=zzzznothingmatches")"
check "searching still needs auth" 'unauthorised' \
  "$(curl -s "$B/api/questions?status=all&q=cheap")"
QID=$(curl -s -b $C "$B/api/questions?status=pending" | python3 -c 'import sys,json;print(json.load(sys.stdin)["questions"][-1]["id"])')
check "answer+publish"   '"status":"published"' \
  "$(curl -s -b $C -X PATCH -H "$J" -d '{"answer":"Yes, 10% at source on the profit, deducted before it reaches you.","status":"published"}' $B/api/questions/$QID)"
check "now public"       'deducted before' "$(curl -s "$B/api/questions?slug=sanchayapatra-vs-fdr")"
check "email not public" 'clean' \
  "$(curl -s "$B/api/questions?slug=sanchayapatra-vs-fdr" | grep -qc '"email"' && echo leaked || echo clean)"

echo "── subscribers ────────────────────────"
check "bad email"        'bad-email' \
  "$(curl -s -X POST -H "$J" -d '{"email":"not-an-email"}' $B/api/subscribers)"
SUB=$(curl -s -X POST -H "$J" -d '{"email":"reader@example.com","source":"insights"}' $B/api/subscribers)
check "signup pending"   '"pending":true' "$SUB"
TOK=$(echo "$SUB" | python3 -c 'import sys,json;print(json.load(sys.stdin)["confirmUrl"].split("t=")[1])')
check "list needs auth"  'unauthorised' "$(curl -s $B/api/subscribers)"
check "confirm page"     "You're on the list" "$(curl -s "$B/api/subscribers/confirm?t=$TOK")"
check "counted"          '"confirmed":' "$(curl -s -b $C $B/api/subscribers)"
check "unsubscribe"      'Unsubscribed' "$(curl -s "$B/api/subscribers/remove?t=$TOK")"
check "csv"              'reader@example.com' "$(curl -s -b $C $B/api/subscribers/export)"

echo "── enquiries ──────────────────────────"
check "send"             '"received":true' \
  "$(curl -s -X POST -H "$J" -d '{"name":"A Client","email":"client@example.com","kind":"project","message":"We need a three-statement model for a Series A raise."}' $B/api/enquiries)"
check "pipeline needs auth" 'unauthorised' "$(curl -s $B/api/enquiries)"
check "pipeline"         'three-statement' "$(curl -s -b $C $B/api/enquiries)"
EID=$(curl -s -b $C $B/api/enquiries | python3 -c 'import sys,json;print(json.load(sys.stdin)["enquiries"][0]["id"])')
check "mark replied"     '"status":"replied"' \
  "$(curl -s -b $C -X PATCH -H "$J" -d '{"status":"replied","notes":"Quoted, awaiting go-ahead"}' $B/api/enquiries/$EID)"

echo "── signals ────────────────────────────"
check "view counted"     '"counted":true' \
  "$(curl -s -X POST -H "$J" -d '{"path":"/insights/sanchayapatra-vs-fdr.html"}' $B/api/signals/view)"
check "junk path"        '"counted":false' \
  "$(curl -s -X POST -H "$J" -d '{"path":"https://evil.example.com"}' $B/api/signals/view)"
check "react"            '"helpful":' \
  "$(curl -s -X POST -H "$J" -d '{"slug":"sanchayapatra-vs-fdr","kind":"helpful"}' $B/api/signals/react)"
check "bad reaction"     'bad-reaction' \
  "$(curl -s -X POST -H "$J" -d '{"slug":"x","kind":"nonsense"}' $B/api/signals/react)"
check "stats need auth"  'unauthorised' "$(curl -s $B/api/signals/stats)"
check "stats"            'sanchayapatra' "$(curl -s -b $C $B/api/signals/stats)"

echo "── feed & sitemap ─────────────────────"
# Both are generated from content.js, which cannot see an article
# published to the database, so a piece from the Studio was live,
# readable, and in neither. That is what the "index entry" button was
# for, and it could never work for an article the Worker publishes.
check "the feed carries a database article" 'sanchayapatra-vs-fdr' \
  "$(curl -s $B/feed.xml)"
check "and still carries the file-based ones" 'dse-basics' \
  "$(curl -s $B/feed.xml)"
check "the feed is served as RSS" 'application/rss+xml' \
  "$(curl -s -o /dev/null -D - $B/feed.xml | tr -d '\r')"
check "nothing is listed twice" '1' \
  "$(curl -s $B/feed.xml | grep -c 'insights/sanchayapatra-vs-fdr.html</link>')"
check "the sitemap carries it too" 'sanchayapatra-vs-fdr' \
  "$(curl -s $B/sitemap.xml)"
check "and the sitemap stays valid XML" '</urlset>' \
  "$(curl -s $B/sitemap.xml)"
# A draft must not be advertised anywhere.
check "a draft is in neither" 'absent' \
  "$(curl -s -b $C -X POST -H "$J" -d '{"slug":"quiet-draft","title":"Quiet","status":"draft","overwrite":true,"body":"<p>x</p>"}' $B/api/articles >/dev/null; \
     curl -s $B/feed.xml $B/sitemap.xml | grep -q 'quiet-draft' && echo listed || echo absent)"
curl -s -b $C -X DELETE $B/api/articles/quiet-draft > /dev/null

echo "── search ─────────────────────────────"
check "finds body text"  'Tax at source' "$(curl -s "$B/api/search?q=tax%20at%20source")"
check "short query"      '"results":[]' "$(curl -s "$B/api/search?q=a")"

echo "── logout ─────────────────────────────"
check "logout"           '"signedIn":false' "$(curl -s -b $C -c $C -X POST $B/api/auth/logout)"
check "really out"       'unauthorised' "$(curl -s -b $C $B/api/enquiries)"

echo
echo "$pass passed, $fail failed"
exit $((fail > 0))
