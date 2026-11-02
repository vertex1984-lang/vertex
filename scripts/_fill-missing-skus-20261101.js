// 为 materials-map.ts 中所有 sku 为空的条目生成 US-XXXXXX（2026-11-01 用户定：所有无 SKU 产品补齐）
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.join(__dirname, '..');
const MM = path.join(ROOT, 'src/data/materials-map.ts');

let src = fs.readFileSync(MM, 'utf8');

// 收集已占用的 US- 码（避免冲突）
const used = new Set();
for (const f of ['src/data/materials-map.ts', 'src/data/shopify-map.ts', 'scripts/_shots/random-skus-20261101.json', 'scripts/_shots/tab-new-skus-20261101.json']) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p)) for (const m of fs.readFileSync(p, 'utf8').matchAll(/US-[A-Z0-9]{6}/g)) used.add(m[0]);
}
const ALPH = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
const genSku = () => {
  for (;;) {
    let s = 'US-';
    for (let i = 0; i < 6; i++) s += ALPH[crypto.randomInt(ALPH.length)];
    if (!used.has(s)) { used.add(s); return s; }
  }
};

// 定位所有条目，找 sku 为空的
const re = /\n  "([^"]+)": \{"title":"/g;
const keys = [];
let m;
while ((m = re.exec(src))) keys.push({ k: m[1], i: m.index });

const assigned = {};
// 从后往前替换，避免索引位移
for (let j = keys.length - 1; j >= 0; j--) {
  const start = keys[j].i;
  const end = j + 1 < keys.length ? keys[j + 1].i : src.length;
  const body = src.slice(start, end);
  if (!/"sku":""/.test(body)) continue;
  const sku = genSku();
  assigned[keys[j].k] = sku;
  src = src.slice(0, start) + body.replace('"sku":""', `"sku":"${sku}"`) + src.slice(end);
}

fs.writeFileSync(MM, src);

// 合并写入随机码记录
const LOG = path.join(ROOT, 'scripts/_shots/random-skus-20261101.json');
const log = fs.existsSync(LOG) ? JSON.parse(fs.readFileSync(LOG, 'utf8')) : {};
Object.assign(log, assigned);
fs.writeFileSync(LOG, JSON.stringify(log, null, 2));

console.log('补齐 SKU', Object.keys(assigned).length, '个：');
for (const [k, v] of Object.entries(assigned)) console.log(k, '=>', v);
