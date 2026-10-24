"""Check original image bytes, metadata, and readiness without generating slides."""
from pathlib import Path
from PIL import Image
import json, hashlib, sys
ROOT=Path(__file__).resolve().parent
library=json.loads((ROOT/'asset-library.json').read_text())
seen=set();rows=[]
for a in library['assets']:
    file=ROOT/a['local_path'];data=file.read_bytes();sha=hashlib.sha256(data).hexdigest()
    assert sha==a['sha256'] and sha not in seen
    seen.add(sha)
    with Image.open(file) as image:
        assert image.size==(a['width_px'],a['height_px']) and image.width>=1920
        image.verify()
    assert a['source_page'].startswith('https://commons.wikimedia.org/wiki/File:')
    assert a['author'] and a['license']
    if a['status']=='pending': assert not a['selected_for_ppt']
    rows.append({'id':a['id'],'bytes':len(data),'pixels':[a['width_px'],a['height_px']],'status':a['status']})
assert not list(ROOT.rglob('*.pptx')) and not list(ROOT.rglob('*.pdf'))
ready=not library['missing']
report={'asset_integrity_passed':True,'ready_for_ppt_layout':ready,'slides_generated':0,'assets':rows,'missing':library['missing']}
(ROOT/'asset-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
if '--require-ready' in sys.argv and not ready: sys.exit(2)
