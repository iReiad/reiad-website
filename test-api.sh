#!/bin/bash
# End-to-end exercise of every endpoint against the real Cloudflare runtime.
B=http://127.0.0.1:8790
J='Content-Type: application/json'
C=/tmp/claude-0/-home-user-reiad-website/1961c87d-d619-531a-a6b0-6ffce0aed95e/scratchpad/jar.txt
rm -f $C
pass=0; fail=0
check() { # name expected_substring actual
  if [[ "$3" == *"$2"* ]]; then echo "  ok   $1"; pass=$((pass+1));
  else echo "  FAIL $1"; echo "       want ~ $2"; echo "       got    ${3:0:200}"; fail=$((fail+1)); fi
}

echo "── auth ───────────────────────────────"
# The suite is idempotent: on a fresh database it exercises setup, and
# on one that already has a password it signs in instead.
CONFIGURED=$(curl -s $B/api/auth/me | grep -o '"configured":[a-z]*' | cut -d: -f2)
if [[ "$CONFIGURED" == "false" ]]; then
  check "setup rejects short pw" 'password-too-short' \
    "$(curl -s -X POST -H "$J" -d '{"password":"short"}' $B/api/auth/setup)"
  check "setup"         '"signedIn":true' \
    "$(curl -s -c $C -X POST -H "$J" -d '{"password":"a properly long passphrase"}' $B/api/auth/setup)"
else
  echo "  --   fresh-database checks skipped (already configured)"
  curl -s -c $C -X POST -H "$J" -d '{"password":"a properly long passphrase"}' $B/api/auth/login > /dev/null
fi
check "setup is one-shot" 'already-configured' \
  "$(curl -s -X POST -H "$J" -d '{"password":"another long passphrase"}' $B/api/auth/setup)"
check "session works"   '"signedIn":true' "$(curl -s -b $C $B/api/auth/me)"
check "no cookie = out"  '"signedIn":false' "$(curl -s $B/api/auth/me)"
check "bad password"    'bad-password' \
  "$(curl -s -X POST -H "$J" -d '{"password":"wrong wrong wrong"}' $B/api/auth/login)"
check "good password"   '"signedIn":true' \
  "$(curl -s -c $C -X POST -H "$J" -d '{"password":"a properly long passphrase"}' $B/api/auth/login)"

echo "── articles ───────────────────────────"
check "write needs auth" 'unauthorised' \
  "$(curl -s -X POST -H "$J" -d '{"slug":"x","title":"x"}' $B/api/articles)"
check "publish" '"slug":"sanchayapatra-vs-fdr"' \
  "$(curl -s -b $C -X POST -H "$J" -d '{
      "slug":"sanchayapatra-vs-fdr",
      "title":"Sanchayapatra vs bank FDR",
      "dek":"Where a saver'"'"'s taka works harder.",
      "tag":"Comparison · Savings","topics":["Savings","Beginner"],
      "status":"live",
      "body":"<h2>The rates</h2><p>Gross rates are <strong>not</strong> what you receive.</p><script>alert(1)</script><p onclick=\"evil()\">Tax at source comes off first.</p><a href=\"javascript:evil()\">bad</a>"
    }' $B/api/articles)"
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
check "delete"           '"deleted"' "$(curl -s -b $C -X DELETE $B/api/articles/secret-draft)"

RUN=$(date +%s)
echo "── questions ──────────────────────────"
check "ask"              '"queued":true' \
  "$(curl -s -X POST -H "$J" -d '{"slug":"sanchayapatra-vs-fdr","name":"Rumi","body":"Run '"$RUN"' — does the tax at source apply to the 5-year certificate too?"}' $B/api/questions)"
check "honeypot swallowed" '"queued":true' \
  "$(curl -s -X POST -H "$J" -d '{"body":"buy cheap watches now click here","website":"http://spam"}' $B/api/questions)"
check "too short"        'too-short' \
  "$(curl -s -X POST -H "$J" -d '{"body":"hi"}' $B/api/questions)"
check "not public yet"   'clean' \
  "$(curl -s "$B/api/questions?slug=sanchayapatra-vs-fdr" | grep -q "Run $RUN" && echo leaked || echo clean)"
check "queue needs auth" 'unauthorised' "$(curl -s "$B/api/questions?status=pending")"
check "queue"            "Run $RUN" "$(curl -s -b $C "$B/api/questions?status=pending")"
QID=$(curl -s -b $C "$B/api/questions?status=pending" | python3 -c 'import sys,json;print(json.load(sys.stdin)["questions"][-1]["id"])')
check "answer+publish"   '"status":"published"' \
  "$(curl -s -b $C -X PATCH -H "$J" -d '{"answer":"Yes — 10% at source on the profit, deducted before it reaches you.","status":"published"}' $B/api/questions/$QID)"
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

echo "── search ─────────────────────────────"
check "finds body text"  'Tax at source' "$(curl -s "$B/api/search?q=tax%20at%20source")"
check "short query"      '"results":[]' "$(curl -s "$B/api/search?q=a")"

echo "── logout ─────────────────────────────"
check "logout"           '"signedIn":false' "$(curl -s -b $C -c $C -X POST $B/api/auth/logout)"
check "really out"       'unauthorised' "$(curl -s -b $C $B/api/enquiries)"

echo
echo "$pass passed, $fail failed"
exit $((fail > 0))
