/**
 * seeany-linen-colors-main.js — 为 LINEN3 三件套其余颜色批量生成"被子松弛+枕头平整"主图（2026-10-02）
 * 与 seeany-linen-sage-main.js 同一 prompt 模板，只换颜色和参考图（各色 QUEEN 主图）。
 * 输出预览到 scripts/seeany-edit-preview/linen-{color}-main.png，人工检查后再替换。
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

const COLORS = [
  { code: 'CHARCOAL',  zh: '深炭灰色（charcoal）' },
  { code: 'DUSTYBLUE', zh: '灰蓝色（dusty blue）' },
  { code: 'IVORY',     zh: '象牙白色（ivory）' },
  { code: 'OATMEAL',   zh: '燕麦色（oatmeal）' },
];

const promptOf = (zh) =>
  `以参考图中的${zh}纯亚麻被套三件套为主体，生成一张卧室场景电商主图。` +
  '核心要求：被子呈现自然使用过的状态——掀开一角、随意堆出柔软褶皱，是"有人刚起床离开"的懒散松弛感（lived-in、unmade duvet）；' +
  '但枕头必须保持整洁——枕套平整饱满、表面无凹陷、无褶皱，枕头摆放可以略微随意歪斜但形态完整如新。' +
  `床品的${zh}色调和亚麻材质肌理必须与参考图保持一致。` +
  '场景：暖米色墙壁，柔和晨光透过白纱帘洒入，原木床架，米色/暖棕家居调性。' +
  '写实摄影质感，浅景深，画面无文字、无水印、无logo、无人。';

async function createTask(ref, prompt) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs: [ref], imgNum: 1, imgRatio: '1:1',
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
    const { status, assets } = data.data;
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
  for (const { code, zh } of COLORS) {
    const dest = path.join(OUT, `linen-${code.toLowerCase()}-main.png`);
    if (fs.existsSync(dest)) { console.log(`跳过 ${code}（已存在）`); continue; }
    const ref = `https://www.makimoohome.com/images/products/LINEN3-${code}-QUEEN/1.webp`;
    console.log(`[${code}] 创建任务...`);
    const uuid = await createTask(ref, promptOf(zh));
    console.log(`[${code}] task_uuid=${uuid}, 等待生成...`);
    const imgUrl = await pollTask(uuid);
    const buf = Buffer.from(await (await fetch(imgUrl)).arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`[${code}] 已保存 ${dest} (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
