/**
 * decor-mainimg-generate.js — Decor 类目灰底主图生成（seedream 5.0 pro i2i，2026-11-07）
 * 用法: node scripts/decor-mainimg-generate.js <ASIN>
 *   ASIN = public/images/products/ 下的图目录名，如 743606980882-C41
 * 参考: public/images/products/<ASIN>/1.webp（现有主图，保持角度仅换灰底；挂画类=从场景取出）
 * 输出: report/decor-mainimg/gen/<ASIN>.webp（验收对比后再落 products/）
 * 密钥: process.env.ARK_API_KEY 或 scripts/.ark-api-key（已 .gitignore）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const GEN = path.join(ROOT, 'report', 'decor-mainimg', 'gen');

// 竖放单体几何（长宽比按产品规格在 pattern/geometry 里注明）
const RECT_VERT =
  '{{NOUN}}为长方形，长边沿画面竖直方向放置（竖放）；{{NOUN}}长度约占画面高度的 85%，' +
  '{{NOUN}}上边缘位于画面高度约 8% 处、下边缘位于画面高度约 92% 处，宽度按真实长宽比等比呈现（{{RATIO}}），' +
  '左右对称留白，严禁改变长宽比';

const SET2_VERT =
  '两块同款{{NOUN}}前后错落摆放：后方一块位于画面上半部（中心略偏左），前方一块位于画面下半部（中心略偏右），' +
  '前方一块的上沿覆盖后方一块的下沿约 12%，两块长边均沿画面竖直方向（竖放）、无透视变形；' +
  '每块均为细长条形，长宽比必须严格保持 {{RATIO}}（长边明显长于宽边，视觉上细长），' +
  '严禁画成接近正方形或 1.5:1 的短宽形状；每块长度约占画面高度的 55%（约 1000 像素），' +
  '宽度按长宽比等比换算，组合整体约占画面高度的 88%，左右对称留白';

// 长宽比 ≥2:1 的套装改用横放对角错落（2026-11-03 用户定：与原图构图一致，比例保真度最高）
const SET2_DIAG =
  '两块同款{{NOUN}}沿对角方向前后错落摆放（与参考图中的两件布局一致）：后方一块位于画面上部（略偏左），前方一块位于画面下部（略偏右），' +
  '前方一块的上沿覆盖后方一块的下沿约 15%；两块均为横向长方形（细长条形，长:宽约 {{RATIO}}），' +
  '每块长度约占画面宽度的 76%，正上方垂直俯拍、无透视变形、严禁改变长宽比';

const OVAL_VERT =
  '地毯为椭圆形，长轴沿画面竖直方向放置（竖放），轮廓平滑对称无变形；椭圆长轴约占画面高度的 85%，' +
  '椭圆上边缘位于画面高度约 8% 处、下边缘位于画面高度约 92% 处，椭圆短轴约为长轴的 62%，左右对称留白';

// 椭圆扎染家族通用花色描述模板（第 4 批 14 色）
const TD_PATTERN =
  '通体{COLOR}调的扎染渐变椭圆形长绒地毯：无具体图案，{SHADE}，' +
  '表面为细密蓬松的长绒 shag 质感，绒毛细密均匀；整体色调深浅与参考图一致{ANTI}';

const FAMILIES = {
  // ===== wall-art：参考图是挂墙场景图，需取出带框画 =====
  '807393887857': {
    noun: '带木框装饰画',
    geometry:
      '参考图是{{NOUN}}挂在墙上的室内场景图：将带框装饰画从场景中完整取出，以正面直角平视视角单独展示（画面朝前、不倾斜），' +
      '画框外缘约占画面宽度的 72%，居中，四周均匀留浅灰背景，画框底缘有轻微自然的下垂投影。',
    pattern: '画芯图案、配色、木框样式与参考图完全一致，一字不差地保留原画内容。',
    only: '一幅带框装饰画',
  },
  '730512046265': {
    noun: '带木框亚麻装饰画',
    geometry:
      '参考图是{{NOUN}}挂在墙上的室内场景图：将带框装饰画从场景中完整取出，以正面直角平视视角单独展示（画面朝前、不倾斜），' +
      '画框外缘约占画面宽度的 72%，居中，四周均匀留浅灰背景，画框底缘有轻微自然的下垂投影。',
    pattern: '画芯图案、配色、木框样式与参考图完全一致，一字不差地保留原画内容。',
    only: '一幅带框装饰画',
  },
  // ===== trays-tabletop：single-size 长托盘（长宽比 > 1.5:1）竖向摆放（2026-11-09 领导定）：
  // 3:4 竖画布横放两侧留白过大，长边转竖直占画面高度 85%；三件套（TRAY_SETS）仍横放错落 =====
  '743606980882': {
    noun: '藤编托盘',
    geometry:
      '{{NOUN}}保持竖向摆放（长边竖直、与画面竖边平行，图案与顶视俯拍视角不变，严禁横放、严禁旋转为横向），长边约占画面高度的 85%，左右居中，四周留出均匀浅灰背景，商品边缘有轻微自然的落地投影。',
    pattern: '藤编编织纹理、贝壳/彩绘镶嵌图案、配色与参考图完全一致。',
    only: '一个藤编托盘',
  },
  '899672152256': {
    noun: '藤编贝壳镶嵌托盘',
    geometry:
      '{{NOUN}}以正面朝上平放于画面中央（顶视俯拍），约占画面宽度的 78%，四周留出均匀浅灰背景，商品边缘有轻微自然的落地投影。',
    pattern: '藤编编织纹理、贝壳镶嵌图案、配色与参考图完全一致。',
    only: '一个藤编托盘',
  },
  '663341114084': {
    noun: '藤编陶瓷椭圆果盘',
    geometry:
      '{{NOUN}}保持竖向摆放（椭圆长轴竖直、与画面竖边平行，严禁横放、严禁旋转为横向），长轴约占画面高度的 85%，左右居中，以正面朝上平放于画面中央（顶视俯拍），四周留出均匀浅灰背景，商品边缘有轻微自然的落地投影。',
    pattern: '藤编纹理、陶瓷彩绘图案、配色与参考图完全一致。',
    only: '一个果盘',
  },
};

// 套组托盘（具体件数已逐一核实：落地页标题/描述/原图数 rims）
const TRAY_SETS = {
  '743606980882-C52': { n: 3, arrange: '三件错落平放展示' },
  '743606980882-C32': { n: 3, arrange: '三件错落平放展示' },
  '743606980882-C20': { n: 3, arrange: '三件错落平放展示' },
  '743606980882-C80': { n: 3, arrange: '三件错落平放展示' },
  '899672152256-C61': { n: 3, arrange: '三件呈嵌套层叠摆放（与参考图一致）' },
  '899672152256-C85': { n: 3, arrange: '三件呈嵌套层叠摆放（与参考图一致）' },
  '899672152256-C33': { n: 3, arrange: '三件错落平放展示' },
  '899672152256-C13': { n: 3, arrange: '三件错落平放展示' },
};

// more-decor 单品（按 ASIN 尾号）
const MORE_DECOR = {
  b0by8ly757: { noun: '黑色金属香薰炉', geometry: '保持参考图中{{NOUN}}的拍摄角度与摆放姿态完全不变，商品居中，约占画面高度的 70%，四周留出均匀浅灰背景，商品下方有轻微自然的落地投影。', pattern: '金属质感、造型细节与参考图完全一致。', only: '一个香薰炉' },
  b0d9lh1y55: { noun: '木质胡椒研磨器', geometry: '保持参考图中{{NOUN}}的拍摄角度与摆放姿态完全不变，商品直立居中，约占画面高度的 74%，四周留出均匀浅灰背景，商品下方有轻微自然的落地投影。', pattern: '木纹质感、金属部件与参考图完全一致。', only: '一个研磨器' },
  b098f1bkjq: { noun: '藤编自行车篮', geometry: '保持参考图中{{NOUN}}的拍摄角度与摆放姿态完全不变，商品居中，约占画面宽度的 76%，四周留出均匀浅灰背景，商品下方有轻微自然的落地投影。', pattern: '藤编纹理、皮革绑带细节与参考图完全一致。', only: '一个自行车篮' },
};

const COMMON =
  '将参考图中的{{NOUN}}重新拍摄为一张摄影棚灰底产品展示图。' +
  '拍摄视角（关键）：相机位于{{NOUN}}正上方，几乎完全垂直向下俯拍（top-down flat lay），镜头轴线垂直于{{NOUN}}表面，' +
  '{{NOUN}}在画面中呈现为标准形状，无任何透视变形、无近大远小、无梯形畸变。' +
  '构图与占图比例（必须严格遵守）：{{GEOMETRY}}；完整平整铺展，无任何卷边、翘角或褶皱，留出干净的背景空间，不要顶天立地。' +
  '背景为干净的浅灰色纯色摄影背景，柔和均匀的漫射光，画面整体平整均匀，不要有墙面与地面的转角分界线。' +
  '{{NOUN}}的花色、图案与织纹严格取自参考图：{{PATTERN}}；与参考图 1:1 对应，' +
  '严禁色偏、严禁增减或改动任何图案元素、严禁改变纹样比例与布局、严禁重新设计图案。' +
  '{{REF_NOTE}}参考图仅作{{NOUN}}花色来源，严禁沿用参考图中的房间场景、家具、地板、墙面等任何陈设与氛围。' +
  '写实商业摄影质感，画面中只有{{ONLY}}与灰色背景：无文字、无水印、无logo、无人、无道具、无其他物品。';

/** 730 亚麻挂画：指定 4 张画框宽度放大到 87%（2026-11-09 领导定）；
    C16/C18 长方形款宽度占比已足够，保持家族默认 72% */
