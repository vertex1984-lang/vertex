/**
 * seeany-beach-pinkwhite-stacked.js — 沙滩巾叠放单品图（2026-10-16 用户定）
 * 基于 beach-towel-pinkwhite-main.png（不改原图）：只保留下方叠放的两条粉白条纹毛巾，
 * 去掉躺椅和搭在躺椅上的毛巾，颜色（灰粉+奶白）、毛圈质感、条纹宽度全部不变。
 * 参考图优先用本地主图（压缩后 base64 data URI）；API 不支持时回退到 3 张公网参考图。
 * 输出：public/images/staging/beach-towel-pinkwhite-stacked.png（验证用）
 * 用法: node scripts/seeany-beach-pinkwhite-stacked.js
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
const SRC = path.join(OUT, 'beach-towel-pinkwhite-main.png');

const REF_SCENE = 'https://www.makimoohome.com/images/products/1688-952595759182/1.webp'; // 红白条纹沙滩巾场景
const REF_CREAM = 'https://www.makimoohome.com/images/products/MK-TOWEL-LSC-CREAM-30X56/1.webp'; // 奶白色取色
const REF_ROSE = 'https://www.makimoohome.com/images/products/MK-TOWEL-LSC-DUSTYROSE-30X56/1.webp'; // 灰粉色取色

// 本地主图作参考（颜色/材质与原图 1:1）
const promptLocal =
  '以这张参考图为绝对基准：只保留画面下方叠放的两条粉白相间条纹沙滩巾，' +
  '去掉木质躺椅和搭在躺椅上的那条毛巾，画面中不得出现躺椅、木材或第三条毛巾。' +
  '两条毛巾保持原来的叠放方式、角度、条纹宽度与排列、灰粉色（muted dusty rose）与奶白色（warm cream white）的配色、' +
  '棉质毛圈面料质感、光影和褶皱细节，全部 1:1 不变。' +
  '背景为纯净白色摄影棚背景，带轻微自然接触阴影。写实摄影质感，画面无文字、无水印、无logo、无人。';

// 回退方案：3 张公网参考图重新生成（同 seeany-beach-pinkwhite-main.js 的取色逻辑）
const promptFallback =
  '生成一张电商单品主图：两条条纹沙滩巾整齐叠放（一上一下两条叠成一摞），' +
  '构图为平视角近景，毛巾占画面主体，纯净白色摄影棚背景，带轻微自然接触阴影。' +
  '毛巾为粉白相间条纹：粉色条纹用第三张参考图中毛巾的灰粉色（muted dusty rose，低饱和柔粉），颜色1:1对应；' +
  '白色条纹用第二张参考图中毛巾的奶白色（warm cream white），颜色1:1对应。' +
  '条纹宽度、排列方式与棉质毛圈面料质感参考第一张图。' +
  '三张参考图仅作为颜色与质感来源。画面中只有这两条叠放的毛巾，无躺椅、无其他物品。' +
  '写实摄影质感，画面无文字、无水印、无logo、无人。';

async function localRefDataUri() {
  const sharp = require('sharp');
  const buf = await sharp(SRC).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask(prompt, inputImgs) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs, imgNum: 1, imgRatio: '3:2',
      mode: 'gpt-image-2.5', size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) {
    const err = new Error(JSON.stringify(data));
    err.apiData = data;
    throw err;
  }
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
  if (!fs.existsSync(SRC)) { console.error(`找不到原图: ${SRC}`); process.exit(1); }
  fs.mkdirSync(OUT, { recursive: true });
  const dest = path.join(OUT, 'beach-towel-pinkwhite-stacked.png');

  let uuid;
  try {
    console.log('创建任务: 叠放毛巾单品图（本地主图 data URI 作参考，3:2）');
    uuid = await createTask(promptLocal, [await localRefDataUri()]);
  } catch (e) {
    console.log(`  本地参考图方式被拒（${e.message.slice(0, 200)}），回退到 3 张公网参考图`);
    uuid = await createTask(promptFallback, [REF_SCENE, REF_CREAM, REF_ROSE]);
  }
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 ${dest} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
