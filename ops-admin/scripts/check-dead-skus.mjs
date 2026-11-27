/* 三方对照：scenes.ts 热区 handle vs PRODUCTS_DATA vs out 落地页 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import ts from 'typescript';

const VERTEX_ROOT = 'D:/opencode_workspace/vertex';
const require = createRequire(import.meta.url);
require.extensions['.ts'] = function (m, f) {
  const out = ts.transpileModule(fs.readFileSync(f, 'utf8'), {
    compilerOptions: { module: 'commonjs', target: 'es2020', jsx: 'react' },
  }).outputText;
  m._compile(out, f);
};
const Module = require('module');
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  if (request.startsWith('@/')) request = path.join(VERTEX_ROOT, 'src', request.slice(2));
  return origResolve.call(this, request, ...args);
};

const { PRODUCTS_DATA } = require(path.join(VERTEX_ROOT, 'src/data/products.ts'));
const { SCENES } = require(path.join(VERTEX_ROOT, 'src/data/scenes.ts'));
const rawHandles = new Set(PRODUCTS_DATA.map((p) => p.handle.toLowerCase()));

const OUT = path.join(VERTEX_ROOT, 'out', 'products');
const hasPage = (hd) => fs.existsSync(path.join(OUT, hd, 'index.html'));

const noRaw = [];   // 不在 PRODUCTS_DATA（getProductByHandle 找不到 → 圆点被滤）
const noPage = [];  // 在 PRODUCTS_DATA 但没落地页（隐藏或未生成 → 圆点会 404）
const slotDead = { noRaw: 0, noPage: 0 };
for (const s of SCENES) {
  for (const h of s.hotspots || []) {
    const hd = h.handle.toLowerCase();
    if (!rawHandles.has(hd)) {
      noRaw.push({ handle: h.handle, scenes: [s.slug] });
      slotDead.noRaw++;
    } else if (!hasPage(hd)) {
      const e = noPage.find((x) => x.handle === hd);
      if (e) e.scenes.push(s.slug); else noPage.push({ handle: hd, scenes: [s.slug] });
      slotDead.noPage++;
    }
  }
}
const uniq = (a) => { const m = new Map(); for (const x of a) { const e = m.get(x.handle); if (e) e.scenes.push(...x.scenes); else m.set(x.handle, { handle: x.handle, scenes: [...x.scenes] }); } return [...m.values()]; };
console.log('=== 不在 PRODUCTS_DATA（真死链，圆点被滤，共 ' + slotDead.noRaw + ' 槽位）===');
for (const x of uniq(noRaw)) console.log(`  ${x.handle}  ← ${x.scenes.join(', ')}`);
console.log('=== 在表但无落地页（圆点会 404！共 ' + slotDead.noPage + ' 槽位）===');
for (const x of uniq(noPage)) console.log(`  ${x.handle}  ← ${x.scenes.join(', ')}`);
