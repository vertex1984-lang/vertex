/**
 * seeany-sateen-4pcs.js — Cotton Sateen 四件套场景主图生成（2026-10-18 用户定）
 * 色卡：蓝骏 7626 贡缎棉，取 6 色：米白 / 1 浅米 / 3 芥末黄 / 4 灰褐 / 5 赭粉 / 6 橄榄绿
 * 构图基准：LINEN3-IVORY-QUEEN/1.webp（床的朝向、镜头位、卧室风格 1:1）
 * 面料要点：贡缎棉（cotton sateen）——布面细腻平滑、带柔和光泽（缎面丝光），
 *   褶皱处有光泽流动感，区别于亚麻的哑光粗粝
 * 输出：staging/sateen-<key>-1x1.png（逐色确认后再批量）
 * 用法: node scripts/seeany-sateen-4pcs.js [cream|beige|mustard|taupe|terracotta|olive]（不传 = 全部；已存在自动跳过）
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
const STAGING = path.join(__dirname, '..', 'public', 'images', 'staging');
const PRODUCTS = path.join(__dirname, '..', 'public', 'images', 'products');

// 色卡取色（蓝骏 7626 贡缎棉），hex 为目测近似值，提示词以文字描述为主
// vary：每色不同的褶皱/摆放变化（2026-10-18 用户定：细节要有差别，避免"全是一个模子"的不信任感）
const COLORS = {
  cream:      { cn: '米白', en: 'cream off-white', desc: '暖调米白（近 #F2EEE8），干净温柔', vary: '' },
  beige:      { cn: '1号浅米', en: 'light sandy beige', desc: '浅米沙色（近 #E5D9C8），低饱和', vary: '褶皱变化：被套的自然褶皱主要落在床尾偏左侧，右侧布面更平顺舒展；两只枕头一前一后略微错开。' },
  mustard:    { cn: '3号芥末黄', en: 'muted mustard gold', desc: '芥末金黄（近 #D9A441），温暖不刺眼', vary: '褶皱变化：被套右沿多一道自然的垂坠长褶垂到床侧，床中褶皱更松散；左边枕头微微斜立。' },
  taupe:      { cn: '4号灰褐', en: 'muted taupe brown', desc: '灰褐驼色（近 #A08D7B），沉稳中性', vary: '褶皱变化：被子前缘向上微微翻折一小段露出床单边，褶皱集中在被子翻折处；两只枕头贴得更近。' },
  terracotta: { cn: '5号赭粉', en: 'soft terracotta rust rose', desc: '赭粉陶土色（近 #C4745C），温柔复古', vary: '褶皱变化：被套整体更蓬松，床面中央的隆起更高、褶皱呈放射状散开；右边枕头略低于左边。' },
  olive:      { cn: '6号橄榄绿', en: 'muted olive sage green', desc: '橄榄灰绿（近 #9A9C6E），自然安静', vary: '褶皱变化：被子向床尾方向多滑下一些、床尾处堆出松弛的堆叠褶，床面中部相对平整；枕头角度更随意。' },
};

const PROMPT_OF = (c) =>
  '以这张参考图为构图的绝对基准：床的朝向与位置、镜头机位与视角、床头板、床尾凳、窗边绿植、台灯、装饰画、地毯、' +
  '整体暖奶油调卧室风格和柔和自然光全部 1:1 零改动。' +
  `唯一改动：床品四件套（被套 + 床单 + 两个枕套，同色成套）改为贡缎棉（cotton sateen）面料的${c.cn}（${c.en}，${c.desc}）。` +
  '面料质感是关键：贡缎棉布面细腻平滑、带柔和的缎面丝光——光线在被套隆起和褶皱处形成细腻的光泽流动与明暗过渡，' +
  '有真丝般的柔光但保持棉的厚实感，褶皱比亚麻更少更顺滑、垂坠感更强，绝对不能是哑光粗粝的亚麻质感。' +
  '被套自然铺在床上带松弛的褶皱，两个枕套套在枕头上靠在床头，床尾毯保持参考图的燕麦色针织毯不变。' +
  (c.vary || '') +
  '写实摄影质感，画面无文字、无水印、无logo、无人。';

const filters = process.argv.slice(2);
const entries = Object.entries(COLORS).filter(([k]) => !filters.length || filters.includes(k));
if (!entries.length) { console.error('无匹配颜色'); process.exit(1); }

async function localRefDataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function fetchRetry(url, opts, label = 'fetch') {
  for (let t = 0; t < 8; t++) {
    try { return await fetch(url, opts); }
    catch (e) { console.log(`  ${label} 网络重试 ${t + 1}/8`); await new Promise((r) => setTimeout(r, 8000)); }
  }
  throw new Error(`${label} 网络持续失败`);
}

async function createTask(prompt, inputImgs) {
  const res = await fetchRetry(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs, imgNum: 1, imgRatio: '1:1',
      mode: 'gpt-image-2.5-sunburst', size: '2K',
    }),
  }, '创建任务');
  const data = await res.json();
  if (data.code !== 0) throw new Error(JSON.stringify(data));
  return data.data.task_uuid;
}

async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 120; i++) {
    const res = await fetchRetry(url, { headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api' } }, '轮询');
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
  const ref = path.join(PRODUCTS, 'LINEN3-IVORY-QUEEN', '1.webp');
  if (!fs.existsSync(ref)) { console.error(`缺参考图: ${ref}`); process.exit(1); }
  const refs = [await localRefDataUri(ref)];
  // 2026-10-18 用户定：批量任务并行提交（先全部 create，再统一轮询），N 张 ≈ 单张耗时
  const pending = [];
  for (const [key, c] of entries) {
    const dest = path.join(STAGING, `sateen-${key}-1x1.png`);
    if (fs.existsSync(dest)) { console.log(`跳过已存在: ${dest}`); continue; }
    const uuid = await createTask(PROMPT_OF(c), refs);
    console.log(`已提交: sateen ${key}（${c.cn}）task_uuid=${uuid}`);
    pending.push({ key, uuid, dest });
  }
  console.log(`${pending.length} 张已全部提交，统一轮询...`);
  const results = await Promise.all(pending.map(async ({ key, uuid, dest }) => {
    const imgUrl = await pollTask(uuid);
    const res = await fetchRetry(imgUrl, undefined, `结果图下载 ${key}`);
    if (!res.ok) throw new Error(`结果图下载失败 ${key}: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`  已保存 ${dest} (${buf.length} bytes)`);
  }));
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
