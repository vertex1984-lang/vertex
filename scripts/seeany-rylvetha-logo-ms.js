/**
 * seeany-rylvetha-logo-ms.js — 用 SeeAny gpt-image-2.5 生成 Rylvetha 品牌 logo（微软式横版：左图标 + 右字标）
 * 用法: node scripts/seeany-rylvetha-logo-ms.js
 */
const fs = require('fs');
const path = require('path');
const KEY = (() => {
  const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
  return (env.match(/^SEEANY_API_KEY=(.+)$/m) || [])[1]?.trim();
})();
if (!KEY) { console.error('缺少 SEEANY_API_KEY'); process.exit(1); }

const API = 'https://api.seeany.com/api/ai/smarttask';
const OUT = path.join(__dirname, '..', '..', 'images');
fs.mkdirSync(OUT, { recursive: true });

const PROMPT = `Design a minimalist, modern logo for a home & living brand named "Rylvetha", in the horizontal lockup format of the Microsoft logo: a small geometric icon on the LEFT and the wordmark on the RIGHT, aligned on one horizontal baseline, generous spacing between icon and text.
Icon: a 2x2 grid of four small rounded squares (like the Microsoft four-square mark but fully original), rendered in a strict neutral palette — deep charcoal (#2B2B2B), warm taupe (#8A7E72), and warm off-white; the four squares may use subtle tonal variations of these neutrals only. Flat, crisp, no gradients, no 3D.
Typography: the word "rylvetha" in a modern geometric sans-serif (Futura / Neuzeit style), medium weight, slightly expanded tracking, all lowercase, deep charcoal #2B2B2B. Spell exactly: R-Y-L-V-E-T-H-A. Clean even strokes, highly legible.
Colors: maximum 3 neutral tones in the entire image, no saturated colors.
Background: flat solid warm off-white (#F7F4EF), no texture, no shadows.
Rendering: flat vector style, crisp edges, no 3D, no gloss, no drop shadows. One single finished horizontal logo lockup centered on the plain background — not a mockup, not a business card.
Negative prompt: no gradients, no 3D effects, no photographic elements, no ornate patterns, no script/handwritten fonts, no cartoon style, no taglines or extra text, no misspellings of "rylvetha".`;

async function createTask() {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KEY}`,
      'User-Agent': 'seeany-api',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      aiTypeId: 113,
      aiType: 'smartImg',
      prompt: PROMPT,
      imgNum: 1,
      imgRatio: '3:2',
      mode: 'gpt-image-2.5-sunburst',
      size: '1K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`创建失败: ${JSON.stringify(data)}`);
  return data.data.task_uuid;
}

async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 90; i++) {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api' },
    });
    const data = await res.json();
    if (data.code !== 0) throw new Error(`查询失败: ${JSON.stringify(data)}`);
    const { status, progress, assets } = data.data;
    if (i % 6 === 0) console.log(`  [${uuid.slice(0, 8)}] ${status} ${progress ?? 0}%`);
    if (status === 'succeeded' || status === 'partial_failed') {
      const img = assets?.[0]?.images?.[0]?.url;
      if (!img) throw new Error(`无结果图: ${JSON.stringify(data.data).slice(0, 300)}`);
      return img;
    }
    if (status === 'failed') throw new Error(`任务失败: ${data.data.error_message || '未知原因'}`);
    await new Promise(r => setTimeout(r, 5000));
  }
  throw new Error('轮询超时');
}

(async () => {
  const dest = path.join(OUT, 'rylvetha-logo-ms.png');
  console.log('创建任务: rylvetha-logo-ms (3:2, 1K, gpt-image-2.5-sunburst)');
  const uuid = await createTask();
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  console.log(`  结果: ${imgUrl}`);
  const res = await fetch(imgUrl);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 ${dest} (${buf.length} bytes)`);
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
