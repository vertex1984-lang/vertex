# Apple / Google 登录桥接方案（决策说明）

> 批次 2 留档（2026-11-12）。**本批次未写任何桥接代码**——/login 页只留了 disabled 按钮位 + "Coming soon"。
> 这份文档是给你决策用的：什么时候做、选哪条路、代价是什么。

## 为什么不能直接做

- Shopify **Storefront Customer API 不支持第三方 OAuth**：没有 "sign in with Apple/Google" mutation，也无法把外部身份直接映射成 `customerAccessToken`。
- 设计方案 v3 第二章把 Apple/Google 列为首选登录（买家画像：移动端 97%，去密码化是转化关键），所以要真正落地必须**在 Shopify 之外搭身份层，再桥接回 Shopify 客户体系**。

## 两条可行路线

| | 路线 ①：Firebase Auth（推荐起步） | 路线 ②：Clerk / Auth0 |
|---|---|---|
| 思路 | Firebase 托管 Apple/Google OAuth，登录成功后用 Admin API 按 email 查找/创建 Shopify Customer，签发自有会话 | 同思路，身份层换成品化服务（自带 UI 与合规） |
| 前置 | **闸门 A**：Shopify Admin API token（customCreate / customerFindByEmail…） | 同左 |
| 服务端 | 需要一个常驻后台签发/校验会话（makimoo-admin 常驻后即可承担，或 Vercel Function） | 同左 |
| 成本 | Firebase 免费额度足够起步；代码量中等（~1 个回调接口 + SDK） | 按月订阅（~$25+/月起）；代码量更小 |
| 数据一致性 | email 为锚点做 Shopify Customer upsert；密码字段置随机值（同 newsletter 订阅的现有做法） | 同左 |
| 会话 | 自有 session（httpOnly cookie）；Storefront 调用由后台代理或下发短时 token | 同左 |
| 风险 | 两套身份并存（Firebase UID ↔ Shopify Customer id），需在 db 里维护映射表 | 供应商锁定 |

## 共同的前置条件（缺一不可）

1. **闸门 A 打开**：Shopify Admin API token 到位（客户查询/创建权限）。
2. **后台常驻**：签发/校验会话需要服务端。当前 makimoo-admin 是本地演示版，正式期须部署（或用 Vercel Functions 承担回调接口）。
3. **Magic link 同理**：邮箱点击登录与 Apple/Google 桥接共享同一套"后台签发会话"基建，可以同批落地。

## 建议的落地顺序（等闸门 A）

1. 后台会话基建（httpOnly cookie + 自签会话，替代 localStorage token）——这是 magic link 与 OAuth 的公共底座；
2. Magic link（成本最低的去密码化第一步）；
3. Google One Tap（比 Apple 简单：网页端只需前端 SDK）；
4. Apple Sign in（需要苹果开发者账号 + 域名验证）。

## 本批次交付物（已完成）

- /login 页 Apple / Google 按钮位：disabled + "Coming soon" tooltip；
- 登录注册页文案与回跳逻辑已就绪，桥接上线后只需在这两个按钮位接跳转，不改页面骨架。
