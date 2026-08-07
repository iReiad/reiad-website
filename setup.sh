#!/usr/bin/env bash
# ============================================================
# setup.sh — there is nothing left to set up.
#
# The D1 binding lives in wrangler.toml and the tables create
# themselves on first use, so deploying is the whole install.
# See SETUP.md.
#
# This script just runs the local checks.
# ============================================================
set -euo pipefail

echo "→ routes"
node aab/check-routes.mjs

echo
echo "→ start the real runtime with:  npx wrangler dev"
echo "→ then run the API suite with:  PORT=8787 ./test-api.sh"
