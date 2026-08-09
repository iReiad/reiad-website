#!/usr/bin/env bash
# ============================================================
# setup.sh — turn on the dynamic half of the site.
#
#     ./setup.sh
#
# Everything below needs YOUR Cloudflare account, which is the
# one part nobody can do on your behalf. It's three commands and
# about three minutes, and until you run it the site works
# exactly as it does today — every dynamic feature checks for the
# database and quietly falls back if it isn't there.
# ============================================================
set -euo pipefail

echo "→ 1/5  Signing in to Cloudflare (a browser window will open)"
npx wrangler login

echo
echo "→ 2/5  Creating the database"
npx wrangler d1 create reiad || echo "   (already exists — carrying on)"

echo
echo "   Now edit wrangler.toml:"
echo "     1. uncomment the four [[d1_databases]] lines (remove the leading '# ')"
echo "     2. replace PASTE_THE_ID_FROM_wrangler_d1_create_HERE with the"
echo "        database_id printed just above"
echo
echo "   Press Enter when that is saved."
read -r _

if grep -q "^# \[\[d1_databases\]\]" wrangler.toml; then
  echo "   ! The [[d1_databases]] block still looks commented out."
  echo "     Uncomment it and run ./setup.sh again."
  exit 1
fi
if grep -q "PASTE_THE_ID" wrangler.toml; then
  echo "   ! wrangler.toml still has the placeholder id in it."
  echo "     Paste the real database_id and run ./setup.sh again."
  exit 1
fi

echo
echo "→ 3/5  Creating the tables"
npx wrangler d1 execute reiad --remote --file=aab/schema.sql

echo
echo "→ 4/5  Creating the photo bucket"
# Article photos live in R2 rather than inside the article body. The
# bucket is declared in wrangler.toml, so deploying without it stops
# with an error rather than quietly working — hence creating it here.
npx wrangler r2 bucket create reiad-media || echo "   (already exists — carrying on)"

echo
echo "→ 5/5  Deploying"
npx wrangler deploy

cat <<'DONE'

Done. Two things left, both in a browser:

  1. Open https://reiad.co.uk/studio.html and set your passphrase.
     It's stretched in your browser and never sent — the server only
     stores a hash of the result.

  2. Optional: Cloudflare dashboard → your Worker → Settings →
     Bindings → Add → Workers AI → variable name: AI
     That switches Bangla headline translation back on.

  3. Optional: write in Notion instead of the Studio's editor.
     Create an integration at https://notion.so/my-integrations,
     copy its token, then:

         npx wrangler secret put NOTION_TOKEN

     Open the page or database you write in, Connections → add the
     integration, and the Studio grows an "Import from Notion"
     button. Without the token the button never appears.

Then: writing a piece in the Studio and pressing "Publish to the site"
puts it live immediately. No commit, no push, no file to move.
DONE
