/**
 * seeany-fabric-details.js — 用 SeeAny 生成 /fabric-guide/ 章节的面料细节特写图（2026-09）
 * 用法: node scripts/seeany-fabric-details.js <key>     例: node scripts/seeany-fabric-details.js linen
 * 颜色/材质与 fabric-banner.webp 六捆面料一一对应；预览输出到 scripts/seeany-edit-preview/
 */
const fs = require('fs');
const path = require('path');
const KEY = (() => {
  const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
  return (env.match(/^SEEANY_API_KEY=(.+)$/m) || [])[1]?.trim();
})();
if (!KEY) { console.error('缺少 SEEANY_API_KEY'); process.exit(1); }

const API = 'https://api.seeany.com/api/ai/smarttask';
const OUT = path.join(__dirname, 'seeany-edit-preview');
fs.mkdirSync(OUT, { recursive: true });

// 与横幅图六捆面料（左→右）同色系：燕麦亚麻 / 鼠尾草绿水洗棉 / 白色仿亚麻 / 暖棕有机棉 / 奶油丝滑莫代尔 / 腮红粉贡缎
const FABRICS = {
  'linen': '燕麦色纯亚麻面料特写',
  'washed-cotton-like': '鼠尾草绿色水洗棉面料特写',
  'linen-like': '白色轻盈仿亚麻面料特写',
  'organic-cotton': '暖棕赤陶色有机棉面料特写',
  'silk-modal': '奶油色丝滑莫代尔面料特写',
  'sateen': '腮红粉色贡缎面料特写',
};

const key = process.argv[2];
if (!FABRICS[key]) {
  console.error('未知面料 key，可选: ' + Object.keys(FABRICS).join(', '));
  process.exit(1);
}

const PROMPT =
  `电商面料细节图：${FABRICS[key]}，微距视角展示织纹、褶皱与触感细节，面料自然堆叠出柔和起伏，占满画面主体，不展示房间场景，` +
  '柔和自然侧光凸显肌理，浅景深背景虚化，暖色调高级家居品牌摄影，写实摄影，无文字无水印无logo';

async function createTask() {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({ aiTypeId: 113, aiType: 'smartImg', prompt: PROMPT, imgNum: 1, imgRatio: '4:3', mode: 'gpt-image-2.5-sunburst', size: '2K' }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(JSON.stringify(data));
  return data.data.task_uuid;
}

async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 90; i++) {
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api' } });
    const data = await res.json();
    if (data.code !== 0) throw new Error(`查询失败: ${JSON.stringify(data)}`);
    const { status, progress, assets } = data.data;
    if (i % 6 === 0) console.log(`  ${status} ${progress ?? 0}%`);
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
  const dest = path.join(OUT, `fabric-${key}.png`);
  if (fs.existsSync(dest)) { console.log('已存在，跳过: ' + dest); return; }
  console.log(`创建任务 (${key}, 4:3)...`);
  const uuid = await createTask();
  console.log(`task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  console.log('结果: ' + imgUrl);
  const buf = Buffer.from(await (await fetch(imgUrl)).arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`已保存 ${dest} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
