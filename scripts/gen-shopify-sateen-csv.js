/**
 * gen-shopify-sateen-csv.js — 生成 Cotton Sateen（贡缎棉）四件套 Shopify 批量导入 CSV（2026-10-18）
 * 24 个独立产品（6 色 × 4 尺寸），与 add-sateen-4pcs.js 的 ASIN/SKU 口径一致：
 *   SKU = sateen-<color>-<size>（Shopify 侧靠 SKU 与本地 materials-map 兜底关联）
 * 定价为用户定 $59.99 全尺寸——导入前必须等用户给实价再改；
 * 重量按四件套估算：twin 1.3 / full 1.5 / queen 1.65 / king 1.85 kg（比 percale 三件套多一床笠）。
 * 图片引用线上 URL：https://www.makimoohome.com/images/products/SATEEN4-<COLOR>-<SIZE>/1.webp
 *   ——注意：图片需先部署到线上 Shopify 才能拉到，先推送网站再导入（或先用 -noimg 版建品）
 * 输出：C:/Users/12021/Desktop/makimoo-sateen-24.csv（+ -noimg 备份版）
 * 用法: node scripts/gen-shopify-sateen-csv.js
 */
const fs = require('fs');

const COLORS = [
  { slug: 'cream', name: 'Cream White' },
  { slug: 'beige', name: 'Soft Beige' },
  { slug: 'mustard', name: 'Mustard Yellow' },
  { slug: 'taupe', name: 'Taupe' },
  { slug: 'terracotta', name: 'Terracotta' },
  { slug: 'olive', name: 'Olive Green' },
];
const SIZES = [
  { key: 'twin', name: 'Twin', duvet: '68" x 88"', sheet: '39" x 75"', pc: '20" x 26"', price: '59.99', grams: 1300 },
  { key: 'full', name: 'Full', duvet: '80" x 88"', sheet: '54" x 75"', pc: '20" x 26"', price: '59.99', grams: 1500 },
  { key: 'queen', name: 'Queen', duvet: '88" x 88"', sheet: '60" x 80"', pc: '20" x 30"', price: '59.99', grams: 1650 },
  { key: 'king', name: 'King', duvet: '104" x 90"', sheet: '78" x 80"', pc: '20" x 36"', price: '59.99', grams: 1850 },
];

const bullets = (colorName, s) => [
  'Silky 100% Cotton Sateen: Woven in a fine sateen weave, this bedding set has a smooth, lustrous surface with a subtle sheen—buttery-soft against the skin, with an elegant drape that brings quiet, hotel-level luxury to the bedroom.',
  `Complete ${s.name} 4-Piece Set: This bedding set includes 1 duvet cover (${s.duvet}), 1 fitted sheet (${s.sheet}), and 2 pillowcases (${s.pc}), giving you everything you need for a coordinated, polished bed.`,
  'Secure Zipper Closure & Corner Ties: The hidden zipper design keeps your comforter neatly tucked in, while interior corner ties help prevent shifting and bunching for a smooth, tidy bed every night.',
  'Gentle Sheen & Easy Care: The breathable sateen weave stays silky and comfortable year-round, machine washes easily, and gets softer with every wash while keeping its subtle luster.',
  `Muted Healing Tone: The soft ${colorName} shade brings a calm, cozy feel to the bedroom and blends effortlessly with modern, classic, or neutral décor.`,
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

function row(c, s, withImg) {
  const sku = `sateen-${c.slug}-${s.key}`;
  const asin = `SATEEN4-${c.slug.toUpperCase()}-${s.key.toUpperCase()}`;
  const readableTitle = `Makimoo ${s.name} Bedding Set 4 Piece 100% Cotton Sateen (${c.name})`;
  const imgUrl = `https://www.makimoohome.com/images/products/${asin}/1.webp`;
  const descHtml = bullets(c.name, s).map((p) => `<p>${p}</p>`).join('');
  const seoDesc = `${s.name} 4-piece bedding set in muted ${c.name}. Silky 100% cotton sateen with subtle sheen, hidden zipper & corner ties. Machine washable.`;
  return [
    sku, // Title（标题用 SKU，同 percale/duvset 惯例）
    sku, // URL handle
    descHtml, // Description
    'Makimoo', // Vendor
    'Home & Garden > Linens & Bedding > Bedding', // Product category
    'Bedding', // Type
    `Bedding, Bedding Set, Cotton Sateen, ${c.name}`, // Tags
    'TRUE', // Published on online store
    'Active', // Status
    sku, // SKU
    '', // Variant Barcodes
    'Title', 'Default Title', '', // Option1
    '', '', '', // Option2
    '', '', '', // Option3
    s.price, '', '', 'TRUE', '', // Price / Compare-at / Cost / Charge tax / Tax code
    '', '', '', '', // Unit price
    'shopify', '100', 'DENY', // Inventory
    String(s.grams), 'g', 'TRUE', 'manual', // Weight / shipping
    ...(withImg ? [imgUrl, '1', readableTitle, imgUrl] : ['', '', '', '']), // Images
    'FALSE', // Gift card
    readableTitle, seoDesc, // SEO
    '', // Color metafield 留空（该列是 metaobject 引用，纯文本会校验失败，同 percale 惯例）
    '', '', '', '', '', '', 'New', 'FALSE', // Google Shopping
    '', '', '', '', '', // Custom labels
    '', '', '', '', // Packed dims
  ].map(q).join(',');
}

const rowsA = [], rowsB = [];
for (const c of COLORS) {
  for (const s of SIZES) {
    rowsA.push(row(c, s, true));
    rowsB.push(row(c, s, false));
  }
}

const out = 'C:/Users/12021/Desktop/makimoo-sateen-24.csv';
try {
  fs.writeFileSync(out, '﻿' + HEADER.map(q).join(',') + '\r\n' + rowsA.join('\r\n') + '\r\n', 'utf8');
  console.log(`已生成 ${out}（${rowsA.length} 行，带图片 URL）`);
} catch (e) {
  console.warn(`跳过 ${out}：${e.code || e.message}（如在 Excel 中打开请先关闭）`);
}
const outB = 'C:/Users/12021/Desktop/makimoo-sateen-24-noimg.csv';
fs.writeFileSync(outB, HEADER.map(q).join(',') + '\r\n' + rowsB.join('\r\n') + '\r\n', 'utf8');
console.log(`已生成 ${outB}（${rowsB.length} 行，无 BOM 无图片）`);
