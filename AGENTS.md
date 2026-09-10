# Makimoo Headless Store — 项目规则

Next.js 14 静态导出站点（`output: export` → `out/`）。数据源三方：站内数据（`src/data/`）、素材库（http://106.55.160.52:8080）、Shopify（mkhome-3.myshopify.com，Storefront API）。

## 产品标识与 SKU 规则（长期遵守）

- **站内内部 key 统一用素材库的 `asin` 字段**：亚马逊 ASIN（`B0xxxxxxxx`）或 1688 供应商标识（`1688-xxx` / `1688-xxx-Cx`）。产品数据、图片目录 `public/images/products/{标识}/`、各映射文件的 key 都是小写标识。SKU 不在页面展示，不做内部 key。
- **新格式 SKU**（如 `US-F61ZXX`、`DE-0P0QIZ`）的权威来源是**素材库**（items 的 `sku` 字段）。
- **Shopify 匹配优先级：tags > SKU 兜底**。tags 里恰好打一个产品标识（ASIN 或 1688-xxx）为最优先；无 tag 时按 SKU 反查素材库 `sku` 字段兜底接入（`build-shopify-map.js`，控制台打 `SKU fallback:` 日志）；带 tag 的记录永远优先于兜底记录。老的 SKU=ASIN 格式关联仍只作兜底。
- **重复标识处理**：同一标识出现多个 Shopify 产品时，使用 tags 里带标识的新上传产品。
- **校验闭环**：Shopify 产品的 SKU 必须等于素材库中该标识的 `sku`，不一致要报警（防止 tag 打错/建错产品）。
- **剔除名单**：`B0F1YCXTRX`（早期错误数据，宠物窝误打坐垫 ASIN）已从全站剔除，记录在 `scripts/build-shopify-map.js` 的 `EXCLUDED_ASINS`，重新跑同步脚本时不得重新接入。

## 产品核实 + 更新流程（每次素材库/Shopify 有更新时直接执行）

1. `node scripts/sync-materials.js <素材库密码>` — 拉素材库（makimoohome 分组 groupId=18），下载转 WebP（q82，≤1600px）到 `public/images/products/{标识}/`，生成 `materials-map.ts`（全部素材产品覆盖表）和 `products-materials.ts`（站点没有的新产品条目，自动分类、白底检测）。幂等：`scripts/materials-manifest.json` 记录每个产品的图片 URL 顺序，数量/顺序/内容有变才重下（打印 `[图片更新]`）；`--force` 强制全部重下；`--keep-order` 保持素材库原始图片顺序（素材库已排好序时用，跳过下面的优先级重排）。
2. `node scripts/build-shopify-map.js` — 拉 Shopify 全部产品，按 tags 标识匹配，校验 SKU 一致性，生成 `shopify-map.ts`（variantId/价格/在售状态/重量 weight+weightUnit）。
3. `node scripts/extract-specs.js` — 从标题/描述/handle 提取尺寸（归一化 cm）和材质（关键词词典），生成 `product-specs.ts` 并打印覆盖率报告。提取不准/缺失的手工补在 `specs-overrides.ts`（前台优先）。
4. `npm run build` 重建后核验，用户确认后推送。

### 图片展示顺序（首图=第 1 张）

图片池 = 素材库**初审定版图**（`images` 数组，顺序即展示顺序，与素材库详情页所见一致；`imageTypes` 的标注图、`whiteBgImages` 均不入站）。同步加 `--keep-order` 保持该顺序，不做优先级重排。

文件编号按下载顺序固定，展示顺序由 `materials-map.ts` 的 images 数组定义。旧的类型优先级重排规则（场景图 > 白底图 > …）已废止，仅在不加 `--keep-order` 时作为遗留逻辑保留在脚本中。

例外：**Blankets 全部 23 个产品首图置顶**——用户指定首图统一为"铺床场景图"样式（参照 `1688-969627065032-C40/4.webp`），由脚本里的 `PIN_FIRST_URLS`（5 个 URL，覆盖深灰/蓝/银灰/奶黄/浅紫 5 个图片族）实现：命中产品把该图排到 images 数组第一，其余图顺位后移，文件编号不变。

