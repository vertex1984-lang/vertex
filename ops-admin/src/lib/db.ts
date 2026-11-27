import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { DATA_DIR } from './env';
import type { NewProductRecord } from './newproduct';
import type { OrderMilestone, OrderRecord } from './order';
import { milestonesAtCreation, type MilestoneKey } from './order';
import type { PreorderEntry, PreorderSale } from './preorder';
import { DEFAULT_PREORDER_SALE } from './preorder';
import type { PromotionEntry } from './promotion';
import type { ReviewRecord } from './review';
import type { NotifyRecord } from './notify';
import { DEFAULT_REWARDS_CONFIG, type CouponGrantReason, type CouponGrantRecord, type RewardsConfig, generateCouponCode, rewardsEmailHash } from './rewards';

/** 游客心愿单留资（批次 5 心愿单选品：未登录收藏时的 email 捕获，同聚合 key = product.id） */
export interface WishlistCaptureRecord {
  id: string;
  /** 收藏 id 口径（makimoo-ASIN），与 wishlists.handles[] 同 key */
  productId: string;
  /** 已 trim + lowercase */
  email: string;
  /** 数字营销许可；默认 false，默认不勾选 */
  marketingConsent: boolean;
  /** 固定 'wishlist-capture'；预留字段，将来 NotifyMe consent 等复用聚合 */
  source: string;
  at: string;
}

/** 一条修改记录（后台对快照字段的覆盖） */
export interface ChangeEntry {
  id: string;
  handle: string;
  /** 批次 3 起新增 description（PDP 描述覆盖）与 featuredImage（主图覆盖） */
  field: 'title' | 'price' | 'compareAtPrice' | 'status' | 'description' | 'featuredImage';
  /** 快照 + 已发布覆盖 的基线值（撤销后回到这里） */
  oldValue: string;
  /** 运营填的新值 */
  newValue: string;
  note?: string;
  at: string;
  by: string;
  status: 'pending' | 'published';
  publishedAt?: string;
}

interface DB {
  users: { username: string; hash: string; salt: string; role: string; disabled?: boolean }[];
  changes: ChangeEntry[];
  newProducts: NewProductRecord[];
  preorder: PreorderEntry[];
  preorderSale: PreorderSale;
  orders: OrderRecord[];
  promotions: PromotionEntry[];
  wishlists: WishlistRecord[];
  /** 到货通知订阅（2026-11-15 展示层 S1；同 handle+email 幂等） */
  notifySubscribes: NotifyRecord[];
  /** 前台支付入口开关（批次 5 追加：产品未上线期运营可控，true=结账按钮启用） */
  checkoutToggle: { enabled: boolean; at: string };
  /** 游客心愿单留资（批次 5 选品；同 productId+email 幂等） */
  wishlistCaptures: WishlistCaptureRecord[];
  reviews: ReviewRecord[];
  /** 登录激励券码台账（2026-11-21 批次：评价送券 / 注册发券 / 到货通知 consent 发券） */
  couponGrants: CouponGrantRecord[];
  /** 券码发放配置（总开关 + 比例；开关关闭 = 全链路不发放、站内不显示文案） */
  rewardsConfig: RewardsConfig;
}

const DB_PATH = path.join(DATA_DIR, 'db.json');

/** 同一 (handle, field) 的待发布条目只保留一条，重复编辑即替换 */
export const DEFAULT_ADMIN = { username: 'admin', password: 'makimoo2026' };

