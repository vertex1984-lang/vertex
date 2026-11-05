// 修复 _rename-rug-color-titles-2.js 误改：GT010/GT029/GT070 三色在 products-materials.ts 的
// id/asin/variant-id/图片url 中的色号被替换成色名（handle 是小写未受影响，标题/altText 不含
// 家族前缀也不受影响）。策略：只把带家族前缀的标识串换回色号；materials-map.ts 只修图片路径
//（key 本来就是小写色号，title 保留新色名）。
const fs = require('fs');
const FIX = [
  ['745181807454-Berber Diamond', '745181807454-GT010'],
  ['745181807454-Nordic Grey', '745181807454-GT029'],
  ['745181807454-Floral Patchwork', '745181807454-GT070'],
];
let total = 0;
// products-materials.ts：id/asin/variant-id/url 统一带家族前缀，整体换回
{
  const f = 'src/data/products-materials.ts';
  let s = fs.readFileSync(f, 'utf8');
  for (const [bad, good] of FIX) {
    const n = s.split(bad).length - 1;
    s = s.split(bad).join(good);
    total += n;
    console.log(`${f}: ${bad} → ${good} × ${n}`);
  }
  fs.writeFileSync(f, s);
}
// materials-map.ts：只修 images 数组里的路径（前缀带斜杠，精确限定）
{
  const f = 'src/data/materials-map.ts';
  let s = fs.readFileSync(f, 'utf8');
  for (const [bad, good] of FIX) {
    const badPath = `/images/products/${bad}/`;
    const goodPath = `/images/products/${good}/`;
    const n = s.split(badPath).length - 1;
    s = s.split(badPath).join(goodPath);
    total += n;
    console.log(`${f}: ${badPath} → ${goodPath} × ${n}`);
  }
  fs.writeFileSync(f, s);
}
console.log('total:', total);
