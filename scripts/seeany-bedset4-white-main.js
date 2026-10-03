/**
 * seeany-bedset4-white-main.js — 为 BEDSET4 白色四件套生成主图（2026-10-02）
 * 参考图 = 线上米色(BEIGE)QUEEN 主图，保持同款场景/构图/松软松弛感，只把床品颜色换成纯白。
 * 用户确认后再批量生成 Grey / Pink。
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

const REF = 'https://www.makimoohome.com/images/products/BEDSET4-BEIGE-QUEEN/1.webp';

const PROMPT =
  '以参考图中的卧室场景和床品摆放为基准，生成一张同款构图的电商主图，只把床品颜色改为纯白色（pure white）。' +
  '核心要求：保留参考图里松软、松弛的感觉——被套蓬松饱满、自然垂坠出柔软褶皱，枕头饱满立挺、枕面平整无凹陷，' +
  '整体是磨毛面料（brushed microfiber）特有的柔软哑光质感，像刚整理过但有人住过的温馨感。' +
  '床品必须是干净的纯白色，不要米色或奶油色。' +
  '场景保持参考图风格：浅灰墙面、软包床头、床头柜台灯与绿植、窗边白纱帘柔光、床尾长凳搭针织毯、黄麻地毯。' +
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
  const dest = path.join(OUT, 'bedset4-white-main.png');
  console.log('创建任务 (bedset4 white main, 1:1, gpt-image-2.5)...');
  const uuid = await createTask();
  console.log(`task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  console.log('结果: ' + imgUrl);
  const buf = Buffer.from(await (await fetch(imgUrl)).arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`已保存 ${dest} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
