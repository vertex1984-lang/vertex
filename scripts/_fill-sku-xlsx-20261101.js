/**
 * _fill-sku-xlsx-20261101.js — 一次性：回填用户 xlsx（2026-11-01）
 * 1) Sheet「按变体组（全部SKU）」第 6 列（新sku）中标记「改为随机数字+字母sku」的行 → 写入已生成的随机 SKU
 * 2) 第 16–23 列（床单/床笠/被套/枕套 尺寸+数量）按产品类型与尺寸档位回填
 *    规格（2026-11-01 用户定）：
 *    被套 180×220 / 200×230 / 220×240 / 264×229 cm（Twin/Full/Queen/King）
 *    床笠 39×75+15″ / 54×75+15″ / 60×80+15″ / 76×80+15″
 *    床单 66×96″ / 80×96″ / 90×102″ / 108×102″
 *    枕套统一 20×30″；Twin 配 1 个、其余尺寸配 2 个
 * 删除行不回填；新增行按 Queen 四件套回填。
 */
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const ROOT = path.join(__dirname, '..');
const XLSX = 'C:/Users/12021/Desktop/bedding-sku表.xlsx';
const randomMap = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'scripts/_shots/random-skus-20261101.json'), 'utf-8')
);

const DUV = { Twin: '180×220 cm', Full: '200×230 cm', Queen: '220×240 cm', King: '264×229 cm' };
const FIT = { Twin: '39×75+15″', Full: '54×75+15″', Queen: '60×80+15″', King: '76×80+15″' };
const FLAT = { Twin: '66×96″', Full: '80×96″', Queen: '90×102″', King: '108×102″' };
const PC_SIZE = '20×30″';

function tierOf(sizeText, asinText) {
  const s = `${sizeText} ${asinText}`.toLowerCase();
  const m = s.match(/\b(twin|full|queen|king)\b/);
  if (m) return m[1].charAt(0).toUpperCase() + m[1].slice(1);
  const cm = s.match(/(\d{3})\s*x\s*\d{3}/);
  if (cm) {
    const w = Number(cm[1]);
    if (w <= 180) return 'Twin';
    if (w <= 210) return 'Full';
    if (w <= 240) return 'Queen';
    return 'King';
  }
  return 'Queen'; // 无尺寸信息（独立被套/床笠/枕套单件）默认 Queen
}

function specCells(kind, tier) {
  const blank = { flatS: '—', flatN: 0, fitS: '—', fitN: 0, duvS: '—', duvN: 0, pcS: '—', pcN: 0 };
  const pcN = tier === 'Twin' ? 1 : 2;
  switch (kind) {
    case 'four':
      return { ...blank, fitS: FIT[tier], fitN: 1, duvS: DUV[tier], duvN: 1, pcS: PC_SIZE, pcN };
    case 'sheetset':
      return { ...blank, flatS: FLAT[tier], flatN: 1, fitS: FIT[tier], fitN: 1, pcS: PC_SIZE, pcN: 2 };
    case 'duvetset':
      return { ...blank, duvS: DUV[tier], duvN: 1, pcS: PC_SIZE, pcN: 2 };
    case 'duvet':
      return { ...blank, duvS: DUV[tier], duvN: 1 };
    case 'sheet':
      return { ...blank, fitS: FIT[tier], fitN: 1 };
    case 'pillowcase':
      return { ...blank, pcS: PC_SIZE, pcN: 2 };
    default:
      return blank;
  }
}

function kindOf(typeText, asinText) {
  const t = `${typeText} ${asinText}`.toLowerCase();
  if (t.includes('sheet set') && !t.includes('duvet')) return 'sheetset';
  if (t.includes('duvet cover set')) return 'duvetset';
  if (t.includes('duvet cover') || /-duvet\b/.test(t)) return 'duvet';
  if (t.includes('fitted sheet') || /-sheet\b/.test(t)) return 'sheet';
  if (t.includes('pillowcase') || /-pc(-|$)/.test(t)) return 'pillowcase';
  if (t.includes('sheets & duvet set')) return 'four';
  return 'four'; // 兜底按四件套
}

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(XLSX);
  const ws = wb.getWorksheet('按变体组（全部SKU）');

  let skuFilled = 0, specFilled = 0, skippedDeleted = 0;
  for (let r = 2; r <= ws.rowCount; r++) {
    const cell = (c) => {
      const v = ws.getCell(r, c).value;
      return v == null ? '' : String(v);
    };
    const asin = cell(4).trim();
    if (!asin) continue;
    if (asin === '删除') { skippedDeleted++; continue; }

    // 1) 随机 SKU 回填
    if (cell(6).includes('改为随机数字+字母sku')) {
      const gen = randomMap[asin.toLowerCase()];
      if (gen) { ws.getCell(r, 6).value = gen; skuFilled++; }
    }

    // 2) 规格列回填（16-23）
    const kind = kindOf(cell(7), asin);
    const tier = tierOf(cell(9), `${cell(8)} ${asin}`);
    const s = specCells(kind, tier);
    ws.getCell(r, 16).value = s.flatS;
    ws.getCell(r, 17).value = s.flatN;
    ws.getCell(r, 18).value = s.fitS;
    ws.getCell(r, 19).value = s.fitN;
    ws.getCell(r, 20).value = s.duvS;
    ws.getCell(r, 21).value = s.duvN;
    ws.getCell(r, 22).value = s.pcS;
    ws.getCell(r, 23).value = s.pcN;
    specFilled++;
  }

  const imgCount = ws.getImages().length;
  await wb.xlsx.writeFile(XLSX);
  console.log(`随机 SKU 回填 ${skuFilled} 行；规格列回填 ${specFilled} 行；跳过删除行 ${skippedDeleted}；图片保留 ${imgCount} 张`);
})();