export function readDb(): DB {
  let db: DB | null = null;
  try {
    db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    db = null;
  }
  if (!db || !Array.isArray(db.users) || db.users.length === 0) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(DEFAULT_ADMIN.password, salt, 32).toString('hex');
    db = {
      users: [{ username: DEFAULT_ADMIN.username, hash, salt, role: 'admin' }],
      changes: [],
      newProducts: [],
      preorder: [],
      preorderSale: { ...DEFAULT_PREORDER_SALE },
      orders: [],
      promotions: [],
      wishlists: [],
      notifySubscribes: [],
      checkoutToggle: { enabled: false, at: new Date().toISOString() },
      wishlistCaptures: [],
      reviews: [],
      couponGrants: [],
      rewardsConfig: { ...DEFAULT_REWARDS_CONFIG },
    };
    writeDb(db);
  }
  if (!Array.isArray(db.newProducts)) db.newProducts = []; // 旧 db 兼容
  if (!Array.isArray(db.preorder)) db.preorder = []; // 旧 db 兼容
  if (!db.preorderSale || !db.preorderSale.deadline) db.preorderSale = { ...DEFAULT_PREORDER_SALE };
  if (!Array.isArray(db.orders)) db.orders = []; // 旧 db 兼容（批次 1 订单台账）
  if (!Array.isArray(db.promotions)) db.promotions = []; // 旧 db 兼容（批次 1 促销活动）
  if (!Array.isArray(db.wishlists)) db.wishlists = []; // 旧 db 兼容（批次 2 心愿单云）
  if (!Array.isArray(db.notifySubscribes)) db.notifySubscribes = []; // 旧 db 兼容（2026-11-15 到货通知）
  if (!db.checkoutToggle || typeof db.checkoutToggle.enabled !== 'boolean') db.checkoutToggle = { enabled: false, at: new Date().toISOString() }; // 旧 db 兼容（默认关：支付未上线）
  if (!Array.isArray(db.wishlistCaptures)) db.wishlistCaptures = []; // 旧 db 兼容（批次 5 游客心愿单留资）
  if (!Array.isArray(db.reviews)) db.reviews = []; // 旧 db 兼容（批次 3 评价）
  if (!Array.isArray(db.couponGrants)) db.couponGrants = []; // 旧 db 兼容（2026-11-21 登录激励券码）
  if (!db.rewardsConfig || typeof db.rewardsConfig.enabled !== 'boolean') db.rewardsConfig = { ...DEFAULT_REWARDS_CONFIG }; // 旧 db 兼容
  for (const u of db.users) if (typeof u.disabled !== 'boolean') u.disabled = false; // 旧 db 兼容（2026-11-26 多用户管理）
  return db;
}

// —— 预售配置（预售管理）——

/** 按 handle 覆盖式新增/更新（改字段即重置为 pending） */
export function upsertPreorderEntry(entry: Omit<PreorderEntry, 'id' | 'at' | 'status' | 'publishedAt'>): PreorderEntry {
  const db = readDb();
  const existing = db.preorder.find((e) => e.handle === entry.handle);
  const next: PreorderEntry = {
    ...entry,
    id: existing?.id ?? crypto.randomUUID(),
    at: new Date().toISOString(),
    status: 'pending',
    publishedAt: undefined,
  };
  if (existing) db.preorder = db.preorder.map((e) => (e.handle === entry.handle ? next : e));
  else db.preorder.push(next);
  writeDb(db);
  return next;
}

export function removePreorderEntry(handle: string): boolean {
  const db = readDb();
  const before = db.preorder.length;
  db.preorder = db.preorder.filter((e) => e.handle !== handle);
  writeDb(db);
  return db.preorder.length < before;
}

export function updatePreorderSale(sale: PreorderSale): void {
  const db = readDb();
  db.preorderSale = sale;
  writeDb(db);
}

// —— 新品记录（上货窗口）——

export function addNewProducts(records: NewProductRecord[]): void {
  const db = readDb();
  db.newProducts.push(...records);
  writeDb(db);
}

export function removeNewProduct(id: string): boolean {
  const db = readDb();
  const before = db.newProducts.length;
  db.newProducts = db.newProducts.filter((r) => r.id !== id && !(r.batchId === id)); // 单条 id 或整个批次 id
  const removed = db.newProducts.length < before;
  if (removed) writeDb(db);
  return removed;
}

export function writeDb(db: DB): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

/** upsert 一条 pending 修改（同 handle+field 替换） */
export function upsertChange(entry: Omit<ChangeEntry, 'id' | 'status' | 'at'>): ChangeEntry {
  const db = readDb();
  const existing = db.changes.find(
    (c) => c.status === 'pending' && c.handle === entry.handle && c.field === entry.field
  );
  if (existing) {
    Object.assign(existing, { ...entry, at: new Date().toISOString() });
  } else {
    db.changes.push({
      ...entry,
      id: `${entry.handle}::${entry.field}::${Date.now().toString(36)}`,
      status: 'pending',
      at: new Date().toISOString(),
    });
  }
  writeDb(db);
  return existing!;
}

