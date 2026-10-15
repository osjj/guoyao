import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const slug = "architectural-metalwork-packing-crating-guide";
const sourceDir = path.resolve("content/blog", slug, "diagrams");
const targetDir = path.resolve("public/images/blog", slug);
await fs.mkdir(sourceDir, { recursive: true });
await fs.mkdir(targetDir, { recursive: true });
const c = { paper: "#f5f2ec", ink: "#22231f", muted: "#6b6c61", bronze: "#a48455", wood: "#b7a183", foam: "#c3d0cd", silver: "#b8bdbb", line: "#d4cec3" };
const escape = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const rect = (x,y,w,h,fill,stroke="none",r=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
const line = (x1,y1,x2,y2,color=c.muted,width=3,dash="") => `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:""}/>`;
const text = (value,x,y,size=28,fill=c.ink,weight=400) => `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${escape(value)}</text>`;
function words(value, x, y, max=18, size=28, fill=c.ink) {
  const rows=[];let row="";
  for(const word of value.split(" ")) { if(row && `${row} ${word}`.length>max){ rows.push(row);row=word; } else row+=(row?" ":"")+word; }
  if(row)rows.push(row);
  return rows.map((item,i)=>text(item,x,y+i*(size+7),size,fill)).join("");
}
function label(number,title,x,y,targetX,targetY) {
  return line(targetX,targetY,x-32,y-9,c.muted,2,"5 6")+`<circle cx="${x-20}" cy="${y-9}" r="5" fill="${c.bronze}"/>`+text(String(number).padStart(2,"0"),x,y-30,19,c.bronze)+words(title,x,y,19);
}
const arrow = (x1,y,x2) => line(x1,y,x2-7,y,c.bronze,3)+`<path d="M${x2-17} ${y-9} L${x2-7} ${y} L${x2-17} ${y+9}" fill="none" stroke="${c.bronze}" stroke-width="3"/>`;
function svg(title,body,footer="ILLUSTRATIVE STRUCTURE · PROJECT-SPECIFIC DESIGN REQUIRED") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720" role="img" aria-label="${escape(title)}"><defs><linearGradient id="metal" x2="1" y2=".2"><stop stop-color="#aeb3b0"/><stop offset=".45" stop-color="#e0e3de"/><stop offset="1" stop-color="#929993"/></linearGradient><linearGradient id="bronze" x2="1"><stop stop-color="#9a7749"/><stop offset=".5" stop-color="#c8ae85"/><stop offset="1" stop-color="#a38355"/></linearGradient><pattern id="grain" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 2H8" stroke="#ffffff" stroke-opacity=".12"/></pattern></defs>${rect(0,0,960,720,c.paper)}${text("PACKING DETAIL / GUOYAO METAL",48,45,17,c.bronze)}${text(title,48,100,36,c.ink,500)}${line(48,124,912,124,c.line,2)}${body}${line(48,671,912,671,c.line,2)}${text(footer,48,703,16,c.muted)}</svg>`;
}

