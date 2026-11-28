/**
 * _gen-hero-drop-editorial.js — /drop-home 编辑大片版 hero 生成（2026-11-27 用户定：
 * 拼版四联被否，"太乱"；改 AI 生成单幅氛围大片；生成模型用户指定 Seedream 5.0 Pro）。
 * API：火山方舟 images/generations（与 E:/rylvetha-website/scripts/seedream-*.js 同通道，
 * key 顺序：env ARK_API_KEY → E:/rylvetha-website/scripts/.ark-api-key → .ark-api-key-2）。
 * 输出直接覆盖 public/images/brand/hero-drop-{desktop,mobile}.webp（文件名不变，页面无需改代码；
 * 预览时手动同步到 out/）。用法：node scripts/_gen-hero-drop-editorial.js
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

const STYLE =
  'Warm editorial interior photography for a premium bedding brand homepage hero. ' +
  'Photorealistic, high-end interior magazine quality, soft diffused natural window light, ' +
  'cream ivory and caramel brown palette, airy and calm, generous styling restraint. ' +
  'No people, no text, no logo, no watermark.';

const JOBS = [
  {
    name: 'desktop',
    size: '2560x1440',
    dest: 'hero-drop-desktop.webp',
    prompt:
      'Cinematic wide editorial hero photograph. A serene minimalist bedroom: an ivory-cream linen ' +
      'bedding set with softly rumpled duvet on a low platform bed, placed in the right two-thirds of ' +
      'the frame; floor-to-ceiling window at the far right with sheer curtains and soft morning mist ' +
      'outside. The LEFT THIRD of the frame is calm empty negative space (a soft warm plain wall in ' +
      'shallow shadow) kept clean for overlay headline text. ' + STYLE,
  },
  {
    name: 'mobile',
    size: '1125x1654',
    dest: 'hero-drop-mobile.webp',
    prompt:
      'Tall portrait editorial hero photograph. The same serene minimalist bedroom: an ivory-cream ' +
      'linen bedding set with softly rumpled duvet on a low bed centered in the middle of the frame, ' +
      'tall window with sheer curtains above, soft morning mist outside. The LOWER THIRD of the frame ' +
      'is calm and uncluttered (quiet bed surface and floor, no objects) kept clean for overlay text. ' + STYLE,
  },
];

async function gen(job) {
  console.log(`seedream 5.0 pro: hero ${job.name} (${job.size})`);
  let data, lastErr;
  for (let ki = 0; ki < KEYS.length; ki++) {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEYS[ki]}` },
      body: JSON.stringify({
        model: MODEL,
        prompt: job.prompt,
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
