/**
 * gen-shopify-blanket2-csv.js — 北欧镂空针织毯 Shopify 批量导入 CSV（2026-10-19）
 * 4 个独立产品（4 色 × 单尺寸），与 add-blanket2-knit-throw.js 的 ASIN/SKU 口径一致：
 *   SKU = knit-throw-<color>（Shopify 侧靠 SKU 与本地 materials-map 兜底关联）
 * 定价为占位 $24.99——导入前等用户给实价再改；重量 510g（1688 页面包装重量）。
 * 图片引用线上 URL：https://www.makimoohome.com/images/products/KNITTHROW-<COLOR>/1.webp
 *   ——注意：图片需先部署到线上 Shopify 才能拉到，先推送网站再导入（或先用 -noimg 版建品）
 * 输出：C:/Users/12021/Desktop/makimoo-knit-throw-4.csv（+ -noimg 备份版）
 * 用法: node scripts/gen-shopify-blanket2-csv.js
 */
const fs = require('fs');

const COLORS = [
  { slug: 'cream', name: 'Cream White' },
  { slug: 'grey', name: 'Light Grey' },
  { slug: 'khaki', name: 'Khaki' },
  { slug: 'pink', name: 'Dusty Pink' },
];
const PRICE = '29.99'; // 2026-10-19 用户定
const GRAMS = 510; // 1688 页面包装重量

const bullets = (colorName) => [
  'Openwork Knit Design: Alternating slim ribbed bands and wide herringbone openwork stripes give this throw its airy, handcrafted look—delicate to the eye, yet knitted to hold its shape through everyday use.',
  'Soft & Lightweight Acrylic: Woven from soft acrylic yarn (500-799g), this blanket feels gentle and cozy without weighing you down—comfortable across all four seasons, from summer naps to winter layering.',
  'Generous Size with Tassels: Measuring 50" x 71" (127 x 180 cm) including the tassel fringe, it drapes beautifully over a sofa arm, across the foot of a bed, or around your shoulders on a cool evening.',
  `Versatile Nordic Accent: The quiet ${colorName} tone and textured stripes blend effortlessly with modern, farmhouse, or neutral décor—use it as a couch throw, bed-end runner, nap blanket, or reading companion.`,
  'Easy Everyday Care: Machine washable on a gentle cycle; the knit keeps its texture and color wash after wash, and the tassels stay neat with a quick reshape while damp.',
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

function row(c, withImg) {
  const sku = `knit-throw-${c.slug}`;
  const asin = `KNITTHROW-${c.slug.toUpperCase()}`;
  const readableTitle = `Makimoo Openwork Knit Throw Blanket with Tassels 50 x 71 in (${c.name})`;
  const imgUrl = `https://www.makimoohome.com/images/products/${asin}/1.webp`;
  const descHtml = bullets(c.name).map((p) => `<p>${p}</p>`).join('');
  const seoDesc = `Openwork knit throw blanket in ${c.name}, 50 x 71 in with tassels. Soft lightweight acrylic, Nordic striped texture. Machine washable.`;
  return [
    sku, // Title（标题用 SKU，同 sateen/percale 惯例）
    sku, // URL handle
    descHtml, // Description
    'Makimoo', // Vendor
    'Home & Garden > Linens & Bedding > Blankets & Throws', // Product category
    'Blankets', // Type
    `Blankets, Throw Blanket, Knit, Acrylic, ${c.name}`, // Tags
    'TRUE', // Published on online store
    'Active', // Status
    sku, // SKU
    '', // Variant Barcodes
    'Title', 'Default Title', '', // Option1
    '', '', '', // Option2
    '', '', '', // Option3
    PRICE, '', '', 'TRUE', '', // Price / Compare-at / Cost / Charge tax / Tax code
    '', '', '', '', // Unit price
    'shopify', '100', 'DENY', // Inventory
    String(GRAMS), 'g', 'TRUE', 'manual', // Weight / shipping
    ...(withImg ? [imgUrl, '1', readableTitle, imgUrl] : ['', '', '', '']), // Images
    'FALSE', // Gift card
    readableTitle, seoDesc, // SEO
    '', // Color metafield 留空（该列是 metaobject 引用，纯文本会校验失败，同 sateen 惯例）
    '', '', '', '', '', '', 'New', 'FALSE', // Google Shopping
    '', '', '', '', '', // Custom labels
    '', '', '', '', // Packed dims
  ].map(q).join(',');
}

const rowsA = COLORS.map((c) => row(c, true));
const rowsB = COLORS.map((c) => row(c, false));

const out = 'C:/Users/12021/Desktop/makimoo-knit-throw-4.csv';
try {
  fs.writeFileSync(out, '﻿' + HEADER.map(q).join(',') + '\r\n' + rowsA.join('\r\n') + '\r\n', 'utf8');
  console.log(`已生成 ${out}（${rowsA.length} 行，带图片 URL）`);
} catch (e) {
  console.warn(`跳过 ${out}：${e.code || e.message}（如在 Excel 中打开请先关闭）`);
}
const outB = 'C:/Users/12021/Desktop/makimoo-knit-throw-4-noimg.csv';
fs.writeFileSync(outB, HEADER.map(q).join(',') + '\r\n' + rowsB.join('\r\n') + '\r\n', 'utf8');
console.log(`已生成 ${outB}（${rowsB.length} 行，无 BOM 无图片）`);
