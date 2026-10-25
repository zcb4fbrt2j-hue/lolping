# Visual Review Packet

- PPTX: `/workspace/lolping/presentations/material-wisdom-v3-museum-placeholders/build/material-wisdom-v3-museum-placeholders.pptx`
- Rendered slides: 3
- Warnings: 0
- Info: 8
- Contact sheet: `/workspace/lolping/presentations/material-wisdom-v3-museum-placeholders/build/qa/visual_review/contact_sheet.jpg`

## Findings

- [INFO] slide 1 / shape-2: text_box_tight - Estimated text height uses 89% of its box.
  Suggestion: Check the rendered slide for clipping or awkward wrap.
- [INFO] slide 1 / shape-3: text_box_tight - Estimated text height uses 93% of its box.
  Suggestion: Check the rendered slide for clipping or awkward wrap.
- [INFO] slide 1 / shape-8: body_font_small - Body-like text is 9.0pt.
  Suggestion: Check readability; use larger text or split dense content if this is not a table/caption.
- [INFO] slide 1 / shape-9: body_font_small - Body-like text is 9.0pt.
  Suggestion: Check readability; use larger text or split dense content if this is not a table/caption.
- [INFO] slide 2 / shape-2: text_box_tight - Estimated text height uses 90% of its box.
  Suggestion: Check the rendered slide for clipping or awkward wrap.
- [INFO] slide 3 / shape-4: text_box_tight - Estimated text height uses 89% of its box.
  Suggestion: Check the rendered slide for clipping or awkward wrap.
- [INFO] slide 3 / shape-5: text_box_tight - Estimated text height uses 88% of its box.
  Suggestion: Check the rendered slide for clipping or awkward wrap.
- [INFO] slide 3 / shape-8: body_font_small - Body-like text is 9.0pt.
  Suggestion: Check readability; use larger text or split dense content if this is not a table/caption.

## Rendered Slides

1. `/workspace/lolping/presentations/material-wisdom-v3-museum-placeholders/build/qa/renders/slide-01.jpg`
2. `/workspace/lolping/presentations/material-wisdom-v3-museum-placeholders/build/qa/renders/slide-02.jpg`
3. `/workspace/lolping/presentations/material-wisdom-v3-museum-placeholders/build/qa/renders/slide-03.jpg`

## Human/Agent Review Checklist

- Inspect the contact sheet first for rhythm, density, and repeated layouts.
- Open individual slides for title wrapping, orphan words, weak contrast, and footer clearance.
- Fix `outline.json`, `design_brief.json`, assets, or renderer code, then rebuild.
- Do not patch the generated `.pptx` directly unless the task is an explicit one-off edit.
