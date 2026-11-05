// 2026-11-05：标题内色号（BS-x / GTxxx）改描述性色名；仅处理两个地毯家族的条目所在行
const fs = require('fs');
const RENAME = {
  'BS-13': 'Sage Medallion', 'BS-14': 'Mineral Teal', 'BS-15': 'Spiced Terracotta',
  'BS-10': 'Stone Grey', 'BS-11': 'Crimson Medallion', 'BS-12': 'Ivory Beige',
  'BS-1': 'Tribal Rust', 'BS-2': 'Ivory Kilim', 'BS-3': 'Desert Sand', 'BS-4': 'Aqua Floral',
  'BS-5': 'Olive Medallion', 'BS-6': 'Vintage Cream', 'BS-7': 'Coral Kazak', 'BS-8': 'Navy Heriz',
  'BS-9': 'Indigo Floral',
  'GT006': 'Rainbow Stripe', 'GT010': 'Berber Diamond', 'GT013': 'Indigo Lattice',
  'GT016': 'Pastel Damask', 'GT017': 'Ivory Diamond Rows', 'GT021': 'Boho Medallion',
  'GT027': 'Amber Medallion', 'GT029': 'Nordic Grey', 'GT030': 'Sunset Stripe',
  'GT070': 'Floral Patchwork', 'GT078': 'Noir Floral',
};
// 先长后短，避免 BS-1 吃掉 BS-13 的前缀
const codes = Object.keys(RENAME).sort((a, b) => b.length - a.length);
const FAMILY = /1052742241013|745181807454/i;
const FILES = ['src/data/products-materials.ts', 'src/data/materials-map.ts', 'src/data/short-titles.ts'];
for (const f of FILES) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  let hits = 0;
  const out = lines.map((line) => {
    if (!FAMILY.test(line)) return line;
    let next = line;
    for (const code of codes) {
      // 只替换标题里的色号 token（大写、边界为非字母数字），不动 handle 里的小写 bs-x
      const re = new RegExp(`(?<![A-Za-z0-9])${code.replace('-', '\-')}(?![A-Za-z0-9])`, 'g');
      next = next.replace(re, () => { hits++; return RENAME[code]; });
    }
    return next;
  });
  fs.writeFileSync(f, out.join('\n'));
  console.log(f, 'replacements:', hits);
}
