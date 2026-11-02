/**
 * _rebuild-sku-xlsx-20261101.js — 一次性重构 bedding-sku表.xlsx（2026-11-01 用户定）：
 * 1) 主表「按变体组」：剔除已删除的 14 款；缩略图改用站内自有图（materials-map images[0]）
 *    重新嵌入，锚定 editAs:'oneCell'（随单元格移动防错位）；规格列统一 英寸(整数)+厘米 双单位；
 *    保留用户列（新sku/供应链/型号名/供应链产品图链接/布料）与「新增」规划行。
 * 2) Sheet1「bedding」卡面代表表同步重建。
 * 3) 新增 4 个独立类型 tab：Sheet Set / Duvet Cover / Duvet Cover Set(1被套+2枕套) / Pillow & Sham，
 *    对照全部在架四件套花色家族 × Twin/Full/Queen/King 四档；规划新增行统一生成 US- 随机 SKU
 *    （2026-11-01 用户定：所有无 SKU 产品都要补齐，含 1688 供应链款）；同类型站内已有产品并入对应行（真实 ASIN/SKU/URL/图）。
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const ExcelJS = require('exceljs');

(async () => {

const ROOT = path.join(__dirname, '..');
const XLSX = 'C:/Users/12021/Desktop/bedding-sku表.xlsx';
const SUPPLY_DIR = 'C:/Users/12021/Desktop/供应链产品图';
const DELETED = new Set([
  'bedset4-beige-twin','bedset4-beige-full','bedset4-beige-queen','bedset4-beige-king',
  'bedset4-pink-twin','bedset4-pink-full','bedset4-pink-queen','bedset4-pink-king',
  'pompom4-vine-twin','pompom4-vine-full','pompom4-vine-queen','pompom4-vine-king',
  'percalejac-grey-queen','percalejac-oatbeige-queen',
]);

/* ================= 站点数据 ================= */
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/_shots/bedding-products.json'), 'utf8'))
  .filter((p) => !DELETED.has(p.asin.toLowerCase()));

// 2026-11-02：7 个规划四件套已上站（在 products-planned.ts、快照之外），注入参与建表；
// 供应链数据从 backup2 恢复（用户原始填写），避免状态回填后用户列丢失
const PLANNED_FOUR_DATA = {
  'percalecheck-c2': { asin: 'PERCALECHECK-C2', handle: 'makimoo-queen-bedding-set-4-piece-washed-cotton-feel-check-khaki-queen', family: 'percalecheck-sand', supply: 'https://detail.1688.com/offer/1000548719212.html', model: '绵屿卡其【A类母婴级/亲肤柔软不起球】', supplyImg: 'https://cbu01.alicdn.com/img/ibank/O1CN01y9Ov0F1gz9MDqrKdL_!!2216511684212-0-cib.jpg', fabric: '涤纶，水洗，毛面', newSku: '1000548719212-C2' },
  'percalecheck-c3': { asin: 'PERCALECHECK-C3', handle: 'makimoo-queen-bedding-set-4-piece-washed-cotton-feel-check-light-grey-queen', family: 'percalecheck-sand', supply: 'https://detail.1688.com/offer/1000548719212.html', model: '绵屿浅灰【A类母婴级/亲肤柔软不起球】', supplyImg: 'https://cbu01.alicdn.com/img/ibank/O1CN01ZczPQ71gz9MDxrYCR_!!2216511684212-0-cib.jpg', fabric: '涤纶，水洗，毛面', newSku: '1000548719212-C3' },
  'percalepatch-c5': { asin: 'PERCALEPATCH-C5', handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-patchwork-mauve-queen', family: 'percalepatch-stone', supply: 'https://detail.1688.com/offer/975921009077', model: '软屿-暖豆沙【100%全棉-超柔裸睡】', supplyImg: 'https://cbu01.alicdn.com/img/ibank/O1CN01zLGGb02NXh6qkqi1V_!!2208020949973-0-cib.jpg', fabric: '纯棉 平纹 提花工艺', newSku: '975921009077-c5' },
  'percalestripe-c6': { asin: 'PERCALESTRIPE-C6', handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-stripe-coffee-queen', family: 'percalestripe-petal', supply: 'https://detail.1688.com/offer/975921009077', model: '浮光-浅咖【100%全棉-超柔裸睡】', supplyImg: 'https://cbu01.alicdn.com/img/ibank/O1CN01NFsRD42NXh6qpyLTz_!!2208020949973-0-cib.jpg', fabric: '纯棉 平纹 提花工艺', newSku: '975921009077-c6' },
  'percalestripe-c7': { asin: 'PERCALESTRIPE-C7', handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-stripe-blue-queen', family: 'percalestripe-petal', supply: 'https://detail.1688.com/offer/975921009077', model: '浮光-蓝【100%全棉-超柔裸睡】', supplyImg: 'https://cbu01.alicdn.com/img/ibank/O1CN01h1f4ff2NXh6qq0I28_!!2208020949973-0-cib.jpg', fabric: '纯棉 平纹 提花工艺', newSku: '975921009077-c7' },
  'washjac-c2': { asin: 'WASHJAC-C2', handle: 'makimoo-queen-bedding-set-4-piece-washed-cotton-jacquard-grey-queen', family: 'washjac-cream', supply: 'https://detail.1688.com/offer/1047846553177.html', model: '高级灰+浅灰【A类面料 提花工艺】', supplyImg: 'https://cbu01.alicdn.com/img/ibank/O1CN01I64DMF2Jy1PBVp8yR_!!2215403309489-0-cib.jpg', fabric: '涤纶，水洗，毛面，提花工艺', newSku: '1047846553177-c2' },
  'washjac-c3': { asin: 'WASHJAC-C3', handle: 'makimoo-queen-bedding-set-4-piece-washed-cotton-jacquard-dark-grey-queen', family: 'washjac-cream', supply: 'https://detail.1688.com/offer/1047846553177.html', model: '绅士灰+深灰【A类面料 提花工艺】', supplyImg: 'https://cbu01.alicdn.com/img/ibank/O1CN01Y3Z6b02Jy1PBjbv2o_!!2215403309489-0-cib.jpg', fabric: '涤纶，水洗，毛面，提花工艺', newSku: '1047846553177-c3' },
};
for (const d of Object.values(PLANNED_FOUR_DATA)) products.push({ asin: d.asin, handle: d.handle });

const mmSrc = fs.readFileSync(path.join(ROOT, 'src/data/materials-map.ts'), 'utf8');
const mmMap = {};
{
  const re = /\n  "([^"]+)": \{"title":"/g;
  const keys = [];
  let m;
  while ((m = re.exec(mmSrc))) keys.push({ k: m[1], i: m.index });
  const un = (x) => { try { return JSON.parse('"' + x + '"'); } catch { return x; } };
  for (let j = 0; j < keys.length; j++) {
    const body = mmSrc.slice(keys[j].i, j + 1 < keys.length ? keys[j + 1].i : mmSrc.length);
    const t = body.match(/"title":"((?:\\.|[^"\\])*)"/);
    const s = body.match(/"sku":"((?:\\.|[^"\\])*)"/);
    const im = body.match(/"images":\[([^\]]*)\]/);
    mmMap[keys[j].k.toLowerCase()] = {
      title: t ? un(t[1]) : '',
      sku: s ? un(s[1]) : '',
      images: im ? [...im[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [],
    };
  }
}

