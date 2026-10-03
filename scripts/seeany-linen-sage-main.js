/**
 * seeany-linen-sage-main.js — 为 /bedding/linen/ 的 Sage（灰绿）三件套生成"自然使用过"松弛感主图（2026-09-30）
 * 参考图 = 线上现有 Sage 主图（保持颜色/材质准确），只改床品摆放状态：被子掀开、枕头歪斜的 lived-in 感。
 * 输出预览到 scripts/seeany-edit-preview/，用户确认后再决定入主图目录。
 */
const fs = require('fs');
const path = require('path');
const KEY = (() => {
  for (const p of [
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '..', '.env.local'),
    'E:\\Makimoo Website\\headless-store\\.env.local',
    'E:\\Makimoo Website\\headless-store\\.env',
  ]) {
    try {
      const env = fs.readFileSync(p, 'utf-8');
      const m = env.match(/^SEEANY_API_KEY=(.+)$/m);
      if (m) return m[1].trim();
    } catch {}
  }
})();
if (!KEY) { console.error('缺少 SEEANY_API_KEY'); process.exit(1); }

const API = 'https://api.seeany.com/api/ai/smarttask';
const OUT = path.join(__dirname, 'seeany-edit-preview');
fs.mkdirSync(OUT, { recursive: true });

const REF = 'https://www.makimoohome.com/images/products/LINEN3-SAGE-QUEEN/1.webp';

const PROMPT =
  '以参考图中的灰绿色（sage green）纯亚麻被套三件套为主体，生成一张卧室场景电商主图。' +
  '核心要求：被子呈现自然使用过的状态——掀开一角、随意堆出柔软褶皱，是"有人刚起床离开"的懒散松弛感（lived-in、unmade duvet）；' +
  '但枕头必须保持整洁——枕套平整饱满、表面无凹陷、无褶皱，枕头摆放可以略微随意歪斜但形态完整如新。' +
  '床品的灰绿色调和亚麻材质肌理必须与参考图保持一致。' +
  '场景：暖米色墙壁，柔和晨光透过白纱帘洒入，原木床架，米色/暖棕家居调性。' +
  '写实摄影质感，浅景深，画面无文字、无水印、无logo、无人。';

async function createTask() {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt: PROMPT,
      inputImgs: [REF], imgNum: 1, imgRatio: '1:1',
      mode: 'gpt-image-2.5', size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(JSON.stringify(data));
  return data.data.task_uuid;
}

async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 90; i++) {
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api' } });
    const data = await res.json();
    if (data.code !== 0) throw new Error(`查询失败: ${JSON.stringify(data)}`);
    const { status, progress, assets } = data.data;
    if (i % 6 === 0) console.log(`  ${status} ${progress ?? 0}%`);
    if (status === 'succeeded' || status === 'partial_failed') {
      const img = assets?.[0]?.images?.[0]?.url;
      if (!img) throw new Error(`无结果图: ${JSON.stringify(data.data).slice(0, 300)}`);
      return img;
    }
    if (status === 'failed') throw new Error(`任务失败: ${data.data.error_message || '未知原因'}`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error('轮询超时');
}

(async () => {
  const dest = path.join(OUT, 'linen-sage-main-relaxed-flatpillow.png');
  console.log('创建任务 (linen sage relaxed main, 1:1, gpt-image-2.5)...');
  const uuid = await createTask();
  console.log(`task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  console.log('结果: ' + imgUrl);
  const buf = Buffer.from(await (await fetch(imgUrl)).arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`已保存 ${dest} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
