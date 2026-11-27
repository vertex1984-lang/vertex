# Makimoo 运营后台（本地演示版）

给运营人员用的站点商品内容管理平台。**当前为本地演示版**：不依赖 Shopify 凭证，数据全部来自 vertex 仓库的构建快照。

## 运行

```bash
npm install
npm run import   # 从 vertex 仓库导入商品快照（~2300 商品 + 85 场景死链诊断）
npm run dev      # http://localhost:4200
```

默认账号：`admin` / `makimoo2026`（存于 `data/db.json`，首次启动自动生成）。

前置：`.env.local` 里 `VERTEX_ROOT` 指向 vertex 仓库（默认 `D:\opencode_workspace\vertex`）。

## 功能（演示版范围）

| 模块 | 能力 |
|---|---|
| 仪表盘 | 商品/状态总量统计、类目分布、快照一键重新导入 |
| **上新商品（上货向导）** | 4 步表单：基础信息 → **尺寸 × 花色矩阵**（一次批量生成 N 条）→ 图片上传（直写 vertex/public）→ 价格与上架方式（Coming Soon / 直接上架）；合成 handle/ASIN 自动查重；提交进待发布清单 |
| 商品管理 | 搜索（标题/SKU/handle）、状态筛选、分页列表；编辑**标题 / 价格 / 划线价 / 上架状态**（在售 / Coming Soon / 已下架）；图片墙 |
| 变更与发布 | 字段修改 + 新品统一进待发布清单（diff/备注/撤销）；一键发布：字段覆盖 → `admin-overrides.json`，新品 → `admin-products.json`（vertex 已接入消费） |
| 数据健康 | 场景热区死链双口径诊断（真死链 + 404 风险）、Coming Soon / 无 Shopify 关联计数 |

## 架构（与 vertex 的关系）

```
vertex 仓库（只读快照 + 两个接入口）
  └─ src/data/products.ts ──npm run import──▶ data/snapshot.json（快照，含 enrich 后价格/状态）
后台编辑字段 ──▶ data/db.json（pending/published 覆盖）
后台新品向导 ──▶ data/db.json（newProducts，pending/published）
     │
     └─ 点发布 ─┬─ ▶ vertex/src/data/admin-overrides.json（字段覆盖，vertex 侧待接入）
                └─ ▶ vertex/src/data/admin-products.json（新品+变体组，vertex 已接入 ↓）

vertex 侧接入口（已实现，见下）：
  products.ts      → PRODUCTS_DATA 末尾合并 admin-products.json.products
  variant-groups.ts → VARIANT_GROUPS 末尾合并 admin-products.json.variantGroups
  → 新品自动获得：落地页（getStaticPaths 全量）、搜索、类目页、变体互链、场景热区可绑定
  → 构建期合并，空数组 = 完全无影响
```

- **快照** = vertex enrich 后的最终数据（与前台渲染同口径），运营看到的数值就是线上数值；发布新品后点「重新导入快照」新品即出现在列表。
- **修改** = 覆盖字段记录（`旧值 → 新值`，可撤销），不直接改快照。
- **新品** = 结构化记录（合成 handle/ASIN，规则对齐 planned 商品惯例：price 0 + availableForSale false = Coming Soon）。
- **发布**：字段覆盖 → `admin-overrides.json`（vertex 侧消费待接）；新品+变体组 → `admin-products.json`（**vertex 已接入**：products.ts / variant-groups.ts 构建期合并，接入口已在 vertex 工作区，未提交）。

## 已知边界（演示版）

- 图片：新品可上传（直写 vertex/public/images/products/），已有商品换图在正式版开放；库存只读（写回需要 Shopify Admin API 凭证）。
- 新品变体组已随发布写入（同批次按花色聚合），但"加入现有系列加一个花色"的模式还在下一批。
- 单账号（admin），正式版加角色与审计。
