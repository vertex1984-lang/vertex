/**
 * seeany-boucle-pillow-main.js — 白色泰迪绒（bouclé）方形抱枕灰底棚拍主图（2026-10-13，先生成一张验收）
 * 标准对齐枕套主图规范（MK-PC-CTN-CREAM/1.webp）：浅灰纯色棚拍背景、正面视角、居中、
 * 底部浅阴影、无文字无 logo 无织标；1:1，2K → 1200×1200。
 * 参考图 3 张：前两张是用户实物照片（正面 + 侧面俯视，决定面料质感/颜色/版型），
 * 第三张是线上奶白棉质枕套主图（决定构图与影棚风格）。
 * 用法: node scripts/seeany-boucle-pillow-main.js
 * 输出: public/images/staging/MK-PC-BOUCLE-WHITE/main.webp
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const KEY = (() => {
  const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
  return (env.match(/^SEEANY_API_KEY=(.+)$/m) || [])[1]?.trim();
})();
if (!KEY) { console.error('缺少 SEEANY_API_KEY'); process.exit(1); }

const API = 'https://api.seeany.com/api/ai/smarttask';
const OUT = path.join(__dirname, '..', 'public', 'images', 'staging', 'MK-PC-BOUCLE-WHITE');
fs.mkdirSync(OUT, { recursive: true });

const REF_FRONT = 'https://www.makimoohome.com/images/staging/refs/boucle-pillow/front.jpg';
const REF_SIDE = 'https://www.makimoohome.com/images/staging/refs/boucle-pillow/side.jpg';
const REF_STYLE = 'https://www.makimoohome.com/images/products/MK-PC-CTN-CREAM/1.webp';

const PROMPT =
  '前两张参考图是同一只抱枕的实物照片：白色泰迪绒/羊羔绒（white bouclé / teddy fleece）方形抱枕，' +
  '绒面呈细密颗粒卷曲质感，颜色为干净奶白色，填充饱满、四角自然微翘，侧面有隐藏拉链。' +
  '抱枕的面料质感、颗粒密度、颜色必须与前两张实物图完全一致。' +
  '第三张参考图（网站现有枕套主图）只决定构图与影棚风格：浅灰色纯色无缝摄影棚背景（light gray seamless studio background），' +
  '正面视角、抱枕竖直立于画面中央，整体居中构图、占画面约 80%、四周留白均匀，底部自然柔和的浅阴影。' +
  '**不要任何织标/标签/拉链头可见/logo/水印文字**，绒面完全纯净；画面中只有这一只抱枕，不要叠放、不要多只、不要家具。' +
  '柔和均匀的棚拍光线，奶白绒面在浅灰背景上清晰分离（不要过曝融进背景），写实摄影，画面干净高级、ins 风。';

async function createTask() {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KEY}`,
      'User-Agent': 'seeany-api',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      aiTypeId: 113,
      aiType: 'smartImg',
      prompt: PROMPT,
      inputImgs: [REF_FRONT, REF_SIDE, REF_STYLE],
      imgNum: 1,
      imgRatio: '1:1',
      mode: 'gpt-image-2.5',
      size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(JSON.stringify(data));
  return data.data.task_uuid;
}

async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 90; i++) {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api' },
    });
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
    await new Promise(r => setTimeout(r, 5000));
  }
  throw new Error('轮询超时');
}

(async () => {
  console.log('创建任务: 白色泰迪绒抱枕灰底棚拍主图');
  const uuid = await createTask();
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  const buf = Buffer.from(await res.arrayBuffer());
  const dest = path.join(OUT, 'main.webp');
  await sharp(buf).resize({ width: 1200, height: 1200, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(dest);
  console.log(`  已保存 ${dest}`);
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
