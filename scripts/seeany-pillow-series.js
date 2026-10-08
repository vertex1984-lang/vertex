/**
 * seeany-pillow-series.js — 绗缝抱枕芯系列 + 压花磨毛床枕系列 新图组（2026-10-08 用户定，同 B0CQC6H9MZ 组标准）
 * 每系列：平铺主图(按尺寸) / 场景种草图 / 侧面厚度图 / 填充物细节图；规则同 seeany-pillow-insert.js + seeany-mood-feed.js
 * 用法: node scripts/seeany-pillow-series.js [jobName]
 * 输出: public/images/staging/{quilted,bedpillow}/*.webp（1:1，2K → 1200×1200）
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

const STUDIO = '浅灰色纯色摄影棚背景（light gray seamless studio background，枕头纯白所以不用白底），柔和均匀的棚拍光线，底部自然柔和的浅阴影，写实摄影，画面干净高级，无文字无水印无logo';
const NO_LABEL = '**不要任何织标/标签/logo/印花**（布套表面完全纯净）';
const INS = '生活方式杂志感构图，画面有呼吸感和留白，松弛自然的居家氛围（lived-in、不刻意摆拍），浅景深';
const WARM = '暖色调家居摄影风格，米色和暖棕色调，柔和自然光，高级电商品牌质感，写实摄影，无文字无水印无logo';

const REF_Q = 'https://www.makimoohome.com/images/products/B0GXWM4N7J/1.webp';
const BASE_Q = `以参考图中的白色菱形绗缝抱枕芯为准：纯白色布套、整齐的菱形格绗缝走线（diamond quilted stitching）、四角饱满，保持完全一致的面料质感与工艺。${NO_LABEL}。${STUDIO}`;
const REF_B = 'https://www.makimoohome.com/images/products/B0GD87ZBN9/1.webp';
const BASE_B = `以参考图中的白色压花磨毛床枕为准：纯白色磨毛布套带细密的编织压花暗纹（embossed basket-weave texture）、饱满蓬松，保持完全一致的面料质感与工艺。${NO_LABEL}。${STUDIO}`;

const JOBS = [
  // ── 绗缝系列（b0-inserts-quilted）──
  { series: 'quilted', name: 'main-square', ref: REF_Q, prompt: `${BASE_Q}。构图：两个白色菱形绗缝方形抱枕芯（40×40cm 正方形），一个平放、另一个斜靠叠放在其上，居中构图，整体占画面约 80%，四周留白均匀，展示 Set of 2。` },
  { series: 'quilted', name: 'main-rect', ref: REF_Q, prompt: `${BASE_Q}。构图：两个白色菱形绗缝长方形床枕（40×80cm，约 1:2 修长比例，横长竖短），一个平放、另一个斜靠叠放在其上，横向居中构图，整体占画面约 80%，四周留白均匀，展示 Pack of 2。` },
  // 30×50 绗缝腰枕主图（B0G6M3F7CY，从磨毛布长方组改归绗缝长方组，2026-10-08 用户定）
  { series: 'quilted', name: 'main-3050', ref: REF_Q, prompt: `${BASE_Q}。构图：两个白色菱形绗缝长方形腰枕抱枕芯（30×50cm，约 2:3 比例，横长竖短），一个平放、另一个斜靠叠放在其上，横向居中构图，整体占画面约 80%，四周留白均匀，展示 Pack of 2。` },
  { series: 'quilted', name: 'side', ref: REF_Q, prompt: `${BASE_Q}。构图：单个菱形绗缝抱枕芯平放（水平躺放），从正侧面视角展示厚度，厚度适中（自然蓬松但不过鼓，约 8-10cm 视觉效果），上表面略拱、菱形绗缝在边缘自然过渡，轮廓自然。枕头占画面约 85%，左右两侧贴近画面边缘但完整不裁切，上下留白窄。` },
  { series: 'quilted', name: 'filling', ref: REF_Q, prompt: `${BASE_Q}。构图：菱形绗缝抱枕芯一角拉开拉链，蓬松的白色 microfiber 超细纤维填充物自然涌出，旁边散落一小团填充纤维作特写，纤维细腻蓬松有光泽，展示真材实料。` },
  { series: 'quilted', name: 'scene', ref: REF_Q, prompt: `以参考图中的白色菱形绗缝抱枕芯为准：纯白色布套、整齐菱形格绗缝走线、饱满蓬松，面料质感一致，${NO_LABEL}。场景：温暖的客厅午后，米色亚麻沙发上放着一个绗缝方形抱枕芯和一个绗缝长方形抱枕（自然随意地靠着，不刻意摆拍），旁边搭着一条奶油色针织毯，原木茶几上有一杯热茶，阳光透过白纱帘洒在沙发上。${INS}。${WARM}。` },
  // ── 压花磨毛床枕系列（b0-bed-pillows）──
  { series: 'bedpillow', name: 'main-5070', ref: REF_B, prompt: `${BASE_B}。构图：两个白色压花磨毛床枕（50×70cm，约 5:7 比例，横长竖短），一个平放、另一个斜靠叠放在其上，横向居中构图，整体占画面约 80%，四周留白均匀，展示 2 Pack。` },
  { series: 'bedpillow', name: 'main-4080', ref: REF_B, prompt: `${BASE_B}。构图：两个白色压花磨毛床枕（40×80cm，约 1:2 修长比例，横长竖短），一个平放、另一个斜靠叠放在其上，横向居中构图，整体占画面约 80%，四周留白均匀，展示 2 Pack。` },
  { series: 'bedpillow', name: 'main-4070', ref: REF_B, prompt: `${BASE_B}。构图：两个白色压花磨毛床枕（40×70cm，约 4:7 比例，横长竖短），一个平放、另一个斜靠叠放在其上，横向居中构图，整体占画面约 80%，四周留白均匀，展示 2 Pack。` },
  { series: 'bedpillow', name: 'side', ref: REF_B, prompt: `${BASE_B}。构图：单个压花磨毛床枕平放（水平躺放），从正侧面视角展示厚度，床枕比抱枕更厚更饱满（约 15-18cm 视觉效果，适合睡眠支撑），上表面略拱、轮廓自然。枕头占画面约 85%，左右两侧贴近画面边缘但完整不裁切，上下留白窄。` },
  { series: 'bedpillow', name: 'filling', ref: REF_B, prompt: `${BASE_B}。构图：压花磨毛床枕一角拉开拉链，蓬松的白色 microfiber 超细纤维填充物自然涌出，旁边散落一小团填充纤维作特写，纤维细腻蓬松有光泽，展示真材实料。` },
  { series: 'bedpillow', name: 'scene', ref: REF_B, prompt: `以参考图中的白色压花磨毛床枕为准：纯白色磨毛布套带细密编织压花暗纹、饱满蓬松，面料质感一致，${NO_LABEL}。场景：安静的卧室清晨，两个白色压花床枕蓬松地靠在原木床头板上，米色亚麻床品自然铺开，床头柜上一杯水和一本翻开的书，晨光透过白纱帘。${INS}。${WARM}。` },
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
    if (only && job.name !== only && job.series !== only) continue;
    const dir = path.join(STAGING, job.series);
    fs.mkdirSync(dir, { recursive: true });
    const dest = path.join(dir, `${job.name}.webp`);
    console.log(`创建任务: ${job.series}/${job.name}`);
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
