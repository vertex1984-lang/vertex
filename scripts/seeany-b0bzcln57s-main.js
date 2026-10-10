/**
 * seeany-b0bzcln57s-main.js — B0BZCLN57S 黑色颈枕灰底主图（2026-10-10）
 * 产品外观/颜色参考 B0BZCLN57S/1.webp（黑色绒面颈枕 + 按扣调节带 + 黑色 makimoo 收纳袋），
 * 构图/背景标准参考 B0BZCMDZNS/1.webp（灰底、颈枕主体、袋子缩小陪衬）。
 * 用法: node scripts/seeany-b0bzcln57s-main.js
 * 输出: public/images/staging/B0BZCLN57S-MAIN/main.webp
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
const SITE = 'https://www.makimoohome.com/images/products';
const PRODUCT_REF = `${SITE}/B0BZCLN57S/1.webp`;
const STYLE_REF = `${SITE}/B0BZCMDZNS/1.webp`;

const PROMPT =
  '第一张参考图决定产品外观：一只纯黑色记忆棉 U 形旅行颈枕（柔软绒面、右侧按扣调节带、左侧小挂耳），' +
  '配一只黑色抽绳收纳袋（袋身有白色 makimoo 圆形牛头 logo）。**产品的颜色、材质、样式、logo 必须与第一张图完全一致，不要任何改动**。' +
  '第二张参考图只用于决定构图与背景：颈枕是画面的绝对主体，平放并略微倾斜（四分之三俯视角度），颈枕本身占画面宽度约 55-60%；' +
  '黑色收纳袋明显缩小，体积约为颈枕的 1/4 到 1/5，放在颈枕后上方一侧作为陪衬；产品组合整体占画面约 65-70%，四周留白均匀充足。' +
  '背景：浅灰色纯色摄影棚背景（light gray seamless studio background），柔和均匀的棚拍光线，' +
  '产品底部自然柔和的浅阴影，写实摄影，画面干净高级。黑色产品要注意保留绒面质感与暗部细节，不要死黑一片。' +
  '除收纳袋上原有的 makimoo logo 外，不要任何其他文字/标签/水印。';

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
      inputImgs: [PRODUCT_REF, STYLE_REF],
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
    let data;
    try {
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api' },
      });
      data = await res.json();
    } catch (e) {
      console.log(`  轮询重试: ${e.message}`);
      await new Promise((r) => setTimeout(r, 5000));
      continue;
    }
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
  console.log('创建任务: B0BZCLN57S 黑色颈枕灰底主图');
  const uuid = await createTask();
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  let buf;
  for (let k = 0; k < 5; k++) {
    try {
      const res = await fetch(imgUrl);
      buf = Buffer.from(await res.arrayBuffer());
      break;
    } catch (e) {
      console.log(`  下载重试: ${e.message}`);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  if (!buf) throw new Error('下载失败');
  const outDir = path.join(__dirname, '..', 'public', 'images', 'staging', 'B0BZCLN57S-MAIN');
  fs.mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, 'main.webp');
  await sharp(buf).resize({ width: 1200, height: 1200, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(dest);
  console.log(`  已保存 ${dest}`);
})();
