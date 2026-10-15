/**
 * gen-shopify-towels-csv.js — 生成 Shopify 批量导入 CSV（2026-10-16）
 * 24 个独立产品（6 色 × 4 尺寸），与 add-mk-towels.js 的 ASIN/SKU 口径一致：
 *   SKU = lsc-towel-<color>-<sizekey>（Shopify 侧靠 SKU 与本地 materials-map 兜底关联）
 * 用户要求：标题用 SKU；库存 100；Status = Active；价格 12.99/26.99/44.99/69.99。
 * 图片引用线上 URL（Vercel 部署后生效）：https://www.makimoohome.com/images/products/MK-TOWEL-LSC-<COLOR>-<SIZE>/1.webp
 * 重量按 400 g/m² × 面积估算（12x12→40g, 20x30→155g, 30x56→435g, 40x70→725g），可在 Shopify 内调整。
 * 输出：C:/Users/12021/Desktop/towel/makimoo-towels-24.csv
 * 用法: node scripts/gen-shopify-towels-csv.js
 */
const fs = require('fs');

const COLORS = [
  { slug: 'cream', name: 'Cream' },
  { slug: 'oatmeal', name: 'Oatmeal' },
  { slug: 'sage', name: 'Sage' },
  { slug: 'dustyrose', name: 'Dusty Rose' },
  { slug: 'lightgrey', name: 'Light Grey' },
  { slug: 'dustyblue', name: 'Dusty Blue' },
];
const SIZES = [
  { key: '12x12', asin: '12X12', inch: '12" x 12"', type: 'washcloth', Type: 'Washcloth', price: '12.99', grams: 40 },
  { key: '20x30', asin: '20X30', inch: '20" x 30"', type: 'hand towel', Type: 'Hand Towel', price: '26.99', grams: 155 },
  { key: '30x56', asin: '30X56', inch: '30" x 56"', type: 'bath towel', Type: 'Bath Towel', price: '44.99', grams: 435 },
  { key: '40x70', asin: '40X70', inch: '40" x 70"', type: 'bath sheet', Type: 'Bath Sheet', price: '69.99', grams: 725 },
];

const bullets = (colorName, s) => [
  `One ${s.Type} Per Pack: This listing includes one ${s.inch} ${s.type} in ${colorName} — a single towel, not a multi-piece set.`,
  'Long-Staple Cotton Terry: Woven from long-staple cotton, the plush looped terry feels soft against the skin and soaks up water quickly.',
  'Substantial 400 g/m² Weave: The dense 400 grams-per-square-meter terry gives the towel a plush, hotel-like hand feel.',
  `Muted Ins-Style Color: A low-saturation ${colorName} tone that layers easily with white, cream and natural bathroom decor.`,
  'Easy Care: Machine washable and tumble dry low; the terry gets softer with every wash. Wash before first use.',
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

const rows = [];
for (const c of COLORS) {
  for (const s of SIZES) {
    const sku = `lsc-towel-${c.slug}-${s.key}`;
    const asin = `MK-TOWEL-LSC-${c.slug.toUpperCase()}-${s.asin}`;
    const readableTitle = `Makimoo Long-Staple Cotton Towel ${s.inch} (${c.name})`;
    const imgUrl = `https://www.makimoohome.com/images/products/${asin}/1.webp`;
    const descHtml = bullets(c.name, s).map((p) => `<p>${p}</p>`).join('');
    const seoDesc = `One ${s.inch} ${s.type} in ${c.name}. Long-staple cotton terry, 400 g/m², soft and absorbent. Machine washable.`;
    rows.push([
      sku, // Title（用户要求：标题用 SKU）
      sku, // URL handle
      descHtml, // Description
      'Makimoo', // Vendor
      'Home & Garden > Linens & Bedding > Towels', // Product category
      'Towels', // Type
      `Towels, Long-Staple Cotton, ${c.name}`, // Tags
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
      imgUrl, '1', readableTitle, imgUrl, // Images
      'FALSE', // Gift card
      readableTitle, seoDesc, // SEO
      c.name.toLowerCase(), // Color metafield
      '', '', '', '', '', '', 'New', 'FALSE', // Google Shopping
      '', '', '', '', '', // Custom labels
      '', '', '', '', // Packed dims
    ].map(q).join(','));
  }
}

const out = 'C:/Users/12021/Desktop/towel/makimoo-towels-24.csv';
fs.writeFileSync(out, '﻿' + HEADER.map(q).join(',') + '\r\n' + rows.join('\r\n') + '\r\n', 'utf8');
console.log(`已生成 ${out}（${rows.length} 行）`);
