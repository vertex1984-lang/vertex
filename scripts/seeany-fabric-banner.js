/**
 * seeany-fabric-banner.js — 用 SeeAny API 生成 Fabric Guide 横幅图（2026-09）
 * 用法: node scripts/seeany-fabric-banner.js
 * 输出: public/images/fabric-guide/fabric-banner.png（21:9 超宽，供 landing 大模块 + /fabric-guide/ hero 共用）
 */
const fs = require('fs');
const path = require('path');
const KEY = (() => {
  const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
  return (env.match(/^SEEANY_API_KEY=(.+)$/m) || [])[1]?.trim();
})();
if (!KEY) { console.error('缺少 SEEANY_API_KEY'); process.exit(1); }

const API = 'https://api.seeany.com/api/ai/smarttask';
const OUT = path.join(__dirname, '..', 'public', 'images', 'fabric-guide');
fs.mkdirSync(OUT, { recursive: true });

const PROMPT =
  '超宽幅电商品牌横幅：六种不同质感的床品面料样品从左到右并排陈列——自然褶皱的亚麻、柔软水洗棉、轻盈仿亚麻、纯净有机棉、丝滑莫代尔、微光贡缎，' +
  '面料折叠堆放或自然垂坠，质感对比清晰，米白/鼠尾草绿/燕麦/暖棕色调，柔和自然侧光，浅景深，' +
  '暖色调家居摄影风格，高级电商品牌质感，写实摄影，无文字无水印无logo，横向构图开阔，画面下方留有干净空间';

async function createTask() {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({ aiTypeId: 113, aiType: 'smartImg', prompt: PROMPT, imgNum: 1, imgRatio: '21:9', mode: 'nano-banana-pro', size: '2K' }),
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
  const dest = path.join(OUT, 'fabric-banner.png');
  if (fs.existsSync(dest)) { console.log('已存在，跳过: ' + dest); return; }
  console.log('创建任务 (21:9)...');
  const uuid = await createTask();
  console.log(`task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  console.log('结果: ' + imgUrl);
  const buf = Buffer.from(await (await fetch(imgUrl)).arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`已保存 ${dest} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
