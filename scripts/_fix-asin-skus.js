/**
 * 2026-11-02 用户定：73 个 sku==asin 的遗留产品统一补 US-XXXXX 码
 * （与既有 2030 个 US- 码及 tab-new-skus 里的规划码去重），结果固化到 _shots/asin-sku-fix.json
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const MM = path.join(ROOT, 'src/data/materials-map.ts');
const SHOT = path.join(ROOT, 'scripts/_shots/asin-sku-fix.json');

let src = fs.readFileSync(MM, 'utf8');

// 收集现有全部 sku，避免冲突
const used = new Set();
for (const m of src.matchAll(/"sku":"((?:\\.|[^"\\])*)"/g)) used.add(m[1].toUpperCase());
try {
  const tab = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/_shots/tab-new-skus-20261101.json'), 'utf8'));
  for (const v of Object.values(tab)) used.add(String(v).toUpperCase());
} catch {}
try {
  for (const v of Object.values(JSON.parse(fs.readFileSync(SHOT, 'utf8')))) used.add(String(v).toUpperCase());
} catch {}

const fixes = fs.existsSync(SHOT) ? JSON.parse(fs.readFileSync(SHOT, 'utf8')) : {};
function newSku() {
  for (;;) {
    const code = 'US-' + crypto.randomBytes(4).toString('hex').toUpperCase().replace(/[^A-Z0-9]/g, 'X').slice(0, 5);
    if (!used.has(code)) { used.add(code); return code; }
  }
}

const re = /\n  "([^"]+)": \{"title":"/g;
const keys = [];
let m;
while ((m = re.exec(src))) keys.push({ k: m[1], i: m.index });

let changed = 0;
// 从后往前替换，避免位移
for (let j = keys.length - 1; j >= 0; j--) {
  const start = keys[j].i;
  const end = j + 1 < keys.length ? keys[j + 1].i : src.length;
  let body = src.slice(start, end);
  const s = body.match(/"sku":"((?:\\.|[^"\\])*)"/);
  const sku = s ? s[1] : '';
  if (!sku || sku.toLowerCase() !== keys[j].k.toLowerCase()) continue;
  if (!fixes[keys[j].k]) fixes[keys[j].k] = newSku();
  body = body.replace(`"sku":"${sku}"`, `"sku":"${fixes[keys[j].k]}"`);
  src = src.slice(0, start) + body + src.slice(end);
  changed++;
}

fs.writeFileSync(MM, src);
fs.writeFileSync(SHOT, JSON.stringify(fixes, null, 2));
console.log('changed:', changed);
console.log(Object.entries(fixes).slice(0, 10).map(([k, v]) => `${k} -> ${v}`).join('\n'));