// 2026-11-02：缩略图与站卡片一致——优先取 products-materials.ts 的 featuredImage（站卡片图源）
// 按 "asin" 锚点分块解析，避免跨块误吞（块间距 > 窗口时 matchAll 会越界）
const featMap = {};
{
  const pmSrc = fs.readFileSync(path.join(ROOT, 'src/data/products-materials.ts'), 'utf8');
  const anchors = [...pmSrc.matchAll(/"asin":\s*"([^"]+)"/g)];
  for (let i = 0; i < anchors.length; i++) {
    const end = i + 1 < anchors.length ? anchors[i + 1].index : pmSrc.length;
    const block = pmSrc.slice(anchors[i].index, end);
    const f = block.match(/"featuredImage":\s*"([^"]+)"/);
    if (f) featMap[anchors[i][1].toLowerCase()] = f[1];
  }
}

const asinToGroup = {};
{
  const vgSrc = fs.readFileSync(path.join(ROOT, 'src/data/variant-groups.ts'), 'utf8');
  const re = /id:\s*'([^']+)'[\s\S]*?members:\s*\[([\s\S]*?)\n    \]/g;
  let m;
  while ((m = re.exec(vgSrc))) {
    const mre = /\{\s*asin:\s*'([^']+)'([^}]*)\}/g;
    let mm;
    while ((mm = mre.exec(m[2]))) {
      const body = mm[2];
      asinToGroup[mm[1].toLowerCase()] = {
        gid: m[1],
        color: (body.match(/color:\s*'([^']*)'/) || [])[1] || '',
        size: (body.match(/size:\s*'([^']*)'/) || [])[1] || '',
      };
    }
  }
}

// material：product-specs.ts + specs-overrides.ts（override 优先）
const materialOf = (() => {
  const spec = {};
  const p1 = path.join(ROOT, 'src/data/product-specs.ts');
  const p2 = path.join(ROOT, 'src/data/specs-overrides.ts');
  if (fs.existsSync(p1)) {
    const s = fs.readFileSync(p1, 'utf8');
    for (const m of s.matchAll(/"([^"]+)":\s*\{[^}]*?material:\s*"([^"]+)"/g)) spec[m[1].toLowerCase()] = m[2];
  }
  if (fs.existsSync(p2)) {
    const s = fs.readFileSync(p2, 'utf8');
    for (const m of s.matchAll(/"([^"]+)":\s*\{[^}]*?material:\s*"([^"]+)"/g)) spec[m[1].toLowerCase()] = m[2];
  }
  return (asin) => spec[asin.toLowerCase()] || '';
})();

/* ================= 分类/家族逻辑（同 export 脚本） ================= */
const SET_SIZE_ORDER = ['TWIN', 'FULL', 'QUEEN', 'KING'];
const DUVET_PREFIXES = ['1048207560416', '1061371343572'];
function classifySet(asin) {
  const a = asin.toLowerCase();
  if (/-duvet$/.test(a)) return 'duvet';
  if (/-sheet$/.test(a)) return 'sheet';
  if (/(^|-)pc(-|$)/.test(a)) return 'pillowcase';
  for (const p of ['bedset4-','sateen4-','pompom4-','percalejac-','percalecheck-','percalestripe-','percalepatch-','washstripe-','washjac-','veljac-','velstripe-','1071466105053','1025015219200','mk-heart4-','mk-print4-','mk-floral4-','mk-btfly4-'])
    if (a.startsWith(p)) return 'four';
  if (a.startsWith('sheetset-')) return 'sheetset';
  if (a.startsWith('duvetset-')) return 'duvetset';
  if (a.startsWith('bundle-')) return 'bundle';
  if (a.startsWith('duvset-') || a.startsWith('linen3-') || a.startsWith('916370884976')) return 'four';
  if (a.startsWith('percale-')) return 'four';
  if (DUVET_PREFIXES.some((p) => a.startsWith(p))) return 'four';
  return null;
}
const COLOR_LABELS = {
  DUSTYBLUE:'Dusty Blue',OFFWHITE:'Off White',BEANRED:'Bean Red',BUTTER:'Butter Yellow',DILL:'Dill Green',OAT:'Alpine Oat',SKY:'Sky Blue',MIST:'Mist Grey',COCONUT:'Coconut Milk',NUDE:'Nude Pink',EUCA:'Eucalyptus',LAVENDER:'Lavender Fog',CREAM:'Cream White',BEIGE:'Soft Beige',MUSTARD:'Mustard Yellow',TAUPE:'Taupe',TERRACOTTA:'Terracotta',OLIVE:'Olive Green',SWIRL:'Caramel Swirl',VINE:'Olive Vine',LEAF:'Dusty Leaf',BLUSH:'Blush Floral',INK:'Ink Floral',BLOOM:'Lilac Bloom',DAMASK:'Gold Damask',HAZE:'Dusty Blue',ROSE:'Dusty Pink',GREY:'Light Grey',OATBEIGE:'Oatmeal Beige',PETAL:'Blush Pink Stripe',STONE:'Stone Grey Patchwork',SAGEGREEN:'Sage Green',GINGHAM:'Grey Gingham',HEART:'Tan Heart',POLKA:'Blue Polka',IVORY:'Ivory White',SAND:'Sand Beige',MOCHA:'Sage Stripe',DENIM:'Denim Stripe',CHARCOAL:'Charcoal Stripe',HEART4:'Tan Heart',PRINT4:'Blue Print',FLORAL4:'Grey Floral',BTFLY4:'Mocha Butterfly',
};
function titleColorOf(asin) {
  const m = (mmMap[asin.toLowerCase()]?.title || '').match(/\(([^()]+)\)\s*$/);
  return m ? m[1].trim() : '';
}
function duvetColorOf(asin) {
  const g = asinToGroup[asin.toLowerCase()];
  return g && g.color ? g.color : titleColorOf(asin);
}
// 7 个规划四件套（色号为 C 编号）归入母家族
const FAMILY_ALIAS = {
  'percalecheck-c2': 'PERCALECHECK-SAND', 'percalecheck-c3': 'PERCALECHECK-SAND',
  'percalepatch-c5': 'PERCALEPATCH-STONE',
  'percalestripe-c6': 'PERCALESTRIPE-PETAL', 'percalestripe-c7': 'PERCALESTRIPE-PETAL',
  'washjac-c2': 'WASHJAC-CREAM', 'washjac-c3': 'WASHJAC-CREAM',
};
function familyKeyOf(asin) {
  const a = asin.toLowerCase();
  if (FAMILY_ALIAS[a]) return FAMILY_ALIAS[a];
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
  four: '四件套 Sheets & Duvet Set', sheetset: '床单套件 Sheet Set', duvetset: '被套套件 Duvet Cover Set',
  duvet: '被套 Duvet Cover', sheet: '床笠 Fitted Sheet', pillowcase: '枕套 Pillowcases',
  comforter: 'Comforter Set', bundle: 'Complete Bundle',
};
const KIND_ORDER = ['four','sheetset','duvetset','duvet','sheet','pillowcase','comforter','bundle'];
const hasPdp = (p) => fs.existsSync(path.join(ROOT, 'out/products', p.handle, 'index.html'));

