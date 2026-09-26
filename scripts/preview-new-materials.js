/**
 * preview-new-materials.js — 预览素材库新品（不入库）
 *
 * 拉取 makimoohome 分组（groupId=18）全部产品，过滤出站点还没有的（且不在 HIDDEN_ASINS），
 * 用【现有规则】自动打：一级类目（sync-materials.js 同款 classify）、
 * 二级分类（subcategories.ts classifyProduct）、color/scene 标签（product-tags.ts 现行规则）。
 * 只打印预览表，不下载图片、不写任何数据文件。确认后再跑 sync-materials.js 入库。
 *
 * 用法：node scripts/preview-new-materials.js <素材库密码>   或   MATERIALS_PASSWORD=xxx node scripts/preview-new-materials.js
 */
const fs = require('fs');
const path = require('path');

// ---- TS shim（同 admin-server.js）：直接加载 src 下的 TS 数据/规则 ----
const ts = require('typescript');
require.extensions['.ts'] = function (m, f) {
  const src = fs.readFileSync(f, 'utf8');
  const out = ts.transpileModule(src, {
    compilerOptions: { module: 'commonjs', target: 'es2020', jsx: 'react' },
  }).outputText;
  m._compile(out, f);
};
const Module = require('module');
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  if (request.startsWith('@/')) request = path.join(process.cwd(), 'src', request.slice(2));
  return origResolve.call(this, request, ...args);
};

const ROOT = process.cwd();
const API_BASE = 'http://106.55.160.52:8080/api/public/materials';
const GROUP_ID = 18; // makimoohome

// 与 sync-materials.js 保持一致
const HIDDEN_ASINS = new Set([
  '1688-916370884976-c9',
  '1688-1051650740507-c2',
  '1688-1052742241013', '1688-1052742241013-c2', '1688-1052742241013-c3', '1688-1052742241013-c4', '1688-1052742241013-c5', '1688-1052742241013-c6',
  '1688-730512046265-c2', '1688-730512046265-c3', '1688-730512046265-c4', '1688-730512046265-c5', '1688-730512046265-c6',
]);

const { PRODUCTS_DATA } = require(path.join(ROOT, 'src/data/products.ts'));
const { classifyProduct } = require(path.join(ROOT, 'src/data/subcategories.ts'));
const { getColorTag, getSceneTag, NO_TAG_TYPES } = require(path.join(ROOT, 'src/data/product-tags.ts'));

// 一级类目判定：与 sync-materials.js 的 classify() 完全一致（改动时需两边同步）
function classify(title) {
  const t = (title || '').toLowerCase();
  if (/bath ?mats?|bath rug|kitchen (mat|rug)|door mat|entryway|floor mat|area rug|diatom/.test(t)) return 'Mats';
  if (/towels?\b/.test(t)) return 'Towels';
  if (/duvet|bedding|bed linen|quilt cover|comforter|fitted sheet|bed sheet/.test(t)) return 'Bedding';
  if (/blanket/.test(t)) return 'Blankets';
  if (/travel|neck pillow/.test(t) && !/pillowcase|pillow case|pillow cover|cushion cover|cushion sham/.test(t)) return 'Others';
  if (/chair cushions?|seat cushions?|seat pads?|lounge pillow|deep seat|high.?back/.test(t) && !/pillow insert|cushion insert|cushion filler|pillow stuffer/.test(t)) return 'Cushions';
  if (/pillowcase|pillow case|cushion cover|pillow cover|bed pillow|pillow insert|cushion inserts?|pillow stuffer|cushion filler|cushion pad|throw pillow insert|quilted.*(insert|pillow)/.test(t)) return 'Pillows';
  // Decor/挂画、Dining/托盘：先于 Cushions 的 dining 兜底，托盘标题常带 "dining table" 场景词
  if (/wall art|canvas (print|painting|wall)|framed (art|print|canvas)|decorative painting|wall decor|hanging (painting|picture)/.test(t)) return 'Decor';
  if (/tray|serving basket|fruit (plate|basket|bowl)|snack (plate|bowl|tray)|platter|bread basket/.test(t)) return 'Dining';
  if (/dining|chair cushion|seat cushion|seat pad|patio.*cushion|cushions? (set|with|2 pack|4 pack)/.test(t)) return 'Cushions';
  return 'Others';
}

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
if (!password) {
  console.error('缺少密码：.env.local 加 MATERIALS_PASSWORD=xxx，或 node scripts/preview-new-materials.js <密码>');
  process.exit(1);
}

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
}

(async () => {
  const verify = await fetchJson(`${API_BASE}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!verify.success) throw new Error('素材库密码验证失败');
  const list = await fetchJson(`${API_BASE}/`, { headers: { 'x-materials-token': verify.data.token } });
  const items = list.data.items.filter((i) => i.groupId === GROUP_ID);

  const siteAsins = new Set(PRODUCTS_DATA.map((p) => p.asin.toLowerCase()));
  const newItems = items.filter(
    (i) => !HIDDEN_ASINS.has(i.asin.toLowerCase()) && !siteAsins.has(i.asin.toLowerCase()) && (i.images || []).length > 0
  );

  console.log(`素材库 makimoohome 共 ${items.length} 个产品，站内已有 ${items.length - newItems.length} 个，新品 ${newItems.length} 个：\n`);
  for (const i of newItems) {
    const title = i.listingTitle || i.productTitleCn || i.asin;
    const type = classify(title);
    const sub = classifyProduct(type, title, i.asin) || '-';
    // Others 不做 color/scene 分类（全站规则）
    const color = NO_TAG_TYPES.has(type) ? '-' : (getColorTag(title, i.asin)?.label ?? '（无）');
    const scene = NO_TAG_TYPES.has(type) ? '-' : (getSceneTag(title, type)?.label ?? '（无）');
    console.log(JSON.stringify({
      asin: i.asin, sku: i.sku || null, 图片: (i.images || []).length,
      一级类目: type, 二级分类: sub, color, scene, title,
    }));
  }
})().catch((e) => {
  console.error('失败:', e.message);
  process.exit(1);
});