### 分类规则

`classify()` 自动分类：标题含 duvet/bedding/bed linen/quilt cover/comforter/fitted sheet 等 → **Bedding**；含 blanket → **Blankets**（两条先于 Pillows 判定，床品标题常带 pillowcases）；含 bath mat/towel/rug/kitchen mat/door mat 等 → **Bath**；travel/neck pillow → Travel；pillowcase/insert 等 → Pillows；dining → Dining；chair/seat cushion → Cushions；其余 → Others。全站一级类目 8 个：Cushions / Pillows / Towels / Mats / Bedding / Blankets / Holiday（暂无产品）/ Others；V2 导航曾用的 Bath 标签已统一改名为 **Towels**。顶部导航顺序（双版本一致）：Shop All → **Bedding → Pillows → Cushions → Towels → Mats → Blankets**（Others 不在导航，仅页脚）。Bedding/Blankets 无二级类目，mega menu 只展示右侧图卡。

### 隐藏名单

`scripts/sync-materials.js` 的 `HIDDEN_ASINS`：素材库保留但不生成站点条目。当前：`1688-1051650740507` / `1688-1051650740507-C2`（两款蕾丝边被套，用户要求全站隐藏）。

### 二级分类（subcategory）

- 注册表与判定逻辑：`src/data/subcategories.ts`（`classifyProduct(productType, title, asin)`，enrich 时写入 `product.subcategory`，URL 参数 `?sub=`）。
- **判定用完整标题**（素材库覆盖后、精简前），避免关键词被短标题截断。
- Cushions 按形态/尺寸分组：`rocking`（摇椅垫 = 50×43 上下两件套或标题含 rocking；另含手工指定的三个连体靠背垫 B0CW1TBZV3/B0CW17PZYT/B0CW1LDN6L，见 `subcategories.ts` 的 `SUB_OVERRIDES`）、`hb-medium`（95×45 连体高背，含 90×45）、`hb-large`（110×55 高背）、`seat-pad`（43×43 方形坐垫 + 47×8 圆形坐垫）。无独立兜底组，判不了的按标题 high-back 词进 hb-medium、否则 seat-pad。
- 产品卡眉头标签显示二级分类短名（`productCategoryTag()`），无二级分类的显示顶级分类名。
- 类目页筛选面板：`Collections`（二级分类单选）+ `Material`（多选）；Price/Size/Availability 筛选已移除（用户要求）。二级分类不再以 pills 形式出现在类目页顶部，入口在 /categories 汇总页和 Collections 筛选行。
- Pillows：quilted→`quilted`；embossed/pillowcase/covers→`embossed`；其余→`basic`。
- Towels：beach→`beach`；hand/face towel 或 40×80 四件装→`hand-face`；其余→`bath-towels`。
- Mats：按关键词在标题中**最早出现位置**定主用途（kitchen/door/area-rugs/bath-mats，兜底 other-mats）——标题尾部常堆场景词，不能用包含匹配定优先级。
- Others：`travel`（neck pillow/travel）、`kitchen-tools`（pepper mill/grinder/kitchen 等）、`extras`（兜底：自行车篮、香薰炉等）。
- 四个错标产品已按标题归正：95×45 椅垫 B0DSGCLBVW/B0DSGCKWXW（Pillows→Cushions，含 "chair cushion"）；枕芯 B0F62QGV32、枕套 B0GJLVMHT7（Others→Pillows，pillowcase/insert 规则）。顶级计数：Cushions 64 / Mats 36 / Pillows 29 / Blanket 23 / Bedding 23 / Others 17 / Towels 14。
- 裸 `/products` 已取消（前端重定向到 `/categories` 汇总页）；`/products?cat=x` 类目页含二级分类 pills（吸顶）+ 常态展开筛选；`/categories` 为二级分类汇总静态页。
- `/categories` 二级分类卡片的缩略图目前是**临时的**：自动取该组第一个在售产品的首图（`repImage()`，场景图优先于白底图）。**后续要为每个二级分类生成专属缩略图替换**（用户已确认此计划）。

