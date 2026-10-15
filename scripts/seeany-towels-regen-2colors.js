/**
 * seeany-towels-regen-2colors.js — 重新生成 DUSTYROSE / LIGHTGREY 两张毛巾主图（2026-10-16）
 * 原因：首次生成的这两张面料呈横向罗纹/灯芯绒状条纹，与其余 4 张的蓬松环形毛圈不一致。
 * 修复：prompt 强化"蓬松环形毛圈颗粒"，并明确禁止横向条纹/罗纹表面。
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

const REF_COMPOSE = 'https://www.makimoohome.com/images/staging/towels-compose-ref.webp'; // 四尺寸叠放构图参考
const REF_FABRIC = 'https://www.makimoohome.com/images/staging/towels-fabric-ref.webp';   // 长绒棉毛圈材质参考

const COLORS = [
  { code: 'DUSTYROSE', zh: '灰粉色（muted dusty rose）', extra: '毛巾必须是低饱和的灰粉，不要艳粉。' },
  { code: 'LIGHTGREY', zh: '浅灰色（soft light grey）', extra: '毛巾必须是中性浅灰，不要偏蓝。' },
];

const promptOf = (zh, extra) =>
  '以第一张参考图的构图为基准：四条不同尺寸的毛巾按大小从下往上叠放（最大浴巾铺底，依次叠浴巾、毛巾、小方巾），' +
  '毛巾整齐对折成厚实的长方形，边缘平直，浅灰色纯色背景，电商棚拍主图。' +
  '毛巾面料严格参照第二张参考图：长绒棉毛圈（long-staple cotton terry）质感——表面是蓬松饱满的细小环形毛圈颗粒，' +
  '绒圈均匀密布、哑光柔软，仅在毛巾端部有一条罗纹缎档边。' +
  '严禁出现横向条纹、灯芯绒式条绒、平织罗纹表面；毛巾主体必须是毛圈绒面而不是条纹面。' +
  `毛巾颜色改为${zh}。` + extra +
  '四条毛巾为同一颜色同一面料。写实摄影质感，柔和均匀的棚拍光线，画面无文字、无水印、无logo、无人。';

async function createTask(prompt) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs: [REF_COMPOSE, REF_FABRIC], imgNum: 1, imgRatio: '1:1',
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
  for (const { code, zh, extra } of COLORS) {
    const dest = path.join(OUT, `towel-lsc-${code.toLowerCase()}-main-v2.png`);
    if (fs.existsSync(dest)) { console.log(`跳过 ${code}（已存在）`); continue; }
    console.log(`[${code}] 创建任务...`);
    const uuid = await createTask(promptOf(zh, extra));
    console.log(`[${code}] task_uuid=${uuid}, 等待生成...`);
    const imgUrl = await pollTask(uuid);
    const buf = Buffer.from(await (await fetch(imgUrl)).arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`[${code}] 已保存 ${dest} (${buf.length} bytes)`);
  }
  console.log('完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
