/**
 * 导出 bedding 类目"网站上实际展示"的产品 SKU 对照表（xlsx 嵌缩略图）。
 * 展示口径 = 列表页卡片口径：
 *  - classifySet 命中的套装家族：每家族取代表 SKU（优先 Queen，否则按 Twin→Full→Queen→King 首个）
 *  - 未命中（未分类）产品：按变体族"同款同色"去重后各保留一张卡
 * 只读数据源，不修改任何站点文件。输出到桌面 bedding-sku表.xlsx
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const ExcelJS = require('exceljs');

const ROOT = path.resolve(__dirname, '..');
const OUT = 'C:/Users/12021/Desktop/bedding-sku表.xlsx';

const products = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'scripts/_shots/bedding-products.json'), 'utf8')
);

/* ---------- 解析 materials-map.ts（title / sku） ---------- */
const mmSrc = fs.readFileSync(path.join(ROOT, 'src/data/materials-map.ts'), 'utf8');
const entryRe = /\n  "([^"]+)": \{"title":"/g;
const entries = [];
let em;
while ((em = entryRe.exec(mmSrc))) entries.push({ key: em[1], start: em.index });
const mmMap = {}; // asin(lower) -> {title, sku}
for (let i = 0; i < entries.length; i++) {
  const start = entries[i].start;
  const end = i + 1 < entries.length ? entries[i + 1].start : mmSrc.length;
  const body = mmSrc.slice(start, end);
  const t = body.match(/"title":"((?:\\.|[^"\\])*)"/);
  const s = body.match(/"sku":"((?:\\.|[^"\\])*)"/);
  const un = (x) => { try { return JSON.parse('"' + x + '"'); } catch { return x; } };
  mmMap[entries[i].key.toLowerCase()] = {
    title: t ? un(t[1]) : '',
    sku: s ? un(s[1]) : '',
  };
}

/* ---------- 解析 variant-groups.ts（asin → 族 id + 颜色） ---------- */
const vgSrc = fs.readFileSync(path.join(ROOT, 'src/data/variant-groups.ts'), 'utf8');
const asinToGroup = {};
{
  const re = /id:\s*'([^']+)'[\s\S]*?members:\s*\[([\s\S]*?)\n    \]/g;
  let m;
  while ((m = re.exec(vgSrc))) {
    const gid = m[1];
    const mre = /\{\s*asin:\s*'([^']+)'([^}]*)\}/g;
    let mm2;
    while ((mm2 = mre.exec(m[2]))) {
      const body = mm2[2];
      const color = (body.match(/color:\s*'([^']*)'/) || [])[1] || '';
      const size = (body.match(/size:\s*'([^']*)'/) || [])[1] || '';
      asinToGroup[mm2[1].toLowerCase()] = { gid, color, size };
    }
  }
}

/* ---------- 移植 bedding-families.ts：classifySet / familyKeyOf / colorOf ---------- */
const SET_SIZE_ORDER = ['TWIN', 'FULL', 'QUEEN', 'KING'];
const DUVET_PREFIXES = ['1048207560416', '1061371343572'];

