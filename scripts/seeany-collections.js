/**
 * seeany-collections.js — 生成首页 6 个分类卡片的略缩图
 * 用法: node scripts/seeany-collections.js
 * 输出: public/images/collections/{cushions,pillows,towels-mats,travel,holiday,other}.webp
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
const OUT = path.join(__dirname, '..', 'public', 'images', 'collections');
fs.mkdirSync(OUT, { recursive: true });

const STYLE = '暖色调家居摄影风格，米色和暖棕色调（beige & warm brown palette），柔和自然光，高级电商品牌质感，写实摄影，无文字无水印无logo';

const JOBS = [
  { name: 'cushions', prompt: `温馨的餐区一角：木质餐椅上放着米色簇绒椅垫，旁边是绿植和陶瓷餐具，晨光柔和。${STYLE}` },
  { name: 'pillows', prompt: `米色布艺沙发上整齐摆放着几个蓬松的白色和米色抱枕，旁边针织毯子搭在扶手上，温馨客厅氛围。${STYLE}` },
  { name: 'towels-mats', prompt: `明亮浴室场景：木质层板上叠放着米白色纯棉浴巾，地上铺着编织浴室地垫，绿植点缀，干净清爽。${STYLE}` },
  { name: 'travel', prompt: `旅行场景：飞机舷窗旁的米色座椅上放着一个记忆棉U型旅行颈枕，旁边是行李箱一角，柔和舱内光线。${STYLE}` },
  { name: 'holiday', prompt: `温暖节日氛围：室内一角悬挂着暖黄色灯串，柔和光斑点缀在米色墙面前，下方有蜡烛和小摆件，温馨节日感。${STYLE}` },
  { name: 'other', prompt: `厨房台面静物：木质台面上放着一个复古铜色胡椒研磨器，旁边有陶瓷小碗和香草枝，背景虚化的厨房搁架，温暖晨光。${STYLE}` },
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
      imgNum: 1,
      imgRatio: '4:3',
      mode: 'nano-banana-pro',
      size: '1K',
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
  for (const job of JOBS) {
    const dest = path.join(OUT, `${job.name}.webp`);
    console.log(`创建任务: ${job.name}`);
    const uuid = await createTask(job);
    console.log(`  task_uuid=${uuid}, 等待生成...`);
    const imgUrl = await pollTask(uuid);
    const res = await fetch(imgUrl);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize({ width: 1200, height: 900, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(dest);
    console.log(`  已保存 ${dest}`);
  }
  console.log('全部完成');
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
