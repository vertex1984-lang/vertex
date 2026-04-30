# Makimoo Website — Vercel 部署指南

## 项目已准备就绪 ✅

- ✅ `resolveUrl()` 已适配 HTTP/HTTPS 环境（Vercel 下直接使用绝对路径）
- ✅ `package.json` 的 `build` 命令已更新（不运行 fix-paths.js）
- ✅ `.gitignore` 已添加 `dist/` 目录
- ✅ Git 仓库已初始化，首次提交已完成

---

## 第一步：创建 GitHub 仓库

1. 打开 https://github.com/new
2. 仓库名填：`makimoo-website`
3. 选择 **Private**（推荐，因为包含 API Token）
4. **不要**勾选 "Add a README file"、"Add .gitignore"、"Choose a license"
5. 点击 **Create repository**

## 第二步：推送代码到 GitHub

在终端中执行以下命令（将 `你的用户名` 替换为你的 GitHub 用户名）：

```bash
cd "e:/Makimoo Website/headless-store"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/makimoo-website.git

# 推送代码（首次推送可能需要较长时间，因为包含 787MB 图片）
git push -u origin main
```

> ⚠️ 首次推送会比较慢（约 787MB 图片），请耐心等待。后续更新只推送变更的文件，会快很多。

## 第三步：连接 Vercel

1. 打开 https://vercel.com/signup 用 GitHub 账号登录
2. 登录后点击 **"Add New..."** → **"Project"**
3. 选择刚创建的 `makimoo-website` 仓库
4. 点击 **Import**

## 第四步：配置构建设置

在 Vercel 的项目设置页面：

| 设置项 | 值 |
|--------|-----|
| **Framework Preset** | Next.js |
| **Root Directory** | `.` (默认，不需要改) |
| **Build Command** | `npm run build` (默认) |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` (默认) |

> ⚠️ **Output Directory** 必须填 `dist`，因为 `next.config.mjs` 中设置了 `distDir: 'dist'`

## 第五步：配置环境变量

在同一个设置页面，找到 **Environment Variables** 区域，添加以下变量：

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | `mkhome-3.myshopify.com` |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | `3e3428278f0d3abc4e62c217b9c09608` |
| `SHOPIFY_API_VERSION` | `2025-07` |

全部添加后点击 **Deploy** 按钮。

## 第六步：等待部署完成

- Vercel 会自动运行 `npm install` → `npm run build` → 部署
- 首次部署大约需要 3-5 分钟
- 部署成功后，Vercel 会分配一个临时域名，如 `makimoo-website-xxx.vercel.app`

## 第七步：绑定自定义域名（可选）

1. 在 Vercel 项目页面 → **Settings** → **Domains**
2. 输入你的域名（如 `makimoo.com`）
3. Vercel 会显示需要配置的 DNS 记录

### DNS 配置（在域名注册商处设置）

**方式 A：使用 A 记录（推荐）**
| 类型 | 名称 | 值 |
|------|------|-----|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

**方式 B：使用 CNAME**
| 类型 | 名称 | 值 |
|------|------|-----|
| CNAME | @ | cname.vercel-dns.com |
| CNAME | www | cname.vercel-dns.com |

4. DNS 配置生效后（通常几分钟到几小时），Vercel 会自动为你的域名配置 SSL 证书
5. 建议在 Vercel 域名设置中把 `www` 重定向到主域名（或反过来）

---

## 后续更新流程

修改代码后，只需要：

```bash
cd "e:/Makimoo Website/headless-store"
git add -A
git commit -m "描述你的修改"
git push
```

Vercel 会自动检测到推送并重新部署，通常 1-2 分钟即可生效。

---

## 本地预览（保持兼容）

本地 `file://` 协议预览仍然可用，使用：

```bash
npm run build:local
```

这会运行完整的 `build-shopify-map.js` → `next build` → `fix-paths.js` 流程。

---

## 注意事项

1. **Shopify 产品同步**：每次构建时 `build-shopify-map.js` 会从 Shopify 拉取最新产品数据。如果你在 Shopify 上添加了新产品，重新推送代码即可自动同步。

2. **环境变量安全**：`.env.local` 已在 `.gitignore` 中，不会被推送到 GitHub。Token 通过 Vercel 的环境变量配置传递。

3. **图片优化**：当前图片直接存放在 `public/images/` 中，通过 Vercel CDN 分发。后续如果需要优化加载速度，可以考虑：
   - 将产品图片上传到 Shopify（已有 Shopify CDN）
   - 使用 Cloudinary 等专业图片 CDN
   - 开启 Next.js Image Optimization（需要去掉 `output: 'export'`）

4. **Vercel 免费计划**：Hobby 计划对个人项目免费，包含：
   - 100GB 带宽/月
   - 无限次部署
   - 自动 HTTPS
   - 全球 CDN
