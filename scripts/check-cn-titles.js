const fs = require("fs");
const cjk = /[\u4e00-\u9fff]/;
const out = [];
for (const f of ["src/data/products.ts", "src/data/products-materials.ts"]) {
  const src = fs.readFileSync(f, "utf8");
  const re = /"asin":\s*"([^"]+)"[\s\S]*?"title":\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(src))) {
    const asin = m[1].toLowerCase();
    const title = m[2];
    if (cjk.test(title)) out.push({ asin, title: title.slice(0, 60), from: f.split("/").pop() });
  }
}
// 覆盖表：materials-map.ts 非空 title
const mm = fs.readFileSync("src/data/materials-map.ts", "utf8");
const mmRe = /"([^"]+)":\s*\{"title":"((?:[^"\\]|\\.)*)"/g;
const mmTitle = {};
let mm2;
while ((mm2 = mmRe.exec(mm))) mmTitle[mm2[1].toLowerCase()] = mm2[2];
// short-titles.ts key
const st = fs.readFileSync("src/data/short-titles.ts", "utf8");
const stKeys = new Set([...st.matchAll(/^\s*"?(b0[a-z0-9]+|1688-[a-z0-9-]+)"?:/gim)].map(x => x[1].toLowerCase()));
const finalCn = out.filter(p => {
  const ov = mmTitle[p.asin];
  if (ov && !cjk.test(ov)) return false;
  if (stKeys.has(p.asin)) return false;
  return true;
});
console.log("原始中文标题产品数:", out.length);
console.log("有英文覆盖(materials-map):", out.filter(p => { const ov = mmTitle[p.asin]; return ov && !cjk.test(ov); }).length);
console.log("有手工短标题(short-titles):", out.filter(p => !(mmTitle[p.asin] && !cjk.test(mmTitle[p.asin])) && stKeys.has(p.asin)).length);
console.log("最终仍显示中文标题:", finalCn.length);
finalCn.forEach(p => console.log("-", p.asin, "|", p.title));
