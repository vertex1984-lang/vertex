// 一次性脚本：GINGHAM4 格纹四件套 3 变体迁移到 1688 风格 sku（改名/替换，非新增）
// BLACK→1688-1071466105053-C1（组首不变）/ BLUE→C2 / GREY→C3
const fs = require('fs');

const MAP = [
  { oldASIN: 'GINGHAM4-BLACK-QUEEN', newASIN: '1688-1071466105053-C1', oldA: 'gingham4-black-queen', newA: '1688-1071466105053-c1', oldHandle: 'makimoo-queen-bedding-set-4-piece-cotton-feel-gingham-black-queen' },
  { oldASIN: 'GINGHAM4-BLUE-QUEEN', newASIN: '1688-1071466105053-C2', oldA: 'gingham4-blue-queen', newA: '1688-1071466105053-c2', oldHandle: 'makimoo-queen-bedding-set-4-piece-cotton-feel-gingham-blue-queen' },
  { oldASIN: 'GINGHAM4-GREY-QUEEN', newASIN: '1688-1071466105053-C3', oldA: 'gingham4-grey-queen', newA: '1688-1071466105053-c3', oldHandle: 'makimoo-queen-bedding-set-4-piece-cotton-feel-gingham-grey-queen' },
];

// 通用：全文替换（先 handle，再大写 ASIN，再小写 asin；handle 不含 GINGHAM4- 字串，顺序安全）
function migrateFile(file, { handles = true } = {}) {
  let s = fs.readFileSync(file, 'utf8');
  let n = 0;
  for (const m of MAP) {
    if (handles) {
      const c = s.split(m.oldHandle).length - 1;
      s = s.split(m.oldHandle).join(m.oldHandle + '-' + m.newA);
      n += c;
    }
    for (const [from, to] of [[m.oldASIN, m.newASIN], [m.oldA, m.newA]]) {
      const c = s.split(from).length - 1;
      s = s.split(from).join(to);
      n += c;
    }
  }
  fs.writeFileSync(file, s);
  console.log(`OK: ${file} (${n} 处替换)`);
}

// 1) products-materials.ts：id/asin/variant id/images url/handle 全覆盖
migrateFile('src/data/products-materials.ts');
// 2) materials-map.ts：key + sku 字段 + images 路径
migrateFile('src/data/materials-map.ts');
// 3) 五个 key 映射文件
migrateFile('src/data/materials-short-bullets.ts');
migrateFile('src/data/short-titles.ts');
migrateFile('src/data/specs-overrides.ts');
migrateFile('src/data/product-weights.ts'); // build 链会重算，此处保持构建前一致
migrateFile('src/data/image-aspect-overrides.ts');
// 6) new-product-handles.ts：只换 handle（文件内无 asin 字串）
{
  let s = fs.readFileSync('src/data/new-product-handles.ts', 'utf8');
  for (const m of MAP) s = s.split(m.oldHandle).join(m.oldHandle + '-' + m.newA);
  fs.writeFileSync('src/data/new-product-handles.ts', s);
  console.log('OK: src/data/new-product-handles.ts (3 handle)');
}

// 4) variant-groups.ts：members asin/handle + 组 id
{
  const file = 'src/data/variant-groups.ts';
  let s = fs.readFileSync(file, 'utf8');
  for (const m of MAP) {
    s = s.split(m.oldHandle).join(m.oldHandle + '-' + m.newA);
    s = s.split(m.oldA).join(m.newA);
  }
  if (!s.includes("id: 'GINGHAM4'")) throw new Error('variant-groups id anchor not found');
  s = s.replace(
    `id: 'GINGHAM4',`,
    `id: '1688-1071466105053',`
  );
  s = s.replace(
    '// Cotton Feel（聚酯水洗棉手感）格纹四件套（3 色 × 仅 Queen，2026-10-26 用户定）',
    '// Cotton Feel（聚酯水洗棉手感）格纹四件套（3 色 × 仅 Queen，2026-10-26 用户定；同日由 GINGHAM4 迁移 1688 sku，Black 仍为组首）'
  );
  fs.writeFileSync(file, s);
  console.log('OK: variant-groups');
}

