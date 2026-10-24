#!/usr/bin/env bash
set -euo pipefail
export XDG_CACHE_HOME=/tmp/lolping-v2-cache
PROJECT_ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
SAMPLE_DIR="$PROJECT_ROOT/presentations/material-wisdom-v2-samples"
SKILL_DIR="$PROJECT_ROOT/.agents/skills/presentation-skill"
node "$SKILL_DIR/scripts/build_deck_pptxgenjs.js" --outline "$SAMPLE_DIR/outline.json" --output "$SAMPLE_DIR/build/material-wisdom-v2-samples.pptx" --style-preset editorial-minimal
python "$SKILL_DIR/scripts/render_slides.py" --input "$SAMPLE_DIR/build/material-wisdom-v2-samples.pptx" --outdir "$SAMPLE_DIR/build/previews" --format png --dpi 160
soffice -env:UserInstallation=file:///tmp/lolping-v2-samples-export --headless --convert-to pdf --outdir "$SAMPLE_DIR/build" "$SAMPLE_DIR/build/material-wisdom-v2-samples.pptx"
python "$SAMPLE_DIR/verify_delivery.py"
