/**
 * _merge-blanket-family-col.js — Blanket tab「对应四件套家族」列（B）按供应链家族填写并纵向合并
 * （2026-11-02 用户定：一个家族合并一格，同 _rebuild-sku-xlsx 其它 tab 的 B 列做法）。
 * 家族块 = 相同供应链 offer 的连续行；标签 = 中文家族名 + 货号 +（N 款）。
 * 单款家族（1 行）不合并，只填值。
 * 用法: node scripts/_merge-blanket-family-col.js（先关 Excel，EBUSY 会报错退出）
 */
const ExcelJS = require('exceljs');
const XLSX = 'C:/Users/12021/Desktop/bedding-sku表.xlsx';

const FAMILY_NAMES = {
  '1001674506522': '仿兔绒毯',
  '844024543701': '塔芙绒毯（带拉链）',
  '963131507942': '云杉绒杉影毯',
  '971279281151': '华夫格绒毯',
};

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(XLSX);
  const ws = wb.getWorksheet('Blanket');
  if (!ws) { console.error('找不到 Blanket tab'); process.exit(1); }

  // 按 L 列 offer 切连续块
  const offerOf = (row) => {
    const v = row.getCell(12).value;
    const text = typeof v === 'object' && v !== null ? (v.hyperlink || v.text || '') : String(v || '');
    return (String(text).match(/offer\/(\d+)/) || [])[1] || '';
  };
  const blocks = [];
  let cur = null;
  ws.eachRow((row, n) => {
    if (n === 1) return;
    const offer = offerOf(row);
    if (!offer) return;
    if (cur && cur.offer === offer && n === cur.end + 1) cur.end = n;
    else { cur = { offer, start: n, end: n }; blocks.push(cur); }
  });

  // 先解除 B 列既有合并（幂等重跑）
  for (const b of blocks) {
    try { ws.unMergeCells(`B${b.start}:B${b.end}`); } catch {}
  }
  for (const b of blocks) {
    const count = b.end - b.start + 1;
    const name = FAMILY_NAMES[b.offer] || '纤维毯';
    const cell = ws.getCell(b.start, 2);
    cell.value = `${name} ${b.offer}（${count} 款）`;
    cell.alignment = { vertical: 'middle', wrapText: true };
    cell.font = { bold: true };
    if (b.end > b.start) ws.mergeCells(`B${b.start}:B${b.end}`);
  }
  await wb.xlsx.writeFile(XLSX);
  console.log(`B 列已按家族合并：${blocks.length} 个家族块`);
  blocks.forEach((b) => console.log(`  行${b.start}-${b.end}  ${b.offer}`));
})().catch((e) => {
  if (String(e).includes('EBUSY')) console.error('文件被占用：请先关闭 Excel（关闭时选"不保存"）再重跑');
  else console.error('失败:', e);
  process.exit(1);
});
