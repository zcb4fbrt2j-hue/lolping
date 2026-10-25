#!/usr/bin/env python3
"""Package final artifacts; omit JPEG copies already embedded in the PPTX."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
import hashlib,json
W=Path(__file__).resolve().parent
preview=W/'material-wisdom-photo-light-previews.zip'
with ZipFile(preview,'w',ZIP_DEFLATED,compresslevel=6) as z:
    for p in sorted((W/'build/previews').glob('slide-*.png')):z.write(p,p.name)
    for n in ['contact-sheet.png','before-after-key-slides.png']:z.write(W/'build/previews'/n,n)
files=[p for p in sorted(W.rglob('*')) if p.is_file() and p.suffix!='.zip'
       and '__pycache__' not in p.parts and p.name!='SHA256SUMS.json']
(W/'SHA256SUMS.json').write_text(json.dumps([
    {'path':str(p.relative_to(W)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
    for p in files],ensure_ascii=False,indent=2)+'\n')
delivery=W/'material-wisdom-photo-light-delivery.zip'
with ZipFile(delivery,'w',ZIP_DEFLATED,compresslevel=6) as z:
    for p in [*files,W/'SHA256SUMS.json']:
        rel=p.relative_to(W)
        if rel.parts[0]=='assets' and p.suffix.lower() in {'.jpg','.jpeg'}:continue
        if str(rel).startswith('build/qa/') and p.suffix.lower() in {'.jpg','.png'}:continue
        z.write(p,str(rel))
for p in [delivery,preview]:
    with ZipFile(p) as z:assert z.testzip() is None
    print(p.name,p.stat().st_size,'bytes')
