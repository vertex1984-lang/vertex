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
    for (const cand of [base + '.ts', path.join(base, 'index.ts')]) if (fs.existsSync(cand)) return cand;
    throw e;
  }
};
require.extensions['.ts'] = function (m, filename) {
  const src = fs.readFileSync(filename, 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { module: 'commonjs', target: 'es2020', esModuleInterop: true } }).outputText;
  m._compile(out, filename);
};
require.extensions['.tsx'] = require.extensions['.ts'];
const { getVariantGroupOf } = require('../src/data/variant-groups.ts');
for (const asin of ['745181807454', '745181807454-80X120', '745181807454-C2', '745181807454-C3', '745181807454-C4', '745181807454-C5', '745181807454-C6', '745181807454-C7', '745181807454-C8', '1052742241013-C7', '1052742241013-C8', '1052742241013-C2']) {
  const g = getVariantGroupOf(asin);
  console.log(asin, '→', g ? `${g.id} (${g.members.length} 成员)` : '(无组 ⚠️)');
}
