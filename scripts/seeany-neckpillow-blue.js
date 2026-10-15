/**
 * seeany-neckpillow-blue.js — 浅蓝色细针织 U 形颈枕灰底棚拍主图（2026-10-13，用户定：布料+蓝色取自实物照片）
 * 样式/构图对齐 B0BZCMDZNS 已确认主图：颈枕平放微倾（四分之三俯视）为绝对主体，
 * 黑色 makimoo 抽绳收纳袋缩小至约 1/4~1/5 放后上方一侧；浅灰纯色棚拍背景、底部浅阴影。
 * 参考图 2 张：第 1 张用户实物照片（决定面料=浅蓝色细针织布、按扣带细节、颜色），
 * 第 2 张 B0BZCMDZNS/1.webp（决定构图与产品形态）。
 * 用法: node scripts/seeany-neckpillow-blue.js
 * 输出: public/images/staging/NECKPILLOW-BLUE-KNIT/main.webp
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
const REF_FABRIC = 'https://www.makimoohome.com/images/staging/refs/neckpillow-fabric/blue-knit.jpg';
const REF_STYLE = 'https://www.makimoohome.com/images/products/B0BZCMDZNS/1.webp';

const PROMPT =
  '第一张参考图是实物照片，决定面料与颜色：U 形记忆棉旅行颈枕，面料为浅蓝色（light dusty blue，低饱和柔和浅蓝）' +
  '细针织布（fine knit fabric，可见细密针织纹理），前端按扣调节带（同色系按扣）。' +
  '颈枕的面料质感与浅蓝色必须与第一张参考图完全一致。' +
  '第二张参考图决定构图与产品形态：颈枕平放并略微倾斜（四分之三俯视角度）作为画面绝对主体，占画面宽度约 55-60%；' +
  '前端按扣带与尾端小挂袢细节保留；配一只黑色抽绳收纳袋（袋身有白色 makimoo 圆形牛头 logo），' +
  '收纳袋明显缩小、体积约为颈枕的 1/4 到 1/5，放在颈枕后上方一侧作为陪衬；' +
  '产品组合整体占画面约 65-70%，四周留白均匀充足。' +
  '背景：浅灰色纯色摄影棚背景（light gray seamless studio background），柔和均匀的棚拍光线，' +
  '产品底部自然柔和的浅阴影，写实摄影，画面干净高级、ins 风。' +
  '除收纳袋上的 makimoo logo 外，不要任何其他织标/标签/文字/水印。';

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
      inputImgs: [REF_FABRIC, REF_STYLE],
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
      await new Promise(r => setTimeout(r, 5000));
      continue;
    }
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
  console.log('创建任务: 浅蓝细针织颈枕灰底主图');
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
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  if (!buf) throw new Error('下载失败');
  const outDir = path.join(__dirname, '..', 'public', 'images', 'staging', 'NECKPILLOW-BLUE-KNIT');
  fs.mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, 'main.webp');
  await sharp(buf).resize({ width: 1200, height: 1200, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(dest);
  console.log(`  已保存 ${dest}`);
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
