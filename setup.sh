#!/usr/bin/env bash
# ============================================================
# setup.sh — see SETUP.md instead.
#
# This used to edit wrangler.toml and deploy from the command
# line. That turned out to break the build: a wrangler.toml in
# the repo root makes Cloudflare Pages run `wrangler deploy`
# (the Workers command) and fail, leaving the site on its
# previous version.
#
# So the production binding is a dashboard setting now, and
# SETUP.md walks through it — one screen, six clicks.
#
# What this script still does: set you up for local development.
# ============================================================
set -euo pipefail

if [ -f wrangler.toml ]; then
  echo "wrangler.toml already exists — leaving it alone."
else
  cp wrangler.example.toml wrangler.toml
  echo "Created wrangler.toml for local development (git ignores it)."
fi

cat <<'DONE'

Local development is ready:

    npx wrangler pages dev        # real Cloudflare runtime, local D1
    PORT=8788 ./test-api.sh       # 46 checks over every endpoint

For the live site, see SETUP.md — the D1 binding is added in the
Cloudflare dashboard, and takes about a minute.
DONE
