// Added 2026-10-25, lolping. Apache-2.0 as the containing skill.
// Structured outline renderer; existing V2/V3 templates remain unchanged.
'use strict';
const C={navy:'09243A',blue:'007AB8',gold:'C6A768',white:'FFFFFF',
  ink:'18374A',muted:'486173',pale:'EDF3F6',line:'B6C8D2'};
function t(s,v,x,y,w,h,size=14,color=C.ink,bold=false,extra={}) {
  s.addText(v,{x,y,w,h,fontFace:'Noto Sans CJK SC',fontSize:size,
    color,bold,margin:0,valign:'mid',paraSpaceAfter:0,isTextBox:true,...extra});
}
function box(p,s,x,y,w,h,color,lineColor=color) {
  s.addShape(p.ShapeType.rect,{x,y,w,h,line:{color:lineColor,transparency:lineColor===color?100:0},fill:{color}});
}
function header(s,d,dark=false) {
  t(s,d.editorial.eyebrow,.5,.31,9,.24,10,dark?C.gold:C.blue);
  t(s,d.title,.5,.75,9,.60,d.title.length>22?25.5:28,dark?C.white:C.navy,true);
  if(d.subtitle)t(s,d.subtitle,.5,1.43,9,.30,13.2,dark?'C7D9E3':C.muted);
}
function footer(s,d,dark=false) {
  t(s,d.source_line||'',.5,5.30,8.65,.22,8.8,dark?'C7D9E3':C.muted);
  t(s,String(d.__slideIndex).padStart(2,'0'),9.22,5.30,.28,.22,9,dark?'C7D9E3':C.muted,false,{align:'right'});
}
function rows(s,items,x,y,w,step=1,head=17,body=13.6,dark=false,bodyH=.55) {
  items.forEach((a,i)=>{
    t(s,a.heading,x,y+i*step,w,.34,head,dark?C.white:C.navy,true);
    t(s,a.body,x,y+i*step+.43,w,bodyH,body,dark?'D0DFE7':C.muted);
  });
}
function render(p,s,d) {
  const a=d.editorial;
  const dark=['autonomy','ending'].includes(a.layout);
  s.background={color:dark?C.navy:C.white};
  header(s,d,dark);
  if(a.layout==='material-craft') {
    t(s,a.figure_title,.5,1.78,4.15,.35,18,C.navy,true);
    box(p,s,.78,2.45,1.67,1.19,'C6B382');
    box(p,s,2.75,2.45,1.67,1.19,'C6B382');
    box(p,s,2.45,2.45,.30,1.19,C.blue);
    t(s,'木板',1.20,2.84,.85,.32,16,C.navy,true);
    t(s,'木板',3.17,2.84,.85,.32,16,C.navy,true);
    t(s,a.materials,.5,3.91,4.15,.40,16,C.blue,true,{align:'center'});
    t(s,a.figure_caption,.5,4.39,4.15,.26,10,C.muted,false,{align:'center'});
    rows(s,a.points,5.05,1.78,4.45,.98,17,13.6);
    t(s,a.takeaway,.5,4.78,9,.33,14.1,C.navy,true);
  } else if(a.layout==='transformation') {
    a.sides.forEach((v,i)=>{
      const x=i===0?.5:5.15;const fg=i===0?C.white:C.navy;
      box(p,s,x,1.72,4.35,2.83,i===0?C.navy:C.pale);
      t(s,v.label,x+.25,1.96,3.85,.37,19,fg,true);
      t(s,v.keyword,x+.25,2.66,3.85,.53,27,i===0?C.gold:C.blue,true);
      t(s,v.body,x+.25,3.45,3.85,.64,14,i===0?'D0DFE7':C.muted);
    });
    t(s,a.takeaway,.5,4.78,9,.34,14.8,C.navy,true);
  } else if(a.layout==='demands') {
    a.points.forEach((v,i)=>{
      const x=.5+i*3.16;
      t(s,String(i+1).padStart(2,'0'),x,1.76,2.68,.49,27,C.line,true);
      t(s,v.heading,x,2.42,2.68,.38,20,C.navy,true);
      t(s,v.body,x,3.08,2.68,.70,14,C.muted);
      t(s,v.demand,x,4.12,2.68,.40,20,C.blue,true);
    });
    t(s,a.takeaway,.5,4.81,9,.31,13.7,C.navy,true);
  } else if(a.layout==='case-opening') {
    box(p,s,.5,1.66,9,1.10,C.navy);
    t(s,a.project_title,.75,1.79,8.50,.82,22,C.white,true);
    t(s,a.case_meta,.5,2.96,9,.31,12.5,C.muted);
    a.questions.forEach((v,i)=>{
      const x=.5+i*3.16;
      t(s,v.heading,x,3.61,2.68,.36,18,C.blue,true);
      t(s,v.body,x,4.15,2.68,.63,14,C.ink);
    });
  } else if(a.layout==='coating-system') {
    t(s,a.environment,.8,1.62,4.15,.28,11,C.muted);
    const colors=[C.blue,'4F7D99',C.navy,'CEDAE1'];
    a.layers.forEach((v,i)=>{
      const y=2.11+i*.64;
      box(p,s,.8,y,4.15,.49,colors[i]);
      t(s,v,.96,y+.075,3.83,.31,14.5,i===3?C.navy:C.white,true);
    });
    t(s,a.figure_caption,.8,4.79,4.15,.26,9.8,C.muted);
    rows(s,a.points,5.55,1.89,3.95,1.05,17,13.5);
  } else if(a.layout==='transfer') {
    t(s,a.fact_label,.5,1.64,9,.30,12,C.blue,true);
    t(s,a.fact,.5,2.10,9,.95,24,C.navy,true);
    t(s,a.analysis_label,.5,3.29,9,.27,11.5,C.blue,true);
    a.steps.forEach((v,i)=>{
      const x=.5+i*3.16;
      t(s,v.heading,x,3.86,2.68,.33,17,C.navy,true);
      t(s,v.body,x,4.31,2.68,.57,13,C.muted);
    });
  } else if(a.layout==='autonomy') {
    t(s,a.goal,.5,1.70,4.55,.39,17,C.gold,true);
    t(s,a.main_claim,.5,2.29,4.55,1.14,28,C.white,true);
    t(s,a.explanation,.5,3.75,4.55,.75,14,'D0DFE7');
    rows(s,a.points,5.65,1.75,3.85,1.03,17,13.6,true);
    t(s,a.takeaway,.5,4.80,9,.31,14,C.gold,true);
  } else if(a.layout==='productivity') {
    t(s,a.definition,.5,1.62,9,.37,14,C.muted);
    box(p,s,.5,2.24,9,.74,C.pale);
    t(s,a.fact,.72,2.42,8.56,.35,17,C.navy,true);
    a.points.forEach((v,i)=>{
      const x=.5+i*3.16;
      t(s,v.heading,x,3.40,2.68,.36,18,C.blue,true);
      t(s,v.body,x,3.98,2.68,.70,14,C.muted);
    });
    t(s,a.takeaway,.5,4.80,9,.31,14.1,C.navy,true);
  } else if(a.layout==='ecology') {
    t(s,a.main_claim,.5,1.67,9,.49,22,C.navy,true);
    t(s,a.theory_label,.5,2.30,9,.31,13.2,C.blue,true);
    a.stages.forEach((v,i)=>{
      const x=.5+i*2.35;
      t(s,v.heading,x,3.03,1.95,.34,16.5,C.navy,true);
      t(s,v.body,x,3.57,1.95,.63,13,C.muted);
    });
    box(p,s,.5,4.52,9,.55,C.navy);
    t(s,a.takeaway,.7,4.65,8.6,.29,13.5,C.white,true);
  } else if(a.layout==='youth') {
    t(s,a.main_claim,.5,1.67,9,.47,22,C.navy,true);
    a.actions.forEach((v,i)=>{
      const x=.5+i*3.16;
      t(s,v.heading,x,2.57,2.68,.57,30,C.blue,true);
      t(s,v.label,x,3.40,2.68,.35,16,C.navy,true);
      t(s,v.body,x,4.00,2.68,.64,13.5,C.muted);
    });
    t(s,a.takeaway,.5,4.81,9,.30,13.3,C.navy,true);
  } else if(a.layout==='fieldnotes') {
    t(s,a.status,.5,1.63,9,.33,14,C.blue,true);
    box(p,s,.5,2.28,4.22,2.53,C.pale);
    t(s,a.record_title,.75,2.55,3.72,.35,17,C.navy,true);
    t(s,a.record_fields,.75,3.18,3.72,1.05,13.5,C.muted);
    rows(s,a.questions,5.23,2.18,4.27,.89,17,13.5,false,.34);
  } else if(a.layout==='ending') {
    t(s,a.main_claim,.5,1.79,9,1.10,28,C.white,true);
    t(s,a.explanation,.5,3.23,9,.65,17,'D0DFE7');
    t(s,a.closing,.5,4.16,9,.77,19,C.gold,true);
  } else if(a.layout==='references') {
    a.references.forEach((v,i)=>{
      const x=i<4?.5:5.2;const y=1.66+(i%4)*.81;
      t(s,v.heading,x,y,4.3,.29,12.4,C.navy,true);
      t(s,v.detail,x,y+.37,4.3,.35,10.2,C.muted,false,
        v.url?{hyperlink:{url:v.url,tooltip:v.url}}:{});
    });
    t(s,a.note,.5,5.01,9,.22,9.5,C.blue);
  } else throw new Error('Unknown course-report layout: '+a.layout);
  footer(s,d,dark);
  if(d.notes)s.addNotes(d.notes);
}
module.exports={render};
