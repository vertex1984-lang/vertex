import path from 'path';

/** vertex 门店仓库根目录（快照导入与图片代理的来源） */
export const VERTEX_ROOT = process.env.VERTEX_ROOT || 'D:/opencode_workspace/vertex';
/** vertex 静态资源目录（图片代理从这里读） */
export const VERTEX_PUBLIC = path.join(VERTEX_ROOT, 'public');
/** 后台运行时数据目录 */
export const DATA_DIR = path.join(process.cwd(), 'data');
/** 演示版发布产物 ①：字段覆盖（vertex 侧待接入） */
export const OVERRIDES_TARGET = path.join(VERTEX_ROOT, 'src', 'data', 'admin-overrides.json');
/** 演示版发布产物 ②：新增商品（vertex 已接入，构建时合并进 PRODUCTS_DATA） */
export const ADMIN_PRODUCTS_TARGET = path.join(VERTEX_ROOT, 'src', 'data', 'admin-products.json');
/** 发布产物 ③：预售配置（vertex preorder.ts 消费，构建时读取） */
export const PREORDER_TARGET = path.join(VERTEX_ROOT, 'src', 'data', 'admin-preorder.json');
/** 发布产物 ④：订单台账·构建期留档副本（批次 1 免登录查单；与 public 份双写） */
export const ORDER_STATUS_TARGET_SRC = path.join(VERTEX_ROOT, 'src', 'data', 'admin-order-status.json');
/** 发布产物 ④：订单台账·客户端运行时读取份（追踪页 fetch /data/order-status.json） */
export const ORDER_STATUS_TARGET_PUBLIC = path.join(VERTEX_ROOT, 'public', 'data', 'order-status.json');
/** 发布产物 ⑤：促销活动（vertex promotions.ts 消费，构建时按档期过滤） */
export const PROMOTIONS_TARGET = path.join(VERTEX_ROOT, 'src', 'data', 'admin-promotions.json');
/** 心愿单云共享密钥（批次 2：vertex 买家浏览器调用 /api/wishlist 的接口内校验；演示版默认值，正式版换环境变量） */
export const WISHLIST_TOKEN = process.env.WISHLIST_TOKEN || 'makimoo-wishlist-demo-token';
/** 评价提交共享密钥（批次 3：vertex 买家浏览器调用 /api/reviews 提交待审核评价；同 wishlist 模式） */
export const REVIEW_TOKEN = process.env.REVIEW_TOKEN || 'makimoo-review-demo-token';
/** 评价审核发布产物：vertex reviews.json（只含 approved，构建期读取） */
export const REVIEWS_TARGET = path.join(VERTEX_ROOT, 'src', 'data', 'reviews.json');
/** 到货通知共享密钥（批次外 2026-11-15：vertex 展示层 /api/subscribe 提交；同 wishlist/reviews 模式） */
export const NOTIFY_TOKEN = process.env.NOTIFY_TOKEN || 'makimoo-notify-demo-token';
/** 登录激励券码共享密钥（2026-11-21 批次：vertex /api/rewards 与 GET 券码列表；同 wishlist/reviews/notify 模式。
 *  ⚠ 新令牌必须同步 lib/cors.ts Allow-Headers（CORS 铁律，已踩三次） */
export const REWARDS_TOKEN = process.env.REWARDS_TOKEN || 'makimoo-rewards-demo-token';
/** shopify-map 源文件（发布时文本解析 slug→shopifyHandle，写入预售配置，避免 vertex 客户端打包全量 map） */
export const SHOPIFY_MAP_SOURCE = path.join(VERTEX_ROOT, 'src', 'data', 'shopify-map.ts');

/** Cloudflare 账号与 KV（2026-11-25 订单状态发布改走 KV，站点 Pages Function 直读，免重建） */
export const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || '29c026769c78d66267d0e8423f02a645';
/** KV 命名空间 ORDER_STATUS（订单状态，站点侧绑定名 ORDER_STATUS_KV） */
export const CF_KV_ORDER_STATUS_ID = process.env.CF_KV_ORDER_STATUS_ID || '94afe8a5106e40fb8e52a5d5ea205962';
/** Cloudflare API token（需 Workers KV Storage 编辑权限，无默认值，服务器/本地 .env 配置） */
export const CF_API_TOKEN = process.env.CF_API_TOKEN || '';
