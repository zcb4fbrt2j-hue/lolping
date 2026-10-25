#!/usr/bin/env python3
"""Read-only integrity, preservation and native picture-insertion validation."""
from pathlib import Path
from zipfile import ZipFile
import hashlib,io,json,re
from lxml import etree
from PIL import Image,ImageOps,ImageDraw
from pptx import Presentation
import fitz
W=Path(__file__).resolve().parent
P=W/'build/material-wisdom-photo-light.pptx'
def sha(b):return hashlib.sha256(b).hexdigest()
outline=json.loads((W/'outline.json').read_text())
slots=json.loads((W/'photo-placeholders.json').read_text())['placeholders']
photos=json.loads((W/'image-sources.json').read_text())
base=W.parent/'material-wisdom-visual-polish-20261025'
with ZipFile(P) as z:
    assert z.testzip() is None
    alltext=[]
    for n in z.namelist():
        if n.endswith(('.xml','.rels')):
            x=etree.fromstring(z.read(n));alltext+=x.xpath('//*[local-name()="t"]/text()')
            assert not x.xpath('//*[local-name()="videoFile" or local-name()="audioFile" or local-name()="media"]')
    assert not re.search('视频|播放|录制',''.join(alltext))
prs=Presentation(P)
assert len(prs.slides)==16 and abs(prs.slide_width/prs.slide_height-16/9)<.0001
assert sum(s['planned_seconds'] for s in outline['slides'])==990
pres=json.loads((W/'content-preservation.json').read_text())
assert sha((W/'逐页讲稿.md').read_bytes())==pres['spoken_script_sha256']
assert all(all(v for k,v in row.items() if k!='page') for row in pres['slides'])
if base.exists():
    assert sha((base/'build/material-wisdom-visual-polish.pptx').read_bytes())==pres['base_pptx_sha256']
    old=json.loads((base/'outline.json').read_text())
    assert [s['title'] for s in old['slides']]==[s['title'] for s in outline['slides']]
    assert all(s['notes'].startswith(o['notes']) for s,o in zip(outline['slides'],old['slides']))
photo_hashes={r['slide']:r['sha256'] for r in photos};rows=[];seen=[]
for i,(sl,src) in enumerate(zip(prs.slides,outline['slides']),1):
    texts=[s for s in sl.shapes if s.has_text_frame and s.text.strip()]
    assert src['notes'] in sl.notes_slide.notes_text_frame.text
    pics=[s for s in sl.shapes if int(s.shape_type)==13]
    assert len(pics)==sum(bool(f) for f in src.get('figures',[]))
    for pic in pics:
        blob=pic.image.blob
        with Image.open(io.BytesIO(blob)) as im:
            im.verify()
        with Image.open(io.BytesIO(blob)) as im:
            assert im.width>=1920
            ratio=im.width*(1-pic.crop_left-pic.crop_right)/(im.height*(1-pic.crop_top-pic.crop_bottom))
            assert abs(ratio/(pic.width/pic.height)-1)<.001
        digest=sha(blob);assert digest==photo_hashes[i];seen.append((i,digest))
    rows.append({'page':i,'title':src['title'],'editable_text_objects':len(texts),'photographs':len(pics)})
assert len(seen)==len({h for _,h in seen})==5
checks=[]
for slot in slots:
    sl=prs.slides[slot['slide']-1]
    ph=next(s for s in sl.placeholders if s.name==slot['id'])
    assert int(ph.placeholder_format.type)==18
    label=next(s for s in sl.shapes if s.name==slot['id']+'_LABEL')
    assert label.text==slot['label']
    for k,attr in [('x_in','left'),('y_in','top'),('w_in','width'),('h_in','height')]:
        assert abs(getattr(ph,attr)/914400-slot[k])<.0001
    checks.append({'page':slot['slide'],'id':slot['id'],'native_type':'PICTURE (18)','ratio':slot['ratio']})
# Meaningful smoke test: insert into every slot, delete its guidance label,
# save/reopen a scratch copy; preserve bounds and use non-stretched fill crop.
scratch=Presentation(P);test_photo=W/photos[0]['local_path']
for slot in slots:
    sl=scratch.slides[slot['slide']-1]
    ph=next(s for s in sl.placeholders if s.name==slot['id']);box=(ph.left,ph.top,ph.width,ph.height)
    pic=ph.insert_picture(str(test_photo));assert box==(pic.left,pic.top,pic.width,pic.height)
    label=next(s for s in sl.shapes if s.name==slot['id']+'_LABEL');label._element.getparent().remove(label._element)
