/**
 * gen-shopify-microfiber-pillows-csv.js — Microfiber 床枕 Shopify 批量导入 CSV（2026-10-18）
 * 3 个产品（Standard/Queen/King），与 add-microfiber-pillows.js 的 ASIN/SKU 口径一致：
 *   SKU = microfiber-pillow-<size>（Shopify 侧靠 SKU 与本地 materials-map 兜底关联）
 * 每个产品 2 张图：1.webp 主图（灰底双枕平叠）+ 2.webp 填充物图，
 *   第二行同 handle 仅带 Image position 2（Shopify 多图导入惯例）。
 * 定价（2026-10-18 用户定）：std $29.99 / queen $32.99 / king $39.99；重量估值 800/950/1100 g。
 * 图片引用线上 URL：https://www.makimoohome.com/images/products/<ASIN>/<n>.webp
 *   ——注意：图片需先部署到线上 Shopify 才能拉到，先推送网站再导入（或先用 -noimg 版建品）
 * 输出：C:/Users/12021/Desktop/makimoo-microfiber-pillows-3.csv（+ -noimg 备份版）
 * 用法: node scripts/gen-shopify-microfiber-pillows-csv.js
 */
const fs = require('fs');

const SIZES = [
  { key: 'standard', name: 'Standard', inch: '20" x 26"', cm: '51 x 66 cm', price: '29.99', grams: 800 },
  { key: 'queen', name: 'Queen', inch: '20" x 30"', cm: '51 x 76 cm', price: '32.99', grams: 950 },
  { key: 'king', name: 'King', inch: '20" x 36"', cm: '51 x 91 cm', price: '39.99', grams: 1100 },
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

const bullets = (s) => [
  'Plush Microfiber Fill: Generously filled with silky microfiber clusters, these pillows deliver a soft, fluffy loft that mimics the feel of down—hypoallergenic and easy to live with.',
  'Smooth Polyester Cover: A soft, brushed-smooth polyester shell keeps the fill evenly distributed and stands up to everyday use and frequent washing.',
  `Set of 2, ${s.name} Size: Each pillow measures ${s.inch} (${s.cm}), a ready-to-pair set that outfits your bed with plush, hotel-inspired comfort.`,
  'Medium-Firm Support: The resilient fiber fill holds its shape through the night and offers steady support for back and side sleepers.',
  'Easy Machine Care: Machine wash cold on gentle and tumble dry low—the fill fluffs back up nicely, staying clean, fresh, and ready for everyday use.',
];

function rows(s, withImg) {
  const sku = `microfiber-pillow-${s.key}`;
  const asin = `MICROFIBER-PILLOW-${s.key.toUpperCase()}`;
  const readableTitle = `Makimoo ${s.name} Microfiber Bed Pillows Set of 2 Down Alternative Fill (White)`;
  const img1 = `https://www.makimoohome.com/images/products/${asin}/1.webp`;
  const img2 = `https://www.makimoohome.com/images/products/${asin}/2.webp`; // 种草图（2026-10-18 用户定：位次 2）
  const img3 = `https://www.makimoohome.com/images/products/${asin}/3.webp`; // 填充物图（位次 3）
  const descHtml = bullets(s).map((p) => `<p>${p}</p>`).join('');
  const seoDesc = `Set of 2 ${s.name.toLowerCase()} microfiber bed pillows (${s.inch}) with plush down-alternative fill and a smooth polyester cover. Machine washable.`;
  const base = [
    sku, // Title（标题用 SKU，同 percale 惯例）
    sku, // URL handle
    descHtml, // Description
    'Makimoo', // Vendor
    'Home & Garden > Linens & Bedding > Pillows', // Product category
    'Pillows', // Type
    'Pillows, Bed Pillow, Microfiber, Down Alternative', // Tags
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
    r2[39] = 'Microfiber bed pillows styled on a relaxed bed'; // 种草图
    const r3 = new Array(HEADER.length).fill('');
    r3[0] = sku; r3[1] = sku;
    r3[37] = img3; r3[38] = '3';
    r3[39] = 'Microfiber pillow filling (silky fiber clusters)'; // 填充物图
    out.push(r2.map(q).join(','), r3.map(q).join(','));
  }
  return out;
}

const rowsA = [], rowsB = [];
for (const s of SIZES) {
  rowsA.push(...rows(s, true));
  rowsB.push(...rows(s, false));
}

const out = 'C:/Users/12021/Desktop/makimoo-microfiber-pillows-3.csv';
try {
  fs.writeFileSync(out, '﻿' + HEADER.map(q).join(',') + '\r\n' + rowsA.join('\r\n') + '\r\n', 'utf8');
  console.log(`已生成 ${out}（${rowsA.length} 行 = 3 产品 × 3 图，带图片 URL）`);
} catch (e) {
  console.warn(`跳过 ${out}：${e.code || e.message}（如在 Excel 中打开请先关闭）`);
}
const outB = 'C:/Users/12021/Desktop/makimoo-microfiber-pillows-3-noimg.csv';
fs.writeFileSync(outB, HEADER.map(q).join(',') + '\r\n' + rowsB.join('\r\n') + '\r\n', 'utf8');
console.log(`已生成 ${outB}（${rowsB.length} 行，无 BOM 无图片）`);
