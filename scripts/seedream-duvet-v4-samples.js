/**
 * seedream-duvet-v4-samples.js — Duvet Covers 主图 v4 样图（2026-11-01）
 * v4 设计（用户反馈 v3 贴脸特写与全站风格不匹配）：
 *  场景语言 100% 回归品牌签名 = 与 Sheets & Duvet Sets 同一机位/光线/道具
 *  （55° 高机位纵向俯拍 + 晨光斜射 + 绿植一角 + 底部一小条地板）；
 *  区分信号只放在铺法上：① 纯白基础枕（vs 四件套同花色枕套）② 被套上半部分
 *  整齐翻折一道平伏折边、露出纯白被芯（vs 四件套满铺）。
 * 输出：public/images/staging/main-c-duvet-<name>-v4.jpg（1536x2048）
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

const OUT_SUFFIX = 'v5';

const scenePrompt = (fabric) =>
  '以参考图中的被套面料为准：' + fabric +
  '构图要求（最高优先级，必须严格遵守，所有图方向完全一致）：忽略参考图的构图和机位，仅参考被套的颜色和材质。' +
  '机位：相机固定在床尾右角高处，约 55° 斜向朝床头俯拍；' +
  '床的长轴沿画面对角线——床尾在画面左下方、床头在画面上方；' +
  '画面顶部露出一条浅原木色床头板边，两个枕头在画面上方、俯视见完整枕面；' +
  '一盆绿植固定在画面右上角的地板上；画面右缘和左下角可见少量木地板；' +
  '看不到窗户/壁灯/床头柜。被面 + 枕面占画面 75% 以上，是绝对主体。' +
  '床的铺法（与四件套系列的区分信号，必须严格执行）：' +
  '① 两个套着纯白色基础枕套的枕头平放在床头——枕头是纯白色（枕套不含在商品内），绝不与被套同花色；' +
  '② 被套里装着纯白色被芯——被体饱满蓬松、有明显的厚度和体积感，' +
  '能清楚看到被套包裹着一整床被子的立体形态（绝不是一条扁布套平贴在床面上）；' +
  '被套上半部分整齐地向下翻折出一道平伏的折边' +
  '（折边宽度约为床面的五分之一，横贯床面、边缘平直服帖，只有两三条柔和的大褶，收敛整齐，不凌乱不堆布团），' +
  '折边上方露出一小条纯白色被芯，让人一眼看出"这是罩在被芯外的被套"。' +
  '整体半整理状态：有生活感、不刻意，但能看清面料垂坠。' +
  '床上不要出现任何毯子、盖毯或毛毯。' +
  '道具（站位固定）：一盆绿植放在画面某一角（地板上），一盆即可；' +
  '光线：晨光从画面右侧低角度斜射进来，在床面上形成柔和的方向性光影（阴影投向画面左下）；' +
  '白平衡中性准确：被套颜色与参考图 1:1 一致，画面整体不得偏黄（暖调只来自光的方向和原木/绿植等道具材质）。' +
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
    const out = path.join(ROOT, 'public', 'images', 'staging', `main-c-duvet-${p.name}-${OUT_SUFFIX}.jpg`);
    fs.writeFileSync(out, buf);
    fs.copyFileSync(out, path.join(ROOT, 'out', 'images', 'staging', `main-c-duvet-${p.name}-${OUT_SUFFIX}.jpg`));
    console.log(`[${p.name}] 已保存 (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
