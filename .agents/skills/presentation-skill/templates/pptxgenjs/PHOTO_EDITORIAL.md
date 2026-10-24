# Photo editorial layouts (lolping extension, 2026-10-24)

This optional extension adds native editable Chinese photographic layouts to
this Apache-2.0 skill. Existing variants retain their renderer.

Use the standard `scripts/build_deck_pptxgenjs.js` CLI with `outline.json`.
Set `variant` to `photo-editorial-cover`, `photo-editorial-heritage`, or
`photo-editorial-strategy`; set `editorial.layout` respectively to
`diptych-cover`, `heritage-spread`, or `strategy-scene`. Put image paths in
`figures`. No automatic image generation or network access is performed.

Shared fields: `title`, `subtitle`, `source_line`, `notes`,
`editorial.eyebrow`. Cover: `editorial.theme`, `editorial.captions[2]` and two
figures. Heritage: `editorial.caption`, `editorial.points[3]` with heading/body.
Strategy: `editorial.caption`, `case_note`, `main_label`, `main_claim`,
`scene_label`, `takeaway` and one figure.

The canvas remains 10 × 5.625 inches (16:9), using Noto Sans CJK SC. Photos
are individual image objects with aspect-preserving OOXML crop. PptxGenJS 4
needs original-aspect dimensions before applying sizing.cover; this template
uses the already installed image-size dependency to obtain them. Each title,
caption, paragraph, page number, and background shape remains editable.

Validate, render, and inspect every outline. This extension does not infer
photographic truth, image licenses, or scientific claims; those belong in the
workspace evidence/asset plans. `presentations/material-wisdom-v2-samples/`
is a complete source example.
