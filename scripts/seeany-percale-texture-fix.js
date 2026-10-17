/**
 * seeany-percale-texture-fix.js — 修正 percale-sky-1x1.png 的布料质感（2026-10-17 用户定）
 * 起因：首版天空蓝主图布料偏软（像纤维棉）；用户给定 Parachute percale 实拍参考
 * （staging/ref-parachute-percale-sky.jpg）——percale 应更厚实、略硬挺、折痕清晰。
 * 做法：以现有 sky 主图为基准 img2img，布局/机位/颜色/物品 1:1 零改动，仅改布料质感。
 * 原软质版备份为 staging/percale-sky-1x1-soft-backup.png。
 * 用法: node scripts/seeany-percale-texture-fix.js
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
const STAGING = path.join(__dirname, '..', 'public', 'images', 'staging');
const SRC = path.join(STAGING, 'percale-sky-1x1.png');
const BACKUP = path.join(STAGING, 'percale-sky-1x1-soft-backup.png');
const DEST = SRC;

async function localRefDataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask(prompt, inputImgs) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs, imgNum: 1, imgRatio: '1:1',
      mode: 'gpt-image-2.5-sunburst', size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(JSON.stringify(data));
  return data.data.task_uuid;
}

async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 120; i++) {
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
  if (!fs.existsSync(SRC)) { console.error(`找不到 ${SRC}`); process.exit(1); }
  const ref = await localRefDataUri(SRC);
  const prompt =
    '以这张参考图为绝对基准：暖调奶油风卧室，床上一套天空蓝被套+枕套三件套。' +
    '房间场景、机位构图、床头板、床尾长凳、床头柜、台灯、绿植、挂画、地毯、窗户光线、' +
    '床品的颜色（天空蓝，1:1 不变）与铺放方式全部零改动。' +
    '唯一改动：被套和两个枕套的面料质感改为纯棉 Percale（平纹密织棉）——' +
    '面料明显更厚实、略带硬度的挺括骨感（酒店级靠爽手感），哑光平纹细密织纹，' +
    '褶皱变成清晰锐利、有折痕感的结构性折皱（纸感折痕），不再是现在这种柔软贴身的细波纹；' +
    '绝非磨毛绒感、绝非缎面光泽；保留原有的光影明暗与色调。' +
    '写实摄影质感，画面无文字、无水印、无logo、无人。';
  console.log('创建任务: percale sky 质感修正（1:1, sunburst 2K）');
  const uuid = await createTask(prompt, [ref]);
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (!fs.existsSync(BACKUP)) fs.copyFileSync(SRC, BACKUP);
  const tmp = DEST + '.tmp';
  fs.writeFileSync(tmp, buf);
  fs.renameSync(tmp, DEST);
  console.log(`  已保存 ${DEST} (${buf.length} bytes)，软质版备份: ${BACKUP}`);
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
