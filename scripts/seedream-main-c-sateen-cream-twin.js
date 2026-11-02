/**
 * seedream-main-c-sateen-cream-twin.js — SATEEN4-CREAM-TWIN 主图（2026-11-01）
 * 参照《产品主图生成规则（bedding-sheets-duvet-sets）》（原版晨光条款）。
 * 产品特定：纯棉贡缎（cotton sateen）——丝滑缎面光泽、垂坠感强（仅此产品 prompt，不进规则）。
 * 输出：public/images/staging/main-c-sateen4-cream-twin.jpg（1536x2048）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');

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

const FABRIC =
  '以参考图中的床品为准：奶白色（cream white，暖调柔和奶白，不是冷白不是米色）纯棉贡缎（cotton sateen）四件套——' +
  '贡缎面料特征：布面丝滑细腻、有柔和含蓄的缎面光泽（不是哑光的普通棉，也不是刺眼的化纤亮面），' +
  '垂坠感强、褶皱线条流畅柔软；' +
  '被套 + 两个同色枕套，颜色与参考图 1:1 一致，不改色。';

(async () => {
  const src = path.join(ROOT, 'public', 'images', 'products', 'SATEEN4-CREAM-TWIN', '1.webp');
  const b64 = fs.readFileSync(src).toString('base64');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      prompt: FABRIC + SCENE + CAMERA_C,
      image: `data:image/webp;base64,${b64}`,
      response_format: 'url',
      size: '1536x2048',
      stream: false,
      watermark: false,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) { console.error('API 失败:', JSON.stringify(data).slice(0, 300)); process.exit(1); }
  const buf = Buffer.from(await (await fetch(data.data[0].url)).arrayBuffer());
  const out = path.join(ROOT, 'public', 'images', 'staging', 'main-c-sateen4-cream-twin.jpg');
  fs.writeFileSync(out, buf);
  fs.copyFileSync(out, path.join(ROOT, 'out', 'images', 'staging', 'main-c-sateen4-cream-twin.jpg'));
  console.log(`已保存 (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
