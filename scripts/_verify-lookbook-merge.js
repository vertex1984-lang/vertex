// 临时验证：场景图合并 lookbook + 房间/类目自动推导
// 注意：解析器优先 .ts/.tsx（同目录有同名 .json 时防止误解析，如 product-tags.json）
const ts = require('typescript');
const fs = require('fs');
const path = require('path');
const Module = require('module');
const ROOT = path.join(__dirname, '..');
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  if (request.startsWith('@/')) request = path.join(ROOT, 'src', request.slice(2));
  if ((request.startsWith('.') || path.isAbsolute(request)) && parent && !/\.[a-z]+$/i.test(request)) {
    const base = path.resolve(path.dirname(parent.filename), request);
    for (const cand of [base + '.ts', base + '.tsx', path.join(base, 'index.ts')]) {
      if (fs.existsSync(cand)) return cand;
    }
  }
  return origResolve.call(this, request, parent, ...rest);
};
require.extensions['.ts'] = require.extensions['.tsx'] = function (m, filename) {
  const src = fs.readFileSync(filename, 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { module: 'commonjs', target: 'es2020', esModuleInterop: true, jsx: 'react' } }).outputText;
  m._compile(out, filename);
};
const { mergedLookbookItems, lookbookHotspotsByImage } = require('../src/data/lookbook-hotspots.ts');
const items = mergedLookbookItems();
const hot = lookbookHotspotsByImage();
console.log('合并后卡片总数:', items.length);
const dup = items.length - new Set(items.map(i=>i.image)).size;
console.log('重复图:', dup);
let dotted = 0;
const rooms = {}, cats = {};
for (const i of items) {
  if (hot[i.image]?.length) dotted++;
  rooms[i.room] = (rooms[i.room]||0)+1;
  cats[i.category || '(空)'] = (cats[i.category || '(空)']||0)+1;
}
console.log('带圆点卡片:', dotted);
console.log('房间分布:', rooms);
console.log('类目分布:', cats);
console.log('\n前 12 张（/inspiration 预览）:');
for (const i of items.slice(0,12)) {
  console.log(`  ${path.basename(i.image)} | ${i.room}/${i.category||'-'} | 点:${hot[i.image]?.length||0} | ${i.href}`);
}
console.log('\n类目为空的场景卡:');
for (const i of items.filter(i=>!i.category)) console.log(' ', path.basename(i.image), i.href);
