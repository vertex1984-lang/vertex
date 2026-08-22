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
2. `node scripts/build-shopify-map.js` — 拉 Shopify 全部产品，按 tags 标识匹配，校验 SKU 一致性，生成 `shopify-map.ts`（variantId/价格/在售状态）。
3. `npm run build` 重建后核验，用户确认后推送。

### 图片展示顺序（首图=第 1 张）

图片池 = 素材库 `images`（用户上传）∪ `imageTypes` 的 key（标注类型的图）。展示优先级：

1. **场景展示图** → 2. **无文字场景图1** → 3. **白底主图** → 4. **用户上传图**（本地白底检测：非白底场景图在前、白底在后）→ 5. 卖点图 → 6. 细节特写图 → 7. 尺寸图 → 8. 营销主图

文件编号按下载顺序固定，展示顺序由 `materials-map.ts` 的 images 数组定义。

### 分类规则

`classify()` 自动分类：标题含 bath mat/towel/rug/kitchen mat/door mat 等 → **Bath**；travel/neck pillow → Travel；pillowcase/insert 等 → Pillows；dining → Dining；chair/seat cushion → Cushions；其余 → Others。Bath 已加入 products 页分类筛选（顶部导航未加，需要时再加）。

### 标题规则

- 手工精简表 `src/data/short-titles.ts`（≤100 字符、去 "Makimoo"、保留件数/关键属性/尺寸/颜色）优先。
- 无手工条目的新产品由 `products.ts` 的 `autoShortenTitle()` 自动精简（去品牌词，>100 字符在逗号/空格处截断）。

## 展示规则

- 白底图（四边像素 R/G/B≥245 比例≥70% 判定）：产品卡加 `p-5 sm:p-7`、详情主图 `p-6 sm:p-8` 缩小显示；场景图打满。图区容器统一白底。缺货产品灰化 40% 并沉底。
- 产品卡（含 Featured）：标题含 "Set of X" / "X Pack" / "X-Pack" / "Pack of X" 自动打 `{X} Pack` 标签。
- 首页 Featured 区块用 `variant="featured"`（固定高度+渐变底），与其它卡片样式独立。
- 全站退货政策统一为 **30 天**。
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
