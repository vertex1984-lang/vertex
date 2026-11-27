import { readDb } from '@/lib/db';
import { loadSnapshot } from '@/lib/snapshot';
import WishlistBoard, { type WishlistRow } from './WishlistBoard';

/**
 * 心愿单选品页（批次 5，2026-11-17 设计书任务 2）：选品数据闭环的 admin 视图。
 * 聚合两源——账号收藏（wishlists[].handles[] 展开）+ 游客留资（wishlistCaptures[]），
 * 聚合 key 全线 = product.id（makimoo-ASIN；wishlists.handles[] 字段名历史遗留，存的就是 id）。
 * 运营按「合计降序」看 Top N → 每月 5-10 款入预 → 换款流程 → 前台 First Drop 上新。
 * 商品列 join admin 快照（asin 大小写不敏感）；join 不到显示 id（新品兜底，勿报错）。
 * 账号收藏不展开名单（只有 customerId 无邮箱，隐私设计）；游客留资行内展开 + CSV 导出。
 */
export default function WishlistPage() {
  const db = readDb();

  // 聚合 key 统一小写归一（wishlists 历史数据可能有大小写漂移；wishlistCaptures 同理）——
  // id 本体口径不变，仅聚合比较时归一，行内展示取归一形态
  const norm = (id: string) => id.trim().toLowerCase();

  // 账号收藏数：per-customer handles 先去重再计数（同客户重复 id 不重复计）
  const accountCount = new Map<string, number>();
  for (const w of db.wishlists) {
    for (const id of new Set(w.handles)) {
      const key = norm(id);
      if (key) accountCount.set(key, (accountCount.get(key) || 0) + 1);
    }
  }

  // 游客留资：计数 + consent 计数 + 明细（按 productId 分组，名单展开用）
  const captureCount = new Map<string, number>();
  const consentCount = new Map<string, number>();
  const capturesByProduct = new Map<string, { email: string; marketingConsent: boolean; at: string; source: string }[]>();
  for (const c of db.wishlistCaptures) {
    const key = norm(c.productId);
    captureCount.set(key, (captureCount.get(key) || 0) + 1);
    if (c.marketingConsent) consentCount.set(key, (consentCount.get(key) || 0) + 1);
    const list = capturesByProduct.get(key) || [];
    list.push({ email: c.email, marketingConsent: c.marketingConsent, at: c.at, source: c.source });
    capturesByProduct.set(key, list);
  }

  // 快照 join（asin 大小写不敏感）；快照缺失/商品不在快照 → 名称图留空，页面显示 id 兜底
  let byAsin: Map<string, { title: string; image: string }> | null = null;
  try {
    const snap = loadSnapshot();
    byAsin = new Map(
      snap.products.map((p) => [p.asin.toLowerCase(), { title: p.title, image: p.images[0] || '' }])
    );
  } catch {
    byAsin = null; // snapshot.json 缺失：全部走 id 兜底，不报错
  }

  const allIds = new Set<string>([...accountCount.keys(), ...captureCount.keys()]);
  const rows: WishlistRow[] = [];
  for (const productId of allIds) {
    const account = accountCount.get(productId) || 0;
    const captures = captureCount.get(productId) || 0;
    const total = account + captures;
    if (total === 0) continue; // 合计 0 不显示（双保险，聚合源天然 >0）
    // 展示形态：key 已归一小写，还原 makimoo-ASIN 大写口径（与 vertex product.id 一致）；
    // 非 makimoo- 前缀的历史 id 原样显示
    const displayId = /^makimoo-/.test(productId)
      ? 'makimoo-' + productId.slice('makimoo-'.length).toUpperCase()
      : productId;
    const asin = productId.replace(/^makimoo-/i, '');
    const meta = byAsin?.get(asin.toLowerCase());
    rows.push({
      productId: displayId,
      title: meta?.title ?? '',
      image: meta?.image ?? '',
      account,
      captures,
      total,
      consents: consentCount.get(productId) || 0,
      captureList: (capturesByProduct.get(productId) || []).sort((a, b) => b.at.localeCompare(a.at)),
    });
  }
  rows.sort((a, b) => b.total - a.total || b.captures - a.captures || a.productId.localeCompare(b.productId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">心愿单选品 💗</h1>
        <p className="mt-1 text-sm text-zinc-500">
          账号收藏 {db.wishlists.length} 位买家 / 游客留资 {db.wishlistCaptures.length} 条——按款聚合，
          合计降序 = 下一批选品候选池（每月 5-10 款入预，走换款流程上 First Drop）
        </p>
      </div>
      <WishlistBoard rows={rows} />
    </div>
  );
}
