import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const reportDir = path.join(root, 'report', 'scenes');
const input = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(reportDir, 'pilot-matches.json');

const matches = JSON.parse(fs.readFileSync(input, 'utf8'));
const products = JSON.parse(fs.readFileSync(path.join(reportDir, 'product-index.json'), 'utf8'));
const byAsin = new Map(products.map((p) => [p.asin, p]));

const SYNONYMS = {
  pompom: ['pompom', 'pom pom', 'pom-pom'],
  fauxfur: ['fauxfur', 'faux fur', 'faux-fur'],
  knit: ['knit', 'knitted', 'knitwear'],
  floral: ['floral', 'flower', 'bloom'],
  linen: ['linen', 'linen-like'],
  cotton: ['cotton', 'cotton-like'],
  corduroy: ['corduroy', 'cord'],
  openwork: ['openwork', 'open work'],
  embossed: ['embossed', 'embossing'],
  velvet: ['velvet'],
  tufted: ['tufted', 'tufting'],
  quilted: ['quilted', 'quilting', 'quilt'],
  lace: ['lace', 'lacy'],
  jacquard: ['jacquard'],
  tassel: ['tassel', 'tassels'],
  fringe: ['fringe', 'fringed'],
  ruffle: ['ruffle', 'ruffled'],
  striped: ['striped', 'stripe', 'stripes'],
  patchwork: ['patchwork'],
  checked: ['checked', 'check', 'checks'],
  boucle: ['boucle', 'bouclé'],
  sherpa: ['sherpa'],
  shag: ['shag', 'shaggy'],
  satin: ['satin'],
  percale: ['percale'],
  woven: ['woven', 'weave'],
  embroidered: ['embroidered', 'embroidery'],
  round: ['round', 'circular'],
  oval: ['oval'],
};

const SHAPE_FAMILIES = {
  soft: ['oval', 'round', 'circular'],
  hard: [
    'square', 'rectangle', 'rect',
    '45 x 45', '45x45', '40 x 40', '40x40', '50 x 50', '50x50',
    '160 x 200', '160x200', '200 x 250', '200x250', '200 x 300', '200x300',
    '200 x 400', '200x400', '80 x 160', '80x160', '80 x 200', '80x200',
    '60 x 120', '60x120', '100 x 160', '100x160', '120 x 160', '120x160',
    '120 x 200', '120x200', '100 x 200', '100x200', '95 x 45', '95x45',
    '180 x 250', '180x250',
    '50 x 68', '50x68', '50 x 71', '50x71', '130 x 190', '130x190', '180 x 200', '180x200',
    '40 x 60', '40x60', '50 x 80', '50x80', '60 x 90', '60x90', '80 x 120', '80x120',
  ],
  lumbar: ['30 x 50', '30x50', '12 x 20', '12x20', 'lumbar'],
};

const SCENE_SHAPE_FAMILY = {
  oval: 'soft', round: 'soft', square: 'hard', rect: 'hard', lumbar: 'lumbar', na: null,
};

const LIGHT_TOKENS = ['cream', 'white', 'beige', 'ivory', 'oat', 'off white', 'light grey', 'light gray'];

const MATERIAL_KEYWORDS = [
  'fur', 'fauxfur', 'boucle', 'linen', 'cotton', 'corduroy', 'knit', 'satin',
  'velvet', 'sateen', 'sherpa', 'shag', 'woven', 'hollowfibre',
];

const norm = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const has = (text, keyword) => {
  const words = SYNONYMS[keyword] || [keyword];
  return words.some((w) => text.includes(norm(w)));
};

const productShapeFamilies = (text) =>
  Object.entries(SHAPE_FAMILIES)
    .filter(([, tokens]) => tokens.some((t) => text.includes(norm(t))))
    .map(([fam]) => fam);

const productCategory = (p) => {
  const t = norm(`${p.title} ${p.fullTitle}`);
  if (/(rug|carpet)/.test(t)) return 'rug';
  if (/(bedding set|duvet cover|fitted sheet)/.test(t)) return null;
  if (/(pillow|cushion)/.test(t)) return 'pillow';
  if (/(blanket|throw)/.test(t)) return 'blanket';
  return null;
};

let checked = 0;
let critical = 0;
let known = 0;
let config = 0;
const criticalRows = [];
const shapeRows = [];
const lightRows = [];
const knownRows = [];
const configRows = [];

