/**
 * seedream-duvet-v6-samples.js — Duvet Covers 主图 v6 样图（2026-11-01，全新指令）
 * v6 重拟背景：v4/v5 的"翻折折边露白被芯"让画面读成"被芯是被芯、被套是被套"两件东西。
 * v6 主体重新定义：床上就是一床充着被芯的完整被子（像一床厚实的羽绒被），
 * 去掉翻折露白设计；与四件套的区分信号只保留"纯白枕头"。
 * 机位/光线/道具维持用户已确认的灰 v4 方向，不重拟。
 * 输出：public/images/staging/main-c-duvet-<name>-v6.jpg（1536x2048）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');

const PRODUCTS = [
  {
    asin: 'DUVSET-GRAY-DUVET',
    name: 'duvset-gray',
    fabric:
      '中灰色（neutral gray，不偏蓝不偏棕）磨毛棉被套，布面柔和哑光，颜色与参考图 1:1 一致。',
  },
];

const scenePrompt = (fabric) =>
  '以参考图中的被套面料为准：' + fabric +
  '构图要求（最高优先级，必须严格遵守）：忽略参考图的构图和机位，仅参考被套的颜色和材质。' +
  '机位：相机固定在床尾右角高处，约 55° 斜向朝床头俯拍；' +
  '床的长轴沿画面对角线——床尾在画面左下方、床头在画面上方；' +
  '画面顶部露出一条浅原木色床头板边，两个套着纯白色枕套的枕头在画面上方、俯视见完整枕面；' +
  '一盆绿植固定在画面右上角的地板上；画面右缘和左下角可见少量木地板；看不到窗户/壁灯/床头柜。' +
  '主体（本指令的核心）：床上是一床完整、饱满、蓬松的被子——' +
  '被套里充着被芯，整床被子像一床厚实的羽绒被：表面有自然的蓬起和柔软的起伏，' +
  '被体边缘带着重量感自然垂落在床沿，一眼看去是一床有厚度、有体积的被子，' +
  '绝不是一层平贴在床面上的布，也不要出现"被套和被芯是两个分离的东西"的观感。' +
  '被子的摆放：整床被子自然铺在床上，上半部分随意地拢出柔和的隆起和几道大褶（半整理的慵懒感），' +
  '被面的起伏在侧光下能清楚看到厚度；不要刻意翻折被面、不要露出床单一角。' +
  '其余床品：白色床单、两个纯白色枕头；床上不要出现任何毯子、盖毯或毛毯。' +
  '被子 + 枕头占画面 75% 以上，是绝对主体。' +
  '光线：晨光从画面右侧低角度斜射，被面的蓬起在侧光下形成柔和的明暗体积感；' +
  '白平衡中性准确：被套颜色与参考图 1:1 一致，画面整体不得偏黄。' +
  '专业家居纺织品质感摄影，照片级真实感，高清细节，无文字无水印无 logo。';

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
    const out = path.join(ROOT, 'public', 'images', 'staging', `main-c-duvet-${p.name}-v6.jpg`);
    fs.writeFileSync(out, buf);
    fs.copyFileSync(out, path.join(ROOT, 'out', 'images', 'staging', `main-c-duvet-${p.name}-v6.jpg`));
    console.log(`[${p.name}] 已保存 (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
