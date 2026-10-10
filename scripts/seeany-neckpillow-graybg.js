/**
 * seeany-neckpillow-graybg.js — 颈枕灰底主图批处理（2026-10-10）
 * 标准（沿用 B0BZCMDZNS 已确认版）：浅灰纯色棚拍背景、柔和棚拍光、底部浅阴影；
 * 颈枕为绝对主体（占画面宽约 55-60%），收纳配件缩小至约 1/4~1/5 放后上方一侧；
 * 产品组合整体占画面约 65-70%，四周留白均匀；不改产品细节与颜色。
 * 用法: node scripts/seeany-neckpillow-graybg.js [过滤词 ...]（不传 = 全部 6 个）
 * 输出: public/images/staging/<KEY>/main.webp
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

const COMMON =
  '背景：浅灰色纯色摄影棚背景（light gray seamless studio background），柔和均匀的棚拍光线，' +
  '产品底部自然柔和的浅阴影，写实摄影，画面干净高级。' +
  '构图要求（重要）：颈枕是画面的绝对主体，平放并略微倾斜（四分之三俯视角度），颈枕本身占画面宽度约 55-60%；' +
  '收纳配件**明显缩小**，体积约为颈枕的 1/4 到 1/5，放在颈枕后上方一侧作为陪衬，不能喧宾夺主；' +
  '产品组合整体占画面约 65-70%，四周留白均匀充足。' +
  '除参考图上产品原有的 logo/织标外，不要任何其他文字/标签/水印。';

const JOBS = [
  {
    key: 'B0C2Z9PFFK-MAIN',
    ref: `${SITE}/B0C2Z9PFFK/1.webp`,
    prompt:
      '参考图决定产品外观：一只深灰黑色记忆棉 U 形旅行颈枕（上半部分透气网眼布拼接、下半部分深色绒面、前端黑色抽绳调节扣、右侧小织标），' +
      '配一只黑色抽绳收纳袋（袋身有白色 makimoo 圆形牛头 logo）。**不要修改产品的任何细节和颜色**，与参考图完全一致。' + COMMON,
  },
  ...[
    ['1688-913882303732', 'Violet 紫罗兰色'],
    ['1688-913882303732-c3', 'Sage Green 灰绿色'],
    ['1688-913882303732-c4', 'Spring Pink 嫩粉色'],
    ['1688-913882303732-c5', 'Obsidian Grey 深灰色'],
    ['1688-913882303732-c6', 'Ivory White 象牙白色'],
  ].map(([asin, color]) => ({
    key: `${asin}-MAIN`,
    ref: `${SITE}/${asin}/1.webp`,
    prompt:
      `参考图决定产品外观：一只${color}记忆棉 U 形旅行颈枕（细针织面料、前端抽绳调节扣、侧面滑扣片），` +
      `配一只同色系蛋形拉链收纳盒（带手提织带）。**不要修改产品的任何细节和颜色**，颈枕与收纳盒的颜色、材质、形状必须与参考图完全一致。` + COMMON,
  })),
];

async function createTask(job) {
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
      prompt: job.prompt,
      inputImgs: [job.ref],
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

async function run(job) {
  console.log(`创建任务: ${job.key}`);
  const uuid = await createTask(job);
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
  const outDir = path.join(__dirname, '..', 'public', 'images', 'staging', job.key);
  fs.mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, 'main.webp');
  await sharp(buf).resize({ width: 1200, height: 1200, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(dest);
  console.log(`  已保存 ${dest}`);
}

(async () => {
  const filter = process.argv.slice(2).map((s) => s.toUpperCase());
  const jobs = filter.length ? JOBS.filter((j) => filter.some((f) => j.key.toUpperCase().includes(f))) : JOBS;
  if (jobs.length === 0) { console.error('无匹配的任务'); process.exit(1); }
  let failed = 0;
  for (const job of jobs) {
    try { await run(job); } catch (e) { failed++; console.error(`${job.key} 失败:`, e.message); }
  }
  if (failed) process.exit(1);
  console.log('全部完成');
})();
