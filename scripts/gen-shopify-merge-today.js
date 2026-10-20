/**
 * gen-shopify-merge-today.js — 合并今日新增产品的 Shopify CSV（2026-10-19 用户定：合并成一个一起上传）
 * 范围：贡缎四件套 24 + 针织毯 4 + down 枕头 6 + microfiber 枕头 3 = 37 行
 * 来源：桌面上已生成的四份带图 CSV（表头一致，61 列）
 * 顺序：sateen → knit-throw → down → microfiber
 * 注意：价格以各来源 CSV 为准——sateen / knit-throw 为占位价，用户给实价后重跑对应生成脚本再重跑本脚本
 * 输出：C:/Users/12021/Desktop/makimoo-new-37.csv（带 BOM + CRLF）
 * 用法: node scripts/gen-shopify-merge-today.js
 */
const fs = require('fs');

const DESKTOP = 'C:/Users/12021/Desktop';
const SOURCES = [
  'makimoo-sateen-24.csv',
  'makimoo-knit-throw-4.csv',
  'makimoo-down-pillows-6.csv',
  'makimoo-microfiber-pillows-3.csv',
];

let header = null;
const rows = [];
for (const name of SOURCES) {
  const p = `${DESKTOP}/${name}`;
  if (!fs.existsSync(p)) { console.error(`缺来源文件: ${p}（先生成对应 CSV）`); process.exit(1); }
  const text = fs.readFileSync(p, 'utf8').replace(/^﻿/, '');
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const h = lines[0];
  if (!header) header = h;
  else if (h !== header) { console.error(`表头不一致: ${name}`); process.exit(1); }
  rows.push(...lines.slice(1));
  console.log(`${name}: ${lines.length - 1} 行`);
}

const out = `${DESKTOP}/makimoo-new-37.csv`;
try {
  fs.writeFileSync(out, '﻿' + header + '\r\n' + rows.join('\r\n') + '\r\n', 'utf8');
  console.log(`已生成 ${out}（共 ${rows.length} 行）`);
} catch (e) {
  console.warn(`写入失败：${e.code || e.message}（如在 Excel 中打开请先关闭）`);
  process.exit(1);
}
