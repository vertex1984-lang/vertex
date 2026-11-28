/**
 * _gen-hero-skrose.js — /drop-home hero 第二版：以 Sketch Rose 产品场景图（5号，阳光窗影构图）
 * 为参考图做 i2i，保留产品真实外观，扩展成编辑大片构图（2026-11-28 用户指定 Seedream 5.0 Pro）。
 * API：火山方舟 images/generations，i2i 通过 image 参数传 base64 data URI。
 * 输出覆盖 public/images/brand/hero-drop-{desktop,mobile}.webp，预览手动同步 out/。
 * 用法：node scripts/_gen-hero-skrose.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const KEYS = [
  process.env.ARK_API_KEY,
  'E:/rylvetha-website/scripts/.ark-api-key',
  'E:/rylvetha-website/scripts/.ark-api-key-2',
]
  .filter(Boolean)
  .map((k) => (fs.existsSync(k) ? fs.readFileSync(k, 'utf8').trim() : k))
  .filter((v, i, a) => a.indexOf(v) === i);
if (KEYS.length === 0) { console.error('缺少 ARK key'); process.exit(1); }

const API = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
const MODEL = 'doubao-seedream-5-0-pro-260628';

const REF = path.join(__dirname, '..', 'public', 'images', 'products', 'MK-SKROSE4-IVORY-QUEEN', '5.webp');
const refB64 = 'data:image/webp;base64,' + fs.readFileSync(REF).toString('base64');

const STYLE =
  'Warm editorial interior photography for a premium bedding brand homepage hero. ' +
  'Photorealistic, high-end interior magazine quality, soft diffused natural window light with ' +
  'gentle window-frame shadows, cream ivory and warm taupe palette, airy and calm. ' +
  'The bedding keeps the exact same ivory linen-like fabric with delicate charcoal sketch-rose ' +
  'floral print and the olive-green reverse side as in the reference image — same product, ' +
  'same print, same colors. No people, no text, no logo, no watermark.';

const JOBS = [
  {
    name: 'desktop',
    size: '2560x1440',
    dest: 'hero-drop-desktop.webp',
    prompt:
      'Cinematic ultra-wide editorial hero photograph expanding the reference bedroom scene. ' +
      'A serene minimalist bedroom: the ivory sketch-rose linen bedding set with softly rumpled ' +
      'duvet and olive-green folded reverse on a low bed, placed in the right two-thirds of the ' +
      'frame; tall window at the far right with sheer curtains, soft morning light casting gentle ' +
      'window shadows across the bed. The LEFT THIRD of the frame is calm empty negative space ' +
      '(a soft warm plain plaster wall in shallow shadow) kept clean for overlay headline text. ' + STYLE,
  },
  {
    name: 'mobile',
    size: '1125x1654',
    dest: 'hero-drop-mobile.webp',
    prompt:
      'Tall portrait editorial hero photograph of the same serene minimalist bedroom. ' +
      'The ivory sketch-rose linen bedding set with softly rumpled duvet and olive-green folded ' +
      'reverse on a low bed centered in the middle of the frame, tall window with sheer curtains ' +
      'above, soft morning light and gentle window shadows. The LOWER THIRD of the frame is calm ' +
      'and uncluttered (quiet bed surface and floor, no objects) kept clean for overlay text. ' + STYLE,
  },
];

async function gen(job) {
  console.log(`seedream 5.0 pro i2i: hero ${job.name} (${job.size})`);
  let data, lastErr;
  for (let ki = 0; ki < KEYS.length; ki++) {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEYS[ki]}` },
      body: JSON.stringify({
        model: MODEL,
        prompt: job.prompt,
        image: refB64,
        response_format: 'url',
        size: job.size,
        stream: false,
        watermark: false,
      }),
    });
    data = await res.json();
    if (res.ok && !data.error) { if (ki > 0) console.log(`(已切换备用账号 key-${ki + 1})`); break; }
    lastErr = JSON.stringify(data).slice(0, 500);
    data = null;
  }
  if (!data) throw new Error(lastErr);
  const url = data.data?.[0]?.url;
  if (!url) throw new Error('无结果图: ' + JSON.stringify(data).slice(0, 500));
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const dest = path.join(__dirname, '..', 'public', 'images', 'brand', job.dest);
  await sharp(buf).webp({ quality: 85 }).toFile(dest);
  console.log('已保存: ' + dest);
}

(async () => {
  for (const job of JOBS) await gen(job);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
