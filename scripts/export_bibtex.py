"""Export literature.json to a BibTeX file.

Usage:
    python scripts/export_bibtex.py [output.bib]

Reads entries from ``data/literature.json`` and writes a consolidated
BibTeX file. If *output.bib* is not provided, ``references.bib`` is
created in the current directory.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path


def to_bibtex(item: dict) -> str:
    """Return a BibTeX entry string for *item* using the website mapping."""
    entry_type = "article" if item.get("journal") else "book"
    authors = item.get("authors") or "ref"
    key_author = authors.split()[0].split(",")[0]
    key_author = "".join(ch for ch in key_author if ch.isalnum()) or "ref"
    key = f"{key_author}{item.get('year', '')}"

    entry = f"@{entry_type}{{{key},\n  title = {{{item.get('title')}}}"
    if item.get("authors"):
        entry += f",\n  author = {{{item['authors']}}}"
    if item.get("journal"):
        entry += f",\n  journal = {{{item['journal']}}}"
    if item.get("publisher"):
        entry += f",\n  publisher = {{{item['publisher']}}}"
    if item.get("address"):
        entry += f",\n  address = {{{item['address']}}}"
    if item.get("volume"):
        entry += f",\n  volume = {{{item['volume']}}}"
    if item.get("number"):
        entry += f",\n  number = {{{item['number']}}}"
    if item.get("pages"):
        entry += f",\n  pages = {{{item['pages']}}}"
    if item.get("year"):
        entry += f",\n  year = {{{item['year']}}}"
    if item.get("url"):
        entry += f",\n  url = {{{item['url']}}}"
    if item.get("construct"):
        entry += f",\n  sera-construct = {{{item['construct']}}}"
    if item.get("axis"):
        entry += f",\n  sera-axis = {{{item['axis']}}}"
    keywords = item.get("keywords")
    if keywords:
        kw = ", ".join(keywords) if isinstance(keywords, list) else str(keywords)
        entry += f",\n  keywords = {{{kw}}}"
    if item.get("relevance"):
        entry += f",\n  note = {{{item['relevance']}}}"
    entry += "\n}"
    return entry


def main(out_path: str) -> int:
    data_path = Path("data/literature.json")
    if not data_path.exists():
        print(f"File not found: {data_path}")
        return 1
    with data_path.open("r", encoding="utf-8") as f:
        items = json.load(f)
    entries = [to_bibtex(item) for item in items if isinstance(item, dict)]
    out_file = Path(out_path)
    out_file.write_text("\n\n".join(entries), encoding="utf-8")
    print(f"Wrote {out_file}")
    return 0


if __name__ == "__main__":
    if len(sys.argv) > 2:
        print("Usage: python scripts/export_bibtex.py [output.bib]")
        sys.exit(1)
    output = sys.argv[1] if len(sys.argv) == 2 else "references.bib"
    sys.exit(main(output))
