"""Convert JSON data to CSV format for Supabase bulk import.

Usage:
    python scripts/json_to_csv.py [input.json [output.csv]]

When run without arguments, the script converts `data/construct_submissions.json`
and `data/literature.json` to `data/construct_submissions.csv` and
`data/literature.csv` respectively.
"""

import csv
import json
import sys
from pathlib import Path
from typing import Iterable


def json_to_csv(json_path: Path, csv_path: Path) -> None:
    """Write the contents of *json_path* (a list of objects) to *csv_path*."""
    if not json_path.exists():
        print(f"File not found: {json_path}")
        return

    with json_path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise ValueError(f"Expected an array in {json_path}")

    # gather all unique field names in order of first appearance
    fieldnames: list[str] = []
    for item in data:
        if isinstance(item, dict):
            for key in item.keys():
                if key not in fieldnames:
                    fieldnames.append(key)

    csv_path.parent.mkdir(parents=True, exist_ok=True)
    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for item in data:
            row = {
                key: json.dumps(value, ensure_ascii=False)
                if isinstance(value, list)
                else value
                for key, value in item.items()
            }
            writer.writerow(row)
    print(f"Wrote {csv_path}")


def main(args: Iterable[str]) -> int:
    if not args:
        pairs = [
            (Path("data/construct_submissions.json"), Path("data/construct_submissions.csv")),
            (Path("data/literature.json"), Path("data/literature.csv")),
        ]
    elif len(args) == 1:
        in_path = Path(args[0])
        out_path = in_path.with_suffix(".csv")
        pairs = [(in_path, out_path)]
    elif len(args) == 2:
        pairs = [(Path(args[0]), Path(args[1]))]
    else:
        print("Usage: python scripts/json_to_csv.py [input.json [output.csv]]")
        return 1

    for j, c in pairs:
        json_to_csv(j, c)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