/* ================= 双单位规格 ================= */
const DUV = { Twin: '71×87″（180×220 cm）', Full: '79×91″（200×230 cm）', Queen: '87×94″（220×240 cm）', King: '104×90″（264×229 cm）' };
const FIT = { Twin: '39×75+15″（99×191+38 cm）', Full: '54×75+15″（137×191+38 cm）', Queen: '60×80+15″（152×203+38 cm）', King: '76×80+15″（193×203+38 cm）' };
const FLAT = { Twin: '66×96″（168×244 cm）', Full: '80×96″（203×244 cm）', Queen: '90×102″（229×259 cm）', King: '108×102″（274×259 cm）' };
const PC = '20×30″（51×76 cm）';
function tierOf(sizeText, extra = '') {
  const s = `${sizeText} ${extra}`.toLowerCase();
  const m = s.match(/\b(twin|full|queen|king)\b/);
  if (m) return m[1].charAt(0).toUpperCase() + m[1].slice(1);
  const cm = s.match(/(\d{3})\s*x\s*\d{3}/);
  if (cm) { const w = Number(cm[1]); return w <= 180 ? 'Twin' : w <= 210 ? 'Full' : w <= 240 ? 'Queen' : 'King'; }
  return 'Queen';
}
function specCells(kind, tier) {
  const b = { flatS: '—', flatN: 0, fitS: '—', fitN: 0, duvS: '—', duvN: 0, pcS: '—', pcN: 0 };
  const pcN = tier === 'Twin' ? 1 : 2;
  if (kind === 'four') return { ...b, fitS: FIT[tier], fitN: 1, duvS: DUV[tier], duvN: 1, pcS: PC, pcN };
  if (kind === 'sheetset') return { ...b, flatS: FLAT[tier], flatN: 1, fitS: FIT[tier], fitN: 1, pcS: PC, pcN };
  if (kind === 'duvetset') return { ...b, duvS: DUV[tier], duvN: 1, pcS: PC, pcN };
  if (kind === 'duvet') return { ...b, duvS: DUV[tier], duvN: 1 };
  if (kind === 'sheet') return { ...b, fitS: FIT[tier], fitN: 1 };
  if (kind === 'pillowcase') return { ...b, pcS: PC, pcN: 2 };
  return b;
}

/* ================= 读取当前 xlsx 的用户数据 ================= */
const userByAsin = {}; // asin(lower) -> {newSku, supply, model, supplyImg, fabric}
const addedRows = [];  // 「新增」规划行
const oldWb = new ExcelJS.Workbook();
await oldWb.xlsx.readFile(XLSX);
{
  const ws = oldWb.getWorksheet('按变体组（全部SKU）');
  const txt = (v) => (v == null ? '' : typeof v === 'object' ? (v.text || v.hyperlink || '') : String(v));
  for (let r = 2; r <= ws.rowCount; r++) {
    const g = (c) => ws.getCell(r, c).value;
    const asin = String(g(4) || '').trim();
    const rec = {
      group: txt(g(2)), rep: txt(g(3)), newSku: txt(g(6)), type: txt(g(7)), color: txt(g(8)),
      size: txt(g(9)), supply: txt(g(12)), model: txt(g(13)), supplyImg: txt(g(14)), fabric: txt(g(16)),
      supplyRaw: g(14),
    };
    if (asin === '新增') { addedRows.push(rec); continue; }
    if (!asin || asin === '删除') continue;
    userByAsin[asin.toLowerCase()] = rec;
  }
}
// 7 个规划四件套：状态变「站内已有」后行被重建丢失，从 PLANNED_FOUR_DATA 回灌用户列
for (const [k, d] of Object.entries(PLANNED_FOUR_DATA)) {
  if (!userByAsin[k]) userByAsin[k] = {
    group: '', rep: '', newSku: d.newSku, type: '', color: '', size: '',
    supply: d.supply, model: d.model, supplyImg: d.supplyImg, fabric: d.fabric, supplyRaw: undefined,
  };
}
// 家族 → 供应链信息（取任一成员的用户记录）
function supplyOf(asinList) {
  for (const a of asinList) {
    const u = userByAsin[a.toLowerCase()];
    if (u && (u.supply || u.model || u.fabric)) return u;
  }
  return { supply: '', model: '', fabric: '', supplyImg: '', newSku: '' };
}

/* ================= 计算主表行（变体组） ================= */
const repAsins = new Set();
{
  const fams = new Map();
  for (const p of products) {
    const k = classifySet(p.asin);
    if (!k) continue;
    const gk = k + '::' + familyKeyOf(p.asin);
    if (!fams.has(gk)) fams.set(gk, []);
    fams.get(gk).push(p);
  }
  for (const membersAll of fams.values()) {
    const members = membersAll.filter(hasPdp);
    if (!members.length) continue;
    const sorted = [...members].sort(
      (a, b) => SET_SIZE_ORDER.indexOf(a.asin.split('-').pop().toUpperCase()) -
        SET_SIZE_ORDER.indexOf(b.asin.split('-').pop().toUpperCase()));
    const rep = sorted.find((p) => p.asin.toUpperCase().endsWith('-QUEEN')) || sorted[0];
    repAsins.add(rep.asin);
  }
  // 未分类单品
  const seen = new Set();
  for (const p of products) {
    if (classifySet(p.asin) || !hasPdp(p)) continue;
    const g = asinToGroup[p.asin.toLowerCase()];
    const key = g ? g.gid + '::' + g.color.toLowerCase() : p.asin.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    repAsins.add(p.asin);
  }
}

