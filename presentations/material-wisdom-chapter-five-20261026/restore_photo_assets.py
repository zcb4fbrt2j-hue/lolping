#!/usr/bin/env python3
"""Restore unchanged original JPEG assets from this delivery's PPTX by SHA-256.
The delivery ZIP avoids storing each photograph twice. No image is recompressed.
"""
from pathlib import Path
from zipfile import ZipFile
import hashlib,json
W=Path(__file__).resolve().parent
rows=json.loads((W/'image-sources.json').read_text())
needed=[]
for row in rows:
 p=W/row['local_path']
 if p.exists():
  if hashlib.sha256(p.read_bytes()).hexdigest()!=row['sha256']:raise ValueError('Refusing to replace a different asset: '+str(p))
 else:needed.append(row)
if needed:
 with ZipFile(W/'build/material-wisdom-chapter-five.pptx') as z:
  pool={hashlib.sha256(z.read(n)).hexdigest():n for n in z.namelist() if n.startswith('ppt/media/')}
  for row in needed:
   name=pool[row['sha256']];p=W/row['local_path'];p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(z.read(name))
print('Original photo assets verified:',len(rows),'restored:',len(needed))
