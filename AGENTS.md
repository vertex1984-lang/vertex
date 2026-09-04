# Makimoo Headless Store — 项目规则

Next.js 14 静态导出站点（`output: export` → `out/`）。数据源三方：站内数据（`src/data/`）、素材库（http://106.55.160.52:8080）、Shopify（mkhome-3.myshopify.com，Storefront API）。

## 产品标识与 SKU 规则（长期遵守）

- **站内内部 key 统一用素材库的 `asin` 字段**：亚马逊 ASIN（`B0xxxxxxxx`）或 1688 供应商标识（`1688-xxx` / `1688-xxx-Cx`）。产品数据、图片目录 `public/images/products/{标识}/`、各映射文件的 key 都是小写标识。SKU 不在页面展示，不做内部 key。
- **新格式 SKU**（如 `US-F61ZXX`、`DE-0P0QIZ`）的权威来源是**素材库**（items 的 `sku` 字段）。
- **Shopify 匹配只认 tags**：Shopify 产品的 tags 里必须恰好打一个产品标识（ASIN 或 1688-xxx），且与素材库一致。老的 SKU=ASIN 格式的关联已全部废弃，不得再按 SKU 匹配。
- **重复标识处理**：同一标识出现多个 Shopify 产品时，使用 tags 里带标识的新上传产品。
- **校验闭环**：Shopify 产品的 SKU 必须等于素材库中该标识的 `sku`，不一致要报警（防止 tag 打错/建错产品）。
- **剔除名单**：`B0F1YCXTRX`（早期错误数据，宠物窝误打坐垫 ASIN）已从全站剔除，记录在 `scripts/build-shopify-map.js` 的 `EXCLUDED_ASINS`，重新跑同步脚本时不得重新接入。

## 产品核实 + 更新流程（每次素材库/Shopify 有更新时直接执行）

1. `node scripts/sync-materials.js <素材库密码>` — 拉素材库（makimoohome 分组 groupId=18），下载转 WebP（q82，≤1600px）到 `public/images/products/{标识}/`，生成 `materials-map.ts`（全部素材产品覆盖表）和 `products-materials.ts`（站点没有的新产品条目，自动分类、白底检测）。幂等，图片数量一致时跳过下载；`--force` 强制重下。
2. `node scripts/build-shopify-map.js` — 拉 Shopify 全部产品，按 tags 标识匹配，校验 SKU 一致性，生成 `shopify-map.ts`（variantId/价格/在售状态/重量 weight+weightUnit）。
3. `node scripts/extract-specs.js` — 从标题/描述/handle 提取尺寸（归一化 cm）和材质（关键词词典），生成 `product-specs.ts` 并打印覆盖率报告。提取不准/缺失的手工补在 `specs-overrides.ts`（前台优先）。
4. `npm run build` 重建后核验，用户确认后推送。

### 图片展示顺序（首图=第 1 张）

图片池 = 素材库 `images`（用户上传）∪ `imageTypes` 的 key（标注类型的图）。展示优先级：

1. **场景展示图** → 2. **无文字场景图1** → 3. **白底主图** → 4. **用户上传图**（本地白底检测：非白底场景图在前、白底在后）→ 5. 卖点图 → 6. 细节特写图 → 7. 尺寸图 → 8. 营销主图

文件编号按下载顺序固定，展示顺序由 `materials-map.ts` 的 images 数组定义。

### 分类规则

`classify()` 自动分类：标题含 bath mat/towel/rug/kitchen mat/door mat 等 → **Bath**；travel/neck pillow → Travel；pillowcase/insert 等 → Pillows；dining → Dining；chair/seat cushion → Cushions；其余 → Others。Bath 已加入 products 页分类筛选（顶部导航未加，需要时再加）。

### 二级分类（subcategory）