const diagrams=[];
{
  let body=rect(60,160,485,430,c.wood,c.bronze)+rect(80,180,445,384,c.foam)+rect(105,206,395,330,"#eeeae2");
  for(let i=0;i<5;i++) {const x=120+i*72;body+=rect(x-8,208,66,322,c.foam)+rect(x,220,49,297,i%2?"url(#bronze)":"url(#metal)",c.muted)+rect(x,220,49,297,"url(#grain)");}
  body+=rect(98,531,410,18,c.wood)+rect(92,550,423,14,c.foam);
  body+=label(1,"Outer plywood crate",620,200,538,185)+label(2,"Soft surface layer",620,320,389,315)+label(3,"Individual separation",620,440,330,462)+label(4,"Cushioned supports",620,565,490,550);
  diagrams.push(["detail-vertical-crate",svg("Vertical crate: separated panels",body)]);
}
{
  let body=rect(60,236,490,245,c.wood,c.bronze)+rect(80,256,450,205,"#d7c5a8")+rect(100,272,411,171,c.foam);
  for(let i=0;i<3;i++){body+=rect(115,290+i*48,380,25,"#ebe9df")+rect(132,296+i*48,340,13,i%2?"url(#bronze)":"url(#metal)",c.muted);}
  body+=rect(100,272,21,171,c.foam)+rect(492,272,20,171,c.foam);
  body+=label(1,"Outer carton",620,205,538,243)+label(2,"Individual sleeves",620,325,330,300)+label(3,"Layer separators",620,450,330,375)+label(4,"Protected end zones",620,565,501,420);
  diagrams.push(["detail-horizontal-carton",svg("Horizontal carton: protected trims",body)]);
}
{
  let body=rect(70,163,26,393,c.ink)+rect(513,163,26,393,c.ink)+rect(70,157,469,25,c.ink)+rect(70,530,469,25,c.ink)+rect(52,555,130,28,c.ink)+rect(430,555,130,28,c.ink)+rect(96,506,417,23,c.foam);
  for(let i=0;i<5;i++){const x=111+i*77;body+=rect(x-6,196,68,310,c.foam)+rect(x,207,53,287,i%2?"url(#bronze)":"url(#metal)",c.muted);}
  body+=rect(100,280,406,38,"#e4e9df")+rect(100,291,406,13,"#615f54")+rect(100,424,406,38,"#e4e9df")+rect(100,435,406,13,"#615f54");
  body+=label(1,"Transport frame",620,205,528,180)+label(2,"Panel separation",620,325,428,238)+label(3,"Padded restraint",620,445,460,440)+label(4,"Cushioned contact",620,565,464,516);
  diagrams.push(["detail-steel-rack",svg("Steel rack: support and restraint",body)]);
}
{
  let body=rect(109,255,400,274,"url(#bronze)",c.bronze)+rect(109,255,400,274,"url(#grain)")+rect(496,255,20,274,"#80623e")+`<path d="M90 237H236V274H129V408H90Z" fill="${c.foam}" stroke="#8fa7a0" stroke-width="3"/><path d="M58 205H234V235H88V406H58Z" fill="${c.ink}"/><path d="M88 408H130V444H88Z" fill="${c.foam}"/>`;
  body+=label(1,"Protective outer cap",620,212,218,220)+label(2,"Soft contact layer",620,344,212,250)+label(3,"Protected metal edge",620,490,508,450)+words("Edge protection is shown schematically.",76,587,34,22,c.muted);
  diagrams.push(["detail-corner-protection",svg("Corner protection: soften the contact",body)]);
}
{
  let body="";
  for(let i=0;i<3;i++){const y=215+i*142;body+=rect(90,y,435,37,i%2?"url(#bronze)":"url(#metal)",c.muted)+rect(90,y,435,37,"url(#grain)");if(i<2)body+=rect(70,y+62,475,58,c.foam,"#a3b6b0");}
  body+=label(1,"Protected metal face",620,240,510,238)+label(2,"Full-area separator",620,397,532,435)+label(3,"Separate each piece",620,552,510,510)+words("Exploded view: layer spacing is schematic.",72,626,42,21,c.muted);
  diagrams.push(["detail-layer-separation",svg("Layer separation: avoid direct contact",body)]);
}
{
  let body=rect(65,172,476,425,c.wood,c.bronze);
  body+=rect(99,211,399,164,"#faf8f3",c.muted)+text("SAMPLE PACK ID",119,248,22,c.muted,500)+text("EXAMPLE-01",119,288,30,c.ink,500)+text("ZONE / ROOM: TO CONFIRM",119,329,19,c.muted)+text("No live tracking link",119,355,17,c.muted);
  body+=rect(100,407,118,120,c.paper,c.muted)+rect(240,407,118,120,c.paper,c.muted)+rect(380,407,118,120,c.paper,c.muted);
  body+=line(129,476,129,432,c.ink,5)+line(171,476,171,432,c.ink,5)+`<path d="M118 443L129 431L140 443 M160 443L171 431L182 443" fill="none" stroke="${c.ink}" stroke-width="5"/>`+text("UP",131,510,20,c.ink);
  body+=`<path d="M258 459Q299 415 340 459Z M299 447V487Q299 501 315 493" fill="none" stroke="${c.ink}" stroke-width="4"/>`+text("KEEP DRY",251,513,16,c.ink);
  body+=`<path d="M416 431H458L454 459Q437 478 420 459Z M437 471V489 M423 489H451" fill="none" stroke="${c.ink}" stroke-width="4"/>`+text("FRAGILE",394,514,17,c.ink);
  body+=label(1,"Pack identity",620,232,495,236)+label(2,"Readable record",620,380,495,333)+label(3,"Handling directions",620,535,492,486);
  diagrams.push(["detail-labeling",svg("Labeling: make the pack identifiable",body,"ILLUSTRATIVE LABELS · USE VERIFIED PROJECT INFORMATION")]);
}
{
  const rows=[["Loose movement","Contact and rubbing","Surface damage"],["Unprotected edges","Local impact","Corner damage"],["Poor load support","Uneven pressure","Bending or dents"]];
  let body=text("WHAT CAN GO WRONG",48,161,18,c.bronze)+text("DURING HANDLING",355,161,18,c.bronze)+text("WHAT TO CHECK",662,161,18,c.bronze);
  rows.forEach((row,i)=>{const y=195+i*144;row.forEach((value,j)=>{const x=48+j*307;body+=rect(x,y,252,116,j===2?"#e2d9c9":"#eeebe4",c.line,3)+words(value,x+20,y+44,15,27);if(j<2)body+=arrow(x+265,y+58,x+299);});});
  diagrams.push(["risk-pathways",svg("Packing risks: from cause to damage",body,"QUALITATIVE CHECKPOINTS · NO DAMAGE-RATE CLAIMS")]);
}
{
  const columns=["Retail","Residence","Hospitality"];
  const rows=[
    ["Surface","Sensitive finish protection","Individually wrapped trims","Repeat-part surface protection"],
    ["Handling","Clear pack orientation","Practical opening sequence","Coordinated pack handling"],
    ["Identity","Individual panel references","Room and part grouping","Floor, zone and batch grouping"],
    ["Planning","Agree the unpacking method","Allow staged installation","Coordinate delivery batches"],
  ];
  let body=rect(48,160,864,76,c.ink);
  columns.forEach((value,i)=>{body+=text(value,241+i*224,207,27,c.paper,500);});
  rows.forEach((row,i)=>{const y=236+i*104;body+=rect(48,y,864,104,i%2?"#eeebe4":"#f9f6ef",c.line);body+=words(row[0],65,y+58,10,25,c.bronze);row.slice(1).forEach((value,j)=>{body+=words(value,241+j*224,y+31,15,23);});});
  diagrams.push(["protection-priorities",svg("Protection priorities: questions by setting",body,"DISCUSSION EXAMPLES · NOT A PERFORMANCE RATING")]);
}

const outputs=[];
for(const [name,source] of diagrams){
  const svgFile=path.join(sourceDir,`${name}.svg`);
  const webpFile=path.join(targetDir,`${name}.webp`);
  await fs.writeFile(svgFile,source,"utf8");
  await sharp(Buffer.from(source)).resize(1440,1080).webp({quality:92}).toFile(webpFile);
  outputs.push({name,svg:svgFile,webp:webpFile,...await sharp(webpFile).metadata()});
}
await fs.writeFile(path.join(sourceDir,"manifest.json"),JSON.stringify(outputs,null,2));
console.log(JSON.stringify(outputs.map(({name,width,height,size})=>({name,width,height,size})),null,2));