### 标题规则

- 手工精简表 `src/data/short-titles.ts`（≤100 字符、去 "Makimoo"、保留件数/关键属性/尺寸/颜色）优先。
- 无手工条目的新产品由 `products.ts` 的 `autoShortenTitle()` 自动精简（去品牌词，>100 字符在逗号/空格处截断）。
- **按二级类目标题化**（用户确认的新方向，逐个类目推进）：标题只写属性，不写产品类名，标点一律英文。已完成：**Rocking Chair** = `材质/图案, Tufted, with Ties - 95x45cm, 颜色`（统一标注 95x45cm，不写 Set/Pack 件数）；**High-Back Medium** = `Outdoor Cushions, 尺寸 - 颜色/图案`（95 款写 95 x 45cm，90 款写 90 x 45cm，颜色/图案按素材库实际描述区分，如 Blue Monet Garden / Red Green Geometric / Khaki）；**High-Back Large** = 同格式（110 x 55cm，圆背款实际标注 110 x 53cm；同一颜色图案同时有 2 件装和 4 件装的，末尾加 `, Set of 2/4` 区分）；**Seat Pads** = `Seat Cushions, Tufted, 尺寸 - 颜色/图案`（43 款写 43 x 43cm，圆形写 47cm Round，18.5 英寸款写 47 x 47cm；4 个藤椅垫非 Tufted 工艺，标题不带 Tufted）；**Pillows/Basic** = `Pillow Inserts, 尺寸, Soft & Durable White`（全部白色枕芯；两个 45 x 45cm 同款用 Throw Pillow Inserts / Pillow Inserts 区分）；**Pillows/Quilted** = `Pillow Inserts, 尺寸, Premium Quality White`；**Pillows/Embossed** = `Pillowcases, 尺寸, Premium Quality, 颜色`（11 个枕套/枕罩按此格式；3 个 b0gd* 是填充睡枕而非枕套，写 `Bed Pillows, 尺寸, Premium Quality, White`）；**Towels/Bath Towels**（仅白底+条纹款）= `Luxury Cotton Bath Towels, Premium Quality, 颜色`（bath-towels 共 8 个，只有 1688-1044064113195 系列 3 个是白底条纹款；两个 Grey 条纹款尺寸不同，末尾加 `, 80 x 160cm` / `, 70 x 140cm` 区分；其余 5 个纯色款未标题化，等用户给格式）；**Towels/Beach** = `Thick Cotton Beach Towels, 颜色`（4 个全是双色条纹款，颜色统一写 X and White：Red / Grey / Yellow / Blue and White）；**Towels/Hand & Face** = `Cotton Hand Towels Hotel Spa Style, 颜色`（2 个：White / Grey，其中 White 款原标题是 Face Towels，按用户格式统一写 Hand Towels）；**Mats 全部四个子类目**（kitchen 5 / bath-mats 6 / door 1 / area-rugs 2，共 14 个）= `材质+样式+功能`，每条 ≤10 个单词，逐个按素材库标题+首图拟写；同款区分：两个 Beige 厨房垫用 Vintage Tile / Solid Cuttable 区分，三个白色棉浴室垫用 Embossed Footprint / Jacquard Stone Pattern / Plain Extra Thick 区分，成对的椭圆垫和圆地毯末尾加颜色（Off White / Brown、Camel / White）；**Others**（15 个）= 逐条 ≤10 单词：12 个旅行颈枕分三组写 `Memory Foam Travel Neck Pillow with Storage Bag, 颜色` / `Adjustable Memory Foam Travel Neck Pillow, 颜色` / `Inflatable Velvet Travel Neck Pillow with Carry Bag, 颜色`（各 Black/Grey/Blue/Pink），另 3 个单品：Wicker Bicycle Basket / Hanging Cauldron Oil Burner / Greek Pepper Mill。

注意：产品原始数据有两处来源——`products.ts` 的 BASE_PRODUCTS 和 `products-materials.ts` 的 MATERIALS_PRODUCTS，枚举类目成员时两个文件都要解析（travel/home fragrance→Others 的归并只影响 BASE_PRODUCTS）。

