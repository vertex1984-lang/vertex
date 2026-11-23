/**
 * seeany-b0d9lh1y55-white-main.js — B0D9LH1Y55 希腊黄铜胡椒研磨器白底主图（2026-11-02 用户定，
 * 仅此一次不用规则里的灰底，要白底；展示方法与现有主图不同）。
 * 现有主图 B0D9LH1Y55/1.webp：正立面平视、手柄水平指向右侧、竖直对称构图。
 * 新图差异化：相机右前方 3/4 视角 + 轻微仰视，手柄斜向上指向左上（约 45°），器身微侧，
 * 纯白无缝背景（#FFFFFF），底部柔和接触阴影，无文字水印（器身 MAKIMOO 刻字保留）。
 * 参考图仅用于锁定产品外观（黄铜材质、雕花饰带、圆顶、底座造型）。
 * 用法: node scripts/seeany-b0d9lh1y55-white-main.js
 * 输出: public/images/staging/B0D9LH1Y55-WHITE-MAIN/main.webp（确认后替换 products/B0D9LH1Y55/1.webp）
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
const PRODUCT_REF = 'https://www.makimoohome.com/images/products/B0D9LH1Y55/1.webp';

const PROMPT =
  '参考图是一台希腊风格黄铜手动胡椒研磨器（brass pepper mill）：抛光金色黄铜圆柱器身、' +
  '圆顶盖、侧面曲柄手柄、器身中部有 "MAKIMOO" 刻字与多条 Greek key 回纹雕花饰带、外撇圆形底座。' +
  '参考图**用于锁定产品外观与身材比例**：材质、颜色、雕花饰带的位置与样式、刻字、圆顶与底座造型必须与参考图完全一致；' +
  '**器身比例必须与参考图一致——非常修长纤细（tall and slender），圆柱器身的高度约为直径的 5.5 倍以上，' +
  '加上圆顶与底座后整机高度约为最大宽度的 4.5-5 倍；绝对不要画短、不要画粗、不要变矮胖**（上次生成的图器身明显偏短偏粗，这是错误示范）。' +
  '**构图展示方式必须与参考图不同**：参考图是正立面平视、手柄水平指向右侧的证件照式构图；' +
  '新图改为——相机从右前方约 30° 的四分之三视角拍摄并带轻微仰视，器身略微侧转（能看到圆柱体的体积感与高光过渡），' +
  '曲柄手柄斜向上指向画面左上方（与水平约成 40-45°，不要水平、不要垂直）。' +
  '**纯白色无缝摄影棚背景（pure white seamless background, #FFFFFF）**，柔和均匀的棚拍光，' +
  '黄铜高光干净不爆、暗部不死黑，底座下方有自然柔和的浅接触阴影。' +
  '写实摄影，画面干净高级；整台研磨器完整入镜、居中构图，整机高度约占画面 90%，手柄不顶到画面边缘，四周留白均匀。' +
  '除器身本身的 MAKIMOO 刻字外，**不要任何额外文字、logo、水印、道具或手**——画面只有这一台研磨器。';

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
      inputImgs: [PRODUCT_REF],
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
    const { status, progress } = data.data;
    if (i % 6 === 0) console.log(`  [${uuid.slice(0, 8)}] ${status} ${progress ?? 0}%`);
    if (status === 'succeeded' || status === 'partial_failed') {
      const img = data.data.assets?.[0]?.images?.[0]?.url;
      if (!img) throw new Error(`无结果图: ${JSON.stringify(data.data).slice(0, 300)}`);
      return img;
    }
    if (status === 'failed') throw new Error(`任务失败: ${data.data.error_message || '未知原因'}`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error('轮询超时');
}

(async () => {
  console.log('创建任务: B0D9LH1Y55 黄铜研磨器白底主图（3/4 视角差异化构图）');
  const uuid = await createTask();
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  const buf = Buffer.from(await res.arrayBuffer());
  const outDir = path.join(__dirname, '..', 'public', 'images', 'staging', 'B0D9LH1Y55-WHITE-MAIN');
  fs.mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, 'main-v2.webp');
  await sharp(buf).resize({ width: 1200, height: 1200, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(dest);
  console.log(`  已保存 ${dest}`);
})();
