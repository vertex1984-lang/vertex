/**
 * seeany-euro-jacquard-zhongcao-34.js — 欧式提花床品 3:4 种草图（2026-10-21 用户定）
 * 用途：根据用户提供的参考图（staging/ref-euro-jacquard-bed.png）生成种草图级竖版场景图
 * 画面：床品 1:1 还原参考图（奶白底金色卷草提花四件套 + 棕色绒球花边 + 橄榄绿丝绒抱枕，
 *   图案/配色/材质/褶皱细节不变）；床体占画面主要空间；背景换成欧式厚重风格
 *   （深色实木雕花床头板、护墙板+石膏线墙面、厚重落地窗帘、黄铜壁灯），
 *   小红书爆款种草图氛围（暖黄复古灯光 + 柔和窗光、电影感光影、精致生活气息）
 * 输出：public/images/staging/euro-jacquard-zhongcao-34.png
 * 用法: node scripts/seeany-euro-jacquard-zhongcao-34.js
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
const SRC = path.join(ROOT, 'public', 'images', 'staging', 'ref-euro-jacquard-bed.png');
const OUT_PNG = path.join(ROOT, 'public', 'images', 'staging', 'euro-jacquard-zhongcao-34.png');

const PROMPT = [
  '以这张参考图为绝对基准：床上的床品套件 1:1 完全还原——奶白底色配金色卷草藤蔓提花（欧式大马士革纹样）的被套和枕套，所有枕套和被套边缘的棕色绒球花边，以及那只橄榄绿丝绒质感的长抱枕；床品的图案、配色、织物材质、光泽、绒球细节、自然褶皱全部保持不变',
  '构图：3:4 竖版构图，床为宽幅大床（king size 双人床），床体横向充分舒展、占据画面绝大部分空间（约 4/5 画面），床头一排四只以上枕头并排铺开以体现床面宽阔；镜头略低角度微俯拍，从床尾侧前方取景，画面饱满有张力；床体必须是规则的长方形并严格符合透视原理——床头与床尾实际同宽，仅因近大远小自然渐变，不得出现床头明显窄于床尾的收窄变形或梯形失真',
  '背景为浅色欧式（轻古典）风格：床头板为奶白色/浅奶茶色做旧实木雕花床头板，墙面为米白/暖奶油色护墙板配精致石膏线浮雕线脚，一侧垂落米色或浅驼色柔软落地窗帘，床头点缀黄铜复古壁灯或台灯；整体呈米白、奶油、浅驼、淡金的浅色系欧式色调，典雅精致但明亮温柔、不沉闷，与床品的欧式提花风格统一，也与暖米色家居网站的整体风格协调',
  '种草图氛围：小红书爆款家居摄影级别——柔和明亮的自然窗光为主、暖黄复古灯光为辅，画面明亮通透又有温度，光影层次细腻，精致有生活气息；被面上可自然搭放一本时尚杂志和一只陶瓷咖啡杯作为点缀道具（杂志上不得出现可辨识的品牌文字）',
  '画质：超写实真实物理材质摄影，织物纹理与提花光泽细腻真实，白平衡偏暖但明亮，2K 超高清',
  '负向规避：规避任何可辨识的文字、品牌logo、水印、人物、宠物、深色或暗色背景底色（不要深棕/墨绿/黑色墙面和床头板）、昏暗压抑的光线、高饱和荧光色、卡通插画画风、塑料CGI质感',
].join('。');

async function localRefDataUri() {
  const sharp = require('sharp');
  const buf = await sharp(SRC).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 88 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask(prompt) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs: [await localRefDataUri()], imgNum: 1, imgRatio: '3:4',
      mode: 'gpt-image-2.5', size: '2K',
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
  if (!fs.existsSync(SRC)) { console.error(`找不到参考图: ${SRC}——请先把用户给的床品参考图保存到该路径`); process.exit(1); }
  const uuid = await createTask(PROMPT);
  console.log(`创建任务: euro-jacquard-zhongcao-34 task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUT_PNG, buf);
  console.log(`已保存 ${OUT_PNG} (${buf.length} bytes)`);
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
