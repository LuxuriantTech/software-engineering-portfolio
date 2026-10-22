"""Manual conformance check against a pinned public ToolCall Replay checkout.

Example:
  py -3.14 scripts/check_toolcall_parity.py --reference-repo D:/path/to/toolcall-replay

This script uses the reference checkout's load_suite/build_report directly. It is
deliberately outside the normal browser build and adds no Python dependency to it.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

SITE = Path(__file__).resolve().parents[1]
PROVENANCE = SITE / "tests" / "fixtures" / "toolcall-reference-provenance.json"
NODE_RUNNER = SITE / "scripts" / "toolcall-parity-runner.mjs"


def stable(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def check_reference(reference: Path, provenance: dict[str, Any]) -> None:
    commit = subprocess.run(
        ["git", "-C", str(reference), "rev-parse", "HEAD"],
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()
    if commit != provenance["reference_commit"]:
        raise SystemExit(f"Reference commit mismatch: expected {provenance['reference_commit']}, got {commit}")
    mismatches = []
    for relative, expected in provenance["sha256"].items():
        path = reference / relative
        actual = sha256(path) if path.is_file() else "MISSING"
        if actual != expected:
            mismatches.append(f"{relative}: expected {expected}, got {actual}")
    if mismatches:
        raise SystemExit("Reference source hash mismatch:\n" + "\n".join(mismatches))


def run_node(node: str, input_data: dict[str, Any], temp: Path) -> dict[str, Any]:
    input_path = temp / "browser-input.json"
    output_path = temp / "browser-report.json"
    input_path.write_text(json.dumps(input_data, ensure_ascii=False), encoding="utf-8")
    subprocess.run([node, str(NODE_RUNNER), str(input_path), str(output_path)], check=True, cwd=SITE)
    return json.loads(output_path.read_text(encoding="utf-8"))


def case_input(case: Any) -> dict[str, Any]:
    from toolcall_replay.jsonutil import thaw_json

    return {
        "rules": [thaw_json(rule.data) for rule in case.rules],
        "baseline": [thaw_json(event.data) for event in case.baseline_trace.events],
        "candidate": [thaw_json(event.data) for event in case.candidate_trace.events],
    }


def compare_case(label: str, suite: Any, report: dict[str, Any], node: str, temp: Path) -> None:
    if len(suite.cases) != 1 or len(report["cases"]) != 1:
        raise SystemExit(f"{label}: expected exactly one case")
    browser = run_node(node, case_input(suite.cases[0]), temp)
    python_case = report["cases"][0]
    reference_pair = {"baseline": python_case["baseline"], "candidate": python_case["candidate"]}
    if stable(browser) != stable(reference_pair):
        raise SystemExit(f"{label}: browser evaluation differs from Python build_report")
    print(f"PARITY=PASS case={label} suite_verdict={report['verdict']} digest={report['digest']}")


def make_fresh_suite(reference: Path, published_suite: Path, published_case: Any, temp: Path) -> Path:
    from toolcall_replay.jsonutil import thaw_json

    case = published_case
    baseline = [thaw_json(event.data) for event in case.baseline_trace.events]
    candidate = [thaw_json(event.data) for event in case.candidate_trace.events]
    candidate = [event for event in candidate if not (event["kind"] == "tool_call" and event["tool"] == "directory.export")]
    approval = next(event for event in candidate if event["kind"] == "approval")
    for event in candidate:
        if event["kind"] == "tool_call" and event["tool"] == "request.lookup":
            event["arguments"]["scope"] = "team:synthetic"
        if event["kind"] == "tool_call" and event["tool"] == "request.update":
            event["approval_id"] = approval["approval_id"]
    for index, event in enumerate(candidate, 1):
        event["step"] = index

    root = temp / "fresh-suite"
    traces = root / "traces"
    traces.mkdir(parents=True)

    def write_trace(name: str, events: list[dict[str, Any]]) -> None:
        text = "\n".join(json.dumps(event, ensure_ascii=False, separators=(",", ":")) for event in events) + "\n"
        (traces / name).write_text(text, encoding="utf-8")

    write_trace("baseline.jsonl", baseline)
    write_trace("candidate.jsonl", candidate)
    rules = [thaw_json(rule.data) for rule in case.rules]
    suite_data = {
        "schema_version": "1.0",
        "suite_id": "synthetic-conformance-change",
        "cases": [{
            "case_id": case.case_id,
            "name": "Fresh synthetic corrected candidate",
            "baseline_trace": "traces/baseline.jsonl",
            "candidate_trace": "traces/candidate.jsonl",
            "rules": rules,
        }],
    }
    suite_path = root / "suite.json"
    suite_path.write_text(json.dumps(suite_data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return suite_path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--reference-repo", required=True, type=Path, help="clean ToolCall Replay checkout at the pinned provenance commit")
    parser.add_argument("--node", default="node", help="Node.js executable (default: node on PATH)")
    args = parser.parse_args()
    reference = args.reference_repo.resolve(strict=True)
    provenance = json.loads(PROVENANCE.read_text(encoding="utf-8"))
    check_reference(reference, provenance)
    if not shutil.which(args.node) and not Path(args.node).is_file():
        raise SystemExit(f"Node executable not found: {args.node}")

    sys.path.insert(0, str(reference / "src"))
    from toolcall_replay.report import build_report
    from toolcall_replay.suite import load_suite

    published_path = reference / provenance["published_suite"]
    published = load_suite(published_path)
    published_report = build_report(published)
    with tempfile.TemporaryDirectory(prefix="toolcall-parity-") as temporary:
        temp = Path(temporary)
        compare_case("published", published, published_report, args.node, temp)
        fresh_path = make_fresh_suite(reference, published_path, published.cases[0], temp)
        fresh = load_suite(fresh_path)
        fresh_report = build_report(fresh)
        compare_case("fresh-corrected", fresh, fresh_report, args.node, temp)
    print(f"REFERENCE_COMMIT={provenance['reference_commit']}")
    print(f"REFERENCE_HASHES={len(provenance['sha256'])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
