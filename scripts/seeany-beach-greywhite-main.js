/**
 * seeany-beach-greywhite-main.js — 沙滩巾灰白配色主图（2026-10-16 用户定）
 * 灰白条纹沙滩巾（1688-952595759182-C2 主图）→ 浅灰+奶白相间：
 *   深灰色条纹 → 长绒棉毛巾 Light Grey 浅灰色（MK-TOWEL-LSC-LIGHTGREY 主图取色）
 *   白色条纹   → 长绒棉毛巾 Cream 奶白色（MK-TOWEL-LSC-CREAM 主图取色）
 * 构图/毛圈质感/场景全部保持 ref1 原样，两张参考毛巾仅取颜色。
 * 输出：public/images/staging/beach-towel-greywhite-main.png（验证用，确认后再接入产品）
 * 用法: node scripts/seeany-beach-greywhite-main.js
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
const OUT = path.join(__dirname, '..', 'public', 'images', 'staging');
fs.mkdirSync(OUT, { recursive: true });

const REF_SCENE = 'https://www.makimoohome.com/images/products/1688-952595759182-C2/1.webp'; // 灰白条纹沙滩巾场景
const REF_CREAM = 'https://www.makimoohome.com/images/products/MK-TOWEL-LSC-CREAM-30X56/1.webp'; // 奶白色取色
const REF_GREY = 'https://www.makimoohome.com/images/products/MK-TOWEL-LSC-LIGHTGREY-30X56/1.webp'; // 浅灰色取色

const prompt =
  '以第一张参考图为绝对基准：两条条纹沙滩巾搭在木质躺椅上的电商主图场景，构图、躺椅、背景、光影全部保持原样零改动，' +
  '毛巾的棉质毛圈面料质感与条纹宽度、排列方式也保持原样。' +
  '唯一改动：条纹颜色——原深灰白相间条纹改为浅灰奶白相间：' +
  '原深灰色条纹改成第三张参考图中毛巾的浅灰色（light grey，浅淡中性灰），颜色1:1对应；' +
  '原白色条纹改成第二张参考图中毛巾的奶白色（warm cream white），颜色1:1对应。' +
  '第二、三张参考图仅作为颜色来源，严禁改变第一张图的毛圈质感与场景。' +
  '两条毛巾同为浅灰奶白相间条纹。写实摄影质感，画面无文字、无水印、无logo、无人。';

async function createTask() {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs: [REF_SCENE, REF_CREAM, REF_GREY], imgNum: 1, imgRatio: '1:1',
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
  const dest = path.join(OUT, 'beach-towel-greywhite-main.png');
  console.log('创建任务: beach-towel-greywhite（1:1）');
  const uuid = await createTask();
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 ${dest} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
