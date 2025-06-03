---
layout: default
title: Research Hub Contribution Guide
---

# Research Hub Contribution Guide

This guide shows how to contribute to the EQ AI Research Hub using the GitHub interface and our collaborative Overleaf project. You can participate without installing any software.

If you are unfamiliar with terms like "construct" or "axis," check the [Glossary](glossary.md).

## 1. Use the GitHub Pages interface

1. Visit <https://maxaeon.github.io/EQ-bench/>.
2. Log in when prompted and use the **Add Source** or **Add Construct** buttons to open the submission form.
3. Fill in the requested details—be sure to provide at least one of the supported axes, a related construct, or the methodology it informs—and click **Save** to store the entry in Supabase. Use the **Add another author** button to list each author separately (up to ten).
4. On the **Phase&nbsp;1** page you can still upload your own `.bib` file for convenience. If you are logged in, the imported entries will be stored in Supabase automatically; otherwise they remain local until saved.

## 2. Convert references to BibTeX

When filling out a literature issue or sharing your own bibliography, convert each reference to a standard BibTeX entry. A quick way is to paste the DOI into an online converter such as [bibtex.com](https://www.bibtex.com/c/doi-to-bibtex-converter/). Copy the generated BibTeX text into a `.bib` file or the issue form.

## 3. Importing and exporting `.bib` files

On the **Phase&nbsp;1** page you can upload a local `.bib` file to quickly populate the submission form. Entries are parsed and stored with custom fields such as `sera-axis` and `sera-construct` to capture the construct name and axis. After editing, click **Export BibTeX** to download the selected entries with these tags preserved. Maintainers can also run `python scripts/export_bibtex.py references.bib` to export the same data directly from the JSON files.

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
