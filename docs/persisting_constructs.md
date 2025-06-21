---
layout: default
title: Persisting Construct Submissions
---

# 📦 Persisting Construct Submissions

SERA-X collects community "construct" submissions using a GitHub issue template.
These issues contain short descriptions, measurement ideas, and references for
emotion-related constructs.

## Options considered

1. **External Database** – A workflow can push issue data into a hosted
   database (e.g., PostgreSQL or any managed service). This allows flexible
   querying but requires infrastructure and credentials.
2. **JSON file in-repo** – Export issues to a structured JSON file tracked under
   `data/`. This keeps everything versioned alongside the code and works with
   GitHub Pages without extra services.

## Current approach

Submissions are stored in a small external database so that the website can
fetch constructs and literature entries dynamically. The GitHub Actions
workflows still export `data/construct_submissions.json` and
`data/literature.json` as static snapshots. These JSON files are mirrored under
`docs/data/` for GitHub Pages, but the source of truth is the hosted database.

Each workflow step can upload the JSON contents using a helper script with the
credentials provided via repository secrets. Construct records are inserted into
the `constructs` table, while literature entries go into the `literature`
table. Uploads should omit the `id` field so the database can assign primary
keys without conflicts.

### Configuration

Set environment variables for the database URL and a service key before running
the upload script. The public website reads the same database using a separate
read-only key injected at build time. See the
[GitHub documentation on encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
for how to configure these values. The deployment workflow inserts them into
`docs/env.js` so that the website's CRUD functions can talk to the database.

Each record includes an `axes` field listing the relevant SERA skills
(e.g., `"sense, explain"`). Pages like `sense.html` filter constructs by reading
this field via `docs/script.js`. If an older entry lacks `axes`, the script
falls back to searching the issue text.

Records may also include a `synonyms` array with alternate names or related
terms. The constructs page uses these values to make search more flexible.

Construct submissions can reference supporting papers using the `references`
field. This is an array of literature IDs (or titles) chosen from the existing
entries in the database. When adding a new construct via the website, the form
presents a multi-select dropdown populated with literature titles. Select the
relevant sources or leave it blank. If a needed reference is missing, add it to
the literature table first so it appears in the list.

This hybrid method keeps contributions transparent via the JSON snapshots while
allowing richer queries and edits through the database backend.

## Removing entries

If a construct or reference turns out to be incorrect or should no longer be
listed, open a **Request deletion** issue using the appropriate template. A
repository maintainer must approve the request before any entry is removed from
the JSON files. This keeps the historical record intact and prevents accidental
loss of data.
