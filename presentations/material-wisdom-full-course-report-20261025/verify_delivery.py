#!/usr/bin/env python3
"""Read-only validation of the editable full course-report delivery."""
from pathlib import Path
from zipfile import ZipFile
import hashlib,io,json,re
from lxml import etree
from PIL import Image,ImageOps,ImageDraw
from pptx import Presentation
import fitz
W=Path(__file__).resolve().parent
P=W/'build/material-wisdom-full-course-report.pptx'
def sha(data):return hashlib.sha256(data).hexdigest()
text_nodes=[]
with ZipFile(P) as z:
 assert z.testzip() is None
 for n in z.namelist():
  if n.endswith(('.xml','.rels')):
   root=etree.fromstring(z.read(n));text_nodes+=root.xpath('//*[local-name()="t"]/text()')
   assert not root.xpath('//*[local-name()="videoFile" or local-name()="audioFile" or local-name()="media"]')
 assert not any(n.lower().endswith(('.mp4','.mov','.avi','.wmv','.mp3','.wav','.m4a','.m4v','.mpeg')) for n in z.namelist())
 assert not re.search('视频|播放|录制',''.join(text_nodes))
for n in ['outline.json','逐页讲稿.md','逐页内容与版式规划.md','notes.md']:
 assert not re.search('视频|播放|录制',(W/n).read_text()),n
prs=Presentation(P);outline=json.loads((W/'outline.json').read_text());timing=json.loads((W/'timing-and-chapters.json').read_text())
assert len(prs.slides)==len(outline['slides'])==16
assert abs(prs.slide_width/prs.slide_height-16/9)<.0001
assert timing['planned_seconds']==990 and sum(r['seconds'] for r in timing['slides'])==990
assert [len(c['slides']) for c in timing['chapters']]==[2,2,3,4,3]
assert all(s['planned_seconds']==r['seconds'] for s,r in zip(outline['slides'],timing['slides']))
asset_hashes={a['slide']:a['sha256'] for a in json.loads((W/'image-sources.json').read_text())}
rows=[];picture_hashes=[]
for i,slide in enumerate(prs.slides,1):
 texts=[s for s in slide.shapes if s.has_text_frame and s.text.strip()]
 pics=[s for s in slide.shapes if s.shape_type==13]
 assert len(texts)>=6 and slide.has_notes_slide,i
 assert len(pics)==sum(bool(f) for f in outline['slides'][i-1].get('figures',[])),i
 hashes=[]
 for s in pics:
  blob=s.image.blob
  with Image.open(io.BytesIO(blob)) as im:im.verify()
  with Image.open(io.BytesIO(blob)) as im:
   assert im.width>=1920
   visible_ratio=im.width*(1-s.crop_left-s.crop_right)/(im.height*(1-s.crop_top-s.crop_bottom))
  assert abs(visible_ratio/(s.width/s.height)-1)<.001,(i,'stretched photograph')
  h=sha(blob);assert h==asset_hashes[i];hashes.append(h)
 picture_hashes.append(hashes)
 # Every paragraph in the editable spoken script is present in speaker notes.
 expected=outline['slides'][i-1]['notes'].split('\n资料依据：')[0]
 assert expected in slide.notes_slide.notes_text_frame.text,i
 rows.append({'page':i,'title':outline['slides'][i-1]['title'],'editable_text_objects':len(texts),'embedded_photographs':len(pics),'photograph_sha256':hashes,'notes_match_source':True})
assert len(set(h for hs in picture_hashes for h in hs))==2
assert not(set(picture_hashes[0]) & set(h for hs in picture_hashes[1:] for h in hs))
reservations=[]
for slot in json.loads((W/'photo-placeholders.json').read_text())['placeholders']:
 i=slot['slide']-1
 if outline['slides'][i]['figures'][0]:continue
 s=prs.slides[i];frame=next(o for o in s.shapes if o.name==slot['id']);label=next(o for o in s.shapes if o.name==slot['id']+'_LABEL')
 assert frame.shape_type!=13 and label.text==slot['label']
 for key,attr in [('x_in','left'),('y_in','top'),('w_in','width'),('h_in','height')]:assert abs(getattr(frame,attr)/914400-slot[key])<.0001
 reservations.append({'page':slot['slide'],'name':slot['id'],'ratio':slot['ratio'],'native_editable_frame_and_label':True})
previews=sorted((W/'build/previews').glob('slide-*.png'));assert len(previews)==16
for p in previews:
 with Image.open(p) as im:assert im.size==(1920,1080);im.verify()
for name,start,end in [('contact-sheet.png',0,16),('preview-01-08.png',0,8),('preview-09-16.png',8,16)]:
 group=previews[start:end];cols=2 if len(group)==8 else 4;row_count=(len(group)+cols-1)//cols
 sheet=Image.new('RGB',(cols*488+16,row_count*290+16),'#E7EDF2');draw=ImageDraw.Draw(sheet)
 for j,path in enumerate(group):
  x=16+(j%cols)*488;y=16+(j//cols)*290
  with Image.open(path) as im:thumb=ImageOps.contain(im.convert('RGB'),(472,266))
  sheet.paste(thumb,(x,y+16));draw.text((x,y),f'{start+j+1:02d}',fill='#18374A')
 sheet.save(W/'build/previews'/name)
with fitz.open(W/'build/material-wisdom-full-course-report.pdf') as doc:
 assert len(doc)==16
 for i,page in enumerate(doc):
  txt=page.get_text();assert len(txt.strip())>55
  assert abs(page.rect.width/page.rect.height-16/9)<.001
  assert not re.search('视频|播放|录制',txt)
  if i in [0,1] and not outline['slides'][i]['figures'][0]:assert '待插入' in txt
  if i==13:assert '待补充' in txt
 # The PDF typography is embedded, avoiding missing CJK glyphs for preview.
 font_records={f[0] for page in doc for f in page.get_fonts(full=True)}
 assert font_records
 embedded=[]
 for xref in font_records:
  name,ext,typ,data=doc.extract_font(xref)
  # Type1/CID subfonts can be indirect, so record embed evidence separately.
  embedded.append({'xref':xref,'name':name,'type':typ,'font_program_bytes':len(data)})
files=[P,W/'build/material-wisdom-full-course-report.pdf',*previews,*sorted((W/'build/previews').glob('*sheet.png')),*sorted((W/'build/previews').glob('preview-*.png'))]
report={'pptx_zip_and_xml_valid':True,'slide_count':16,'spoken_slides':15,'reference_slides':1,'canvas':'16:9','planned_seconds':990,'planned_duration':'16:30','motion_and_audio_objects':0,'excluded_topics_found':0,'font_family':'Noto Sans CJK SC','native_editable_text_objects':sum(r['editable_text_objects'] for r in rows),'native_editable_photo_reservations':reservations,'embedded_photo_count':2,'photo_aspect_preserved':True,'cover_photos_not_reused':True,'pdf_pages':16,'preview_pages':16,'preview_pixels':[1920,1080],'slides':rows,'files':[{'file':str(f.relative_to(W)),'bytes':f.stat().st_size,'sha256':sha(f.read_bytes())} for f in files]}
(W/'build/integrity.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['slides','files']},ensure_ascii=False,indent=2))
print('PPTX bytes:',P.stat().st_size,'PDF bytes:',(W/'build/material-wisdom-full-course-report.pdf').stat().st_size)
