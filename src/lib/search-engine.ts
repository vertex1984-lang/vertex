/**
 * 站内搜索引擎（2026-10 P1，替代旧的 title/description 子串匹配）
 *
 * 设计目标：静态站无后端 → 构建期字段索引 + 浏览器内存检索，
 * 把自然语言查询翻译成结构化字段命中，而不是纯文本子串。
 *
 * 能力：
 * - 分词 + 单复数折叠（sheets→sheet）+ 同义词扩展（comforter→duvet、carpet→rug…）
 * - 字段加权评分：标题10 > 子类7 > 品类6 > 材质5 > 颜色4 > 场景2 > 描述1
 * - 多词 AND 分组；AND 命中不足时放宽为部分命中降权（无结果救援）
 * - 查询末 token 前缀匹配（打字中途 "tow" 也能命中 towels）
 * - 标题短语连续命中加成 +25%，标题前部命中加成 +10%
 * - searchAll 按变体族去重：同族只保留得分最高的成员（联想位不被同款变体霸屏）
 *
 * 消费方（同一引擎保证联想与结果页一致）：
 * - V2Header.tsx  搜索联想（searchAll）
 * - /products 结果页 ?q= 过滤（searchDocs，在类目 scope 内检索）
 * - matchCategories 供搜索层（P2）渲染品类直达建议，本期只出数据不接 UI
 */
import type { MakimooProduct } from '@/data/products';
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { VARIANT_GROUPS } from '@/data/variant-groups';
import { PRODUCT_SPECS } from '@/data/product-specs';
import { CATEGORY_DEFS, SUBCATEGORIES } from '@/data/subcategories';
import PRODUCT_TAGS from '@/data/product-tags.json';

// ---------------------------------------------------------------------------
// 查询侧：归一化 / 单复数 / 同义词
// ---------------------------------------------------------------------------

const STOPWORDS = new Set(['for', 'the', 'with', 'and', 'a', 'of', 'my', 'in', 'on']);

/** 查询 token → 同义/近义 token（全小写；命中同义词按 0.9 计分）。
 *  方向：美式叫法 / 亚马逊习惯词 → 本站词表（依据 catalog 标题实测词汇）。 */
const SYNONYMS: Record<string, string[]> = {
  comforter: ['duvet'],
  quilt: ['duvet', 'blanket'],
  carpet: ['rug'],
  couch: ['cushion', 'sofa'],
  bathrobe: ['robe'],
  bedspread: ['blanket'],
  coverlet: ['blanket'],
  futon: ['duvet'],
  slipcover: ['cover'],
};

/** 短语级改写（分词前对整句查询做替换）：多词习惯叫法 → 本站叫法 */
const PHRASE_SYNONYMS: [RegExp, string][] = [
  [/hand towels?/g, 'face towel'],
  [/bath sheets?/g, 'bath towel'],
  [/pillow cases?/g, 'pillow cover'],
  [/throw pillows?/g, 'cushion'],
  [/bath robes?/g, 'robe'],
];

/** 单复数折叠：查询与文档两侧用同一函数，保证一致（'canvas'→'canva' 两侧同形，仍可命中） */
function singularize(w: string): string {
  if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.length > 4 && /(ch|sh|s|x|z)es$/.test(w)) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us')) return w.slice(0, -1);
  return w;
}

/** 归一化分词：小写、非字母数字转空格、去停用词、单复数折叠、去重 */
function tokenize(text: string): string[] {
  const raw = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter((t) => t && !STOPWORDS.has(t));
  return Array.from(new Set(raw.map(singularize)));
}

/** 查询预处理：短语改写 → 分词 → 每个 token 附同义词组 */
interface QueryToken {
  t: string;
  syn: string[];
}
function prepareQuery(query: string): QueryToken[] {
  let normalized = query.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  for (const [re, to] of PHRASE_SYNONYMS) normalized = normalized.replace(re, to);
  const tokens = Array.from(new Set(normalized.split(' ').filter((t) => t && !STOPWORDS.has(t)).map(singularize)));
  return tokens.map((t) => ({ t, syn: SYNONYMS[t] ? SYNONYMS[t].map(singularize) : [] }));
}

// ---------------------------------------------------------------------------
// 文档侧：字段索引
// ---------------------------------------------------------------------------

const WEIGHTS = { title: 10, sub: 7, cat: 6, material: 5, color: 4, scene: 2, desc: 1 } as const;

interface SearchDoc {
  product: MakimooProduct;
  titleLower: string;
  titleTok: string[];
  descTok: string[];
  subTok: string[];
  catTok: string[];
  materialTok: string[];
  colorTok: string[];
  sceneTok: string[];
  inStock: boolean;
  quality: number;
}

// 变体族成员 → 颜色（asin 小写 → color）；组 id 下所有成员共享族关系
const COLOR_BY_ASIN: Map<string, string> = (() => {
  const m = new Map<string, string>();
  for (const g of VARIANT_GROUPS) for (const mem of g.members) m.set(mem.asin.toLowerCase(), mem.color);
  return m;
})();

