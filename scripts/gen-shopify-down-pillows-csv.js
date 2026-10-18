/**
 * gen-shopify-down-pillows-csv.js — Down / Down & Feather 床枕 Shopify 批量导入 CSV（2026-10-18）
 * 6 个产品（2 款填充 × 3 尺寸），与 add-down-pillows.js 的 ASIN/SKU 口径一致：
 *   SKU = down-pillow-<size> / down-feather-pillow-<size>（Shopify 侧靠 SKU 与本地 materials-map 兜底关联）
 * 每个产品 2 张图：1.webp 主图（灰底双枕平叠）+ 2.webp 填充物图，
 *   第二行同 handle 仅带 Image position 2（Shopify 多图导入惯例）。
 * 定价（2026-10-18 用户定）：
 *   down          std $199 / queen $219 / king $289（重量估值 900/1000/1150 g）
 *   down-feather  std $59 / queen $69 / king $99（重量估值 1100/1250/1400 g）
 * 图片引用线上 URL：https://www.makimoohome.com/images/products/<ASIN>/<n>.webp
 *   ——注意：图片需先部署到线上 Shopify 才能拉到，先推送网站再导入（或先用 -noimg 版建品）
 * 输出：C:/Users/12021/Desktop/makimoo-down-pillows-6.csv（+ -noimg 备份版）
 * 用法: node scripts/gen-shopify-down-pillows-csv.js
 */
const fs = require('fs');

const SIZES = [
  { key: 'standard', name: 'Standard', inch: '20" x 26"', cm: '51 x 66 cm' },
  { key: 'queen', name: 'Queen', inch: '20" x 30"', cm: '51 x 76 cm' },
  { key: 'king', name: 'King', inch: '20" x 36"', cm: '51 x 91 cm' },
];

const LINES = [
  {
    id: 'down-pillow',
    asinPrefix: 'DOWN-PILLOW',
    label: 'Down Bed Pillows',
    fill: '80% Down 20% Feather and Fiber',
    tags: 'Pillows, Bed Pillow, Down',
    prices: { standard: '199.00', queen: '219.00', king: '289.00' },
    grams: { standard: 900, queen: 1000, king: 1150 },
    blurb: 'cloud-like softness with airy, high-loft fullness',
  },
  {
    id: 'down-feather-pillow',
    asinPrefix: 'DOWN-FEATHER-PILLOW',
    label: 'Down and Feather Bed Pillows',
    fill: '50% Down 50% Feather and Fiber',
    tags: 'Pillows, Bed Pillow, Down and Feather',
    prices: { standard: '59.00', queen: '69.00', king: '99.00' },
    grams: { standard: 1100, queen: 1250, king: 1400 },
    blurb: 'down softness balanced with feather support for a medium, resilient feel',
  },
];

const HEADER = [
  'Title', 'URL handle', 'Description', 'Vendor', 'Product category', 'Type', 'Tags',
  'Published on online store', 'Status', 'SKU', 'Variant Barcodes',
  'Option1 name', 'Option1 value', 'Option1 Linked To',
  'Option2 name', 'Option2 value', 'Option2 Linked To',
  'Option3 name', 'Option3 value', 'Option3 Linked To',
  'Price', 'Compare-at price', 'Cost per item', 'Charge tax', 'Tax code',
  'Unit price total measure', 'Unit price total measure unit', 'Unit price base measure', 'Unit price base measure unit',
  'Inventory tracker', 'Inventory quantity', 'Continue selling when out of stock',
  'Weight value (grams)', 'Weight unit for display', 'Requires shipping', 'Fulfillment service',
  'Product image URL', 'Image position', 'Image alt text', 'Variant image URL',
  'Gift card', 'SEO title', 'SEO description',
  'Color (product.metafields.shopify.color-pattern)',
  'Google Shopping / Google product category', 'Google Shopping / Gender', 'Google Shopping / Age group',
  'Google Shopping / Manufacturer part number (MPN)', 'Google Shopping / Ad group name', 'Google Shopping / Ads labels',
  'Google Shopping / Condition', 'Google Shopping / Custom product',
  'Google Shopping / Custom label 0', 'Google Shopping / Custom label 1', 'Google Shopping / Custom label 2',
  'Google Shopping / Custom label 3', 'Google Shopping / Custom label 4',
  'Packed product length', 'Packed product width', 'Packed product height', 'Packed product dimension unit',
];