## 展示规则

- 白底图（四边像素 R/G/B≥245 比例≥70% 判定）：产品卡加 `p-5 sm:p-7`、详情主图 `p-6 sm:p-8` 缩小显示；场景图打满。图区容器统一白底。缺货产品灰化 40% 并沉底。
- 产品卡（含 Featured）：标题含 "Set of X" / "X Pack" / "X-Pack" / "Pack of X" 自动打 `{X} Pack` 标签。
- 首页 Featured 区块用 `variant="featured"`（固定高度+渐变底），与其它卡片样式独立。
- 全站退货政策统一为 **30 天**。
- **Frequently Bought Together（详情页搭配购）暂时下线**：产品数量太少，搭配推荐意义不大。组件保留在 `src/components/BoughtTogether.tsx`，由 `ProductDetailClient.tsx` 顶部的 `SHOW_BOUGHT_TOGETHER = false` 开关控制。**后续产品够多了（用户确认后）改回 `true` 并重新构建即可启用**，启用前注意复核横版布局在桌面端不换行。
- **规格表（详情页 Specifications）**：Weight 来自 Shopify（`formatWeightDual`，≥1kg 用 kg/lb、<1kg 用 g/oz，两位小数去尾零；Shopify 重量为 0 不显示该行）；Dimensions/Material 来自 `product-specs.ts`（`formatDimensionsDual`，cm 和 in 各自四舍五入到最近的 0.5）。格式化函数在 `src/lib/specs.ts`。
- **用户会在 Shopify 后台用 metafields 维护尺寸和重量**：当用户要求"抓取 Shopify metafields 覆盖规格"时，扩展同步脚本读取产品 metafields（尺寸/重量），生成或覆盖 `product-specs.ts` 中对应字段（metafields 优先于文本提取，低于 specs-overrides.ts 手工表）。届时需先向用户确认 metafield 的 namespace/key 命名。
- 下单走 `variantId`（`gid://shopify/ProductVariant/...`），随 `shopify-map.ts` 更新，Shopify 后台删老产品不会造成站内断链。
- 1688 供应商标识的产品无亚马逊链接，`amazonUrl` 为空（在售时前台显示 Add to Cart，不显示 Amazon 按钮）。

## 本地预览

- `npm run build` 前必须停掉占用 8080 的静态服务器（否则 EBUSY 锁 `out/`）。
- 预览：`python -m http.server 8080`（cwd = `out/`），访问 http://localhost:8080。

## Git

- remote：`git@github.com:vertex1984-lang/vertex.git`，推送后 Vercel 自动部署。commit/push 必须用户明确要求后才执行。

## 协作开发

- 仓库为 **Public**，协作者：**OnishiAguri**（Write 权限，2026-09 加入）。
- **`main` 已启用服务端分支保护**（ruleset `protect-main`，2026-09 配置）：禁止 force push、禁止删除分支；**仓库所有者（vertex1984-lang）可直推 main**（2026-09 v2 上线实测直推成功，ruleset 对所有者不拦截）。协作者（OnishiAguri）如被拦截，走分支 → PR → 所有者 approve → Squash merge 流程。
- 推送/合并进 `main` 即触发 Vercel 自动上线，注意改动影响。
- 动工前先 `git pull` 并基于最新 `main` 开分支，避免冲突。
- `.env.local` 不进仓库：协作者需自行创建（Shopify 三个环境变量 + `SEEANY_API_KEY`，由用户线下私下传递）。

## SeeAny AI 生图 API

用于生成/编辑网站配图（电商场景优化）。文档：https://www.seeany.com/developer

