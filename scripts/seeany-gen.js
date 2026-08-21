/**
 * seeany-gen.js — 用 SeeAny API 生成 about 页配图
 * 用法: node scripts/seeany-gen.js
 * 任务全异步: 创建 3 个任务 → 轮询 → 下载结果到 public/images/about/
 */
const fs = require('fs');
const path = require('path');
const KEY = (() => {
  const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
  return (env.match(/^SEEANY_API_KEY=(.+)$/m) || [])[1]?.trim();
})();
if (!KEY) { console.error('缺少 SEEANY_API_KEY'); process.exit(1); }

const API = 'https://api.seeany.com/api/ai/smarttask';
const OUT = path.join(__dirname, '..', 'public', 'images', 'about');
fs.mkdirSync(OUT, { recursive: true });

const STYLE = '暖色调家居摄影风格，米色和暖棕色调（beige & warm brown palette），柔和自然光，高级电商品牌质感，写实摄影，无文字无水印无logo';

const JOBS = [
  {
    name: 'about-story',
    ratio: '4:3',
    prompt: `温馨客厅一角：米色布艺沙发上摆放着花卉图案坐垫和米白色抱枕，旁边是木质茶几和绿植，窗外柔和自然光洒入。${STYLE}`,
  },
  {
    name: 'about-sustainability',
    ratio: '16:9',
    prompt: `自然材质静物特写：棉麻织物纹理、原木块、绿植叶片摆放在米色背景上，柔和绿+米色调，安静环保的氛围感。${STYLE}`,
  },
  {
    name: 'about-banner',
    ratio: '21:9',
    prompt: `超宽幅品牌横幅：黄昏暖光下的阳台庭院场景，户外木椅上放着花卉图案坐垫和靠枕，周围绿植环绕，温馨生活气息，画面横向构图开阔。${STYLE}`,
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
      imgNum: 1,
      imgRatio: job.ratio,
      mode: 'nano-banana-pro',
      size: '1K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`${job.name}: ${JSON.stringify(data)}`);
  return data.data.task_uuid;
}

// 轮询任务结果：GET /api/developer/task/status?task_uuid=xxx
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
  // 已创建未消费的任务（避免重复扣费）
  const EXISTING = { 'about-story': 'wbf65b4d12e9592be89ed8325' };
  for (const job of JOBS) {
    const dest = path.join(OUT, `${job.name}.png`);
    if (fs.existsSync(dest)) { console.log(`跳过已存在: ${job.name}`); continue; }
    let uuid = EXISTING[job.name];
    if (uuid) {
      console.log(`复用已创建任务: ${job.name} task_uuid=${uuid}`);
    } else {
      console.log(`创建任务: ${job.name} (${job.ratio})`);
      uuid = await createTask(job);
      console.log(`  task_uuid=${uuid}, 等待生成...`);
    }
    const imgUrl = await pollTask(uuid);
    console.log(`  结果: ${imgUrl}`);
    const res = await fetch(imgUrl);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`  已保存 ${dest} (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
