# PDP 付费流量落地优化方案（2026-09）

> 目标：PDP 作为 TikTok / 付费搜索的主要落地页，提高留存率、点击率、加购率。
> 诊断依据：两套 PDP 组件代码通读 + 移动端 390×844 首屏实测截图。

## 背景：两套 PDP 组件

- 新版：`src/app/(v2)/products/[handle]/ProductDetailUpgrade.tsx`（795 行）
  - 仅 `NEW_PRODUCT_HANDLES` 白名单商品使用（`src/data/new-product-handles.ts`）
  - 有花色圆点 / 尺寸选择器 / Details 五点卖点 / 锚点 Tab / 移动端吸底加购条
  - **无星级评分行**
- 老版：`src/app/(v2)/products/[handle]/V2ProductDetailClient.tsx`（514 行）
  - 大部分 SKU 使用
  - 有星级评分行（244–261 行，可锚到 `#reviews`），无变体选择器
- 挂载层：`src/app/(v2)/products/[handle]/page.tsx`（198 行）
  - 服务端组装 colorVariants / sizeVariants（仅新品）、JSON-LD
  - 页尾顺序：V2ProductReviews → V2RelatedGuides → V2RecentlyViewed
- 评价数据：`src/data/product-reviews.ts`（rating / reviewCount 在 `src/data/products.ts`）

## 现状诊断

1. **移动端首屏零购买信息（最严重）**
   实测首屏 = 两行 announcement bar + 导航 + 面包屑 + 大方图 + 缩略图排，只露出
   `BEDDING · In Stock` pill。标题、价格、评分、卖点、加购按钮全部要下滑一屏。
2. **Cookie 横幅遮挡吸底加购条**（截图证实）
   cookie 弹层占屏幕底部约 30%，直接盖住移动端吸底 Add to Cart。新站访客几乎都是
   首次到访 = 几乎每个落地用户的加购条都被挡。
3. **新版 PDP 首屏无社会证明**
   星级行只在老版有；新品白名单 PDP 恰是落地主力却没有。评价区在页面最底部
   （隔着 Description 长图 + 规格表），到达率极低。
4. **老版 PDP 手风琴文案错误（bug 级）**
   `V2ProductDetailClient.tsx:34` Materials & Care 写的是户外布料文案
   （"Premium outdoor polyester fabric with UV-fade resistance..."），
   床品页面出现防水户外布文案，直接摧毁信任。
5. **花色切换是整页跳转**
   新版色点为 `<a href>` 跳对应色 PDP，整页 reload，弱网用户每次换色都白屏等待。
6. **信任元素单薄**
   运保文案藏在手风琴里；加购按钮下无支付方式图标、无预计送达时间。
7. **加购后动线断头**
   加购只弹 miniCart + toast，无"再买一件"引导。

## 优化清单

### P0 — 快赢（工作量小，直接补信任）

| # | 项目 | 位置 | 工作量 |
|---|------|------|--------|
| 1 | 新版 PDP 加星级评分行：H1 下方，有 rating/reviewCount 才显示，有评价正文时可点击锚到 `#reviews`（直接复用老版 `V2ProductDetailClient.tsx:244-261` 的实现） | `ProductDetailUpgrade.tsx` | 小 |
| 2 | 修老版 PDP 手风琴户外布料错误文案，改成通用床品洗护文案 | `V2ProductDetailClient.tsx:34` | 极小 |
| 3 | Cookie 横幅不再遮挡吸底加购条（改小条 / 上移 / 错层，两版 PDP 都有吸底条 z-1200） | cookie banner 组件 | 小 |
| 4 | 加购按钮下加信任行：Free shipping · 30-day returns · Secure checkout + 支付方式 SVG 图标（Visa / MC / PayPal / Apple Pay） | 两版 PDP buy box | 小 |

### P1 — 首屏说服力

| # | 项目 | 说明 | 工作量 |
|---|------|------|--------|
| 5 | 移动端首屏压缩：面包屑移动端精简；主图 aspect-square → 4:5（或加 max-h），让标题+评分+价格挤进第一屏 | `ProductDetailUpgrade.tsx` 图集区 | 中 |
| 6 | 预计送达文案："Order today, arrives by {date}"，按现有 5–10 工作日政策动态计算 | buy box Ships 文案处 | 小 |
| 7 | announcement bar 移动端两行合并成一行 | layout 顶部条 | 小 |

### P2 — 体验升级

| # | 项目 | 说明 | 工作量 |
|---|------|------|--------|
| 8 | 花色/尺寸切换改无刷新：客户端换图集+价格，URL 用 replaceState 更新 | `ProductDetailUpgrade.tsx` + `page.tsx` | 大 |
| 9 | 评价模块上移（紧跟 buy box 之后、Description 之前），或锚点 Tab 增加 Reviews 项 | `page.tsx` 组装层 | 中 |
| 10 | miniCart 内加一条轻量交叉推荐（⚠️ 需产品方确认：2026-09 曾移除 Complete the Look 推荐区） | miniCart 组件 | 中 |

## 运营侧（非代码）

- TikTok 广告素材与落地 PDP 首图/卖点保持一致；广告推哪个色就链到哪个色的 PDP
  （色点本就是独立 URL，天然支持）。
- UTM 参数规范，便于 GA4 归因（已有 view_item / add_to_cart 事件）。

## 实施约定

- 协作方在 `feat/pdp-v2-features` 分支开发，推送到远程后由产品方 review，
  **确认后才合并到 main**（main 为唯一上线点，Vercel 只部署 main）。
- 改动验收方式：本地重建后 localhost:8080 双端（桌面 1440 / 移动 390×844）截图核对。
- 建议实施顺序：P0 全部 + P1 的 5/6 为一批，一次验证。
