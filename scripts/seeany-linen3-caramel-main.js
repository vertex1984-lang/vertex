/**
 * seeany-linen3-caramel-main.js — LINEN3 亚麻被套三件套新色 Caramel 主图（2026-10-16）
 * 做法：ref1 = LINEN3-IVORY-QUEEN/1.webp（卧室场景+亚麻床品，构图/质感基准）
 *       ref2 = MK-PC-CORD-CARAMEL/1.webp（仅取焦糖色，严禁带入灯芯绒条纹质感）
 * 输出：public/images/products/LINEN3-CARAMEL-QUEEN/1.webp（1:1 → 1600×1600 webp q82）
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
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
const OUT = path.join(__dirname, '..', 'public', 'images', 'products', 'LINEN3-CARAMEL-QUEEN');
fs.mkdirSync(OUT, { recursive: true });

const REF_SCENE = 'https://www.makimoohome.com/images/products/LINEN3-IVORY-QUEEN/1.webp';
const REF_COLOR = 'https://www.makimoohome.com/images/products/MK-PC-CORD-CARAMEL/1.webp';

const prompt =
  '以第一张参考图为绝对基准：现代暖调卧室场景，床上铺着亚麻被套三件套（被套+两个枕套），' +
  '房间、床架、灯光、绿植、床尾凳、构图与氛围全部保持原样零改动。' +
  '唯一改动：把床上三件套（被套与枕套）的布料颜色改成第二张参考图中抱枕套的颜色——' +
  '温暖的焦糖棕（warm caramel brown），颜色1:1对应第二张参考图。' +
  '注意：第二张参考图只作为颜色来源，严禁带入其灯芯绒条纹质感——' +
  '床品必须保持第一张图中100%亚麻的布料质感：天然麻结纹理、哑光质朴、自然褶皱肌理。' +
  '床品布料在暖光下呈现自然的明暗过渡与真实阴影，颜色均匀不发闷。' +
  '写实摄影质感，画面无文字、无水印、无logo、无人。';

async function createTask() {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs: [REF_SCENE, REF_COLOR], imgNum: 1, imgRatio: '1:1',
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
    if (i % 6 === 0) console.log(`  [${uuid.slice(0, 8)}] ${status} ${progress ?? 0}%`);
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
  const dest = path.join(OUT, '1.webp');
  console.log('创建任务: linen3-caramel-queen main（1:1）');
  const uuid = await createTask();
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  let buf;
  for (let a = 0; a < 3; a++) {
    try {
      buf = Buffer.from(await (await fetch(imgUrl)).arrayBuffer());
      break;
    } catch (e) {
      if (a === 2) throw e;
      console.log(`  下载失败，${(a + 1) * 5}s 后重试...`);
      await new Promise((r) => setTimeout(r, (a + 1) * 5000));
    }
  }
  // Windows 上 sharp 就地覆写会 EPERM：先写 .tmp 再 rename
  const tmp = dest + '.tmp';
  await sharp(buf).resize({ width: 1600, height: 1600, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(tmp);
  fs.renameSync(tmp, dest);
  console.log(`  已保存 ${dest}`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
