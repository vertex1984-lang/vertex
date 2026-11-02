/**
 * seedream-main-c-duvet-sample.js — Duvet Covers 主图规则样图 v2（2026-11-01）
 * 用户反馈 v1 与四件套太接近，改 Zara Home 式机位：低机位近距离紧取景，
 * 画面只有床 + 一小条素墙，无房间环境/道具——与四件套的 55° 高机位场景图拉开差异。
 * 保留区分信号：纯白基础枕 + 床头翻折露白色被芯。
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images', 'products', 'DUVSET-GRAY-DUVET', '1.webp');

const PROMPT =
  '以参考图中的被套面料为准：中灰色（medium grey，低饱和、不偏蓝不偏棕）水洗棉质感被套，' +
  '水洗做旧微皱肌理，颜色与参考图 1:1 一致，不改色。' +
  '构图要求（最高优先级）：忽略参考图的构图和机位，仅参考被套的颜色和材质。' +
  '低机位近距离紧取景——相机与床面近乎同高、略微俯视（约 20°），从床侧前方近距离拍摄：' +
  '画面只装下床本身，顶部是两个枕头和一小条纯色暖白色墙壁；' +
  '看不到地板、看不到床头柜、没有任何绿植/道具/窗户/灯具，没有任何房间环境。' +
  '床的铺法（与四件套系列的区分信号）：灰色被套套在纯白色被芯上，被体自然微蓬；' +
  '被套上半部分随意地向下翻卷/堆叠出一道松软的折痕（像刚整理过的慵懒感），' +
  '翻折处露出被套浅色内里和一小条纯白色被芯边缘，让人一眼看出"这是罩在被芯外的被套"；' +
  '两个套着纯白色基础枕套的枕头立在床头（白色枕头，不是灰色——枕套不含在商品内）；' +
  '整体半整理状态，褶皱自然有生活感，能看清面料的垂坠和微皱肌理。' +
  '床上不要出现任何毯子、盖毯或毛毯。' +
  '柔和的自然侧光，面料上有细腻的明暗过渡；' +
  '白平衡中性准确：被套灰色与参考图 1:1 一致，画面整体不得偏黄。' +
  '被套和枕面占画面 90% 以上，是绝对主体。' +
  '专业家居纺织品质感摄影（Zara Home 式特写构图），照片级真实感，高清细节，无文字无水印无 logo。';

(async () => {
  const b64 = fs.readFileSync(SRC).toString('base64');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      prompt: PROMPT,
      image: `data:image/webp;base64,${b64}`,
      response_format: 'url',
      size: '1536x2048',
      stream: false,
      watermark: false,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(JSON.stringify(data).slice(0, 500));
  const buf = Buffer.from(await (await fetch(data.data[0].url)).arrayBuffer());
  fs.writeFileSync(path.join(ROOT, 'public', 'images', 'staging', 'main-c-duvet-gray-v2.jpg'), buf);
  console.log(`已保存 main-c-duvet-gray-v2.jpg (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
