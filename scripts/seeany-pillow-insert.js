/**
 * seeany-pillow-insert.js — 抱枕芯 B0CQC6H9MZ 新主图组（2026-10-08 用户定，先生成一组验收）
 * 3 张：1) 主图 正面居中（浅灰底，枕头纯白故不用纯白底） 2) 侧向厚度展示（厚度适中） 3) microfiber 填充物展示
 * 参考图：线上现有 1.webp（同一布料质感），mode gpt-image-2.5（图生图）
 * 用法: node scripts/seeany-pillow-insert.js
 * 输出: public/images/staging/B0CQC6H9MZ/{main,side,filling}.webp（1:1，2K → 1200×1200）
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
const STAGING = path.join(__dirname, '..', 'public', 'images', 'staging');
const OUT = path.join(STAGING, 'B0CQC6H9MZ');
fs.mkdirSync(OUT, { recursive: true });

const REF = 'https://www.makimoohome.com/images/products/B0CQC6H9MZ/1.webp';
const BASE = '以参考图中的白色方形抱枕芯为准：纯白色细密磨毛布套、四角饱满，保持完全一致的面料质感与工艺。**不要任何织标/标签/logo/印花**（参考图右下角的小织标必须去掉，布套表面完全纯净）。浅灰色纯色摄影棚背景（light gray seamless studio background，枕头纯白所以不用白底），柔和均匀的棚拍光线，底部自然柔和的浅阴影，写实摄影，画面干净高级，无文字无水印无logo';

const JOBS = [
  { name: 'main', prompt: `${BASE}。构图：单个抱枕芯正面居中端正展示，平整饱满，占画面约 70%，四周留白均匀。` },
  // 2026-10-08 用户定：主图改为 Pack of 2 双枕构图（替代单枕 main）
  { name: 'main-2pack', prompt: `${BASE}。构图：两个白色方形抱枕芯（45×45cm 正方形），一个平放、另一个斜靠叠放在其上，居中构图，整体占画面约 80%，四周留白均匀，展示 Pack of 2。` },
  { name: 'side', prompt: `${BASE}。构图：单个抱枕芯平放（水平躺放），从正侧面视角展示厚度，厚度适中（自然蓬松但不过鼓，约 8-10cm 视觉效果），上表面略拱、轮廓自然。枕头占画面约 85%，左右两侧贴近画面边缘但完整不裁切，上下留白窄。` },
  { name: 'filling', prompt: `${BASE}。构图：抱枕芯一角拉开拉链，蓬松的白色 microfiber 超细纤维填充物自然涌出，旁边散落一小团填充纤维作特写，纤维细腻蓬松有光泽，展示真材实料。` },
  // 种草场景图（规则见 seeany-mood-feed.js：暖色调、ins 生活方式杂志感）
  { name: 'scene', prompt: `以参考图中的白色抱枕芯为准：纯白色细密磨毛布套、饱满蓬松，面料质感一致，**布套表面完全纯净，无任何织标/标签/logo/印花**。场景：温暖的客厅午后，米色亚麻沙发上放着一个白色方形抱枕芯和一个白色长方形腰枕抱枕芯（自然随意地靠着，不刻意摆拍），旁边搭着一条奶油色针织毯，原木茶几上有一杯热茶，阳光透过白纱帘洒在沙发上。生活方式杂志感构图，画面有呼吸感和留白，松弛自然的居家氛围（lived-in），浅景深。暖色调家居摄影风格，米色和暖棕色调，柔和自然光，高级电商品牌质感，写实摄影，无文字无水印无logo。` },
  // 长方形同布料（30×50cm / 12×20in，Pack of 2）主图；侧面图与填充物图共用方形组
  { name: 'B0CQBZM49V-main', asin: 'B0CQBZM49V', prompt: `${BASE.replace('白色方形抱枕芯', '白色长方形腰枕抱枕芯')}。构图：两个长方形腰枕抱枕芯（30×50cm，约 2:3 长宽比，横长竖短），一个平放、另一个斜靠叠放在其上，横向居中构图，整体占画面约 80%，四周留白均匀，展示 Pack of 2。` },
  // 注意：B0G6M3F7CY 是菱形绗缝布料（非本次磨毛布），不要套用本脚本生成，需用其自有参考图单独出图
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
      inputImgs: [REF],
      imgNum: 1,
      imgRatio: '1:1',
      mode: 'gpt-image-2.5',
      size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`${job.name}: ${JSON.stringify(data)}`);
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
  // 支持只跑指定图：node scripts/seeany-pillow-insert.js side
  const only = process.argv[2];
  for (const job of JOBS) {
    if (only && job.name !== only) continue;
    const dir = job.asin ? path.join(STAGING, job.asin) : OUT;
    fs.mkdirSync(dir, { recursive: true });
    const dest = path.join(dir, job.asin ? 'main.webp' : `${job.name}.webp`);
    console.log(`创建任务: ${job.name}`);
    const uuid = await createTask(job);
    console.log(`  task_uuid=${uuid}, 等待生成...`);
    const imgUrl = await pollTask(uuid);
    const res = await fetch(imgUrl);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize({ width: 1200, height: 1200, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(dest);
    console.log(`  已保存 ${dest}`);
  }
  console.log('全部完成');
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
