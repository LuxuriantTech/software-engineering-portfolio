#!/usr/bin/env python3
"""Validate local Markdown links without downloading or executing third-party code."""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote

MARKDOWN_LINK = re.compile(r"!?\[[^\]]*\]\(([^)\n]+)\)")
EXTERNAL_SCHEMES = ("http://", "https://", "mailto:")
IGNORED_DIRECTORIES = {".git", ".venv", "build", "dist", "node_modules"}


def local_target(raw_target: str) -> str | None:
    target = raw_target.strip()
    if target.startswith("<") and ">" in target:
        target = target[1 : target.index(">")]
    else:
        target = target.split(maxsplit=1)[0]
    if target.startswith(EXTERNAL_SCHEMES) or target.startswith("#"):
        return None
    return unquote(target.split("#", 1)[0].split("?", 1)[0])


def main() -> int:
    repository = Path(__file__).resolve().parents[1]
    failures: list[str] = []
    for markdown in sorted(repository.rglob("*.md")):
        relative_markdown = markdown.relative_to(repository)
        if any(part in IGNORED_DIRECTORIES for part in relative_markdown.parts):
            continue
        for match in MARKDOWN_LINK.finditer(markdown.read_text(encoding="utf-8")):
            target = local_target(match.group(1))
            if not target:
                continue
            candidate = (markdown.parent / target).resolve()
            try:
                candidate.relative_to(repository)
            except ValueError:
                failures.append(f"{relative_markdown}: path leaves repository: {target}")
                continue
            if not candidate.exists():
                failures.append(f"{relative_markdown}: missing local target: {target}")
    if failures:
        print("\n".join(failures), file=sys.stderr)
        return 1
    print("Local Markdown links: valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
