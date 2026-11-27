# Guoyao Metal 阶段 2 执行方案：案例重构、新增旗舰案例与全站 SEO 联动修改

> **文档用途**：本文件为面向 AI 编程/内容工具的**可执行任务说明书（Execution Spec）**。  
> **工作区路径**：`d:\guoyao\guoyao`（Next.js + Prisma + Cloudflare R2）  
> **已清洗素材库路径**：`D:\金属\_整理后素材库\`（所有照片已完成全局去重与 100% EXIF 正向固化，严禁修改或删除原始素材）  
> **确认日期**：2026-11-27

---

## 一、已拍板的业务决策与硬性红线（必须严格遵守）

1. **商标与 URL 策略（方案 A · 全面去品牌化）**：
   - 所有 6 篇案例的 **URL (`slug`)、H1、SEO Title、Meta Description、正文与图注** 一律采用 **B2B 工程/工艺/空间场景表述**（如 *Luxury Retail Flagship*、*Five-Star Hotel Lobby*、*Commercial Atrium*），**禁止以第三方奢侈品品牌名作为主标题、URL 或核心卖点**。
   - 已上线的 2 个含品牌名旧 URL（`tiffany-boutique-backlit-facade`、`lancome-boutique-entrance-pavilion`）必须在 `next.config.ts` 中配置 **308 永久重定向**到新去品牌 URL，并将数据库中对应旧记录状态设为 `ARCHIVED`（避免 `/case-studies` 列表页与 `/sitemap.xml` 出现重复案例）。
   - 对于带 `_logo` 后缀的素材，选片时优先选用无商标/弱商标角度；若核心实拍中难以避开局部品牌字标，必须在预处理阶段对画面做构图裁切或适度弱化处理，并在正文中严守中性工程口吻，不得暗示品牌官方背书。
2. **本期执行范围（共 6 篇案例：3 篇全新/重写 + 3 篇旧线上重构）**：
   - **新增 ①**：双曲香槟金扶梯中庭包覆（`curved-fluted-escalator-atrium-cladding`）
   - **新增 ②**：商业旗舰双曲螺旋雕塑楼梯（`helical-metal-feature-staircase`）
   - **新增 ③**：五星酒店大堂黄铜展柜与固装（`luxury-hotel-lobby-brass-vitrines-ffe`，取代原 `four-seasons-hotel-lobby-metalwork` 草稿，彻底剔除半岛酒店混装图）
   - **重构 ④**：香港美利道双曲不锈钢包柱（保留原 slug `murray-road-column-cladding`）
   - **重构 ⑤**：精品店透光折面金属外立面（原蒂芙尼，迁移至 `backlit-fluted-metal-boutique-facade`）
   - **重构 ⑥**：椭圆曲面金属入口亭 1:1 试装实录（原兰蔻，迁移至 `elliptical-curved-metal-entrance-pavilion`）
   - **明确不做**：本期**暂不做卡地亚案例**；原误名 `PRADA.zip`（实为伯爵，仅 9 张纯车间图）**不发布为独立案例**（保持 `DRAFT` 或 `ARCHIVED`，留待阶段 3 门面能力页使用）。
3. **代码联动与禁止项**：
   - **严禁修改 `src/lib/site-identity.ts` 中的 `COMPANY_NAME`（`广州市国耀高薪材料科技有限公司` 保持原样，不要改动）！**
   - **必须修改**：① `next.config.ts` 新增 308 重定向；② `src/lib/editorial-seo.ts` 更新 6 篇案例精简 SEO 文案；③ `src/data/homepage-redesign-data.ts`（及 `src/components/site/home-styles/style-2-swiss.tsx`）修复失效博客链接并同步首页推荐案例链接；④ 统一所有案例分类为 4 个短分类以激活前台筛选栏。
4. **内容真实性红线（Anti-AI-Filler）**：
   - **100% 禁用旧草稿中所有 AI 生成/合成的通用阶段配图**（凡文件名含 `gy-kickoff`、`gy-survey`、`gy-cad`、`gy-sample`、`gy-qc`、`gy-packing`、`gy-stuffing`、`gy-install`、`gy-leveling`、`gy-night`、`gy-acceptance`、`gy-aftercare`、`g01`–`g10` 的图一律删除！）。
   - **严禁编造未验证的商业承诺或虚假流程**（删除“24小时回复、三次承诺、两轮图纸修改、0 返工、交付 2 家门店”等跨篇复制的模板套话）。
   - 没有现场完工图的项目（如美利道包柱、椭圆入口亭、酒店大堂固装），必须**坦诚定位为 *1:1 Factory Trial Assembly / Workshop Verification Record***，绝不用 AI 图伪造“现场完工验收”。
5. **发布安全红线**：
   - 所有数据库写入一律先以 **`status: "DRAFT"`** 写入，供站主在 `/admin/case-studies/[id]/preview` 审核确认后再由站主决定是否切换为 `PUBLISHED` 并部署。**严禁未经用户确认擅自执行 `git push`、服务器部署或将新草稿改为 `PUBLISHED`。**

---

## 二、全站统一内容设计规范（6 段式纯实拍工程模板）

### 2.1 四大标准短分类（严格精确匹配，激活前台筛选栏）

`src/components/site/case-studies-archive.tsx` 第 30–41 行要求：**所有公开案例的 `category` 长度均 `<= 36` 字符，且至少有两个案例共享同一分类**，前端分类筛选栏才会渲染。因此 6 篇案例必须严格使用以下 4 个标准分类（与首页 `DISCIPLINES` 一一对应）：

| 标准 `category` 值（精确区分大小写） | 字符数 | 本期对应案例 |
| :--- | :--- | :--- |
| `Storefronts & Facades` | 21 | ⑤ 透光折面外立面、⑥ 椭圆曲面入口亭（2 篇） |
| `Curved Cladding` | 15 | ① 扶梯双曲包覆、④ 美利道双曲包柱（2 篇） |
| `Stairs & Balustrades` | 20 | ② 双曲螺旋雕塑楼梯（1 篇） |
| `Display Vitrines & FF&E` | 23 | ③ 五星酒店大堂金属与固装（1 篇） |

### 2.2 统一章节架构（5–6 章节，彻底取代旧版 16–18 阶段套壳）

所有 `.content.json` 必须严格通过 `src/lib/case-study-content.ts` 中的 `caseStudyContentSchema`（`.strict()` 模式）校验：

- **`introduction`**（≤ 3000 字符，建议 350–600 英文字符）：开门见山交代空间类型、核心构件、材质/表面处理、工程验证方式（如 1:1 车间预拼装/现场实拍）及交付范围。
- **`stats`**（4 条，每条 `value <= 80`，`label <= 120`）：仅放真实可核查的工程属性（如构件体系、核心材质/表面、验证标准、实拍图组数量），**禁止写无依据的“0 rework”“24h reply”**。
- **`sections`**（5–6 节；`id` 匹配 `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`，不可为 `"your-project"`；`navLabel <= 80`；每节必须有 `paragraphs` 1–3 段）：
  1. `project-scope`（`Project Scope`）：项目应用场景、建筑几何特征与制造边界 + **结构化规格表 `table`**（3–4 列：Component / Base Material & Finish / Key Control Focus / Verification Method）。
  2. `engineering-challenges`（`Engineering Challenges`）：聚焦本案例独一无二的 2–3 个真实工艺难点（搭配 `points` 要点列表）。
  3. `forming-and-substructure`（`Fabrication & Substructure`）：裸金属成型、滚弯/折弯、焊接、内部钢龙骨实拍图组（`gallery`）与工程级图注。
  4. `workshop-trial-assembly`（`1:1 Trial Assembly`）：全尺寸工厂预拼装、灯具试亮、拼缝与平整度检验实拍图组（`gallery`；美利道包柱可在此节嵌入实拍 `video`）。
  5. `installed-outcome`（`Installed Outcome`，**仅限有真实完工/近完工图的 ①扶梯、②楼梯、⑤透光立面使用**；无完工图的 ③酒店、④美利道、⑥入口亭则改为 `finish-and-detail-verification` / `surface-and-joint-details`，专注表面与节点特写）。
  6. `buyer-specification-checklist`（`Specification Checklist`）：给同类项目建筑师/总包的实用询盘与深化检查项（`points`：图纸格式、样板确认项、工地/运输限制）。
- **`conclusion`**（≤ 5000 字符，建议 300–500 字符）：精炼总结该工艺体系适用的商业场景，自然引导提交 CAD/PDF 询盘。
- **`relatedLinks`**（3–4 条站内有效链接，**禁止指向已停用的 `/products` 或 `/guides`**）：互链至同业务线案例 + 相关已发布技术博客（可用有效博客 slug 见下表）：
  - `/blog/luxury-metalwork-requirements-designers-owners`
  - `/blog/metalwork-raw-material-screening-process-and-quality-control`
  - `/blog/metalwork-welding-process-and-quality-control`
  - `/blog/metalwork-assembly-fit-out-process-and-quality-control`
  - `/blog/architectural-metalwork-packing-crating-guide`

---

## 三、图片预处理规范（所有案例上线前必做）

在写入 `content/case-drafts/` 之前，先在本地建一个临时预处理目录（例如 `output/stage2-media/<slug>/`），用 `sharp`（项目已安装或 Node 脚本）按以下规则处理每一张选中原图：

1. **格式与压缩**：全部转为 `.webp`（`quality: 84`），长边上限 `1920px`（`withoutEnlargement: true`），单图体积控制在 `80KB–280KB`；保留正向像素，移除无关 EXIF 元数据。
2. **日期水印裁切（仅限带 `_wm` 后缀的文件）**：
   - `01-helical-sculpture-staircase`（螺旋楼梯）及 `tiffany-exterior__twilight-hero__01..04_wm*.jpg` 右下角有相机日期水印（占画面底边 ~4%–5%）。
   - 处理规则：**统一裁切底部 6% 高度**（`extract({ left: 0, top: 0, width, height: Math.floor(height * 0.94) })`），既彻底清除日期水印，又不破坏主体构图（螺旋楼梯 `#28` 还可顺带裁掉底边 2 级带白胶带的踏步）。处理后必须视觉复核确认无残留数字。
