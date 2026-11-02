/**
 * seedream-main-c-duvetcovers.js — Duvet Covers 主图批量生成（2026-11-01，v2 Zara 机位规则）
 * 规则：产品主图生成规则（bedding-duvet-covers）.md —— 低机位特写紧取景 + 纯白枕 + 翻卷露被芯。
 * 输出：public/images/staging/main-c-duvet-<name>.jpg（1536x2048）
 * 用法：node scripts/seedream-main-c-duvetcovers.js（跑列表全部款）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');

/** 每款的面料描述（与产品数据核对过）；DUVSET-GRAY 已有 v2 样图（main-c-duvet-gray-v2.jpg）不在此列 */
const PRODUCTS = [
  {
    asin: 'LINEN3-IVORY-DUVET',
    name: 'linen3-ivory',
    fabric:
      '象牙白色（ivory white，暖调奶白）水洗亚麻被套，亚麻特有的竹节纹理和自然垂坠感，颜色与参考图 1:1 一致。',
  },
  {
    asin: 'PERCALE-SKY-DUVET',
    name: 'percale-sky',
    fabric:
      '天空蓝（sky blue，清亮柔和的浅蓝、不偏灰不偏绿）纯棉贡缎被套，布面平滑干爽，颜色与参考图 1:1 一致。',
  },
  {
    asin: 'PERCALESTRIPE-PETAL-DUVET',
    name: 'percalestripe-petal',
    fabric:
      '裸粉色（blush pink，低饱和奶粉色）细条纹提花贡缎被套，细密规则的竖向细条纹、同色系深浅交织有织物质感，条纹与颜色与参考图 1:1 一致，不扭曲条纹。',
  },
];

const scenePrompt = (fabric) =>
  '以参考图中的被套面料为准：' + fabric +
  '构图要求（最高优先级）：忽略参考图的构图和机位，仅参考被套的颜色和材质。' +
  '低机位近距离紧取景——相机与床面近乎同高、略微俯视（约 20°），从床侧前方近距离拍摄：' +
  '画面只装下床本身，顶部是两个枕头和一小条纯色暖白色墙壁；' +
  '看不到地板、看不到床头柜、没有任何绿植/道具/窗户/灯具，没有任何房间环境。' +
  '床的铺法（与四件套系列的区分信号）：被套套在纯白色被芯上，被体自然微蓬；' +
  '被套上半部分随意地向下翻卷/堆叠出一道松软的折痕（像刚整理过的慵懒感），' +
  '翻折处露出被套浅色内里和一小条纯白色被芯边缘，让人一眼看出"这是罩在被芯外的被套"；' +
  '两个套着纯白色基础枕套的枕头立在床头（白色枕头——枕套不含在商品内）；' +
  '整体半整理状态，褶皱自然有生活感，能看清面料的垂坠和微皱肌理。' +
  '床上不要出现任何毯子、盖毯或毛毯。' +
  '柔和的自然侧光，面料上有细腻的明暗过渡；' +
  '白平衡中性准确：被套颜色与参考图 1:1 一致，画面整体不得偏黄。' +
  '被套和枕面占画面 90% 以上，是绝对主体。' +
  '专业家居纺织品质感摄影（Zara Home 式特写构图），照片级真实感，高清细节，无文字无水印无 logo。';

(async () => {
  for (const p of PRODUCTS) {
    const src = path.join(ROOT, 'public', 'images', 'products', p.asin, '1.webp');
    const b64 = fs.readFileSync(src).toString('base64');
    const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
      body: JSON.stringify({
        model: 'doubao-seedream-5-0-pro-260628',
        prompt: scenePrompt(p.fabric),
        image: `data:image/webp;base64,${b64}`,
        response_format: 'url',
        size: '1536x2048',
        stream: false,
        watermark: false,
      }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      console.error(`[${p.name}] API 失败:`, JSON.stringify(data).slice(0, 300));
      continue;
    }
    const buf = Buffer.from(await (await fetch(data.data[0].url)).arrayBuffer());
    fs.writeFileSync(path.join(ROOT, 'public', 'images', 'staging', `main-c-duvet-${p.name}.jpg`), buf);
    console.log(`[${p.name}] 已保存 (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
