/**
 * seeany-percalejac-oatbeige-duvetonly-flat.js — 单独被套产品主图试做·方向 2（2026-10-23 用户定）
 * 目标：Sheets & Duvet Sets 系列下的单独被套（duvet cover only）产品主图，
 *       与套装主图（铺好的整床场景）明确区分：裸床平铺一条被套，一角掀起翻折露出内衬与开口。
 * 构图（方向 2）：裸床平铺一条被套，床尾一角掀起翻折露出内衬与开口；床上无枕头无被芯
 *   （单独被套产品，严禁出现套装其他件）；卧室场景按种草图标准做丰富陈设与光影层次。
 * 参考图（布料锚）：PERCALEJAC-OATBEIGE-QUEEN/1-3x4.webp —— 仅取燕麦米白条纹提花布料的配色与织纹
 * 输出：public/images/staging/percalejac-oatbeige-duvetonly-flat-34.png（确认后再进产品目录）
 * 用法: node scripts/seeany-percalejac-oatbeige-duvetonly-flat.js
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
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const REF_FABRIC = path.join(ROOT, 'public', 'images', 'products', 'PERCALEJAC-OATBEIGE-QUEEN', '1-3x4.webp'); // 布料配色来源

// 按 docs/lifestyle-image-rules.md 六段式种草图指令（2026-10-23 用户定）
const prompt =
  // 1. 产品锚定段
  '主角产品严格锚定所附参考图的布料：燕麦米色（oat beige）与奶白色（cream white）相间的竖向宽条纹' +
  '提花棉质面料（cotton percale jacquard），带细微编织肌理与柔和哑光质感，颜色与条纹比例与参考图 1:1 对应，' +
  '零改动；布面零织标零印花。参考图仅作布料来源，严禁沿用其中任何场景元素。' +
  // 2. 场景构建段（方向 2：裸床平铺被套 + 种草图丰富陈设）
  '场景：3:4 竖版，ins 奶油原木风卧室。一张双人床居中偏下、占画面中下部主要空间——床上只有床垫和素色床笠，' +
  '没有枕头、没有被芯、没有任何其他床品（这是单独被套产品）；一条被套平铺铺满床面，呈自然松弛的平展状态，' +
  '床尾处的一角向上掀起翻折，露出被套内衬与开口（绑带/纽扣区域）细节，为视觉焦点。' +
  '床周陈设丰富有叙事：床头一侧原木边几上放一盏褶皱灯罩陶瓷台灯与一杯带拉花的拿铁；另一侧粗陶花瓶插干花芦苇；' +
  '床尾凳上搭一条羊毛编织搭毯、放一本翻开的杂志；地面铺羊毛几何编织长毛地毯；墙面挂一幅原木框抽象挂画；' +
  '窗边大型琴叶榕绿植，叶片带自然脉络；前景可带少量虚化枝叶。材质真实：原木木纹、粗陶哑光、羊毛长毛、亚麻褶皱。' +
  '构图有前景/中景/远景层次与呼吸感留白。' +
  // 3. 光线氛围段
  '光线：温暖金色时刻自然日光透过白纱帘漫射入室，床面与地面形成柔和斑驳光影，柔和漫射渐变阴影，' +
  '窗边日光自带温润光晕，暖色温。' +
  // 4. 镜头画质段
  '镜头：专业室内家居摄影，8K 超高清，浅景深电影镜头效果（焦点锁定被套与翻折开口处，前景与背景自然虚化），' +
  '细微复古胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质。' +
  // 5. 品牌调性段（站内图）
  '整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 生活方式杂志感。' +
  // 6. 负向规避段
  '规避：零改动产品颜色质感；无塑料 CGI 质感、无光滑假表面、无平涂死黑阴影、无高饱和色彩、无卡通插画画风、' +
  '无失真反光、无扭曲透视；画面无任何文字、水印、logo、人物。';

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask(inputImgs) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs, imgNum: 1, imgRatio: '3:4',
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
  const dest = path.join(OUT, 'percalejac-oatbeige-duvetonly-flat-34.png');
  console.log('创建任务: Oat Beige 单独被套 裸床平铺图（方向 2，仅布料锚）');
  const uuid = await createTask([await dataUri(REF_FABRIC)]);
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 ${dest} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