3. **R2 存储键命名规范**：
   - 封面：`case-studies/<new-slug>/cover-<8位hash>.webp`
   - 正文图：`case-studies/<new-slug>/<2位序号>-<语义短名>.webp`
   - 对应 URL 前缀：`https://media.guoyaometal.com/<key>`
   - **重要校验约束**：`scripts/import-case-study.ts` 第 145–152 行会强校验：`content.json` 中引用的每一张图片 URL（含封面）都必须精确存在于 `meta.json` 的 `cover` 或 `images[]` 中，否则导入会报 `CHECK FAILED`！

---

## 四、6 篇案例逐篇执行清单（含精确素材路径与 SEO 元数据）

### 案例 1（新增 · 第一优先）：双曲香槟金扶梯中庭金属包覆

- **Slug**：`curved-fluted-escalator-atrium-cladding`
- **Category**：`Curved Cladding`
- **H1 Title**：`Double-Curved Fluted Metal Escalator Cladding for a Multi-Level Atrium`
- **SEO Title**（写入 `editorial-seo.ts`，≤60 字符）：`Double-Curved Fluted Metal Escalator Cladding`
- **SEO Description**（≤155 字符）：`Explore double-curved fluted champagne-bronze escalator cladding fabricated and 1:1 trial-assembled in our workshop before multi-level atrium installation.`
- **商标 / 水印风险**：**0 商标、0 水印（可直接原画幅转 WebP）**
- **精确素材路径**（均在 `D:\金属\_整理后素材库\02_Curved_Cladding\01-champagne-fluted-escalator-cladding\01_selects-top12\`，共 12 张全用）：
  - **Cover（宽屏主封面）**：`escalator-cladding__finished-hero__01.jpg`（1280×737，对称双扶梯中庭全景）
  - **章节 3（裸金属成型与打磨，3 张）**：
    - `escalator-cladding__fabrication-detail__01.jpg`（工作台裸金属罗纹曲面板打磨）
    - `escalator-cladding__fabrication-detail__02.jpg`（双曲罗纹板侧面折弯与翻边特写）
    - `escalator-cladding__fabrication-detail__03.jpg`（焊接修磨中的双曲端头骨架）
  - **章节 4（1:1 车间预拼装，6 张）**：
    - `escalator-cladding__factory-mockup__01.jpg`（竖幅整梯吊装预拼装）
    - `escalator-cladding__factory-mockup__02.jpg`（横幅整梯香槟金罗纹包覆 1:1 试装）
    - `escalator-cladding__factory-mockup__03.jpg`（仰视双曲罗纹底面与质检团队复核）
    - `escalator-cladding__factory-mockup__04.jpg`（香槟金双曲端头 3/4 侧面实拍）
    - `escalator-cladding__factory-mockup__05.jpg`（香槟金双曲端头高清单体试装）
    - `escalator-cladding__factory-mockup__06.jpg`（多套组件车间批量预拼装俯瞰）
  - **章节 5（现场完工成果，3 张）**：
    - `escalator-cladding__finished-hero__01.jpg`（对称双扶梯中庭全景）
    - `escalator-cladding__finished-hero__02.jpg`（多层中庭立面竖构图）
    - `escalator-cladding__finished-hero__03.jpg`（悬挑弧形端头挑空视角）
- **核心工程卖点**：双曲三维罗纹成型防起皱、香槟金表面方向一致性控制、钢结构治具上 1:1 整梯试装与分区编号出货。
- **推荐内链**：`/case-studies/murray-road-column-cladding`、`/blog/metalwork-welding-process-and-quality-control`、`/blog/metalwork-assembly-fit-out-process-and-quality-control`、`/blog/architectural-metalwork-packing-crating-guide`。

---

### 案例 2（新增 · 第二优先）：商业旗舰双曲螺旋雕塑楼梯

- **Slug**：`helical-metal-feature-staircase`
- **Category**：`Stairs & Balustrades`
- **H1 Title**：`Sculptural Helical Metal Staircase & Curved Balustrade Fabrication`
- **SEO Title**：`Helical Metal Feature Staircase & Balustrade`
- **SEO Description**：`See how a sweeping helical metal staircase was engineered from curved structural steel erection to mirror-finished balusters, dark curved handrails and stone treads.`
- **商标 / 水印风险**：**无品牌字标**；所有 12 张均带右下角日期水印（`_wm`），**必须统一裁切底边 6%** 后再转 WebP。
- **精确素材路径**（均在 `D:\金属\_整理后素材库\03_Stairs_Balustrades\01-helical-sculpture-staircase\01_selects-top12\`，共 12 张）：
  - **Cover（推荐横屏主封面）**：`helical-staircase__finished-hero__04_wm.jpg`（裁切底边 7%–8% 同步去除右下角日期与底部 2 级保护胶带；备选零胶带竖屏封面：`helical-staircase__finished-hero__01_wm.jpg`）
  - **章节 3（现场曲面钢结构梯梁吊装，3 张）**：
    - `helical-staircase__steel-erection__01_wm.jpg`（多层曲面钢结构全景）
    - `helical-staircase__steel-erection__02_wm.jpg`（无遮挡螺旋裸钢主梁）
    - `helical-staircase__steel-erection__03_wm.jpg`（沿曲面钢箱梁与踏步近景）
  - **章节 4（扶手与栏杆工艺细节，3 张）**：
    - `helical-staircase__craft-detail__01_wm.jpg`（弧形黑石材起步踏步衔接）
    - `helical-staircase__craft-detail__02_wm.jpg`（深色曲线扶手蜗卷收头特写）
    - `helical-staircase__craft-detail__03_wm.jpg`（镜面不锈钢立柱+深色扶手+切面镜墙）
  - **章节 5（近完工现场成果，6 张选 4–5 张不重复构图）**：
    - `helical-staircase__finished-hero__04_wm.jpg`（螺旋楼梯宏大仰拍）
    - `helical-staircase__finished-hero__01_wm.jpg`（干净黑石材双层 S 曲线）
    - `helical-staircase__finished-hero__03_wm.jpg`（双跑立面竖构图，无梯子干扰）
    - `helical-staircase__finished-hero__05_wm.jpg`（俯拍螺旋之眼几何构图）
    - `helical-staircase__finished-hero__06_wm.jpg`（高位连续丝带曲线视角）
- **推荐内链**：`/case-studies/curved-fluted-escalator-atrium-cladding`、`/blog/metalwork-welding-process-and-quality-control`、`/blog/metalwork-assembly-fit-out-process-and-quality-control`。

---

### 案例 3（新增 · 补齐第 4 板块）：五星酒店大堂黄铜展柜与定制固装

- **Slug**：`luxury-hotel-lobby-brass-vitrines-ffe`（取代原 `four-seasons-hotel-lobby-metalwork` 草稿）
- **Category**：`Display Vitrines & FF&E`
- **H1 Title**：`Bespoke Hammered Brass Display Vitrines & Hotel Lobby FF&E Metalwork`
- **SEO Title**：`Hotel Lobby Brass Display Vitrines & FF&E`
- **SEO Description**：`Custom hammered brass illuminated vitrines, marble-top consoles and lacquered back-bar joinery fabricated and trial-lit in our workshop for a luxury hotel lobby.`
- **商标 / 水印风险**：**0 商标、0 水印**（**严禁使用** `99_peninsula-branded-hold/` 中带 `THE PENINSULA` 标识的 2 张图；**严禁使用** `03_cluttered-drop/` 中带梯子/电扇/电瓶车/电线的 9 张图；**严禁使用**原草稿里的 `gy-*` AI 图）。
- **精确素材路径**（`D:\金属\_整理后素材库\04_Displays_Hospitality_FFE\01-luxury-hotel-lobby-ffe\01_selects-top8\` 共 8 张 + `02_workshop-other\` 酌情补选 1–2 张干净未亮灯展柜图）：
  - **Cover**：`hotel-lobby-ffe__brass-vitrine__03.jpg`（干净正面发光锤纹黄铜展柜）或 `hotel-lobby-ffe__green-backbar-table__04.jpg`（完整墨绿烤漆+黄铜收边背柜全景，横构图更适配封面）
  - **锤纹黄铜发光展柜组**：`hotel-lobby-ffe__brass-vitrine__01.jpg`（45° 斜拼锤纹转角王牌微距）、`hotel-lobby-ffe__brass-vitrine__02.jpg`（抽屉拉出工艺展示）、`hotel-lobby-ffe__brass-vitrine__03.jpg`（正面试灯效果）
  - **背柜、大理石服务台与配套家具组**：`hotel-lobby-ffe__green-backbar-table__04.jpg`（全墙背柜与大理石吧台）、`hotel-lobby-ffe__green-backbar-table__02.jpg`（弧形端头高柜）、`hotel-lobby-ffe__green-backbar-table__03.jpg`（对称墨绿高柜）、`hotel-lobby-ffe__marble-console__01.jpg`（大理石面+黄铜框+编织金属网服务台）、`hotel-lobby-ffe__green-backbar-table__01.jpg`（双色车木脚大理石圆几）
- **定位说明**：全部为工厂实拍，明确表述为 **Workshop Fabrication, Dry-Fit & Lighting Verification Record**，不虚构现场完工照片。
- **旧草稿清理**：如数据库中存在 `four-seasons-hotel-lobby-metalwork` 记录，将其设为 `ARCHIVED` 或保留草稿状态不发布；本地旧文件可归档或替换。

---

### 案例 4（重构线上旧稿 · 保留原 URL）：香港美利道双曲不锈钢包柱

- **Slug**：`murray-road-column-cladding`（**保持原 URL 不变**，已是工程词且无商标风险）
- **Category**：`Curved Cladding`（原为 `"Commercial · Curved column cladding"`，必须改为标准短分类）
- **H1 Title**：`Double-Curved Satin Stainless Steel Column Cladding — Workshop 1:1 Trial Assembly`
- **SEO Title**：`Double-Curved Stainless Steel Column Cladding`
- **SEO Description**：`Inside our 1:1 factory trial assembly of double-curved satin stainless steel column cladding for a Central Hong Kong tower, covering subframes, forming and hairline seams.`
- **重构核心动作**：
  - **彻底删除**原草稿中 `g01`–`g05` 等所有 AI 生成阶段图（开会、量尺、画图、来料、装箱、安装、验收）。
  - 从 `D:\金属\_整理后素材库\02_Curved_Cladding\02-murray-road-curved-column\01_all-verified-upright\`（已全部校正 28 张横躺竖柱图！）精选 **14–16 张纯实拍真图** + 保留实拍工厂视频 `murray-column-cladding__factory-video__01.mp4`（可复用原 R2 上已上传的视频 URL 以节省流量）。
  - 重点突出：**内部钢环龙骨 + 双曲分片展开压制 + 全高 1:1 竖立灯管阵检验表面波浪度 + 密缝背衬节点**。
  - **注意数据库状态**：重构期间先在本地验证 `content/case-drafts/murray-road-column-cladding.{meta,content}.json`；执行 `import-case-study.ts` 时注意该脚本会把 `publishedAt` 置空，因此在确认替换线上内容前，**不要直接覆盖正在线上展示的记录**，待人工审阅本地预览后再执行线上更新并恢复 `PUBLISHED` 与 `publishedAt`。

---

### 案例 5（重构线上旧稿 · 去品牌化 + 308 跳转）：高端精品店透光折面金属外立面

- **新 Slug**：`backlit-fluted-metal-boutique-facade`
- **旧 Slug（配置 308 永久重定向 + DB 设为 `ARCHIVED`）**：`tiffany-boutique-backlit-facade`
- **Category**：`Storefronts & Facades`
- **H1 Title**：`Backlit Fluted Metal Storefront Facade & Integrated Lighting System`
- **SEO Title**：`Backlit Fluted Metal Boutique Storefront Facade`
- **SEO Description**：`Engineering and fabrication of a backlit fluted silver metal retail facade, covering structural steel subframes, LED diffuser cassettes, darkroom 1:1 mock-ups and site handover.`
- **商标与图片策略**：
  - **彻底删除**原草稿中全部 `gy-*` AI 合成阶段图（`01-gy-kickoff` 至 `18-gy-aftercare`）。
  - 从 `D:\金属\_整理后素材库\01_Storefronts_Facades\02-tiffany-backlit-facade\` 精选 **12–15 张纯实拍真图**：
    - 优先挑选**不含清晰品牌字标或易于裁切弱化字标**的工程实拍：折面银色铝板/不锈钢折弯件阵列、钢结构副框车间拼装、LED 导光盒与柔光扩散层组装、暗房 1:1 发光均匀度及多色温测试、外立面转角对缝。
    - 现场夜景大图可优先选用 `01_exterior-hero-from-reel\tiffany-exterior__twilight-hero__04_wm.jpg`（无清晰字标！仅需裁切底边 6% 日期水印）以及 `02_full-lifecycle-137\` 中局部晶透立面与转角实拍；若保留含品牌字标的整体实拍，须在导入前经站主确认或对招牌区做构图裁切/模糊处理。
  - 正文全面改写为中性高端商业立面表述（*flagship jewelry boutique facade*），去掉“Tiffany & Co.”直呼与“delivered 2 boutiques in China”等未核查宣称。

---

### 案例 6（重构线上旧稿 · 去品牌化 + 308 跳转）：椭圆曲面金属入口亭 1:1 预拼装实录

- **新 Slug**：`elliptical-curved-metal-entrance-pavilion`
- **旧 Slug（配置 308 永久重定向 + DB 设为 `ARCHIVED`）**：`lancome-boutique-entrance-pavilion`
- **Category**：`Storefronts & Facades`
- **H1 Title**：`Elliptical Curved Metal Entrance Pavilion — 1:1 Factory Pre-Assembly`
- **SEO Title**：`Elliptical Curved Metal Retail Entrance Pavilion`
- **SEO Description**：`Full-scale 1:1 workshop pre-assembly of an elliptical curved metal retail entrance pavilion, detailing rolled oval ring beams, column nodes and curved fascia alignment.`
- **商标与图片策略**：
  - **彻底删除**原草稿中全部 `g01`–`g10b` AI 合成阶段图。
  - 从 `D:\金属\_整理后素材库\01_Storefronts_Facades\03-lancome-entrance-pavilion\01_factory-mockup-21\` 精选 **10–12 张纯车间实拍**（重点展示：椭圆环梁与弧形立柱整体试装、底部弧形基座节点、顶部放射状钢拉结环梁、立柱顶部连接节点、檐口转角 45° 拼缝；凡顶部黑檐口带明显 `LANCÔME` 字样的图，在预处理时裁切或柔化字标区，保留结构与节点清晰度）。
  - 诚实定位为 **1:1 Workshop Pre-Assembly Record**，删除旧稿里虚构的“2 nights on-site installation”“±0.8 mm”等未经工程单确认的数字（若无原始验收单据则改写为定性工艺控制说明）。

---

## 五、全站代码联动修改清单（精确到文件与行号）

### 5.1 新增 308 永久重定向：`guoyao/next.config.ts`

在 `nextConfig` 对象中增加 `async redirects()`：

```ts
  async redirects() {
    return [
      {
        source: "/case-studies/tiffany-boutique-backlit-facade",
        destination: "/case-studies/backlit-fluted-metal-boutique-facade",
        permanent: true,
      },
      {
        source: "/case-studies/lancome-boutique-entrance-pavilion",
        destination: "/case-studies/elliptical-curved-metal-entrance-pavilion",
        permanent: true,
      },
    ];
  },
