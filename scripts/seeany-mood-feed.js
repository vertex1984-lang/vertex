/**
 * seeany-mood-feed.js — 生成 ins 种草流氛围图（2026-10-08 ins 版测试副本专用）
 * 用法: node scripts/seeany-mood-feed.js
 * 输出: public/images/mood/mood-{living,towels,mats,dining,nook}.webp（4:3，2K → 1600×1200 webp）
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
const OUT = path.join(__dirname, '..', 'public', 'images', 'mood');
fs.mkdirSync(OUT, { recursive: true });

const STYLE = '暖色调家居摄影风格，米色和暖棕色调（beige & warm brown palette），柔和自然光，高级电商品牌质感，写实摄影，无文字无水印无logo';
// ins 种草风补充：生活化、松弛感、像生活方式博主随手拍的高级感
const INS = '生活方式杂志感构图，画面有呼吸感和留白，松弛自然的居家氛围（lived-in、不刻意摆拍），浅景深';

const JOBS = [
  { name: 'mood-living', prompt: `温馨客厅午后：米色布艺沙发上搭着一条蓬松的奶油色仿兔毛毯，几个米色抱枕随意靠着，旁边原木茶几上有一杯热咖啡和一本翻开的书，阳光透过白纱帘洒在地板上。${INS}。${STYLE}` },
  { name: 'mood-towels', prompt: `明亮浴室 spa 一角：原木层板上整齐叠放着米白色纯棉浴巾，旁边编织篮里卷着毛巾，地上铺着编织浴室垫，绿植点缀，晨光透过磨砂玻璃。${INS}。${STYLE}` },
  { name: 'mood-mats', prompt: `温暖玄关场景：原木鞋柜旁铺着一条米色编织地垫，一双棉麻拖鞋随意放着，墙上挂着草帽和帆布包，晨光从门口斜照进来。${INS}。${STYLE}` },
  { name: 'mood-dining', prompt: `晨光餐桌静物：原木餐桌上放着藤编托盘，托盘里有陶瓷咖啡杯和小点心，旁边一枝尤加利叶插在玻璃瓶里，柔和晨光，背景虚化。${INS}。${STYLE}` },
  { name: 'mood-nook', prompt: `卧室阅读角：靠窗的原木椅子上搭着针织毯，旁边落地灯散着暖光，窗台上放着一杯茶和几本书，窗外是朦胧的绿色，午后安静氛围。${INS}。${STYLE}` },
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
      mode: 'gpt-image-2.5-sunburst',
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
  for (const job of JOBS) {
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
