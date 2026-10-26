/**
 * seeany-pillows-hero-black.js — pillows 类目页 hero 背景图（2026-10-21 用户定）
 * 用途：V2PillowsCatHero（/products?cat=pillows 页头），双端同一张（同 blankets/cushions 单图做法）
 * 画面（2026-10-21 三轮，用户定：种草图风格 + 本站暖色系）：
 *   以二轮灰调床景图（staging/pillow-hero-gray-4x3.png）为参考图——床和床上摆设
 *  （白色枕芯一对、白色方格绗缝被芯）的颜色、材质、褶皱细节 1:1 不变；
 *   仅把灰色系房间换成本站暖色系（暖米白 #F7F4EF 墙面、暖灰褐 #8A7E72 点缀），
 *   整体转为小红书式种草图氛围（柔和暖阳、温馨治愈的生活方式摄影）；
 *   左上保留干净暖米白墙面负空间（hero 叠白色标题文字 + 黑渐变罩保底可读性）
 *   （一轮黑底版 pillow-hero-black.webp、二轮灰调版 pillow-hero-gray.webp 均保留磁盘备用）
 * 适配：4:3 横板——移动端 hero 容器即 4:3，整图完整显示不裁切；桌面端 object-cover 裁上下
 * 输出：public/images/staging/pillow-hero-warm-4x3.png → 转 webp 至
 *   public/images/pdp-lifestyle/pillow-hero-warm.webp（宽 2048）
 * KEY 读取/createTask/pollTask 写法照抄 seeany-blankets-hero.js
 * 用法: node scripts/seeany-pillows-hero-black.js
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
const SRC = path.join(ROOT, 'public', 'images', 'staging', 'pillow-hero-gray-4x3.png');
const OUT_PNG = path.join(ROOT, 'public', 'images', 'staging', 'pillow-hero-warm-4x3.png');
const OUT_WEBP = path.join(ROOT, 'public', 'images', 'pdp-lifestyle', 'pillow-hero-warm.webp');

const PROMPT = [
  '以这张参考图为绝对基准：画面中的床和床上摆设全部 1:1 保持不变——一对蓬松的白色枕芯（无枕套，纯白棉质枕皮）和一条白色方格绗缝被芯（无被套，一角轻柔翻折）的位置、角度、纯白色调、棉质织物材质、蓬松度、所有褶皱与绗缝细节都不许改动',
  '只改变房间氛围与色调：把原来的灰色系房间换成本站暖色系——墙面改为暖米白/奶油白（warm off-white，#F7F4EF），床头板等家具改为暖灰褐/浅驼木色（warm taupe，#8A7E72 方向），整体呈温暖中性的奶油米色调',
  '种草图风格：小红书式家居生活方式摄影，柔和温暖的晨光从侧面洒入，画面带轻微暖调光晕与柔和高光，氛围温馨、治愈、有生活气息，像家居博主的自然实拍分享，而非冷调广告片',
  '构图不变：横板床景构图，床位于画面中下部偏右，白色床品为画面绝对主体；左上角保留大面积干净的暖米白墙面负空间（无装饰物，便于后期叠加标题文字）',
  '画质：高端家居品牌摄影级画质，超写实真实物理材质，白平衡偏暖但白色床品仍保持纯白干净不发黄，2K 超高清',
  '负向规避：规避任何文字水印logo、人物、宠物、彩色床品、被套和枕套（床上均为无外套的白色内芯）、杂乱道具、黑色或深色背景、高饱和色彩、卡通插画画风、塑料CGI质感',
].join('。');

async function localRefDataUri() {
  const sharp = require('sharp');
  const buf = await sharp(SRC).resize(1536, 1152, { fit: 'inside' }).jpeg({ quality: 88 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask(prompt) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs: [await localRefDataUri()], imgNum: 1, imgRatio: '4:3',
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
  if (!fs.existsSync(SRC)) { console.error(`找不到参考图: ${SRC}`); process.exit(1); }
  const uuid = await createTask(PROMPT);
  console.log(`创建任务: pillow-hero-warm task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUT_PNG, buf);
  console.log(`已保存 ${OUT_PNG} (${buf.length} bytes)`);
  // 转 webp 到组件引用位置（宽 2048，q80；同 pdp-lifestyle 其他图规范）
  const sharp = require('sharp');
  const tmp = OUT_WEBP + '.tmp';
  await sharp(OUT_PNG).resize({ width: 2048, withoutEnlargement: true }).webp({ quality: 80 }).toFile(tmp);
  fs.renameSync(tmp, OUT_WEBP);
  const meta = await sharp(OUT_WEBP).metadata();
  console.log(`已保存 ${OUT_WEBP} (${meta.width}x${meta.height})`);
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
