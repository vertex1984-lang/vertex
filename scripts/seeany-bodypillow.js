/**
 * seeany-bodypillow.js — Body Pillow Insert（长条抱枕芯，参考 Parachute 54"×20"）主图 + 场景图（2026-10-08 用户定）
 * 布料与 B0CQC6H9MZ 磨毛布枕芯一致（纯白细密磨毛布套）；侧面图/填充物图复用现有枕芯组，不生成
 * 主图风格与 pillow inserts 组图一致：浅灰棚拍底、无标签 logo、1:1 2K → 1200×1200 webp q82
 * 用法: node scripts/seeany-bodypillow.js [main|scene]   （不传则全跑）
 * 输出: public/images/staging/bodypillow/{main,scene}.webp
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
const OUT = path.join(__dirname, '..', 'public', 'images', 'staging', 'bodypillow');
fs.mkdirSync(OUT, { recursive: true });

// 与枕芯组图同一参考图，保证布料质感一致
const REF = 'https://www.makimoohome.com/images/products/B0CQC6H9MZ/1.webp';
const FABRIC = '以参考图中的白色抱枕芯为准：纯白色细密磨毛布套、四角饱满，保持完全一致的面料质感与工艺。**不要任何织标/标签/logo/印花**（参考图上的小织标必须去掉，布套表面完全纯净）。';

const JOBS = [
  {
    name: 'main',
    prompt: `${FABRIC}产品：长条形 body pillow 抱枕芯（约 54×20 英寸 / 137×50cm，细长条比例约 2.7:1，横长竖短），单个水平居中展示，平整饱满、轮廓自然微拱。浅灰色纯色摄影棚背景（light gray seamless studio background，枕头纯白所以不用白底），柔和均匀的棚拍光线，底部自然柔和的浅阴影。枕头横向占画面约 85%，左右贴近画面边缘但完整不裁切，上下留白均匀。写实摄影，画面干净高级，无文字无水印无logo。`,
  },
  {
    name: 'scene',
    prompt: `${FABRIC}场景：温暖明亮的卧室清晨，米色亚麻床品的双人床上，床头立着两个白色睡枕，床面横放着一只长条形白色 body pillow 抱枕芯（约 54×20 英寸细长条，自然随意地放着，不刻意摆拍），床尾搭着一条奶油色针织毯，原木床头柜上有一杯热咖啡和一本书，阳光透过白纱帘洒在床面。生活方式杂志感构图，画面有呼吸感和留白，松弛自然的居家氛围（lived-in），浅景深。暖色调家居摄影风格，米色和暖棕色调，柔和自然光，高级电商品牌质感，写实摄影，无文字无水印无logo。`,
  },
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
  const only = process.argv[2];
  for (const job of JOBS) {
    if (only && job.name !== only) continue;
    const dest = path.join(OUT, `${job.name}.webp`);
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
