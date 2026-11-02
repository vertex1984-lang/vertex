/**
 * _fetch-supply-images-20261101.js — 一次性（2026-11-01 用户定）：
 * 读取 xlsx Sheet「按变体组（全部SKU）」N 列（14，供应链产品图）的 alicdn 图片链接，
 * 下载到 C:/Users/12021/Desktop/供应链产品图/（文件名 = ASIN，新增行用新sku），
 * 并在 N 列后插入一新列 O「供应链产品图（本地）」，把下载的图片嵌入对应行。
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');
const ExcelJS = require('exceljs');

const XLSX = 'C:/Users/12021/Desktop/bedding-sku表.xlsx';
const OUT_DIR = 'C:/Users/12021/Desktop/供应链产品图';

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(XLSX);
  const ws = wb.getWorksheet('按变体组（全部SKU）');

  // 1) 收集链接
  const jobs = []; // {row, url, name}
  for (let r = 2; r <= ws.rowCount; r++) {
    const v = ws.getCell(r, 14).value;
    if (!v) continue;
    const url = typeof v === 'string' ? v : v.hyperlink || v.text || '';
    if (!/^https?:\/\//.test(url)) continue;
    const asin = String(ws.getCell(r, 4).value || '').trim();
    const newSku = String(ws.getCell(r, 6).value || '').trim();
    const name = (asin && asin !== '删除' && asin !== '新增' ? asin : newSku || `row${r}`)
      .replace(/[\\/:*?"<>|]/g, '_');
    jobs.push({ row: r, url, name });
  }
  console.log(`共 ${jobs.length} 个链接`);

  // 2) 下载
  const ok = [], fail = [];
  for (const j of jobs) {
    const file = path.join(OUT_DIR, j.name + '.jpg');
    try {
      if (!fs.existsSync(file) || fs.statSync(file).size < 5000) {
        execFileSync('curl', [
          '-sL', '--fail', '--max-time', '40',
          '-H', 'Referer: https://detail.1688.com/',
          '-H', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          '-o', file, j.url,
        ], { stdio: ['ignore', 'ignore', 'pipe'] });
      }
      if (!fs.existsSync(file) || fs.statSync(file).size < 1000) throw new Error('下载为空');
      ok.push({ ...j, file });
    } catch (e) {
      fail.push({ ...j, err: e.message });
    }
  }
  console.log(`下载成功 ${ok.length}，失败 ${fail.length}`);
  if (fail.length) console.log('失败:', fail.map((f) => `${f.row}:${f.url}`).join('\n'));

  // 3) 在 N 列（14）后插入新列 O（15）
  ws.spliceColumns(15, 0, []);
  ws.getCell(1, 15).value = '供应链产品图（本地）';
  ws.getCell(1, 15).font = { bold: true };
  ws.getColumn(15).width = 16;

  // 4) 嵌入图片（高度 115px，保持宽高比）
  let embedded = 0;
  for (const j of ok) {
    try {
      const meta = await sharp(j.file).metadata();
      const h = 115;
      const w = Math.max(1, Math.round((meta.width / meta.height) * h));
      const buf = await sharp(j.file).resize({ height: h }).jpeg({ quality: 80 }).toBuffer();
      const imgId = wb.addImage({ buffer: buf, extension: 'jpeg' });
      ws.addImage(imgId, {
        tl: { col: 14.2, row: j.row - 1 + 0.06 },
        ext: { width: w, height: h },
      });
      embedded++;
    } catch (e) {
      console.log(`嵌入失败 row${j.row}: ${e.message}`);
    }
  }
  console.log(`嵌入 ${embedded} 张`);

  await wb.xlsx.writeFile(XLSX);
  console.log('已保存：' + XLSX);
})();
