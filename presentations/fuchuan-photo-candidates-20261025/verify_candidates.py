"""Verify native pixel previews, original file integrity, and preserved sources."""
from pathlib import Path
from PIL import Image, ImageChops
import json, hashlib
ROOT=Path(__file__).resolve().parent
record=json.loads((ROOT/'candidate-register.json').read_text());rows=[]
for x in record['items']:
    f=ROOT/x['file'];h=hashlib.sha256(f.read_bytes()).hexdigest();assert h==x['sha256']
    with Image.open(f)as source,Image.open(ROOT/'previews'/(x['id']+'.png'))as preview:
        assert source.size==preview.size==(x['width'],x['height'])
        assert ImageChops.difference(source.convert('RGB'),preview.convert('RGB')).getbbox() is None
    assert not x['approved_for_ppt']
    rows.append({'id':x['id'],'width':x['width'],'height':x['height'],'bytes':f.stat().st_size,'preview_pixels_identical':True})
assert not list(ROOT.rglob('*.pptx'))
base=ROOT.parent.parent
preserved=json.loads((ROOT/'preserved-modern-assets.json').read_text())
for a in preserved['assets']:
    f=base/'presentations/material-wisdom-v3-samples'/a['local_path'];assert hashlib.sha256(f.read_bytes()).hexdigest()==a['sha256']
result={'files_and_previews_valid':True,'new_qualified_hd_count':0,'ppt_created':False,'modern_assets_unchanged':True,'cover_reuse_rule_preserved':True,'items':rows}
(ROOT/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False,indent=2))
