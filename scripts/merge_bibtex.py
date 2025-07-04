"""Merge BibTeX files into literature.json.

Usage: python scripts/merge_bibtex.py path/to/file.bib
"""
import json
import sys
from pathlib import Path

import bibtexparser
import re


def norm(text: str) -> str:
    return (text or "").strip().lower()


def doi_norm(url: str) -> str:
    if not url:
        return ""
    url = url.lower()
    for prefix in ("https://doi.org/", "http://doi.org/", "https://dx.doi.org/", "http://dx.doi.org/"):
        if url.startswith(prefix):
            return url[len(prefix):]
    return url


def get_field(entry: dict, name: str):
    if name in entry:
        return entry[name]
    lower = name.lower()
    for k, v in entry.items():
        if k.lower() == lower:
            return v
    return None


def load_literature(path: Path):
    if path.exists():
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    return []


def parse_bibtex(path: Path):
    with path.open("r", encoding="utf-8") as f:
        bib_db = bibtexparser.load(f)
    return bib_db.entries


def merge_entries(entries, data):
    by_title = {norm(item.get("title")): item for item in data}
    by_doi = {doi_norm(item.get("url")): item for item in data if item.get("url")}
    added = 0
    for entry in entries:
        title = entry.get("title", "")
        doi_value = get_field(entry, "doi")
        url = entry.get("url") or get_field(entry, "URL") or (doi_value and f"https://doi.org/{doi_value}") or ""
        t_key = norm(title)
        d_key = doi_norm(url)
        if t_key in by_title or (d_key and d_key in by_doi):
            continue
        raw_authors = entry.get("authors") or entry.get("author", "")
        if raw_authors:
            authors = [a.strip() for a in re.split(r"\s+and\s+|,", raw_authors) if a.strip()]
        else:
            authors = []

        obj = {
            "title": title,
            "authors": authors,
            "year": int(entry.get("year")) if entry.get("year", "").isdigit() else entry.get("year"),
            "journal": entry.get("journal") or entry.get("booktitle", ""),
            "publisher": entry.get("publisher", ""),
            "volume": entry.get("volume", ""),
            "number": entry.get("number", ""),
            "pages": entry.get("pages", ""),
            "url": url,
            "entry_type": entry.get("ENTRYTYPE") or entry.get("entrytype") or ("article" if entry.get("journal") else "book"),
            "construct": "",
            "axis": "",
            "relevance": ""
        }
        data.append(obj)
        by_title[t_key] = obj
        if d_key:
            by_doi[d_key] = obj
        added += 1
    return added


def main(bib_path: str):
    bib_file = Path(bib_path)
    if not bib_file.exists():
        print(f"File not found: {bib_file}")
        return 1
    data_path = Path("data/literature.json")
    docs_path = Path("docs/data/literature.json")
    data = load_literature(data_path)
    entries = parse_bibtex(bib_file)
    added = merge_entries(entries, data)
    if added:
        for path in (data_path, docs_path):
            path.parent.mkdir(parents=True, exist_ok=True)
            with path.open("w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Added {added} new entr{'y' if added==1 else 'ies'}.")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python scripts/merge_bibtex.py path/to/file.bib")
        sys.exit(1)
    sys.exit(main(sys.argv[1]))