- 注册表与判定逻辑：`src/data/subcategories.ts`（`classifyProduct(productType, title, asin)`，enrich 时写入 `product.subcategory`，URL 参数 `?sub=`）。
- **判定用完整标题**（素材库覆盖后、精简前），避免关键词被短标题截断。
- Cushions 按形态/尺寸分组：`rocking`（摇椅垫 = 50×43 上下两件套或标题含 rocking）、`hb-medium`（95×45 连体高背，含 90×45）、`hb-large`（110×55 高背）、`seat-pad`（43×43 方形坐垫 + 47×8 圆形坐垫）。无独立兜底组，判不了的按标题 high-back 词进 hb-medium、否则 seat-pad。
- 产品卡眉头标签显示二级分类短名（`productCategoryTag()`），无二级分类的显示顶级分类名。
- 类目页筛选面板：`Collections`（二级分类单选）+ `Material`（多选）；Price/Size/Availability 筛选已移除（用户要求）。二级分类不再以 pills 形式出现在类目页顶部，入口在 /categories 汇总页和 Collections 筛选行。
- Pillows：quilted→`quilted`；embossed/pillowcase/covers→`embossed`；其余→`basic`。
- Towels：beach→`beach`；hand/face towel 或 40×80 四件装→`hand-face`；其余→`bath-towels`。
- Mats：按关键词在标题中**最早出现位置**定主用途（kitchen/door/area-rugs/bath-mats，兜底 other-mats）——标题尾部常堆场景词，不能用包含匹配定优先级。
- Others：`travel`（neck pillow/travel）、`kitchen-tools`（pepper mill/grinder/kitchen 等）、`extras`（兜底：自行车篮、香薰炉等）。
- 四个错标产品已按标题归正：95×45 椅垫 B0DSGCLBVW/B0DSGCKWXW（Pillows→Cushions，含 "chair cushion"）；枕芯 B0F62QGV32、枕套 B0GJLVMHT7（Others→Pillows，pillowcase/insert 规则）。顶级计数：Cushions 66 / Pillows 29 / Towels 14 / Mats 14 / Others 15。
- 裸 `/products` 已取消（前端重定向到 `/categories` 汇总页）；`/products?cat=x` 类目页含二级分类 pills（吸顶）+ 常态展开筛选；`/categories` 为二级分类汇总静态页。
- `/categories` 二级分类卡片的缩略图目前是**临时的**：自动取该组第一个在售产品的首图（`repImage()`，场景图优先于白底图）。**后续要为每个二级分类生成专属缩略图替换**（用户已确认此计划）。

### 标题规则

- 手工精简表 `src/data/short-titles.ts`（≤100 字符、去 "Makimoo"、保留件数/关键属性/尺寸/颜色）优先。
- 无手工条目的新产品由 `products.ts` 的 `autoShortenTitle()` 自动精简（去品牌词，>100 字符在逗号/空格处截断）。

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

## V2 重构（feature/v2-redesign 分支）

### 双版本结构

- **`src/app/(classic)/` = 线上版**：URL 不变（`/`、`/products/` 等），经典壳（Header/Footer）在 `(classic)/layout.tsx`。**不要改动 (classic) 下任何文件**。
- **`src/app/(v2)/v2/` = 新版**：URL 前缀 `/v2/`，组件在 `src/components/v2/`（V2Header fixed 透明→实底 / V2Footer / V2PageHeader 深色页头等）。
- 根 `src/app/layout.tsx` 是极简壳（fonts/Toast/Analytics/全站 metadata），两个 route group 各自带自己的 Header/Footer 壳。

### V2 开发约定

- **站内链接一律走 `v2url()`**（`src/lib/v2paths.ts`）：自动加 `/v2` 前缀再交给 `resolveUrl` 处理 file:// 兼容；图片等静态资源用 `resolveUrl()`。
- **颜色只用 Tailwind token**（`brand` / `cream` / `off-white` / `charcoal` / `warm-gray`），不写死 hex。例外：从 (classic) 复用/沿用的组件与内容（如政策页复用 `src/components/Policy.tsx`，正文沿用旧版样式）保持原样。
- 新组件放 `src/components/v2/`，页面放 `src/app/(v2)/v2/`；fixed 透明 Header 要求每个页面第一屏能衬住（首页/ about 大图页头，内页 `V2PageHeader` 的 bg-brand + pt-32）。
- client 页面的 metadata 由同目录 route `layout.tsx` 提供（见 `v2/cart/layout.tsx`、`v2/products/layout.tsx`）。

### 切换流程（验收后执行）

1. 把 `(v2)/v2/` 下页面移到 `src/app/` 根路径。注意 route group 冲突：`(classic)` 与根路径同名页面不能共存，需先把 `(classic)` 整体改名或删除。
2. 全站链接去掉 `/v2` 前缀：`src/lib/v2paths.ts` 的 `v2url()` 改为直通 `resolveUrl(path)` 即可，一处改动。
3. 重新构建部署。
4. 回滚 = `git revert` 切换 commit。

### 构建副作用提醒

`npm run build` 会更新 `src/data/shopify-map.ts` 和 `public/sitemap.xml` 的时间戳。提交前如非有意更新数据，先还原：`git checkout -- src/data/shopify-map.ts public/sitemap.xml`。