const WALL_ART_WIDE = new Set([
  '730512046265-C14',
  '730512046265-C15',
  '730512046265-C17',
  '730512046265-C19',
]);

function specFor(asin) {
  // 套组托盘优先（具体件数见 TRAY_SETS，逐个核实过）
  if (TRAY_SETS[asin]) {
    const s = TRAY_SETS[asin];
    const fam = FAMILIES[asin.split('-')[0]];
    return {
      noun: `藤编托盘套组（共 ${s.n} 件）`,
      geometry:
        `套组共 ${s.n} 件托盘：全部 ${s.n} 件保持横向摆放（长边水平，与参考图方向一致，严禁竖放或旋转 90°），正面朝上平放展示，${s.arrange}，` +
        `画面中托盘总件数必须恰好 ${s.n} 件（画完数一遍，严禁多画出第 ${s.n + 1} 件、严禁只画一件）；` +
        `每一件托盘的内底面都必须铺满与参考图一致的花色图案，严禁任何一件是素面藤编或无花纹；` +
        `整体约占画面宽度的 82%，四周留出均匀浅灰背景，托盘边缘有轻微自然的落地投影。`,
      pattern: fam.pattern,
      refNote: '',
      only: `一套共 ${s.n} 件的藤编托盘`,
    };
  }
  const sup = asin.split('-')[0];
  let fam = FAMILIES[sup];
  // 730 指定 4 张：画框宽度 72% → 87%（2026-11-09 领导定）
  if (sup === '730512046265' && WALL_ART_WIDE.has(asin) && fam) {
    fam = { ...fam, geometry: fam.geometry.replace('72%', '87%') };
  }
  if (!fam) {
    const tail = asin.match(/-?([a-z0-9]{10,})$/i);
    fam = (tail && MORE_DECOR[tail[1].toLowerCase()]) || null;
  }
  if (!fam) fam = { noun: '商品', geometry: '保持参考图中{{NOUN}}的拍摄角度与摆放姿态完全不变，商品居中，约占画面宽度的 76%，四周留出均匀浅灰背景。', pattern: '颜色、纹理、图案与参考图完全一致。', only: '该商品' };
  return {
    noun: fam.noun,
    geometry: fam.geometry,
    pattern: fam.pattern,
    refNote: fam.refNote || '',
    only: fam.only || '该商品',
  };
}

