/**
 * _fill-blanket-tab-20261102.js — 回填 bedding-sku表.xlsx「Blanket」tab（2026-11-02）
 * 输入：scripts/_shots/planned-blankets-20261102.json（由 _create-planned-blankets-20261102.js 导出）
 * 匹配键：供应链 offer（L 列）+ 供应链型号名（N 列，去空白/【】/（））+ 毯子尺寸（P 列）
 * 回填列：E ASIN / F 状态(规划新增) / H 新sku / I 类型 / J 标题 / K URL / O 布料
 * 其余列（缩略图、颜色、尺寸、供应链链接/图/型号名、数量、重量）保持原样不动。
 * 注意：写入前请先关闭 Excel（否则 EBUSY）。
 */
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const ROOT = path.join(__dirname, '..');
const XLSX = 'C:/Users/12021/Desktop/bedding-sku表.xlsx';
const URL_BASE = 'https://www.makimoohome.com/products/';

const norm = (s) =>
  String(s == null ? '' : s)
    .replace(/\s+/g, '')
    .replace(/【[^】]*】/g, '')
    .replace(/（[^）]*）/g, '')
    .replace(/\([^)]*\)/g, '');

(async () => {
  const rows = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/_shots/planned-blankets-20261102.json'), 'utf8'));
  const lookup = new Map(rows.map((r) => [`${r.offer}|${norm(r.zhKey)}|${r.size}`, r]));

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(XLSX);
  const ws = wb.getWorksheet('Blanket');
  if (!ws) { console.error('找不到 Blanket tab'); process.exit(1); }

  let filled = 0;
  const unmatched = [];
  ws.eachRow((row, n) => {
    if (n === 1) return;
    const lv = row.getCell(12).value;
    const lText = typeof lv === 'object' && lv !== null ? (lv.hyperlink || lv.text || '') : String(lv || '');
    const offer = (String(lText).match(/offer\/(\d+)/) || [])[1] || '';
    const zhKey = norm(row.getCell(14).value);
    const size = norm(row.getCell(16).value);
    if (!offer && !zhKey && !size) return; // 空行
    const hit = lookup.get(`${offer}|${zhKey}|${size}`);
    if (!hit) { unmatched.push(`行${n}: ${offer}|${zhKey}|${size}`); return; }
    row.getCell(5).value = hit.asin;                       // E ASIN
    row.getCell(6).value = '规划新增';                      // F 状态
    row.getCell(8).value = hit.sku;                        // H 新sku
    row.getCell(9).value = '毯子 Blankets';                 // I 类型
    row.getCell(10).value = hit.title;                     // J 标题
    row.getCell(11).value = `${URL_BASE}${hit.handle}/`;   // K URL
    row.getCell(15).value = hit.material;                  // O 布料
    filled++;
  });

  if (unmatched.length) {
    console.error(`有 ${unmatched.length} 行未匹配，未写入：`);
    unmatched.forEach((x) => console.error('  ' + x));
    process.exit(1);
  }
  await wb.xlsx.writeFile(XLSX);
  console.log(`Blanket tab 回填完成：${filled} 行（ASIN/状态/新sku/类型/标题/URL/布料）`);
})().catch((e) => {
  if (String(e).includes('EBUSY')) console.error('文件被占用：请先关闭 Excel（关闭时选"不保存"）再重跑');
  else console.error('失败:', e);
  process.exit(1);
});
