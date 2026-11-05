const fs = require('fs');
const ts = fs.readFileSync('src/data/variant-groups.ts', 'utf8');
// grab the two groups' member lines
const re = /\{ asin: '([^']+)', handle: '([^']+)', color: '([^']+)'(?:, size: '([^']+)')? \}/g;
let m; const members = [];
while ((m = re.exec(ts))) members.push({ asin: m[1], handle: m[2], color: m[3], size: m[4] });
const targets = ['1052742241013', '745181807454'];
const byColor = new Map();
for (const mem of members) {
  if (!targets.some(t => mem.asin.startsWith(t))) continue;
  if (!byColor.has(mem.color)) byColor.set(mem.color, mem);
}
// load products data to get first image
const pts = fs.readFileSync('src/data/products.ts', 'utf8');
const out = [];
for (const [color, mem] of byColor) {
  // find product block by handle
  const hIdx = pts.indexOf(`"handle": "${mem.handle}"`);
  let img = null;
  if (hIdx >= 0) {
    const slice = pts.slice(hIdx, hIdx + 6000);
    const im = slice.match(/"url": "([^"]+)"/);
    img = im ? im[1] : null;
  }
  out.push({ color, asin: mem.asin, handle: mem.handle, img });
}
console.log(JSON.stringify(out, null, 1));
