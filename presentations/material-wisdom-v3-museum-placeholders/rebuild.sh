#!/usr/bin/env bash
set -euo pipefail
export XDG_CACHE_HOME=/tmp/lolping-v3-museum-cache
SAMPLE_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(git -C "$SAMPLE_DIR" rev-parse --show-toplevel)"
SKILL_DIR="$PROJECT_ROOT/.agents/skills/presentation-skill"
PPTX="$SAMPLE_DIR/build/material-wisdom-v3-museum-placeholders.pptx"
python "$SKILL_DIR/scripts/validate_planning.py" --workspace "$SAMPLE_DIR" --report "$SAMPLE_DIR/build/planning-validation.json"
node "$SKILL_DIR/scripts/build_deck_pptxgenjs.js" --outline "$SAMPLE_DIR/outline.json" --output "$PPTX" --style-preset editorial-minimal
python "$SKILL_DIR/scripts/render_slides.py" --input "$PPTX" --outdir "$SAMPLE_DIR/build/previews" --format png --dpi 180
soffice -env:UserInstallation=file:///tmp/lolping-v3-museum-pdf --headless --convert-to pdf --outdir "$SAMPLE_DIR/build" "$PPTX"
python "$SKILL_DIR/scripts/qa_gate.py" --input "$PPTX" --outdir "$SAMPLE_DIR/build/qa" --style-preset editorial-minimal --outline "$SAMPLE_DIR/outline.json" --strict-geometry --skip-manual-review --fail-on-visual-warnings --fail-on-design-warnings --run-visual-review --fail-on-visual-review-warnings
python "$SAMPLE_DIR/verify_delivery.py"
printf '%s\n' 'Automated checks completed. Inspect all three rendered pages before use.'