const q = (v) => {
  const s = String(v ?? '');
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

const bullets = (line, s) => [
  `${line.fill.split(' ').slice(0, 2).join(' ')} Fill (${line.fill}): Filled with ${line.fill.toLowerCase()}, these pillows deliver ${line.blurb}.`,
  '100% Cotton Cover: A smooth, breathable cotton shell keeps the fill evenly distributed while feeling cool and gentle against the skin.',
  `Set of 2, ${s.name} Size: Each pillow measures ${s.inch} (${s.cm}), a ready-to-pair set that outfits your bed with hotel-inspired comfort.`,
  'Easy Care: Fluff daily to maintain loft. Machine wash cold on gentle and tumble dry low with dryer balls to restore fullness.',
];

function rows(line, s, withImg) {
  const sku = `${line.id}-${s.key}`;
  const asin = `${line.asinPrefix}-${s.key.toUpperCase()}`;
  const readableTitle = `Makimoo ${s.name} ${line.label} Set of 2 ${line.fill} 100% Cotton Cover (White)`;
  const img1 = `https://www.makimoohome.com/images/products/${asin}/1.webp`;
  const img2 = `https://www.makimoohome.com/images/products/${asin}/2.webp`; // 种草图（2026-10-18 用户定：位次 2）
  const img3 = `https://www.makimoohome.com/images/products/${asin}/3.webp`; // 填充物图（位次 3）
  const descHtml = bullets(line, s).map((p) => `<p>${p}</p>`).join('');
  const seoDesc = `Set of 2 ${s.name.toLowerCase()} bed pillows (${s.inch}) with ${line.fill.toLowerCase()} fill and a smooth 100% cotton cover. Machine washable.`;
  const base = [
    sku, // Title（标题用 SKU，同 percale 惯例）
    sku, // URL handle
    descHtml, // Description
    'Makimoo', // Vendor
    'Home & Garden > Linens & Bedding > Pillows', // Product category
    'Pillows', // Type
    line.tags, // Tags
    'TRUE', // Published on online store
    'Active', // Status
    sku, // SKU
    '', // Variant Barcodes
    'Title', 'Default Title', '', // Option1
    '', '', '', // Option2
    '', '', '', // Option3
    line.prices[s.key], '', '', 'TRUE', '', // Price / Compare-at / Cost / Charge tax / Tax code
    '', '', '', '', // Unit price
    'shopify', '100', 'DENY', // Inventory
    String(line.grams[s.key]), 'g', 'TRUE', 'manual', // Weight / shipping
    ...(withImg ? [img1, '1', readableTitle, img1] : ['', '', '', '']), // Images
    'FALSE', // Gift card
    readableTitle, seoDesc, // SEO
    '', // Color metafield 留空（metaobject 引用，纯文本会校验失败，同 percale 惯例）
    '', '', '', '', '', '', 'New', 'FALSE', // Google Shopping
    '', '', '', '', '', // Custom labels
    '', '', '', '', // Packed dims
  ];
  const out = [base.map(q).join(',')];
  if (withImg) {
    // 第二/三行：同 handle 追加图（Shopify 多图导入惯例，其余列留空）
    const r2 = new Array(HEADER.length).fill('');
    r2[0] = sku; r2[1] = sku;
    r2[37] = img2; r2[38] = '2';
    r2[39] = `${line.label} styled on a relaxed bed`; // 种草图
    const r3 = new Array(HEADER.length).fill('');
    r3[0] = sku; r3[1] = sku;
    r3[37] = img3; r3[38] = '3';
    r3[39] = `${line.label} filling (${line.fill})`; // 填充物图
    out.push(r2.map(q).join(','), r3.map(q).join(','));
  }
  return out;
}

const rowsA = [], rowsB = [];
for (const line of LINES) {
  for (const s of SIZES) {
    rowsA.push(...rows(line, s, true));
    rowsB.push(...rows(line, s, false));
  }
}

const out = 'C:/Users/12021/Desktop/makimoo-down-pillows-6.csv';
try {
  fs.writeFileSync(out, '﻿' + HEADER.map(q).join(',') + '\r\n' + rowsA.join('\r\n') + '\r\n', 'utf8');
  console.log(`已生成 ${out}（${rowsA.length} 行 = 6 产品 × 3 图，带图片 URL）`);
} catch (e) {
  console.warn(`跳过 ${out}：${e.code || e.message}（如在 Excel 中打开请先关闭）`);
}
const outB = 'C:/Users/12021/Desktop/makimoo-down-pillows-6-noimg.csv';
fs.writeFileSync(outB, HEADER.map(q).join(',') + '\r\n' + rowsB.join('\r\n') + '\r\n', 'utf8');
console.log(`已生成 ${outB}（${rowsB.length} 行，无 BOM 无图片）`);