const vgGroups = new Map();
for (const p of products) {
  if (!hasPdp(p)) continue;
  const g = asinToGroup[p.asin.toLowerCase()];
  const gid = g ? g.gid : '单品-' + p.asin;
  if (!vgGroups.has(gid)) vgGroups.set(gid, []);
  vgGroups.get(gid).push(p);
}
const sizeRank = (asin) => { const i = SET_SIZE_ORDER.indexOf(asin.split('-').pop().toUpperCase()); return i === -1 ? 99 : i; };
const vgList = [...vgGroups.entries()].map(([gid, members]) => {
  const sorted = [...members].sort(
    (a, b) => (asinToGroup[a.asin.toLowerCase()]?.color || '').localeCompare(asinToGroup[b.asin.toLowerCase()]?.color || '') ||
      sizeRank(a.asin) - sizeRank(b.asin) || a.asin.localeCompare(b.asin));
  const anchor = sorted.find((p) => repAsins.has(p.asin)) || sorted[0];
  return { gid, members: sorted, anchor };
});
const kindRank = (asin) => { const k = classifySet(asin); const i = k ? KIND_ORDER.indexOf(k) : -1; return i === -1 ? 99 : i; };
vgList.sort((a, b) => kindRank(a.anchor.asin) - kindRank(b.anchor.asin) || a.anchor.asin.localeCompare(b.anchor.asin));

/* ================= 四件套家族清单（66 个，供 4 个 tab 对照） ================= */
const fourFams = [];
{
  const fams = new Map();
  for (const p of products) {
    if (classifySet(p.asin) !== 'four') continue;
    const key = familyKeyOf(p.asin);
    if (!fams.has(key)) fams.set(key, []);
    fams.get(key).push(p);
  }
  for (const [key, membersAll] of fams) {
    const members = membersAll.filter(hasPdp);
    if (!members.length) continue;
    const sorted = [...members].sort((a, b) => sizeRank(a.asin) - sizeRank(b.asin));
    const rep = sorted.find((p) => p.asin.toUpperCase().endsWith('-QUEEN')) || sorted[0];
    const supply = supplyOf(members.map((m) => m.asin));
    fourFams.push({
      key, color: colorOfKey(key, rep.asin), rep, members: sorted,
      fabric: supply.fabric || materialOf(rep.asin),
      supply: supply.supply, model: supply.model,
      isSelf: /自主/.test(supply.supply) || (!/1688|http/.test(supply.supply)),
    });
  }
  // 2026-11-02 用户定：percalecheck 家族实为涤纶水洗毛面，布料列与家族显示名改 Washed Cotton 系
  for (const f of fourFams) {
    if (f.key.toLowerCase().startsWith('percalecheck')) f.fabric = 'Washed Cotton-Like（涤纶水洗毛面）';
  }
  fourFams.sort((a, b) => a.rep.asin.localeCompare(b.rep.asin));
}
/** 家族显示名 override：仅展示层，不动 ASIN/组 id */
const displayFam = (s) => String(s).replace(/^PERCALECHECK/i, 'WASHED-COTTON-CHECK');

/* ================= 同类型站内已有产品映射 ================= */
const SHEETSET2FAM = {
  'sheetset-vine-queen': 'pompom4-vine', 'sheetset-ivory-queen': 'veljac-ivory',
  'sheetset-mocha-queen': 'velstripe-mocha', 'sheetset-heart-queen': 'mk-heart4-tan',
  'sheetset-sand-queen': 'percalecheck-sand', 'sheetset-petal-queen': 'percalestripe-petal',
  'sheetset-sagegreen-queen': 'washstripe-sagegreen', 'sheetset-gingham-queen': '1071466105053::grey gingham',
  'sheetset-polka-queen': '1071466105053::blue polka',
};
function duvetFamKey(a) {
  a = a.toLowerCase();
  const m = a.match(/^(linen3|percale|duvset)-([a-z]+?)(?:-(twin|full|queen|king))?-duvet$/);
  if (m) return `${m[1]}-${m[2]}`;
  for (const p of ['percalejac-haze', 'percalepatch-stone', 'percalestripe-petal', 'pompom4-vine', 'veljac-ivory', 'washjac-cream'])
    if (a === `${p}-duvet`) return p;
  return null;
}
const existingByTab = { sheetset: {}, duvet: {}, pillowcase: {}, duvetset: {} };
for (const p of products) {
  const a = p.asin.toLowerCase();
  if (!hasPdp(p)) continue;
  if (a.startsWith('sheetset-')) {
    const fam = SHEETSET2FAM[a];
    if (fam) (existingByTab.sheetset[fam] ||= {})['Queen'] = p;
  } else if (a.endsWith('-duvet')) {
    const fam = duvetFamKey(a);
    if (fam) {
      const g = asinToGroup[a];
      const tier = tierOf(g?.size || '', a);
      (existingByTab.duvet[fam] ||= {})[tier] = p;
    }
  } else if (/(^|-)pc(-|$)/.test(a)) {
    const fam = a.includes('haze') ? 'percalejac-haze' : null;
    if (fam) (existingByTab.pillowcase[fam] ||= {})['Queen'] = p;
  }
  // 2026-11-01 用户定：PERCALE 六色的 Duvet Cover Set 行指向现有 percale-* 三件套产品（站上按四件套口径展示）
  if (a.startsWith('percale-') && !a.endsWith('-duvet') && !a.endsWith('-sheet')) {
    const last = a.split('-').pop().toUpperCase();
    if (SET_SIZE_ORDER.includes(last)) {
      const fam = a.slice(0, a.length - last.length - 1); // percale-{color}
      const tier = last.charAt(0) + last.slice(1).toLowerCase();
      (existingByTab.duvetset[fam] ||= {})[tier] = p;
    }
  }
}

