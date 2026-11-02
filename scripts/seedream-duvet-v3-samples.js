/**
 * seedream-duvet-v3-samples.js — Duvet Covers 主图 v3 样图（2026-11-01）
 * v3 修正（用户反馈）：
 *  1) 机位方向统一 = percale-sky 蓝图方向：相机在床尾中轴线上、朝床头拍，床长轴垂直于画面；
 *  2) 翻折处褶皱收敛：一道整齐翻折边，不堆布团、不凌乱；
 *  3) 枕头占比缩小：枕头只占画面顶部约 12–15%。
 * 输出：public/images/staging/main-c-duvet-<name>-v3.jpg（1536x2048）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');

const PRODUCTS = [
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
  '构图要求（最高优先级，必须严格遵守）：忽略参考图的构图和机位，仅参考被套的颜色和材质。' +
  '相机固定在床尾中轴线上、从床尾朝床头方向拍摄，床的长轴与画面垂直（枕头在画面顶部、床尾在画面底部）；' +
  '低机位、视线与床面近乎同高、略微俯视（约 15°）；近距离紧取景——画面只装下床本身：' +
  '顶部只露出枕头下半部分和一小条纯色暖白色墙壁，底部是被套床尾边缘。' +
  '看不到地板、看不到床头柜、看不到床架侧面，没有任何绿植/道具/窗户/灯具，没有任何房间环境。' +
  '床的铺法：被套套在纯白色被芯上，被体自然微蓬；' +
  '被套上半部分整齐地向下翻折出一道平伏的折边（折边宽度约为床面的五分之一，横贯床面、边缘平直服帖）；' +
  '翻折处只有两三条柔和的大褶，收敛整齐，绝不凌乱、不堆叠成松散布团；' +
  '折边上方露出一小条纯白色被芯，让人一眼看出"这是罩在被芯外的被套"；' +
  '两个套着纯白色基础枕套的枕头立在床头，枕头很小——只占画面顶部约 12% 高度（白色枕头，枕套不含在商品内）；' +
  '床面其余部分平整服帖，只有自然的轻微使用痕迹，能看清面料的垂坠和微皱肌理。' +
  '床上不要出现任何毯子、盖毯或毛毯。' +
  '柔和的自然侧光（从画面左侧来），面料上有细腻的明暗过渡；' +
  '白平衡中性准确：被套颜色与参考图 1:1 一致，画面整体不得偏黄。' +
  '被套占画面 85% 以上，是绝对主体。' +
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
    const out = path.join(ROOT, 'public', 'images', 'staging', `main-c-duvet-${p.name}-v3.jpg`);
    fs.writeFileSync(out, buf);
    // 同步到 out/ 供预览服务器直接访问
    fs.copyFileSync(out, path.join(ROOT, 'out', 'images', 'staging', `main-c-duvet-${p.name}-v3.jpg`));
    console.log(`[${p.name}] 已保存 (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