for (const scene of matches) {
  for (let i = 0; i < scene.items.length; i++) {
    const item = scene.items[i];
    const p = byAsin.get(item.asin);
    if (!p) {
      critical++;
      criticalRows.push([scene.slug, i + 1, item.asin, '产品不在索引', '']);
      continue;
    }
    checked++;
    if (!Array.isArray(item.expect) || item.expect.length === 0) {
      config++;
      configRows.push([scene.slug, i + 1, `${p.title} (${p.asin})`, '缺少 expect 配置']);
      continue;
    }
    const productText = norm(
      [p.title, p.fullTitle, ...(p.colors || []), ...(p.tags || [])].join(' ')
    );
    for (const keyword of item.expect) {
      if (!has(productText, keyword)) {
        critical++;
        criticalRows.push([
          scene.slug,
          i + 1,
          `${p.title} (${p.asin})`,
          keyword,
          `标题/属性里没有 ${keyword}`,
        ]);
      }
    }
    for (const keyword of item.known || []) {
      if (!has(productText, keyword)) {
        known++;
        knownRows.push([
          scene.slug,
          i + 1,
          `${p.title} (${p.asin})`,
          keyword,
          '已知折中，非本轮错误',
        ]);
      }
    }

    const category = productCategory(p);
    if (category) {
      if (item.sceneShape === undefined) {
        config++;
        configRows.push([scene.slug, i + 1, `${p.title} (${p.asin})`, `${category} 类锚点缺少 sceneShape（oval/round/square/rect/lumbar/na）`]);
      } else if (!(item.sceneShape in SCENE_SHAPE_FAMILY)) {
        config++;
        configRows.push([scene.slug, i + 1, `${p.title} (${p.asin})`, `sceneShape 无效: ${item.sceneShape}`]);
      } else {
        const fam = SCENE_SHAPE_FAMILY[item.sceneShape];
        if (fam) {
          const fams = productShapeFamilies(productText);
          if (!fams.length) {
            known++;
            knownRows.push([scene.slug, i + 1, `${p.title} (${p.asin})`, item.sceneShape, '产品标题无形状词，需人工核对']);
          } else if (!fams.includes(fam)) {
            if (item.shapeKnown) {
              known++;
              knownRows.push([scene.slug, i + 1, `${p.title} (${p.asin})`, item.sceneShape, `形状跨族（场景 ${item.sceneShape} / 产品 ${fams.join('+')}），已拍板保留`]);
            } else {
              critical++;
              shapeRows.push([scene.slug, i + 1, `${p.title} (${p.asin})`, `场景 ${item.sceneShape}`, `产品形状 ${fams.join('+')}，跨族冲突`]);
            }
          }
        }
      }
    }

    const isLight = LIGHT_TOKENS.some((t) => productText.includes(t));
    if (isLight && !item.expect.some((k) => MATERIAL_KEYWORDS.includes(k))) {
      critical++;
      lightRows.push([scene.slug, i + 1, `${p.title} (${p.asin})`, '缺材质词', '浅色产品 expect 必须含材质词（fur/boucle/linen/cotton/knit/...）']);
    }
  }
}

const lines = [
  '# 场景锚点关键词检查',
  '',
  `- 生成时间：${new Date().toISOString().slice(0, 10)}`,
  `- 输入：\`${path.relative(root, input).replace(/\\/g, '/')}\``,
  '- 规则：每个锚点必须配置 `expect`（场景里看到的材质/工艺/图案词）；脚本检查这些词是否出现在产品 title/fullTitle/colors/tags 中。`known` 用于记录已知折中（如场景圆形、目录椭圆）。',
  '- 形状守卫：地毯/枕/毯类锚点必须声明 `sceneShape`（oval/round/square/rect/lumbar/na）；软形(oval/round)与硬形(square/rect)跨族 = 关键冲突，已拍板的用 `shapeKnown: true` 记录。浅色产品（cream/white/beige/ivory/oat）的 expect 必须含材质词。',
  `- 结果：检查 ${checked} 个锚点；关键缺失 **${critical}**（关键词 ${criticalRows.length} + 形状 ${shapeRows.length} + 浅色材质 ${lightRows.length}），已知差异 **${known}**，配置缺失 **${config}**。`,
  '',
];

if (criticalRows.length) {
  lines.push('## 关键缺失（上线前必须处理）', '');
  lines.push('| 场景 | 锚点 | 产品 | 关键词 | 说明 |');
  lines.push('|---|---|---|---|---|');
  for (const r of criticalRows) lines.push(`| \`${r[0]}\` | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} |`);
  lines.push('');
}

if (shapeRows.length) {
  lines.push('## 形状冲突（上线前必须处理）', '');
  lines.push('| 场景 | 锚点 | 产品 | 场景形状 | 说明 |');
  lines.push('|---|---|---|---|---|');
  for (const r of shapeRows) lines.push(`| \`${r[0]}\` | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} |`);
  lines.push('');
}

if (lightRows.length) {
  lines.push('## 浅色产品缺材质词（上线前必须处理）', '');
  lines.push('| 场景 | 锚点 | 产品 | 问题 | 说明 |');
  lines.push('|---|---|---|---|---|');
  for (const r of lightRows) lines.push(`| \`${r[0]}\` | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} |`);
  lines.push('');
} else {
  lines.push('## 关键项全部通过', '');
}

if (configRows.length) {
  lines.push('## 配置缺失', '');
  lines.push('| 场景 | 锚点 | 产品 | 问题 |');
  lines.push('|---|---|---|---|');
  for (const r of configRows) lines.push(`| \`${r[0]}\` | ${r[1]} | ${r[2]} | ${r[3]} |`);
  lines.push('');
}

if (knownRows.length) {
  lines.push('## 已知差异（记录，不阻塞）', '');
  lines.push('| 场景 | 锚点 | 产品 | 场景关键词 | 说明 |');
  lines.push('|---|---|---|---|---|');
  for (const r of knownRows) lines.push(`| \`${r[0]}\` | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} |`);
  lines.push('');
}

const out = path.join(reportDir, 'keyword-check.md');
fs.writeFileSync(out, lines.join('\n') + '\n', 'utf8');
console.log(out);
console.log(`checked=${checked} critical=${critical} known=${known} config=${config}`);
if (critical > 0 || config > 0) process.exitCode = 1;