export function removeChange(id: string): boolean {
  const db = readDb();
  const before = db.changes.length;
  db.changes = db.changes.filter((c) => c.id !== id || c.status === 'published');
  const removed = db.changes.length < before;
  if (removed) writeDb(db);
  return removed;
}

/** 撤销某字段覆盖：删除该 handle+field 的 pending 与 published 全部条目（批次 3 任务 3 撤销口径） */
export function removeChangesByField(handle: string, field: ChangeEntry['field']): number {
  const db = readDb();
  const before = db.changes.length;
  db.changes = db.changes.filter((c) => !(c.handle === handle && c.field === field));
  const removed = before - db.changes.length;
  if (removed > 0) writeDb(db);
  return removed;
}

/** 某字段的生效覆盖：pending 优先于 published（pending 是最新意图） */
export function getOverrides(): Map<string, Map<string, ChangeEntry>> {
  const db = readDb();
  const map = new Map<string, Map<string, ChangeEntry>>();
  for (const c of [...db.changes].sort((a, b) => (a.status === 'pending' ? 1 : 0) - (b.status === 'pending' ? 1 : 0))) {
    if (!map.has(c.handle)) map.set(c.handle, new Map());
    map.get(c.handle)!.set(c.field, c); // pending 排后写入 → 覆盖 published
  }
  return map;
}

// —— 订单台账（免登录查单，批次 1）——

/**
 * 录入/更新订单基础字段：同订单号覆盖（改基础字段即重置为 pending）；
 * 已有的里程碑进度按 key 保留（录错字段重录不丢推进记录）。新单自动填 ordered 段。
 */
export function upsertOrder(
  entry: Omit<OrderRecord, 'id' | 'at' | 'status' | 'publishedAt' | 'milestones'>
): OrderRecord {
  const db = readDb();
  const existing = db.orders.find((o) => o.orderNo.toUpperCase() === entry.orderNo.toUpperCase());
  const now = new Date().toISOString();
  const next: OrderRecord = {
    ...entry,
    milestones: existing ? existing.milestones : milestonesAtCreation(now),
    id: existing?.id ?? crypto.randomUUID(),
    at: now,
    status: 'pending',
    publishedAt: undefined,
  };
  if (existing) db.orders = db.orders.map((o) => (o.id === existing.id ? next : o));
  else db.orders.push(next);
  writeDb(db);
  return next;
}

/** 推进里程碑：填 at = now；备注/实拍图可选；重复推进同一段 = 更新该段备注/图片/时间 */
export function advanceOrder(
  orderNo: string,
  key: MilestoneKey,
  patch: { note?: string; photo?: string }
): OrderRecord | null {
  const db = readDb();
  const order = db.orders.find((o) => o.orderNo.toUpperCase() === orderNo.toUpperCase());
  if (!order) return null;
  order.milestones = order.milestones.map((m) =>
    m.key === key
      ? {
          ...m,
          at: new Date().toISOString(),
          ...(patch.note ? { note: patch.note } : {}),
          ...(patch.photo ? { photo: patch.photo } : {}),
        }
      : m
  );
  order.status = 'pending';
  order.publishedAt = undefined;
  writeDb(db);
  return order;
}

export function removeOrder(orderNo: string): boolean {
  const db = readDb();
  const before = db.orders.length;
  db.orders = db.orders.filter((o) => o.orderNo.toUpperCase() !== orderNo.toUpperCase());
  writeDb(db);
  return db.orders.length < before;
}

// —— 促销活动（批次 1：banner / flash）——

/** 按 name 覆盖式新增/更新（改字段即重置为 pending） */
export function upsertPromotion(entry: Omit<PromotionEntry, 'id' | 'at' | 'status' | 'publishedAt'>): PromotionEntry {
  const db = readDb();
  const existing = db.promotions.find((p) => p.name === entry.name);
  const next: PromotionEntry = {
    ...entry,
    id: existing?.id ?? crypto.randomUUID(),
    at: new Date().toISOString(),
    status: 'pending',
    publishedAt: undefined,
  };
  if (existing) db.promotions = db.promotions.map((p) => (p.id === existing.id ? next : p));
  else db.promotions.push(next);
  writeDb(db);
  return next;
}

export function removePromotion(id: string): boolean {
  const db = readDb();
  const before = db.promotions.length;
  db.promotions = db.promotions.filter((p) => p.id !== id);
  writeDb(db);
  return db.promotions.length < before;
}

