# Parachute (parachutehome.com) 站点结构与互链调研

> 调研时间：2026-09。用途：Makimoo V2 信息架构与互链设计参考。
> 数据来源：首页/PDP/集合页 HTML（SSR 部分）、Shopify sitemap 索引（products ×2、collections ×1、pages ×1、blogs ×1）、博客正文。JS 渲染模块（Best Sellers tab、Rebuy 推荐）系从模板标记推断。

## 1. URL 层级规律

- 纯 Shopify 扁平结构：`/collections/{handle}`、`/products/{handle}`、`/pages/{handle}`、`/blogs/posts/{handle}`。
- **URL 层没有父子集合**（不存在 `/collections/bedding/duvet-covers`），层级完全由导航菜单虚拟表达。
- 用**海量切面集合**（500+ 个 collection）弥补扁平结构，同一产品隶属多个集合：
  - 按品类：`sheet-sets`、`duvet-covers`、`towels`
  - 按材质：`percale-bedding`、`linen-bedding`、`turkish-cotton-towels`
  - 按颜色：`the-white-edit` ~ `the-ink-edit`（13 个色系 edit）
  - 按促销：`sale-bedding`、`bed-bundles-15-off`、`last-chance`
  - 按营销场景：`get-the-look-*`、gift guide
  - 内部工具集合（不暴露）：`recommended-items-in-cart`（购物车推荐）、`*-lead-gen`（广告落地）
- 集合分页 `?page=N`；多语言路径前缀 `/en-ca/`。

## 2. 顶部导航（Mega Menu，8 个一级入口）

Best Sellers / New Arrivals / Bedding / Inserts / Mattress / Bath / Decor / Sale。

分组维度是**四轴交叉**：

| 轴 | 例子 |
|---|---|
| 品类 | Sheets、Layers（Duvet Covers / Quilts / Throws） |
| 材质 | Percale / Linen / Brushed Cotton / Sateen（栏头统一链 `/pages/fabrics`） |
| 人群 | Baby 系列 |
| 促销 | Bundles 15% off 卡（直接链捆绑产品页） |

手法要点：

- **Mattress 一级入口直接链产品页**（非集合）。
- mega menu 的 Fabric 栏"双出口"：材质集合页 + `/pages/fabrics` 科普页，教育内容与购买路径在导航层合并。
- Inserts 菜单直接收录博客导购文（`/blogs/posts/down-down-alternative-guide`）。
- 菜单内含促销卡（nav-promo），链 campaign 集合或具体产品。

## 3. 首页互链落点

- 公告栏 → 促销条款/活动 LP
- Hero → campaign 主题集合（如 `/collections/setting-the-mood-2`）
- Best Sellers tab（All/Bedding/Bath/Decor）→ 各自 best-sellers 集合；产品卡 → `/products/x`
- Shop by Category 图卡 → 核心品类集合
- Shop by Shade 色卡轮播（13 色）→ 各 `/collections/the-x-edit`（颜色横跨全品类的浏览入口）
- Fabric Guide 区块 → `/pages/fabrics`
- Sale 区块 → `/collections/all-sale`

## 4. 产品页（PDP）互链模块

- Bundle & Save 交叉推荐 → 捆绑集合/捆绑产品页
- Rebuy 算法推荐（You may also like，JS 渲染）
- 变体 swatch 互链（同色不同款、同款不同色）
- Klaviyo UGC 评论模块
- 历史上每个产品配 `/pages/details-x`、`/pages/material-x`、`/pages/size-guide-x` 三件套内容页，现多以 PDP 弹窗呈现

## 5. Footer 结构（4 组）

- **Shop**：Bedding、Bath、Best Sellers、Decor、Gift Card、Fabric Swatches
- **Inspiration**：Fabrics、Blog、Stores
- **Help**：Returns、Care Instructions、Promotion Terms、FAQ
- **Company**：Our Story、Press、Sustainability、Recycling、Careers、Privacy、Terms

## 6. 内容营销与互链

- **博客 `/blogs/posts`**：60+ 篇 SEO 导购文（Percale vs Sateen vs Linen、Towel Guide、Thread Count 等）。互链：文章 ↔ 文章（相关阅读）、文章 → 材质/品类集合页（正文内"Browse our collections"）。
- **材质内容中心 `/pages/fabrics`**：每种面料一页（What / How made / Pros & Cons / Is it right for you）。导航 Fabric 栏栏头落点，页内链回材质集合——**内容页 ↔ 集合页双向互链核心枢纽**。
- 配套页族：`/pages/care`（洗涤指南）、`/pages/inspiration`、`/pages/lookbook`、色彩测试 quiz。
- 广告/活动 LP：`/pages/lp-*` 与 `*-lead-gen` 集合配套。

## 7. 可借鉴的互链模式（总结）

1. **四轴切面集合**（品类×材质×颜色×促销）替代树状子分类，集合重叠实现任意维度浏览。
2. **导航双出口**：集合页 + 科普页并列，教育与购买在导航层合并。
3. **PDP 交叉销售**：Bundle & Save + 算法推荐；捆绑装做成独立产品页再被集合收录。
4. **内容枢纽页**（Fabric Guide）作为内容营销与商品目录的双向桥梁；博客做 SEO 收口，LP 做广告收口。

## 8. 对 Makimoo 的映射（现状 → 增强方向）

| Makimoo 现状 | Parachute 参照 | 增强方向 |
|---|---|---|
| cat / sub 分类 + material URL 筛选 | 四轴切面集合 | 已具备基础；可加"颜色"维度（Shop by Color / Color Edits） |
| 首页 Material Guide → `?material=` 列表 | `/pages/fabrics` 内容枢纽 | 材质页升级为内容枢纽页（特性/保养/适合谁），导航与首页指向它，页内链回列表——SEO + 转化双收益 |
| 2 Pack / 4 Pack 仅为产品卡 badge | Bundle & Save + 独立捆绑产品页 | 套装做成显式推荐模块；BoughtTogether 组件已有（开关 `SHOW_BOUGHT_TOGETHER=false`，可评估开启） |
| You May Also Like（详情页） | Rebuy 推荐 | 已有，逻辑可继续调优 |
| 无博客/导购内容 | `/blogs/posts` SEO 收口 | 长期方向：材质/选购指南类内容页 |
