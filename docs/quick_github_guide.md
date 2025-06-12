---
layout: default
title: Research Hub Contribution Guide
---

# Research Hub Contribution Guide

This guide shows how to contribute to the AI EQ Research Hub using the GitHub interface and our collaborative Overleaf project. You can participate without installing any software.

If you are unfamiliar with terms like "construct" or "axis," check the [Glossary](glossary.md).

## 1. Use the GitHub Pages interface

1. Visit <https://maxaeon.github.io/EQ-bench/>.
2. Click the **Login** button at the top right (or **Logout** when finished) and use the **Add Source** or **Add Construct** buttons to open the submission form.
3. Fill in the requested details—be sure to provide at least one of the supported axes, a related construct, or the methodology it informs—and choose an **entry type** (article, book, etc.). You can also tag the reference with a short **type** label like `definition` or `methodology` before clicking **Save**. Use the **Add another author** button to list each author separately (up to ten).
4. On the **Phase&nbsp;1** page you can upload your own `.bib` file or paste BibTeX text after logging in. The imported entries are stored in Supabase automatically.

## 2. Convert references to BibTeX

When filling out a literature issue or sharing your own bibliography, convert each reference to a standard BibTeX entry. A quick way is to paste the DOI into an online converter such as [bibtex.com](https://www.bibtex.com/c/doi-to-bibtex-converter/). Copy the generated BibTeX text into a `.bib` file or the issue form.

## 3. Importing and exporting `.bib` files

While logged in, you can upload a local `.bib` file or paste a BibTeX snippet on the **Phase&nbsp;1** page to quickly populate the submission form. If a record contains a `doi` field it is automatically converted to a `url` pointing at `https://doi.org/`. After importing, the site prompts you for any missing construct, axis, or methodology fields. Exported BibTeX files omit these extra fields so they remain compatible with standard reference managers. Maintainers can also run `python scripts/export_bibtex.py references.bib` to export the curated data directly from the JSON files.

## 4. Edit the literature review in Overleaf

1. On the Research Hub website, follow the link labeled "Access the collaborative Overleaf document."
2. Overleaf opens in Visual mode, so you can edit without knowing LaTeX.
3. Add your references or comments and press **Save**. Your changes are stored in the shared project.

## 5. Optional: Edit files on GitHub

1. Browse to any Markdown file in this repository.
2. Click the **pencil** icon to open GitHub's editor.
3. Enter your edits and give a short commit message.
4. After saving, GitHub will prompt you to open a pull request.

A maintainer will review your submission and merge it when ready. Thanks for helping improve the Research Hub!
