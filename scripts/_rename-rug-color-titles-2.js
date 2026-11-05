// products-materials.ts 为多行 JSON 块：asin 与 title 不同行，按块内 asin 判定是否替换
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
const codes = Object.keys(RENAME).sort((a, b) => b.length - a.length);
const FAMILY = /^(1052742241013|745181807454)/i;
const f = 'src/data/products-materials.ts';
const lines = fs.readFileSync(f, 'utf8').split('\n');
let inFamily = false, hits = 0;
const out = lines.map((line) => {
  const am = line.match(/"asin": "([^"]+)"/);
  if (am) inFamily = FAMILY.test(am[1]);
  if (!inFamily) return line;
  let next = line;
  for (const code of codes) {
    const re = new RegExp(`(?<![A-Za-z0-9])${code.replace('-', '\-')}(?![A-Za-z0-9])`, 'g');
    next = next.replace(re, () => { hits++; return RENAME[code]; });
  }
  return next;
});
fs.writeFileSync(f, out.join('\n'));
console.log('replacements:', hits);