- **认证**：`Authorization: Bearer $SEEANY_API_KEY`（key 存于 `.env.local` 的 `SEEANY_API_KEY`，账户名 makimoohome；`.env*.local` 已被 gitignore，不要把 key 写进代码或提交）
- **创建任务**：`POST https://api.seeany.com/api/ai/smarttask`，头加 `User-Agent: seeany-api`、`Content-Type: application/json`
- **请求体**：
  ```json
  {
    "aiTypeId": 113,
    "aiType": "smartImg",
    "prompt": "中文描述即可",
    "inputImgs": ["可选，参考图 URL"],
    "imgNum": 1,
    "imgRatio": "1:1 / 4:3 / 16:9 / 21:9 等",
    "mode": "nano-banana-pro",
    "size": "1K"
  }
  ```
- **响应**：`{"code":0,"data":{"task_uuid":"wtask_...","wait_time":40}}` —— 全异步架构，拿 task_uuid 后轮询取结果（支持 Webhook）
- **轮询**：查询任务状态/结果的具体端点以文档为准（生成后从任务接口取图 URL，下载转 WebP 进 `public/images/`）
- **能力**：文生图、参考图生图、白底图（一键抠图换底）、AI 图片编辑（抠图/扩图/消除/变清晰）、AI 视频
- 风格约定：全站米色 #F8F5F0 + 暖棕 #8B5A2B 家居调性，prompt 里注明色调；品牌 Logo/吉祥物不要让 AI 画（易变形）

## V2（已上线为正式版，2026-09 切换）

### 版本结构

- **`src/app/(v2)/` = 线上正式版**：v2 页面已切换到根路径（`/`、`/products/` 等），组件在 `src/components/v2/`（V2Header fixed 透明→实底 / V2Footer / V2PageHeader 深色页头等）。
- **旧版（classic）保留在 `legacy/classic/`**：源码完整保留但**不在路由内、全站无入口**，仅供查阅；不要改动，也不要把链接指回去。回滚 = `git revert` 切换 commit（或参考该目录恢复）。
- 根 `src/app/layout.tsx` 是极简壳（fonts/Toast/Analytics/全站 metadata），`(v2)/layout.tsx` 是 V2 的 Header/Footer 壳。

### V2 开发约定

- **站内链接一律走 `v2url()`**（`src/lib/v2paths.ts`）：v2 切换后已直通 `resolveUrl()`（保留 file:// 兼容），不再加前缀；图片等静态资源用 `resolveUrl()`。
- **颜色只用 Tailwind token**（`brand` / `cream` / `off-white` / `charcoal` / `warm-gray`），不写死 hex。例外：从 classic 复用/沿用的组件与内容（如政策页复用 `src/components/Policy.tsx`，正文沿用旧版样式）保持原样。
- 新组件放 `src/components/v2/`，页面放 `src/app/(v2)/`；fixed 透明 Header 要求每个页面第一屏能衬住（首页/ about 大图页头，内页 `V2PageHeader` 的 bg-brand + pt-32）。
- V2Header 顶部促销条（Announcement Bar）向下滚动超过阈值后自动收起（桌面/移动一致），回到顶部附近再展开，由 `scrolled` 滞回阈值（60/30px）控制。透明起始页判定：首页（`/`）和 `/about/`。
- 产品列表页（`(v2)/products/page.tsx`）展示样式：classic `ProductCard` 白卡 + Collections/Material 左侧筛选栏 + 二级分类分区视图 + Load More；版心是 V2 全宽容器（px-6 / lg:px-10，无 1400px 边框盒），列数不变，产品卡随页面宽度等比增大。产品卡与 QuickViewModal 通过可选 `href`/`detailHref` prop 覆盖详情链接。
- client 页面的 metadata 由同目录 route `layout.tsx` 提供（见 `(v2)/cart/layout.tsx`、`(v2)/products/layout.tsx`）。
- 首页 Featured Products 区：桌面端 5:8 bento 网格（左侧两张 1:1 焦点大卡上下排列 + 右侧 2×2 小卡，两侧总高对齐）；移动端为横向滚动条（6 张统一大小 V2ProductCard），两套布局 `lg:hidden` / `hidden lg:block` 互斥。

### 构建副作用提醒

`npm run build` 会更新 `src/data/shopify-map.ts` 和 `public/sitemap.xml` 的时间戳。提交前如非有意更新数据，先还原：`git checkout -- src/data/shopify-map.ts public/sitemap.xml`。
