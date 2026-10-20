/**
 * seeany-beach-greywhite-stacked-grey-v2.js — C2 灰底叠放主图重做（2026-10-16 用户定）
 * 问题：greywhite 灰底叠放图折叠细节和毛圈材质感不佳。
 * 方案：参考 sagewhite 灰底叠放图（第一张）的叠放方式与毛圈材质 1:1 复刻，
 *       配色用 greywhite 灰底叠放图（第二张）的浅灰+奶白，灰底保持 #e5e5e5。
 * 输出：public/images/staging/beach-towel-greywhite-stacked-grey-1x1-v2.png（确认后替换正式版）
 * 用法: node scripts/seeany-beach-greywhite-stacked-grey-v2.js
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
const REF_STRUCTURE = path.join(OUT, 'beach-towel-sagewhite-stacked-grey-1x1.png'); // 材质+折叠基准
const REF_COLOR = path.join(OUT, 'beach-towel-greywhite-stacked-grey-1x1.png'); // 配色来源

const prompt =
  '以第一张参考图为绝对基准：两条叠放条纹沙滩巾的叠放方式、折叠结构、角度、占画面比例、' +
  '棉质毛圈面料的绒毛质感与细节、光影、浅灰色摄影棚背景（约 #e5e5e5）全部 1:1 复刻。' +
  '唯一改动：配色——条纹改成第二张参考图的配色：浅灰色（light grey）条纹 + 奶白色（warm cream white）条纹相间，' +
  '颜色与第二张图 1:1 对应，条纹宽度和排列跟随第一张图。' +
  '第二张参考图仅作为颜色来源，严禁沿用其折叠形态与材质表现。' +
  '写实摄影质感，画面无文字、无水印、无logo、无人。';

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask(inputImgs) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs, imgNum: 1, imgRatio: '1:1',
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
  const dest = path.join(OUT, 'beach-towel-greywhite-stacked-grey-1x1-v2.png');
  console.log('创建任务: greywhite 灰底叠放图 v2（C3 材质折叠 + C2 配色）');
  const uuid = await createTask([await dataUri(REF_STRUCTURE), await dataUri(REF_COLOR)]);
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 ${dest} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
