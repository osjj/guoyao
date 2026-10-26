# Guoyao Metal GSC 提交前检查记录

检查日期：2026 年 10 月 26 日。主站规范域名为 https://www.guoyaometal.com 。

本次完成了线上抓取检查和本地代码修复。最终本地生产构建中，站点地图的 11 个公开页面、站内链接、规范网址、结构化数据和错误状态回归通过。**代码尚未提交、推送或部署；提交 GSC 前应先上线本次修改并复查线上结果。**

## 已修复的问题

| 问题 | 线上检查结果 | 本地修复 |
| --- | --- | --- |
| 主域信号不一致 | 裸域 301 跳到 www，但 11 页 canonical、站点地图和组织数据仍用裸域 | 统一 Guoyao 域名为 HTTPS www，覆盖旧环境变量配置；canonical、OG、JSON-LD、robots 和 sitemap 使用同一来源 |
| 无关产品可以被收录 | `/products` 返回 200、允许索引，展示 514 件旧玻璃器皿商品 | 停用公开产品列表、分类、详情入口，直接返回 404；保留后台和数据库记录 |
| 旧玻璃指南仍公开 | `/guides` 已跳到博客，旧子页仍输出玻璃内容 | 旧指南详情返回 404；保留 `/guides` 到 `/blog` 的永久跳转 |
| 搜索标题和摘要冗长 | 详情页标题含品牌后约 76–131 字符，摘要约 265–500 字符；About 重复品牌 | 为现有 4 篇博客和 3 个案例逐篇写精简 SEO 标题、摘要；修正 About 标题；保留正文长标题和内容 |
| 临时故障被当成正常页 | 博客、案例数据失败时输出 200 的 unavailable 页面或临时 noindex | 让服务错误向上传播；故障注入实测列表、详情、sitemap 返回 500，真实不存在时返回 404；增加安全重试界面 |
| 图片未按展示尺寸优化 | 博客、案例图片使用 unoptimized，缩略图也下载原图 | 已配置的可信图片来源使用响应式 srcset；未知外链、GIF/APNG/SVG 保留原图，灯箱继续使用原图 |
| 作者和日期信息不足 | 详情已有 Article 和面包屑数据，组织作者和可见更新日期未完整对应 | 增加可见的 Guoyao Metal 组织署名及真实更新日期，并与 Article author/dateModified 对应 |
| 抓取配置需要补齐 | robots 未覆盖 API，后台根路径需明确排除索引 | 后台、API、healthz 增加 X-Robots-Tag；登录页允许抓取以读取 noindex，其余后台继续受身份验证保护 |
| 站点地图读取过重 | 为 URL 列表读取整篇文章和案例内容 | 只查询已发布且已到发布时间的 slug、updatedAt、封面；加入封面图片条目；单个无效封面不再拖垮整个 XML |

规范化信号保持一致，符合 [Google canonical 指南](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)。站点地图使用数据库实际更新时间；不伪造每天更新的 lastmod，并移除 Google 不使用的 priority/changefreq。参见 [Google Sitemap 指南](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)。

SEO 标题和描述由 `src/lib/editorial-seo.ts` 管理，使用原始标题和摘要校验，避免后台之后的编辑被旧 SEO 文案覆盖。上述长度是可读性选择，Google 没有统一的字符数量硬限制。

## 验证结果