// —— 心愿单云（批次 2：买家账号 MVP；vertex 账号页拉取合并用）——

export interface WishlistRecord {
  /** Shopify customer id（如 gid://shopify/Customer/123456） */
  customerId: string;
  /** 收藏 id 列表（vertex 本地 favorites 存的 product.id） */
  handles: string[];
  at: string;
}

/** 按 customerId 读取（不存在返回空数组） */
export function getWishlist(customerId: string): string[] {
  const db = readDb();
  return db.wishlists.find((w) => w.customerId === customerId)?.handles ?? [];
}

/** 覆盖式写入（vertex 端「拉取合并」后整体回写） */
export function setWishlist(customerId: string, handles: string[]): WishlistRecord {
  const db = readDb();
  const existing = db.wishlists.find((w) => w.customerId === customerId);
  const next: WishlistRecord = { customerId, handles, at: new Date().toISOString() };
  if (existing) db.wishlists = db.wishlists.map((w) => (w.customerId === customerId ? next : w));
  else db.wishlists.push(next);
  writeDb(db);
  return next;
}

// —— 到货通知（2026-11-15 展示层 S1 订阅；同 handle+email 幂等，重复提交刷新时间）——

export function addNotify(handle: string, email: string): NotifyRecord {
  const db = readDb();
  const normalizedEmail = email.trim().toLowerCase();
  const existing = db.notifySubscribes.find(
    (n) => n.handle.toLowerCase() === handle.toLowerCase() && n.email === normalizedEmail
  );
  const at = new Date().toISOString();
  if (existing) {
    db.notifySubscribes = db.notifySubscribes.map((n) => (n.id === existing.id ? { ...n, at } : n));
  } else {
    db.notifySubscribes.push({ id: crypto.randomUUID(), handle, email: normalizedEmail, at });
  }
  writeDb(db);
  return existing ? { ...existing, at } : { id: crypto.randomUUID(), handle, email: normalizedEmail, at };
}

// —— 游客心愿单留资（批次 5 心愿单选品；同 productId+email 幂等，重复提交刷新 consent/at）——

/**
 * 幂等写入：同 (productId, email) 已存在则只更新 marketingConsent 与 at，不新增行
 * （照 addNotify 模式）。email 归一小写由调用方（route）保证，这里再做一次兜底。
 */
export function addWishlistCapture(
  productId: string,
  email: string,
  marketingConsent: boolean
): WishlistCaptureRecord {
  const db = readDb();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedId = productId.trim();
  const existing = db.wishlistCaptures.find(
    (c) => c.productId.toLowerCase() === normalizedId.toLowerCase() && c.email === normalizedEmail
  );
  const at = new Date().toISOString();
  if (existing) {
    db.wishlistCaptures = db.wishlistCaptures.map((c) =>
      c.id === existing.id ? { ...c, marketingConsent, at } : c
    );
  } else {
    db.wishlistCaptures.push({
      id: crypto.randomUUID(),
      productId: normalizedId,
      email: normalizedEmail,
      marketingConsent,
      source: 'wishlist-capture',
      at,
    });
  }
  writeDb(db);
  return (
    db.wishlistCaptures.find(
      (c) => c.productId.toLowerCase() === normalizedId.toLowerCase() && c.email === normalizedEmail
    ) ?? {
      id: 'unknown',
      productId: normalizedId,
      email: normalizedEmail,
      marketingConsent,
      source: 'wishlist-capture',
      at,
    }
  );
}

// —— 前台支付入口开关（批次 5 追加：管理平台一键控制，前台实时拉取）——

export function getCheckoutToggle(): { enabled: boolean; at: string } {
  return readDb().checkoutToggle ?? { enabled: false, at: new Date().toISOString() };
}

export function setCheckoutToggle(enabled: boolean): { enabled: boolean; at: string } {
  const db = readDb();
  db.checkoutToggle = { enabled, at: new Date().toISOString() };
  writeDb(db);
  return db.checkoutToggle;
}

// —— 买家评价（批次 3 评价闭环：前台提交 pending → admin 审核 → 发布只含 approved）——

