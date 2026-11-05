const ExcelJS = require('exceljs');
(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/12021/Desktop/bedding-sku表.xlsx');
  const ws = wb.getWorksheet('Blanket');
  console.log('rows', ws.rowCount, 'cols', ws.columnCount);
  const out = [];
  ws.eachRow((row, n) => {
    const cells = [];
    for (let c = 1; c <= 18; c++) {
      const v = row.getCell(c).value;
      let s = '';
      if (v == null) s = '';
      else if (typeof v === 'object') {
        if (v.hyperlink) s = 'LINK:' + v.hyperlink + '|' + (v.text || '');
        else if (v.richText) s = v.richText.map((r) => r.text).join('');
        else if (v.result != null) s = String(v.result);
        else s = JSON.stringify(v);
      } else s = String(v);
      cells.push(s);
    }
    out.push(n + '\t' + cells.join('\t'));
  });
  require('fs').writeFileSync('scripts/_shots/blanket-tab-dump.txt', out.join('\n'), 'utf8');
  console.log('dumped to scripts/_shots/blanket-tab-dump.txt');
})();
