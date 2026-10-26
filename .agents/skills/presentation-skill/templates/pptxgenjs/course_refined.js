// Added 2026-10-25, lolping. Apache-2.0 as the containing skill.
// Modified 2026-10-26: scoped coursework explanation/theory links; same design.
'use strict';
const fs=require('fs');
const {imageSize}=require('image-size');
const C={navy:'09243A',blue:'007AB8',gold:'C6A768',white:'FFFFFF',ink:'18374A',
  muted:'486173',pale:'EDF3F6',soft:'DCE8EE',line:'A5BBC8',light:'C9DBE5'};
function t(s,v,x,y,w,h,size=15,color=C.ink,bold=false,extra={}) {
  s.addText(v,{x,y,w,h,fontFace:'Noto Sans CJK SC',fontSize:size,color,bold,
    margin:0,valign:'mid',paraSpaceAfter:0,isTextBox:true,...extra});
}
function r(p,s,x,y,w,h,color,extra={}) {
  s.addShape(p.ShapeType.rect,{x,y,w,h,line:{color,transparency:100},fill:{color},...extra});
}
function photo(s,file,x,y,w,h,name,alt) {
  if(!file)throw new Error('Missing verified photograph: '+name);
  const z=imageSize(fs.readFileSync(file));
  s.addImage({path:file,x,y,w,h:w*z.height/z.width,sizing:{type:'cover',w,h},objectName:name,altText:alt});
}
function frame(p,s,slot,dark=false) {
  const x=slot.x_in,y=slot.y_in,w=slot.w_in,h=slot.h_in;
  // Bind the shape to a type=pic layout placeholder. Its prompt is editable;
  // inserting a photo replaces it rather than covering a separate text label.
  s.addText('',{placeholder:slot.id,objectName:slot.id,x,y,w,h,
    fontFace:'Noto Sans CJK SC',fontSize:dark?13.2:14.3,
    color:dark?C.light:C.muted,align:'center',valign:'mid',margin:.16,
    fill:{color:dark?'15394F':C.pale},
    line:{color:dark?'6F91A7':C.line,width:.8,dashType:'dash'},
    paraSpaceAfter:0,isTextBox:false});
  // LibreOffice omits empty-placeholder prompts in PDF/PNG. Keep the guidance
  // visible as a separate, editable label; delete it after inserting a photo.
  t(s,slot.label,x+.13,y+h/2-.40,w-.26,.80,dark?13.2:14.3,
    dark?C.light:C.muted,false,{align:'center',objectName:slot.id+'_LABEL'});
}
function prepare(p,d) {
  const slot=d.editorial.reservation;
  // Modified 2026-10-26: a filled photo slot needs no empty layout placeholder.
  if(!slot||(d.__figurePaths||[])[0])return null;
  const name='PHOTO_LIGHT_'+d.__slideIndex;
  p.defineSlideMaster({title:name,objects:[{placeholder:{text:'',
    options:{name:slot.id,type:'image',objectName:slot.id,
      x:slot.x_in,y:slot.y_in,w:slot.w_in,h:slot.h_in}}}]});
  return name;
}
function header(s,d,dark=false) {
  t(s,d.editorial.eyebrow,.5,.30,9,.25,10.3,dark?C.gold:C.blue);
  t(s,d.title,.5,.76,9,.65,d.title.length>22?28:31,dark?C.white:C.navy,true);
  if(d.subtitle)t(s,d.subtitle,.5,d.__slideIndex===8?1.42:1.46,9,d.__slideIndex===8?.27:.30,
    d.__slideIndex===8?13.5:14,dark?C.light:C.muted);
}
function footer(s,d,dark=false) {
  const size=(d.source_line||'').length>62?8.8:9.3;
  t(s,d.source_line||'',.5,5.22,8.65,.24,size,dark?C.light:C.muted);
  t(s,String(d.__slideIndex).padStart(2,'0'),9.22,5.22,.28,.24,9.5,dark?C.light:C.muted,false,{align:'right'});
}
function list(s,items,x,y,w,{step=1.05,head=18,body=14.4,dark=false,bodyH=.57,headH=.48,bodyOffset=.55}={}) {
  items.forEach((v,i)=>{
    t(s,v.heading,x,y+i*step,w,headH,head,dark?C.white:C.navy,true);
    t(s,v.body,x,y+i*step+bodyOffset,w,bodyH,body,dark?C.light:C.muted);
  });
}
function photoCaption(p,s,a,x,y,w,h=.46) {
  t(s,a.caption,x,y,w,h,9.2,C.muted);
}
function render(p,s,d) {
  const a=d.editorial,f=d.__figurePaths||[],q=a.screen||{};
  const dark=['cover','craft','case','capacity','youth','ending','shanghai'].includes(a.polish_layout);
  s.background={color:dark?C.navy:a.polish_layout==='ecology'?C.pale:C.white};
  if(a.polish_layout==='cover') {
    t(s,a.eyebrow,.5,.30,9,.25,10.5,C.light);
    t(s,'科技强国  /  材料智慧 · 向海图强',.5,.79,9,.31,14,C.gold,true);
    t(s,d.title,.5,1.14,9,.87,45,C.white,true);
    t(s,d.subtitle,.5,2.11,9,.31,13.4,C.light);
    if(f[0])photo(s,f[0],.5,2.53,4.36,2.18,'MUSEUM_COVER_PHOTO',a.museum_caption);
    else frame(p,s,a.reservation,true);
    photo(s,f[1],5.14,2.53,4.36,2.18,'COVER_ONLY_COSCO_UNIVERSE',a.modern_alt);
    t(s,a.museum_caption,.5,4.78,4.36,.25,9.2,C.light);
    t(s,a.modern_caption,5.14,4.78,4.36,.25,9.2,C.light);
  } else if(a.polish_layout==='heritage') {
    header(s,d);
    if(f[0])photo(s,f[0],.5,1.89,5.65,3.178125,'MUSEUM_HERITAGE_PHOTO',a.museum_caption);
    else frame(p,s,a.reservation);
    list(s,q.points,6.52,1.88,2.98,{step:1.06,head:17,body:13.4,headH:.42,bodyOffset:.45,bodyH:.56});
    if(f[0]) {
      r(p,s,.5,4.63,5.65,.438125,C.navy);
      t(s,a.museum_caption,.62,4.70,5.41,.29,9,C.white);
    }
  } else if(a.polish_layout==='craft') {
    header(s,d,true);
    t(s,a.figure_title,.5,1.81,4.1,.39,19,C.white,true);
    r(p,s,.7,2.51,1.73,1.18,C.gold);r(p,s,2.74,2.51,1.73,1.18,C.gold);
    r(p,s,2.43,2.51,.31,1.18,C.blue);
    t(s,'木板',1.12,2.92,.88,.34,17,C.navy,true);
    t(s,'木板',3.17,2.92,.88,.34,17,C.navy,true);
    t(s,a.materials,.5,3.98,4.1,.40,17,C.gold,true,{align:'center'});
    t(s,a.figure_caption,.5,4.39,4.1,.25,10,C.light,false,{align:'center'});
    list(s,q.points,5.15,1.80,4.35,{step:1.04,head:18,body:14,dark:true,headH:.43,bodyOffset:.46,bodyH:.62});
    t(s,'以求证推进守正创新',.5,4.70,4.1,.32,15,C.gold,true,{align:'center'});
  } else if(a.polish_layout==='shipbuilding') {
    header(s,d);
    a.sides.forEach((v,i)=>{
      const y=1.68+i*1.74;
      t(s,v.label,.5,y,3.05,.33,16,C.muted);
      t(s,v.keyword,.5,y+.34,3.05,.58,26,C.blue,true);
      t(s,q.bodies[i],.5,y+.96,3.05,.54,14.4,C.ink);
    });
    photo(s,f[0],3.95,1.73,5.55,2.99,'BODY_JIANGNAN_2022',a.photo.caption);
    photoCaption(p,s,a.photo,3.95,4.79,5.55,.25);
  } else if(a.polish_layout==='demands-photo') {
    header(s,d);
    photo(s,f[0],.5,1.76,4.30,2.98,'BODY_CHIWAN_JACKET_2008',a.photo.caption);
    t(s,'赤湾导管架，2008｜SteKrueBe · CC BY-SA 3.0',.5,4.81,4.3,.22,8.7,C.muted);
    a.points.forEach((v,i)=>{
      const y=1.76+i*1.10;
      t(s,v.heading,5.15,y,2.0,.35,18,C.navy,true);
      t(s,v.demand,7.42,y,2.08,.35,18,C.blue,true,{align:'right'});
      t(s,q.bodies[i],5.15,y+.43,4.35,.42,15,C.muted);
    });
  } else if(a.polish_layout==='case') {
    header(s,d,true);
    t(s,a.project_title,.5,1.85,4.02,1.10,24.5,C.white,true);
    t(s,a.case_meta.replace('  /  ','\n'),.5,3.14,4.02,.71,12.7,C.gold);
    q.questions.forEach((v,i)=>t(s,v,.5,4.05+i*.34,4.02,.31,14.8,C.white,true));
    if(f[0]) {
      photo(s,f[0],a.reservation.x_in,a.reservation.y_in,a.reservation.w_in,a.reservation.h_in,a.reservation.id,a.photo?a.photo.alt:a.reservation.suggested_content);
      if(a.photo&&a.photo.overlay_caption) {
        const b=a.reservation,cy=b.y_in+b.h_in-.56;
        // Cover the image's anti-aliased bottom edge in LibreOffice exports.
        r(p,s,b.x_in-.01,cy,b.w_in+.02,.57,C.navy);
        t(s,a.photo.overlay_caption,b.x_in+.12,cy+.06,b.w_in-.24,.44,9.1,C.light);
      }
    } else frame(p,s,a.reservation,true);
  } else if(a.polish_layout==='coating') {
    header(s,d);
    t(s,a.environment,.7,1.62,4.7,.29,11.6,C.muted);
    const bars=[{y:2.02,h:.58,c:C.blue,label:a.layers[0]},
      {y:2.60,h:.36,c:C.gold,label:a.layers[1]},
      {y:2.96,h:.82,c:C.navy,label:a.layers[2]},
      {y:3.78,h:.70,c:'CEDAE1',label:a.layers[3]}];
    bars.forEach((v,i)=>{
      r(p,s,.7,v.y,4.7,v.h,v.c);
      const labelH=i===1?.30:.44;
      t(s,v.label,.95,v.y+(v.h-labelH)/2,4.2,labelH,i===1?13.4:17,
        i===1||i===3?C.navy:C.white,true);
    });
    const pts=[q.points[1],q.points[2],q.points[0]];
    list(s,pts,6.03,1.82,3.47,{step:1.08,head:16.8,body:14.0});
    [[2.31,2.02],[2.78,3.10],[3.37,4.18]].forEach(([y,to])=>{
      s.addShape(p.ShapeType.line,{x:5.42,y:Math.min(y,to),w:.42,h:Math.abs(to-y),
        flipV:y>to,line:{color:C.line,width:1.1}});
    });
    t(s,a.figure_caption,.7,4.70,4.7,.31,10.1,C.muted);
  } else if(a.polish_layout==='engineering-photo') {
    header(s,d);
    photo(s,f[0],.5,1.75,5.60,2.85,'BODY_LAN_JING_2019',a.photo.caption);
    photoCaption(p,s,a.photo,.5,4.64,5.60,.38);
    t(s,a.fact_label,6.35,1.75,3.15,.29,11.4,C.blue,true);
    t(s,q.fact,6.45,2.13,3.05,1.12,19,C.navy,true);
    t(s,a.analysis_label,6.35,3.58,3.15,.27,10.8,C.blue,true);
    q.steps.forEach((v,i)=>{
      t(s,v,6.45,4.0+i*.35,3.05,.31,16,C.navy,true);
    });
  } else if(a.polish_layout==='capacity') {
    header(s,d,true);
    t(s,'2035',.5,1.70,4.2,1.23,62,C.gold,true);
    t(s,a.goal,.5,3.00,4.55,.37,16,C.gold,true);
    t(s,q.main_claim,.5,3.60,4.70,1.01,23.5,C.white,true);
    list(s,q.points,5.65,1.75,3.85,{step:1.10,head:17.5,body:13.4,dark:true,headH:.43,bodyOffset:.46,bodyH:.60});
  } else if(a.polish_layout==='productivity') {
    header(s,d);
    t(s,a.definition,.5,1.50,9,.31,13.4,C.muted);
    t(s,'案例事实',.5,1.95,3.65,.28,11,C.blue,true);
    t(s,q.fact,.5,2.28,3.65,.79,22,C.navy,true);
    q.points.forEach((v,i)=>{
      t(s,v[0],.5,3.13+i*.64,1.4,.35,16.5,C.blue,true);
      t(s,v[1],2.05,3.13+i*.64,2.1,.59,13.0,C.muted);
    });
    if(f[0])photo(s,f[0],a.reservation.x_in,a.reservation.y_in,a.reservation.w_in,a.reservation.h_in,a.reservation.id,a.reservation.suggested_content);
    else frame(p,s,a.reservation);
  } else if(a.polish_layout==='ecology') {
    header(s,d);
    t(s,a.main_claim.replace('是人与自然','是\n人与自然'),.5,1.80,4.05,1.25,22,C.navy,true);
    t(s,q.theory_label,.5,3.35,4.05,.91,15,C.blue,true);
    q.stages.forEach((v,i)=>{
      const x=5.15+(i%2)*2.28,y=1.87+Math.floor(i/2)*1.42;
      t(s,v[0],x,y,2.07,.35,18,C.navy,true);
      t(s,v[1],x,y+.49,2.07,.60,14.3,C.muted);
    });
    r(p,s,.5,4.50,9,.50,C.navy);
    t(s,q.takeaway,.70,4.60,8.6,.30,14.3,C.white,true);
  } else if(a.polish_layout==='shanghai') {
    photo(s,f[0],4.61,0,5.39,5.10,'BODY_YANGSHAN_2013',a.photo_alt);
    t(s,a.eyebrow,.5,.31,4.0,.57,10.3,C.gold);
    t(s,d.title.replace('到上海','到\n上海'),.5,1.02,3.70,1.13,30,C.white,true);
    t(s,a.main_claim,.5,2.43,3.70,.88,24,C.white,true);
    t(s,a.theory_label,.5,3.48,3.70,.31,13.2,C.gold,true);
    t(s,q.case_text,.5,3.96,3.70,.91,13.3,C.light);
    r(p,s,4.61,4.50,5.39,.62,C.navy);
    t(s,a.photo_caption,4.80,4.60,4.68,.40,9.0,C.white);
  } else if(a.polish_layout==='youth') {
    header(s,d,true);
    if(f[0])photo(s,f[0],a.reservation.x_in,a.reservation.y_in,a.reservation.w_in,a.reservation.h_in,a.reservation.id,a.reservation.suggested_content);
    else frame(p,s,a.reservation,true);
    t(s,q.main_claim,5.35,1.85,4.15,.96,26,C.white,true);
    q.actions.forEach((v,i)=>{
      t(s,v[0],5.35,2.93+i*.73,1.05,.40,19,C.gold,true);
      t(s,v[1],6.62,2.93+i*.73,2.88,.62,13.5,C.white);
    });
  } else if(a.polish_layout==='fieldnotes') {
    header(s,d);
    if(f[0])photo(s,f[0],a.reservation.x_in,a.reservation.y_in,a.reservation.w_in,a.reservation.h_in,a.reservation.id,a.reservation.suggested_content);
    else frame(p,s,a.reservation);
    list(s,q.questions.map(v=>({heading:v[0],body:v[1]})),6.52,1.92,2.98,
      {step:1.09,head:19,body:13.4,bodyH:.47});
  } else if(a.polish_layout==='ending') {
    header(s,d,true);
    t(s,q.main_claim,.5,1.88,9,1.48,38,C.white,true);
    t(s,q.closing,.5,3.92,9,.96,22,C.gold,true);
  } else if(a.polish_layout==='references') {
    header(s,d);
    a.references.forEach((v,i)=>{
      const x=i<6?.5:5.2,y=1.65+(i%6)*.53;
      t(s,v.heading,x,y,4.30,.25,10.8,C.navy,true);
      t(s,v.detail,x,y+.28,4.30,.24,9.3,C.muted,false,
        v.url?{hyperlink:{url:v.url,tooltip:v.url}}:{});
    });
    // Reference detail guidance is consolidated in the normal footer and notes.
  } else throw new Error('Unknown visual-polish layout: '+a.polish_layout);
  footer(s,d,dark);
  if(d.notes)s.addNotes(d.notes);
}
module.exports={render,prepare};
