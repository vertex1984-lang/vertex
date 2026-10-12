/**
 * seeany-pdp-lifestyle.js — PDP 种草图（信任条下方 / You May Also Like 上方双图区，2026-10-12 用户定）
 * 规则（同 seeany-mood-feed.js 种草图规范）：暖色调家居摄影、米色暖棕色调、柔和自然光、
 * ins 生活方式杂志感（lived-in、不刻意摆拍、浅景深、有呼吸感留白）、无文字无水印无 logo、布面无标签。
 * 参考图 = 装饰枕套产品主图（灰底棚拍）：
 *   灯芯绒焦糖棕 MK-PC-CORD-CARAMEL / 水洗棉鼠尾草绿 MK-PC-CTN-SAGE（线上 URL，img2img 保布料质感）
 * 用法: node scripts/seeany-pdp-lifestyle.js [job名]   （不传则全跑）
 * 输出: public/images/pdp-lifestyle/{job}.webp（4:3，2K → 1600×1200 webp q82）
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
const OUT = path.join(__dirname, '..', 'public', 'images', 'pdp-lifestyle');
fs.mkdirSync(OUT, { recursive: true });

const STYLE = '暖色调家居摄影风格，米色和暖棕色调（beige & warm brown palette），柔和自然光，高级电商品牌质感，写实摄影，无文字无水印无logo，布面完全纯净（无任何织标/标签/印花）';
const INS = '生活方式杂志感构图，画面有呼吸感和留白，松弛自然的居家氛围（lived-in、不刻意摆拍），浅景深';

const JOBS = [
  {
    name: 'pillow-corduroy-nook',
    ref: 'https://www.makimoohome.com/images/products/MK-PC-CORD-CARAMEL/1.webp',
    prompt: `以参考图中的抱枕为准：**灯芯绒（corduroy）布料**、细密竖条纹绒面、哑光柔雾质感，颜色保持**焦糖棕（caramel brown）**不变。场景：温暖客厅阅读角——米色布艺扶手椅上自然斜放着两个焦糖棕灯芯绒抱枕（一大一小前后错开、不刻意摆拍），扶手搭一条奶油色针织毯，旁边原木边几上放着一杯热咖啡和一本翻开的书，暖光落地灯，白纱帘透进午后柔光。${INS}。${STYLE}`,
  },
  {
    name: 'pillow-cotton-bed',
    ref: 'https://www.makimoohome.com/images/products/MK-PC-CTN-SAGE/1.webp',
    prompt: `以参考图中的抱枕为准：**水洗棉质感（washed cotton-like）布料**、细腻哑光棉质表面、轻微自然褶皱，颜色保持**鼠尾草绿（sage green）**不变。场景：明亮卧室晨光——原木床架、米白亚麻床品上自然靠着两个鼠尾草绿水洗棉抱枕（随意斜靠、不刻意摆拍），床头柜上一小瓶绿植，晨光透过白纱帘洒在被面上，画面安静柔和。${INS}。${STYLE}`,
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
      inputImgs: [job.ref],
      imgNum: 1,
      imgRatio: '4:3',
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
    await sharp(buf).resize({ width: 1600, height: 1200, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(dest);
    console.log(`  已保存 ${dest}`);
  }
  console.log('全部完成');
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
