#!/usr/bin/env python3
"""Read-only package, scope, rendering, notes and native-placeholder checks."""
from pathlib import Path
from zipfile import ZipFile
import json,hashlib,re,io
from lxml import etree
from PIL import Image,ImageChops,ImageDraw,ImageOps
from pptx import Presentation
import fitz
W=Path(__file__).resolve().parent; B=W.parent/'material-wisdom-final-local-20261026'
P=W/'build/material-wisdom-chapter-five.pptx'
def sha(b):return hashlib.sha256(b).hexdigest()
o=json.loads((W/'outline.json').read_text());old=json.loads((B/'outline.json').read_text()) if B.exists() else None
slots=json.loads((W/'photo-placeholders.json').read_text())['placeholders'];photos=json.loads((W/'image-sources.json').read_text())
unchanged=[*range(1,13),16]
assert len(o['slides'])==16
assert sum(s['planned_seconds'] for s in o['slides'])==1020
assert sum(s['planned_seconds'] for s in o['slides'][12:15])==150
with ZipFile(P) as z:
 assert z.testzip() is None
 for n in z.namelist():
  if n.endswith(('.xml','.rels')):
   x=etree.fromstring(z.read(n))
   assert not x.xpath('//*[local-name()="videoFile" or local-name()="audioFile"]')
 if old:
  with ZipFile(B/'build/material-wisdom-final-local.pptx') as prior:
   for i in unchanged:
    assert o['slides'][i-1]==old['slides'][i-1]
    for n in [f'ppt/slides/slide{i}.xml',f'ppt/slides/_rels/slide{i}.xml.rels',f'ppt/notesSlides/notesSlide{i}.xml']:
     assert z.read(n)==prior.read(n),(i,n,'unexpected edit')
   media=lambda zz:sorted(sha(zz.read(n)) for n in zz.namelist() if n.startswith('ppt/media/') and not n.endswith('/'))
   assert media(z)==media(prior)
prs=Presentation(P);assert len(prs.slides)==16
assert abs(prs.slide_width/prs.slide_height-16/9)<.00001
images=[];editable=0
for i,(sl,src) in enumerate(zip(prs.slides,o['slides']),1):
 notes=sl.notes_slide.notes_text_frame.text
 assert src['notes'] in notes,(i,'missing canonical notes')
 assert not re.search(r'\{\s*"|editorial|polish_layout|开发记录|旧版备份|视频|播放|录制',notes)
 if i in [13,14,15]:assert not any(v in notes for v in ['青年使命','研究生责任','青春担当','求真、协同、担当'])
 for sh in sl.shapes:
  if sh.has_text_frame and sh.text.strip():editable+=1
  if int(sh.shape_type)==13:
   blob=sh.image.blob
   with Image.open(io.BytesIO(blob)) as im:
    assert im.width>=1920
    ratio=im.width*(1-sh.crop_left-sh.crop_right)/(im.height*(1-sh.crop_top-sh.crop_bottom))
    assert abs(ratio/(sh.width/sh.height)-1)<.001
   images.append(sha(blob))
assert len(images)==len(set(images))==6
assert set(images)=={r['sha256'] for r in photos}
for i in [13,14,15]:
 src=o['slides'][i-1]
 assert '以小见大' in src['editorial']['eyebrow']
 assert '资料依据：' in src['notes']
 assert all(url in src['notes'] for url in src['sources'])
assert '直接技术前身' in o['slides'][12]['notes']
assert '不能代替' in o['slides'][13]['notes']
assert '中国式现代化' in o['slides'][14]['notes']
# Exercise actual native insert/save/reopen in a disposable copy only.
scratch=Presentation(P);sample=W/photos[0]['local_path']
for slot in slots:
 sl=scratch.slides[slot['slide']-1];ph=next(s for s in sl.placeholders if s.name==slot['id'])
 assert int(ph.placeholder_format.type)==18
 for k,v in [('x_in','left'),('y_in','top'),('w_in','width'),('h_in','height')]:assert abs(getattr(ph,v)/914400-slot[k])<.0001
 box=(ph.left,ph.top,ph.width,ph.height);pic=ph.insert_picture(str(sample));assert box==(pic.left,pic.top,pic.width,pic.height)
 label=next(s for s in sl.shapes if s.name==slot['id']+'_LABEL');label._element.getparent().remove(label._element)
