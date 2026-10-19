/**
 * seeany-throw-graybg-34.js — 毯子灰底平铺图 3:4（2026-10-19 用户定）
 * 构图按用户提供的参考照片：整条毯子平铺俯拍、折成竖向长方形、
 * 顶边一道折叠边、底边一排流苏、浅灰无缝影棚背景（约 #e5e5e5）。
 * 参考图 = 供应链图（针织纹理/颜色/流苏 1:1 锚定）。
 * 输出：public/images/staging/throw-graybg-<系列>-<颜色>-3x4.png
 * 用法: node scripts/seeany-throw-graybg-34.js <jobKey...>（不传 = 列出所有 job）
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

// ─── 任务表 ────────────────────────────────────────────────────────────────
// blanket2 = KNITTHROW 镂空针织毯（窄罗纹条+宽人字镂空条纹交替，两端流苏）
const KNIT_TEXTURE =
  '针织结构 = 窄实心罗纹针织条（约2-3cm宽）与宽之字形人字纹镂空网眼条（约6-8cm宽，透孔呈规则人字/鱼骨状排列）一窄一宽规律交替，竖向条纹走向';
// blanket1 = 波西米亚锯齿纹针织毯（彩色 zigzag 提花，两端流苏）
const BOHO_TEXTURE =
  '针织结构 = 满幅彩色锯齿形（zigzag/人字折线）提花图案，折线横向往复排列成竖向波纹列，针织肌理清晰可见';
// blanket3 = 北欧轻奢航空毯（提花针织，四周干净包边，无流苏）
const HB_TEXTURE =
  '针织结构 = 满幅细人字纹（herringbone）提花针织，细密鱼骨状折线纹理整齐排列，四周为干净利落的针织包边收尾，无流苏';
const PAISLEY_TEXTURE =
  '针织结构 = 满幅佩斯利腰果花（paisley）提花针织，复古卷草水滴纹样，四周为干净利落的针织包边收尾，无流苏';
// blanket4 = 豆豆粒粗针织毯（立体颗粒，两端长流苏）
const CHUNKY_TEXTURE =
  '针织结构 = 粗棒针豆豆粒（popcorn 颗粒）针织，满幅饱满立体的圆颗粒纹理，两端各一排垂顺的长流苏';
// 1688-969627065032 = 仿兔毛绒毯（宽竖条绒肋纹，无流苏，边缘干净包边）
const FUR_TEXTURE =
  '面料结构 = 仿兔毛长毛绒，表面为规则排列的宽竖条立体绒肋纹（约2-3cm宽的饱满粗绒条，条间有细沟槽），绒毛细密蓬松柔软、带自然柔和光泽，四周边缘干净利落，无流苏';
const JOBS = {
  'knit-cream': { dir: 'C:\\Users\\12021\\Desktop\\blanket\\2', src: 'O1CN01wEKd341t5M2YDFFoT_!!2201660865850-0-cib.jpg', color: '米白色（cream off-white）', texture: KNIT_TEXTURE, tassels: true },
  'knit-grey':  { dir: 'C:\\Users\\12021\\Desktop\\blanket\\2', src: 'O1CN011VOdP51t5M2XiU0BC_!!2201660865850-0-cib.jpg', color: '浅灰色（light heather grey）', texture: KNIT_TEXTURE, tassels: true },
  'knit-khaki': { dir: 'C:\\Users\\12021\\Desktop\\blanket\\2', src: 'O1CN01Sgmxa31t5M2YDFzbm_!!2201660865850-0-cib.jpg', color: '卡其色（warm khaki camel）', texture: KNIT_TEXTURE, tassels: true },
  'knit-pink':  { dir: 'C:\\Users\\12021\\Desktop\\blanket\\2', src: 'O1CN011qkuR81t5M2Z3Prz5_!!2201660865850-0-cib.jpg', color: '灰粉色（soft dusty pink）', texture: KNIT_TEXTURE, tassels: true },
  'boho-sunset': { dir: 'C:\\Users\\12021\\Desktop\\blanket\\1', src: 'O1CN01AAUzIQ1t5LvknMgaK_!!2201660865850-0-cib.jpg', color: '暖调多色（芥末黄/橘/棕/靛蓝相间）', texture: BOHO_TEXTURE, tassels: true },
  'boho-olive':  { dir: 'C:\\Users\\12021\\Desktop\\blanket\\1', src: 'O1CN01BRH8uv1t5M34df6XV_!!2201660865850-0-cib.jpg', color: '灰绿调多色（灰绿/橄榄/浅棕相间）', texture: BOHO_TEXTURE, tassels: true },
  'boho-teal':   { dir: 'C:\\Users\\12021\\Desktop\\blanket\\1', src: 'O1CN01Munyhk1t5Lvl8Gea2_!!2201660865850-0-cib.jpg', color: '蓝绿调多色（湖蓝/青绿/米白/浅棕相间）', texture: BOHO_TEXTURE, tassels: true },
  'boho-burgundy': { dir: 'C:\\Users\\12021\\Desktop\\blanket\\1', src: 'O1CN01sy1RvN1t5M3BJW98o_!!2201660865850-0-cib.jpg', color: '红棕调多色（酒红/棕/墨绿/土金相间）', texture: BOHO_TEXTURE, tassels: true },
  'hb-black':      { dir: 'C:\\Users\\12021\\Desktop\\blanket\\3', src: 'O1CN01AyL7xz1t5M2kfsbja_!!2201660865850-0-cib.jpg', color: '黑白色（black + off-white）', texture: HB_TEXTURE, tassels: false },
  'paisley-beige': { dir: 'C:\\Users\\12021\\Desktop\\blanket\\3', src: 'O1CN01GxWnOb1t5M4M7FLR8_!!2201660865850-0-cib.jpg', color: '米驼色（beige/camel）', texture: PAISLEY_TEXTURE, tassels: false },
  'hb-khaki':      { dir: 'C:\\Users\\12021\\Desktop\\blanket\\3', src: 'O1CN01IH7sij1t5M2Xecxo3_!!2201660865850-0-cib.jpg', color: '卡其色（khaki/camel）', texture: HB_TEXTURE, tassels: false },
  'paisley-blue':  { dir: 'C:\\Users\\12021\\Desktop\\blanket\\3', src: 'O1CN01agufnS1t5M4MhMtJU_!!2201660865850-0-cib.jpg', color: '雾霾蓝色（dusty blue）', texture: PAISLEY_TEXTURE, tassels: false },
  'chunky-orange': { dir: 'C:\\Users\\12021\\Desktop\\blanket\\4', src: 'O1CN01HUdvId1t5M2Wq5a8K_!!2201660865850-0-cib.jpg', color: '焦糖橘色（burnt orange）', texture: CHUNKY_TEXTURE, tassels: true },
  'chunky-oat':    { dir: 'C:\\Users\\12021\\Desktop\\blanket\\4', src: 'O1CN01LmPMcX1t5M2YD0p4j_!!2201660865850-0-cib.jpg', color: '燕麦米色（oatmeal beige）', texture: CHUNKY_TEXTURE, tassels: true },
  'chunky-cream':  { dir: 'C:\\Users\\12021\\Desktop\\blanket\\4', src: 'O1CN01Q0RULi1t5M2Wq6aVo_!!2201660865850-0-cib.jpg', color: '奶白色（cream white）', texture: CHUNKY_TEXTURE, tassels: true },
  'chunky-grey':   { dir: 'C:\\Users\\12021\\Desktop\\blanket\\4', src: 'O1CN01VQAgLR1t5M2VJgFbR_!!2201660865850-0-cib.jpg', color: '浅灰色（light grey）', texture: CHUNKY_TEXTURE, tassels: true },
  // 1688-969627065032 = 仿兔毛绒毯（宽竖条绒肋纹长毛绒，无流苏）；参考图用现有产品主图
  'fur-blue':        { dir: path.join(__dirname, '..', 'public', 'images', 'products'), src: '1688-969627065032-C22/1.webp', color: '灰蓝色（dusty blue）', texture: FUR_TEXTURE, tassels: false },
  'fur-creamyellow': { dir: path.join(__dirname, '..', 'public', 'images', 'products'), src: '1688-969627065032-C27/1.webp', color: '奶黄色（cream yellow）', texture: FUR_TEXTURE, tassels: false },
  'fur-darkgray':    { dir: path.join(__dirname, '..', 'public', 'images', 'products'), src: '1688-969627065032-C33/1.webp', color: '深灰色（dark charcoal gray）', texture: FUR_TEXTURE, tassels: false },
  'fur-silvergray':  { dir: path.join(__dirname, '..', 'public', 'images', 'products'), src: '1688-969627065032-C36/1.webp', color: '银灰色（silver light gray）', texture: FUR_TEXTURE, tassels: false,
    scaleNote: '占比强调：毯子在画面中要足够大——宽度约为画面的62%-66%、高度约占画面的78%，与系列其他颜色产品图的占比完全一致，四周留白均匀但不空旷' },
  'fur-purple':      { dir: path.join(__dirname, '..', 'public', 'images', 'products'), src: '1688-969627065032-C41/1.webp', color: '灰紫色（muted purple）', texture: FUR_TEXTURE, tassels: false,
    // 2026-10-19 用户定：紫色条纹太细密，用黄色定稿图做结构参考（条纹宽度/占比对齐黄色）
    structRef: path.join(__dirname, '..', 'public', 'images', 'staging', 'throw-graybg-fur-creamyellow-3x4.png') },
};

const COMPOSE_FLAT = (job) =>
  '构图：整条毯子完全展开、单层平铺俯拍（flat lay，正俯视微带一点点透视），竖向长方形置于画面中央——宽度约为画面的55%-60%，毯面平整自然，仅有轻微柔和的自然起伏，无刻意褶皱；' +
  (job.tassels ? '毯子上下两端各露出一排整齐垂顺的手工流苏；' : '毯子四周边缘干净利落，无流苏；') +
  '整条毯子完整入镜、不要任何折叠、翻边或卷起的痕迹';
const COMPOSE_FOLDED = (job) =>
  '构图：毯子折叠成竖向长方形后平铺俯拍（flat lay，正俯视微带一点点透视），置于画面中央——宽度约为画面的55%-60%；折叠后整体平整压实、厚度均匀，像被平压过一样服帖；顶端是一道平整贴合的水平折叠边，折叠处完全压平、与毯面齐平，绝不鼓起、不蓬松、无拱起包块、无翻盖翘边；' +
  (job.tassels ? '底边露出一排整齐垂顺的手工流苏；' : '底边为干净利落的针织包边，无流苏；') +
  '毯面平整自然，仅有轻微自然起伏';
const promptOf = (job, style) => [
  job.structRef
    ? `结构锚定：严格1:1复刻参考图1的构图、毯子在画面中的大小占比、折叠方式、绒条宽度与密度——宽竖条绒肋纹的条纹宽度、条间沟槽宽度与参考图1完全一致，绝不更细更密；毯面纹理（绒肋内的人字压花细节）也与参考图1一致`
    : `布料锚定：严格1:1复刻参考图毯子的${job.texture}、颜色（${job.color}）、纱线质感与流苏/包边样式，颜色与参考图1:1对应，零改动`,
  job.structRef
    ? `颜色锚定：毯子颜色替换为参考图2的颜色（${job.color}），仿兔毛长毛绒的绒毛细密蓬松质感与自然柔和光泽与参考图2一致，零改动`
    : null,
  (style === 'flat' ? COMPOSE_FLAT(job) : COMPOSE_FOLDED(job)) + (job.scaleNote ? '；' + job.scaleNote : ''),
  '背景光线：浅灰色无缝影棚背景（light gray seamless studio background，色值约 #e5e5e5），背景均匀干净，柔和均匀的棚拍柔光，毯子边缘与流苏下方有细腻自然的接触阴影',
  '镜头画质：专业电商产品摄影，8K超高清，超写实真实物理材质，针织纹理与镂空孔眼清晰，白平衡准确，无畸变',
  '负向规避：规避塑料CGI质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、任何文字水印logo，不要床、不要沙发、不要人、不要任何场景道具，画面中只有毯子和灰色背景',
].filter(Boolean).join('。');

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
      inputImgs, imgNum: 1, imgRatio: '3:4',
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
  const args = process.argv.slice(2);
  const style = args.includes('--flat') ? 'flat' : 'folded'; // folded=主图（折叠平整版），flat=PDP 第二张（展开平铺版）
  const filters = args.filter((a) => !a.startsWith('--'));
  const entries = Object.entries(JOBS).filter(([k]) => !filters.length || filters.includes(k));
  if (!entries.length) {
    console.log('可用 job：' + Object.keys(JOBS).join(', '));
    process.exit(0);
  }
  // 并行提交全部任务，再统一轮询（SeeAny 并行生成耗时≈单张）
  const pending = [];
  for (const [key, job] of entries) {
    const srcPath = path.join(job.dir, job.src);
    if (!fs.existsSync(srcPath)) { console.error(`跳过 ${key}：找不到 ${srcPath}`); continue; }
    const inputImgs = job.structRef
      ? [await localRefDataUri(job.structRef), await localRefDataUri(srcPath)]
      : [await localRefDataUri(srcPath)];
    const uuid = await createTask(promptOf(job, style), inputImgs);
    console.log(`创建任务: ${key} [${style}] task_uuid=${uuid}`);
    pending.push({ key, uuid });
  }
  for (const { key, uuid } of pending) {
    const imgUrl = await pollTask(uuid);
    const res = await fetch(imgUrl);
    if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const suffix = style === 'flat' ? '-flat' : '';
    const dest = path.join(STAGING, `throw-graybg-${key}${suffix}-3x4.png`);
    fs.writeFileSync(dest, buf);
    console.log(`  已保存 ${dest} (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