```

### 5.2 更新案例精简 SEO 映射：`guoyao/src/lib/editorial-seo.ts`

- 将 `curatedEditorialSeo` 中原有的 3 条 `case-studies/*` 条目替换为上述 **6 篇新/重构案例的精确条目**（注意：`getEditorialSeo` 会严格比对 `sourceTitle === source.title` 和 `sourceExcerpt === source.excerpt`，因此这里的 `sourceTitle` 与 `sourceExcerpt` 必须与每篇 `.meta.json` 中的 `title`、`excerpt` 逐字一致，否则会静默回退到长标题！）。
- 保留现有的 4 条 `blog/*` 映射不变。

### 5.3 修复首页、About 页与旧样式中的链接引用

1. **修复失效博客链接**：
   - 在 `src/data/homepage-redesign-data.ts` 第 400–407 行，`FEATURED_ARTICLE.href` 当前指向 `/blog/metalwork-polishing-brushing-process-and-quality-control`（该文章线上不存在，会导致首页点击 404）。
   - 修改为指向当前线上真实存在的工艺文章，例如 `/blog/metalwork-welding-process-and-quality-control`（或 `/blog/metalwork-assembly-fit-out-process-and-quality-control`），并同步更新该对象的 `title` 与 `summary` 使其与目标文章一致。
   - 同步修正 `src/components/site/home-styles/style-2-swiss.tsx` 第 287 行的同一死链。
2. **更新首页推荐案例 `FEATURED_CASE_STUDIES`**（`src/data/homepage-redesign-data.ts` 第 271–305 行）：
   - 将原 3 个链接升级为 **不走重定向的直接新 URL**，建议首页精选 3 席覆盖 3 大核心业务线：
     - 01：`Curved Cladding` → `/case-studies/curved-fluted-escalator-atrium-cladding`（配 `escalatorAtriumWide` + `escalatorPodWorkshop`）
     - 02：`Stairs & Balustrades` → `/case-studies/helical-metal-feature-staircase`（配 `stairSpiralOverhead` + `stairElevation`）
     - 03：`Storefronts & Facades` → `/case-studies/backlit-fluted-metal-boutique-facade`（或保留 `/case-studies/murray-road-column-cladding`）
   - 确保首页内部链接 0 次触发 308 跳转。
3. **更新 About 页推荐案例 `SELECTED_STORIES`**（`src/components/site/about-folded-alloy.tsx` 第 208–242 行）：
   - 原代码硬编码了 `/case-studies/tiffany-boutique-backlit-facade`（标题含 `Tiffany & Co.`）与 `/case-studies/lancome-boutique-entrance-pavilion`。
   - 必须同步改为新去品牌 URL（`/case-studies/backlit-fluted-metal-boutique-facade`、`/case-studies/murray-road-column-cladding`、`/case-studies/elliptical-curved-metal-entrance-pavilion`，或替换为扶梯/楼梯新案例），并去品牌化标题文案，确保 `/about` 页 0 处触发 308 重定向。
   - 同步清理历史备用样式文件 `src/components/site/home-styles/style-2-swiss.tsx`（第 45、63 行）与 `style-3-gallery.tsx`（第 25、36 行）中的旧 URL 引用。
4. **同步更新单元测试：`guoyao/tests/editorial-seo.test.ts`**：
   - 该测试文件第 5–37 行直接断言了旧 slug `tiffany-boutique-backlit-facade` 及其旧标题 `"Tiffany & Co. Backlit Metal Facade"`。
   - 更新 `src/lib/editorial-seo.ts` 后，必须同步更新 `tests/editorial-seo.test.ts` 的测试样本为新 slug（如 `backlit-fluted-metal-boutique-facade`），确保全套 `npm test` 全部通过。
5. **检查线上博客正文内链（PostgreSQL `BlogPost` 表）**：
   - 在数据库执行只读排查：检查已发布博客正文是否包含 `/case-studies/tiffany-boutique-backlit-facade` 或 `/case-studies/lancome-boutique-entrance-pavilion` 链接；如有，更新为对应新去品牌 URL，避免站内互链多走一次 308 跳转。

### 5.4 原有 61 张 AI 虚构图片的逐层处置方案（严防漏删或误删）

经精确扫描 `content/case-drafts/*.meta.json`，现有 5 篇案例草稿中共混入 **61 张 AI 虚构阶段图**（均以 `gy-*` 或 `g01`–`g10b` 命名，用于强凑开会/量尺/画图/封样/装箱/安装/夜巡/售后阶段）：

| 旧草稿 Slug | 总图数 | **AI 虚构图** | 真实实拍图 | 阶段 2 处置动作 |
| :--- | :---: | :---: | :---: | :--- |
| `four-seasons-hotel-lobby-metalwork` | 33 | **12** | 21 | **全删 AI 图**；迁至新 slug `luxury-hotel-lobby-brass-vitrines-ffe`，仅保留干净真图（且剔除 2 张半岛图） |
| `lancome-boutique-entrance-pavilion` | 33 | **13** | 20 | **全删 AI 图**；迁至新 slug `elliptical-curved-metal-entrance-pavilion`，仅保留 10–12 张车间真图 |
| `murray-road-column-cladding` | 54 | **12** | 42 | **全删 AI 图**；原地重构，仅保留 14–16 张精选车间真图 + 实拍视频 |
| `piaget-boutique-entrance-portal` | 23 | **14** | 9 | **不发布独立案例**（AI 图比真图还多）；DB 保持 `DRAFT` 或 `ARCHIVED`，真图留阶段 3 能力页 |
| `tiffany-boutique-backlit-facade` | 61 | **10** | 51 | **全删 AI 图**；迁至新 slug `backlit-fluted-metal-boutique-facade`，仅保留 12–15 张工程真图 |

**四层存储环境的精确处置规则**：
1. **前端页面 & 数据库正文（立即 100% 清零）**：新/重构的 6 篇 `.content.json` 与 `.meta.json` 中 **0 张 AI 虚构图引用**；发布新案例并将旧记录切为 `ARCHIVED` 后，线上任何公开案例页与 sitemap 均不再出现这 61 张 AI 图。
2. **Cloudflare R2 云端旧对象（先断链、暂缓物理删除）**：
   - 阶段 2 **不要立刻批量删除** R2 中 `case-studies/<old-slug>/*-gy-*.webp` 和 `*-g0*.webp` 对象（避免在代码上线切换窗口期造成旧缓存页破图，也保留紧急回滚能力）。
   - 待阶段 2 线上稳定运行 **7–14 天**、GSC 已完成新 URL 收录与 308 识别后，再按旧前缀一次性批量清理 R2 孤立对象释放空间。
3. **本地旧草稿文件 (`content/case-drafts/`)**：
   - 将不再发布的旧草稿（`tiffany-*`、`lancome-*`、`four-seasons-*`、`piaget-*`）移入 `content/case-drafts/_archived-legacy-ai/` 归档留痕，避免被误执行 `import-case-study.ts` 重新导回线上。
4. **明确区分“博客工艺示意图”（阶段 2 保留不动）**：
   - 博客文章（如 `architectural-metalwork-packing-crating-guide`）中的配图属于**技术科普原理图/结构示意图**，且正文已诚实标注 *“All images are illustrative”*，**不属于冒充真实客户案例的 AI 假图**，阶段 2 保持不动（阶段 3 再按需用 `D:\金属` 里的焊缝/试装真图做增强）。

### 5.5 明确不改的文件

- **`src/lib/site-identity.ts`**：**不要改动**（保持 `COMPANY_NAME = "广州市国耀高薪材料科技有限公司"` 原样）。

---

## 六、分步执行顺序与验收标准（给执行 AI 工具的 Checklist）

请按以下严格顺序执行，每完成一步做一次校验：

1. **Step 1 · 编写图片预处理脚本并出图**
   - 编写一次性脚本（存放在 `output/stage2-media/prepare-stage2-images.mjs`）从 `D:\金属\_整理后素材库\` 读取上述 6 篇案例的选中图片，执行：① `_wm` 图片底边裁切 6%–8% 去日期水印；② 需要去标的局部裁切/柔化；③ 统一转为 WebP（≤1920px，84% quality）；④ 输出到 `output/stage2-media/<slug>/`。
   - 视觉抽检所有裁切后的 `_wm` 与封面图，确认 **0 残留日期数字、0 倒置、0 畸变**。
2. **Step 2 · 生成 6 组标准化 `.meta.json` 与 `.content.json`**
   - 路径：`guoyao/content/case-drafts/<slug>.{meta,content}.json`。
   - 对全部 6 份 `.content.json` 运行 `caseStudyContentSchema.parse(...)` 离线校验，确认 **0 Schema 错误**，且所有 `category` 严格为 4 个标准短分类之一、无任何 `gy-*`/`g01` AI 图残留。
   - （可选但推荐）为 6 篇草稿生成本地静态预览 HTML 放在 `output/stage2-media/previews/` 供站主先审图文。
3. **Step 3 · 修改代码文件**
   - 更新 `next.config.ts`（308 重定向）、`src/lib/editorial-seo.ts`（6 篇精简 SEO 标题与摘要）、`src/data/homepage-redesign-data.ts` 与 `style-2-swiss.tsx`（修首页死链 + 更新推荐案例链接）。
   - 再次确认 `git diff src/lib/site-identity.ts` 为空（未误改公司名）。
4. **Step 4 · 本地构建与静态质量回归**
   - 在 `d:\guoyao\guoyao` 运行：
     ```powershell
     npm run typecheck
     npm run lint
     npm test
     npm run build
     ```
   - 全部 0 报错通过（重点确认 `tests/editorial-seo.test.ts` 与文章/案例校验测试全部通过）。
5. **Step 5 · 数据库备份 + 入库草稿预览（需站主确认环境后再执行）**
   - 修改数据库前先备份当前 `CaseStudy` 表（导出 JSON 快照到 `output/stage2-media/db-backup-before-stage2.json`）。
   - 对 3 篇全新案例（扶梯、楼梯、酒店）及 2 篇新去品牌 slug（透光立面、椭圆入口亭）运行 `npx tsx scripts/import-case-study.ts <slug>`，全部以 `status: "DRAFT"` 写入数据库并上传 WebP 到 R2。
   - **特别注意 `murray-road-column-cladding`**：因 `import-case-study.ts` 会将已有记录的 `status` 改为 `DRAFT` 且置空 `publishedAt`，**切勿在站主未审核前直接对它跑导入脚本**（可先在本地预览 HTML 审定，确认上线切换窗口时再原地更新并立即恢复 `PUBLISHED` 与原 `publishedAt`）。
   - 提醒站主在后台 `/admin/case-studies/[id]/preview` 逐篇检查桌面端（1440px）和手机端（390px）渲染。
6. **Step 6 · 站主审定后统一发布、SEO 终检与 GSC 提交**
   - 站主确认无误后：批量将 6 篇新/重构案例状态切为 `PUBLISHED`（注意 `scripts/toggle-case-status.ts` 原先写死了单个兰蔻 slug，可传参改造或用通用一次性脚本处理），并将 4 条旧记录（`tiffany-boutique-backlit-facade`、`lancome-boutique-entrance-pavilion`、`four-seasons-hotel-lobby-metalwork`、`piaget-boutique-entrance-portal`）切为 `ARCHIVED`。
   - 部署后运行只读 SEO 审计脚本核验全站：
     ```powershell
     npx tsx scripts/audit-seo.ts https://www.guoyaometal.com https://www.guoyaometal.com output/seo-stage2/after-deploy.json
     ```
   - 终检通过条件：
     - `/case-studies` 列表页正确显示 **4 个分类筛选标签** 且点击筛选正常；
     - 2 个旧品牌 URL 返回 **HTTP 308** 指向对应新 URL；
     - `/sitemap.xml` 仅含 6 篇新/重构案例，无旧归档 URL；
     - 首页、`/about`、博客内链全部返回 **HTTP 200**，0 死链、0 破图、0 横向溢出、**0 张 `gy-*`/`g0*` AI 虚构图出现在线上 HTML 中**。
   - **GSC 收口动作**：在 Google Search Console 重新提交 `https://www.guoyaometal.com/sitemap.xml`，并对 5 个新/迁移 URL 执行「URL 检查 → 请求编入索引」，同时抽查 2 个旧 URL 确认 Google 已识别 308 重定向。
   - **7–14 天后可选清理**：确认线上与 GSC 稳定无异常后，按需清理 R2 中旧前缀下的 61 张孤立 AI 图对象。
