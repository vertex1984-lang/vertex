/**
 * packaging-bag-generate.js — Makimoo 床品收纳袋外包装设计稿（2026-11-17）
 * 粗麻布 / 帆布 两版 × 正反面 = 4 张，Seedream 5.0 Pro 文生图，3:4。
 * 输出：E:/Makimoo Website/packaging-design/packaging-<burlap|canvas>-<front|back>.jpg
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const OUT_DIR = 'E:/Makimoo Website/packaging-design';

const COMMON =
  ' Professional e-commerce product photography, seamless warm off-white studio background (#F8F5F0),' +
  ' soft diffused natural lighting, slight 45-degree top-down angle, warm natural premium home textile brand aesthetic,' +
  ' photorealistic, high detail, no watermark.';

const FRONT_LOGO =
  ' Centered on the front: a printed logo in warm dark brown (#4E3829) — a round badge containing a minimalist' +
  ' cow head silhouette, above the lowercase rounded wordmark "makimoo", with a small tagline' +
  ' "Comfort, Woven Into Every Day" beneath it.';

const BACK_DETAIL =
  ' The back is clean and unprinted except one small round badge logo in warm dark brown (#4E3829) —' +
  ' a minimalist cow head silhouette inside a circle — placed at the bottom right corner,' +
  ' plus a single horizontal brown decorative stitch line along the bottom edge.';

const JOBS = [
  {
    dest: 'packaging-burlap-front.jpg',
    prompt:
      'A rectangular zippered bedding storage bag made of natural oatmeal-beige coarse burlap linen fabric' +
      ' with visible woven texture and slub grain, standing upright, brown cotton webbing handles attached' +
      ' with reinforced stitching, top zipper closure.' + FRONT_LOGO + COMMON,
  },
  {
    dest: 'packaging-burlap-back.jpg',
    prompt:
      'The BACK side of a rectangular zippered bedding storage bag made of natural oatmeal-beige coarse burlap' +
      ' linen fabric with visible woven texture, brown cotton webbing handles resting naturally, top zipper closure.' +
      BACK_DETAIL + COMMON,
  },
  {
    dest: 'packaging-canvas-front.jpg',
    prompt:
      'A rectangular zippered bedding storage bag made of warm ivory-beige 12oz cotton canvas with a fine smooth' +
      ' weave, standing upright, brown canvas handles with brown contrast stitching along all seams,' +
      ' top zipper closure.' + FRONT_LOGO + COMMON,
  },
  {
    dest: 'packaging-canvas-back.jpg',
    prompt:
      'The BACK side of a rectangular zippered bedding storage bag made of warm ivory-beige 12oz cotton canvas' +
      ' with fine smooth weave, brown canvas handles resting naturally, brown contrast stitching along seams,' +
      ' top zipper closure.' + BACK_DETAIL + COMMON,
  },
];

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const job of JOBS) {
    const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
      body: JSON.stringify({
        model: 'doubao-seedream-5-0-pro-260628',
        prompt: job.prompt,
        response_format: 'url',
        size: '1536x2048',
        stream: false,
        watermark: false,
      }),
    });
    const data = await res.json();
    if (!res.ok || data.error) { console.error(`[${job.dest}] API 失败:`, JSON.stringify(data).slice(0, 300)); continue; }
    const buf = Buffer.from(await (await fetch(data.data[0].url)).arrayBuffer());
    const out = path.join(OUT_DIR, job.dest);
    fs.writeFileSync(out, buf);
    console.log(`[${job.dest}] 已保存 (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