/** 变体族 key：同族成员归并去重用（无族产品退化为自身 asin） */
function familyKeyOf(p: MakimooProduct): string {
  const id = p.asin.toLowerCase();
  const group = VARIANT_GROUPS.find((g) => g.members.some((m) => m.asin.toLowerCase() === id));
  return group ? group.id : id;
}

/** product-tags.json 键回落：全 asin → 剥 -C数字 尾缀 → 族 id（键口径与评价/标签数据一致） */
type TagEntry = { color?: string; scene?: string };
const TAGS = PRODUCT_TAGS as unknown as Record<string, TagEntry>;

function tagEntry(asinLower: string): TagEntry {
  const direct = TAGS[asinLower];
  if (direct) return direct;
  const familyId = asinLower.replace(/-c\d+$/, '');
  return TAGS[familyId] || {};
}

function buildDoc(p: MakimooProduct): SearchDoc {
  const id = p.asin.toLowerCase();
  const materialRaw = PRODUCT_SPECS[id]?.material || '';
  const memberColor = COLOR_BY_ASIN.get(id);
  const tags = tagEntry(id);
  const colorRaw = memberColor || tags.color || '';
  const sceneRaw = tags.scene || '';
  const rating = p.rating ?? 0;
  const reviewCount = p.reviewCount ?? 0;
  return {
    product: p,
    titleLower: p.title.toLowerCase(),
    titleTok: tokenize(p.title),
    descTok: tokenize(p.description),
    subTok: tokenize(p.subcategory || ''),
    catTok: tokenize(p.productType || ''),
    materialTok: tokenize(materialRaw.split(',').join(' ')),
    colorTok: tokenize(colorRaw),
    sceneTok: tokenize(sceneRaw.replace(/-/g, ' ')),
    inStock: p.shopifyAvailable ?? p.availableForSale,
    quality: rating * Math.log(1 + reviewCount),
  };
}

// ---------------------------------------------------------------------------
// 评分
// ---------------------------------------------------------------------------

interface FieldRef {
  toks: string[];
  weight: number;
}

/** 单 token 在单个文档上的得分：各字段取最高（精确 1.0 / 前缀 0.6 / 同义 0.9 / 同义前缀 0.55） */
function tokenScore(qt: QueryToken, doc: SearchDoc): { score: number; titleEarly: boolean } {
  const fields: FieldRef[] = [
    { toks: doc.titleTok, weight: WEIGHTS.title },
    { toks: doc.subTok, weight: WEIGHTS.sub },
    { toks: doc.catTok, weight: WEIGHTS.cat },
    { toks: doc.materialTok, weight: WEIGHTS.material },
    { toks: doc.colorTok, weight: WEIGHTS.color },
    { toks: doc.sceneTok, weight: WEIGHTS.scene },
    { toks: doc.descTok, weight: WEIGHTS.desc },
  ];
  let best = 0;
  for (const f of fields) {
    let mult = 0;
    if (f.toks.includes(qt.t)) mult = 1;
    else if (qt.t.length >= 3 && f.toks.some((tok) => tok.startsWith(qt.t))) mult = 0.6;
    else if (qt.syn.length && f.toks.some((tok) => qt.syn.includes(tok))) mult = 0.9;
    else if (qt.syn.length && qt.t.length >= 3 && f.toks.some((tok) => qt.syn.some((s) => s.length >= 3 && tok.startsWith(s)))) mult = 0.55;
    if (mult > 0) {
      const w = f.weight * mult;
      if (w > best) best = w;
    }
  }
  // 标题前部（前 2 个 token 内）命中加成
  const titleEarly = best > 0 && doc.titleTok.slice(0, 2).includes(qt.t);
  return { score: best, titleEarly };
}

/** 完整查询打分：AND 语义（每个 token 至少一个字段命中），返回 0-100 归一化分；null = AND 未满足 */
function scoreDoc(qTokens: QueryToken[], joined: string, doc: SearchDoc): { total: number; hits: number } | null {
  let total = 0;
  let hits = 0;
  let earlyBonus = false;
  for (const qt of qTokens) {
    const { score, titleEarly } = tokenScore(qt, doc);
    if (score > 0) {
      total += score;
      hits += 1;
      if (titleEarly) earlyBonus = true;
    }
  }
  if (hits < qTokens.length) return null;
  // 短语连续命中加成（整句出现在标题里）
  if (joined && doc.titleLower.includes(joined)) total *= 1.25;
  if (earlyBonus) total *= 1.1;
  // 归一化到 0-100（满分 = 全部 token 标题精确命中）
  const max = qTokens.reduce((s) => s + WEIGHTS.title, 0) * 1.25 * 1.1;
  return { total: Math.min(100, (total / max) * 100), hits };
}

function compareDocs(a: { doc: SearchDoc; total: number }, b: { doc: SearchDoc; total: number }): number {
  if (b.total !== a.total) return b.total - a.total;
  if (a.doc.inStock !== b.doc.inStock) return a.doc.inStock ? -1 : 1;
  return b.doc.quality - a.doc.quality;
}

// ---------------------------------------------------------------------------
// 公开 API
// ---------------------------------------------------------------------------

