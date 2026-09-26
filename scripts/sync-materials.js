/**
 * sync-materials.js — 从素材库 (106.55.160.52:8080/materials) 同步 makimoohome 分组产品
 *
 * 功能：
 *  1. 拉取 groupId=18 (makimoohome) 的全部产品
 *  2. 图片规则：图片池 = 素材库"初审定版图"（images 数组，顺序即展示顺序，与素材库详情页一致）
 *  3. 下载图片 → sharp 转 WebP → public/images/products/{ASIN}/{n}.webp（文件编号按下载顺序，展示顺序由 map 定义）
 *  4. 生成 src/data/materials-map.ts（全部素材产品的标题/五点/图片覆盖表，key 为小写 ASIN 或 1688-xxx 标识）
 *  5. 生成 src/data/products-materials.ts（站点上没有的新产品完整条目，自动分类、白底检测）
 *
 * 用法： node scripts/sync-materials.js <密码>   或   MATERIALS_PASSWORD=xxx node scripts/sync-materials.js
 *  全量： MATERIALS_JWT=xxx node scripts/sync-materials.js（推荐；公开密码接口已按密码归属用户隔离，只有 JWT 能拉到全组数据）
 * 幂等：有 scripts/materials-manifest.json 时按 URL 顺序逐产品对比，顺序/内容有变才重下（打印 [图片更新]）；无 manifest 时按数量跳过。--force 强制全部重下；默认保持素材库原始图片顺序（keep-order 为默认行为，--reorder 才做旧的优先级重排）。
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const API_BASE = 'http://106.55.160.52:8080/api/public/materials';
const PLATFORM_BASE = 'http://106.55.160.52:8080';
// 管理端 JWT 通道：平台公开素材接口已按密码归属用户隔离（单密码只能取到该用户自己的素材，2026-09-24 实测），
// 全组同步需提供有权限账号的 JWT：MATERIALS_JWT=xxx node scripts/sync-materials.js
const MATERIALS_JWT =
  process.env.MATERIALS_JWT ||
  (() => {
    // 与 MATERIALS_PASSWORD 同款：直接从 .env.local 读 MATERIALS_JWT=xxx
    try {
      const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
      return (env.match(/^MATERIALS_JWT=(.+)$/m) || [])[1]?.trim();
    } catch {
      return undefined;
    }
  })() ||
  '';
const GROUP_ID = 18; // makimoohome
const ROOT = path.join(__dirname, '..');
const PRODUCTS_TS = path.join(ROOT, 'src/data/products.ts');
const OUT_MAP_TS = path.join(ROOT, 'src/data/materials-map.ts');
const OUT_NEW_TS = path.join(ROOT, 'src/data/products-materials.ts');
const IMG_BASE = path.join(ROOT, 'public/images/products');
const CONCURRENCY = 6;
const FORCE = process.argv.includes('--force');
// 默认保持素材库原始顺序，不做展示优先级重排（素材库上已排好序）；需要旧的优先级重排时显式传 --reorder
const KEEP_ORDER = !process.argv.includes('--reorder');

// 首图置顶：含这些 URL 的产品把该"铺床场景图"排为第一展示图（用户指定样式，参照 1688-969627065032-C40），其余图顺位后移；文件编号不变
const PIN_FIRST_URLS = new Set([
  'https://amzphoto-1251810512.cos.ap-guangzhou.myqcloud.com/cxai/1787753115875-289349635.png', // 深灰族 C31-C35
  'https://amzphoto-1251810512.cos.ap-guangzhou.myqcloud.com/cxai/1787755009676-389264703.png', // 蓝族 C21-C25
  'https://img1.seeany.com/20260826/6c1a7df1-7b34-4860-b1d9-9e69202e75d8.png', // 银灰族 C36-C40
  'https://amzphoto-1251810512.cos.ap-guangzhou.myqcloud.com/cxai/1787752452401-505148488.png', // 奶黄族 C26-C30
  'https://img1.seeany.com/20260825/f4c9f0f2-06fb-4366-bfde-a89b41acd6aa.png', // 浅紫族 C41-C43
]);

const password =
  process.env.MATERIALS_PASSWORD ||
  (() => {
    // 与 seeany-*.js 同款：直接从 .env.local 读 MATERIALS_PASSWORD=xxx
    try {
      const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
      return (env.match(/^MATERIALS_PASSWORD=(.+)$/m) || [])[1]?.trim();
    } catch {
      return undefined;
    }
  })() ||
  process.argv.find((a, i) => i >= 2 && !a.startsWith('--'));
if (!password && !MATERIALS_JWT) {
  console.error('缺少凭据：.env.local 加 MATERIALS_PASSWORD=xxx / MATERIALS_JWT=xxx，或 node scripts/sync-materials.js <密码>');
  process.exit(1);
}

const AMAZON_HOST = { US: 'www.amazon.com', DE: 'www.amazon.de', UK: 'www.amazon.co.uk' };

// 用户要求全站隐藏的产品（素材库保留，不生成站点条目；小写标识）
// 2026-09-24：花边-禾时 main/C2（1688-1051650740507 / -c2）应 owner 要求解除隐藏，27 SKU 全量上站
  // 隐藏名单（素材库保留、站点不生成）：916370884976-c9 重复被子变体；1052742241013 老地毯 6 条与
  // 730512046265 老挂画 5 条为领导 09-20 重制上传前的旧条目（已被 C7-C12 / C14-C19 取代，2026-09-26）
  const HIDDEN_ASINS = new Set([
    '1688-916370884976-c9',
    '1688-1052742241013', '1688-1052742241013-c2', '1688-1052742241013-c3', '1688-1052742241013-c4', '1688-1052742241013-c5', '1688-1052742241013-c6',
    '1688-730512046265-c2', '1688-730512046265-c3', '1688-730512046265-c4', '1688-730512046265-c5', '1688-730512046265-c6',
  ]);

function classify(title) {
  const t = (title || '').toLowerCase();
  // Towels/Mats 优先：浴巾/地垫标题常带 "travel"(便携场景) 或 "dining"(kitchen dining)，先拦截
  if (/bath ?mats?|bath rug|kitchen (mat|rug)|door mat|entryway|floor mat|area rug|diatom/.test(t)) return 'Mats';
  if (/towels?\b/.test(t)) return 'Towels';
  // Bedding/Blanket 先于 Pillows：床品件套标题常带 pillowcases，毯子标题常带 couch/sofa
  if (/duvet|bedding|bed linen|quilt cover|comforter|fitted sheet|bed sheet/.test(t)) return 'Bedding';
  if (/blanket/.test(t)) return 'Blankets';
  // Travel 已并入 Others（全站统一 6 类）；枕套类标题常带 "travel"（旅行场景用法），仍归 Pillows
  if (/travel|neck pillow/.test(t) && !/pillowcase|pillow case|pillow cover|cushion cover|cushion sham/.test(t)) return 'Others';
  // 椅垫先于 Pillows：户外椅垫标题常带 "cushion pad"/"lounge pillow"，避免误入 Pillows
  if (/chair cushions?|seat cushions?|seat pads?|lounge pillow|deep seat|high.?back/.test(t) && !/pillow insert|cushion insert|cushion filler|pillow stuffer/.test(t)) return 'Cushions';
  if (/pillowcase|pillow case|cushion cover|pillow cover|bed pillow|pillow insert|cushion inserts?|pillow stuffer|cushion filler|cushion pad|throw pillow insert|quilted.*(insert|pillow)/.test(t)) return 'Pillows';
  // Decor/挂画、Dining/托盘：先于 Cushions 的 dining 兜底，托盘标题常带 "dining table" 场景词
  if (/wall art|canvas (print|painting|wall)|framed (art|print|canvas)|decorative painting|wall decor|hanging (painting|picture)/.test(t)) return 'Decor';
  if (/tray|serving basket|fruit (plate|basket|bowl)|snack (plate|bowl|tray)|platter|bread basket/.test(t)) return 'Dining';
  // Dining 场景词兜底仍归 Cushions（椅垫标题常带 "dining"）
  if (/dining|chair cushion|seat cushion|seat pad|patio.*cushion|cushions? (set|with|2 pack|4 pack)/.test(t)) return 'Cushions';
  return 'Others';
}

function slugify(title, asin) {
  let s = (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (s.length > 60) s = s.slice(0, 60).replace(/-[^-]*$/, '');
  return `${s}-${asin.toLowerCase()}`;
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
}

async function downloadToWebp(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const img = sharp(buf).rotate(); // 尊重 EXIF 方向
  const meta = await img.metadata();
  if (Math.max(meta.width || 0, meta.height || 0) > 1600) {
    img.resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true });
  }
  await img.webp({ quality: 82 }).toFile(dest);
}

/**
 * 白底图检测：采样四边像素，近白（R/G/B 均 ≥ 245）比例 ≥ 70% 判定为白底图。
 * 前端据此给白底图加内边距（缩小产品占比），场景图保持打满。
 */
