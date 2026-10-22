/**
 * seeany-pink-stripe-zhongcao.js — 粉白细条纹色织提花四件套 3:4 种草图（2026-10-22 用户定）
 * 规则：docs/lifestyle-image-rules.md 六段式；mode = gpt-image-2.5-sunburst；站内图分支色调（米色 #F8F5F0 + 暖棕 #8B5A2B）
 * 要求（用户定）：完全还原参考图材质与颜色（img2img 1:1 锁定）；占图比与 PERCALEJAC-HAZE v3 类似（床占约 3/4）；
 *   但拍摄角度不同——本图采用床侧机位：床左侧中部偏床尾三分之四侧拍，床头在左、床尾向右延伸
 * 用法: node scripts/seeany-pink-stripe-zhongcao.js
 * 输出: public/images/staging/pink-stripe-zhongcao-34.png
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
const OUT = path.join(STAGING, 'pink-stripe-zhongcao-34.png');

const PROMPT = [
  // 1. 产品锚定段（img2img：材质颜色 1:1 锁定参考图）
  '以参考图为绝对基准，床品材质与颜色 1:1 完全复刻、零漂移：床上四件套 A面为粉白细条纹色织提花（fine yarn-dyed jacquard thin stripes，灰粉裸粉 dusty pink 低饱和细竖条 + 奶白底色细密相间排列，布面带细腻提花肌理与轻微泡泡纱式自然绉感、雾面哑光），B面与被里为纯色灰粉裸粉（与参考图被子翻折处露出的纯色内里一致），两只枕套同为粉白细条纹提花，床品自然松弛铺设、带生活化褶皱、被面上端随意翻折露出纯色B面内里，布面零织标零印花',
  // 2. 场景构建段（床侧机位：床头在左、床尾向右，区别于既有各版正面/床尾机位）
  '3:4 竖版卧室构图，床占画面约 3/4：机位在床的左侧中部偏床尾，三分之四侧面视角——床头朝向画面左侧、床体向右下方延伸，床体透视为标准 50mm 镜头下的自然透视、床头床尾宽度比例真实协调；浅橡木原木条板床头板贴左侧暖米色墙面，床头板上方挂两幅错落的细框原木小挂画；床头左侧墙角立着一盏弧形原木落地灯（亚麻灯罩）；被面中央偏右随意放一本翻开的家居杂志和一只粗陶马克杯；床尾右侧前景有一只原木藤编长凳，凳面搭一条奶白色粗棒针羊毛毯（粗大针织纹理自然垂坠）；画面右侧是一扇挂亚麻白纱帘的窗户，窗前一株大型琴叶榕绿植（叶片带自然脉络绒面）；地面铺奶咖色羊毛几何编织长毛地毯，浅原木色地板；前中远景层次自然，有呼吸感留白',
  // 3. 光线氛围段
  '温暖金色时刻自然日光，从右侧窗户透过亚麻白纱帘漫射入室，在床品细条纹提花与墙面形成柔和斑驳的纱帘光影，提花肌理在侧光下呈现细腻明暗，柔和漫射渐变阴影，窗边日光温润光晕，自然光线衰减，暖色温',
  // 4. 镜头画质段
  '专业室内家居摄影，2K 超高清，标准 50mm 镜头视角（避免广角畸变，床体横平竖直不变形），浅景深电影镜头效果（焦点锁定床品细条纹提花肌理，前景床尾凳与背景窗边绿植自然虚化），细微复古胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质',
  // 5. 品牌调性段（站内图分支）
  '整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 风，床品灰粉在暖光环境下仍保持低饱和裸粉不偏艳不变亮，温暖、松弛、治愈的生活方式杂志感',
  // 6. 负向规避段
  '零改动产品颜色质感（粉色保持低饱和灰粉裸粉，禁止变成艳粉/亮粉/桃红；细条纹密度与提花肌理与参考图一致）；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、广角畸变、扭曲透视、床头床尾透视比例失真、任何文字水印 logo、人物及人体任何部位（包括手）、宠物、玩偶公仔、熨烫挺括的床品状态',
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
      inputImgs: [await localRefDataUri('ref-pink-stripe.jpg')], imgNum: 1, imgRatio: '3:4',
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
  console.log(`创建任务: pink-stripe task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUT, buf);
  console.log(`已保存 ${OUT} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
