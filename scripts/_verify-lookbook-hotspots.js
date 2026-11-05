// 临时验证：lookbook 热区映射覆盖率
const ts = require('typescript');
const fs = require('fs');
const path = require('path');
const Module = require('module');
const ROOT = path.join(__dirname, '..');
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  if (request.startsWith('@/')) request = path.join(ROOT, 'src', request.slice(2));
  try { return origResolve.call(this, request, parent, ...rest); } catch (e) {
    const base = path.resolve(path.dirname(parent.filename), request);
    for (const cand of [base + '.ts', base + '.tsx', path.join(base, 'index.ts')]) {
      if (fs.existsSync(cand)) return cand;
    }
    throw e;
  }
};
require.extensions['.ts'] = require.extensions['.tsx'] = function (m, filename) {
  const src = fs.readFileSync(filename, 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { module: 'commonjs', target: 'es2020', esModuleInterop: true, jsx: 'react' } }).outputText;
  m._compile(out, filename);
};
const { LOOKBOOK } = require('../src/data/lookbook.ts');
const { lookbookHotspotsByImage } = require('../src/data/lookbook-hotspots.ts');
const map = lookbookHotspotsByImage();
let covered = 0, dots = 0, bad = 0;
for (const i of LOOKBOOK) {
  const h = map[i.image];
  if (h) {
    covered++; dots += h.length;
    for (const d of h) {
      if (!d.handle || d.x == null || d.y == null) { bad++; console.log('⚠️ 残缺热区', i.image, d); }
      if (d.x < 0 || d.x > 100 || d.y < 0 || d.y > 100) { bad++; console.log('⚠️ 坐标越界', i.image, d); }
    }
    console.log(`✓ ${path.basename(i.image)} → ${h.length} 点 (${h.map(x=>x.label).join(', ')})`);
  }
}
console.log(`\n覆盖 ${covered}/${LOOKBOOK.length} 张图，共 ${dots} 个圆点${bad ? `，⚠️ ${bad} 处异常` : '，无异常'}`);
