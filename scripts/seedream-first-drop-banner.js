/**
 * seedream-first-drop-banner.js — 首页预售区通栏氛围横幅生成（2026-11-26）
 * 参考 LINEN3-SAGE-QUEEN/1.webp 保持鼠尾草绿亚麻床品一致；超宽幅构图，
 * 左侧留白压文案、右侧床品主体（产品卡也压在右侧区域，故床可居中偏右）。
 * 输出：public/images/staging/first-drop-hero-gen-<n>.jpg（2688x1040 ≈ 2.6:1）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');

const PROMPT =
  '构图要求（最高优先级）：超宽幅电影感家居横幅。床居中偏右放置，占画面右侧约三分之二；' +
  '左侧三分之一是透光的白色纱帘落地窗和燕麦色墙面的大面积安静留白（后期要在这里压白色文字），留白区不要放任何家具杂物。' +
  '场景：现代侘寂风卧室，浅原木床架配藤编床头，鼠尾草灰绿色 100% 亚麻床品——颜色、质感与参考图 1:1 一致；' +
  '被套自然铺开带柔和生活感褶皱，两个同色系枕套，床尾搭一条原木长凳，床头一侧陶土花瓶插绿色枝条。' +
  '氛围：清晨低角度自然光从左侧纱帘透入，柔和 directional 光影落在被面上；空气感、安静、温暖、治愈，有呼吸感。' +
  '色调：燕麦色 + 浅原木 + 鼠尾草绿，低饱和；白平衡中性准确，画面不得偏黄。' +
  '专业室内家居摄影，照片级真实感，高清细节，无文字无水印无 logo。';

const SAMPLES = 2;

(async () => {
  const src = path.join(ROOT, 'public', 'images', 'products', 'LINEN3-SAGE-QUEEN', '1.webp');
  const b64 = fs.readFileSync(src).toString('base64');
  for (let i = 1; i <= SAMPLES; i++) {
    const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
      body: JSON.stringify({
        model: 'doubao-seedream-5-0-pro-260628',
        prompt: PROMPT,
        image: `data:image/webp;base64,${b64}`,
        response_format: 'url',
        size: '2688x1040',
        stream: false,
        watermark: false,
      }),
    });
    const data = await res.json();
    if (!res.ok || data.error) { console.error(`[sample ${i}] API 失败:`, JSON.stringify(data).slice(0, 300)); continue; }
    const buf = Buffer.from(await (await fetch(data.data[0].url)).arrayBuffer());
    const out = path.join(ROOT, 'public', 'images', 'staging', `first-drop-hero-gen-${i}.jpg`);
    fs.writeFileSync(out, buf);
    console.log(`[sample ${i}] 已保存 first-drop-hero-gen-${i}.jpg (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