/* ===== 2026-11-01 批量创建的计划产品（products-planned.ts）：按命名方案回填「站内已有」 ===== */
const plannedByAsin = {}; // asin(lower) -> {asin, handle}
{
  const pp = path.join(ROOT, 'src/data/products-planned.ts');
  if (fs.existsSync(pp)) {
    const src = fs.readFileSync(pp, 'utf8');
    for (const m of src.matchAll(/"asin":\s*"([^"]+)",[\s\S]{0,2000}?"handle":\s*"([^"]+)"/g))
      plannedByAsin[m[1].toLowerCase()] = { asin: m[1], handle: m[2] };
  }
}
// 与 _create-planned-products-20261101.js 一致的 asin 命名：token = rep.asin 去 -queen 尾缀
function plannedAsinOf(kind, fam, tier) {
  const token = fam.rep.asin.toLowerCase().replace(/-queen$/, '');
  const t = tier.toLowerCase();
  if (kind === 'sheetset') return `sheetset-${token}-${t}`;
  if (kind === 'duvetset') return `duvetset-${token}-${t}`;
  if (kind === 'duvet') return `${token}-${t}-duvet`;
  return `${token}-pc-${t}`;
}
// 7 个规划新增四件套已上站（货号 -> 站内 asin/handle；与 _create-planned-products 的 PLANNED_FOUR 一致）
const PLANNED_FOUR_LIVE = {
  '1000548719212-C2': { asin: 'PERCALECHECK-C2', handle: 'makimoo-queen-bedding-set-4-piece-washed-cotton-feel-check-khaki-queen' },
  '1000548719212-C3': { asin: 'PERCALECHECK-C3', handle: 'makimoo-queen-bedding-set-4-piece-washed-cotton-feel-check-light-grey-queen' },
  '975921009077-c5': { asin: 'PERCALEPATCH-C5', handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-patchwork-mauve-queen' },
  '975921009077-c6': { asin: 'PERCALESTRIPE-C6', handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-stripe-coffee-queen' },
  '975921009077-c7': { asin: 'PERCALESTRIPE-C7', handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-stripe-blue-queen' },
  '1047846553177-c2': { asin: 'WASHJAC-C2', handle: 'makimoo-queen-bedding-set-4-piece-washed-cotton-jacquard-grey-queen' },
  '1047846553177-c3': { asin: 'WASHJAC-C3', handle: 'makimoo-queen-bedding-set-4-piece-washed-cotton-jacquard-dark-grey-queen' },
};

/* ================= 随机 SKU（优先复用已生成记录，保证重跑不换码） ================= */
const used = new Set();
for (const f of ['src/data/materials-map.ts', 'src/data/shopify-map.ts', 'scripts/_shots/random-skus-20261101.json'])
  if (fs.existsSync(path.join(ROOT, f)))
    for (const m of fs.readFileSync(path.join(ROOT, f), 'utf8').matchAll(/US-[A-Z0-9]{6}/g)) used.add(m[0]);
const ALPH = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
const genSku = () => { for (;;) { let s = 'US-'; for (let i = 0; i < 6; i++) s += ALPH[crypto.randomInt(ALPH.length)]; if (!used.has(s)) { used.add(s); return s; } } };
const SKU_LOG_PATH = path.join(ROOT, 'scripts/_shots/tab-new-skus-20261101.json');
const newSkuLog = fs.existsSync(SKU_LOG_PATH)
  ? JSON.parse(fs.readFileSync(SKU_LOG_PATH, 'utf8'))
  : {};
for (const s of Object.values(newSkuLog)) used.add(s);
const skuFor = (key) => {
  if (newSkuLog[key]) return newSkuLog[key];
  const s = genSku();
  newSkuLog[key] = s;
  return s;
};

/* ================= 图片管理（同 sheet 内同文件复用同一 imageId） ================= */
// 注意：同一个 imageId 跨 sheet 复用会触发 ExcelJS 序列化 bug（后续 sheet 的 drawing
// rId 映射错乱，缩略图显示成别的图），所以缓存必须按 sheet 隔离（2026-11-02 实测确认）
const wb = new ExcelJS.Workbook();
const imgIds = new Map();
async function imgIdFor(sheetName, file) {
  if (!file || !fs.existsSync(file)) return null;
  const key = sheetName + '|' + file;
  if (imgIds.has(key)) return imgIds.get(key);
  const buf = await sharp(file).resize(90, 120, { fit: 'cover' }).png().toBuffer();
  const id = wb.addImage({ buffer: buf, extension: 'png' });
  imgIds.set(key, id);
  return id;
}
function siteImgFile(asin) {
  const info = mmMap[asin.toLowerCase()];
  const feat = featMap[asin.toLowerCase()];
  const rel = feat || info?.images?.[0];
  const cands = [];
  if (rel) cands.push(path.join(ROOT, 'public', rel));
  const dir = path.join(ROOT, 'public/images/products', asin);
  cands.push(path.join(dir, '0-main-3x4.webp'), path.join(dir, '1-3x4.webp'), path.join(dir, '1.webp'));
  for (const c of cands) if (fs.existsSync(c)) return c;
  if (fs.existsSync(dir)) {
    const any = fs.readdirSync(dir).find((f) => f.endsWith('.webp'));
    if (any) return path.join(dir, any);
  }
  return null;
}
const attach = async (ws, row, col, file) => {
  const id = await imgIdFor(ws.name, file);
  if (id == null) return;
  ws.addImage(id, { tl: { col: col + 0.15, row: row - 1 + 0.05 }, ext: { width: 90, height: 120 }, editAs: 'oneCell' });
};

/* ================= Sheet 1：bedding 卡面代表 ================= */
{
  const ws = wb.addWorksheet('bedding');
  ws.columns = [
    { width: 14 }, { width: 26 }, { width: 20 }, { width: 26 }, { width: 20 }, { width: 60 }, { width: 60 },
  ];
  const heads = ['缩略图', 'ASIN', '现有SKU', '类型', '颜色', '标题', 'URL'];
  heads.forEach((h, i) => { ws.getCell(1, i + 1).value = h; });
  ws.getRow(1).font = { bold: true };
  const reps = [];
  {
    const fams = new Map();
    for (const p of products) {
      const k = classifySet(p.asin);
      if (!k) continue;
      const gk = k + '::' + familyKeyOf(p.asin);
      if (!fams.has(gk)) fams.set(gk, []);
      fams.get(gk).push(p);
    }
    for (const [gk, membersAll] of fams) {
      const members = membersAll.filter(hasPdp);
      if (!members.length) continue;
      const sorted = [...members].sort((a, b) => sizeRank(a.asin) - sizeRank(b.asin));
      const rep = sorted.find((p) => p.asin.toUpperCase().endsWith('-QUEEN')) || sorted[0];
      const kind = gk.split('::')[0];
      reps.push({ kind, color: colorOfKey(gk.slice(kind.length + 2), rep.asin), asin: rep.asin, handle: rep.handle });
    }
    const seen = new Set();
    for (const p of products) {
      if (classifySet(p.asin) || !hasPdp(p)) continue;
      const g = asinToGroup[p.asin.toLowerCase()];
      const key = g ? g.gid + '::' + g.color.toLowerCase() : p.asin.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      reps.push({ kind: '', color: g ? g.color : titleColorOf(p.asin), asin: p.asin, handle: p.handle });
    }
    reps.sort((a, b) => {
      const ra = KIND_ORDER.indexOf(a.kind), rb = KIND_ORDER.indexOf(b.kind);
      return (ra === -1 ? 99 : ra) - (rb === -1 ? 99 : rb) || a.asin.localeCompare(b.asin);
    });
  }
  let r = 2;
  for (const x of reps) {
    const info = mmMap[x.asin.toLowerCase()] || {};
    ws.getRow(r).height = 92;
    ws.getCell(r, 2).value = x.asin;
    ws.getCell(r, 3).value = info.sku || '';
    ws.getCell(r, 4).value = KIND_LABEL[x.kind] || '（未分类单品）';
    ws.getCell(r, 5).value = x.color;
    ws.getCell(r, 6).value = info.title || '';
    ws.getCell(r, 7).value = `https://www.makimoohome.com/products/${x.handle}/`;
    for (let c = 2; c <= 7; c++) ws.getCell(r, c).alignment = { vertical: 'middle', wrapText: c >= 6 };
    await attach(ws, r, 0, siteImgFile(x.asin));
    r++;
  }
  console.log(`Sheet「bedding」：${r - 2} 行`);
}

/* ================= Sheet 2：按变体组（全部SKU） ================= */
{
  const ws = wb.addWorksheet('按变体组（全部SKU）');
  const heads = ['缩略图','变体组','卡面代表','ASIN','现有SKU','新sku','类型','颜色','尺寸','标题','URL','供应链','供应链型号名','供应链产品图','供应链产品图（本地）','布料','床单尺寸','床单数量','床笠尺寸','床笠数量','被套尺寸','被套数量','枕套（pillowcase/sham)尺寸','枕套（pillowcase/sham)数量'];
  const widths = [14, 22, 9, 26, 20, 20, 26, 20, 14, 50, 50, 22, 22, 30, 16, 16, 26, 9, 26, 9, 26, 9, 26, 9];
  heads.forEach((h, i) => { ws.getCell(1, i + 1).value = h; ws.getColumn(i + 1).width = widths[i]; });
  ws.getRow(1).font = { bold: true };

  let r = 2, total = 0;
  for (const { gid, members } of vgList) {
    const startRow = r;
    for (const p of members) {
      const a = p.asin.toLowerCase();
      const info = mmMap[a] || {};
      const u = userByAsin[a] || {};
      const g = asinToGroup[a];
      const kind = classifySet(p.asin);
      const tier = tierOf(g?.size || '', `${g?.color || ''} ${p.asin}`);
      const s = specCells(kind, tier);
      ws.getRow(r).height = 92;
      const set = (c, v) => { ws.getCell(r, c).value = v; };
      set(3, repAsins.has(p.asin) ? '●' : '');
      set(4, p.asin);
      set(5, info.sku || '');
      set(6, u.newSku || '');
      set(7, KIND_LABEL[kind] || '（未分类单品）');
      set(8, g ? g.color : titleColorOf(p.asin));
      set(9, p.asin.split('-').pop().match(/^(TWIN|FULL|QUEEN|KING)$/i)
        ? tierOf(p.asin) : (g?.size || ''));
      set(10, info.title || '');
      set(11, `https://www.makimoohome.com/products/${p.handle}/`);
      set(12, u.supply || '');
      set(13, u.model || '');
      if (u.supplyRaw && typeof u.supplyRaw === 'object') set(14, u.supplyRaw); else set(14, u.supplyImg || '');
      // 2026-11-02 用户定：percalecheck 家族（含 sheetset-sand）实为涤纶水洗毛面，布料列强制覆盖
      set(16, /^(percalecheck-|sheetset-sand-)/.test(a) ? 'Washed Cotton-Like（涤纶水洗毛面）' : (u.fabric || materialOf(p.asin)));
      set(17, s.flatS); set(18, s.flatN); set(19, s.fitS); set(20, s.fitN);
      set(21, s.duvS); set(22, s.duvN); set(23, s.pcS); set(24, s.pcN);
      for (let c = 3; c <= 24; c++) ws.getCell(r, c).alignment = { vertical: 'middle', horizontal: c === 3 ? 'center' : undefined, wrapText: [10, 11, 14, 17, 19, 21, 23].includes(c) };
      if (repAsins.has(p.asin)) ws.getCell(r, 4).font = { bold: true };
      await attach(ws, r, 0, siteImgFile(p.asin));
      const supplyFile = path.join(SUPPLY_DIR, p.asin.replace(/[\\/:*?"<>|]/g, '_') + '.jpg');
      await attach(ws, r, 14, supplyFile);
      r++; total++;
    }
    // 该家族的「新增」规划行（按组 id 精确匹配，防止 percale 吞掉 percalecheck/percalestripe 等）
    const famPrefix = gid.toLowerCase();
    for (const ad of addedRows) {
      const adGid = ad.group.split('（')[0].trim().toLowerCase();
      if (adGid !== famPrefix) continue;
      const live = PLANNED_FOUR_LIVE[ad.newSku]; // 已上站的规划四件套（2026-11-01 批量创建）
      const liveInfo = live ? mmMap[live.asin.toLowerCase()] || {} : {};
      ws.getRow(r).height = 92;
      const s = specCells('four', 'Queen');
      const set = (c, v) => { ws.getCell(r, c).value = v; };
      set(4, live ? live.asin : '新增');
      if (live) { set(5, liveInfo.sku || ad.newSku); }
      set(6, ad.newSku);
      set(7, '四件套 Sheets & Duvet Set');
      set(9, 'Queen');
      if (live) {
        set(10, liveInfo.title || '');
        set(11, `https://www.makimoohome.com/products/${live.handle}/`);
      }
      set(12, ad.supply); set(13, ad.model);
      if (ad.supplyRaw && typeof ad.supplyRaw === 'object') set(14, ad.supplyRaw); else set(14, ad.supplyImg);
      set(16, ad.fabric);
      set(17, s.flatS); set(18, s.flatN); set(19, s.fitS); set(20, s.fitN);
      set(21, s.duvS); set(22, s.duvN); set(23, s.pcS); set(24, s.pcN);
      for (let c = 3; c <= 24; c++) ws.getCell(r, c).alignment = { vertical: 'middle', wrapText: [10, 11, 17, 19, 21, 23].includes(c) };
      if (live) await attach(ws, r, 0, siteImgFile(live.asin));
      const supplyFile = path.join(SUPPLY_DIR, (ad.newSku || `row${r}`).replace(/[\\/:*?"<>|]/g, '_') + '.jpg');
      await attach(ws, r, 14, supplyFile);
      ad._used = true;
      r++; total++;
    }
    const endRow = r - 1;
    ws.getCell(startRow, 2).value = displayFam(`${gid}（${endRow - startRow + 1} 款）`);
    ws.getCell(startRow, 2).alignment = { vertical: 'middle', wrapText: true };
    ws.getCell(startRow, 2).font = { bold: true };
    if (endRow > startRow) ws.mergeCells(`${'B'}${startRow}:B${endRow}`);
  }
  console.log(`Sheet「按变体组」：${vgList.length} 组 / ${total} 行（含新增规划行 ${addedRows.filter((a) => a._used).length}）`);
}

/* ================= Sheet 3：Sheets & Duvet Set 四件套独立 tab（2026-11-01 用户定：放在全部SKU tab 之后） ================= */
// 数字货号供应链家族（1025015219200 / 1071466105053 / 1061371343572 / 916370884976 / 1048207560416）
// 的颜色是「同一链接下的变体」，不能拆成独立单行：有 variant-groups.ts 分组的按组聚合，
// 没有分组的按基础货号聚合（2026-11-01 用户反馈修正）。
const NUM_FAMILY_PREFIX = /^(\d{9,})/;
function displayGroupOf(fam) {
  const m = fam.key.match(NUM_FAMILY_PREFIX);
  if (!m) return null; // 非数字家族：按 颜色家族 独立展示（原逻辑）
  const g = asinToGroup[fam.rep.asin.toLowerCase()];
  return g ? g.gid : m[1];
}
{
  const ws = wb.addWorksheet('Sheets & Duvet Set');
  const heads = ['缩略图','对应四件套家族','颜色','尺寸','ASIN','状态','现有SKU','新sku','类型','标题','URL','供应链','供应链型号名','布料','床单尺寸','床单数量','床笠尺寸','床笠数量','被套尺寸','被套数量','枕套（pillowcase/sham)尺寸','枕套（pillowcase/sham)数量'];
  const widths = [14, 30, 20, 10, 26, 10, 20, 20, 26, 50, 50, 22, 22, 16, 26, 9, 26, 9, 26, 9, 26, 9];
  heads.forEach((h, i) => { ws.getCell(1, i + 1).value = h; ws.getColumn(i + 1).width = widths[i]; });
  ws.getRow(1).font = { bold: true };

  // 数字货号家族按展示分组排到一起（组内按 family key 排序），其余保持 rep.asin 顺序
  const sortedFams = [...fourFams].sort((a, b) => {
    const ka = displayGroupOf(a) || a.rep.asin;
    const kb = displayGroupOf(b) || b.rep.asin;
    return ka.localeCompare(kb) || a.key.localeCompare(b.key);
  });

  let r = 2, existCount = 0, planCount = 0;
  for (let gi = 0; gi < sortedFams.length;) {
    const dg = displayGroupOf(sortedFams[gi]);
    let gj = gi + 1;
    if (dg) while (gj < sortedFams.length && displayGroupOf(sortedFams[gj]) === dg) gj++;
    const groupFams = sortedFams.slice(gi, gj);
    const groupStart = r;
    for (const fam of groupFams) {
    for (const p of fam.members) {
      const a = p.asin.toLowerCase();
      const info = mmMap[a] || {};
      const u = userByAsin[a] || {};
      const g = asinToGroup[a];
      const tier = tierOf(g?.size || '', `${g?.color || ''} ${p.asin}`);
      const s = specCells('four', tier);
      ws.getRow(r).height = 92;
      const set = (c, v) => { ws.getCell(r, c).value = v; };
      set(3, g?.color || titleColorOf(p.asin) || fam.color);
      set(4, tier);
      set(5, p.asin);
      set(6, '站内已有');
      set(7, info.sku || '');
      set(8, u.newSku || '');
      set(9, KIND_LABEL.four);
      set(10, info.title || '');
      set(11, `https://www.makimoohome.com/products/${p.handle}/`);
      set(12, fam.supply);
      set(13, fam.model);
      set(14, fam.fabric);
      set(15, s.flatS); set(16, s.flatN); set(17, s.fitS); set(18, s.fitN);
      set(19, s.duvS); set(20, s.duvN); set(21, s.pcS); set(22, s.pcN);
      for (let c = 2; c <= 22; c++) ws.getCell(r, c).alignment = { vertical: 'middle', horizontal: [4, 6].includes(c) ? 'center' : undefined, wrapText: [10, 11, 15, 17, 19, 21].includes(c) };
      if (repAsins.has(p.asin)) ws.getCell(r, 5).font = { bold: true };
      await attach(ws, r, 0, siteImgFile(p.asin));
      r++; existCount++;
    }
    // 该家族的「新增」规划行（四件套规划，Queen 档，SKU 用供应链货号）
    for (const ad of addedRows) {
      const adGid = ad.group.split('（')[0].trim().toLowerCase();
      if (!fam.key.toLowerCase().startsWith(adGid)) continue;
      if (ad._fourTabUsed) continue;
      ad._fourTabUsed = true;
      const live = PLANNED_FOUR_LIVE[ad.newSku]; // 已上站的规划四件套（2026-11-01 批量创建）
      const liveInfo = live ? mmMap[live.asin.toLowerCase()] || {} : {};
      const s = specCells('four', 'Queen');
      ws.getRow(r).height = 92;
      const set = (c, v) => { ws.getCell(r, c).value = v; };
      set(3, fam.color);
      set(4, 'Queen');
      if (live) {
        set(5, live.asin);
        set(6, '站内已有');
        set(7, liveInfo.sku || ad.newSku);
        set(10, liveInfo.title || '');
        set(11, `https://www.makimoohome.com/products/${live.handle}/`);
      } else {
        set(6, '规划新增');
      }
      set(8, ad.newSku);
      set(9, KIND_LABEL.four);
      set(12, ad.supply); set(13, ad.model); set(14, ad.fabric);
      set(15, s.flatS); set(16, s.flatN); set(17, s.fitS); set(18, s.fitN);
      set(19, s.duvS); set(20, s.duvN); set(21, s.pcS); set(22, s.pcN);
      for (let c = 2; c <= 22; c++) ws.getCell(r, c).alignment = { vertical: 'middle', horizontal: [4, 6].includes(c) ? 'center' : undefined, wrapText: [10, 11, 15, 17, 19, 21].includes(c) };
      if (live) {
        await attach(ws, r, 0, siteImgFile(live.asin));
        r++; existCount++;
      } else {
        const supplyFile = path.join(SUPPLY_DIR, (ad.newSku || `row${r}`).replace(/[\\/:*?"<>|]/g, '_') + '.jpg');
        await attach(ws, r, 0, supplyFile);
        r++; planCount++;
      }
    }
    }
    // B 列：数字货号家族整组聚合展示（变体关系），其余按颜色家族展示
    const groupEnd = r - 1;
    const label = dg
      ? `${dg}（${groupEnd - groupStart + 1} 款）`
      : displayFam(`${groupFams[0].rep.asin}（${groupFams[0].color}）`);
    ws.getCell(groupStart, 2).value = label;
    ws.getCell(groupStart, 2).alignment = { vertical: 'middle', wrapText: true };
    ws.getCell(groupStart, 2).font = { bold: true };
    if (groupEnd > groupStart) ws.mergeCells(`B${groupStart}:B${groupEnd}`);
    gi = gj;
  }
  console.log(`Sheet「Sheets & Duvet Set」：${r - 2} 行（站内已有 ${existCount} / 规划新增 ${planCount}）`);
}

/* ================= Sheet 4-7：四个类型 tab ================= */
const TABS = [
  { name: 'Sheet Set', kind: 'sheetset', label: '床单套件 Sheet Set', exist: existingByTab.sheetset, famKeyOf: (f) => f.key.toLowerCase() },
  { name: 'Duvet Cover', kind: 'duvet', label: '被套 Duvet Cover', exist: existingByTab.duvet, famKeyOf: (f) => f.key.toLowerCase() },
  { name: 'Duvet Cover Set', kind: 'duvetset', label: '被套套件 Duvet Cover Set', exist: existingByTab.duvetset, famKeyOf: (f) => f.key.toLowerCase() },
  { name: 'Pillow & Sham', kind: 'pillowcase', label: '枕套 Pillowcases', exist: existingByTab.pillowcase, famKeyOf: (f) => f.key.toLowerCase() },
];
const TYPE_EN = { sheetset: 'Sheet Set', duvet: 'Duvet Cover', duvetset: 'Duvet Cover Set', pillowcase: 'Pillowcases (Set of 2)' };

for (const tab of TABS) {
  const ws = wb.addWorksheet(tab.name);
  const heads = ['缩略图','对应四件套家族','颜色','尺寸','ASIN','状态','现有SKU','新sku','类型','标题','URL','供应链','供应链型号名','布料','床单尺寸','床单数量','床笠尺寸','床笠数量','被套尺寸','被套数量','枕套（pillowcase/sham)尺寸','枕套（pillowcase/sham)数量'];
  const widths = [14, 30, 20, 10, 26, 10, 20, 20, 26, 50, 50, 22, 22, 16, 26, 9, 26, 9, 26, 9, 26, 9];
  heads.forEach((h, i) => { ws.getCell(1, i + 1).value = h; ws.getColumn(i + 1).width = widths[i]; });
  ws.getRow(1).font = { bold: true };

  let r = 2, newCount = 0, existCount = 0;
  for (const fam of fourFams) {
    const famKeyLower = tab.famKeyOf(fam);
    const startRow = r;
    for (const tier of ['Twin', 'Full', 'Queen', 'King']) {
      let exist = tab.exist[famKeyLower]?.[tier];
      // 2026-11-01 批量创建的计划产品：按命名方案查 products-planned.ts
      if (!exist) {
        const pl = plannedByAsin[plannedAsinOf(tab.kind, fam, tier)];
        if (pl) exist = { asin: pl.asin, handle: pl.handle };
      }
      const s = specCells(tab.kind, tier);
      ws.getRow(r).height = 92;
      const set = (c, v) => { ws.getCell(r, c).value = v; };
      set(3, fam.color);
      // 2026-11-02 用户定：pillowcase/sham 只有一个尺寸（20×30″），尺寸列统一 One Size（行数不变，保留各尺寸 SKU 对照）
      set(4, tab.kind === 'pillowcase' ? 'One Size（20×30″）' : tier);
      set(9, tab.label);
      set(12, fam.supply);
      set(13, fam.model);
      set(14, fam.fabric);
      set(15, s.flatS); set(16, s.flatN); set(17, s.fitS); set(18, s.fitN);
      set(19, s.duvS); set(20, s.duvN); set(21, s.pcS); set(22, s.pcN);
      if (exist) {
        const a = exist.asin.toLowerCase();
        const info = mmMap[a] || {};
        set(5, exist.asin);
        set(6, '站内已有');
        set(7, info.sku || '');
        set(10, info.title || '');
        set(11, `https://www.makimoohome.com/products/${exist.handle}/`);
        await attach(ws, r, 0, siteImgFile(exist.asin));
        existCount++;
      } else {
        set(6, '规划新增');
        const sku = skuFor(`${tab.name}|${fam.key}|${tier}`);
        set(8, sku);
        set(10, `Makimoo ${tier} ${TYPE_EN[tab.kind]}${fam.fabric ? ' ' + fam.fabric : ''}${fam.color ? ` (${fam.color})` : ''}`);
        await attach(ws, r, 0, siteImgFile(fam.rep.asin));
        newCount++;
      }
      for (let c = 2; c <= 22; c++) ws.getCell(r, c).alignment = { vertical: 'middle', horizontal: [4, 6].includes(c) ? 'center' : undefined, wrapText: [10, 11, 15, 17, 19, 21].includes(c) };
      r++;
    }
    const endRow = r - 1;
    ws.getCell(startRow, 2).value = displayFam(`${fam.rep.asin}（${fam.color}）`);
    ws.getCell(startRow, 2).alignment = { vertical: 'middle', wrapText: true };
    ws.getCell(startRow, 2).font = { bold: true };
    ws.mergeCells(`B${startRow}:B${endRow}`);
  }
  // 站内已有但无对应在架四件套的（如 sheetset-vine、pompom4-vine-duvet、percalejac-ivory-pc）
  const orphanRows = [];
  if (tab.kind === 'sheetset') {
    const p = products.find((x) => x.asin.toLowerCase() === 'sheetset-vine-queen');
    if (p && hasPdp(p)) orphanRows.push({ p, tier: 'Queen', note: '对应四件套已删除' });
  }
  if (tab.kind === 'duvet') {
    const p = products.find((x) => x.asin.toLowerCase() === 'pompom4-vine-duvet');
    if (p && hasPdp(p)) orphanRows.push({ p, tier: 'Queen', note: '对应四件套已删除' });
  }
  if (tab.kind === 'pillowcase') {
    const p = products.find((x) => x.asin.toLowerCase() === 'percalejac-ivory-pc-queen');
    if (p && hasPdp(p)) orphanRows.push({ p, tier: 'Queen', note: '无对应四件套花色' });
  }
  for (const { p, tier, note } of orphanRows) {
    const a = p.asin.toLowerCase();
    const info = mmMap[a] || {};
    const s = specCells(tab.kind, tier);
    ws.getRow(r).height = 92;
    const set = (c, v) => { ws.getCell(r, c).value = v; };
    set(2, note);
    set(3, asinToGroup[a]?.color || titleColorOf(p.asin));
    set(4, tab.kind === 'pillowcase' ? 'One Size（20×30″）' : tier);
    set(5, p.asin);
    set(6, '站内已有');
    set(7, info.sku || '');
    set(9, tab.label);
    set(10, info.title || '');
    set(11, `https://www.makimoohome.com/products/${p.handle}/`);
    set(14, materialOf(p.asin));
    set(15, s.flatS); set(16, s.flatN); set(17, s.fitS); set(18, s.fitN);
    set(19, s.duvS); set(20, s.duvN); set(21, s.pcS); set(22, s.pcN);
    for (let c = 2; c <= 22; c++) ws.getCell(r, c).alignment = { vertical: 'middle', wrapText: [10, 11, 15, 17, 19, 21].includes(c) };
    await attach(ws, r, 0, siteImgFile(p.asin));
    r++; existCount++;
  }
  console.log(`Sheet「${tab.name}」：${r - 2} 行（站内已有 ${existCount} / 规划新增 ${newCount}）`);
}

fs.writeFileSync(
  path.join(ROOT, 'scripts/_shots/tab-new-skus-20261101.json'),
  JSON.stringify(newSkuLog, null, 2)
);
await wb.xlsx.writeFile(XLSX);
console.log(`已保存：${XLSX}；新生成 SKU ${Object.keys(newSkuLog).length} 个（记录于 scripts/_shots/tab-new-skus-20261101.json）`);
})().catch((e) => { console.error(e); process.exit(1); });
