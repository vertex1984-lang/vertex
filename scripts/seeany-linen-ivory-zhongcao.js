/**
 * seeany-linen-ivory-zhongcao.js — LINEN3-IVORY-QUEEN（象牙白水洗纯亚麻四件套）3:4 种草图（2026-10-22 用户定）
 * 规则：docs/lifestyle-image-rules.md 六段式；mode = gpt-image-2.5-sunburst；站内图分支色调（米色 #F8F5F0 + 暖棕 #8B5A2B）
 * 本次重点（用户定）：突出松弛感 + 治愈感——床品自然不刻意整理、晨光柔和、画面安静呼吸感
 * 参考图：staging/ref-linen-ivory.webp（= 产品主图 1.webp），床品颜色/肌理 1:1 锁定
 * 用法: node scripts/seeany-linen-ivory-zhongcao.js
 * 输出: public/images/staging/linen-ivory-zhongcao-34.png
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
const REF = 'linen-ivory-zhongcao-34-v2.png';
const OUT = path.join(STAGING, 'linen-ivory-zhongcao-34-v3.png');

const PROMPT = [
  // 1. 产品锚定段（v3：以 v2 成品为基准，床上一切 1:1 锁定，只扩场景——2026-10-22 用户定）
  '以参考图为绝对基准：床上的床品四件套与床上所有物品 1:1 完全复刻、零改动——象牙白水洗纯亚麻被套床笠与枕套（ivory white washed 100% linen，竹节纹理、雾面哑光、水洗松弛褶皱）、被子的褶皱形态与堆叠位置、两只枕头的形态与微歪角度、被面上翻开的杂志位置、床尾奶咖色华夫格针织毯的搭法与流苏、床尾原木藤编凳的位置，全部与参考图逐一对应 1:1 锁定，布面零织标零印花',
  // 2. 场景扩充段（镜头拉远，床占约 3/4，对齐 percale-coconut 版构图）
  '在保持床体区域完全不变的前提下，镜头向后拉远、画布向四周扩展：3:4 竖版构图，床占画面约 3/4——上方露出完整的藤编原木床头板与一小段暖米色墙面，床头板上方挂一幅细框原木抽象挂画；床头左侧露出原木边几全貌，上面有一盏粗陶台灯配亚麻灯罩（天然洞石孔隙纹理）、一杯冒着热气的咖啡；画面左上角露出大型琴叶榕绿植（叶片带自然脉络）；左侧露出挂亚麻白纱帘的窗户一角；下方露出床沿下的黄麻编织地毯与浅原木色地板；场景材质、色调、风格与参考图完全一致，前中远景层次自然，有呼吸感留白',
  // 3. 光线氛围段
  '与参考图一致的清晨柔和自然日光，透过亚麻纱帘漫射入室，床品褶皱上细腻柔软的明暗过渡，墙面与地板上微微的纱帘投影，柔和漫射渐变阴影，窗边日光温润光晕，自然光线衰减，暖色温，安静治愈的氛围',
  // 4. 镜头画质段
  '专业室内家居摄影，2K 超高清，浅景深电影镜头效果（焦点锁定床品，前景与背景自然虚化），细微复古胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质',
  // 5. 品牌调性段（站内图分支）
  '整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 风，松弛、治愈、安静的生活方式杂志感',
  // 6. 负向规避段
  '零改动床品与床上物品的颜色、质感、褶皱、形态、位置；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视、任何文字水印 logo、人物及人体任何部位（包括手）、宠物、玩偶公仔、熨烫挺括的床品状态',
].join('。');

async function localRefDataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(path.join(STAGING, file)).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 88 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask() {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt: PROMPT,
      inputImgs: [await localRefDataUri(REF)], imgNum: 1, imgRatio: '3:4',
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
  const uuid = await createTask();
  console.log(`创建任务: linen-ivory task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUT, buf);
  console.log(`已保存 ${OUT} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
