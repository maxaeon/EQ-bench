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

Submissions are now stored directly in JSON files under `data/`. The GitHub Actions
workflows mirror these files to `docs/data/` for GitHub Pages, making the repository
the sole source of truth.

Supabase integration has been removed. Any updates should be committed to the JSON
files through pull requests.

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

This approach keeps contributions transparent via versioned JSON snapshots.

## Removing entries

If a construct or reference turns out to be incorrect or should no longer be
listed, open a **Request deletion** issue using the appropriate template. A
repository maintainer must approve the request before any entry is removed from
the JSON files. This keeps the historical record intact and prevents accidental
loss of data.
