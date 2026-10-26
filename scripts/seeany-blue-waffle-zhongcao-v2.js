/**
 * seeany-blue-waffle-zhongcao-v2.js — 蓝白华夫提花种草图 v2：修床体透视（2026-10-22 用户定）
 * 问题：v1 床头视觉宽度过窄，与床尾宽度按透视原理不匹配
 * 方案：以 v1 为参考图 img2img，场景/细节/产品颜色 1:1 锁定，仅修正床体几何透视
 * 用法: node scripts/seeany-blue-waffle-zhongcao-v2.js
 * 输出: public/images/staging/blue-waffle-zhongcao-34-v2.png
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
const OUT = path.join(STAGING, 'blue-waffle-zhongcao-34-v2.png');

const PROMPT = [
  // 1. 产品锚定段（v1 产品 1:1 锁定）
  '以参考图为绝对基准：床品四件套 1:1 完全复刻——A面蓝白宽条纹色织提花（雾霾蓝 dusty gray-blue 低饱和带灰调 + 奶白宽竖条，华夫格凹凸提花肌理、雾面哑光）、B面纯色雾霾蓝、两只条纹枕套、被面翻折形态与褶皱、床尾燕麦色华夫格针织毯的搭法与流苏，全部与参考图逐一对应锁定，布面零织标零印花',
  // 2. 场景锁定段（布局/物品/光线 1:1）
  '场景布局与参考图完全一致、零增减零移位：3:4 竖版、床占画面约 3/4、机位床尾正中略偏左，奶油白布艺弧形软包床头板在右后、床头右侧圆形原木边几配奶白陶瓷褶皱罩台灯与粗陶干芦苇花瓶、墙面两幅细框原木挂画、左侧高窗挂亚麻白纱帘、窗前大型天堂鸟绿植、被面上翻开的杂志与藤编托盘杯饮、奶咖色短绒地毯与浅原木色地板；光线与参考图一致：左侧高窗金色时刻自然日光透过纱帘漫射，柔和斑驳光影，暖色温',
  // 3. 透视修正段（本次核心）
  '唯一需要修正的是床体几何透视：参考图中床头视觉宽度过窄、与床尾宽度不匹配——请按正常三点透视原理重建床体：床尾（近端）宽、床头（远端）按透视自然适度收窄但幅度克制，床头与床尾的视觉宽度比符合真实双人床在该机位下的透视关系（床头宽度约为床尾的 75-85%，不得夸张收窄）；床头板宽度与床体床头端严格对齐匹配，两只枕头并排后的总宽度与床头端床宽匹配、符合真人睡眠比例；床体两侧边线从床尾向床头平直自然收拢，床垫与床品垂坠边缘贴合床体，整体符合真实物理空间，无扭曲失真',
  // 4. 镜头画质段
  '专业室内家居摄影，2K 超高清，浅景深电影镜头效果（焦点锁定床品提花肌理，前景与背景自然虚化），细微复古胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质',
  // 5. 品牌调性段（站内图分支）
  '整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 风，床品雾霾蓝在暖光下保持灰调蓝不偏色不变亮，温暖、松弛、治愈的生活方式杂志感',
  // 6. 负向规避段
  '除床体透视修正外零改动参考图任何元素；蓝色保持灰调雾霾蓝禁止变亮蓝宝蓝；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视、床头床尾透视比例失真、任何文字水印 logo、人物及人体任何部位（包括手）、宠物、玩偶公仔',
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
      inputImgs: [await localRefDataUri('blue-waffle-zhongcao-34.png'), await localRefDataUri('ref-blue-waffle-texture.jpg')],
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
  console.log(`创建任务: blue-waffle-v2 task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUT, buf);
  console.log(`已保存 ${OUT} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
