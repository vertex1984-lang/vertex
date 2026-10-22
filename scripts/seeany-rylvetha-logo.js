/**
 * seeany-rylvetha-logo.js — 用 SeeAny gpt-image-2.5 生成 Rylvetha 品牌 logo（1 张 1K 1:1）
 * 用法: node scripts/seeany-rylvetha-logo.js
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

const PROMPT = `Design a minimalist, modern, gender-neutral logo for a home & living brand named "Rylvetha".
Style: Ultra-minimalist, contemporary, neutral. Clean geometric lines, generous negative space, international design quality. Inspired by the visual language of Muji, HAY and Aesop, but fully original.
Icon (primary mark): An abstract geometric symbol derived from the idea of "home / living space" — for example, a softly rounded roofline formed by two gentle arcs, a simplified chair silhouette, or an abstract "house slice" built from a circle and straight lines. Alternatively, distill the letter "R" into a minimal geometric form fused with a roofline or shelter shape. The mark must be extremely simplified, using only 1–2 basic geometric shapes with rounded corners, conveying warmth, reliability and everyday calm. No realistic illustration, no gradients.
Typography: The word "rylvetha" set in a modern geometric sans-serif (Futura / Neuzeit style), medium weight, slightly expanded tracking (+5%), all lowercase preferred for a warm contemporary feel — or title case "Rylvetha". Clean, even strokes, highly legible. Spell the name exactly: R-Y-L-V-E-T-H-A.
Composition: Icon centered, wordmark directly below it, vertical spacing equal to roughly 1/3 of the icon height. Perfectly balanced; must remain recognizable at 64px app-icon size.
Colors: Strictly neutral palette — deep charcoal (#2B2B2B) mark and wordmark on a warm off-white background (#F7F4EF), or a single warm taupe (#8A7E72) as the only accent. Maximum 2 colors in the entire image. No saturated colors.
Background: Flat solid warm-white / light beige background, no texture, no shadows, no scene or lifestyle photography.
Rendering: Flat vector style, crisp edges, no 3D, no gloss, no drop shadows. Present one single finished logo on a plain background — not a mockup, not a business card, not a sticker.
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
      imgRatio: '1:1',
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
  const dest = path.join(OUT, 'rylvetha-logo.png');
  if (fs.existsSync(dest)) { console.log(`已存在，跳过: ${dest}`); return; }
  console.log('创建任务: rylvetha-logo (1:1, 1K, gpt-image-2.5-sunburst)');
  const uuid = await createTask();
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  console.log(`  结果: ${imgUrl}`);
  const res = await fetch(imgUrl);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 ${dest} (${buf.length} bytes)`);
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
