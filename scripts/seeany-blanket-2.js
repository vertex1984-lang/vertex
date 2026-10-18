/**
 * seeany-blanket-2.js — blanket/2 针织镂空盖毯场景图生成（2026-10-19 用户定）
 * 产品（1688 源）：北欧镂空针织毯，腈纶，纯色，127x180cm（含流苏），四色：米白/浅灰/卡其/粉色
 * 纹理结构（供应链图实测）：竖向条纹 = 窄实心罗纹针织条（约2-3cm）+ 宽之字形人字纹镂空网眼条（约6-8cm）交替，两端流苏
 * 定稿口径（2026-10-19 用户确认米白版）：
 *   场景 = 暖奶油调卧室 + 暖灰褐（muted taupe）床品强对比 + 床尾松弛搭放 + 近景构图；
 *   纹理像素级保持（图片编辑任务，不重绘毯子本体）
 * 批量三色：图1=各色供应链图（颜色+纹理基准），图2=已定稿米白场景图（构图/场景/床品颜色基准），
 *   仅换毯子颜色，每色褶皱细节有差异（vary，用户定：不要全一样）
 * 输出：staging/blanket2-<color>-scene-1x1.png
 * 用法: node scripts/seeany-blanket-2.js [cream|grey|khaki|pink]（不传 = 全部；已存在自动跳过）
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
const SRC_DIR = 'C:\\Users\\12021\\Desktop\\blanket\\2';

const TEXTURE_DESC =
  '竖向条纹 = 窄实心罗纹针织条（约2-3cm宽）与宽之字形人字纹镂空网眼条（约6-8cm宽，透孔呈规则人字/鱼骨状排列）一窄一宽规律交替，两端各一排整齐流苏';

const COLORS = {
  cream: {
    cn: '米白', en: 'cream off-white',
    src: 'O1CN01wEKd341t5M2YDFFoT_!!2201660865850-0-cib.jpg',
    vary: '', // 定稿版，单独由单图流程生成
  },
  grey: {
    cn: '浅灰', en: 'light heather grey',
    src: 'O1CN011VOdP51t5M2XiU0BC_!!2201660865850-0-cib.jpg',
    vary: '褶皱变化：毯子整体往床尾右侧多滑下一截，右侧流苏垂得更低，左侧毯面相对平缓舒展。',
  },
  khaki: {
    cn: '卡其', en: 'warm khaki camel',
    src: 'O1CN01Sgmxa31t5M2YDFzbm_!!2201660865850-0-cib.jpg',
    vary: '褶皱变化：毯子前缘向上微微翻折一小段，褶皱集中在翻折处，流苏沿床侧均匀垂落。',
  },
  pink: {
    cn: '粉色', en: 'soft dusty pink',
    src: 'O1CN011qkuR81t5M2Z3Prz5_!!2201660865850-0-cib.jpg',
    vary: '褶皱变化：毯子整体更蓬松，床面中央隆起更高、褶皱呈放射状散开，毯子一角微微卷起。',
  },
};

// 批量三色：场景基准（用户指定的白床品版本）+ 颜色/纹理基准（各色供应链图）
const PROMPT_BATCH = (c) =>
  '这是一次图片编辑任务，不是重新创作。图2 是已确认的场景构图绝对基准：床的位置与朝向、镜头机位、' +
  '白色纯棉床品、原木床头、地毯、窗帘、暖奶油色调、柔和暖调自然光，全部 1:1 零改动。' +
  `唯一改动：把图2中的米白毯子替换为图1毯子的颜色——${c.cn}（${c.en}）。` +
  `毯子的编织纹理结构必须像素级保持图1原样，不允许重绘：${TEXTURE_DESC}。` +
  `毯子颜色必须准确呈现为${c.cn}，不偏色；床品与场景保持图2原样，不许改动。` +
  '画面中最终只允许存在一条毯子（即换色后的这条），原米白毯子的任何残留部分都必须完全移除，' +
  '不许出现两条毯子叠放或原毯从边缘露出的情况。' +
  (c.vary || '') +
  '写实摄影质感，画面无文字、无水印、无logo、无人。';

// 米白单图流程（无场景基准时的原始定稿 prompt）
const PROMPT_SINGLE =
  '这是一次图片编辑任务，不是重新创作：把参考图中的毯子原样"搬"进新场景，毯子本体不允许重绘。' +
  `最高优先级——毯子的编织纹理必须像素级保持不变：毯面是${TEXTURE_DESC}。` +
  '任何一处纹理、条纹宽度比例、镂空孔洞形状都不许改动、不许简化、不许重画成其他花样。' +
  '毯子颜色保持米白（暖调象牙白）零改动。' +
  '唯一允许改的是场景：毯子自然松弛地搭在床尾，像被人随手一放，褶皱松散有深有浅、一侧流苏斜垂，' +
  '近景构图，毯子占画面主体约七成。毯子下方的床品必须是中明度暖灰褐色（muted taupe，明显深于毯子两个色阶以上）' +
  '纯色哑光纯棉，与米白毯子形成清晰强烈的深浅对比；床品绝不能用白色、米白、浅灰等任何接近毯子的浅色。' +
  '场景为暖奶油色调的现代卧室，原木床头，柔和暖调自然光从侧面洒入，温暖放松，高端家居品牌摄影。' +
  '写实摄影质感，画面无文字、无水印、无logo、无人。';

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
  const filters = process.argv.slice(2);
  const entries = Object.entries(COLORS).filter(([k]) => !filters.length || filters.includes(k));
  if (!entries.length) { console.error('无匹配颜色'); process.exit(1); }

  const sceneBase = path.join(STAGING, 'blanket2-cream-scene-white-1x1.png');
  // 批量并行提交（2026-10-18 用户定：先全部 create 再统一轮询，N 张 ≈ 单张耗时）
  const pending = [];
  for (const [key, c] of entries) {
    const dest = path.join(STAGING, `blanket2-${key}-scene-white-1x1.png`);
    if (fs.existsSync(dest)) { console.log(`跳过已存在: ${dest}`); continue; }
    const src = path.join(SRC_DIR, c.src);
    if (!fs.existsSync(src)) { console.error(`缺源图: ${src}`); continue; }
    let prompt, refs;
    if (key === 'cream') {
      prompt = PROMPT_SINGLE;
      refs = [await localRefDataUri(src)];
    } else {
      if (!fs.existsSync(sceneBase)) { console.error(`缺场景基准图（先生成米白定稿）: ${sceneBase}`); continue; }
      prompt = PROMPT_BATCH(c);
      refs = [await localRefDataUri(src), await localRefDataUri(sceneBase)];
    }
    const uuid = await createTask(prompt, refs);
    console.log(`已提交: blanket2 ${key}（${c.cn}）task_uuid=${uuid}`);
    pending.push({ key, uuid, dest });
  }
  console.log(`${pending.length} 张已全部提交，统一轮询...`);
  await Promise.all(pending.map(async ({ key, uuid, dest }) => {
    const imgUrl = await pollTask(uuid);
    const res = await fetchRetry(imgUrl, undefined, `结果图下载 ${key}`);
    if (!res.ok) throw new Error(`结果图下载失败 ${key}: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`  已保存 ${dest} (${buf.length} bytes)`);
  }));
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
