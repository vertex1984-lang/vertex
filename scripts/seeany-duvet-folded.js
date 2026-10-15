/**
 * seeany-duvet-folded.js — LINEN3 被套（duvet-only）灰底叠放展示图（2026-10-15 用户定）
 * 双图锚定：参考图1 = 叠放造型参考（结构 1:1 复刻），参考图2 = 该颜色灰底主图（锁布料与颜色）。
 * 造型：紧实包裹式叠放（方正底座两端收口 + 蓬松圆顶 + 三角信封翻盖），灰底影棚。
 * 用法: node scripts/seeany-duvet-folded.js [颜色小写...]（不传则全跑）
 * 输出: public/images/staging/linen3-{color}-duvet-folded.webp（验收后替换 products/{ASIN}/1.webp）
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
const OUT = path.join(__dirname, '..', 'public', 'images', 'staging');
fs.mkdirSync(OUT, { recursive: true });

const STRUCTURE_REF = 'https://www.makimoohome.com/images/staging/fold-ref-duvet.webp';

const COLORS = [
  { slug: 'sage', asin: 'LINEN3-SAGE-DUVET', cn: '鼠尾草灰绿色 sage green', fabric: '100%水洗亚麻，粗粝麻质纹理、天然褶皱肌理、哑光质朴手感' },
  { slug: 'charcoal', asin: 'LINEN3-CHARCOAL-DUVET', cn: '炭灰色 charcoal grey', fabric: '100%水洗亚麻，粗粝麻质纹理、天然褶皱肌理、哑光质朴手感' },
  { slug: 'dustyblue', asin: 'LINEN3-DUSTYBLUE-DUVET', cn: '灰蓝色 dusty blue', fabric: '100%水洗亚麻，粗粝麻质纹理、天然褶皱肌理、哑光质朴手感' },
  { slug: 'ivory', asin: 'LINEN3-IVORY-DUVET', cn: '象牙白色 ivory white', fabric: '100%水洗亚麻，粗粝麻质纹理、天然褶皱肌理、哑光质朴手感' },
  { slug: 'oatmeal', asin: 'LINEN3-OATMEAL-DUVET', cn: '燕麦色 oatmeal beige', fabric: '100%水洗亚麻，粗粝麻质纹理、天然褶皱肌理、哑光质朴手感' },
  // DUVSET 磨毛棉被套系列（2026-10-15 用户定，同规则）
  { slug: 'duvset-beige', asin: 'DUVSET-BEIGE-DUVET', cn: '米色 warm beige', fabric: '磨毛棉（brushed cotton），哑光雾面、细腻绒感、带自然柔和褶皱' },
  { slug: 'duvset-gray', asin: 'DUVSET-GRAY-DUVET', cn: '浅灰蓝色 light gray', fabric: '磨毛棉（brushed cotton），哑光雾面、细腻绒感、带自然柔和褶皱' },
  { slug: 'duvset-pink', asin: 'DUVSET-PINK-DUVET', cn: '浅粉色 soft pink', fabric: '磨毛棉（brushed cotton），哑光雾面、细腻绒感、带自然柔和褶皱' },
  { slug: 'duvset-white', asin: 'DUVSET-WHITE-DUVET', cn: '纯白色 pure white', fabric: '磨毛棉（brushed cotton），哑光雾面、细腻绒感、带自然柔和褶皱' },
];

const promptOf = (job) => [
  '结构锚定：严格1:1复刻参考图1的叠放造型与构图——一个被套整体折叠堆叠成的紧实包裹：下半部分为横向折叠的方正底座（两端面料向内收拢如糖果包裹般打褶收口），上半部分为蓬松拱起的圆顶（被套自然蓬松度），顶部前侧一角自然翻折形成三角形信封式翻盖、露出内侧折边；整体位于浅灰色无缝影棚背景的画面中下部居中，上方留大面积负空间，柔和均匀影棚柔光，底部细腻渐变浅接触阴影；零改动参考图1的折叠结构、比例、相机角度',
  `布料锚定：将被套布料替换为参考图2的材质与颜色——${job.cn}，${job.fabric}，颜色与参考图2的1:1对应，布面零织标零印花`,
  '镜头画质：专业电商产品摄影，8K超高清，超写实真实物理材质，布料纹理与褶皱清晰，柔和渐变阴影，无畸变',
  '品牌调性：浅灰底影棚图，自然真实色彩还原，白平衡准确，干净利落',
  '负向规避：不改变参考图1的叠放结构，规避塑料CGI质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视、任何文字水印logo，不要床、不要枕头、不要任何场景道具',
].join('。');

async function createTask(job, ratio) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113,
      aiType: 'smartImg',
      prompt: promptOf(job),
      inputImgs: [STRUCTURE_REF, `https://www.makimoohome.com/images/products/${job.asin}/1.webp`],
      imgNum: 1,
      imgRatio: ratio,
      mode: 'gpt-image-2.5-sunburst',
      size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`${job.slug}: ${JSON.stringify(data)}`);
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
    await new Promise(r => setTimeout(r, 5000));
  }
  throw new Error('轮询超时');
}

(async () => {
  const only = process.argv.slice(2);
  const jobs = COLORS.filter((c) => !only.length || only.includes(c.slug));
  if (!jobs.length) { console.error('无匹配颜色'); process.exit(1); }
  // 站内主图为方形：优先 1:1，不支持依次回退 4:5、4:3
  const tries = [{ r: '1:1', w: 1200, h: 1200 }, { r: '4:5', w: 1200, h: 1500 }, { r: '4:3', w: 1600, h: 1200 }];
  let dims = null;
  for (const job of jobs) {
    console.log(`创建任务: ${job.slug}（${job.asin}）`);
    let uuid;
    for (const t of tries) {
      try {
        uuid = await createTask(job, t.r);
        dims = { width: t.w, height: t.h };
        console.log(`  比例 ${t.r}，task_uuid=${uuid}`);
        break;
      } catch (e) {
        const msg = String(e.message);
        if (/ratio|比例|尺寸/i.test(msg)) { console.log(`  ${t.r} 不支持，尝试下一档`); continue; }
        throw e;
      }
    }
    if (!uuid) throw new Error('所有比例均不支持');
    const imgUrl = await pollTask(uuid);
    let buf;
    for (let a = 0; a < 3; a++) {
      try {
        const res = await fetch(imgUrl);
        buf = Buffer.from(await res.arrayBuffer());
        break;
      } catch (e) {
        if (a === 2) throw e;
        console.log(`  下载失败，${(a + 1) * 5}s 后重试...`);
        await new Promise(r => setTimeout(r, (a + 1) * 5000));
      }
    }
    const dest = path.join(OUT, `${job.slug}-duvet-folded.webp`);
    let img = sharp(buf).resize({ ...dims, fit: 'cover', position: 'attention' });
    // 1:1 输出直接做"产品上移"裁剪（与 LINEN3 已定稿参数一致：裁 1060 中央偏上再放大回 1200）
    if (dims.width === 1200 && dims.height === 1200) {
      img = img.extract({ left: 140, top: 140, width: 1060, height: 1060 }).resize(1200, 1200);
    }
    await img.webp({ quality: 84 }).toFile(dest);
    console.log(`  已保存 ${dest}`);
  }
  console.log('全部完成');
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
