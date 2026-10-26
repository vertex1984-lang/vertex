const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const map = JSON.parse(fs.readFileSync(path.join(ROOT, 'archive/removed-products/2026-10-26/data/handle-asin-map.json'), 'utf8'));
const H = Object.keys(map), A = Object.values(map);
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const pd = H.filter((h) => fs.existsSync(path.join(ROOT, 'out/products', h)));
const id = A.filter((a) => fs.existsSync(path.join(ROOT, 'out/images/products', a)) || fs.existsSync(path.join(ROOT, 'out/images/products', a.toLowerCase())));
const sm = fs.readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf8');
const ism = H.filter((h) => sm.includes(h));

const files = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!['node_modules', '.next', 'out', '.git', 'archive'].includes(e.name)) walk(p); }
    else if (/\.(ts|tsx)$/.test(e.name)) files.push(p);
  }
};
walk(path.join(ROOT, 'src'));
const imgRefs = [];
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  for (const a of A) {
    const re = new RegExp('/images/(products|featured)/' + esc(a) + '/', 'gi');
    if (re.test(s)) imgRefs.push(path.relative(ROOT, f) + ': ' + a);
  }
}
console.log('out/ 残留 PDP:', pd.length, pd.slice(0, 5));
console.log('out/ 残留图片目录:', id.length, id.slice(0, 5));
console.log('sitemap 残留:', ism.length, ism.slice(0, 5));
console.log('live 数据对已归档图片的引用:', imgRefs.length, [...new Set(imgRefs)].slice(0, 10));
console.log('archive 图片目录数:', fs.readdirSync(path.join(ROOT, 'archive/removed-products/2026-10-26/images')).length);
console.log('archive 数据文件:', fs.readdirSync(path.join(ROOT, 'archive/removed-products/2026-10-26/data')).join(', '));
