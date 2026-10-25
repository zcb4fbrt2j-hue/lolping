#!/usr/bin/env python3
"""Complete native picture-placeholder OOXML before the builder writes its PPTX.

Added 2026-10-25, lolping; Apache-2.0. PptxGenJS 4.0.1 drops image -> pic
because its placeholder type map is checked twice. This opt-in serializer
repairs only explicitly declared slots in the in-memory ZIP stream; it never
opens or rewrites an existing presentation artifact.
"""
import io,json,sys
from zipfile import ZipFile,ZIP_DEFLATED
from lxml import etree

outline=json.load(open(sys.argv[1]))
names={s['editorial']['reservation']['id'] for s in outline['slides']
       if s.get('variant','').startswith('photo-light') and 'reservation' in s.get('editorial',{})}
ns={'p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
source=io.BytesIO(sys.stdin.buffer.read());target=io.BytesIO();found={k:0 for k in names}
with ZipFile(source) as src,ZipFile(target,'w',ZIP_DEFLATED) as dst:
    for info in src.infolist():
        data=src.read(info.filename)
        if info.filename.startswith(('ppt/slides/slide','ppt/slideLayouts/slideLayout')) and info.filename.endswith('.xml'):
            tree=etree.fromstring(data);changed=False
            for shape in tree.xpath('//p:sp',namespaces=ns):
                props=shape.find('p:nvSpPr/p:cNvPr',ns)
                ph=shape.find('p:nvSpPr/p:nvPr/p:ph',ns)
                if props is not None and props.get('name') in names and ph is not None:
                    ph.set('type','pic');changed=True
                    if info.filename.startswith('ppt/slides/'):found[props.get('name')]+=1
            if changed:data=etree.tostring(tree,encoding='UTF-8',xml_declaration=True,standalone=True)
        dst.writestr(info,data)
assert all(v==1 for v in found.values()),found
sys.stdout.buffer.write(target.getvalue())