/**
 * 在给定产品集合内检索（结果页在类目 scope 内调用）。
 * 返回按相关性排序的原产品引用；AND 无果时自动放宽为部分命中（无结果救援）。
 */
export function searchDocs<T extends MakimooProduct>(products: T[], query: string): T[] {
  const qTokens = prepareQuery(query);
  if (qTokens.length === 0) return products;
  const joined = qTokens.map((q) => q.t).join(' ');
  // 单字符查询（如 "2"）退化为标题子串匹配，避免AND语义把垃圾查询变成空结果
  if (qTokens.every((q) => q.t.length < 2)) {
    const n = query.trim().toLowerCase();
    return products.filter((p) => p.title.toLowerCase().includes(n));
  }
  const docs = products.map(buildDoc);
  const strict: { doc: SearchDoc; total: number }[] = [];
  const relaxed: { doc: SearchDoc; total: number }[] = [];
  for (const doc of docs) {
    const r = scoreDoc(qTokens, joined, doc);
    if (r) {
      strict.push({ doc, total: r.total });
    } else {
      // 放宽：按命中 token 数占比降权（至少命中 1 个才有意义）
      let partial = 0;
      let hits = 0;
      for (const qt of qTokens) {
        const { score } = tokenScore(qt, doc);
        if (score > 0) {
          partial += score;
          hits += 1;
        }
      }
      if (hits > 0) relaxed.push({ doc, total: (partial / (WEIGHTS.title * qTokens.length)) * 45 * (hits / qTokens.length) });
    }
  }
  const ordered = strict.length > 0 ? strict.sort(compareDocs) : relaxed.sort(compareDocs);
  return ordered.map((x) => x.doc.product as T);
}

// 全库文档缓存（searchAll 专用；结果页走 searchDocs 自己的 scope）
let cachedAll: MakimooProduct[] | null = null;
let cachedDocs: SearchDoc[] | null = null;
function fullDocs(): { products: MakimooProduct[]; docs: SearchDoc[] } {
  if (!cachedAll || !cachedDocs) {
    cachedAll = enrichProductsWithShopifyData(PRODUCTS_DATA);
    cachedDocs = cachedAll.map(buildDoc);
  }
  return { products: cachedAll, docs: cachedDocs };
}

/**
 * 全库检索 + 变体族去重（header 联想入口）：
 * 同一族只保留得分最高的成员（如搜 sage duvet 时保留 sage 色成员跳转），limit 默认 6。
 */
export function searchAll(query: string, limit = 6): MakimooProduct[] {
  const { products } = fullDocs();
  const hits = searchDocs(products, query);
  const seen = new Set<string>();
  const out: MakimooProduct[] = [];
  for (const p of hits) {
    const key = familyKeyOf(p);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

// ---------------------------------------------------------------------------
// 品类直达建议（matchCategories：P2 搜索层 UI 使用，本期只出数据）
// ---------------------------------------------------------------------------

export interface CategoryHit {
  label: string;
  href: string;
}

/** 查询词 → 类目词映射（把口语词引到正确类目；与 SYNONYMS 口径互补） */
const CATEGORY_SYNONYMS: Record<string, string> = {
  duvet: 'bedding',
  comforter: 'bedding',
  sheet: 'bedding',
  linen: 'bedding',
  rug: 'mats',
  carpet: 'mats',
  mat: 'mats',
  towel: 'towels',
  robe: 'towels',
  beach: 'towels',
  pillow: 'pillows',
  cushion: 'cushions',
  blanket: 'blankets',
  throw: 'blankets',
  fleece: 'blankets',
  wall: 'decor',
  art: 'decor',
  canvas: 'decor',
  tray: 'dining',
  placemat: 'dining',
  napkin: 'dining',
};

/** 品类/子类直达建议：token 与类目标签重叠计分，返回最多 limit 条 */
export function matchCategories(query: string, limit = 3): CategoryHit[] {
  const qTokens = prepareQuery(query).map((q) => q.t);
  if (qTokens.length === 0) return [];
  const hits: { hit: CategoryHit; score: number }[] = [];
  for (const c of CATEGORY_DEFS) {
    if (c.value === 'holiday' || c.value === 'others') continue;
    const labelToks = new Set(tokenize(c.label));
    let score = 0;
    for (const t of qTokens) {
      const mapped = CATEGORY_SYNONYMS[t];
      if (labelToks.has(t) || c.value === t) score += 2;
      else if (mapped && (mapped === c.value || labelToks.has(mapped))) score += 1.5;
    }
    if (score > 0) hits.push({ hit: { label: c.label, href: `/products?cat=${c.value}` }, score });
  }
  for (const s of SUBCATEGORIES) {
    const labelToks = new Set([...tokenize(s.label), ...tokenize(s.shortLabel || ''), ...tokenize(s.key.replace(/-/g, ' '))]);
    let score = 0;
    for (const t of qTokens) if (labelToks.has(t)) score += 2.5; // 子类更具体，权重略高
    if (score > 0) hits.push({ hit: { label: s.label, href: `/products?cat=${s.parent}&sub=${s.key}` }, score });
  }
  return hits
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.hit);
}
