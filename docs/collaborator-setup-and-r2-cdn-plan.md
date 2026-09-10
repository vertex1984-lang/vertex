# 协作者拉取指南 与 Cloudflare R2 CDN 迁移计划

> 创建时间：2026-09-08
> 背景：仓库 pack 体积约 880 MB（本地产品图 `public/images/products/` 约 110 MB + git 历史累积），
> 需要给协作者提供轻量拉取方式，并规划图片迁移到 Cloudflare R2。

---

## 一、协作者拉取仓库（浅克隆）

### 前提

- 已接受 GitHub 仓库协作邀请（邀请链接 7 天有效）
- 已配置 SSH key 到 GitHub 账户（否则改用 HTTPS 地址克隆）

### 推荐命令（浅克隆，只下载最新快照，不含历史旧图）

```bash
git clone --depth 1 git@github.com:vertex1984-lang/vertex.git
cd vertex
npm install
npm run dev
```

- 浅克隆只拉最新一次提交，体积远小于完整克隆（完整 pack ≈ 880 MB）
- `node_modules`、`out/` 均在 `.gitignore` 中，克隆后必须 `npm install`
- HTTPS 方式（未配 SSH 时）：`git clone --depth 1 https://github.com/vertex1984-lang/vertex.git`

### 浅克隆后的注意事项

| 需求 | 命令 |
|---|---|
| 补全完整历史 | `git fetch --unshallow` |
| 拉取更新 | `git pull`（浅克隆下正常可用） |
| 切换/查看其他分支 | `git fetch --depth 1 origin <分支名>` |

### 环境变量

- 仓库不跟踪任何 `.env` 文件
- 需要 Shopify Storefront API 功能时，向仓库所有者私下索取 token / shop domain，**不要提交到仓库**
- 仅运行静态站点（`out/` 已构建产物 + 任意静态服务器）不需要任何密钥

---

## 二、Cloudflare R2 CDN 迁移计划（待执行）

> 状态：**等待用户开通 R2（预计 2026-09-09 完成）**，开通后开始实施。

### 目标

添加产品时，图片流程从「素材库 → 本地 `public/images/` → git 仓库」
改为「素材库 → 转 WebP → 上传 R2 → materials-map.ts 记录 R2 URL」，
素材库无图时继续沿用现有兜底逻辑（Shopify CDN）。

### 现有流程（改动前）

```
node scripts/sync-materials.js <素材库密码>
  → 从 http://106.55.160.52:8080 拉取 makimoohome 分组
  → 转 WebP（q82, ≤1600px）存入 public/images/products/{ASIN}/
  → 生成 src/data/materials-map.ts（本地路径 /images/products/...）
  → 图片随 git 提交进仓库（仓库体积持续增长的根源）
```

### 目标流程（改动后）

```
node scripts/sync-materials.js <素材库密码>
  → 拉取素材库、转 WebP（不变）
  → 【新增】上传 WebP 到 R2 bucket（S3 兼容 API）
  → materials-map.ts 中图片路径写 R2 URL（https://img.xxx.com/products/{ASIN}/1.webp）
  → public/images/products/ 可保留为本地备份，但加入 .gitignore 不再入库
```

### 为什么下游代码不用改

- `src/lib/paths.ts` 的 `resolveUrl()` 只转换 `/` 开头的路径，`https://` URL 原样透传
- 兜底逻辑已存在：`src/data/products.ts` 中 `shopifyImages: materialsImages || shopifyEntry.images`，
  素材库无图时自动回退到 Shopify CDN
- 站点为静态导出 + `images.unoptimized`，外链图片无 Next.js 图片优化依赖

### 实施前置条件（用户侧）

1. 开通 Cloudflare R2（dash.cloudflare.com → R2 Object Storage）
   - 注册免费，但**必须绑定支付方式**（Visa/Mastercard 信用卡或 PayPal，仅验证用）
   - 免费额度：存储 10 GB/月、Class A 100 万次/月、Class B 1000 万次/月、出口流量免费
   - 当前图片总量 ≈110 MB，实际成本为零
2. 创建 bucket（建议名如 `makimoo-images`）
3. 生成 R2 API Token（Account ID / Access Key ID / Secret Access Key）
4. 绑定自定义域名（建议 `img.<主域名>`）：
   - 需将主域名 DNS 接入 Cloudflare（免费）
   - 自定义域名才走 Cloudflare CDN 缓存；默认 `*.r2.dev` 有限流，不适合生产
5. 密钥写入本地 `.env`（已在 .gitignore），格式建议：
   ```
   R2_ACCOUNT_ID=
   R2_ACCESS_KEY_ID=
   R2_SECRET_ACCESS_KEY=
   R2_BUCKET=makimoo-images
   R2_PUBLIC_BASE_URL=https://img.example.com
   ```

### 实施步骤（开发侧）

1. `npm install @aws-sdk/client-s3`（R2 为 S3 兼容协议）
2. 修改 `scripts/sync-materials.js`：转 WebP 后上传 R2，materials-map.ts 写 R2 URL
   - 保持幂等：已存在且数量一致时跳过（与现有逻辑一致）
   - 上传失败应报错中断，避免生成指向不存在图片的 map
3. （可选）本地保留 webp 副本，`public/images/products/` 加入 `.gitignore`
4. 存量迁移：脚本上传现有 146 个产品目录的图片到 R2，重写 materials-map.ts
5. 从 git 移除 `public/images/products/`（`git rm -r --cached`）
6. （可选，彻底瘦身）用 `git filter-repo` 清理历史中的图片后强推——
   **注意：会改写历史，需所有协作者重新克隆，执行前必须确认**
7. 全量构建验证：`npm run build:local`，抽查产品页图片加载

### 风险与注意

- 上传凭证仅同步脚本需要；协作者拉代码跑站点**无需** R2 密钥
- R2 无出口流量费，但 Class A（写入）有免费上限，批量迁移 146 产品约数千次请求，远低于限额
- 迁移期间新旧图片 URL 并存时，以 materials-map.ts 内容为准，构建前重新生成即可
- Shopify CDN 兜底逻辑保持不变，不依赖 R2 可用性

### 参考资料

- R2 官方定价：https://developers.cloudflare.com/r2/platform/pricing/
- R2 S3 兼容 API：https://developers.cloudflare.com/r2/api/s3/api/
- R2 自定义域名：https://developers.cloudflare.com/r2/buckets/public-buckets/
