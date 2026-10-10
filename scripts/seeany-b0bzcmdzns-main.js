/**
 * seeany-b0bzcmdzns-main.js — B0BZCMDZNS 颈枕灰底主图重生成（2026-10-10）
 * 参考现有主图 B0BZCMDZNS/1.webp（灰色记忆棉颈枕 + 黑色 makimoo 收纳袋）。
 * 用户要求：改浅灰棚拍背景；缩小产品整体占图比（四周留白更多）；
 * 大幅缩小黑色收纳袋的占比；颈枕为绝对主体、占主要画面空间。
 * 用法: node scripts/seeany-b0bzcmdzns-main.js
 * 输出: public/images/staging/B0BZCMDZNS-MAIN/main.webp（确认后替换 products/B0BZCMDZNS/1.webp）
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
const REF = `${SITE}/B0BZCMDZNS/1.webp`;

const PROMPT =
  '参考图决定产品外观：一只灰色记忆棉 U 形旅行颈枕（柔软绒面、右侧按扣调节带、左侧小挂耳），' +
  '配一只黑色抽绳收纳袋（袋身有白色 makimoo 圆形牛头 logo）。产品颜色、材质、logo 样式与参考图完全一致。' +
  '构图要求（重要）：颈枕是画面的绝对主体，平放并略微倾斜（四分之三俯视角度），颈枕本身占画面宽度约 55-60%；' +
  '黑色收纳袋**明显缩小**，体积约为颈枕的 1/4 到 1/5，放在颈枕后上方一侧作为陪衬，不能喧宾夺主；' +
  '产品组合整体占画面约 65-70%，四周留白均匀充足。' +
  '背景：浅灰色纯色摄影棚背景（light gray seamless studio background），柔和均匀的棚拍光线，' +
  '产品底部自然柔和的浅阴影，写实摄影，画面干净高级。' +
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
      inputImgs: [REF],
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
  console.log('创建任务: B0BZCMDZNS 颈枕灰底主图（袋子缩小、颈枕主体）');
  const uuid = await createTask();
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  const buf = Buffer.from(await res.arrayBuffer());
  const outDir = path.join(__dirname, '..', 'public', 'images', 'staging', 'B0BZCMDZNS-MAIN');
  fs.mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, 'main.webp');
  await sharp(buf).resize({ width: 1200, height: 1200, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(dest);
  console.log(`  已保存 ${dest}`);
})();
