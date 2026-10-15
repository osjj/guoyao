// Run from the verified Guoyao application's directory. Default is read-only.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { createRequire } = require("node:module");
const appRequire = createRequire(path.join(process.cwd(), "package.json"));
process.env.NODE_ENV ||= "production";
appRequire("@next/env").loadEnvConfig(process.cwd());
const { Client } = appRequire("pg");
const payloadFile = process.argv[2];
const publish = process.argv.includes("--publish");
const expectedSlug = "architectural-metalwork-packing-crating-guide";
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
async function main() {
  if (!payloadFile) throw new Error("Pass article-public.json; add --publish only to create the approved article.");
  const payload = JSON.parse(fs.readFileSync(payloadFile, "utf8"));
  const post = payload.post;
  if (payload.version !== 1 || post.slug !== expectedSlug || sha(post.content) !== payload.contentSha256) throw new Error("Invalid article payload");
  const blocks = JSON.parse(post.content).blocks;
  if (blocks.filter(block => block.type === "image").length !== 11 || payload.assets.length !== 12) throw new Error("Missing image slots");
  if (!post.title || post.title.length > 180 || !post.excerpt || post.excerpt.length > 500 || !post.category || post.category.length > 80 || !post.coverImageAlt || post.coverImageAlt.length > 200 || post.featured !== false) throw new Error("Invalid article metadata");
  const site = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://invalid.local");
  if (!["www.guoyaometal.com", "guoyaometal.com"].includes(site.hostname)) throw new Error("This is not the verified Guoyao application environment");
  const databaseUrl = new URL(process.env.DATABASE_URL || "postgresql://invalid/invalid");
  if (decodeURIComponent(databaseUrl.pathname.slice(1)) !== "guoyao") throw new Error("Expected the separate Guoyao database; no other database will be changed");
  const client = new Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10000, statement_timeout: 15000 });
  try {
    await client.connect();
    const schema = databaseUrl.searchParams.get("schema") || "public";
    if (schema !== "public") throw new Error("Unexpected database schema");
    const duplicates = await client.query('SELECT "id", "slug", "title", "status", "publishedAt", "content", "coverImage" FROM public."BlogPost" WHERE "slug"=$1 OR lower("title")=lower($2)', [post.slug,post.title]);
    const counts = await client.query('SELECT count(*)::int AS count FROM public."BlogPost"');
    if (!publish) {
      console.log(JSON.stringify({ preflight:true, database:"guoyao", schema, articles:counts.rows[0].count, duplicates:duplicates.rows.map(({id,slug,title,status,publishedAt})=>({id,slug,title,status,publishedAt})), databaseWritten:false }));
      return;
    }
    for (const asset of payload.assets) {
      if (new URL(asset.url).hostname !== "media.guoyaometal.com") throw new Error("Unexpected asset destination");
      const response = await fetch(asset.url, { signal:AbortSignal.timeout(20000) });
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!response.ok || !response.headers.get("content-type")?.startsWith("image/webp") || sha(bytes) !== asset.sha256) throw new Error("An image failed public readback; database not changed");
    }
    await client.query("BEGIN ISOLATION LEVEL SERIALIZABLE");
    const locked = await client.query('SELECT "id", "slug", "title", "status", "publishedAt", "content", "coverImage" FROM public."BlogPost" WHERE "slug"=$1 OR lower("title")=lower($2) FOR UPDATE', [post.slug,post.title]);
    if (locked.rows.length) {
      const existing = locked.rows[0];
      if (locked.rows.length === 1 && existing.slug === post.slug && existing.title === post.title && existing.content === post.content && existing.coverImage === post.coverImage && existing.status === "PUBLISHED" && existing.publishedAt) {
        await client.query("ROLLBACK");
        console.log(JSON.stringify({ alreadyPublished:true, id:existing.id, slug:existing.slug, publishedAt:existing.publishedAt, databaseWritten:false }));
        return;
      }
      throw new Error("An existing article matches this title or slug; nothing has been overwritten");
    }
    const receiptDir = path.join(process.cwd(), ".data", "blog-import-receipts");
    fs.mkdirSync(receiptDir, { recursive:true, mode:0o700 });
    const publishedAt = new Date();
    const id = `guoyao_${crypto.randomUUID().replaceAll("-", "")}`;
    const result = await client.query('INSERT INTO public."BlogPost" ("id","title","slug","excerpt","category","readTimeMinutes","content","coverImage","coverImageAlt","status","featured","publishedAt","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12,$12) RETURNING "id","slug","title","status","featured","publishedAt"', [id,post.title,post.slug,post.excerpt,post.category,post.readTimeMinutes,post.content,post.coverImage,post.coverImageAlt,"PUBLISHED",false,publishedAt]);
    await client.query("COMMIT");
    const readback = await client.query('SELECT "content","coverImage","status","publishedAt" FROM public."BlogPost" WHERE "id"=$1', [id]);
    if (sha(readback.rows[0].content) !== payload.contentSha256 || readback.rows[0].coverImage !== post.coverImage || readback.rows[0].status !== "PUBLISHED" || !readback.rows[0].publishedAt) throw new Error("Created article did not match readback");
    const receipt = { ...result.rows[0], bodyImages:11, assetsVerified:12, contentSha256:payload.contentSha256, databaseWritten:true, articlesBefore:counts.rows[0].count };
    fs.writeFileSync(path.join(receiptDir,`${post.slug}-${Date.now()}.json`),JSON.stringify(receipt,null,2),{mode:0o600});
    console.log(JSON.stringify(receipt));
  } catch(error) {
    await client.query("ROLLBACK").catch(()=>{});
    throw error;
  } finally { await client.end(); }
}
main().catch(error => { console.error(JSON.stringify({error:error.name,code:error.code || null,message:error.message.replace(/postgres(?:ql)?:\/\/\S+/gi,"[redacted database URL]")})); process.exitCode=1; });
