/**
 * seedream-main-c-setb.js — Sheets & Duvet Sets 全类目 C 方案主图批量·SET B（5 张，2026-10-31）
 * 模板：docs/product-main-image-rules.md（SCENE + CAMERA_C v3 与 seedream-main-c-batch1.js 保持一致）
 * 用法: node scripts/seedream-main-c-setb.js [key]（不传=整批生成）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const PRODUCTS_DIR = path.join(ROOT, 'public', 'images', 'products');

const SCENE =
  '现代简约卧室，浅原木+藤编床头板，床头两侧浅原木床头柜。' +
  '床铺"半整理"状态：被套自然铺开带柔和生活感褶皱，不刻意拉平也不凌乱，能看清面料垂坠。' +
  '道具站位固定：画面左下角一盆琴叶榕绿植；一侧床头柜上放一杯咖啡和一本翻开的书。床上和床尾不要出现任何毯子、盖毯或毛毯。' +
  '清晨低角度自然光从左侧白纱帘透入，在被面形成柔和 directional 光影。' +
  '白平衡中性准确：床品颜色与参考图 1:1 一致，画面整体不得偏黄；温暖感只来自晨光方向和原木/藤编/燕麦色道具。' +
  '专业室内家居摄影，照片级真实感，高清细节，无文字无水印无 logo。';

const CAMERA_C =
  '构图要求（最高优先级）：忽略参考图的构图和机位，仅参考床品的颜色和图案。' +
  '镜头机位：55° 高机位纵向俯拍——相机位于床尾右上方高处，沿床身长度方向朝床头俯拍，接近垂直俯视床面。' +
  '方向锁定：床头板在画面左上方、只占顶部一条边，床尾在画面右下方，床身从左上向右下对角延伸（与系列其他主图完全同向，不得镜像）。' +
  '枕头从高位俯视看到完整枕面；看不到墙面、窗户和壁灯。' +
  '被面和枕面占画面 75% 以上，是绝对主体；画面底部可见一小条地板。';

const VARIANTS = {
  'a1025015219200-c1': {
    src: path.join(PRODUCTS_DIR, '1025015219200-C1', '1.webp'),
    dest: 'main-c-1025015219200-c1.jpg',
    prompt:
      '以参考图中的床品为准：奶白色（cream white，暖调奶白，不是冷白不是米色）底 + 深灰色（dark gray，炭灰，不是纯黑不是藏蓝）细密小碎花印花的四件套，' +
      '印花为细小的深灰色碎花枝叶图案、均匀密布、碎花小而精致，边缘有深灰色荷叶边装饰，' +
      '纯棉柔软细腻质感，颜色、图案与参考图 1:1 一致，不改色、不扭曲图案。' +
      SCENE + CAMERA_C,
  },
  'a1071466105053-c5': {
    src: path.join(PRODUCTS_DIR, '1071466105053-C5', '1.webp'),
    dest: 'main-c-1071466105053-c5.jpg',
    prompt:
      '以参考图中的床品为准：灰绿色（sage green，低饱和灰调豆绿，不是鲜绿不是墨绿）底 + 白色与粉色（pink，淡粉，不是红不是玫红）细线条交织格纹的四件套，' +
      '格纹为白色细线+粉色细线在灰绿底上织成的规则格子图案、格子大小均匀、线条清晰平直，' +
      '水洗棉柔软微皱质感，颜色、图案与参考图 1:1 一致，不改色、不扭曲格纹图案。' +
      SCENE + CAMERA_C,
  },
  'a1071466105053-c9': {
    src: path.join(PRODUCTS_DIR, '1071466105053-C9', '1.webp'),
    dest: 'main-c-1071466105053-c9.jpg',
    prompt:
      '以参考图中的床品为准：米白色（off white，暖调米白，不是冷白不是米色偏黄）底 + 黑色小圆点波点印花的四件套，' +
      '印花为均匀散布的黑色小圆点、圆点大小一致、间距均匀、排列规整，' +
      '纯棉柔软细腻质感，颜色、图案与参考图 1:1 一致，不改色、不扭曲波点图案。' +
      SCENE + CAMERA_C,
  },
  'a1071466105053-c11': {
    src: path.join(PRODUCTS_DIR, '1071466105053-C11', '1.webp'),
    dest: 'main-c-1071466105053-c11.jpg',
    prompt:
      '以参考图中的床品为准：黑白大棋盘格（checkerboard，黑色与米白色大方格交替，不是条纹不是小格纹）的四件套，' +
      '图案为纯黑与米白色的大方格棋盘格、方格大而规整、黑白交替分明、边界清晰平直，' +
      '纯棉柔软细腻质感，颜色、图案与参考图 1:1 一致，不改色、不扭曲棋盘格图案。' +
      SCENE + CAMERA_C,
  },
  'percalepatch-stone': {
    src: path.join(PRODUCTS_DIR, 'PERCALEPATCH-STONE-QUEEN', '1-3x4.webp'),
    dest: 'main-c-percalepatch-stone-queen.jpg',
    prompt:
      '以参考图中的床品为准：石灰色调（stone gray，浅灰带暖调，不是深灰不是蓝灰）与米白色拼布几何图案的四件套，' +
      '图案为灰白拼布风格：由细条纹块、细格纹块、小菱格点纹块等多种灰色几何纹样的方块拼接组成、拼布分区清晰，' +
      '贡缎细腻微光泽质感，颜色、图案与参考图 1:1 一致，不改色、不扭曲拼布图案。' +
      SCENE + CAMERA_C,
  },
};

async function generate(v) {
  const mime = v.src.toLowerCase().endsWith('.webp') ? 'image/webp' : 'image/jpeg';
  const b64 = fs.readFileSync(v.src).toString('base64');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      prompt: v.prompt,
      image: `data:${mime};base64,${b64}`,
      response_format: 'url',
      size: '1536x2048',
      stream: false,
      watermark: false,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(JSON.stringify(data).slice(0, 500));
  const imgUrl = data.data?.[0]?.url;
  if (!imgUrl) throw new Error('无结果图: ' + JSON.stringify(data).slice(0, 500));
  const buf = Buffer.from(await (await fetch(imgUrl)).arrayBuffer());
  const dest = path.join(ROOT, 'public', 'images', 'staging', v.dest);
  fs.writeFileSync(dest, buf);
  console.log(`已保存 ${v.dest} (${buf.length} bytes), size=${data.data[0].size}`);
}

(async () => {
  const only = process.argv[2];
  const keys = only ? [only] : Object.keys(VARIANTS);
  for (const k of keys) {
    console.log(`--- 生成 ${k}: ${VARIANTS[k].dest}`);
    try { await generate(VARIANTS[k]); }
    catch (e) { console.error(`${k} 失败:`, e.message); }
  }
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
