# Guoyao Metal 阶段 3 执行方案：4 大能力商业落地页、选型决策博客与全站 SEO 转化闭环

> **文档用途**：本文件为面向 AI 编程/内容工具的**可执行任务说明书（Execution Spec）**，承接 [stage-2-case-study-refactor-plan.md](./stage-2-case-study-refactor-plan.md) 之后执行。  
> **工作区路径**：`d:\guoyao\guoyao`（Next.js App Router + Prisma + Cloudflare R2）  
> **已清洗素材库路径**：`D:\金属\_整理后素材库\`（阶段 1 产出，严禁改动原始文件）  
> **确认日期**：2026-11-27

---

## 一、阶段 3 的战略目标与前置依赖

### 1.1 为什么必须做阶段 3？
阶段 2 完成了“**真实案例库重构（6 篇去 AI 化、去品牌化案例）**”，但全站依然缺少从 Google 搜索到 B2B 询盘的**商业承接中枢**：
- **缺商业大词落地页（Money Pages）**：首页 1 个页面扛全部 4 大业务词，Google 难以把细分品类大词（如 *custom curved metal cladding manufacturer*、*helical metal staircase fabricator*、*custom brass display vitrine factory*）排到首页。
- **大量纯车间硬核素材尚未盘活**：阶段 1 整理出的 **永利弧形楼梯扶手 Top 10**、**香港太古长跨度栏杆 Top 10（含 12MP TIG 焊缝微距）**、**展示柜拆分出的 4 组零商标成品（拉槽黄铜/古铜展架/银色胶囊中岛）**、**卡地亚无标重钢副框**，因缺现场完工图不适合单做长案例，但在**能力页与工艺博客**里是顶级的“硬核制造证据”。
- **缺“买家选型/决策”搜索入口**：现有 5 篇博客全部偏深水区内部 QC 标准，缺少海外建筑师/总包/采购在前期选型与发 RFQ 前最常搜的材质对比、表面处理、1:1 试装与询盘准备指南。

### 1.2 硬性红线（与阶段 2 保持一致）
1. **严禁修改 `src/lib/site-identity.ts` 中的 `COMPANY_NAME`（`广州市国耀高薪材料科技有限公司` 保持原样）**；仅允许在该文件的 `PRIMARY_NAVIGATION` 中新增能力页入口。
2. **严禁制造“换词复制的垃圾着陆页（Doorway Pages）”**：4 个 `/capabilities/[slug]` 页面必须各有独立工程结构、真实参数矩阵、专属实拍图组、专属 FAQ 和动态关联的同分类案例，严格遵守 Google 以人为本内容原则。
3. **坚持 100% 真实照片 + 去品牌化工程表述**：能力页与新博客优先使用 `D:\金属\_整理后素材库\` 中的零商标真图；不虚构未验证的证书、厂房数据、公差承诺或交付数量。
4. **发布安全**：博客草稿默认以 `status: "DRAFT"` 导入数据库预览；代码改动需通过 `typecheck`、`lint`、`npm test`、`npm run build` 后，由站主审核确认再部署和切换为 `PUBLISHED`。

---

## 二、模块 A：新建 5 个商业意图落地页（`/capabilities` 总览 + 4 大能力子页）

### 2.1 URL 架构与目标核心 B2B 搜索词

| 路由 URL | 对应首页业务线 / 案例 `category` | 核心 SEO 目标词（英文） | 精准承接意图 |
| :--- | :--- | :--- | :--- |
| `/capabilities` | 全站总览枢纽 | `custom architectural metalwork manufacturer china` | 建筑师/总包快速评估整厂制造边界与 1:1 预拼装体系 |
| `/capabilities/storefront-facades` | `Storefronts & Facades` | `custom metal storefront facade manufacturer`, `backlit boutique facade fabrication` | 精品店/旗舰店门面、透光金属立面、重钢副框与入口亭 |
| `/capabilities/curved-architectural-cladding` | `Curved Cladding` | `double-curved stainless steel cladding`, `custom curved metal column escalator cladding` | 双曲包柱、中庭扶梯包覆、弧形吊顶与密缝金属表皮 |
| `/capabilities/custom-staircases-balustrades` | `Stairs & Balustrades` | `custom helical metal staircase fabricator`, `curved stainless steel balustrade manufacturer` | 螺旋/弧形雕塑楼梯钢骨、三维弯管扶手、长跨度商业栏杆 |
| `/capabilities/display-vitrines-hospitality-ffe` | `Display Vitrines & FF&E` | `custom brass display vitrine manufacturer`, `luxury hotel lobby metalwork ffe` | 高端珠宝/酒店发光展柜、拉槽/锤纹黄铜吧台与固装金属 |

### 2.2 代码落位与数据驱动设计（避免硬编码复制粘贴）

建议在 `d:\guoyao\guoyao` 新增以下模块（复用现有 `alloy-subpages.module.css`、`style-10-liquid.module.css`、`InquiryButton` 与 `SiteHeader`/`SiteFooter` 视觉体系）：

1. **数据源文件：`src/data/capabilities.ts`**
   - 定义强类型 `CapabilityPageData`（含 `slug`, `index`, `categoryMatch`, `navTitle`, `seoTitle`, `seoDescription`, `h1`, `eyebrow`, `lead`, `heroImage`, `scopeMatrix`（表格：Typical Assemblies / Base Alloys / Finish Systems / Verification Standard）, `engineeringHighlights`（3–4 个真实工艺要点）, `workshopProofGallery`（该能力页专属的车间实拍证据图，全部来自 `D:\金属\_整理后素材库\`）, `buyerFaqs`（4–5 个高频采购问答，供前端渲染并同步生成 `FAQPage` JSON-LD）, `relatedBlogSlugs`, `inquiryProductName`）。
   - `categoryMatch` 精确对应阶段 2 的 4 个标准短分类（`Storefronts & Facades` / `Curved Cladding` / `Stairs & Balustrades` / `Display Vitrines & FF&E`），页面渲染时**动态调用 `getPublishedCaseStudySummaries()` 按 `category === cap.categoryMatch` 过滤出已发布真实案例**——后续每发新案例，能力页自动更新！
2. **页面路由**：
   - `src/app/(site)/capabilities/page.tsx`：能力总览页（静态元信息 + `CollectionPage` & `BreadcrumbList` JSON-LD + 4 大能力卡片入口 + 表面工艺速览 + 1:1 试装与出口包装承诺 + 询盘 CTA）。
   - `src/app/(site)/capabilities/[slug]/page.tsx`：能力详情页（`generateStaticParams()` 预声明 4 个 slug，未知 slug 调用 `notFound()` 返回真实 HTTP 404；输出 `Service` + `BreadcrumbList` + `FAQPage` JSON-LD）。
   - 渲染组件：`src/components/site/capabilities-index.tsx` 与 `src/components/site/capability-detail.tsx`（保持无 JS 时 SSR HTML 正文完整可读、390px 手机端零横向溢出）。
3. **询盘归因打通**：
   - 每个能力页的 `InquiryButton` 必须传入差异化的 `product={{ name: cap.inquiryProductName }}`（如 `"Custom Storefront & Facade Metalwork"`、`"Curved Architectural Cladding"`、`"Custom Staircases & Balustrades"`、`"Display Vitrines & Hospitality FF&E"`），与现有 `src/lib/inquiry-analytics.ts` 和后台 `/admin/inquiries` 无缝对接，精准追踪各能力页带来的询盘转化。

### 2.3 4 个能力页的「专属实拍素材分配表」（盘活阶段 1 闲置王牌）

> 所有图片须先通过 `sharp` 转为 WebP（长边 ≤1600px，84% quality，存放至 `public/images/capabilities/<slug>/` 或上传至 R2 `capabilities/<slug>/`；带 `_wm` 的底边裁切 6% 去日期水印）。

#### 页面 ①：`/capabilities/storefront-facades`（商业门面与透光外立面）
- **核心亮点**：重钢/铝结构副框焊接、折面透光幕墙、LED 扩散均匀度暗房试灯、大跨度入口门亭 1:1 预拼装。
- **专属车间实拍素材（无商标优先）**：
  - `D:\金属\_整理后素材库\01_Storefronts_Facades\01-cartier-flagship-facades\01_selects-hero\cartier-facade__workshop-subframe__01_wm.jpg`（**0 商标**，大型铝/钢格栅幕墙副框车间拼装全景，**裁切底边 6% 去日期水印**）
  - `...\cartier-facade__workshop-subframe__02_wm.jpg`（**0 商标**，重型副框焊缝与节点特写，**裁切底边 6%**）
  - `...\cartier-facade__workshop-subframe__03_wm.jpg`（**0 商标**，模块化幕墙副框工人比例参照，**裁切底边 6%**）
  - `...\cartier-facade__yard-loading__01.jpg`（**0 商标、0 水印**，成品重钢结构箱梁货场待装车）
  - `D:\金属\_整理后素材库\01_Storefronts_Facades\02-tiffany-backlit-facade\01_exterior-hero-from-reel\tiffany-exterior__twilight-hero__04_wm.jpg`（**0 清晰商标**，晶透金属外立面夜景转角，**裁切底边 6%**）
  - *(可选工艺证明)* `04-piaget-entrance-portal\01_selects\`（仅在裁切/柔化 `PIAGET` 字标后用于展示“保护膜状态下通电试灯流程”，若严格零品牌则不放）。
- **自动聚合案例**：透光折面外立面、椭圆曲面入口亭。
- **推荐关联博客**：需求标准、组装安装、表面工艺指南、RFQ 询盘清单。

#### 页面 ②：`/capabilities/curved-architectural-cladding`（双曲包柱与扶梯中庭包覆）
- **核心亮点**：三维双曲展开与防回弹、罗纹/折面抗起皱成型、全高 1:1 灯管阵验平整度、密缝对色与背衬结构。
- **专属车间实拍素材（全部 0 商标、0 水印）**：
  - 复用 `02_Curved_Cladding\01-champagne-fluted-escalator-cladding\01_selects-top12\` 中最具代表性的 4 张（中庭完工全景、裸金属双曲打磨、香槟金端头试装、整梯 1:1 吊装）
  - 复用 `02_Curved_Cladding\02-murray-road-curved-column\01_all-verified-upright\` 中最具代表性的 3 张（内部环梁龙骨、全高竖立灯管验平整度、双曲拉丝密缝特写）。
- **自动聚合案例**：双曲香槟金扶梯包覆、香港美利道双曲不锈钢包柱。
- **推荐关联博客**：1:1 工厂试装指南、焊接工艺、304 vs 316L 选材、包装运输指南。

#### 页面 ③：`/capabilities/custom-staircases-balustrades`（雕塑楼梯与弧形栏杆扶手 —— 最大素材释放点！）
- **核心亮点**：双曲螺旋钢结构梯梁、三维滚弯异形拉丝扶手与蜗卷收头、20 米+ 长跨度商业中庭栏杆地轨放样、TIG 满焊修磨。
- **专属车间实拍素材（全部 0 商标、0 水印，彻底盘活永利 + 香港太古！）**：
  - **永利弧形楼梯扶手（选 5 张）**（目录：`D:\金属\_整理后素材库\03_Stairs_Balustrades\02-wynn-curved-stair-handrail\01_selects-top10\`）：
    - `curved-stair-handrail__factory-mockup__03.jpg`（正对称 1:1 四道弧形扶手全貌 —— **强烈推荐作能力页主图/重点图**）
    - `curved-stair-handrail__factory-mockup__02.jpg`（左斜 3/4 流畅曲线全景）
    - `curved-stair-handrail__handrail-detail__04.jpg`（异形拉丝双曲扶手与蜗卷微距）
    - `curved-stair-handrail__handrail-detail__02.jpg`（双曲拉丝扶手端头特写）
    - `curved-stair-handrail__bent-stock__01.jpg`（三维滚弯异形管材成品地面排布）
  - **香港太古长跨度栏杆（选 5 张）**（目录：`D:\金属\_整理后素材库\03_Stairs_Balustrades\03-hk-taikoo-longspan-balustrade\01_selects-top10\`）：
    - `taikoo-balustrade__factory-mockup__02.jpg`（12MP 弧形地轨放样与长跨度 1:1 试装）
    - `taikoo-balustrade__factory-mockup__05.jpg`（20 米+ 全车间长跨度气势全景）
    - `taikoo-balustrade__factory-mockup__04.jpg`（竖拍连续弧线立柱与螺栓底板）
    - `taikoo-balustrade__weld-bracket-detail__01.jpg`（12MP J 型支架 TIG 焊缝 3/4 微距）
    - `taikoo-balustrade__fabrication-grinding__01.jpg`（技师现场修磨立柱底槽焊缝）
- **自动聚合案例**：商业旗舰双曲螺旋雕塑楼梯。
- **推荐关联博客**：1:1 工厂试装指南、焊接工艺、304 vs 316L 选材、组装安装。

#### 页面 ④：`/capabilities/display-vitrines-hospitality-ffe`（高端展柜与五星酒店固装 —— 彻底盘活展示柜 4 项目！）
- **核心亮点**：手工锤纹与拉槽黄铜、45° 精密斜拼与玻璃密缝收口、隐藏式无光斑暖光照明、金属+大理石+烤漆跨材质一体交付。
- **专属车间实拍素材（全部 0 商标、0 水印）**：
  - **拉槽香槟黄铜弧形柜（选 3 张）**（`04_Displays_Hospitality_FFE\02-fluted-brass-curved-counter\01_selects\`）：
    - `fluted-brass-counter__workshop__03.jpg`（最干净 3/4 主图）、`__04.jpg`（弧角与内凹壁龛）、`__05.jpg`（全貌）
  - **古铜高展架与发光方展柜（选 2 张）**（`04_Displays_Hospitality_FFE\03-bronze-display-towers-vitrines\01_selects\`）：
    - `bronze-vitrine-tower__workshop__01.jpg`（高展架正立面）、`__02.jpg`（发光古铜展柜正立面）
  - **银色拉丝胶囊雕塑中岛（选 2 张）**（`04_Displays_Hospitality_FFE\04-silver-capsule-sculptural-pod\01_selects\`）：
    - `silver-capsule-pod__workshop__03.jpg`（最干净成品全景）、`__01.jpg`（拉丝银弧面与黑色内凹底座特写）
  - **酒店大堂锤纹黄铜与背柜（选 2 张）**（`04_Displays_Hospitality_FFE\01-luxury-hotel-lobby-ffe\01_selects-top8\`）：
    - `hotel-lobby-ffe__brass-vitrine__01.jpg`（45° 斜拼锤纹转角王牌微距）、`hotel-lobby-ffe__brass-vitrine__03.jpg`（发光展柜正立面）。
- **自动聚合案例**：五星酒店大堂黄铜展柜与固装。
- **推荐关联博客**：表面工艺指南、需求标准、包装运输指南、RFQ 询盘清单。

---

## 三、模块 B：全站导航、首页、Footer 与 Sitemap 联动（最易漏改处！）

> **架构提醒**：经代码核查，`SiteHeader`（`src/components/site/site-header.tsx`）和 `SiteFooter`（`src/components/site/site-footer.tsx`）在 `/` 和 `/about` 上返回 `null`，因为首页（`style-13-folded-alloy.tsx`）和关于页（`about-folded-alloy.tsx`）自带独立的 Header 与 Footer！因此修改导航与 Footer 必须**三处同步**，否则会出现页面间导航不一致！

1. **顶部主导航（1 处配置联动 3 处组件）**：
   - 在 `src/lib/site-identity.ts` 的 `PRIMARY_NAVIGATION` 中新增 `{ href: "/capabilities", label: "Capabilities" }`（顺序建议：`Home` → `Capabilities` → `Projects` → `Blog` → `About`；**再次强调：严禁修改该文件中的 `COMPANY_NAME`**）。
   - `site-header.tsx`、`style-13-folded-alloy.tsx`、`about-folded-alloy.tsx` 均消费 `PRIMARY_NAVIGATION`，但需在桌面端（1440px）与移动端（390px）核查 5 个导航项不折行、不遮挡右侧 WhatsApp/Email 按钮。
2. **页脚导航（必须同步修改全部 3 个文件）**：
   - `src/components/site/site-footer.tsx`（第 72–81 行）
   - `src/components/site/home-styles/style-13-folded-alloy.tsx`（底部 footer 链接区）
   - `src/components/site/about-folded-alloy.tsx`（底部 footer 链接区）
   - 均补充 `/capabilities` 及 4 个核心能力直达链接（大幅增强全站内链权重分发）。
3. **首页 4 大能力卡片打通跳转（`src/data/homepage-redesign-data.ts` + `style-13-folded-alloy.tsx`）**：
   - 当前首页 `DISCIPLINES` 卡片只有询盘按钮，没有详情页链接。为 `DISCIPLINES` 每项新增 `href: "/capabilities/<slug>"`，并在 `ParticleDisciplineLab` 的详情卡中增加次级按钮 **`Explore <ShortTitle> Capabilities →`**，把首页高权重直接导流到 4 个商业落地页。
4. **站点地图接入（`src/app/sitemap.ts`）**：
   - 在 `sitemap()` 返回数组中新增 `/capabilities` 及 4 个 `/capabilities/[slug]` 条目（每个附带 `images` 封面图数组），确保 Google 爬虫第一时间发现并收录全部 5 个商业落地页。

---

## 四、模块 C：4 篇高搜索意图「选型/决策型」新博客 + 现有博客真图增强

### 4.1 4 篇全新高意图博客选题规划

现有 5 篇博客（需求、原料、焊接、组装、包装）侧重制造与质检标准；阶段 3 新增的 4 篇专门拦截海外建筑师、室内设计师、总包和采购经理在 **Google 搜索选型/对比/询盘前的精准流量**：

| 序号 | 建议 Slug | 分类 (`category`) | 目标 SEO 核心词 | 独家配图（全部来自 `D:\金属\_整理后素材库\` 真图） | 必链的站内目标页 |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | `architectural-metal-finishes-brushed-mirror-hammered-pvd-guide` | `Materials & Finishes` | `architectural metal finishes guide`, `brushed vs mirror vs hammered brass stainless steel` | 锤纹黄铜 45° 转角（酒店）、拉槽香槟黄铜弧形柜（展示柜）、美利道定向拉丝密缝、香槟金罗纹扶梯、银色拉丝胶囊中岛（**全 0 商标 0 水印**） | 全部 4 个能力页 + 扶梯/酒店/美利道案例 |
| **2** | `why-1-to-1-factory-trial-assembly-matters-curved-metalwork` | `Engineering & QC` | `architectural metalwork factory mock up`, `1 to 1 trial assembly curved cladding staircase` | 永利 1:1 四道弧形楼梯、太古 20m+ 地轨放样、美利道全高灯管验平整度、扶梯整梯车间吊装（**全 0 商标 0 水印**） | `curved-architectural-cladding` + `custom-staircases-balustrades` + 扶梯/美利道案例 |
| **3** | `stainless-steel-304-vs-316l-brass-bronze-commercial-projects` | `Materials & Finishes` | `304 vs 316l stainless steel facade cladding`, `architectural brass vs pvd stainless steel` | 美利道不锈钢包柱、太古不锈钢栏杆焊缝、锤纹黄铜展柜、拉槽黄铜吧台、卡地亚无标重钢副框（裁去水印） | `storefront-facades` + `curved-architectural-cladding` + `display-vitrines-hospitality-ffe` |
| **4** | `how-to-prepare-rfq-package-custom-architectural-metalwork` | `Procurement Guide` | `custom architectural metalwork rfq checklist`, `how to source custom metal fabrication china` | 永利弯管排布、太古 1:1 放样、扶梯裸金属加工、酒店发光试灯（拆解图纸/样板/工地尺寸/出口木箱 4 大要素） | `/capabilities` 总览 + 包装指南博客 + 询盘弹窗 |

**博客制作技术规范（严格对齐 `scripts/import-blog-draft.ts`）**：
- 草稿路径：`content/drafts/<slug>.md` + `<slug>.draft.json`（或沿用 `content/blog/<slug>/` 规范，使用 `import-blog-draft.ts` 自动压缩上传 WebP 到 R2 并转换为 Editor.js blocks 写入 PostgreSQL）。
- 正文遵循 `article-content.ts` 校验规则：仅用 H2/H3/H4（H2 自动生成右侧大纲 TOC）、段落、有序/无序列表、图片块与分隔符；**每篇包含 1–2 个清晰对比要点或可执行检查清单**，不写空泛 AI 废话。
- 同步在 `src/lib/editorial-seo.ts` 中为 4 篇新博客补充精简 SEO Title（≤60 字符）与 Description（≤155 字符），并把其中第 1 篇（表面工艺指南）设为首页 `FEATURED_ARTICLE` 的首选升级目标（完美契合原首页想推“抛光/拉丝表面处理”的定位）。

### 4.2 现有 2 篇线上工艺博客的「真图与内链增强」（低成本高收益）

不重写正文结构，仅对已上线且与 `D:\金属` 高度契合的 2 篇核心工艺博客做**精准补强**（修改前先备份数据库原文）：
1. **`/blog/metalwork-welding-process-and-quality-control`（焊接工艺）**：
   - 植入 3 张来自 `03-hk-taikoo-longspan-balustrade/01_selects-top10/` 的 **12MP 零商标真实焊接图**：`weld-bracket-detail__01.jpg`（J 型支架 TIG 焊缝 3/4 微距）、`weld-bracket-detail__02.jpg`（圆管支架 TIG 焊缝正拍）、`fabrication-grinding__01.jpg`（技师精修焊缝）。
   - 补充双向内链指向 `/capabilities/custom-staircases-balustrades`、`/capabilities/curved-architectural-cladding` 与 `/case-studies/murray-road-column-cladding`。
2. **`/blog/metalwork-assembly-fit-out-process-and-quality-control`（组装安装）**：
   - 植入 2 张来自永利与太古的 **1:1 车间放样试装真图**（`curved-stair-handrail__factory-mockup__03.jpg`、`taikoo-balustrade__factory-mockup__02.jpg`）。
   - 补充双向内链指向 `/capabilities/custom-staircases-balustrades`、`/capabilities/storefront-facades` 与 `/case-studies/curved-fluted-escalator-atrium-cladding`。

---

## 五、模块 D：可选扩展 + 阶段 2 遗留清理 + 性能与数据闭环（防遗漏收口）

这部分最容易被忽略，但直接决定整个 SEO 升级是否真正跑出询盘效果：

1. **【可选任务】卡地亚几何透光立面案例（待站主确认门店归属后执行）**
   - 素材已就绪：`D:\金属\_整理后素材库\01_Storefronts_Facades\01-cartier-flagship-facades/`（含太阳放射格栅日夜配对、金琥珀方格夜景、象牙白流纹 5/5 大片 + 无标重钢副框）。
   - 站主确认哪组立面与重钢副框属于同一项目、以及去品牌/裁切方案后，按阶段 2 的 6 段式模板落地为第 7 篇旗舰案例（分类 `Storefronts & Facades`，自动同步至 `/capabilities/storefront-facades`）。
2. **阶段 2 遗留的 R2 孤立 AI 图安全清理（阶段 2 上线稳定 7–14 天后执行）**
   - 编写只读核查+清理脚本 `scripts/cleanup-orphaned-ai-r2.ts`：
     - 步骤 1（`--dry-run` 默认模式）：查询数据库所有 `CaseStudy`（含 `PUBLISHED`/`DRAFT`/`ARCHIVED`）与 `BlogPost` 引用的全部 R2 URL，列出 `case-studies/` 前缀下命中 `*-gy-*.webp` / `*-g0*.webp` 且 **0 处被线上 `PUBLISHED` 记录引用** 的孤立对象清单与体积。
     - 步骤 2（`--apply` 需站主明确授权）：批量删除确认无引用的旧 AI 图对象，并保存删除日志到 `output/seo-stage3/r2-cleanup-receipt.json`。
3. **基础设施与 Core Web Vitals 体检（补齐此前缺失的性能指标）**
   - **消除 HTTP 裸域双跳重定向**：在 Cloudflare 规则中将 `http://guoyaometal.com/*` 直接 301 到 `https://www.guoyaometal.com/$1`（从 2 跳降为 1 跳，减少爬虫与首屏延迟）。
   - **PageSpeed Insights / Lighthouse 实测**：上线后分别实测首页 `/`、1 个能力页（`/capabilities/curved-architectural-cladding`）、1 个新案例（扶梯包覆）和 1 篇新博客（表面工艺指南），重点检查 LCP 封面图 preload、Canvas 动画在低端移动端的 TBT（Total Blocking Time），必要时为弱设备/prefers-reduced-motion 降级背景粒子渲染。