- 最终 `npm run build` 通过，包括 TypeScript 检查；修改文件的 ESLint 和 `git diff --check` 通过。
- 11 项新增 URL、图片来源、SEO 文案行为测试，以及 17 项现有文章内容和案例数据测试通过，共 28 项。
- 本地生产服务器的 sitemap 11 页均为 200，各有唯一 H1、标题、描述、与站点地图一致的 canonical 和 OG URL；站点内部内容链接检查未发现错误。
- 7 个停用或不存在的路径探针均为实际 HTTP 404；后台登录和后台跳转、API、healthz 的响应头均包含 noindex。
- 断开测试进程的数据库连接后，博客列表/详情、案例列表/详情、站点地图均为 HTTP 500，未向 HTML 泄露连接串。Next.js 的错误页可能自动带 noindex；本次修复的关键是正确的 500 状态。
- 线上 309 个不同原始图片地址最终均返回 200。响应式交付抽样实测：640px 博客封面约 42KB、案例封面约 68KB、焊接文章封面约 34KB，对应原图约 203KB、345KB、175KB；这些是该尺寸请求的传输体积，不是整页性能分数。
- 线上首页、About、焊接文章、Murray 案例的 390px 手机抽查无横向溢出或已加载破图；关闭 JavaScript 后仍可读取正文，动画未隐藏内容。
- Organization、WebSite、Article、BreadcrumbList JSON-LD 可解析；About 另增加 AboutPage。组织作者符合 [Google Article 文档](https://developers.google.com/search/docs/appearance/structured-data/article) 的类型要求。

公司成立年份、规模、认证历史和团队履历已由站主在本次对话明确确认真实，因此保留。项目照片、工艺内容及现有销售联系方式继续使用网站资料。

## 上线和提交顺序

1. 将本次代码部署到网站运行目录，设置 `NEXT_PUBLIC_SITE_URL=https://www.guoyaometal.com` 后重新构建并重启服务。无需数据库迁移或内容写入。若线上仍输出旧 canonical，检查运行构建及对应 HTML/robots 的 CDN 缓存。
2. 在 GSC 添加 `guoyaometal.com` 的 Domain 资源，用其提供的 DNS TXT 记录验证。Domain 资源覆盖 www 和图片子域；已有该资源则直接使用。参见 [Google 资源类型和验证说明](https://support.google.com/webmasters/answer/34592?hl=zh-Hans)。URL 前缀验证也可使用新接入的 `GOOGLE_SITE_VERIFICATION` 环境变量，填入验证标签 content 的值后重新构建。
3. 上线后重新执行以下只读检查，确认没有发现项。脚本会校验当前 sitemap 全部 URL，新增发布的页面也会被纳入。

   ```powershell
   npx tsx scripts/audit-seo.ts https://www.guoyaometal.com https://www.guoyaometal.com output/seo-20261026/production-after-deploy.json
   ```

4. 在 GSC 的站点地图中提交 [正式 sitemap](https://www.guoyaometal.com/sitemap.xml)。不提交旧 products/guides 子页、后台或草稿。
5. 用 URL 检查分别测试首页、About、一个案例和一个博客。确认 Google 实时测试可访问且未被阻止，核对所选规范网址；再对重点页面请求编入索引。参见 [Google URL 检查说明](https://support.google.com/webmasters/answer/9012289?hl=zh-Hans)。
6. 对线上代表性详情页运行 [Rich Results Test](https://search.google.com/test/rich-results)，再观察 GSC 的网页索引、站点地图和增强功能报告。

## 后续优化

PageSpeed 公共接口本次网络请求失败，尚无 Lighthouse 分数或真实用户 Core Web Vitals 结论。上线后可用 [PageSpeed Insights](https://pagespeed.web.dev/) 检查首页、一个博客和一个案例，并观察 GSC 后续积累的数据。手机浏览器的无节流检查不能替代性能测试。

当前 HTTP 裸域需要先跳 HTTPS 裸域再跳 www。可在 Cloudflare/服务器将目标直接设为 HTTPS www，减少一跳；当前跳转已能到达正确页面。

后续内容应围绕现有金属案例和真实工艺，逐步补齐客户关心的材料、表面处理、图纸要求、样品确认和交付范围。需要拓展门面、曲面包覆、楼梯或展示装置的服务页时，应提供独立且有用的内容，避免只替换关键词复制页面。参见 [Google 以人为本内容原则](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)。

技术检查通过和 sitemap 提交有助于发现与理解页面，**不保证收录时间、收录数量或排名**。Google 的最低技术要求是可抓取、正常页面返回 200、有可索引内容；最终索引仍由 Google 决定。参见 [Google 技术要求](https://developers.google.com/search/docs/essentials/technical)。

## 检查证据

机器检查结果保存在 `output/seo-20261026/`，该目录按项目规则不纳入 Git：

- `live-audit.json`、`live-audit-summary.json`：修复前线上网页与跳转。
- `assets-audit.json`：309 个原始图片的可访问性。
- `browser-mobile.json`、`browser-no-js.json` 与截图：线上手机和禁 JavaScript 检查。
- `local-verification.json`：最终本地生产构建的 HTTP 回归。
- `outage-verification.json`：测试进程数据库不可达时的响应状态。
- `image-delivery-verification.json`：响应式图片交付抽样。
