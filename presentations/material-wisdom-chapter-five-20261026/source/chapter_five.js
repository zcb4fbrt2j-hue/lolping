// Added 2026-10-26, lolping. Apache-2.0 as the containing skill.
// Opt-in chapter-five comparison/reflection/closing; earlier slides untouched.
'use strict';
const C={navy:'09243A',blue:'007AB8',gold:'C6A768',white:'FFFFFF',muted:'486173',
  light:'C9DBE5',pale:'EDF3F6',line:'A5BBC8'};
function t(s,v,x,y,w,h,size=15,color=C.navy,bold=false,extra={}) {
  s.addText(v,{x,y,w,h,fontFace:'Noto Sans CJK SC',fontSize:size,color,bold,
    margin:0,valign:'mid',paraSpaceAfter:0,isTextBox:true,...extra});
}
function rect(p,s,x,y,w,h,color) {
  s.addShape(p.ShapeType.rect,{x,y,w,h,line:{color,transparency:100},fill:{color}});
}
function frame(s,slot,dark=false,small=false) {
  const x=slot.x_in,y=slot.y_in,w=slot.w_in,h=slot.h_in;
  s.addText('',{placeholder:slot.id,objectName:slot.id,x,y,w,h,
    fill:{color:dark?'15394F':C.pale},line:{color:dark?'6F91A7':C.line,width:.8,dashType:'dash'},
    margin:.12,isTextBox:false});
  t(s,slot.label,x+.10,y+h/2-.38,w-.20,.76,small?11:14,
    dark?C.light:C.muted,false,{align:'center',objectName:slot.id+'_LABEL'});
}
function header(s,d,dark) {
  t(s,d.editorial.eyebrow,.5,.30,9,.25,10.3,dark?C.gold:C.blue);
  t(s,d.title,.5,.76,9,.65,31,dark?C.white:C.navy,true);
  if(d.subtitle)t(s,d.subtitle,.5,1.46,9,.30,14,dark?C.light:C.muted);
}
function render(p,s,d) {
  const a=d.editorial,q=a.screen,dark=a.polish_layout!=='heritage-reflection';
  s.background={color:dark?C.navy:C.white};header(s,d,dark);
  if(a.polish_layout==='then-and-now') {
    t(s,q.left.title,.5,1.84,4.15,.48,19,C.white,true);
    t(s,q.right.title,5.15,1.84,4.35,.48,19,C.white,true);
    frame(s,a.reservation,true,true);
    // Functional layers only; no molecular structure, thickness or test result.
    const layers=[['防污',C.blue,.37],['配套',C.gold,.23],['防腐',C.white,.37],['基材','8FA7B6',.23]];
    let y=2.42;
    layers.forEach(([label,color,h],i)=>{
      rect(p,s,5.15,y,1.8,h,color);
      t(s,label,5.23,y+.015,1.64,h-.03,i===1||i===3?10.3:12.5,i===0?C.white:C.navy,true,{align:'center'});
      y+=h;
    });
    t(s,'功能示意 · 非实测结构',5.15,3.67,1.8,.20,8.6,C.light,false,{align:'center'});
    [q.left,q.right].forEach((v,i)=>{
      const x=i?7.2:2.55;
      t(s,v.material,x,2.40,2.3,.55,14.5,C.white,true);
      t(s,v.method,x,3.11,2.3,.56,14,C.light);
      t(s,v.validation,i?5.15:.5,3.96,4.35,.34,18,C.gold,true);
      t(s,v.explanation,i?5.15:.5,4.35,4.35,.28,12.8,C.light);
    });
    t(s,q.takeaway,.5,4.78,9,.31,13.1,C.white,true);
  } else if(a.polish_layout==='heritage-reflection') {
    frame(s,a.reservation);
    q.questions.forEach((v,i)=>{
      const y=1.88+i*.94;
      t(s,v[0],5.95,y,3.55,.43,18,C.blue,true);
      t(s,v[1],5.95,y+.50,3.55,.40,14.2,C.muted);
    });
    t(s,q.takeaway,.5,4.84,9,.30,15,C.navy,true);
  } else if(a.polish_layout==='chapter-ending') {
    t(s,q.main_claim,.5,1.88,9,1.48,38,C.white,true);
    t(s,q.closing,.5,3.92,9,.96,22,C.gold,true);
  } else throw new Error('Unknown chapter-five layout: '+a.polish_layout);
  t(s,d.source_line,.5,5.22,8.65,.24,9.3,dark?C.light:C.muted);
  t(s,String(d.__slideIndex).padStart(2,'0'),9.22,5.22,.28,.24,9.5,
    dark?C.light:C.muted,false,{align:'right'});
  if(d.notes)s.addNotes(d.notes);
}
module.exports={render};