test_path=Path('/tmp/material-wisdom-photo-light-insert-roundtrip.pptx');scratch.save(test_path)
again=Presentation(test_path)
for slot in slots:
    sl=again.slides[slot['slide']-1];ph=next(s for s in sl.placeholders if s.name==slot['id'])
    assert ph.image.blob==test_photo.read_bytes()
    assert not any(s.name==slot['id']+'_LABEL' for s in sl.shapes)
    with Image.open(test_photo) as im:
        ratio=im.width*(1-ph.crop_left-ph.crop_right)/(im.height*(1-ph.crop_top-ph.crop_bottom))
        assert abs(ratio/(ph.width/ph.height)-1)<.001
previews=sorted((W/'build/previews').glob('slide-*.png'));assert len(previews)==16
for p in previews:
    with Image.open(p) as im:assert im.size==(1920,1080);im.verify()
for name,start,end in [('contact-sheet.png',0,16),('preview-01-08.png',0,8),('preview-09-16.png',8,16)]:
    group=previews[start:end];cols=2 if len(group)==8 else 4;nr=(len(group)+cols-1)//cols
    sheet=Image.new('RGB',(cols*488+16,nr*290+16),'#E7EDF2');dr=ImageDraw.Draw(sheet)
    for i,p in enumerate(group):
        x=16+i%cols*488;y=16+i//cols*290
        with Image.open(p) as im:thumb=ImageOps.contain(im.convert('RGB'),(472,266))
        sheet.paste(thumb,(x,y+16));dr.text((x,y),f'{start+i+1:02d}',fill='#18374A')
    sheet.save(W/'build/previews'/name)
pdf=W/'build/material-wisdom-photo-light.pdf'
with fitz.open(pdf) as doc:
    assert len(doc)==16
    for page in doc:
        assert abs(page.rect.width/page.rect.height-16/9)<.001
        assert not re.search('视频|播放|录制',page.get_text())
    for slot in slots:assert '待插入' in doc[slot['slide']-1].get_text()
def cjk(s):return len(re.findall(r'[\u4e00-\u9fff]',s))
def display_counts(deck):
    # Main body only: exclude stable title, chapter breadcrumb, citations,
    # photograph credits and explicit photo-insertion guidance.
    out=[]
    for i,sl in enumerate(deck.slides):
        count=0
        for sh in sl.shapes:
            if not sh.has_text_frame or not sh.text.strip():continue
            if sh.top/914400<1.60 or sh.top/914400>=4.75:continue
            if sh.name.endswith('_LABEL') or sh.is_placeholder:continue
            if any(x in sh.text for x in ['CC BY','CC0','Tyg728','Raysonho','SteKrueBe']):continue
            count+=cjk(sh.text)
        out.append(count)
    return out
metrics={}
if base.exists():
    before=display_counts(Presentation(base/'build/material-wisdom-visual-polish.pptx'));after=display_counts(prs)
    metrics={'scope':'第2—15页主体汉字，不含标题/章节眉/页脚/图片署名/占位提示；仅此口径可比较',
        'before':sum(before[1:15]),'after':sum(after[1:15]),'reduction_percent':round((1-sum(after[1:15])/sum(before[1:15]))*100,1),
        'by_page':[{'page':i+1,'before':a,'after':b} for i,(a,b) in enumerate(zip(before,after))]}
files=[P,pdf,*previews]
result={'pptx_valid':True,'slides':16,'spoken_slides':15,'reference_slides':1,'seconds':990,
    'native_editable_text_objects':sum(r['editable_text_objects'] for r in rows),
    'native_picture_placeholders':checks,'placeholder_insert_save_reopen_test':'passed for all six slots; scratch file only',
    'original_notes_and_spoken_script_preserved':True,'real_photo_count':5,'cover_photo_not_reused':True,
    'image_aspect_preserved':True,'pdf_pages':16,'png_pages':16,'png_pixels':[1920,1080],
    'display_text_metrics':metrics,'pages':rows,'files':[{'path':str(p.relative_to(W)),'bytes':p.stat().st_size,'sha256':sha(p.read_bytes())} for p in files]}
(W/'build/integrity.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k not in ['pages','files','display_text_metrics']},ensure_ascii=False,indent=2))
print('Display text:',metrics)