function promptFor(asin) {
  const s = specFor(asin);
  // {{NOUN}} 必须最后做全局替换：几何模板（RECT_VERT 等）里也含 {{NOUN}}，
  // 若先替换 COMMON 再插入 GEOMETRY，模板内的 {{NOUN}} 会漏替换（前 5 批 prompt 里曾泄漏字面 {{NOUN}}）
  return COMMON.replace('{{GEOMETRY}}', s.geometry)
    .replace('{{PATTERN}}', s.pattern)
    .replace('{{REF_NOTE}}', s.refNote || '')
    .replace('{{ONLY}}', s.only)
    .replace(/\{\{NOUN\}\}/g, s.noun);
}

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

(async () => {
  const asin = process.argv[2];
  const refIndex = parseInt(process.argv[3] || '1', 10);
  if (!asin) {
    console.error('用法: node scripts/decor-mainimg-generate.js <ASIN> [refIndex]');
    process.exit(1);
  }
  // RUG_REF：显式指定参考图路径（用于横放参考图预旋转等预处理场景，2026-11-05）
  const ref = process.env.RUG_REF
    || path.join(ROOT, 'public', 'images', 'products', asin, `${refIndex}.webp`);
  if (!fs.existsSync(ref)) {
    console.error('参考图不存在: ' + ref);
    process.exit(1);
  }
  fs.mkdirSync(GEN, { recursive: true });
  const dest = path.join(GEN, `${asin}.webp`);

  console.log(`seedream 5.0 pro: ${asin}（参考图 ${refIndex}.webp，1440x1920）`);
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      prompt: promptFor(asin),
      image: [await dataUri(ref)],
      response_format: 'url',
      size: '1440x1920',
      stream: false,
      watermark: false,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(JSON.stringify(data).slice(0, 500));
  const imgUrl = data.data?.[0]?.url;
  if (!imgUrl) throw new Error('无结果图: ' + JSON.stringify(data).slice(0, 500));
  const imgRes = await fetch(imgUrl);
  if (!imgRes.ok) throw new Error(`结果图下载失败: HTTP ${imgRes.status}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const sharp = require('sharp');
  await sharp(buf).webp({ quality: 90 }).toFile(dest);
  console.log('已保存: ' + dest);
})().catch((e) => {
  console.error('失败:', e.message);
  process.exit(1);
});
