#!/usr/bin/env bash
set -euo pipefail
export XDG_CACHE_HOME=/tmp/lolping-visual-polish-cache
REPORT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(git -C "$REPORT_DIR" rev-parse --show-toplevel)"
SKILL_DIR="$PROJECT_ROOT/.agents/skills/presentation-skill"
PPTX="$REPORT_DIR/build/material-wisdom-visual-polish.pptx"
python "$REPORT_DIR/restore_photo_assets.py"
python "$SKILL_DIR/scripts/validate_planning.py" --workspace "$REPORT_DIR" --report "$REPORT_DIR/build/planning-validation.json"
node "$SKILL_DIR/scripts/build_deck_pptxgenjs.js" --outline "$REPORT_DIR/outline.json" --output "$PPTX" --style-preset editorial-minimal
python "$SKILL_DIR/scripts/render_slides.py" --input "$PPTX" --outdir "$REPORT_DIR/build/previews" --format png --dpi 192
soffice -env:UserInstallation=file:///tmp/lolping-visual-polish-pdf --headless --convert-to pdf --outdir "$REPORT_DIR/build" "$PPTX"
pdftoppm -png -scale-to-x 1920 -scale-to-y 1080 "$REPORT_DIR/build/material-wisdom-visual-polish.pdf" "$REPORT_DIR/build/previews/slide"
python "$SKILL_DIR/scripts/qa_gate.py" --input "$PPTX" --outdir "$REPORT_DIR/build/qa" --style-preset editorial-minimal --outline "$REPORT_DIR/outline.json" --strict-geometry --skip-manual-review --fail-on-visual-warnings --fail-on-design-warnings --run-visual-review --fail-on-visual-review-warnings
python "$REPORT_DIR/verify_delivery.py"
printf '%s\n' 'Automated checks completed. Visually inspect all pages after changing source text or photographs.'
