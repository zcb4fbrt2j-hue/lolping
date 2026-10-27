#!/usr/bin/env bash
set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PPT_MASTER_VENV="${PPT_MASTER_VENV:-/workspace/venvs/ppt-master-20261027}"
if [[ ! -x "$PPT_MASTER_VENV/bin/python" ]]; then
  printf '%s\n' 'Run tools/ppt-master/setup.sh first.' >&2
  exit 1
fi
if [[ $# -eq 0 ]]; then
  printf '%s\n' 'Usage: bash tools/ppt-master/run.sh <script.py> [arguments...]' >&2
  exit 2
fi
PPT_MASTER_SCRIPT="$PROJECT_ROOT/.agents/skills/ppt-master/scripts/$1"
shift
if [[ ! -f "$PPT_MASTER_SCRIPT" ]]; then
  printf '%s\n' 'The requested PPT Master script does not exist.' >&2
  exit 2
fi
export PATH="$PPT_MASTER_VENV/bin:$PATH"
export PYTHONDONTWRITEBYTECODE=1
exec "$PPT_MASTER_VENV/bin/python" "$PPT_MASTER_SCRIPT" "$@"
