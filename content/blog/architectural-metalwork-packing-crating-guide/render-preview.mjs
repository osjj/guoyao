import fs from "node:fs/promises";
import path from "node:path";

const folder=path.resolve("content/blog/architectural-metalwork-packing-crating-guide/publication");
const payload=JSON.parse(await fs.readFile(path.join(folder,"article-local.json"),"utf8"));
const post=payload.post;
const blocks=JSON.parse(post.content).blocks;
const embedded=new Map();
for(const asset of payload.assets) embedded.set(asset.localUrl,`data:image/webp;base64,${(await fs.readFile(path.resolve(asset.file))).toString("base64")}`);
const escape=value=>String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const plain=value=>String(value).replace(/<[^>]*>/g,"");
const outline=[];
const usedIds=new Set();
const html=blocks.map((block,index)=>{
  const d=block.data;
  if(block.type==="paragraph") return `<p>${d.text}</p>`;
  if(block.type==="header") {
    const base=plain(d.text).normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)||`section-${index+1}`;
    let id=base;let suffix=2;while(usedIds.has(id))id=`${base}-${suffix++}`;usedIds.add(id);
    const level=Math.max(2,Math.min(4,d.level));if(level===2)outline.push({id,text:plain(d.text)});
    return `<h${level} id="${id}">${d.text}</h${level}>`;
  }
  if(block.type==="list") {const tag=d.style==="ordered"?"ol":"ul";return `<${tag}>${d.items.map(item=>`<li>${typeof item==="string"?item:item.content}</li>`).join("")}</${tag}>`;}
  if(block.type==="quote")return `<blockquote>${d.text}</blockquote>`;
  if(block.type==="delimiter")return "<hr>";
  if(block.type==="image") {const asset=payload.assets.find(asset=>asset.localUrl===d.file.url);return `<figure><img data-asset="${escape(d.file.url)}" src="${embedded.get(d.file.url)}" width="${asset.width}" height="${asset.height}" alt="${escape(plain(d.caption))}" loading="lazy"><figcaption>${d.caption}</figcaption></figure>`;}
  throw new Error(`Unexpected block ${block.type}`);
}).join("\n");
const page=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escape(post.title)} — local preview</title><style>
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f5f2ec;color:#22231f;font-family:Arial,sans-serif}a{color:inherit;text-decoration:none}a:focus-visible{outline:3px solid #a8875e;outline-offset:5px}.shell{width:min(1340px,calc(100% - 80px));margin:auto}.brandbar{display:flex;justify-content:space-between;align-items:center;padding:26px 0;border-bottom:1px solid #d4cec3;font-size:12px}.brand{font-size:20px;letter-spacing:.15em}.badge{color:#806443}.articlehead{padding:70px 0 42px}.kicker{color:#806443;letter-spacing:.15em;text-transform:uppercase;font-size:11px}h1{font-family:Georgia,serif;font-weight:400;font-size:clamp(42px,5.3vw,76px);letter-spacing:-.04em;line-height:1.12;margin:24px 0;max-width:1100px}.summary{max-width:700px;color:#68685f;font-size:18px;line-height:1.8}.meta{font-size:12px;color:#806443;margin-top:28px}.cover{margin:0}.cover img{width:100%;height:auto;display:block}.cover figcaption{color:#806443;font-size:11px;margin-top:12px}.reading{display:grid;grid-template-columns:260px minmax(0,790px);gap:80px;padding:65px 0 80px}.toc{align-self:start;position:sticky;top:24px;font-size:13px;line-height:1.6}.toc ol{list-style:none;margin:22px 0 0;padding:0}.toc li{padding:9px 0;border-bottom:1px solid #d4cec3}.prose{font-size:16px;line-height:1.9;color:#52544b}.prose h2{font-family:Georgia,serif;font-size:42px;font-weight:400;line-height:1.2;letter-spacing:-.025em;color:#22231f;margin:60px 0 25px;padding-top:18px;border-top:1px solid #d4cec3;scroll-margin-top:30px}.prose h3{font-family:Georgia,serif;font-size:29px;font-weight:400;line-height:1.3;letter-spacing:-.02em;color:#22231f;margin:36px 0 15px}.prose p{margin:18px 0}.prose figure{margin:30px 0 40px}.prose img{width:100%;height:auto;display:block}.prose figcaption{font-size:12px;line-height:1.7;color:#806443;padding-top:12px}.prose ul,.prose ol{padding-left:24px}.prose li{margin:12px 0}.prose blockquote{margin:25px 0;padding:20px 26px;border-left:2px solid #a48455;background:#ece7df}.end{border-top:1px solid #d4cec3;padding:30px 0 50px;color:#806443;font-size:13px}@media(max-width:1000px){.reading{grid-template-columns:200px minmax(0,1fr);gap:40px}}@media(max-width:760px){.shell{width:calc(100% - 40px)}.brandbar{gap:20px;align-items:flex-start}.brand{font-size:16px}.badge{font-size:10px;max-width:130px;text-align:right}.articlehead{padding:44px 0 32px}.summary{font-size:16px}.reading{grid-template-columns:1fr;gap:25px;padding:40px 0}.toc{position:static}.toc ol{display:grid;grid-template-columns:1fr 1fr;gap:0 18px}.prose h2{font-size:33px}.prose h3{font-size:27px}.prose{font-size:16px}.cover figcaption{line-height:1.7}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style></head><body><div class="shell"><header class="brandbar"><a class="brand" href="https://www.guoyaometal.com/">GUOYAO METAL</a><span class="badge">LOCAL ARTICLE PREVIEW · NOT PUBLISHED</span></header><div class="articlehead"><p class="kicker">${escape(post.category)}</p><h1>${escape(post.title)}</h1><p class="summary">${escape(post.excerpt)}</p><p class="meta">${post.readTimeMinutes} min read / Guoyao Metal Journal</p></div><figure class="cover"><img data-asset="${escape(post.coverImage)}" src="${embedded.get(post.coverImage)}" alt="${escape(post.coverImageAlt)}" width="1672" height="941"><figcaption>Illustrative packing arrangement. Images are educational examples.</figcaption></figure><div class="reading"><nav class="toc" aria-label="In this article"><p class="kicker">In this article</p><ol>${outline.map(item=>`<li><a href="#${item.id}">${escape(item.text)}</a></li>`).join("")}</ol></nav><article class="prose">${html}</article></div><footer class="end">Article prepared for the Guoyao Metal blog. Local preview only.</footer></div></body></html>`;
await fs.writeFile(path.join(folder,"preview.html"),page,"utf8");
console.log(JSON.stringify({preview:path.join(folder,"preview.html"),sections:outline.length,images:payload.assets.length,publicationState:"not published"}));