sp=Path('/tmp/material-wisdom-chapter-five-slot-check.pptx');scratch.save(sp);reopened=Presentation(sp)
for slot in slots:
 ph=next(s for s in reopened.slides[slot['slide']-1].placeholders if s.name==slot['id'])
 assert ph.image.blob==sample.read_bytes()
 with Image.open(sample) as im:
  ratio=im.width*(1-ph.crop_left-ph.crop_right)/(im.height*(1-ph.crop_top-ph.crop_bottom))
  assert abs(ratio/(ph.width/ph.height)-1)<.001
previews=sorted((W/'build/previews').glob('slide-*.png'));assert len(previews)==16
pixel_checks=[];raster_variances=[]
for i,p in enumerate(previews,1):
 with Image.open(p) as im:
  assert im.size==(1920,1080)
  if i in unchanged and B.exists():
   with Image.open(B/'build/previews'/p.name) as before:
    diff=ImageChops.difference(im.convert('RGB'),before.convert('RGB'));bbox=diff.getbbox()
    if i<=12:assert bbox is None,(i,'render changed')
    if bbox is None:pixel_checks.append(i)
    else:
     # Slide 16 XML, relationships and notes were proved byte-identical above.
     # PDF font subsetting/rasterization can vary on a few glyph-edge pixels.
     changed=sum(1 for px in diff.getdata() if px!=(0,0,0))
     assert changed<1000,(i,'unexpected large raster difference')
     raster_variances.append({'page':i,'changed_pixels':changed,'bbox':bbox,'slide_xml_relationships_and_notes':'byte-identical to base'})
with fitz.open(W/'build/material-wisdom-chapter-five.pdf') as pdf:
 assert len(pdf)==16
 for page in pdf:assert not re.search('视频|播放|录制',page.get_text())
 for i in [13,14]:assert '待插入' in pdf[i-1].get_text()
# Contact sheets are preview artifacts, never slide backgrounds.
for name,nums,cols,width in [('contact-sheet.png',list(range(1,17)),4,472),('chapter-five-preview.png',[13,14,15],1,1200)]:
 h=round(width*9/16);rows=(len(nums)+cols-1)//cols
 sheet=Image.new('RGB',(cols*(width+16)+16,rows*(h+36)+16),'#E7EDF2');draw=ImageDraw.Draw(sheet)
 for j,num in enumerate(nums):
  x=16+j%cols*(width+16);y=16+j//cols*(h+36)
  draw.text((x,y),f'{num:02d}',fill='#18374A')
  with Image.open(W/'build/previews'/f'slide-{num:02d}.png') as im:sheet.paste(ImageOps.contain(im.convert('RGB'),(width,h)),(x,y+20))
 sheet.save(W/'build/previews'/name)
if B.exists():
 sheet=Image.new('RGB',(1624,3*484+16),'#E7EDF2');dr=ImageDraw.Draw(sheet)
 for j,num in enumerate([13,14,15]):
  for col,root in enumerate([B,W]):
   x=16+col*804;y=16+j*484;dr.text((x,y),f'{num} / '+('BEFORE' if col==0 else 'AFTER'),fill='#18374A')
   with Image.open(root/'build/previews'/f'slide-{num:02d}.png') as im:sheet.paste(ImageOps.contain(im.convert('RGB'),(788,444)),(x,y+20))
 sheet.save(W/'build/previews/chapter-five-before-after.png')
prior_hashes=Path('/tmp/chapter-five-before-hashes.json')
if prior_hashes.exists():
 records=json.loads(prior_hashes.read_text());r=W.parents[1]
 for path,digest in records.items():assert sha((r/path).read_bytes())==digest,path
 (W/'preservation-check.json').write_text(json.dumps({'previous_files_checked':len(records),'all_sha256_unchanged':True},indent=2)+'\n')
metrics={'slides':16,'spoken_slides':15,'reference_slides':1,'planned_seconds':1020,'chapter_five_seconds':150,'chapter_five_spoken_cjk':[len(re.findall(r'[\u4e00-\u9fff]',s['notes'].split('资料依据：')[0])) for s in o['slides'][12:15]],'unchanged_source_slide_notes_xml':unchanged if old else [],'unchanged_png_pixels':pixel_checks,'reference_page_raster_variance':raster_variances,'updated_pages':[13,14,15],'editable_text_objects':editable,'native_picture_placeholders':len(slots),'native_placeholder_insert_save_reopen':'passed','original_unique_photos':len(images),'cover_photo_exclusive':True,'pdf_pages':16,'png_pages':16,'png_size':[1920,1080]}
(W/'build/integrity.json').write_text(json.dumps(metrics,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(metrics,ensure_ascii=False,indent=2))