async function detectWhiteBg(file) {
  try {
    const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h, channels: ch } = info;
    let edge = 0, white = 0;
    const check = (p) => {
      const o = p * ch;
      edge++;
      if (data[o] >= 245 && data[o + 1] >= 245 && data[o + 2] >= 245) white++;
    };
    for (let x = 0; x < w; x += 2) { check(x); check((h - 1) * w + x); }
    for (let y = 0; y < h; y += 2) { check(y * w); check(y * w + w - 1); }
    return white / edge >= 0.7;
  } catch {
    return false;
  }
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let idx = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i], i);
    }
  }));
  return results;
}

(async () => {
  // 0. 旧 materials-map.ts 行解析：老产品 SKU 回收 + 定版图为空的老产品沿用本地图片序列（磁盘 WebP 仍在，
  //    管理端 items 的 finalProductImages 对未定版/历史产品为空，直接丢行会让在售产品从站点消失）
  const oldMapRows = {};
  try {
    for (const line of fs.readFileSync(OUT_MAP_TS, 'utf8').split('\n')) {
      const m = line.match(/^\s*"([a-z0-9-]+)":\s*(\{.*\}),\s*$/);
      if (m) {
        try { oldMapRows[m[1]] = JSON.parse(m[2]); } catch { /* 坏行忽略 */ }
      }
    }
  } catch { /* 首次运行无旧文件 */ }
  const oldSku = {};
  for (const [k, v] of Object.entries(oldMapRows)) if (v && typeof v.sku === 'string') oldSku[k] = v.sku;

  // 1. 拉取：JWT 通道 = 管理端全量；密码通道 = 公开接口（只能取到密码归属用户自己的素材）
  let items;
  if (MATERIALS_JWT) {
    const r = await fetchJson(`${PLATFORM_BASE}/api/materials/items?groupId=${GROUP_ID}`, {
      headers: { Authorization: `Bearer ${MATERIALS_JWT}` },
    });
    const raw = (r.data && r.data.items) || r.data || [];
    items = raw
      .filter((i) => i.groupId === GROUP_ID)
      .map((i) => {
        const key = (i.asin || '').toLowerCase();
        let images = i.finalProductImages || [];
        let carryLocal = false;
        const oldRow = oldMapRows[key];
        if (!images.length && oldRow && Array.isArray(oldRow.images) && oldRow.images.length &&
            oldRow.images.every((p) => fs.existsSync(path.join(ROOT, 'public', p.replace(/\//g, path.sep))))) {
          images = oldRow.images.slice(); // 沿用本地序列，文件编号与磁盘一致
          carryLocal = true;
        }
        return {
          groupId: i.groupId,
          asin: i.asin,
          marketplace: i.marketplace,
          productTitleCn: i.productTitleCn,
          listingTitle: i.listingTitle,
          listingBullets: i.listingBullets,
          sku: i.sku || '',
          images,
          imageTypes: {},
          carryLocal,
        };
      });
  } else {
    const verify = await fetchJson(`${API_BASE}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!verify.success) throw new Error('素材库密码验证失败');
    const list = await fetchJson(`${API_BASE}/`, { headers: { 'x-materials-token': verify.data.token } });
    items = list.data.items.filter((i) => i.groupId === GROUP_ID);
  }
  console.log(`素材库 makimoohome 分组产品数: ${items.length}${MATERIALS_JWT ? '（管理端全量）' : ''}`);

  // 2. 站点现有 ASIN（含 1688-xxx 供应商标识）
  const productsSrc = fs.readFileSync(PRODUCTS_TS, 'utf8');
  const siteAsins = new Set([...productsSrc.matchAll(/"asin": "([A-Za-z0-9-]+)"/g)].map((m) => m[1]));

  // 3. 每个产品整理图片清单并下载转 WebP
  // 图片池 = 素材库"初审定版图"（images 数组，素材库详情页展示的就是它；imageTypes 的标注图不入站）
  // manifest 记录每个产品的图片 URL 顺序：数量没变但顺序/内容有更新的产品也能被检出并重下
  const MANIFEST_PATH = path.join(__dirname, 'materials-manifest.json');
  const manifestExists = fs.existsSync(MANIFEST_PATH);
  let manifest = {};
  if (manifestExists) { try { manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')); } catch { /* 损坏则视为无 */ } }
  // carryLocal 产品（定版图为空、沿用本地序列）：预置 manifest 保证幂等跳过，不触发误重下
  for (const it of items) {
    if (it.carryLocal && !((manifest[it.asin] || []).length)) manifest[it.asin] = it.images;
  }
  const itemTypes = {}; // asin -> { url: type }
  const POOLS = {}; // asin -> 下载顺序的原始 URL 数组
  let downloaded = 0, skipped = 0, failed = 0;
  const productImages = {}; // asin -> 本地路径数组（下载顺序）
  await mapLimit(items, CONCURRENCY, async (item) => {
    const asin = item.asin;
    itemTypes[asin] = item.imageTypes || {};
    const ordered = [];
    const seen = new Set();
    for (const u of [...(item.images || [])]) {
      if (u && !seen.has(u)) { seen.add(u); ordered.push(u); }
    }
    POOLS[asin] = ordered;
    if (ordered.length === 0) { console.log(`  [无图] ${asin}`); productImages[asin] = []; return; }

    const dir = path.join(IMG_BASE, asin);
    const localPaths = ordered.map((_, i) => `/images/products/${asin}/${i + 1}.webp`);
    const existing = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.webp')) : [];
    const prevUrls = manifest[asin];
    const sameOrder = prevUrls && prevUrls.length === ordered.length && prevUrls.every((u, i) => u === ordered[i]);
    if (!FORCE && existing.length === ordered.length && (sameOrder || !manifestExists)) {
      skipped += ordered.length;
      productImages[asin] = localPaths;
      return;
    }
    // 数量/顺序/内容不一致或 force：清掉旧图重下（只清数字编号定图；detail-*.webp 等附属图保留，防 overrides 死链）
    if (!FORCE && existing.length === ordered.length) console.log(`  [图片更新] ${asin}（数量不变，顺序/内容有变化）`);
    fs.mkdirSync(dir, { recursive: true });
    for (const f of existing) {
      if (!/^\d+\.webp$/.test(f)) continue;
      fs.unlinkSync(path.join(dir, f));
    }
    for (let i = 0; i < ordered.length; i++) {
      const dest = path.join(dir, `${i + 1}.webp`);
      try {
        await downloadToWebp(ordered[i], dest);
        downloaded++;
      } catch (e) {
        failed++;
        console.log(`  [下载失败] ${asin} #${i + 1}: ${e.message} — ${ordered[i]}`);
      }
    }
    // 只保留实际下载成功的图
    productImages[asin] = localPaths.filter((_, i) => fs.existsSync(path.join(dir, `${i + 1}.webp`)));
  });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(POOLS, null, 1));
  console.log(`图片处理完成: 下载 ${downloaded}, 跳过 ${skipped}, 失败 ${failed}`);

  // 4. 生成 materials-map.ts（覆盖全部素材 ASIN），并对每张图做白底检测
  // 展示顺序（首图优先级）：场景展示图 > 无文字场景图1 > 白底主图 > 用户上传图（非白底在前、白底在后）> 卖点图 > 细节特写图 > 尺寸图 > 营销主图
  const TYPE_RANK = { '场景展示图': 0, '无文字场景图1': 1, '白底主图': 2, '卖点图': 5, '细节特写图': 6, '尺寸图': 7, '营销主图': 8 };
  const withImages = items.filter((i) => (productImages[i.asin] || []).length > 0);
  const mapRows = [];
  for (const i of withImages) {
    const localPaths = productImages[i.asin];
    const whiteBg = [];
    for (const localPath of localPaths) {
      const abs = path.join(ROOT, 'public', localPath.replace(/\//g, path.sep));
      whiteBg.push(await detectWhiteBg(abs));
    }
    // 展示顺序：默认保持素材库原始顺序（KEEP_ORDER 默认开启）；--reorder 时按优先级重排（文件编号不变，只调整 map 中的展示顺序）
    const types = itemTypes[i.asin] || {};
    const rankOf = (idx) => {
      const type = types[POOLS[i.asin][idx]];
      if (type !== undefined) return TYPE_RANK[type] !== undefined ? TYPE_RANK[type] : 9;
      return whiteBg[idx] ? 4 : 3; // 无类型标注的用户上传图：场景（非白底）在前，白底在后
    };
    const order = KEEP_ORDER
      ? localPaths.map((_, idx) => idx)
      : localPaths.map((_, idx) => idx).sort((a, b) => rankOf(a) - rankOf(b) || a - b);
    // 首图置顶：命中的铺床场景图排到最前，其余保持相对顺序
    const pinIdx = order.find((idx) => PIN_FIRST_URLS.has(POOLS[i.asin][idx]));
    if (pinIdx !== undefined && order[0] !== pinIdx) {
      order.splice(order.indexOf(pinIdx), 1);
      order.unshift(pinIdx);
    }
    const finalImages = order.map((idx) => localPaths[idx]);
    const finalWhiteBg = order.map((idx) => whiteBg[idx]);
    productImages[i.asin] = finalImages;
    mapRows.push(`  ${JSON.stringify(i.asin.toLowerCase())}: {"title":${JSON.stringify(i.listingTitle || '')},"bullets":${JSON.stringify(i.listingBullets || '')},"sku":${JSON.stringify(i.sku || oldSku[(i.asin || '').toLowerCase()] || '')},"images":${JSON.stringify(finalImages)},"whiteBg":${JSON.stringify(finalWhiteBg)}},`);
  }
  const mapEntries = mapRows.join('\n');

  // 4.5 素材库之外的老产品：解析 products.ts 中的本地图片路径，同样做白底检测（只生成标记，不覆盖其它数据）
  const matsAsins = new Set(withImages.map((i) => i.asin));
  const siteOnlyRows = [];
  const entryBlocks = productsSrc.split('"id": "makimoo-').slice(1);
  for (const block of entryBlocks) {
    const asin = (block.match(/"asin": "([A-Za-z0-9-]+)"/) || [])[1];
    if (!asin || matsAsins.has(asin)) continue;
    const urls = [...block.matchAll(/"url": "(\/images\/products\/[^"]+\.webp)"/g)].map((m) => m[1]);
    if (urls.length === 0) continue;
    const whiteBg = [];
    for (const u of urls) {
      const abs = path.join(ROOT, 'public', u.replace(/\//g, path.sep));
      whiteBg.push(fs.existsSync(abs) ? await detectWhiteBg(abs) : false);
    }
    siteOnlyRows.push(`  ${JSON.stringify(asin.toLowerCase())}: ${JSON.stringify(whiteBg)},`);
  }
  const siteOnlyEntries = siteOnlyRows.join('\n');
  fs.writeFileSync(OUT_MAP_TS, `// Auto-generated by scripts/sync-materials.js
// DO NOT EDIT MANUALLY - Run 'node scripts/sync-materials.js' to update
// Generated at: ${new Date().toISOString()}

export interface MaterialsEntry {
  title: string;
  bullets: string;
  /** 素材库新格式 SKU（如 US-F61ZXX），Shopify 产品的 SKU 必须与此一致 */
  sku: string;
  images: string[];
  /** 与 images 对齐：true = 白底图（前端加内边距缩小显示），false = 场景图（打满） */
  whiteBg: boolean[];
  /** 详情页附图（可选；素材平台 detailImages，有才渲染，无则不显示） */
  detailImages?: string[];
}

export const MATERIALS_MAP: Record<string, MaterialsEntry> = {
${mapEntries}
};

/** 素材库之外的老产品的白底图标记（与 products.ts 中 images 顺序对齐） */
export const SITE_ONLY_WHITEBG: Record<string, boolean[]> = {
${siteOnlyEntries}
};
`);
  console.log(`已生成 ${path.relative(ROOT, OUT_MAP_TS)} (${items.length} 条素材 + ${siteOnlyRows.length} 条老产品标记)`);

  // 5. 生成 products-materials.ts（站点没有的新 ASIN；HIDDEN_ASINS 用户要求隐藏的不生成）
  const newItems = items.filter((i) => !HIDDEN_ASINS.has(i.asin.toLowerCase()) && !siteAsins.has(i.asin) && (productImages[i.asin] || []).length > 0);
  const entries = newItems.map((i) => {
    const title = i.listingTitle || i.productTitleCn || i.asin;
    const bullets = (i.listingBullets || '').trim();
    const descHtml = bullets
      ? bullets.split(/\n\n+/).map((p) => `<p>${escapeHtml(p.replace(/\n/g, ' '))}</p>`).join('')
      : '';
    const descText = bullets.replace(/\n\n+/g, ' ').replace(/\n/g, ' ');
    const category = classify(title);
    const host = AMAZON_HOST[i.marketplace] || AMAZON_HOST.US;
    const images = productImages[i.asin].map((url) => ({
      url, altText: title, width: 800, height: 800,
    }));
    return {
      id: `makimoo-${i.asin}`,
      asin: i.asin,
      title,
      handle: slugify(title, i.asin),
      description: descText,
      descriptionHtml: descHtml,
      productType: category,
      tags: [category],
      availableForSale: false,
      images,
      priceRange: { minVariantPrice: { amount: '0.00', currencyCode: 'USD' } },
      variants: [{
        id: `variant-${i.asin}`,
        title: 'Default Title',
        price: { amount: '0.00', currencyCode: 'USD' },
        availableForSale: false,
        selectedOptions: [],
      }],
      // 1688 供应商产品无亚马逊链接（正常在售时前台也不会显示该按钮）
      amazonUrl: i.asin.startsWith('B0') ? `https://${host}/dp/${i.asin}` : '',
    };
  });
  fs.writeFileSync(OUT_NEW_TS, `// Auto-generated by scripts/sync-materials.js
// DO NOT EDIT MANUALLY - Run 'node scripts/sync-materials.js' to update
// Generated at: ${new Date().toISOString()}
// 素材库中站点上不存在的产品（无 Shopify 数据，统一显示 Out of Stock，建品后自动接上价格/库存）

import type { MakimooProduct } from './products';

export const MATERIALS_PRODUCTS: MakimooProduct[] = ${JSON.stringify(entries, null, 2)};
`);
  console.log(`已生成 ${path.relative(ROOT, OUT_NEW_TS)} (新增 ${entries.length} 个产品)`);
  console.log(`分类统计: ${JSON.stringify(entries.reduce((acc, e) => { acc[e.productType] = (acc[e.productType] || 0) + 1; return acc; }, {}))}`);
})().catch((e) => { console.error(e); process.exit(1); });
