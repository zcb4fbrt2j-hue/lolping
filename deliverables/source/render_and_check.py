"""Render the actual PPTX with LibreOffice and check all text survives PDF export."""
from pathlib import Path
import json
import shutil
import subprocess
import tempfile
import unicodedata
import fitz
from PIL import Image, ImageDraw

BASE=Path(__file__).resolve().parent
NAME='一条船缝里的材料智慧_课堂汇报'


def normalized(value):
    return ''.join(unicodedata.normalize('NFKC',value).split())


def main():
    pptx=BASE/(NAME+'.pptx')
    pdf=BASE/(NAME+'.pdf')
    assert pptx.exists()
    if pdf.exists():
        pdf.unlink()
    executable=shutil.which('soffice') or shutil.which('libreoffice')
    assert executable, 'LibreOffice is required for actual PPTX rendering'
    with tempfile.TemporaryDirectory(prefix='lolping-lo-') as profile:
        subprocess.run([executable,'-env:UserInstallation='+Path(profile).as_uri(),
                        '--headless','--convert-to','pdf','--outdir',str(BASE),str(pptx)],
                       check=True,timeout=90)
    assert pdf.exists() and pdf.stat().st_size>1000
    doc=fitz.open(pdf)
    assert len(doc)==15
    previews=BASE/'previews'
    previews.mkdir(exist_ok=True)
    layout=json.loads((BASE/'layout.json').read_text())
    missing=[]
    fonts=set()
    for i,page in enumerate(doc):
        page.get_pixmap(matrix=fitz.Matrix(1600/page.rect.width,1600/page.rect.width)).save(previews/f'slide-{i+1:02d}.png')
        actual=normalized(page.get_text())
        for item in layout:
            if item['slide']==i+1 and normalized(item['text']) not in actual:
                missing.append(dict(slide=i+1,text=item['text']))
        fonts.update(x[3] for x in page.get_fonts())
    width,height,caption=480,270,32
    sheet=Image.new('RGB',(width*3,(height+caption)*5),'#D4DFE5')
    draw=ImageDraw.Draw(sheet)
    for i in range(15):
        im=Image.open(previews/f'slide-{i+1:02d}.png')
        im.thumbnail((width,height))
        x,y=i%3*width,i//3*(height+caption)
        sheet.paste(im,(x,y))
        draw.text((x+12,y+height+7),f'PAGE {i+1:02d}',fill='#16344B')
    sheet.save(previews/'contact-sheet.jpg',quality=94)
    report=dict(renderer='LibreOffice',pdf_pages=len(doc),previews=15,
                resolution='1600 × 900 px',fonts=sorted(fonts),missing_text=missing,
                text_retention='passed' if not missing else 'failed',
                visual_review='See contact-sheet.jpg and individual PNG files; records in 使用说明.md')
    (BASE/'render_validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps(report,ensure_ascii=False,indent=2))
    assert not missing, 'Possible clipping or text loss; inspect render_validation.json'


if __name__=='__main__':
    main()
