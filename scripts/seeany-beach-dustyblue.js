/**
 * seeany-beach-dustyblue.js — 沙滩巾灰蓝+奶白配色（2026-10-16 用户定）
 * 蓝白条纹沙滩巾（1688-952595759182-C4 主图）→ 灰蓝+奶白相间：
 *   蓝色条纹 → 长绒棉毛巾 Dusty Blue 灰蓝色（MK-TOWEL-LSC-DUSTYBLUE 主图取色）
 *   白色条纹 → 长绒棉毛巾 Cream 奶白色（MK-TOWEL-LSC-CREAM 主图取色）
 * 同时移除原图左上角蓝色圆形 "2 PACK" 文字角标，画面无任何文字图形。
 * 两步输出（均 1:1）：
 *   1) beach-towel-dustyblue-main.png        —— 躺椅场景主图（构图/质感保持 C4 原样）
 *   2) beach-towel-dustyblue-stacked-1x1.png —— 叠放单品图（同 pinkwhite-stacked-1x1 样式）
 * 用法: node scripts/seeany-beach-dustyblue.js
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

const REF_SCENE = 'https://www.makimoohome.com/images/products/1688-952595759182-C4/1.webp'; // 蓝白条纹沙滩巾场景
const REF_CREAM = 'https://www.makimoohome.com/images/products/MK-TOWEL-LSC-CREAM-30X56/1.webp'; // 奶白色取色
const REF_BLUE = 'https://www.makimoohome.com/images/products/MK-TOWEL-LSC-DUSTYBLUE-30X56/1.webp'; // 灰蓝色取色

const promptMain =
  '以第一张参考图为绝对基准：两条条纹沙滩巾搭在木质躺椅上的电商主图场景，构图、躺椅、背景、光影全部保持原样零改动，' +
  '毛巾的棉质毛圈面料质感与条纹宽度、排列方式也保持原样。' +
  '改动一：条纹颜色——原蓝白相间条纹改为灰蓝奶白相间：' +
  '原蓝色条纹改成第三张参考图中毛巾的灰蓝色（dusty blue，低饱和灰调蓝），颜色1:1对应；' +
  '原白色条纹改成第二张参考图中毛巾的奶白色（warm cream white），颜色1:1对应。' +
  '第二、三张参考图仅作为颜色来源，严禁改变第一张图的毛圈质感与场景。' +
  '改动二：彻底移除原图左上角的蓝色圆形 "2 PACK" 文字角标，该区域用纯白背景自然填充，画面中不得出现任何文字、字母、数字、徽章或图形标签。' +
  '两条毛巾同为灰蓝奶白相间条纹。写实摄影质感，画面无文字、无水印、无logo、无人。';

const promptStacked =
  '以这张参考图为绝对基准：只保留画面下方叠放的两条灰蓝奶白相间条纹沙滩巾，' +
  '去掉木质躺椅和搭在躺椅上的那条毛巾，画面中不得出现躺椅、木材或第三条毛巾。' +
  '两条毛巾保持原来的叠放方式、角度、条纹宽度与排列、灰蓝色（dusty blue）与奶白色（warm cream white）的配色、' +
  '棉质毛圈面料质感、光影和褶皱细节，全部 1:1 不变。' +
  '画幅为 1:1 正方形，毛巾产品在画面中居中，上下区域用纯净白色摄影棚背景自然延伸填充，带轻微自然接触阴影。' +
  '写实摄影质感，画面无文字、无水印、无logo、无人。';

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

async function generate(name, prompt, inputImgs) {
  const dest = path.join(OUT, name);
  console.log(`创建任务: ${name}（1:1）`);
  const uuid = await createTask(prompt, inputImgs);
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 ${dest} (${buf.length} bytes)`);
}

(async () => {
  const mainPath = path.join(OUT, 'beach-towel-dustyblue-main.png');
  await generate('beach-towel-dustyblue-main.png', promptMain, [REF_SCENE, REF_CREAM, REF_BLUE]);
  await generate('beach-towel-dustyblue-stacked-1x1.png', promptStacked, [await localRefDataUri(mainPath)]);
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
