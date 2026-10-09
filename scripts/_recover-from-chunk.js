/** 从 .next dev 编译产物中抽取指定 ts 模块的源码（webpack dev eval 包装） */
const fs = require('fs');
const [, , chunkPath, moduleName, outPath] = process.argv;
const src = fs.readFileSync(chunkPath, 'utf-8');
const marker = `"(ssr)/./${moduleName}":`;
const mi = src.indexOf(marker);
if (mi < 0) { console.error('模块未找到:', moduleName); process.exit(1); }
const ei = src.indexOf('eval("', mi);
if (ei < 0) { console.error('eval 未找到'); process.exit(1); }
const strStart = ei + 5; // 指向开头的双引号
// 找到该字符串字面量的结束引号（跳过转义）
let i = strStart + 1;
while (i < src.length) {
  if (src[i] === '\\') { i += 2; continue; }
  if (src[i] === '"') break;
  i++;
}
const literal = src.slice(strStart, i + 1);
const code = JSON.parse(literal);
fs.writeFileSync(outPath, code);
console.log(`已恢复 ${moduleName} → ${outPath}（${code.split('\n').length} 行）`);
