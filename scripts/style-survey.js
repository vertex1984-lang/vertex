// 一次性调研：统计产品标题中的风格词分布（Shop by Style 模块预设依据）
const fs = require('fs');
const src = fs.readFileSync('src/data/products.ts', 'utf8') + fs.readFileSync('src/data/products-materials.ts', 'utf8');
const titles = [...src.matchAll(/"title":\s*"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
console.log('total titles:', titles.length);

const styles = {
  'boho/bohemian': /boho|bohemian/i,
  'modern/contemporary': /modern|contemporary|minimalist/i,
  farmhouse: /farmhouse/i,
  rustic: /rustic/i,
  'persian/oriental': /persian|oriental/i,
  'vintage/distressed': /vintage|distressed|retro|antique/i,
  'african/tribal/ethnic': /african|tribal|ethnic/i,
  'japanese/zen': /japanese|japan|zen|wabi/i,
  'coastal/nautical': /coastal|beach|nautical/i,
  'floral/botanical': /floral|botanical|leaf|leaves|flower/i,
  geometric: /geometric/i,
  'traditional/classic': /traditional|classic/i,
  'country/cottage': /country|cottage/i,
  french: /french/i,
  tropical: /tropical|palm/i,
  'scandinavian/nordic': /scandi|nordic/i,
  'hotel/luxury': /hotel|luxury/i,
  solid: /solid/i,
  striped: /stripe/i,
  'rattan/woven/bamboo': /rattan|wicker|woven|bamboo/i,
  jacquard: /jacquard/i,
  'tassel/fringe/pom': /tassel|fringe|pom/i,
  medallion: /medallion/i,
  plaid_check: /plaid|check/i,
  marble: /marble/i,
  velvet: /velvet/i,
  linen: /linen/i,
};

for (const [k, re] of Object.entries(styles)) {
  const hits = titles.filter((t) => re.test(t));
  if (hits.length) {
    console.log('\n' + k, '=>', hits.length);
    hits.slice(0, 3).forEach((t) => console.log('   ', t.slice(0, 80)));
  }
}
