/**
 * 临时切换兰蔻案例状态，用于前台渲染验证。
 *   npx tsx scripts/toggle-case-status.ts <status>
 */
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ path: ".env", quiet: true, override: false });

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});
const SLUG = "lancome-boutique-entrance-pavilion";
const status = (process.argv[2] ?? "DRAFT").toUpperCase() as "DRAFT" | "PUBLISHED";

async function main() {
  const row = await prisma.caseStudy.update({
    where: { slug: SLUG },
    data: { status, publishedAt: status === "PUBLISHED" ? new Date() : null },
    select: { id: true, slug: true, status: true, publishedAt: true },
  });
  console.log(row);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