function classifySet(asin) {
  const a = asin.toLowerCase();
  if (/-duvet$/.test(a)) return 'duvet';
  if (/-sheet$/.test(a)) return 'sheet';
  if (/(^|-)pc(-|$)/.test(a)) return 'pillowcase';
  if (a.startsWith('bedset4-')) return 'four';
  if (a.startsWith('sateen4-')) return 'four';
  if (a.startsWith('pompom4-')) return 'four';
  if (a.startsWith('percalejac-')) return 'four';
  if (a.startsWith('percalecheck-')) return 'four';
  if (a.startsWith('percalestripe-')) return 'four';
  if (a.startsWith('percalepatch-')) return 'four';
  if (a.startsWith('washstripe-')) return 'four';
  if (a.startsWith('washjac-')) return 'four';
  if (a.startsWith('veljac-')) return 'four';
  if (a.startsWith('velstripe-')) return 'four';
  if (a.startsWith('1071466105053')) return 'four';
  if (a.startsWith('1025015219200')) return 'four';
  if (a.startsWith('mk-heart4-')) return 'four';
  if (a.startsWith('mk-print4-')) return 'four';
  if (a.startsWith('mk-floral4-')) return 'four';
  if (a.startsWith('mk-btfly4-')) return 'four';
  if (a.startsWith('sheetset-')) return 'sheetset';
  if (a.startsWith('duvetset-')) return 'duvetset';
  if (a.startsWith('bundle-')) return 'bundle';
  if (a.startsWith('duvset-') || a.startsWith('linen3-') || a.startsWith('916370884976')) return 'four';
  if (a.startsWith('percale-')) return 'four';
  if (DUVET_PREFIXES.some((p) => a.startsWith(p))) return 'four';
  return null;
}

const COLOR_LABELS = {
  DUSTYBLUE: 'Dusty Blue', OFFWHITE: 'Off White', BEANRED: 'Bean Red', BUTTER: 'Butter Yellow',
  DILL: 'Dill Green', OAT: 'Alpine Oat', SKY: 'Sky Blue', MIST: 'Mist Grey',
  COCONUT: 'Coconut Milk', NUDE: 'Nude Pink', EUCA: 'Eucalyptus', LAVENDER: 'Lavender Fog',
  CREAM: 'Cream White', BEIGE: 'Soft Beige', MUSTARD: 'Mustard Yellow', TAUPE: 'Taupe',
  TERRACOTTA: 'Terracotta', OLIVE: 'Olive Green', SWIRL: 'Caramel Swirl', VINE: 'Olive Vine',
  LEAF: 'Dusty Leaf', BLUSH: 'Blush Floral', INK: 'Ink Floral', BLOOM: 'Lilac Bloom',
  DAMASK: 'Gold Damask', HAZE: 'Dusty Blue', ROSE: 'Dusty Pink', GREY: 'Light Grey',
  OATBEIGE: 'Oatmeal Beige', PETAL: 'Blush Pink Stripe', STONE: 'Stone Grey Patchwork',
  SAGEGREEN: 'Sage Green', GINGHAM: 'Grey Gingham', HEART: 'Tan Heart', POLKA: 'Blue Polka',
  IVORY: 'Ivory White', SAND: 'Sand Beige', MOCHA: 'Sage Stripe', DENIM: 'Denim Stripe',
  CHARCOAL: 'Charcoal Stripe', HEART4: 'Tan Heart', PRINT4: 'Blue Print', FLORAL4: 'Grey Floral',
  BTFLY4: 'Mocha Butterfly',
};

function titleColorOf(asin) {
  const title = mmMap[asin.toLowerCase()]?.title || '';
  const m = title.match(/\(([^()]+)\)\s*$/);
  return m ? m[1].trim() : '';
}
function duvetColorOf(asin) {
  const g = asinToGroup[asin.toLowerCase()];
  if (g && g.color) return g.color;
  return titleColorOf(asin);
}
function familyKeyOf(asin) {
  const a = asin.toLowerCase();
  if (a.startsWith('916370884976')) return '916370884976';
  if (a.startsWith('1025015219200')) return `1025015219200::${duvetColorOf(asin)}`;
  if (a.startsWith('1071466105053')) return `1071466105053::${duvetColorOf(asin)}`;
  const dp = DUVET_PREFIXES.find((p) => a.startsWith(p));
  if (dp) return `${dp}::${duvetColorOf(asin)}`;
  const parts = asin.split('-');
  const last = parts[parts.length - 1].toUpperCase();
  return SET_SIZE_ORDER.includes(last) ? parts.slice(0, -1).join('-') : asin;
}
function colorOfKey(key, asin) {
  if (key.includes('::')) return key.split('::')[1];
  if (key === '916370884976') return titleColorOf(asin);
  const code = key.split('-')[1] || '';
  return COLOR_LABELS[code.toUpperCase()] || code.charAt(0).toUpperCase() + code.slice(1).toLowerCase();
}

