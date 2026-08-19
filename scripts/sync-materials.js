/**
 * sync-materials.js — 从素材库 (106.55.160.52:8080/materials) 同步 makimoohome 分组产品
 *
 * 功能：
 *  1. 拉取 groupId=18 (makimoohome) 的全部产品
 *  2. 图片规则：whiteBgImages 优先在前，其余按 images 现有顺序补充（按 URL 去重）；第 1 张为主图
 *  3. 下载图片 → sharp 转 WebP → public/images/products/{ASIN}/{n}.webp（覆盖旧文件）
 *  4. 生成 src/data/materials-map.ts（全部 101 个 ASIN 的标题/五点/图片覆盖表）
 *  5. 生成 src/data/products-materials.ts（站点上没有的新 ASIN 的完整产品条目）
 *
 * 用法： node scripts/sync-materials.js <密码>   或   MATERIALS_PASSWORD=xxx node scripts/sync-materials.js
 * 幂等：图片已存在且数量一致时跳过下载；--force 强制全部重下。
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const API_BASE = 'http://106.55.160.52:8080/api/public/materials';
const GROUP_ID = 18; // makimoohome
const ROOT = path.join(__dirname, '..');
const PRODUCTS_TS = path.join(ROOT, 'src/data/products.ts');
const OUT_MAP_TS = path.join(ROOT, 'src/data/materials-map.ts');
const OUT_NEW_TS = path.join(ROOT, 'src/data/products-materials.ts');
const IMG_BASE = path.join(ROOT, 'public/images/products');
const CONCURRENCY = 6;
const FORCE = process.argv.includes('--force');

const password = process.env.MATERIALS_PASSWORD || process.argv.find((a, i) => i >= 2 && !a.startsWith('--'));
if (!password) {
  console.error('缺少密码：node scripts/sync-materials.js <密码>');
  process.exit(1);
}

const AMAZON_HOST = { US: 'www.amazon.com', DE: 'www.amazon.de', UK: 'www.amazon.co.uk' };

function classify(title) {
  const t = (title || '').toLowerCase();
  if (/travel|neck pillow/.test(t)) return 'Travel';
  if (/pillowcase|pillow case|cushion cover|pillow cover|bed pillow|pillow insert|cushion filler|cushion pad|throw pillow insert|quilted.*(insert|pillow)/.test(t)) return 'Pillows';
  if (/dining/.test(t)) return 'Dining';
  if (/chair cushion|seat cushion|seat pad|patio.*cushion|cushions? (set|with|2 pack|4 pack)/.test(t)) return 'Cushions';
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
  // 1. 验证 & 拉取
  const verify = await fetchJson(`${API_BASE}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!verify.success) throw new Error('素材库密码验证失败');
  const list = await fetchJson(`${API_BASE}/`, { headers: { 'x-materials-token': verify.data.token } });
  const items = list.data.items.filter((i) => i.groupId === GROUP_ID);
  console.log(`素材库 makimoohome 分组产品数: ${items.length}`);

  // 2. 站点现有 ASIN
  const productsSrc = fs.readFileSync(PRODUCTS_TS, 'utf8');
  const siteAsins = new Set([...productsSrc.matchAll(/"asin": "([A-Z0-9]+)"/g)].map((m) => m[1]));

  // 3. 每个产品整理图片清单并下载转 WebP
  let downloaded = 0, skipped = 0, failed = 0;
  const productImages = {}; // asin -> 本地路径数组
  await mapLimit(items, CONCURRENCY, async (item) => {
    const asin = item.asin;
    const ordered = [];
    const seen = new Set();
    for (const u of [...(item.whiteBgImages || []), ...(item.images || [])]) {
      if (u && !seen.has(u)) { seen.add(u); ordered.push(u); }
    }
    if (ordered.length === 0) { console.log(`  [无图] ${asin}`); productImages[asin] = []; return; }

    const dir = path.join(IMG_BASE, asin);
    const localPaths = ordered.map((_, i) => `/images/products/${asin}/${i + 1}.webp`);
    const existing = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.webp')) : [];
    if (!FORCE && existing.length === ordered.length) {
      skipped += ordered.length;
      productImages[asin] = localPaths;
      return;
    }
    // 数量不一致或 force：清掉旧图重下
    fs.mkdirSync(dir, { recursive: true });
    for (const f of existing) fs.unlinkSync(path.join(dir, f));
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
  console.log(`图片处理完成: 下载 ${downloaded}, 跳过 ${skipped}, 失败 ${failed}`);

  // 4. 生成 materials-map.ts（覆盖全部素材 ASIN）
  const mapEntries = items
    .filter((i) => (productImages[i.asin] || []).length > 0)
    .map((i) => `  ${JSON.stringify(i.asin.toLowerCase())}: {"title":${JSON.stringify(i.listingTitle || '')},"bullets":${JSON.stringify(i.listingBullets || '')},"images":${JSON.stringify(productImages[i.asin])}},`)
    .join('\n');
  fs.writeFileSync(OUT_MAP_TS, `// Auto-generated by scripts/sync-materials.js
// DO NOT EDIT MANUALLY - Run 'node scripts/sync-materials.js' to update
// Generated at: ${new Date().toISOString()}

export interface MaterialsEntry {
  title: string;
  bullets: string;
  images: string[];
}

export const MATERIALS_MAP: Record<string, MaterialsEntry> = {
${mapEntries}
};
`);
  console.log(`已生成 ${path.relative(ROOT, OUT_MAP_TS)} (${items.length} 条)`);

  // 5. 生成 products-materials.ts（站点没有的新 ASIN）
  const newItems = items.filter((i) => !siteAsins.has(i.asin) && (productImages[i.asin] || []).length > 0);
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
      amazonUrl: `https://${host}/dp/${i.asin}`,
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
