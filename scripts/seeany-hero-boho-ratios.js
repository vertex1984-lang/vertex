/**
 * seeany-hero-boho-ratios.js — 以 scene-social-3-boho-jungle.png 为参考图，
 * 生成桌面 16:9 / 移动 9:16 两个 hero 专用比例（2026-10-02 用户定：boho 图做首页 hero）。
 * 输出 scripts/seeany-edit-preview/hero-boho-{desktop,mobile}.png
 */
const fs = require('fs');
const path = require('path');
const KEY = (() => {
  for (const p of [
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '..', '.env.local'),
    'E:\\Makimoo Website\\headless-store\\.env.local',
    'E:\\Makimoo Website\\headless-store\\.env',
  ]) {
    try {
      const env = fs.readFileSync(p, 'utf-8');
      const m = env.match(/^SEEANY_API_KEY=(.+)$/m);
      if (m) return m[1].trim();
    } catch {}
  }
})();
if (!KEY) { console.error('缺少 SEEANY_API_KEY'); process.exit(1); }

const API = 'https://api.seeany.com/api/ai/smarttask';
const OUT = path.join(__dirname, 'seeany-edit-preview');
fs.mkdirSync(OUT, { recursive: true });

// 扩图：inputImgs 传已上线的 4:3 原图 URL，保持画面内容 1:1 不变，仅向两侧/上下扩展。
// 用法: node seeany-hero-boho-ratios.js [srcUrl] [namePrefix]
const SRC_URL = process.argv[2] || 'https://www.makimoohome.com/images/brand/hero-boho-src.png';
const PREFIX = process.argv[3] || 'hero-boho';
const BASE_PROMPT = '以参考图为基准进行画面扩展（outpainting）：参考图中的卧室场景、所有物件、构图、透视角度、光影、色调、材质纹理全部 1:1 保持原样，零改动、零移位、零增减、零缩放；仅在指定方向无缝延展画面，扩展区域的墙面、窗帘、绿植、地毯、地板等与参考图风格、光线、纹理自然连续衔接，无接缝、无重复克隆感。画面无文字、无水印、无logo、无人；规避塑料CGI质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视。';

const JOBS = [
  {
    name: `${PREFIX}-desktop`,
    ratio: '16:9',
    prompt: '将参考图扩展为横向 16:9 宽幅构图，参考图内容完整保留在画面中央，主要向左右两侧延展（两侧绿植、窗帘、墙面装饰、地毯自然延伸），上下按需补足。' + BASE_PROMPT,
  },
  {
    name: `${PREFIX}-mobile`,
    ratio: '9:16',
    prompt: '将参考图扩展为竖向 9:16 纵向构图，参考图内容完整保留在画面中央，主要向上下延展（上方墙面装饰与垂落绿植完整延伸；下方床尾、地毯、地面物件完整延伸），左右按需补足。' + BASE_PROMPT,
  },
];

async function createTask(job) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt: job.prompt,
      inputImgs: [SRC_URL],
      imgNum: 1, imgRatio: job.ratio,
      mode: 'gpt-image-2.5', size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`${job.name}: ${JSON.stringify(data)}`);
  return data.data.task_uuid;
}

async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 90; i++) {
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api' } });
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
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error('轮询超时');
}

(async () => {
  for (const job of JOBS) {
    const dest = path.join(OUT, `${job.name}.png`);
    if (fs.existsSync(dest)) { console.log(`跳过 ${job.name}（已存在）`); continue; }
    console.log(`创建任务: ${job.name} (${job.ratio})`);
    const uuid = await createTask(job);
    console.log(`  task_uuid=${uuid}, 等待生成...`);
    const imgUrl = await pollTask(uuid);
    const buf = Buffer.from(await (await fetch(imgUrl)).arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`  已保存 ${dest} (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
