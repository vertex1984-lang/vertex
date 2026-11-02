/**
 * seedream-main-c-batch1.js — Sheets & Duvet Sets 全类目 C 方案主图批量·第 1 批（5 张，2026-10-31）
 * 模板：docs/product-main-image-rules.md（SCENE + CAMERA_C v3 与 seedream-main-c-batch.js 保持一致）
 * 用法: node scripts/seedream-main-c-batch1.js [key]（不传=整批生成）
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
  'bedset4-slate': {
    src: path.join(PRODUCTS_DIR, 'BEDSET4-SLATE-QUEEN', '1-3x4.webp'),
    dest: 'main-c-bedset4-slate.jpg',
    prompt:
      '以参考图中的床品为准：石灰蓝灰色（slate，灰调雾蓝，不是藏蓝不是纯灰）底 + 白色细腻植物枝叶花卉印花的四件套，' +
      '印花为精细的白色线稿感植物花纹、分布均匀，颜色、花型、密度与参考图 1:1 一致，不改色、不扭曲印花图案。' +
      SCENE + CAMERA_C,
  },
  'bedset4-beige': {
    src: path.join(PRODUCTS_DIR, 'BEDSET4-BEIGE-QUEEN', '1.webp'),
    dest: 'main-c-bedset4-beige.jpg',
    prompt:
      '以参考图中的床品为准：米白色（beige，暖调米白，不是冷白不是深驼）纯色四件套，' +
      '哑光细腻棉感、无任何图案印花，颜色与参考图 1:1 一致，不改色。' +
      SCENE + CAMERA_C,
  },
  'duvset-gray': {
    src: path.join(PRODUCTS_DIR, 'DUVSET-GRAY-QUEEN', '1-3x4.webp'),
    dest: 'main-c-duvset-gray.jpg',
    prompt:
      '以参考图中的床品为准：浅灰色（light gray，柔和浅灰，不是深灰不是蓝灰）纯色刷毛四件套，' +
      '磨毛哑光柔绒质感、无任何图案印花，颜色与参考图 1:1 一致，不改色。' +
      SCENE + CAMERA_C,
  },
  'linen3-sage': {
    src: path.join(PRODUCTS_DIR, 'LINEN3-SAGE-QUEEN', '1-3x4.webp'),
    dest: 'main-c-linen3-sage.jpg',
    prompt:
      '以参考图中的床品为准：灰绿色（sage green，低饱和灰调豆绿，不是鲜绿不是墨绿）纯色亚麻三件套，' +
      '亚麻特有的大方褶皱和自然粗砺纹理、无任何图案印花，颜色与参考图 1:1 一致，不改色。' +
      SCENE + CAMERA_C,
  },
  'washjac-cream': {
    src: path.join(PRODUCTS_DIR, 'WASHJAC-CREAM-QUEEN', '1-3x4.webp'),
    dest: 'main-c-washjac-cream.jpg',
    prompt:
      '以参考图中的床品为准：奶白色（cream white，暖调奶白，不是冷白不是米色）水洗棉四件套，' +
      '同色系叶脉/蕨叶纹理的暗纹提花（提花与底色同色、靠光影显现纹理，不是印花、没有别的颜色），水洗做旧微皱肌理，' +
      '颜色、提花纹理与参考图 1:1 一致，不改色、不扭曲纹理。' +
      SCENE + CAMERA_C,
  },
  'sateen4-cream': {
    src: path.join(PRODUCTS_DIR, 'SATEEN4-CREAM-QUEEN', '1-3x4.webp'),
    dest: 'main-c-sateen4-cream.jpg',
    prompt:
      '以参考图中的床品为准：奶白色（cream，暖调奶油白，不是冷白不是米色）纯色纯棉贡缎四件套，' +
      '贡缎细腻微光泽质感、无任何图案印花，颜色与参考图 1:1 一致，不改色。' +
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
