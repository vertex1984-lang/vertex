/**
 * seeany-edit-tray.js — 用 SeeAny API（nano-banana-pro 参考图编辑）修正托盘场景图比例
 * 背景：1688-899672152256-C42 托盘实际 28×28cm，但场景图里占了茶几 60-70% 宽度，比例失真。
 * 本脚本以原图（素材库源 URL）为参考图，让模型把托盘缩小到真实比例，输出到
 * scripts/seeany-edit-preview/ 供用户确认，确认后再替换 public/images/products/ 里的图。
 * 用法: node scripts/seeany-edit-tray.js
 */
const fs = require('fs');
const path = require('path');
const KEY = (() => {
  try {
    const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
    return (env.match(/^SEEANY_API_KEY=(.+)$/m) || [])[1]?.trim();
  } catch {
    return undefined;
  }
})();
if (!KEY) { console.error('缺少 SEEANY_API_KEY：请在 .env.local 中加 SEEANY_API_KEY=xxx'); process.exit(1); }

const API = 'https://api.seeany.com/api/ai/smarttask';
const OUT = path.join(__dirname, 'seeany-edit-preview', '1688-899672152256-C42');
fs.mkdirSync(OUT, { recursive: true });

// 素材库源图（顺序与 public/images/products/1688-899672152256-C42/ 的编号一致）
const SRC = [
  'https://amzphoto-1251810512.cos.ap-guangzhou.myqcloud.com/cxai/1789354872763-644488921.jpg', // 1 无文字场景图（大理石茶几）
  'https://amzphoto-1251810512.cos.ap-guangzhou.myqcloud.com/cxai/1789354873542-639442297.jpg', // 2 场景图（木茶几 + Timeless Artisan Craft 小木牌）
];

const PROMPT_BASE =
  '保持这张图片的场景、构图、角度、光线、色调和所有其他物品完全不变，只把画面中的圆形藤编托盘按真实比例缩小：' +
  '托盘实际尺寸为 28×28cm，圆形直径 28cm，茶几实际宽度约 60-80cm，因此托盘直径应约为茶几宽度的三分之一左右，' +
  '在画面中相应缩小，茶几上留出更多空白桌面。托盘内的物品（杯垫/蜡烛/植物/茶杯/点心等）随托盘一起等比缩小并保持相对位置不变。' +
  '写实摄影质感，透视自然，阴影与桌面接触真实。';

const JOBS = [
  { name: '1-edit', src: SRC[0], prompt: PROMPT_BASE + ' 特别强调：缩小幅度要明显，托盘直径不超过茶几宽度的三分之一，不超过画面宽度的40%，托盘周围要能看到大片空的大理石桌面。不要添加任何文字、水印或logo。' },
  { name: '2-edit', src: SRC[1], prompt: PROMPT_BASE + ' 画面右下角的小木牌（Timeless Artisan Craft）保持原样不变，除此之外不要添加任何新文字、水印或logo。' },
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
      inputImgs: [job.src],
      imgNum: 1,
      imgRatio: '1:1',
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
    const dest = path.join(OUT, `${job.name}.png`);
    if (fs.existsSync(dest)) { console.log(`跳过已存在: ${job.name}`); continue; }
    console.log(`创建任务: ${job.name}`);
    const uuid = await createTask(job);
    console.log(`  task_uuid=${uuid}, 等待生成...`);
    const imgUrl = await pollTask(uuid);
    console.log(`  结果: ${imgUrl}`);
    const res = await fetch(imgUrl);
    if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status} ${res.statusText} (${imgUrl})`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`  已保存 ${dest} (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
