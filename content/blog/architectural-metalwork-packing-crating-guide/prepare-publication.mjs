import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire, registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const root = process.cwd();
const require = createRequire(path.join(root, "package.json"));
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") return { url: pathToFileURL(require.resolve("next/dist/compiled/server-only/empty.js")).href, shortCircuit: true };
  return nextResolve(specifier, context);
} });
const slug = "architectural-metalwork-packing-crating-guide";
const folder = path.join(root, "content/blog", slug);
const output = path.join(folder, "publication");
await fs.mkdir(output, { recursive: true });
const { markdownToArticleEditorData } = await import(pathToFileURL(path.join(root,"src/lib/article-content.ts")).href);
const { prepareArticleContentForStorage } = await import(pathToFileURL(path.join(root,"src/lib/article-content-server.ts")).href);
const mode = process.argv[2] || "--prepare";
if (!["--prepare", "--upload"].includes(mode)) throw new Error("Use --prepare or --upload. This script does not write the database.");
const metadata = JSON.parse(await fs.readFile(path.join(folder,"metadata.json"),"utf8"));
const markdown = await fs.readFile(path.join(folder,"article.md"),"utf8");
const limits = { title:180, slug:180, excerpt:500, category:80, coverImageAlt:200 };
for(const [field,max] of Object.entries(limits)) {
  if(typeof metadata[field]!=="string" || !metadata[field].trim() || metadata[field].length>max) throw new Error(`Invalid ${field}`);
}
if(metadata.slug!==slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug)) throw new Error("Unexpected article slug");
if(!Number.isInteger(metadata.readTimeMinutes) || metadata.readTimeMinutes<1 || metadata.readTimeMinutes>120) throw new Error("Invalid reading time");
const data = markdownToArticleEditorData(markdown);
data.blocks.forEach((block,index) => { block.id = `packing-guide-${String(index+1).padStart(3,"0")}`; });
const prepared = prepareArticleContentForStorage(JSON.stringify(data));
if(!prepared.success) throw new Error(prepared.error);
const bodyImages = prepared.data.blocks.filter(block=>block.type==="image");
if(bodyImages.length!==11) throw new Error(`Expected 11 body images, found ${bodyImages.length}`);
const paths = [metadata.coverImage,...bodyImages.map(block=>block.data.file.url)];
if(new Set(paths).size!==12) throw new Error("Image slots must have 12 distinct assets");
const sha = data => crypto.createHash("sha256").update(data).digest("hex");
const assets=[];
for(const localUrl of paths) {
  if(!localUrl.startsWith(`/images/blog/${slug}/`) || !localUrl.endsWith(".webp")) throw new Error("Unexpected image path");
  const file = path.join(root,"public",localUrl.slice(1));
  const bytes = await fs.readFile(file);
  const image = await sharp(bytes).metadata();
  if(image.format!=="webp" || !image.width || !image.height || Math.max(image.width,image.height)>2400) throw new Error(`Invalid asset ${localUrl}`);
  assets.push({localUrl,file:path.relative(root,file).replaceAll("\\","/"),sha256:sha(bytes),bytes:bytes.length,width:image.width,height:image.height});
}
const post={
  title:metadata.title,slug:metadata.slug,excerpt:metadata.excerpt,category:metadata.category,
  readTimeMinutes:metadata.readTimeMinutes,content:prepared.value,coverImage:metadata.coverImage,
  coverImageAlt:metadata.coverImageAlt,status:"PUBLISHED",featured:false,publishedAt:null,
};
const localPayload={version:1,post,contentSha256:sha(post.content),assets,createdAt:new Date().toISOString()};
await fs.writeFile(path.join(output,"article-local.json"),JSON.stringify(localPayload,null,2));
if(mode==="--prepare") {
  console.log(JSON.stringify({ready:true,databaseWritten:false,blocks:prepared.data.blocks.length,bodyImages:bodyImages.length,assets:assets.length}));
} else {
  const { loadEnvConfig } = require("@next/env");
  loadEnvConfig(root);
  const names=["R2_ACCOUNT_ID","R2_ACCESS_KEY_ID","R2_SECRET_ACCESS_KEY","R2_BUCKET_NAME","R2_PUBLIC_URL"];
  for(const name of names) if(!process.env[name] || process.env[name]==="CHANGE_ME") throw new Error(`Missing ${name}`);
  const publicBase=process.env.R2_PUBLIC_URL.replace(/\/+$/,"");
  if(new URL(publicBase).hostname!=="media.guoyaometal.com") throw new Error("Unexpected Guoyao media destination");
  const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
  const proxy=process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  let requestHandler;
  if(proxy) {
    const { HttpsProxyAgent }=require("next/dist/compiled/https-proxy-agent");
    const { NodeHttpHandler }=require("@smithy/node-http-handler");
    requestHandler=new NodeHttpHandler({httpsAgent:new HttpsProxyAgent(proxy),connectionTimeout:15000,requestTimeout:60000});
  }
  const client=new S3Client({region:"auto",maxAttempts:3,requestHandler,endpoint:`https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,credentials:{accessKeyId:process.env.R2_ACCESS_KEY_ID,secretAccessKey:process.env.R2_SECRET_ACCESS_KEY}});
  const bucket=process.env.R2_BUCKET_NAME;
  const assetMap={};
  for(const asset of assets) {
    const filename=path.basename(asset.file,".webp");
    const key=`blog/${slug}/${filename}-${asset.sha256.slice(0,16)}.webp`;
    const bytes=await fs.readFile(path.join(root,asset.file));
    let exists=false;
    try {
      const existing=await client.send(new GetObjectCommand({Bucket:bucket,Key:key}));
      const readback=Buffer.from(await existing.Body.transformToByteArray());
      if(sha(readback)!==asset.sha256) throw new Error(`Existing key differs: ${key}`);
      exists=true;
    } catch(error) {
      if(error.name!=="NoSuchKey" && error.$metadata?.httpStatusCode!==404) throw error;
    }
    if(!exists) await client.send(new PutObjectCommand({Bucket:bucket,Key:key,Body:bytes,ContentType:"image/webp",CacheControl:"public, max-age=31536000, immutable",Metadata:{sha256:asset.sha256}}));
    const signed=await client.send(new GetObjectCommand({Bucket:bucket,Key:key}));
    const signedBytes=Buffer.from(await signed.Body.transformToByteArray());
    if(sha(signedBytes)!==asset.sha256) throw new Error(`Storage readback failed: ${key}`);
    const publicUrl=`${publicBase}/${key}`;
    const { execFile }=require("node:child_process");
    const { promisify }=require("node:util");
    const readbackFile=path.join(output,`readback-${asset.sha256.slice(0,16)}.webp`);
    const { stdout }=await promisify(execFile)(process.platform==="win32"?"curl.exe":"curl",["--silent","--show-error","--fail","--location","--retry","2","--retry-all-errors","--connect-timeout","10","--max-time","30","--output",readbackFile,"--write-out","%{http_code} %{content_type}",publicUrl],{windowsHide:true});
    const publicBytes=await fs.readFile(readbackFile);
    const status=Number(stdout.trim().split(" ")[0]);
    if(status!==200 || !stdout.includes("image/webp") || sha(publicBytes)!==asset.sha256) throw new Error(`Public asset verification failed: ${key}`);
    assetMap[asset.localUrl]={...asset,key,url:publicUrl,storageHashMatched:true,publicHashMatched:true,httpStatus:status};
    console.log(JSON.stringify({asset:filename,verified:true,reused:exists}));
    await fs.writeFile(path.join(output,"image-map.json"),JSON.stringify(assetMap,null,2));
  }
  const publicData=JSON.parse(post.content);
  for(const block of publicData.blocks) if(block.type==="image") block.data.file.url=assetMap[block.data.file.url].url;
  const publicPrepared=prepareArticleContentForStorage(JSON.stringify(publicData));
  if(!publicPrepared.success) throw new Error(publicPrepared.error);
  const publicPost={...post,content:publicPrepared.value,coverImage:assetMap[post.coverImage].url};
  const payload={version:1,post:publicPost,contentSha256:sha(publicPost.content),assets:Object.values(assetMap),createdAt:new Date().toISOString()};
  await fs.writeFile(path.join(output,"article-public.json"),JSON.stringify(payload,null,2));
  console.log(JSON.stringify({assetsVerified:12,bodyImages:11,databaseWritten:false,payload:"article-public.json"}));
}
