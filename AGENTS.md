# Makimoo Headless Store — 项目规则

Next.js 14 静态导出站点（`output: export` → `out/`）。数据源三方：站内数据（`src/data/`）、素材库（http://106.55.160.52:8080）、Shopify（mkhome-3.myshopify.com，Storefront API）。

## 产品标识与 SKU 规则（长期遵守）

- **站内内部 key 统一用 ASIN**（`B0xxxxxxxx`，8 位字母数字）。产品数据、图片目录 `public/images/products/{ASIN}/`、各映射文件的 key 都是小写 ASIN。SKU 不在页面展示，不做内部 key。
- **新格式 SKU**（如 `US-F61ZXX`、`DE-0P0QIZ`）的权威来源是**素材库**（items 的 `sku` 字段）。
- **Shopify 匹配只认 tags**：Shopify 产品的 tags 里必须恰好打一个 ASIN，且与素材库一致。老的 SKU=ASIN 格式的关联已全部废弃，不得再按 SKU 匹配。
- **重复 ASIN 处理**：同一 ASIN 出现多个 Shopify 产品时，使用 tags 里带 ASIN 的新上传产品。
- **校验闭环**：Shopify 产品的 SKU 必须等于素材库中该 ASIN 的 `sku`，不一致要报警（防止 tag 打错/建错产品）。
- **剔除名单**：`B0F1YCXTRX`（早期错误数据，宠物窝误打坐垫 ASIN）已从全站剔除，记录在 `scripts/build-shopify-map.js` 的 `EXCLUDED_ASINS`，重新跑同步脚本时不得重新接入。

## 数据同步流程

1. `node scripts/sync-materials.js` — 拉素材库（makimoohome 分组 groupId=18，密码见脚本/会话记录），白底图优先+去重，下载转 WebP（q82，≤1600px）到 `public/images/products/{ASIN}/`，生成 `materials-map.ts` 和 `products-materials.ts`（新品条目，自动分类、白底检测）。
2. `node scripts/build-shopify-map.js` — 拉 Shopify 全部产品，按 tags ASIN 匹配，生成 `shopify-map.ts`（variantId/价格/在售状态）。
3. 标题精简映射 `src/data/short-titles.ts`：≤100 字符、去 "Makimoo" 品牌词、保留件数/关键属性/尺寸/颜色。
4. `npm run build` 重建。

## 展示规则

- 白底图（四边像素 R/G/B≥245 比例≥70% 判定）：产品卡加 `p-5 sm:p-7`、详情主图 `p-6 sm:p-8` 缩小显示；场景图打满。图区容器统一白底。缺货产品灰化 40% 并沉底。
- 产品卡（含 Featured）：标题含 "Set of X" / "X Pack" / "X-Pack" / "Pack of X" 自动打 `{X} Pack` 标签。
- 首页 Featured 区块用 `variant="featured"`（固定高度+渐变底），与其它卡片样式独立。
- 全站退货政策统一为 **30 天**。
- 下单走 `variantId`（`gid://shopify/ProductVariant/...`），随 `shopify-map.ts` 更新，Shopify 后台删老产品不会造成站内断链。

## 本地预览

- `npm run build` 前必须停掉占用 8080 的静态服务器（否则 EBUSY 锁 `out/`）。
- 预览：`python -m http.server 8080`（cwd = `out/`），访问 http://localhost:8080。

## Git

- remote：`git@github.com:vertex1984-lang/vertex.git`，推送后 Vercel 自动部署。commit/push 必须用户明确要求后才执行。
