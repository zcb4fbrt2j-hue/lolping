// Added 2026-10-25, lolping. Apache-2.0 as the containing skill.
// Outline-driven refinement of the approved course report. No generated photos.
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
  r(p,s,x,y,w,h,dark?'15394F':C.pale,{objectName:slot.id,
    line:{color:dark?'6F91A7':C.line,width:1,dashType:'dash'}});
  t(s,slot.label,x+.12,y+h/2-.38,w-.24,.76,dark?13.2:15.2,
    dark?C.light:C.muted,false,{align:'center',objectName:slot.id+'_LABEL'});
}
function header(s,d,dark=false) {
  t(s,d.editorial.eyebrow,.5,.30,9,.25,10.3,dark?C.gold:C.blue);
  t(s,d.title,.5,.76,9,.61,d.title.length>22?27:30,dark?C.white:C.navy,true);
  if(d.subtitle)t(s,d.subtitle,.5,1.46,9,.30,14,dark?C.light:C.muted);
}
function footer(s,d,dark=false) {
  const size=(d.source_line||'').length>62?8.8:9.3;
  t(s,d.source_line||'',.5,5.22,8.65,.24,size,dark?C.light:C.muted);
  t(s,String(d.__slideIndex).padStart(2,'0'),9.22,5.22,.28,.24,9.5,dark?C.light:C.muted,false,{align:'right'});
}
function list(s,items,x,y,w,{step=1.05,head=18,body=14.4,dark=false,bodyH=.57}={}) {
  items.forEach((v,i)=>{
    t(s,v.heading,x,y+i*step,w,.35,head,dark?C.white:C.navy,true);
    t(s,v.body,x,y+i*step+.43,w,bodyH,body,dark?C.light:C.muted);
  });
}
function photoCaption(p,s,a,x,y,w,h=.46) {
  t(s,a.caption,x,y,w,h,9.2,C.muted);
}
function render(p,s,d) {
  const a=d.editorial,f=d.__figurePaths||[];
  const dark=['cover','craft','case','capacity','youth','ending','shanghai'].includes(a.polish_layout);
  s.background={color:dark?C.navy:a.polish_layout==='ecology'?C.pale:C.white};
  if(a.polish_layout==='cover') {
    t(s,a.eyebrow,.5,.30,9,.25,10.5,C.light);
    t(s,a.theme,.5,.79,9,.31,14,C.gold,true);
    t(s,d.title,.5,1.14,9,.87,44,C.white,true);
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
    list(s,a.points,6.52,1.86,2.98,{step:1.09,head:16.5,body:13.6});
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
    list(s,a.points,5.15,1.65,4.35,{step:1.02,head:18,body:14.1,dark:true});
    t(s,a.takeaway,.5,4.70,9,.32,14.3,C.gold,true);
  } else if(a.polish_layout==='shipbuilding') {
    header(s,d);
    a.sides.forEach((v,i)=>{
      const y=1.68+i*1.74;
      t(s,v.label,.5,y,3.05,.33,16,C.muted);
      t(s,v.keyword,.5,y+.34,3.05,.58,26,C.blue,true);
      t(s,v.body,.5,y+.96,3.05,.54,13.5,C.ink);
    });
    photo(s,f[0],3.95,1.73,5.55,2.85,'BODY_JIANGNAN_2022',a.photo.caption);
    photoCaption(p,s,a.photo,3.95,4.69,5.55,.30);
  } else if(a.polish_layout==='demands-photo') {
    header(s,d);
    photo(s,f[0],.5,1.76,4.05,2.72,'BODY_CHIWAN_JACKET_2008',a.photo.caption);
    photoCaption(p,s,a.photo,.5,4.59,4.05,.40);
    a.points.forEach((v,i)=>{
      const y=1.76+i*1.10;
      t(s,v.heading,4.96,y,2.20,.35,18,C.navy,true);
      t(s,v.demand,7.42,y,2.08,.35,18,C.blue,true,{align:'right'});
      t(s,v.body,4.96,y+.43,4.54,.59,14.6,C.muted);
    });
  } else if(a.polish_layout==='case') {
    header(s,d,true);
    t(s,a.project_title,.5,1.80,5.03,1.13,27,C.white,true);
    t(s,a.case_meta.replace('  /  ','\n'),.5,3.20,5.03,.75,14,C.gold);
    list(s,a.questions,6.03,1.82,3.47,{step:1.08,head:19,body:14.5,dark:true});
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
    const pts=[a.points[1],a.points[2],a.points[0]];
    list(s,pts,6.03,1.82,3.47,{step:1.08,head:16.8,body:14.0});
    [[2.31,2.02],[2.78,3.10],[3.37,4.18]].forEach(([y,to])=>{
      s.addShape(p.ShapeType.line,{x:5.42,y:Math.min(y,to),w:.42,h:Math.abs(to-y),
        flipV:y>to,line:{color:C.line,width:1.1}});
    });
    t(s,a.figure_caption,.7,4.70,4.7,.31,10.1,C.muted);
  } else if(a.polish_layout==='engineering-photo') {
    header(s,d);
    photo(s,f[0],.5,1.75,5.45,2.78,'BODY_LAN_JING_2019',a.photo.caption);
    photoCaption(p,s,a.photo,.5,4.63,5.45,.38);
    t(s,a.fact_label,6.35,1.75,3.15,.29,11.4,C.blue,true);
    t(s,a.fact.replace('成果实现产品','成果实现\n产品').replace('核电、海工','核电、\n海工'),6.35,2.10,3.15,1.32,18,C.navy,true);
    t(s,a.analysis_label,6.35,3.58,3.15,.27,10.8,C.blue,true);
    a.steps.forEach((v,i)=>{
      t(s,v.heading,6.35,4.0+i*.35,3.15,.31,15.0,C.navy,true);
    });
  } else if(a.polish_layout==='capacity') {
    header(s,d,true);
    t(s,'2035',.5,1.70,4.2,1.23,62,C.gold,true);
    t(s,a.goal,.5,3.00,4.55,.37,16,C.gold,true);
    t(s,a.main_claim,.5,3.60,4.55,1.01,25,C.white,true);
    list(s,a.points,5.65,1.80,3.85,{step:1.07,head:18,body:14.4,dark:true});
  } else if(a.polish_layout==='productivity') {
    header(s,d);
    t(s,a.definition,.5,1.50,9,.31,13.4,C.muted);
    r(p,s,.5,2.01,3.30,2.69,C.navy);
    t(s,a.fact.replace('：','：\n').replace('，','，\n'),.77,2.32,2.76,1.88,19.5,C.white,true);
    a.points.forEach((v,i)=>{
      t(s,v.heading,4.30,1.97+i*1.02,5.2,.35,18,C.navy,true);
      t(s,a.polish_summary[i],4.30,2.40+i*1.02,5.2,.35,15,C.muted);
    });
  } else if(a.polish_layout==='ecology') {
    header(s,d);
    t(s,a.main_claim.replace('是人与自然','是\n人与自然'),.5,1.80,4.05,1.25,22,C.navy,true);
    t(s,a.theory_label.replace('思想理解','思想\n理解'),.5,3.35,4.05,.91,15,C.blue,true);
    a.stages.forEach((v,i)=>{
      const x=5.15+(i%2)*2.28,y=1.87+Math.floor(i/2)*1.42;
      t(s,v.heading,x,y,2.07,.35,18,C.navy,true);
      t(s,v.body,x,y+.49,2.07,.60,14.3,C.muted);
    });
    r(p,s,.5,4.50,9,.50,C.navy);
    t(s,a.takeaway,.70,4.60,8.6,.30,13.3,C.white,true);
  } else if(a.polish_layout==='shanghai') {
    photo(s,f[0],4.61,0,5.39,5.10,'BODY_YANGSHAN_2013',a.photo_alt);
    t(s,a.eyebrow,.5,.31,4.0,.57,10.3,C.gold);
    t(s,d.title.replace('到上海','到\n上海'),.5,1.02,3.70,1.13,30,C.white,true);
    t(s,a.main_claim,.5,2.43,3.70,.88,24,C.white,true);
    t(s,a.theory_label,.5,3.48,3.70,.31,13.2,C.gold,true);
    t(s,a.case_text,.5,3.96,3.70,.79,13.3,C.light);
    r(p,s,4.61,4.50,5.39,.62,C.navy);
    t(s,a.photo_caption,4.80,4.60,4.68,.40,9.0,C.white);
  } else if(a.polish_layout==='youth') {
    header(s,d,true);
    t(s,a.main_claim.replace('，','，\n').replace('国家与产业需求','国家\n与产业需求'),.5,1.88,3.79,1.50,25,C.white,true);
    t(s,a.takeaway.replace('，','，\n'),.5,3.73,3.79,.90,14.7,C.gold,true);
    a.actions.forEach((v,i)=>{
      const y=1.86+i*1.06;
      t(s,v.heading+'｜'+v.label,4.91,y,4.59,.36,18,C.white,true);
      t(s,v.body,4.91,y+.45,4.59,.57,14.5,C.light);
    });
  } else if(a.polish_layout==='fieldnotes') {
    header(s,d);
    t(s,a.status,.5,1.62,9,.34,14.7,C.blue,true);
    r(p,s,.5,2.27,4.22,2.62,C.pale);
    t(s,a.record_title,.77,2.57,3.68,.38,19,C.navy,true);
    t(s,a.record_fields,.77,3.25,3.68,1.10,14.4,C.muted);
    list(s,a.questions,5.23,2.16,4.27,{step:.91,head:18,body:14.2,bodyH:.35});
  } else if(a.polish_layout==='ending') {
    header(s,d,true);
    t(s,a.main_claim,.5,1.92,9,1.20,31,C.white,true);
    t(s,a.explanation,.5,3.43,9,.69,18,C.light);
    t(s,a.closing,.5,4.16,9,.82,20,C.gold,true);
  } else if(a.polish_layout==='references') {
    header(s,d);
    a.references.forEach((v,i)=>{
      const x=i<4?.5:5.2,y=1.69+(i%4)*.76;
      t(s,v.heading,x,y,4.30,.30,12.5,C.navy,true);
      t(s,v.detail,x,y+.36,4.30,.40,10.3,C.muted,false,
        v.url?{hyperlink:{url:v.url,tooltip:v.url}}:{});
    });
    t(s,a.note,.5,4.91,9,.24,9.2,C.blue);
  } else throw new Error('Unknown visual-polish layout: '+a.polish_layout);
  footer(s,d,dark);
  if(d.notes)s.addNotes(d.notes);
}
module.exports={render};
