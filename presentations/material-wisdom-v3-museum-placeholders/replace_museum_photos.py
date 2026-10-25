#!/usr/bin/env python3
"""Apply verified user photographs to outline source in a NEW workspace.
Does not patch a generated PPTX or edit the original reservation workspace.
"""
import argparse,csv,hashlib,json,shutil
from pathlib import Path
from PIL import Image

def main():
 p=argparse.ArgumentParser(description=__doc__)
 p.add_argument('--manifest',type=Path,required=True,help='JSON with photos list; see museum-photos.example.json')
 p.add_argument('--outdir',type=Path,required=True,help='New workspace path; must not already exist')
 p.add_argument('--dry-run',action='store_true',help='Validate metadata, pixels and duplicate sources without writing')
 a=p.parse_args();root=Path(__file__).resolve().parent
 outline=json.loads((root/'outline.json').read_text())
 slots={s['editorial']['reservation']['id']:s for s in outline['slides'] if 'reservation' in s['editorial']}
 manifest=json.loads(a.manifest.read_text());photos=manifest.get('photos',[])
 if not photos:raise ValueError('photos must be a nonempty list')
 if a.outdir.exists():raise FileExistsError('Refusing to overwrite existing workspace: '+str(a.outdir))
 protected={hashlib.sha256(f.read_bytes()).hexdigest() for f in (root/'assets').glob('*') if f.suffix.lower() in {'.jpg','.jpeg','.png'}}
 seen_slots=set();seen_hashes=set();register=[]
 for row in photos:
  required=['slot','file','exhibit_name','exhibit_type','location','date','photographer','usage_note','identity_evidence']
  for key in required:
   if not isinstance(row.get(key),str) or not row[key].strip():raise ValueError('Missing metadata field: '+key)
  slot=row['slot']
  if slot not in slots or slot in seen_slots:raise ValueError('Unknown or duplicate slot: '+slot)
  seen_slots.add(slot)
  file=Path(row['file']).expanduser()
  if not file.is_absolute():file=a.manifest.resolve().parent/file
  blob=file.read_bytes();digest=hashlib.sha256(blob).hexdigest()
  if digest in seen_hashes or digest in protected:raise ValueError('Repeated photograph is forbidden, including cover/body duplication')
  seen_hashes.add(digest)
  with Image.open(file) as im:
   im.verify()
  with Image.open(file) as im:
   width,height=im.size;fmt=im.format
  if width<1920:raise ValueError(f'Original width {width}px is below the preferred 1920px threshold; no upscaling is performed')
  if fmt not in {'JPEG','PNG'}:raise ValueError('Please supply original JPEG or PNG for this source workflow')
  extension='.jpg' if fmt=='JPEG' else '.png'
  row={**row,'resolved_path':str(file.resolve()),'destination':'assets/'+slot.lower()+extension,'width_px':width,'height_px':height,'sha256':digest,'bytes':len(blob),'verification':'用户提供身份信息；需人工核对展签、照片实际内容、清晰度与授权范围'}
  register.append(row)
 if a.dry_run:
  print(json.dumps({'validation':'passed','writes':0,'photos':register},ensure_ascii=False,indent=2));return
 shutil.copytree(root,a.outdir,ignore=shutil.ignore_patterns('build','*.zip','SHA256SUMS.json','remote-download-check.json','preservation-check.json','__pycache__'))
 for row in register:
  shutil.copy2(row['resolved_path'],a.outdir/row['destination'])
  slide=slots[row['slot']];slide['figures'][0]=row['destination']
  caption=f"{row['exhibit_name']}（{row['exhibit_type']}）｜{row['photographer']}，{row['date']}"
  slide['editorial']['museum_caption']=caption
  slide['notes']+='\n新增实拍：'+json.dumps({k:v for k,v in row.items() if k!='resolved_path'},ensure_ascii=False)
 (a.outdir/'outline.json').write_text(json.dumps(outline,ensure_ascii=False,indent=2)+'\n')
 (a.outdir/'museum-photo-register.json').write_text(json.dumps(register,ensure_ascii=False,indent=2)+'\n')
 with (a.outdir/'assets/attribution.csv').open('a',newline='') as f:
  writer=csv.writer(f)
  for r in register:writer.writerow([r['slot'],1 if r['slot']=='MUSEUM_COVER_FUCHUAN' else 2,r['destination'],r['photographer'],r['identity_evidence'],r['usage_note'],'','PPT内等比裁剪，原始文件保留'])
 print('New source workspace:',a.outdir)
 print('Next: bash '+str(a.outdir/'rebuild.sh'))
 print('Manually review exhibit identity, permissions, cropping, caption fit and notes before classroom use.')
if __name__=='__main__':main()
