#!/usr/bin/env python3
"""Basic checks for jamesashwood.com before deploying.

- every internal href resolves to a file or directory index
- every HTML page has a title and exactly one h1
- ids are unique per page
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HREF = re.compile(r'href="([^"]+)"')
TITLE = re.compile(r"<title>(.*?)</title>", re.S)
ID = re.compile(r'\bid="([^"]+)"')


def target_for(source: Path, href: str) -> Path | None:
    path = href.split("#", 1)[0].split("?", 1)[0]
    if not path:
        return None
    if path.startswith("/"):
        target = ROOT / path.lstrip("/")
    else:
        target = source.parent / path
    if path.endswith("/"):
        target = target / "index.html"
    return target


def main() -> int:
    errors: list[str] = []
    pages = sorted(ROOT.rglob("*.html"))
    if not pages:
        print("no HTML files found")
        return 1

    for page in pages:
        rel = page.relative_to(ROOT)
        text = page.read_text(encoding="utf-8")

        if not TITLE.search(text):
            errors.append(f"{rel}: missing <title>")

        h1s = len(re.findall(r"<h1[ >]", text))
        if h1s != 1:
            errors.append(f"{rel}: expected 1 <h1>, found {h1s}")

        ids = ID.findall(text)
        duplicates = {i for i in ids if ids.count(i) > 1}
        if duplicates:
            errors.append(f"{rel}: duplicate ids {sorted(duplicates)}")

        for href in HREF.findall(text):
            if href.startswith(("http://", "https://", "mailto:", "tel:", "#")):
                continue
            target = target_for(page, href)
            if target is not None and not target.exists():
                errors.append(f"{rel}: broken link {href} -> {target.relative_to(ROOT)}")

    if errors:
        print("Site check failed:\n")
        for error in errors:
            print(f"  - {error}")
        return 1

    print(f"Site check OK: {len(pages)} pages, all internal links resolve.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
