---
layout: default
title: Persisting Construct Submissions
---

# 📦 Persisting Construct Submissions

SERA-X collects community "construct" submissions using a GitHub issue template.
These issues contain short descriptions, measurement ideas, and references for
emotion-related constructs.

## Options considered

1. **External Database** – A workflow could push issue data into a hosted
   database (e.g. PostgreSQL or a managed service like Supabase). This would
   make querying easier but requires infrastructure and credentials.
2. **JSON file in-repo** – Export issues to a structured JSON file tracked under
   `data/`. This keeps everything versioned alongside the code and works with
   GitHub Pages without extra services.

## Current approach

Submissions are now stored in a small Supabase instance so that the website can
fetch constructs and literature entries dynamically. The GitHub Actions
workflows still export `data/construct_submissions.json` and
`data/literature.json` as static snapshots. These JSON files are mirrored under
`docs/data/` for GitHub Pages, but the source of truth is the Supabase project.

Each workflow step uploads the JSON contents using
`scripts/upload_to_supabase.js` with the credentials provided via repository
secrets. Construct records are inserted into the `constructs` table, while

literature entries go into the `literature` table. Uploads should omit the
`id` field so that Supabase can assign primary keys without conflicts.

### Configuration

The GitHub workflows require `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` secrets
for uploads. The public website reads the same database using the
`SUPABASE_URL` and `SUPABASE_ANON_KEY` variables injected at build time. See the
[GitHub documentation on encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
for how to configure these values. The deployment workflow inserts them into docs/env.js so that the website's CRUD functions can talk to Supabase.

Each record includes an `axes` field listing the relevant SERA skills
(e.g., `"sense, explain"`). Pages like `sense.html` filter constructs by reading
this field via `docs/script.js`. If an older entry lacks `axes`, the script
falls back to searching the issue text.

Records may also include a `synonyms` array with alternate names or related
terms. The constructs page uses these values to make search more flexible.

This hybrid method keeps contributions transparent via the JSON snapshots while
allowing richer queries and edits through the Supabase backend.

## Removing entries

If a construct or reference turns out to be incorrect or should no longer be
listed, open a **Request deletion** issue using the appropriate template. A
repository maintainer must approve the request before any entry is removed from
the JSON files. This keeps the historical record intact and prevents accidental
loss of data.
