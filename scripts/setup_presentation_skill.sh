#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
skill_root="$project_root/.agents/skills/presentation-skill"
if [[ ! -x "$skill_root/.venv/bin/python" ]]; then
  python3 -m venv "$skill_root/.venv"
fi
"$skill_root/.venv/bin/python" -m pip install --disable-pip-version-check --cache-dir "$skill_root/.venv/pip-cache" -r "$skill_root/requirements.lock.txt"
"$skill_root/.venv/bin/python" -m pip check
cd "$skill_root"
npm ci --ignore-scripts --no-audit --no-fund --cache "$skill_root/.venv/npm-cache"
node -e "for (const name of ['pptxgenjs', 'react', 'react-dom/server', 'react-icons/fa6', 'sharp']) require(name)"
command -v soffice
command -v pdftoppm
