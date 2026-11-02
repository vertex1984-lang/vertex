/**
 * seedream-main-template-test.js — 产品主图"构图签名模板"3 档机位对比样图（2026-10-31，docs/product-main-image-rules.md）
 * 产品：PERCALE-COCONUT-QUEEN（椰白纯棉贡缎三件套，纯色最易生成）
 * A=35° 紧取景（被面枕面占比最大）/ B=35° 标准（床占 65%）/ C=55° 高机位半俯视
 * 用法: node scripts/seedream-main-template-test.js [a|b|c]（不传=三张全生成）
 */
const fs = require('fs');
const path = require('path');
// 2026-10-31 用户指定：seedream 5.0 pro + 备用账号 2
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images', 'products', 'PERCALE-COCONUT-QUEEN', '1-3x4.webp');

/** 公共段：产品锚定 + 场景 + 光线 + 道具站位 + 色准 + 负向（机位/取景为变量段） */
const BASE =
  '以参考图中的床品为准：椰白色（coconut，暖调奶白，不是冷白不是米黄）纯棉贡缎被套+枕套三件套，' +
  '棉贡缎哑光细腻质感、自然棉感褶皱，颜色与参考图 1:1 一致，不改色。' +
  '现代简约卧室，浅原木+藤编床头板，床头两侧浅原木床头柜。' +
  '床铺"半整理"状态：被套自然铺开带柔和生活感褶皱，不刻意拉平也不凌乱，能看清面料垂坠。' +
  '道具站位固定：画面左下角一盆琴叶榕绿植；床尾搭一条燕麦色粗针织毯；一侧床头柜上放一杯咖啡和一本翻开的书。' +
  '清晨低角度自然光从左侧白纱帘透入，在被面形成柔和 directional 光影。' +
  '白平衡中性准确：白色床品必须读得出白色，画面整体不得偏黄；温暖感只来自晨光方向和原木/藤编/燕麦色道具。' +
  '专业室内家居摄影，照片级真实感，高清细节，无文字无水印无 logo。';

const VARIANTS = {
  a: {
    dest: 'main-tpl-a-35tight.jpg',
    prompt: BASE +
      '镜头机位：35° 三分之二侧面角（从床的右前方拍向床头），紧取景——床占画面约 80%，' +
      '被面和枕面占画面 60% 以上，四周只留少量墙面和地板，构图饱满。',
  },
  b: {
    dest: 'main-tpl-b-35std.jpg',
    prompt: BASE +
      '镜头机位：35° 三分之二侧面角（从床的右前方拍向床头），标准取景——床居中占画面约 65%，' +
      '被面和枕面占画面 45-50%，床头上方可见一部分墙面和窗户，床尾可见少量地板和地毯，有呼吸感留白。',
  },
  c: {
    dest: 'main-tpl-c-55high.jpg',
    prompt: BASE +
      '镜头机位：55° 高机位半俯视（从床的右前方高处向下拍向床面），床居中占画面约 70%，' +
      '被面和枕面从高位最大化展示、占画面 55% 以上，可见床尾地板和地毯一角。',
  },
};

async function generate(v, size) {
  const b64 = fs.readFileSync(SRC).toString('base64');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      prompt: v.prompt,
      image: `data:image/webp;base64,${b64}`,
      response_format: 'url',
      size,
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
  const sizes = ['1872x2496', '1536x2048', '1248x1664']; // 严格 3:4
  for (const k of keys) {
    console.log(`--- 生成 ${k}: ${VARIANTS[k].dest}`);
    let ok = false;
    for (const size of sizes) {
      try { await generate(VARIANTS[k], size); ok = true; break; }
      catch (e) { console.log(`${size} 失败:`, e.message.slice(0, 150)); }
    }
    if (!ok) console.error(`${k} 所有尺寸均失败`);
  }
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
