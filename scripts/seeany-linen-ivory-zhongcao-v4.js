/**
 * seeany-linen-ivory-zhongcao-v4.js — LINEN3-IVORY-QUEEN 种草图 v4：修床体右下角空缺（2026-10-22 用户定）
 * 问题：v3 床垫底部右下方床体空缺（被套垂坠后面是空的，只剩一截漂浮的床腿），巨大瑕疵
 * 方案（用户定）：以 v3 为参考图 img2img，床的角度、床上四件套的布料材质和颜色 1:1 锁定不变，
 *   场景布局/物品/光线全部锁定，仅重建右下角床体结构（床垫+床架完整，被套自然垂坠覆盖）
 * 用法: node scripts/seeany-linen-ivory-zhongcao-v4.js
 * 输出: public/images/staging/linen-ivory-zhongcao-34-v4.png
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
const OUT = path.join(STAGING, 'linen-ivory-zhongcao-34-v4.png');

const PROMPT = [
  // 1. 产品锚定段（床品 1:1 锁定）
  '以参考图为绝对基准：床的角度机位与床上四件套 1:1 完全复刻、零改动——象牙白水洗纯亚麻被套床笠与枕套（ivory white washed 100% linen，竹节纹理、雾面哑光、水洗松弛褶皱）、被子的褶皱形态与堆叠位置、两只枕头的形态与微歪角度、被面上翻开的杂志位置、床尾奶咖色华夫格针织毯的搭法与流苏、床尾原木藤编凳的位置，全部与参考图逐一对应锁定，布面零织标零印花',
  // 2. 场景锁定段（布局/物品/光线 1:1）
  '场景布局与参考图完全一致、零增减零移位：3:4 竖版、床占画面约 3/4、机位床尾偏左三分之四视角，藤编原木床头板、床头板上方细框原木抽象挂画、床头左侧原木边几配粗陶台灯与咖啡杯、画面左上角大型琴叶榕、左侧挂亚麻白纱帘的窗户一角、床沿下黄麻编织地毯与浅原木色地板；光线与参考图一致：清晨柔和自然日光透过纱帘漫射，柔和斑驳光影，暖色温',
  // 3. 瑕疵修复段（本次核心：右下角床体补全）
  '唯一需要修正的是床体右下方结构：参考图中床垫底部右下方的床体是空缺的——被套垂坠边缘后面没有床垫和床架支撑，只剩一截不合理的漂浮床腿。请按真实物理结构重建该区域：右下角床体完整存在——床垫填充饱满、一直延伸到床尾右下角，浅原木色床架在床尾与右侧连续完整、四角床腿位置合理落地，被套与床笠从床垫边缘自然垂坠、覆盖床架侧面，垂坠布料后面必须是实体的床垫与床架、绝不允许出现空洞、穿帮、悬浮的床腿或缺失的床角，床体整体方正稳固、透视与参考图机位一致',
  // 4. 镜头画质段
  '专业室内家居摄影，2K 超高清，标准 50mm 镜头视角（避免广角畸变），浅景深电影镜头效果（焦点锁定床品，前景与背景自然虚化），细微复古胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质',
  // 5. 品牌调性段（站内图分支）
  '整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 风，松弛、治愈、安静的生活方式杂志感',
  // 6. 负向规避段
  '除右下角床体结构修复外零改动参考图任何元素；规避床体空洞、床角缺失、悬浮床腿、床架断裂穿帮、塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、广角畸变、扭曲透视、任何文字水印 logo、人物及人体任何部位（包括手）、宠物、玩偶公仔',
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
      inputImgs: [await localRefDataUri('linen-ivory-zhongcao-34-v3.png')], imgNum: 1, imgRatio: '3:4',
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
  console.log(`创建任务: linen-ivory-v4 task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUT, buf);
  console.log(`已保存 ${OUT} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