/** 新增待审核评价（前台 Write a review 提交入口） */
export function addReview(entry: Omit<ReviewRecord, 'id' | 'at' | 'status'>): ReviewRecord {
  const db = readDb();
  const next: ReviewRecord = {
    ...entry,
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    status: 'pending',
  };
  db.reviews.push(next);
  writeDb(db);
  return next;
}

/** 审核动作：approve / reject（重复审核覆盖状态）；可同时更新返券标记 */
export function moderateReview(
  id: string,
  action: 'approve' | 'reject',
  couponFlag?: boolean
): ReviewRecord | null {
  const db = readDb();
  const review = db.reviews.find((r) => r.id === id);
  if (!review) return null;
  review.status = action === 'approve' ? 'approved' : 'rejected';
  review.moderatedAt = new Date().toISOString();
  if (couponFlag !== undefined) review.couponFlag = couponFlag;
  writeDb(db);
  return review;
}

/** 仅更新返券标记（不改变审核状态；仅记录不发放，闸门 A TODO） */
export function setReviewCouponFlag(id: string, couponFlag: boolean): ReviewRecord | null {
  const db = readDb();
  const review = db.reviews.find((r) => r.id === id);
  if (!review) return null;
  review.couponFlag = couponFlag;
  writeDb(db);
  return review;
}

export function removeReview(id: string): boolean {
  const db = readDb();
  const before = db.reviews.length;
  db.reviews = db.reviews.filter((r) => r.id !== id);
  writeDb(db);
  return db.reviews.length < before;
}

// —— 登录激励券码（2026-11-21 批次：T2 评价送券 + T3 注册/预约发券）——

/** 幂等口径：signup / notify-consent 按 (emailHash, reason) 去重（重放不重发）；
 *  review 按 (emailHash, reason, sourceId) 去重（同一条评价只发一次）。
 *  code 唯一由本函数生成时对存量校验兜底重试。 */
export function addCouponGrant(
  email: string,
  reason: CouponGrantReason,
  percentOff: number,
  sourceId?: string
): CouponGrantRecord | null {
  const db = readDb();
  const hash = rewardsEmailHash(email);
  // 统一 3 段拼接（验收 D1 P1 修复：无 sourceId 时旧写法 key 只有 2 段，与 3 段比对串
  // 永不相等 → signup/notify-consent 幂等失效重复发券；review 带 sourceId 不受影响）
  const dedupeKey = `${hash}|${reason}|${sourceId ?? ''}`;
  const already = db.couponGrants.some(
    (g) => `${g.emailHash}|${g.reason}|${g.sourceId ?? ''}` === dedupeKey
  );
  if (already) return null; // 已发过：调用方视为「不重发」而非错误
  let code = generateCouponCode(percentOff);
  while (db.couponGrants.some((g) => g.code === code)) code = generateCouponCode(percentOff);
  const next: CouponGrantRecord = {
    id: crypto.randomUUID(),
    emailHash: hash,
    customerEmail: email.trim().toLowerCase(),
    code,
    reason,
    percentOff,
    ...(sourceId ? { sourceId } : {}),
    createdAt: new Date().toISOString(),
    status: 'active',
  };
  db.couponGrants.push(next);
  writeDb(db);
  return next;
}

/** 按 emailHash 读取（前台 /account My Rewards 用；只回券码等非敏感字段，由 route 层投影） */
export function getCouponGrantsByHash(emailHash: string): CouponGrantRecord[] {
  return readDb()
    .couponGrants.filter((g) => g.emailHash === emailHash)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

// —— 券码发放配置（admin 配置位；默认关：T0 前由领导拍板启用）——

export function getRewardsConfig(): RewardsConfig {
  return readDb().rewardsConfig ?? { ...DEFAULT_REWARDS_CONFIG };
}

export function setRewardsConfig(patch: { enabled?: boolean; percentOff?: number }): RewardsConfig {
  const db = readDb();
  const cur = db.rewardsConfig ?? { ...DEFAULT_REWARDS_CONFIG };
  db.rewardsConfig = {
    enabled: typeof patch.enabled === 'boolean' ? patch.enabled : cur.enabled,
    percentOff:
      typeof patch.percentOff === 'number' && patch.percentOff >= 1 && patch.percentOff <= 90
        ? Math.round(patch.percentOff)
        : cur.percentOff,
    at: new Date().toISOString(),
  };
  writeDb(db);
  return db.rewardsConfig;
}
