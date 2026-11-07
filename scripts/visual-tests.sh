#!/bin/sh
# Runs the screenshot tests inside the same pinned Playwright image CI uses, so
# baselines match. Needs Postgres from `docker compose up -d postgres`.
# Pass --update-snapshots to regenerate the baselines.
set -e
cd "$(dirname "$0")/.."
PLAYWRIGHT_VERSION=$(node -p "require('@playwright/test/package.json').version")

docker run --rm \
  -v "$PWD":/work -v /work/node_modules -w /work \
  --network post-stream_default \
  -e DB_HOST=postgres -e VISUAL=1 \
  "mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble" \
  sh -c "npm ci --no-audit --no-fund && npx playwright test --project=visual --project=visual-phone $*"
