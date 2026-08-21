#!/usr/bin/env bash
set -euo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

verify_python_project() {
  local project="$1"
  local module="$2"
  local strict_types="$3"

  (
    cd "$repository_root/projects/$project"
    uv sync --locked --dev --no-install-project
    uv run --no-sync ruff check src tests scripts
    if [[ "$strict_types" == "yes" ]]; then
      uv run --no-sync mypy src
    fi
    uv run --no-sync pytest -q
    PYTHONPATH=src uv run --no-sync python -m "$module"
  )
}

verify_python_project "synthevia" "synthevia_showcase.demo_data" "no"

(
  cd "$repository_root/projects/synthevia/frontend"
  npm ci
  npm audit --audit-level=high
  npm test
  npm run typecheck
  npm run build
)

verify_python_project "gargantua" "gargantua_showcase.demo_data" "no"
verify_python_project "strategy-lab" "strategy_lab_showcase.demo" "yes"
verify_python_project "mytradingbot" "mytradingbot_showcase.qualification" "yes"

(
  cd "$repository_root/site"
  npm ci --ignore-scripts
  npm audit --audit-level=high
  npm test
  npm run build
)

python3 "$repository_root/scripts/check_markdown_links.py"