// 5) bedding-families.ts：classifySet 换前缀 + 补 familyKeyOf / beddingUsSizeLabel 两条规则（同 muslin 口径）
{
  const file = 'src/data/bedding-families.ts';
  let s = fs.readFileSync(file, 'utf8');
  const nl = s.includes('\r\n') ? '\r\n' : '\n';
  // classifySet：gingham4- 前缀规则 → 1688-1071466105053
  const oldRule = `if (a.startsWith('gingham4-')) return 'four';`;
  if (!s.includes(oldRule)) throw new Error('classifySet gingham4 rule not found');
  s = s.replace(oldRule, `if (a.startsWith('1688-1071466105053')) return 'four';`);
  s = s.replace(
    '// 2026-10-26 用户定：Cotton Feel（聚酯水洗棉手感）格纹四件套（3 色 × 仅 Queen），归 four',
    '// 2026-10-26 用户定：Cotton Feel（聚酯水洗棉手感）格纹四件套（3 色 × 仅 Queen，原 gingham4- 前缀，同日迁移 1688 sku），归 four'
  );
  // familyKeyOf：跟在 muslin 规则后加同款
  const fkAnchor = "if (a.startsWith('1688-1025015219200')) return `1688-1025015219200::${duvetColorOf(asin)}`;";
  if (!s.includes(fkAnchor)) throw new Error('familyKeyOf muslin anchor not found');
  const fkInsert = [
    `  // 2026-10-26：1688-1071466105053 Cotton Feel 格纹四件套——同 muslin 口径（key = 前缀::颜色，`,
    `  // 颜色取变体组成员色；迁移后 ASIN 无颜色段，colorOf 会误取数字段）`,
    `  if (a.startsWith('1688-1071466105053')) return \`1688-1071466105053::\${duvetColorOf(asin)}\`;`,
  ].join(nl);
  const i = s.indexOf(fkAnchor);
  const j = s.indexOf('\n', i);
  s = s.slice(0, j + 1) + fkInsert + nl + s.slice(j + 1);
  // beddingUsSizeLabel：跟在 muslin 特判后加同款
  const szAnchor = `if (asin.toLowerCase().startsWith('1688-1025015219200')) return 'Queen';`;
  if (!s.includes(szAnchor)) throw new Error('beddingUsSizeLabel muslin anchor not found');
  const szInsert = [
    `  // 2026-10-26：1688-1071466105053 Cotton Feel 格纹四件套仅 Queen（迁移后 ASIN 无 -QUEEN 尾段，同 muslin 特判）`,
    `  if (asin.toLowerCase().startsWith('1688-1071466105053')) return 'Queen';`,
  ].join(nl);
  const k = s.indexOf(szAnchor);
  const l = s.indexOf('\n', k);
  s = s.slice(0, l + 1) + szInsert + nl + s.slice(l + 1);
  fs.writeFileSync(file, s);
  console.log('OK: bedding-families');
}

// 7) group-cards.ts：两处白名单 'GINGHAM4' → '1688-1071466105053'，注释同步
{
  const file = 'src/lib/group-cards.ts';
  let s = fs.readFileSync(file, 'utf8');
  const cnt = s.split(`|| key === 'GINGHAM4'`).length - 1;
  if (cnt !== 2) throw new Error('group-cards GINGHAM4 whitelist count = ' + cnt);
  s = s.split(`|| key === 'GINGHAM4'`).join(`|| key === '1688-1071466105053'`);
  s = s.replace(
    '// 2026-10-26 用户定：GINGHAM4 同口径（组首 = Black Queen）；其他变体组代表规则不变',
    '// 2026-10-26 用户定：GINGHAM4 同口径（组首 = Black Queen；同日迁移 1688-1071466105053，组首不变）；其他变体组代表规则不变'
  );
  s = s.replace(
    '// 2026-10-26：GINGHAM4 同口径（色卡顺序 = 组内成员顺序 Black/Blue/Grey）；',
    '// 2026-10-26：GINGHAM4（现 1688-1071466105053）同口径（色卡顺序 = 组内成员顺序 Black/Blue/Grey）；'
  );
  fs.writeFileSync(file, s);
  console.log('OK: group-cards');
}

console.log('MIGRATION DONE');