const KIND_LABEL = {
  four: '四件套 Sheets & Duvet Set',
  sheetset: '床单套件 Sheet Set',
  duvetset: '被套套件 Duvet Cover Set',
  duvet: '被套 Duvet Cover',
  sheet: '床笠 Fitted Sheet',
  pillowcase: '枕套 Pillowcases',
  comforter: 'Comforter Set',
  bundle: 'Complete Bundle',
};
const KIND_ORDER = ['four', 'sheetset', 'duvetset', 'duvet', 'sheet', 'pillowcase', 'comforter', 'bundle'];

/* ---------- 计算展示集合 ---------- */
// "网站上显示"口径：out/ 下存在静态 PDP（无 PDP 的产品/家族未上线，不进表）
const hasPdp = (p) => fs.existsSync(path.join(ROOT, 'out/products', p.handle, 'index.html'));
const rows = [];
const repAsins = new Set(); // 卡面代表 SKU（列表页实际展示的那张卡）

// 1) 家族代表 SKU
const groups = new Map();
for (const p of products) {
  const kind = classifySet(p.asin);
  if (!kind) continue;
  const key = familyKeyOf(p.asin);
  const gk = kind + '::' + key;
  if (!groups.has(gk)) groups.set(gk, []);
  groups.get(gk).push(p);
}
let droppedFamilies = 0;
for (const [gk, membersAll] of groups) {
  const members = membersAll.filter(hasPdp);
  if (members.length === 0) { droppedFamilies++; continue; }
  const sorted = [...members].sort(
    (a, b) =>
      SET_SIZE_ORDER.indexOf(a.asin.split('-').pop().toUpperCase()) -
      SET_SIZE_ORDER.indexOf(b.asin.split('-').pop().toUpperCase())
  );
  const rep = sorted.find((p) => p.asin.toUpperCase().endsWith('-QUEEN')) || sorted[0];
  repAsins.add(rep.asin);
  const kind = gk.split('::')[0];
  rows.push({
    kind,
    color: colorOfKey(gk.slice(kind.length + 2), rep.asin),
    asin: rep.asin,
    handle: rep.handle,
  });
}

// 2) 未分类单品：按变体族同款同色去重
{
  const seen = new Set();
  for (const p of products) {
    if (classifySet(p.asin)) continue;
    if (!hasPdp(p)) continue;
    const g = asinToGroup[p.asin.toLowerCase()];
    const key = g ? g.gid + '::' + g.color.trim().toLowerCase() : p.asin.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    repAsins.add(p.asin);
    rows.push({
      kind: '',
      color: g ? g.color : titleColorOf(p.asin),
      asin: p.asin,
      handle: p.handle,
    });
  }
}

rows.sort((a, b) => {
  const ka = KIND_ORDER.indexOf(a.kind), kb = KIND_ORDER.indexOf(b.kind);
  const ra = ka === -1 ? 99 : ka, rb = kb === -1 ? 99 : kb;
  if (ra !== rb) return ra - rb;
  return a.asin.localeCompare(b.asin);
});

const familyRows = rows.filter((r) => r.kind).length;
console.log(
  `展示集合：${rows.length} 行（家族代表 ${familyRows} + 未分类 ${rows.length - familyRows}；` +
  `无 PDP 被剔除的家族 ${droppedFamilies} 个）`
);

