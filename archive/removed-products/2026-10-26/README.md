# 已移除产品归档（2026-10-26）

本目录保存 2026-10-26「彻底移除」批次被下架产品的数据切片与图片，仅供日后恢复使用。
网站上这些产品及其入口已全部清除（PDP 404、类目/搜索/变体组/推荐/sitemap 均不再出现）。

## 内容

- `handle-asin-map.json` — 111 条 handle ↔ ASIN/SKU 映射（恢复时的索引）
- `data/` — 各数据文件中被剥离的原始切片，按文件命名：
  - `products-ts-BASE_PRODUCTS.json` / `products-materials-MATERIALS_PRODUCTS.json` — 产品主条目
  - `variant-groups.members` / `variant-groups.empty-groups` — 变体组成员与整组
  - `product-reviews.*`、`materials-map.*`、`specs-overrides.*`、`short-titles.*` 等 — 对应文件的行/块切片
  - `product-reviews.constants.ts.txt` — 孤儿评论常量（原为 .ts，改名避免 tsc 扫描归档目录）
- `images/` — 114 个产品图片目录/文件（原位于 `public/images/products/<ASIN>/`）

## 恢复方法

1. 按 `handle-asin-map.json` 找到目标 handle/ASIN。
2. 把 `data/` 中对应切片还原到原文件（注意各文件行尾风格：variant-groups.ts 为 lone-\r，product-reviews.ts 为混合 CRLF）。
3. 把 `images/<ASIN>/` 拷回 `public/images/products/<ASIN>/`。
4. 从 `src/data/products.ts` 的 `HIDDEN_HANDLES` / `HIDDEN_HANDLE_PREFIXES` 中移除对应条目。
5. `npx tsc --noEmit && npm run build` 重新构建。

## 备注

- 本批次含事故修复：archive 脚本曾误删 variant-groups.ts 中 21 个非空变体组，
  已由 `scripts/restore-variant-groups.js` 以 git HEAD 为基底恢复（仅移除隐藏成员与真空组）。
