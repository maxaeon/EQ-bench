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

## Chosen approach

For the early prototype we use **option 2**. A GitHub Actions workflow runs on
issue events and periodically. It gathers all open issues labeled `construct` and
writes their content to `data/construct_submissions.json`. The same JSON is
also copied to `docs/construct_submissions.json` so the website can display the
latest submissions. Both files are committed back to the repository so changes
are visible in pull requests.

Each record includes an `axes` field listing the relevant SERA skills
(e.g., `"sense, explain"`). Pages like `sense.html` filter constructs by reading
this field via `docs/script.js`. If an older entry lacks `axes`, the script
falls back to searching the issue text.

Records may also include a `synonyms` array with alternate names or related
terms. The constructs page uses these values to make search more flexible.

This lightweight method keeps contributions transparent while avoiding the
maintenance burden of an external database. Future work may revisit a database
if query or scale needs grow.
