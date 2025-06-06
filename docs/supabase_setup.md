---
layout: default
title: Supabase Setup
---

# Supabase Setup

This guide describes how to prepare your environment to seed the Supabase tables from the versioned JSON snapshots.

## Node requirements

- **Node.js** ≥18
- npm package: `node-fetch`

Install the package locally with npm:

```bash
node --version   # should be 18 or higher
npm install node-fetch
```

## Uploading snapshot data

Set your Supabase credentials in the shell and run the helper script:

```bash
export SUPABASE_URL="https://<project>.supabase.co"
export SUPABASE_SERVICE_KEY="<service role key>"
node scripts/upload_to_supabase.js
```

## Website environment variables

The website reads Supabase using a small `env.js` file generated at build time.
Set the following variables in your shell (or as repository secrets) so the
deployment workflow can create this file without storing credentials in the
repository:

```bash
export SUPABASE_URL="https://<project>.supabase.co"
export SUPABASE_ANON_KEY="<public anon key>"
```

The script reads `data/construct_submissions.json` and `data/literature.json` and inserts them into the `constructs` and `literature` tables. You can also pass a file and table name explicitly:

```bash
node scripts/upload_to_supabase.js path/to/file.json table_name
```
