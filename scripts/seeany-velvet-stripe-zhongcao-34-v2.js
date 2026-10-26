/**
 * seeany-velvet-stripe-zhongcao-34-v2.js — 绒四件套种草图 v2（2026-10-25 用户定：被套 B 面与 A 面同色同条纹）
 * 参考图: 阿里 cbu01 alicdn 绒四件套（米色底+棕色双细条纹，绒面）→ staging/ref-velvet-alicdn.jpg
 * 用户定制点：阳光不直射、柔和散光；整体暖色调柔和；3:4；床占约 70%；2K；凸显绒材质
 * 规则：docs/lifestyle-image-rules.md 六段式；产品锚定段沿用 pink-stripe-v6 口径
 *   （零图案技术化描述，1:1 还原交 img2img，仅点明绒面肌理以凸显材质）
 * 用法: node scripts/seeany-velvet-stripe-zhongcao-34.js
 * 输出: public/images/staging/velvet-stripe-zhongcao-34-v2.png
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
const OUT = path.join(STAGING, 'velvet-stripe-zhongcao-34-v2.png');

const PROMPT = [
  // 1. 产品锚定段（img2img 必写；零图案描述，1:1 还原交 img2img，仅点明绒面肌理凸显材质）
  '使用参考图中的床上四件套：这套床品的外观与参考图完全一致、1:1 原样还原，就像把参考图里同一套床品从原床上拿下来、原封不动铺到新场景的床上，床品的所有视觉特征全部以参考图为准，布面零织标零印花；被套与枕套的正反两面（A 面 B 面）完全相同：同样的颜色、同样的条纹图案、同样的绒面肌理，双面同花同色，任何翻折、卷起、垂坠处露出的反面都必须带与正面一致的条纹与颜色，绝不存在纯色无纹的反面；床品面料是短密绒面（牛奶绒/法兰绒质感），哑光柔雾、绒毛细腻丰盈，铺在床上呈现柔软厚实的垂坠与褶皱，绒面在柔光下呈现细腻的明暗渐变，材质感必须清晰可辨',
  // 2. 场景构建段（床占约 70%，物品 ≥8 样，前中远景层次）
  '3:4 竖版卧室，床占画面约 70%，机位在床右侧中部偏床尾的三分之四侧面视角（床头在右、床体向左下延伸）：奶油白软包床头板贴暖米色墙面，床头上方挂一幅细框原木抽象小挂画；床品自然松弛铺好、带生活化褶皱，被面上端随意翻折一小段，露出的反面与正面完全一样——同样的米色底棕色条纹与绒面（双面同纹同色）；被面中央放一本翻开的家居杂志和一只粗陶马克杯，杯口有细腻热气；床头左侧原木床头柜上放一盏磨砂玻璃罩小台灯（点亮暖光）和一只粗陶小花瓶插两支干芦苇；床尾左侧前景一只原木藤编长凳，凳面搭燕麦色粗棒针羊毛毯；画面左侧是挂亚麻白纱帘的高窗，窗前一株大型琴叶榕带自然叶脉；床笠紧紧包裹床垫不外露下垂、被套从床垫边缘自然垂坠一小段且明显离地，床垫以下是浅原木床架与床腿、结构干净，床底不出现任何额外垂落的布料；地面铺奶咖色短毛羊毛地毯，浅原木色地板',
  // 3. 光线氛围段（用户定：无直射阳光，柔和散光，暖色柔和）
  '阴天柔光质感：窗外自然光经白纱帘充分漫射后均匀洒入室内，没有任何直射阳光与锐利光斑，全屋柔和散光，阴影极淡极柔、边缘化开，绒面被柔光均匀照亮呈现细腻绒感，整体暖色温、色调柔和奶油感，安静治愈',
  // 4. 镜头画质段
  '专业室内家居摄影，2K 超高清，50mm 标准镜头，浅景深（焦点在床品绒面肌理，前景背景自然虚化），细微胶片颗粒，超写实真实材质',
  // 5. 品牌调性段（站内图分支）
  '整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 风，温暖松弛的生活方式杂志感',
  // 6. 负向规避段（标准简版 + 无直射光）
  '床品外观一切以参考图为准；床底无多余垂布床裙；无直射阳光、无强烈光斑与高对比硬阴影；规避塑料 CGI 质感、高饱和色彩、卡通画风、扭曲透视、任何文字水印 logo、人物及人体任何部位、宠物、玩偶公仔',
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
      inputImgs: [await localRefDataUri('ref-velvet-alicdn.jpg')], imgNum: 1, imgRatio: '3:4',
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
    try {
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
      if (status === 'failed') throw new Error(`任务失败: ${JSON.stringify(data.data).slice(0, 300)}`);
    } catch (e) {
      if (e.message.startsWith('任务失败') || e.message.startsWith('无结果图')) throw e;
    }
    await new Promise((r) => setTimeout(r, 10000));
  }
  throw new Error('轮询超时');
}

(async () => {
  console.log('创建任务…');
  const uuid = await createTask();
  console.log('task_uuid:', uuid);
  const imgUrl = await pollTask(uuid);
  console.log('下载:', imgUrl);
  const buf = Buffer.from(await (await fetch(imgUrl)).arrayBuffer());
  fs.writeFileSync(OUT, buf);
  console.log('完成:', path.relative(ROOT, OUT), `${(buf.length / 1024).toFixed(0)}KB`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
