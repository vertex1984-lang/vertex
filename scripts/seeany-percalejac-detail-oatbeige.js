/**
 * seeany-percalejac-detail-oatbeige.js — PERCALEJAC 提花四件套布料细节图：Oatmeal Beige（2026-10-23）
 * 双参考图：
 *   图1 = 产品主图（PERCALEJAC-OATBEIGE-QUEEN/1.webp）→ 布料颜色与格纹提花肌理 1:1 锚定
 *   图2 = 用户供淘宝详情图裁出的布料段 → 构图/微距/浅景深/明亮通透光线风格锚定
 * 用法: node scripts/seeany-percalejac-detail-oatbeige.js
 * 输出: public/images/staging/percalejac-oatbeige-detail-11.png
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
const ROOT = path.join(__dirname, '..');
const STAGING = path.join(ROOT, 'public', 'images', 'staging');
const OUT = path.join(STAGING, 'percalejac-oatbeige-detail-11-v2.png');

const PROMPT = [
  // 1. 颜色锚定段（图1 = 产品主图：燕麦米色 + 象牙白配色 1:1）
  '第一张参考图是这套床品的成品图：要拍摄的布料颜色与图中床品完全一致、1:1 原样还原——燕麦米色与象牙白交织的配色、哑光棉感均以第一张参考图为准，不要任何蓝灰色调，布面零织标零印花',
  // 2. 织纹锚定段（图2 = 用户供真实布料特写：格纹提花肌理 1:1，2026-10-23 用户定）
  '第二张参考图是这块布料的真实织纹特写：布料的织法肌理与第二张参考图完全一致、1:1 原样还原——色织提花的条带分区、每个条带内规整排列的蜂窝状小方格凸纹、纱线粗细与哑光棉质触感，全部以第二张参考图为准（第二张图仅是织纹范本，其蓝灰配色不要采用）',
  // 3. 构图风格段（图3 = 淘宝详情图布料段：微距构图与光线范本）
  '第三张参考图是构图与光线范本：1:1 方形电商布料细节图，微距特写视角，布料自然堆叠出柔和起伏的褶皱，近景布面纹理清晰锐利、远景布料浅景深自然虚化，画面全部被布料占满、不出现床、房间、道具或任何其他物体',
  // 3. 光线氛围段
  '明亮通透的柔和自然光，高调布光，布面受光均匀带轻盈空气感，暖色温',
  // 4. 镜头画质段
  '专业电商面料摄影，2K 超高清，微距镜头，织纹与纱线细节极致清晰，超写实真实材质',
  // 5. 负向规避段
  '布料颜色以第一张参考图为准、织纹肌理以第二张参考图为准；规避任何文字水印 logo 图标、人物及人体任何部位、玩偶公仔、塑料 CGI 质感、高饱和色彩、场景道具',
].join('。');

async function refDataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 88 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask() {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt: PROMPT,
      inputImgs: [
        await refDataUri(path.join(ROOT, 'public', 'images', 'products', 'PERCALEJAC-OATBEIGE-QUEEN', '1.webp')),
        await refDataUri(path.join(STAGING, 'ref-percalejac-texture-crop.jpg')),
        await refDataUri(path.join(STAGING, 'ref-percalejac-detail-fabric.jpg')),
      ],
      imgNum: 1, imgRatio: '1:1',
      mode: 'gpt-image-2.5-sunburst', size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(JSON.stringify(data));
  return data.data.task_uuid;
}

async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 90; i++) {
    try {
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
    } catch (e) {
      if (e.message.startsWith('任务失败') || e.message.startsWith('查询失败') || e.message.startsWith('无结果图')) throw e;
      console.log('  fetch 重试中...');
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error('轮询超时');
}

(async () => {
  const uuid = await createTask();
  console.log(`创建任务: percalejac-oatbeige-detail task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUT, buf);
  console.log(`已保存 ${OUT} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
