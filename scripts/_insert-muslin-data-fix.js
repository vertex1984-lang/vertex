// 一次性补丁：修 _insert-muslin-data.js 前缀去重误跳的两处
// 1) new-product-handles.ts 补 c2/c3 两条 handle；2) bedding-families.ts 补 familyKeyOf 规则
const fs = require('fs');

// 1) new-product-handles.ts
{
  const file = 'src/data/new-product-handles.ts';
  let s = fs.readFileSync(file, 'utf8');
  const anchor = `  'cotton-blend-muslin-double-gauze-4-piece-bedding-set-grey-queen-1688-1025015219200-c1',  // 2026-10-26：Cotton Blend Muslin 双层纱四件套（Grey，仅 Queen）`;
  const i = s.indexOf(anchor);
  if (i < 0) throw new Error('new-product-handles anchor not found');
  const j = s.indexOf('\n', i);
  const nl = s[j - 1] === '\r' ? '\r\n' : '\n';
  const add = [];
  if (!s.includes('1688-1025015219200-c2\',')) add.push(`  'cotton-blend-muslin-double-gauze-4-piece-bedding-set-navy-queen-1688-1025015219200-c2',  // 2026-10-26：Cotton Blend Muslin 双层纱四件套（Navy，仅 Queen）`);
  if (!s.includes('1688-1025015219200-c3\',')) add.push(`  'cotton-blend-muslin-double-gauze-4-piece-bedding-set-brown-queen-1688-1025015219200-c3',  // 2026-10-26：Cotton Blend Muslin 双层纱四件套（Brown，仅 Queen）`);
  if (add.length) {
    s = s.slice(0, j + 1) + add.join(nl) + nl + s.slice(j + 1);
    fs.writeFileSync(file, s);
    console.log('OK: new-product-handles 补', add.length, '条');
  } else console.log('SKIP: new-product-handles');
}

// 2) bedding-families.ts familyKeyOf
{
  const file = 'src/data/bedding-families.ts';
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes('1688-1025015219200::')) {
    const anchor = `if (a.startsWith('1688-916370884976')) return '1688-916370884976';`;
    const i = s.indexOf(anchor);
    if (i < 0) throw new Error('familyKeyOf anchor not found');
    const j = s.indexOf('\n', i);
    const nl = s[j - 1] === '\r' ? '\r\n' : '\n';
    const insert = [
      `  // 2026-10-26：1688-1025015219200 Cotton Blend 双层纱四件套——同前缀同色归一个 family（key = 前缀::颜色，`,
      `  // 颜色取变体组成员色，同 duvet 二维家族口径；ASIN 无颜色段，colorOf 会误取数字段）`,
      `  if (a.startsWith('1688-1025015219200')) return \`1688-1025015219200::\${duvetColorOf(asin)}\`;`,
    ].join(nl);
    s = s.slice(0, j + 1) + insert + nl + s.slice(j + 1);
    fs.writeFileSync(file, s);
    console.log('OK: familyKeyOf 规则');
  } else console.log('SKIP: familyKeyOf');
}
console.log('PATCH DONE');
