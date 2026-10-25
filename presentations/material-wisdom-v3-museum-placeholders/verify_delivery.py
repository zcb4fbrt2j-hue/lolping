#!/usr/bin/env python3
"""Read-only OOXML, image, PDF, preview and reservation verification."""
from pathlib import Path
from zipfile import ZipFile
import hashlib,io,json
from lxml import etree
from PIL import Image,ImageOps,ImageDraw
from pptx import Presentation
import fitz
W=Path(__file__).resolve().parent
P=W/'build/material-wisdom-v3-museum-placeholders.pptx'
def digest(blob):return hashlib.sha256(blob).hexdigest()
with ZipFile(P) as z:
 assert z.testzip() is None
 for n in z.namelist():
  if n.endswith(('.xml','.rels')):etree.fromstring(z.read(n))
 assert not any(b'TargetMode="External"' in z.read(n) and b'/image' in z.read(n) for n in z.namelist() if n.endswith('.rels'))
pres=Presentation(P);outline=json.loads((W/'outline.json').read_text());slots=json.loads((W/'photo-placeholders.json').read_text())['placeholders']
assert len(pres.slides)==3
assert abs(pres.slide_width/pres.slide_height-16/9)<.001
rows=[];slide_hashes=[]
for i,slide in enumerate(pres.slides):
 texts=[s for s in slide.shapes if s.has_text_frame and s.text.strip()]
 pics=[s for s in slide.shapes if s.shape_type==13]
 expected=sum(bool(f) for f in outline['slides'][i]['figures'])
 assert len(pics)==expected,(i,len(pics),expected)
 assert len(texts)>=8 and slide.has_notes_slide
 hashes=[]
 for s in pics:
  with Image.open(io.BytesIO(s.image.blob)) as im:
   im.verify()
  with Image.open(io.BytesIO(s.image.blob)) as im:
   width,height=im.size
   ratio=width*(1-s.crop_left-s.crop_right)/(height*(1-s.crop_top-s.crop_bottom))
  assert width>=1920
  assert abs(ratio/(s.width/s.height)-1)<.001,(i,'photo stretched')
  hashes.append(digest(s.image.blob))
 slide_hashes.append(hashes)
 rows.append({'slide':i+1,'editable_text_objects':len(texts),'embedded_photos':len(pics),'photo_sha256':hashes,'has_speaker_notes':True})
assert not(set(slide_hashes[0]) & set(slide_hashes[1]+slide_hashes[2])), 'cover photo reused in body'
reservations=[]
for slot in slots:
 i=slot['slide']-1
 if outline['slides'][i]['figures'][0]:continue
 slide=pres.slides[i];frame=next(s for s in slide.shapes if s.name==slot['id']);label=next(s for s in slide.shapes if s.name==slot['id']+'_LABEL')
 assert frame.shape_type!=13 and label.has_text_frame and label.text==slot['label']
 for field,attr in [('x_in','left'),('y_in','top'),('w_in','width'),('h_in','height')]:assert abs(getattr(frame,attr)/914400-slot[field])<.0001
 reservations.append({'slide':slot['slide'],'frame_name':frame.name,'label_name':label.name,'native_editable_shape':True,'ratio':slot['ratio'],'bounds_inches':[slot[x] for x in ['x_in','y_in','w_in','h_in']]})
previews=sorted((W/'build/previews').glob('slide-*.png'));assert len(previews)==3
for file in previews:
 with Image.open(file) as im:
  assert im.width>=1800 and abs(im.width/im.height-16/9)<.003;im.verify()
with fitz.open(W/'build/material-wisdom-v3-museum-placeholders.pdf') as pdf:
 assert len(pdf)==3
 for i,page in enumerate(pdf):
  assert len(page.get_text().strip())>70
  assert '待插入' in page.get_text() if i<2 and not outline['slides'][i]['figures'][0] else True
 # Rendered PDF is independently parseable and 16:9.
 assert all(abs(p.rect.width/p.rect.height-16/9)<.003 for p in pdf)
# One convenience contact sheet; no editing of source photographs.
thumbs=[]
for file in previews:
 with Image.open(file) as im:thumbs.append(ImageOps.contain(im.convert('RGB'),(900,507)))
sheet=Image.new('RGB',(900,507*3),'white')
for i,thumb in enumerate(thumbs):sheet.paste(thumb,(0,i*507))
sheet.save(W/'build/previews/contact-sheet.png')
files=[P,W/'build/material-wisdom-v3-museum-placeholders.pdf',*previews,W/'build/previews/contact-sheet.png']
report={'pptx_zip_xml_valid':True,'slide_count':3,'canvas':'16:9','pdf_pages':3,'png_pages':3,'native_editable_reservations':reservations,'photo_aspect_preserved':True,'cover_body_distinct':True,'slides':rows,'files':[{'file':str(f.relative_to(W)),'bytes':f.stat().st_size,'sha256':digest(f.read_bytes())} for f in files]}
(W/'build/integrity.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
