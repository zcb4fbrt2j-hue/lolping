// Added 2026-10-25, lolping. Apache-2.0 as the containing skill.
// Opt-in, outline-driven layouts. Existing photo_editorial layouts stay intact.
'use strict';
const fs = require('fs');
const { imageSize } = require('image-size');
const C = {navy:'09243A', blue:'007AB8', gold:'C6A768', white:'FFFFFF',
  ink:'18374A', muted:'486173', pale:'EDF3F6', darkPale:'13364B'};
function txt(s,t,x,y,w,h,size,color=C.ink,bold=false,extra={}) {
  s.addText(t,{x,y,w,h,fontFace:'Noto Sans CJK SC',fontSize:size,color,bold,
    margin:0,valign:'mid',paraSpaceAfter:0,...extra});
}
function photo(s,file,box,name,alt) {
  if(!file) throw new Error('A verified, resolved photograph is required: '+name);
  const size=imageSize(fs.readFileSync(file));
  const {x,y,w,h}=box;
  // Supply the original aspect before applying cover (PptxGenJS 4.0.1).
  s.addImage({path:file,x,y,w,h:w*size.height/size.width,
    sizing:{type:'cover',w,h},objectName:name,altText:alt});
}
function reservation(p,s,box,spec,dark=false) {
  // A native rectangle establishes photo geometry; a separate compact label
  // can be removed with the frame when a photograph is inserted.
  s.addShape(p.ShapeType.rect,{...box,objectName:spec.id,
    fill:{color:dark?C.darkPale:C.pale},
    line:{color:dark?'5E8095':'9EB4C1',width:1,dashType:'dash'}});
  txt(s,spec.label,box.x+.12,box.y+box.h/2-.36,box.w-.24,.72,
    dark?12.4:15.4,dark?'C7D8E1':C.muted,false,
    {align:'center',objectName:spec.id+'_LABEL'});
}
function foot(s,d,dark=false) {
  txt(s,d.source_line,.5,5.30,8.65,.22,8.8,dark?'C6D6E0':C.muted);
  txt(s,String(d.__slideIndex).padStart(2,'0'),9.22,5.30,.28,.22,9,
    dark?'C6D6E0':C.muted,false,{align:'right'});
}
function render(p,s,d) {
  const a=d.editorial, f=d.__figurePaths||[];
  s.background={color:C.white};
  if(a.layout==='museum-cover') {
    s.background={color:C.navy};
    txt(s,a.eyebrow,.5,.31,8.9,.24,10.2,'CFDDE5');
    txt(s,a.theme,.5,.83,8.9,.30,15,C.gold,true);
    txt(s,d.title,.5,1.24,9,.65,34,C.white,true);
    txt(s,d.subtitle,.5,1.98,9,.30,13.8,'D4E1E8');
    const box={x:.5,y:2.45,w:4.36,h:2.18};
    if(f[0]) photo(s,f[0],box,'MUSEUM_COVER_PHOTO',a.museum_caption);
    else reservation(p,s,box,a.reservation,true);
    photo(s,f[1],{x:5.14,y:2.45,w:4.36,h:2.18},'COVER_ONLY_COSCO_UNIVERSE',a.modern_alt);
    txt(s,a.museum_caption,.5,4.77,4.36,.30,9.0,'C6D6E0');
    txt(s,a.modern_caption,5.14,4.77,4.36,.30,9.0,'C6D6E0');
    foot(s,d,true);
  } else if(a.layout==='museum-heritage') {
    txt(s,a.eyebrow,.5,.31,9,.23,10,C.blue);
    txt(s,d.title,.5,.74,9,.57,29,C.navy,true);
    txt(s,d.subtitle,.5,1.47,9,.28,13.5,C.muted);
    const box={x:.5,y:1.89,w:5.65,h:3.178125};
    if(f[0]) photo(s,f[0],box,'MUSEUM_HERITAGE_PHOTO',a.museum_caption);
    else reservation(p,s,box,a.reservation);
    // An inserted photograph can carry its verified exhibit/photographer
    // caption in a native band; the reservation itself stays undecorated.
    if(f[0]) {
      s.addShape(p.ShapeType.rect,{x:.5,y:4.65,w:5.65,h:.418125,
        line:{transparency:100},fill:{color:C.navy,transparency:10}});
      txt(s,a.museum_caption,.62,4.70,5.41,.30,8.8,C.white);
    }
    a.points.forEach((v,i)=>{
      const y=1.87+i*1.07;
      txt(s,v.heading,6.5,y,3,.34,16,C.navy,true);
      txt(s,v.body,6.5,y+.43,3,.56,12.9,C.muted);
    });
    foot(s,d);
  } else if(a.layout==='museum-strategy') {
    txt(s,a.eyebrow,.5,.31,9,.23,10,C.blue);
    txt(s,d.title,.5,.74,9,.58,27,C.navy,true);
    txt(s,a.main_claim,.5,1.65,3.55,1.00,24,C.navy,true);
    txt(s,a.theory_label,.5,2.83,3.55,.30,15,C.blue,true);
    txt(s,a.case_text,.5,3.25,3.55,.79,13.1,C.ink);
    txt(s,a.implication,.5,4.23,3.55,.35,12.5,C.navy,true);
    photo(s,f[0],{x:4.45,y:1.65,w:5.05,h:2.56},'BODY_YANGSHAN_2013',a.photo_alt);
    txt(s,a.photo_caption,4.45,4.28,5.05,.38,9.0,C.muted);
    txt(s,a.relation,.5,4.75,9,.35,13.5,C.blue,true);
    foot(s,d);
  } else throw new Error('Unknown museum-editorial layout: '+a.layout);
  if(d.notes) s.addNotes(d.notes);
}
module.exports={render};
