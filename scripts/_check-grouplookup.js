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
for (const asin of ['745181807454-GT010', '745181807454-GT010-80X120', '745181807454-GT029', '745181807454-GT070-200X300', '745181807454-GT006', '745181807454-GT006-80X120', '1052742241013-BS-13']) {
  const g = getVariantGroupOf(asin);
  console.log(asin, '→', g ? g.id : '(无组)');
}
