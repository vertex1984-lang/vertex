/**
 * _gen-hero-seeany-staging.js — SEEANY 版编辑大片 hero 对比图（2026-11-27 用户要求单独查看）。
 * 与 _gen-hero-drop-editorial.js（Seedream 版）同提示词，输出到 staging/hero-seeany/ 独立目录，
 * 不覆盖 hero-drop-{desktop,mobile}.webp（正式 hero 用 Seedream 版）。
 * 用法：node scripts/_gen-hero-seeany-staging.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const KEY = (() => {
  const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
  return (env.match(/^SEEANY_API_KEY=(.+)$/m) || [])[1]?.trim();
})();
if (!KEY) { console.error('缺少 SEEANY_API_KEY'); process.exit(1); }

const API = 'https://api.seeany.com/api/ai/smarttask';

const STYLE =
  'Warm editorial interior photography for a premium bedding brand homepage hero. ' +
  'Photorealistic, high-end interior magazine quality, soft diffused natural window light, ' +
  'cream ivory and caramel brown palette, airy and calm, generous styling restraint. ' +
  'No people, no text, no logo, no watermark.';

const JOBS = [
  {
    name: 'desktop',
    imgRatio: '16:9',
    prompt:
      'Cinematic wide editorial hero photograph, 16:9. A serene minimalist bedroom: an ivory-cream ' +
      'linen bedding set with softly rumpled duvet on a low platform bed, placed in the right two-thirds ' +
      'of the frame; floor-to-ceiling window at the far right with sheer curtains and soft morning mist ' +
      'outside. The LEFT THIRD of the frame is calm empty negative space (a soft warm plain wall in ' +
      'shallow shadow) kept clean for overlay headline text. ' + STYLE,
  },
  {
    name: 'mobile',
    imgRatio: '3:4',
    prompt:
      'Tall portrait editorial hero photograph, 3:4. The same serene minimalist bedroom: an ivory-cream ' +
      'linen bedding set with softly rumpled duvet on a low bed centered in the middle of the frame, ' +
      'tall window with sheer curtains above, soft morning mist outside. The LOWER THIRD of the frame is ' +
      'calm and uncluttered (quiet bed surface and floor, no objects) kept clean for overlay text. ' + STYLE,
  },
];

async function createTask(prompt, imgRatio) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KEY}`,
      'User-Agent': 'seeany-api',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      aiTypeId: 113,
      aiType: 'smartImg',
      prompt,
      imgNum: 1,
      imgRatio,
      mode: 'gpt-image-2.5',
      size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(JSON.stringify(data));
  return data.data.task_uuid;
}

async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 90; i++) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${KEY}`, 'User-Agent': 'seeany-api' },
    });
    const data = await res.json();
    if (data.code !== 0) throw new Error(`查询失败: ${JSON.stringify(data)}`);
    const { status } = data.data;
    if (status === 'succeeded' || status === 'partial_failed') {
      const img = data.data.assets?.[0]?.images?.[0]?.url;
      if (!img) throw new Error(`无结果图: ${JSON.stringify(data.data).slice(0, 300)}`);
      return img;
    }
    if (status === 'failed') throw new Error(`任务失败: ${data.data.error_message || '未知原因'}`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error('轮询超时');
}

(async () => {
  const outDir = path.join(__dirname, '..', 'public', 'images', 'staging', 'hero-seeany');
  fs.mkdirSync(outDir, { recursive: true });
  for (const job of JOBS) {
    console.log(`创建任务: SEEANY hero ${job.name} (${job.imgRatio})`);
    const uuid = await createTask(job.prompt, job.imgRatio);
    console.log(`  task_uuid=${uuid}`);
    const imgUrl = await pollTask(uuid);
    const buf = Buffer.from(await (await fetch(imgUrl)).arrayBuffer());
    const dest = path.join(outDir, `${job.name}.webp`);
    await sharp(buf).webp({ quality: 85 }).toFile(dest);
    console.log(`  已保存 ${dest}`);
  }
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