4. **询盘归因与 GSC 效果追踪（每 2 周复盘）**
   - 核验后台 `/admin/inquiries` 与 GA4 中能清晰区分每个 `/capabilities/*`、`/case-studies/*`、`/blog/*` 页面带来的询盘点击与表单提交。
   - 在 GSC 提交更新后的 `sitemap.xml`，对新增的 5 个能力页 + 4 篇新博客执行 URL 检查与索引请求；2–4 周后按页面类型（能力页 vs 案例页 vs 博客页）对比展示量、点击率与询盘转化。

---

## 六、分步执行顺序与自动化验收清单（给执行 AI 工具）

1. **Step 1 · 预处理阶段 3 专属实拍图**
   - 编写 `output/stage3-media/prepare-stage3-images.mjs`，按第二章和第四章的精确路径从 `D:\金属\_整理后素材库\` 读取图片，裁切带 `_wm` 的底边 6%、转为 WebP（≤1600px，84% quality）并做视觉复核（0 水印、0 倒置、0 商标违规）。
2. **Step 2 · 开发 5 个能力落地页与全站导航/Footer/Sitemap 联动**
   - 创建 `src/data/capabilities.ts`、`src/components/site/capabilities-index.tsx`、`src/components/site/capability-detail.tsx`、`src/app/(site)/capabilities/page.tsx`、`src/app/(site)/capabilities/[slug]/page.tsx`。
   - 同步更新 `src/lib/site-identity.ts`（仅改 `PRIMARY_NAVIGATION`，**不改 `COMPANY_NAME`**）、`src/components/site/site-footer.tsx`、`style-13-folded-alloy.tsx`、`about-folded-alloy.tsx`、`src/data/homepage-redesign-data.ts`、`src/app/sitemap.ts`。
3. **Step 3 · 编写 4 篇决策选型新博客草稿（先存 `DRAFT`）+ 准备现有 2 篇博客真图补强**
   - 生成 4 篇博客的 Markdown、`.draft.json` 与 `editorial-seo.ts` 精简元数据条目；保留现有 2 篇博客更新前的数据库快照备份。
4. **Step 4 · 新增自动化测试并跑全套静态/构建回归**
   - 新增 `tests/capabilities.test.ts`：校验 4 个能力 slug 唯一性、与 4 个标准案例分类完全一致、SEO Title ≤ 65 字符 & Description ≤ 160 字符、所有配置图片文件存在、FAQ 非空、无指向 `/products` 或 `/guides` 的失效链接。
   - 运行全套回归：
     ```powershell
     npm run typecheck
     npm run lint
     npm test
     npm run build
     ```
   - 核查 `git diff src/lib/site-identity.ts` 确认未改动 `COMPANY_NAME`。
5. **Step 5 · 本地真机宽度与无 JS 抽查（先审后发）**
   - 本地生产启动后检查：
     - `/capabilities` 与 4 个 `/capabilities/[slug]` 返回 HTTP 200，各有唯一 H1、Canonical、`Service`/`FAQPage`/`BreadcrumbList` JSON-LD；
     - `/capabilities/non-existent` 返回真实 HTTP 404；
     - 桌面 1440px 与手机 390px 导航 5 项不折行、无横向溢出、无破图；关闭 JS 后正文与表格完整可读；
     - 点击各能力页 `InquiryButton`，弹窗正常预填对应品类意向并触发归因参数。
6. **Step 6 · 站主确认后入库博客草稿、发布部署与全站终检**
   - 运行 `import-blog-draft.ts` 导入 4 篇新博客（先 `DRAFT` 审阅，站主确认后切为 `PUBLISHED`），并按站主确认更新焊接/组装 2 篇旧博客真图与内链。
   - 部署后运行只读 SEO 审计脚本：
     ```powershell
     npx tsx scripts/audit-seo.ts https://www.guoyaometal.com https://www.guoyaometal.com output/seo-stage3/after-deploy.json
     ```
   - 完成 PageSpeed Insights 抽查、GSC 提交新 `sitemap.xml` 与新页面索引请求，并在阶段 2 稳定 7–14 天后按需执行 R2 孤立 AI 图清理。
