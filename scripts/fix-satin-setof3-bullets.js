// 把 24 个 satin(ice silk) SKU 的 bullets 改为三件套口径（2026-10-15 用户确认实物为三件套）
// 规则：找"包装内容"段落（WHAT IS INCLUDED / COMPLETE PACKAGE / Duvet Cover x 1 等）整段替换为
//       新 WHAT'S INCLUDED 段；找不到则开头插入。其余段落里"枕套不含/仅被套"类句子删除。
const fs = require('fs');

const MAP_FILE = 'src/data/materials-map.ts';
const ST_FILE = 'src/data/short-titles.ts';

// 1) 从 short-titles 取每个 ASIN 的尺寸
const st = fs.readFileSync(ST_FILE, 'utf8');
const sizeOf = {};
for (const m of st.matchAll(/"(1688-(?:1061371343572|1048207560416)[^"]*)": "[^"]*?(\d+ x \d+cm)"/g)) {
  sizeOf[m[1]] = m[2];
}
const ASINS = Object.keys(sizeOf);
if (ASINS.length !== 24) { console.error('expected 24 asins, got', ASINS.length); process.exit(1); }

const PKG_RE = /^(WHAT IS INCLUDED|WHAT YOU RECEIVE|WHAT YOU GET|COMPLETE PACKAGE|PACKAGE|WHAT'S INCLUDED)|Duvet Cover x 1|comes with 1 duvet cover|includes 1 duvet cover|listing includes (one|1|a) duvet cover|Duvet Cover Only/i;
// 删除句：声称枕套/床单不包含、仅被套
const EXCL_RE = /[^.!?]*(pillowcases?[^.!?]*not (included|part of the package)|not included[^.!?]*pillowcases?|covers the duvet cover only|duvet cover only)[^.!?]*[.!?]\s*/gi;

const newPara = (size) =>
  `WHAT'S INCLUDED: This 3-piece bedding set includes 1 duvet cover (${size}) and 2 matching pillowcases — a coordinated look right out of the package. Duvet inserts and sheets are not included.`;

let src = fs.readFileSync(MAP_FILE, 'utf8');
let ok = 0, prepended = 0, dropped = 0;

for (const asin of ASINS) {
  const key = asin.toLowerCase();
  const i = src.indexOf('"' + key + '":');
  if (i < 0) { console.error('NOT FOUND:', key); continue; }
  const eol = src.indexOf('\n', i);
  const line = src.slice(i, eol);
  const m = line.match(/"bullets":"((?:[^"\\]|\\.)*)"/);
  if (!m) { console.error('NO BULLETS:', key); continue; }

  let paras = m[1].split('\\n\\n');
  const idx = paras.findIndex((p) => PKG_RE.test(p));
  if (idx >= 0) paras[idx] = newPara(sizeOf[asin]);
  else { paras.unshift(newPara(sizeOf[asin])); prepended++; }
  // 清掉其余段落里的"仅被套/枕套不含"句
  paras = paras.map((p) => {
    const cleaned = p.replace(EXCL_RE, '');
    if (cleaned !== p) dropped++;
    return cleaned;
  }).filter((p) => p.trim().length > 0);

  const newBullets = paras.join('\\n\\n');
  const newLine = line.slice(0, m.index) + '"bullets":"' + newBullets + '"' + line.slice(m.index + m[0].length);
  src = src.slice(0, i) + newLine + src.slice(eol);
  ok++;
}

if (ok === ASINS.length) {
  fs.writeFileSync(MAP_FILE, src);
  console.log(`done: ${ok} updated (${prepended} prepended), exclusion sentences cleaned in ${dropped} paragraphs`);
} else {
  console.error('only', ok, 'of', ASINS.length, '— NOT written');
  process.exit(1);
}
