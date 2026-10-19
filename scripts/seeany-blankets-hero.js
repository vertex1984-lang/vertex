/**
 * seeany-blankets-hero.js — blankets 类目页 hero 背景图（2026-10-19 用户批准生成）
 * 用途：V2BlanketsCatHero（/products?cat=blankets 页头），双端同一张（同 cushions 单图做法）
 * 画面：暖调客厅场景，米色沙发上自然搭着一条奶白色针织毯（质感锚定 KNITTHROW-CREAM 主图），
 *   柔和晨光，暖米/奶茶色系（网站主色调），无文字无人；上半部为干净浅色墙面（左上要叠深色标题）
 * 参考图：public/images/products/KNITTHROW-CREAM/1.webp（毯子针织纹理/颜色/流苏 1:1 锚定）
 * 输出：public/images/staging/blankets-hero-sofa-16x9.png → 转 webp 至
 *   public/images/pdp-lifestyle/blankets-hero-sofa.webp（宽 2048，组件内 object-cover 裁剪）
 * KEY 读取/createTask/pollTask 写法照抄 seeany-throw-graybg-34.js
 * 用法: node scripts/seeany-blankets-hero.js
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
const REF = path.join(ROOT, 'public', 'images', 'products', 'KNITTHROW-CREAM', '1.webp');
const OUT_PNG = path.join(ROOT, 'public', 'images', 'staging', 'blankets-hero-sofa-16x9.png');
const OUT_WEBP = path.join(ROOT, 'public', 'images', 'pdp-lifestyle', 'blankets-hero-sofa.webp');

const PROMPT = [
  '毯子锚定：沙发上搭着的毯子严格1:1复刻参考图的针织结构（窄实心罗纹针织条与宽之字形人字纹镂空网眼条一窄一宽规律交替）、奶白颜色（cream off-white）、纱线质感与两端手工流苏样式，零改动',
  '场景构图：暖调现代客厅全景，一张米色/奶茶色亚麻布艺沙发位于画面下半部偏右，奶白色针织毯自然随意地搭在沙发扶手与靠背上、一角自然垂落座面；画面上半部分为大面积干净简洁的浅色暖白墙面（左上角区域尤其干净、无任何装饰物，便于后期叠加深色标题文字）；沙发旁仅点缀极少量同色系软装（一个素色抱枕、边几上一株小绿植），整体留白克制',
  '光线氛围：柔和温暖的晨光从画面左侧窗户自然洒入，光线明媚不刺眼，墙面有淡淡的自然光影，氛围宁静治愈',
  '色调画质：暖米色/奶茶色系（warm beige / cream / oatmeal palette），专业家居杂志级摄影，超写实真实物理材质，针织纹理与镂空孔眼清晰，白平衡准确，2K 超高清',
  '负向规避：规避任何文字水印logo、人物、宠物、杂乱道具、高饱和色彩、卡通插画画风、塑料CGI质感、冷色调',
].join('。');

async function localRefDataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask(prompt, inputImgs) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs, imgNum: 1, imgRatio: '16:9',
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
  if (!fs.existsSync(REF)) { console.error(`缺参考图: ${REF}`); process.exit(1); }
  const uuid = await createTask(PROMPT, [await localRefDataUri(REF)]);
  console.log(`创建任务: blankets-hero task_uuid=${uuid}`);
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
