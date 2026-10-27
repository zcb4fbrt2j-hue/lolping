#!/usr/bin/env bash
set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PPT_MASTER_VENV="${PPT_MASTER_VENV:-/workspace/venvs/ppt-master-20261027}"
if [[ ! -x "$PPT_MASTER_VENV/bin/python" ]]; then
  python3 -m venv "$PPT_MASTER_VENV"
fi
PIP_CACHE_DIR="${PIP_CACHE_DIR:-/tmp/ppt-master-pip-cache}" \
  "$PPT_MASTER_VENV/bin/python" -m pip install -r "$PROJECT_ROOT/docs/ppt-master-installation/requirements-tested.txt"
PIP_CACHE_DIR="${PIP_CACHE_DIR:-/tmp/ppt-master-pip-cache}" \
  "$PPT_MASTER_VENV/bin/python" -m pip check
printf 'PPT Master Python: %s\n' "$PPT_MASTER_VENV/bin/python"
