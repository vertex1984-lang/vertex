// 给 LINEN3 五色产品在 images 数组末尾追加旧主图 6.webp
const fs = require('fs');
const FILE = 'src/data/products-materials.ts';
const COLORS = ['SAGE', 'CHARCOAL', 'DUSTYBLUE', 'IVORY', 'OATMEAL'];

let src = fs.readFileSync(FILE, 'utf8');
let changed = 0;

for (const c of COLORS) {
  const asin = `LINEN3-${c}-DUVET`;
  const re = new RegExp(
    '("url": "/images/products/' + asin + '/5\\.webp",\\r?\\n' +
    '        "altText": "([^"]*)",\\r?\\n' +
    '        "width": 1024,\\r?\\n' +
    '        "height": 1024\\r?\\n' +
    '      })\\r?\\n' +
    '(    \\],)'
  );
  const m = src.match(re);
  if (!m) { console.error('NOT FOUND:', asin); continue; }
  const alt = m[2];
  const block5 = m[1];
  const indentClose = m[3];
  const nl = src.includes('\r\n') ? '\r\n' : '\n';
  const entry6 =
    ',' + nl +
    '      {' + nl +
    '        "url": "/images/products/' + asin + '/6.webp",' + nl +
    '        "altText": "' + alt + '",' + nl +
    '        "width": 1024,' + nl +
    '        "height": 1024' + nl +
    '      }' + nl;
  src = src.replace(re, block5 + entry6 + indentClose);
  changed++;
  console.log('appended 6.webp for', asin);
}

if (changed === COLORS.length) {
  fs.writeFileSync(FILE, src);
  console.log('all done, file written');
} else {
  console.error('only', changed, 'of', COLORS.length, 'matched — file NOT written');
  process.exit(1);
}
