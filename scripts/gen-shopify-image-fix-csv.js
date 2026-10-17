/**
 * gen-shopify-image-fix-csv.js — 补图专用 CSV（2026-10-17）
 * 背景：DUVSET 16 个 + PERCALE 24 个产品导入 Shopify 时图片 URL 尚未上线，图片全部缺失；
 * 现图片已部署（makimoohome.com 200）。Shopify CSV 导入只更新出现的列，未出现的列不动——
 * 因此本 CSV 只含 Handle/Title/图片列，价格、库存、描述等一律不受影响。
 * 导入时在 Shopify 勾选「Overwrite existing products that have the same handle」。
 * 输出：C:/Users/12021/Desktop/makimoo-image-fix-40.csv
 * 用法: node scripts/gen-shopify-image-fix-csv.js
 */
const fs = require('fs');

const FAMILIES = [
  { prefix: 'DUVSET', skuPrefix: 'duvset', colors: ['beanred', 'butter', 'dill', 'oat'] },
  { prefix: 'PERCALE', skuPrefix: 'percale', colors: ['sky', 'mist', 'coconut', 'nude', 'euca', 'lavender'] },
];
const SIZES = ['twin', 'full', 'queen', 'king'];

const HEADER = [
  'Handle', 'Title', 'Product image URL', 'Image position', 'Image alt text', 'Variant image URL',
];

const q = (v) => {
  const s = String(v ?? '');
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

const rows = [];
for (const f of FAMILIES) {
  for (const c of f.colors) {
    for (const s of SIZES) {
      const sku = `${f.skuPrefix}-${c}-${s}`;
      const asin = `${f.prefix}-${c.toUpperCase()}-${s.toUpperCase()}`;
      const imgUrl = `https://www.makimoohome.com/images/products/${asin}/1.webp`;
      rows.push([sku, sku, imgUrl, '1', sku, imgUrl].map(q).join(','));
    }
  }
}

const out = 'C:/Users/12021/Desktop/makimoo-image-fix-40.csv';
fs.writeFileSync(out, '﻿' + HEADER.map(q).join(',') + '\r\n' + rows.join('\r\n') + '\r\n', 'utf8');
console.log(`已生成 ${out}（${rows.length} 行，仅 Handle/Title/图片列，不动价格库存描述）`);
