/**
 * seedream-main-c-batch.js — C 方案（55° 高机位半俯视）主图批量生成（2026-10-31）
 * 依据 docs/product-main-image-rules.md 定稿模板，逐产品改写"产品锚定段"。
 * 用法: node scripts/seedream-main-c-batch.js [washstripe|percalecheck]（不传=两张全生成）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const PRODUCTS_DIR = path.join(ROOT, 'public', 'images', 'products');

/** 公共段：场景 + 道具站位 + 光线 + 色准 + 负向（与模板测试一致） */
const SCENE =
  '现代简约卧室，浅原木+藤编床头板，床头两侧浅原木床头柜。' +
  '床铺"半整理"状态：被套自然铺开带柔和生活感褶皱，不刻意拉平也不凌乱，能看清面料垂坠。' +
  '道具站位固定：画面左下角一盆琴叶榕绿植；一侧床头柜上放一杯咖啡和一本翻开的书。床上和床尾不要出现任何毯子、盖毯或毛毯。' +
  '清晨低角度自然光从左侧白纱帘透入，在被面形成柔和 directional 光影。' +
  '白平衡中性准确：床品颜色与参考图 1:1 一致，画面整体不得偏黄；温暖感只来自晨光方向和原木/藤编/燕麦色道具。' +
  '专业室内家居摄影，照片级真实感，高清细节，无文字无水印无 logo。';

/** C 机位段（已定稿，v3：+对角线方向锁定，防参考图镜像带偏） */
const CAMERA_C =
  '构图要求（最高优先级）：忽略参考图的构图和机位，仅参考床品的颜色和图案。' +
  '镜头机位：55° 高机位纵向俯拍——相机位于床尾右上方高处，沿床身长度方向朝床头俯拍，接近垂直俯视床面。' +
  '方向锁定：床头板在画面左上方、只占顶部一条边，床尾在画面右下方，床身从左上向右下对角延伸（与系列其他主图完全同向，不得镜像）。' +
  '枕头从高位俯视看到完整枕面；看不到墙面、窗户和壁灯。' +
  '被面和枕面占画面 75% 以上，是绝对主体；画面底部可见一小条地板。';

const VARIANTS = {
  washstripe: {
    src: path.join(PRODUCTS_DIR, 'WASHSTRIPE-SAGEGREEN-QUEEN', '1-3x4.webp'),
    dest: 'main-c-washstripe-sage.jpg',
    prompt:
      '以参考图中的床品为准：灰绿色（sage green，低饱和灰调豆绿，深度与参考图一致，忌偏浅偏薄荷，不是鲜绿不是墨绿）细条纹水洗棉四件套，' +
      '条纹为细密规则的纵向细条，水洗做旧微皱肌理，颜色、条纹间距与参考图 1:1 一致，不改色、不扭曲条纹图案。' +
      SCENE + CAMERA_C,
  },
  percalejac: {
    src: path.join(PRODUCTS_DIR, 'PERCALEJAC-HAZE-QUEEN', '1-3x4.webp'),
    dest: 'main-c-percalejac-haze.jpg',
    prompt:
      '以参考图中的床品为准：雾蓝色（haze，低饱和灰调浅蓝，不是天蓝不是藏蓝）与奶白色相间的宽条纹提花纯棉贡缎四件套，' +
      '条纹为雾蓝/奶白交替的规则宽条，条带内有细腻提花肌理，哑光棉贡缎质感，' +
      '颜色、条纹宽度比例、排列顺序与参考图 1:1 一致，不改色、不扭曲条纹图案。' +
      SCENE + CAMERA_C,
  },
  percalecheck: {
    // 2026-10-31 用户换参考图（alicdn 实物图）：实际花纹是极细密白线条，不是稀疏大格
    src: path.join(ROOT, 'public', 'images', 'staging', 'ref-percalecheck-sand-v2.jpg'),
    dest: 'main-c-percalecheck-sand.jpg',
    prompt:
      '以参考图中的床品为准：燕麦沙色（oatmeal sand，暖调浅驼米色，不是灰色不是深棕）细条纹纯棉贡缎四件套，' +
      '花纹是极细密的白色铅笔细线条，间距很窄、低调含蓄，远看近纯色、近看有细腻条纹肌理（关键：不是稀疏的大格子、不是宽格纹），' +
      '哑光细腻棉贡缎质感，颜色、条纹密度与参考图 1:1 一致，不改色、不扭曲条纹图案。' +
      SCENE +
      '构图要求（最高优先级）：忽略参考图的构图和机位，仅参考床品的颜色和图案。' +
      '镜头机位：55° 高机位纵向俯拍——相机位于床尾右上方高处，沿床身长度方向朝床头俯拍，接近垂直俯视床面。' +
      '方向锁定：床头板在画面左上方、只占顶部一条边，床尾在画面右下方，床身从左上向右下对角延伸（与系列其他主图完全同向，不得镜像）。' +
      '枕头从高位俯视看到完整枕面；看不到墙面、窗户和壁灯。' +
      '被面和枕面占画面 75% 以上，是绝对主体；画面底部可见一小条地板。',
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
      size: '1536x2048', // 严格 3:4；1872x2496 超面积上限
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