/* ---------- 缩略图 ---------- */
async function thumbBuffer(asin) {
  const dir = path.join(ROOT, 'public/images/products', asin);
  const candidates = ['0-main-3x4.webp', '1-3x4.webp', '1.webp'];
  let file = null;
  for (const c of candidates) {
    const f = path.join(dir, c);
    if (fs.existsSync(f)) { file = f; break; }
  }
  if (!file && fs.existsSync(dir)) {
    const any = fs.readdirSync(dir).find((f) => f.endsWith('.webp'));
    if (any) file = path.join(dir, any);
  }
  if (!file) return null;
  return sharp(file).resize(90, 120, { fit: 'cover' }).png().toBuffer();
}

/* ---------- 写 xlsx ---------- */
(async () => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('bedding');
  ws.columns = [
    { header: '缩略图', key: 'img', width: 14 },
    { header: 'ASIN', key: 'asin', width: 26 },
    { header: '现有SKU', key: 'sku', width: 20 },
    { header: '类型', key: 'kind', width: 26 },
    { header: '颜色', key: 'color', width: 20 },
    { header: '标题', key: 'title', width: 60 },
    { header: 'URL', key: 'url', width: 60 },
  ];
  ws.getRow(1).font = { bold: true };
  ws.getRow(1).height = 20;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const ri = i + 2;
    const info = mmMap[r.asin.toLowerCase()] || { title: '', sku: '' };
    ws.getRow(ri).height = 92;
    ws.getCell(`B${ri}`).value = r.asin;
    ws.getCell(`C${ri}`).value = info.sku;
    ws.getCell(`D${ri}`).value = KIND_LABEL[r.kind] || '（未分类单品）';
    ws.getCell(`E${ri}`).value = r.color;
    ws.getCell(`F${ri}`).value = info.title;
    ws.getCell(`G${ri}`).value = `https://www.makimoohome.com/products/${r.handle}/`;
    for (const col of 'BCDEFG') {
      ws.getCell(`${col}${ri}`).alignment = { vertical: 'middle', wrapText: col === 'F' || col === 'G' };
    }
    const buf = await thumbBuffer(r.asin);
    if (buf) {
      const imgId = wb.addImage({ buffer: buf, extension: 'png' });
      ws.addImage(imgId, {
        tl: { col: 0.15, row: ri - 1 + 0.05 },
        ext: { width: 90, height: 120 },
      });
    }
  }

  /* ================= Sheet 2：按变体组展开全部 SKU ================= */
  // 尺寸展示：ASIN 尾段为尺寸（TWIN/FULL/QUEEN/KING）直接用；否则取变体组成员 cm 尺寸
  const sizeLabelOf = (asin) => {
    const last = asin.split('-').pop().toUpperCase();
    if (SET_SIZE_ORDER.includes(last)) return last.charAt(0) + last.slice(1).toLowerCase();
    return asinToGroup[asin.toLowerCase()]?.size || '';
  };
  const sizeRank = (asin) => {
    const last = asin.split('-').pop().toUpperCase();
    const i = SET_SIZE_ORDER.indexOf(last);
    return i === -1 ? 99 : i;
  };

  // 全部有 PDP 的产品按变体组归组（无组的按单品自成一组）
  const vgGroups = new Map(); // gid -> members[]
  for (const p of products) {
    if (!hasPdp(p)) continue;
    const g = asinToGroup[p.asin.toLowerCase()];
    const gid = g ? g.gid : '单品-' + p.asin;
    if (!vgGroups.has(gid)) vgGroups.set(gid, []);
    vgGroups.get(gid).push(p);
  }
  // 组内排序：颜色 → 尺寸 → ASIN；组间排序：类型 → 组内首个卡面代表（或首个成员）ASIN
  const vgList = Array.from(vgGroups.entries()).map(([gid, members]) => {
    const sorted = [...members].sort(
      (a, b) =>
        (asinToGroup[a.asin.toLowerCase()]?.color || '').localeCompare(
          asinToGroup[b.asin.toLowerCase()]?.color || ''
        ) || sizeRank(a.asin) - sizeRank(b.asin) || a.asin.localeCompare(b.asin)
    );
    const anchor = sorted.find((p) => repAsins.has(p.asin)) || sorted[0];
    return { gid, members: sorted, anchor };
  });
  const kindRank = (asin) => {
    const k = classifySet(asin);
    const i = k ? KIND_ORDER.indexOf(k) : -1;
    return i === -1 ? 99 : i;
  };
  vgList.sort(
    (a, b) =>
      kindRank(a.anchor.asin) - kindRank(b.anchor.asin) || a.anchor.asin.localeCompare(b.anchor.asin)
  );

  const ws2 = wb.addWorksheet('按变体组（全部SKU）');
  ws2.columns = [
    { header: '缩略图', key: 'img', width: 14 },
    { header: '变体组', key: 'gid', width: 22 },
    { header: '卡面代表', key: 'rep', width: 9 },
    { header: 'ASIN', key: 'asin', width: 26 },
    { header: '现有SKU', key: 'sku', width: 20 },
    { header: '类型', key: 'kind', width: 26 },
    { header: '颜色', key: 'color', width: 20 },
    { header: '尺寸', key: 'size', width: 14 },
    { header: '标题', key: 'title', width: 50 },
    { header: 'URL', key: 'url', width: 50 },
  ];
  ws2.getRow(1).font = { bold: true };
  ws2.getRow(1).height = 20;

  let ri2 = 2;
  let totalSku = 0;
  for (const { gid, members } of vgList) {
    const startRow = ri2;
    for (const p of members) {
      const info = mmMap[p.asin.toLowerCase()] || { title: '', sku: '' };
      const g = asinToGroup[p.asin.toLowerCase()];
      const kind = classifySet(p.asin);
      ws2.getRow(ri2).height = 92;
      ws2.getCell(`C${ri2}`).value = repAsins.has(p.asin) ? '●' : '';
      ws2.getCell(`D${ri2}`).value = p.asin;
      ws2.getCell(`E${ri2}`).value = info.sku;
      ws2.getCell(`F${ri2}`).value = KIND_LABEL[kind] || '（未分类单品）';
      ws2.getCell(`G${ri2}`).value = g ? g.color : titleColorOf(p.asin);
      ws2.getCell(`H${ri2}`).value = sizeLabelOf(p.asin);
      ws2.getCell(`I${ri2}`).value = info.title;
      ws2.getCell(`J${ri2}`).value = `https://www.makimoohome.com/products/${p.handle}/`;
      for (const col of 'CDEFGHIJ') {
        ws2.getCell(`${col}${ri2}`).alignment = {
          vertical: 'middle',
          horizontal: col === 'C' ? 'center' : undefined,
          wrapText: col === 'I' || col === 'J',
        };
      }
      if (repAsins.has(p.asin)) ws2.getCell(`D${ri2}`).font = { bold: true };
      const buf = await thumbBuffer(p.asin);
      if (buf) {
        const imgId = wb.addImage({ buffer: buf, extension: 'png' });
        ws2.addImage(imgId, {
          tl: { col: 0.15, row: ri2 - 1 + 0.05 },
          ext: { width: 90, height: 120 },
        });
      }
      ri2++;
      totalSku++;
    }
    // 变体组列跨成员合并，组与组之间留视觉分隔（加粗上边框由合并区分即可）
    const endRow = ri2 - 1;
    ws2.getCell(`B${startRow}`).value = `${gid}（${members.length} 款）`;
    ws2.getCell(`B${startRow}`).alignment = { vertical: 'middle', wrapText: true };
    ws2.getCell(`B${startRow}`).font = { bold: true };
    if (endRow > startRow) ws2.mergeCells(`B${startRow}:B${endRow}`);
  }
  console.log(`Sheet2 按变体组：${vgList.length} 组 / ${totalSku} 个 SKU`);

  await wb.xlsx.writeFile(OUT);
  console.log('已写出：' + OUT);
})();
