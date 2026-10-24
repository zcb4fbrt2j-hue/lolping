// Added 2026-10-24, lolping. Reusable, outline-driven photographic layouts.
// Apache-2.0, as the containing presentation-skill distribution.
'use strict';
const fs = require('fs');
const { imageSize } = require('image-size');
const C = {navy:'09243A', blue:'007AB8', gold:'C6A768', white:'FFFFFF', ink:'18374A', muted:'486173', pale:'EFF4F6'};
function text(s,t,x,y,w,h,size,color=C.ink,bold=false,extra={}) {
  s.addText(t,{x,y,w,h,fontFace:'Noto Sans CJK SC',fontSize:size,color,bold,
    margin:0,breakLine:false,valign:'mid',paraSpaceAfter:0,...extra});
}
function rect(p,s,x,y,w,h,color,transparency=0) {
  s.addShape(p.ShapeType.rect,{x,y,w,h,line:{color,transparency:100},fill:{color,transparency}});
}
function photo(p,s,f,x,y,w,h) {
  if(!f) throw new Error('photo-editorial requires resolved figure assets');
  const size=imageSize(fs.readFileSync(f));
  // PptxGenJS 4 computes crop from supplied dimensions, not file dimensions.
  // Supply the original aspect first; sizing then sets the target viewport.
  s.addImage({path:f,x,y,w,h:w*size.height/size.width,sizing:{type:'cover',w,h}});
}
function footer(s,d,dark=false) {
  text(s,d.source_line||'',.5,5.28,8.6,.2,8.8,dark?'C8D8E0':C.muted);
  text(s,String(d.__slideIndex).padStart(2,'0'),9.25,5.27,.25,.22,9,dark?'C8D8E0':C.muted,false,{align:'right'});
}
function render(p,s,d) {
  const f=d.__figurePaths||[];const a=d.editorial||{};
  s.background={color:C.white};
  if(a.layout==='diptych-cover') {
    s.background={color:C.navy};
    text(s,a.eyebrow,.5,.34,8.8,.24,10,C.gold);
    text(s,d.title,.5,.91,9, .76,35,C.white,true);
    text(s,d.subtitle,.52,1.76,8.9,.34,14.5,'D4E1E8');
    text(s,a.theme,.52,2.19,8.9,.27,14,C.gold,true);
    photo(p,s,f[0],0,2.65,4.99,2.36);
    photo(p,s,f[1],5.01,2.65,4.99,2.36);
    rect(p,s,0,4.58,10,.43,C.navy,12);
    text(s,a.captions[0],.5,4.68,4.1,.21,10,C.white);
    text(s,a.captions[1],5.3,4.68,4.2,.21,10,C.white);
    footer(s,d,true);
  } else if(a.layout==='heritage-spread') {
    text(s,a.eyebrow,.5,.3,8.8,.22,10,C.blue);
    text(s,d.title,.5,.77,9,.55,27,C.navy,true);
    photo(p,s,f[0],.5,1.65,5.2,2.96);
    text(s,a.caption,.5,4.74,5.2,.22,10.5,C.muted);
    a.points.forEach((v,i)=>{
      const y=1.58+i*1.13;
      text(s,v.heading,6.1,y,3.35,.33,18,C.navy,true);
      text(s,v.body,6.1,y+.4,3.35,.65,14,C.muted);
    });
    footer(s,d);
  } else if(a.layout==='strategy-scene') {
    text(s,a.eyebrow,.5,.3,9,.22,10,C.blue);
    text(s,d.title,.5,.76,9,.58,27,C.navy,true);
    photo(p,s,f[0],.5,1.64,5.2,2.44);
    text(s,a.case_note,.5,4.22,5.2,.23,11.5,C.navy,true);
    text(s,a.caption,.5,4.55,5.2,.19,8.6,C.muted);
    rect(p,s,6.05,1.64,3.45,2.97,C.navy);
    text(s,a.main_label,6.3,1.92,2.95,.28,12,C.gold);
    text(s,a.main_claim,6.3,2.39,2.95,1.28,22,C.white,true);
    text(s,a.scene_label,6.3,3.85,2.95,.6,12,'D4E1E8');
    text(s,a.takeaway,.5,4.81,9,.25,13.5,C.navy,true);
    footer(s,d);
  } else throw new Error('Unknown photo-editorial layout: '+a.layout);
  if(d.notes) s.addNotes(d.notes);
}
module.exports={render};
