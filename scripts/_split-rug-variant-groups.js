// 2026-11-05 用户定：1052742241013 / 745181807454 两变体组按颜色拆分为独立家族，色号改描述性色名
const fs = require('fs');
const PATH = 'src/data/variant-groups.ts';
const RENAME = {
  'BS-1': 'Tribal Rust', 'BS-2': 'Ivory Kilim', 'BS-3': 'Desert Sand', 'BS-4': 'Aqua Floral',
  'BS-5': 'Olive Medallion', 'BS-6': 'Vintage Cream', 'BS-7': 'Coral Kazak', 'BS-8': 'Navy Heriz',
  'BS-9': 'Indigo Floral', 'BS-10': 'Stone Grey', 'BS-11': 'Crimson Medallion', 'BS-12': 'Ivory Beige',
  'BS-13': 'Sage Medallion', 'BS-14': 'Mineral Teal', 'BS-15': 'Spiced Terracotta',
  'GT006': 'Rainbow Stripe', 'GT010': 'Berber Diamond', 'GT013': 'Indigo Lattice',
  'GT016': 'Pastel Damask', 'GT017': 'Ivory Diamond Rows', 'GT021': 'Boho Medallion',
  'GT027': 'Amber Medallion', 'GT029': 'Nordic Grey', 'GT030': 'Sunset Stripe',
  'GT070': 'Floral Patchwork', 'GT078': 'Noir Floral',
};
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

let src = fs.readFileSync(PATH, 'utf8');

function splitGroup(src, groupId) {
  const startMarker = `    id: '${groupId}',`;
  const startIdx = src.indexOf(startMarker);
  if (startIdx < 0) throw new Error('group not found: ' + groupId);
  // block starts at the '{' line before id
  const blockStart = src.lastIndexOf('  {', startIdx);
  // find matching end: the closing '  },' after members array
  const endIdx = src.indexOf('\n  },', startIdx);
  if (endIdx < 0) throw new Error('group end not found: ' + groupId);
  const blockEnd = endIdx + '\n  },'.length;
  const block = src.slice(blockStart, blockEnd);

  const re = /\{ asin: '([^']+)', handle: '([^']+)', color: '([^']+)'(?:, size: '([^']+)')? \}/g;
  let m; const members = [];
  while ((m = re.exec(block))) members.push({ asin: m[1], handle: m[2], color: m[3], size: m[4] });
  if (!members.length) throw new Error('no members parsed: ' + groupId);

  const colorOrder = [];
  const byColor = new Map();
  for (const mem of members) {
    const newColor = RENAME[mem.color] || mem.color;
    if (!byColor.has(newColor)) { byColor.set(newColor, []); colorOrder.push(newColor); }
    byColor.get(newColor).push({ ...mem, color: newColor });
  }

  const blocks = colorOrder.map((color) => {
    const lines = byColor.get(color).map((mem) =>
      `    { asin: '${mem.asin}', handle: '${mem.handle}', color: '${mem.color}'${mem.size ? `, size: '${mem.size}'` : ''} },`
    ).join('\n');
    return `  {\n    id: '${groupId}-${slug(color)}',\n    optionName: 'Color',\n    members: [\n${lines}\n    ],\n  },`;
  });

  const comment = `  // 2026-11-05 用户定：原 ${groupId} 家族按颜色拆分为 ${colorOrder.length} 个独立家族（每色单独展示，色号已改描述性色名）\n`;
  return { next: src.slice(0, blockStart) + comment + blocks.join('\n') + src.slice(blockEnd), colors: colorOrder };
}

const r1 = splitGroup(src, '1052742241013');
const r2 = splitGroup(r1.next, '745181807454');
fs.writeFileSync(PATH, r2.next);
console.log('1052742241013 ->', r1.colors.length, 'families:', r1.colors.join(' | '));
console.log('745181807454 ->', r2.colors.length, 'families:', r2.colors.join(' | '));
