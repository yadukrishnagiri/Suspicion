#!/usr/bin/env python3
"""Compile the master Excel content sheet into the app's offline database."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import zipfile
from collections import Counter
from pathlib import Path
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "outputs" / "suspicion-content-rewrite" / "imposter_game_master_dataset_v5_relatable.xlsx"
DATABASE_OUTPUT = ROOT / "src" / "data" / "imposter_words.json"
MANIFEST_OUTPUT = ROOT / "src" / "data" / "content_manifest.json"
SHEET_NAME = "MASTER DATASET"

EXPECTED_HEADERS = (
    "ID",
    "Category",
    "Main Word",
    "Imposter Word",
    "Imposter Category",
    "Relationship Type",
    "Imposter Hint",
    "Difficulty",
    "Pair Group",
    "Pattern Risk",
    "Vocabulary Level",
)

FIELD_NAMES = {
    "ID": "id",
    "Category": "category",
    "Main Word": "mainWord",
    "Imposter Word": "imposterWord",
    "Imposter Category": "imposterCategory",
    "Relationship Type": "relationshipType",
    "Imposter Hint": "imposterHint",
    "Difficulty": "difficulty",
    "Pair Group": "pairGroup",
    "Pattern Risk": "patternRisk",
    "Vocabulary Level": "vocabularyLevel",
}

EXPECTED_CATEGORIES = (
    "Concepts & Weather",
    "Food & Drinks",
    "Animals & Nature",
    "Everyday Objects",
    "Places & Travel",
    "Sports & Activities",
    "Occupations",
    "Pop Culture & Media",
)

MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PACKAGE_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"


def column_index(cell_reference: str) -> int:
    letters = re.match(r"[A-Z]+", cell_reference)
    if not letters:
        raise ValueError(f"Invalid cell reference: {cell_reference}")
    result = 0
    for letter in letters.group(0):
        result = result * 26 + ord(letter) - ord("A") + 1
    return result - 1


def read_shared_strings(archive: zipfile.ZipFile) -> list[str]:
    try:
        root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    return ["".join(node.text or "" for node in item.iter(f"{{{MAIN_NS}}}t")) for item in root]


def find_sheet_path(archive: zipfile.ZipFile, sheet_name: str) -> str:
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    targets = {
        relationship.attrib["Id"]: relationship.attrib["Target"]
        for relationship in relationships.findall(f"{{{PACKAGE_REL_NS}}}Relationship")
    }
    for sheet in workbook.findall(f".//{{{MAIN_NS}}}sheet"):
        if sheet.attrib.get("name") == sheet_name:
            relationship_id = sheet.attrib[f"{{{REL_NS}}}id"]
            target = targets[relationship_id].replace("\\", "/").lstrip("/")
            return target if target.startswith("xl/") else f"xl/{target}"
    raise ValueError(f"Workbook does not contain a '{sheet_name}' sheet")


def read_cell(cell: ET.Element, shared_strings: list[str]) -> object:
    cell_type = cell.attrib.get("t")
    if cell_type == "inlineStr":
        return "".join(node.text or "" for node in cell.iter(f"{{{MAIN_NS}}}t"))
    value = cell.find(f"{{{MAIN_NS}}}v")
    if value is None or value.text is None:
        return None
    if cell_type == "s":
        return shared_strings[int(value.text)]
    if cell_type in {"str", "e"}:
        return value.text
    if cell_type == "b":
        return value.text == "1"
    number = float(value.text)
    return int(number) if number.is_integer() else number


def read_master_rows(source: Path) -> list[list[object]]:
    with zipfile.ZipFile(source) as archive:
        shared_strings = read_shared_strings(archive)
        sheet_path = find_sheet_path(archive, SHEET_NAME)
        sheet = ET.fromstring(archive.read(sheet_path))
        rows: list[list[object]] = []
        for row in sheet.findall(f".//{{{MAIN_NS}}}row"):
            values: list[object] = []
            for cell in row.findall(f"{{{MAIN_NS}}}c"):
                index = column_index(cell.attrib["r"])
                while len(values) <= index:
                    values.append(None)
                values[index] = read_cell(cell, shared_strings)
            rows.append(values)
        return rows


def compile_database(source: Path) -> tuple[list[dict[str, object]], dict[str, object]]:
    rows = read_master_rows(source)
    if not rows:
        raise ValueError("The master dataset is empty")

    headers = tuple(str(value).strip() if value is not None else "" for value in rows[0][: len(EXPECTED_HEADERS)])
    if headers != EXPECTED_HEADERS:
        raise ValueError(f"Unexpected headers: {headers}")

    records: list[dict[str, object]] = []
    for row_number, row in enumerate(rows[1:], start=2):
        padded = row + [None] * (len(EXPECTED_HEADERS) - len(row))
        if not any(value is not None and str(value).strip() for value in padded[: len(EXPECTED_HEADERS)]):
            continue
        record: dict[str, object] = {}
        for header, value in zip(EXPECTED_HEADERS, padded):
            field = FIELD_NAMES[header]
            if field in {"id", "pairGroup"}:
                if not isinstance(value, (int, float)) or int(value) != value:
                    raise ValueError(f"Row {row_number}: {header} must be an integer")
                record[field] = int(value)
            else:
                text = "" if value is None else str(value).strip()
                if not text:
                    raise ValueError(f"Row {row_number}: {header} is required")
                record[field] = text
        records.append(record)

    ids = [record["id"] for record in records]
    pairs = [(record["mainWord"], record["imposterWord"]) for record in records]
    if len(ids) != len(set(ids)):
        raise ValueError("ID values must be unique")
    if len(pairs) != len(set(pairs)):
        raise ValueError("Main/imposter word pairs must be unique")

    category_counts = Counter(str(record["category"]) for record in records)
    if set(category_counts) != set(EXPECTED_CATEGORIES):
        raise ValueError(f"Unexpected category set: {sorted(category_counts)}")
    if any(count == 0 for count in category_counts.values()):
        raise ValueError("Every category must contain at least one record")

    manifest = {
        "sourceFile": source.relative_to(ROOT).as_posix(),
        "sourceSheet": SHEET_NAME,
        "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "recordCount": len(records),
        "categoryCounts": {category: category_counts[category] for category in EXPECTED_CATEGORIES},
    }
    return records, manifest


def serialized(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Fail when generated app data is stale")
    parser.add_argument("--source", type=Path, default=SOURCE, help="Path to the source workbook")
    args = parser.parse_args()

    source = args.source.resolve()
    if not source.exists():
        raise FileNotFoundError(source)

    records, manifest = compile_database(source)
    expected = {
        DATABASE_OUTPUT: serialized(records),
        MANIFEST_OUTPUT: serialized(manifest),
    }

    if args.check:
        stale = [path for path, content in expected.items() if not path.exists() or path.read_text(encoding="utf-8") != content]
        if stale:
            print("Content database is stale:", file=sys.stderr)
            for path in stale:
                print(f"  {path.relative_to(ROOT)}", file=sys.stderr)
            return 1
    else:
        for path, content in expected.items():
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8", newline="\n")

    print(f"Validated {len(records)} records across {len(manifest['categoryCounts'])} categories.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (FileNotFoundError, ValueError, zipfile.BadZipFile) as error:
        print(f"Content sync failed: {error}", file=sys.stderr)
        raise SystemExit(1)
