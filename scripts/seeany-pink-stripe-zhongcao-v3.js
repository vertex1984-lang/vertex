/**
 * seeany-pink-stripe-zhongcao-v3.js — 粉白细条纹种草图 v3：纹理还原为参考图的短划提花（2026-10-22 用户定）
 * 纹理认知修正（用户定）：真实纹路不是实色连续线条（v2 画错了），而是每根粉条纹由细密规则排列的
 *   短划/断点组成（色织提花断线组织、手织感节奏）；同时也禁止 v1 那种杂乱断线/重叠/深痕
 * 方案：参考图1=v2 锁角度/构图/场景 1:1；参考图2=ref-pink-stripe-texture.jpg 纹理特写锁真实纹路
 * 用法: node scripts/seeany-pink-stripe-zhongcao-v3.js
 * 输出: public/images/staging/pink-stripe-zhongcao-34-v3.png
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
const OUT = path.join(STAGING, 'pink-stripe-zhongcao-34-v3.png');

const PROMPT = [
  // 1. 产品锚定段（参考图2 锁真实纹理：短划断点式提花条纹）
  '以参考图2（纹理特写）为床品纹路的绝对基准 1:1 复刻：A面粉白细条纹色织提花——奶白底色上排列灰粉裸粉（dusty pink 低饱和）的细竖条纹，关键特征是每一根粉色条纹都不是实色连续线条，而是由细密、规则、均匀排列的短划/断点小线段组成（色织提花的断线组织、类似手织布的虚线感），短划的大小、粗细、间距、方向高度一致，整体呈现干净整齐的编织节奏；条纹随床品褶皱自然弯曲起伏，但短划组织始终规律不混乱；布面带细腻提花肌理、雾面哑光；B面纯色灰粉裸粉；两只枕套同为该细条纹。布面干净，无深色斑点污迹',
  // 2. 场景锁定段（参考图1 锁角度构图场景）
  '构图与场景完全沿用参考图1、零增减零移位：3:4 竖版、床占画面约 3/4、床左侧中部偏床尾的三分之四侧面机位（床头在左、床体向右下延伸），浅橡木原木条板床头板、床头板上方两幅细框原木挂画、床头左侧弧形原木落地灯、被面上翻开的杂志与粗陶马克杯、床尾右侧原木藤编长凳配奶白粗棒针羊毛毯、画面右侧挂亚麻白纱帘的窗户与大型琴叶榕、奶咖色羊毛几何编织地毯与浅原木色地板；床体下方结构与参考图1一致（床笠包裹床垫不外露、被套垂坠克制离地、无任何多余垂落布料）；光线与参考图1一致：右侧窗户金色时刻自然日光透过纱帘漫射，柔和斑驳光影，暖色温',
  // 3. 纹理重建段（本次核心）
  '本次唯一任务是按参考图2重建被套与枕套的条纹纹理：短划断点式提花条纹——既不是实色连续线条，也不是杂乱断线；短划规则均匀、组织清晰，近看是细腻的小线段编织感，远看是干净的细条纹；整床被套的纹理密度、条纹间距、粉色浓淡全画面一致，严禁出现实色线条、断线杂乱、短线错位、重叠重影、摩尔纹、深浅色块、深色污迹',
  // 4. 镜头画质段
  '专业室内家居摄影，2K 超高清，标准 50mm 镜头视角（避免广角畸变，床体横平竖直不变形），浅景深电影镜头效果（焦点锁定床品条纹肌理，前景与背景自然虚化），细微复古胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质',
  // 5. 品牌调性段（站内图分支）
  '整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 风，床品灰粉在暖光下保持低饱和裸粉不偏艳不变亮，温暖、松弛、治愈的生活方式杂志感',
  // 6. 负向规避段
  '零改动构图与场景；严禁实色连续条纹线条；严禁杂乱断线/短线错位/重叠重影/摩尔纹/深色斑点污迹；严禁床体下方多余垂落布料；粉色保持低饱和灰粉裸粉禁止艳粉亮粉桃红；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、广角畸变、扭曲透视、任何文字水印 logo、人物及人体任何部位（包括手）、宠物、玩偶公仔',
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
      inputImgs: [await localRefDataUri('pink-stripe-zhongcao-34-v2.png'), await localRefDataUri('ref-pink-stripe-texture.jpg')],
      imgNum: 1, imgRatio: '3:4',
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
  console.log(`创建任务: pink-stripe-v3 task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUT, buf);
  console.log(`已保存 ${OUT} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
