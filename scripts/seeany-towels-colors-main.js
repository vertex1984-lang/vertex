/**
 * seeany-towels-colors-main.js — 长绒棉毛巾 6 色灰底主图（2026-10-15）
 * 参考图1（构图）：4 个尺寸毛巾按大小叠放（Bath Sheet → Bath → Hand → Washcloth），浅灰底棚拍；
 * 参考图2（材质）：长绒棉毛圈特写，毛巾面料以此为准（蓬松毛圈 + 罗纹缎档）。
 * 流程：先只跑 CREAM 一张给用户确认，确认后去掉 ONLY_FIRST 跑全量。
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

// 参考图：本地图 → public/images/staging/ 部署到线上后引用公网 URL（同 seeany-duvet-folded.js 惯例）
const REF_COMPOSE = 'https://www.makimoohome.com/images/staging/towels-compose-ref.webp'; // 四尺寸叠放构图参考
const REF_FABRIC = 'https://www.makimoohome.com/images/staging/towels-fabric-ref.webp';   // 长绒棉毛圈材质参考

const COLORS = [
  { code: 'CREAM', zh: '奶油白色（soft cream）', extra: '毛巾必须是柔和的奶油白，不要纯白偏冷。' },
  { code: 'OATMEAL', zh: '燕麦色（warm oatmeal beige）', extra: '毛巾必须是低饱和的燕麦米色，不要偏黄偏深。' },
  { code: 'SAGE', zh: '鼠尾草灰绿（muted sage green）', extra: '毛巾必须是低饱和的鼠尾草灰绿，不要鲜绿。' },
  { code: 'DUSTYROSE', zh: '灰粉色（muted dusty rose）', extra: '毛巾必须是低饱和的灰粉，不要艳粉。' },
  { code: 'LIGHTGREY', zh: '浅灰色（soft light grey）', extra: '毛巾必须是中性浅灰，不要偏蓝。' },
  { code: 'DUSTYBLUE', zh: '灰蓝色（muted dusty blue）', extra: '毛巾必须是低饱和的灰蓝，不要宝蓝或藏青。' },
];

const ONLY_FIRST = process.env.ALL !== '1'; // 默认只生成第一张（CREAM）给用户确认

const promptOf = (zh, extra) =>
  '以第一张参考图的构图为基准：四条不同尺寸的毛巾按大小从下往上叠放（最大浴巾铺底，依次叠浴巾、毛巾、小方巾），' +
  '毛巾整齐对折成厚实的长方形，边缘平直，浅灰色纯色背景，电商棚拍主图。' +
  '毛巾面料严格参照第二张参考图：长绒棉毛圈（long-staple cotton terry）质感——蓬松饱满的环形毛圈、带罗纹缎档边，哑光柔软。' +
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
  const list = ONLY_FIRST ? COLORS.slice(0, 1) : COLORS;
  for (const { code, zh, extra } of list) {
    const dest = path.join(OUT, `towel-lsc-${code.toLowerCase()}-main.png`);
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
