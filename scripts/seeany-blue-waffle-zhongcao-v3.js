/**
 * seeany-blue-waffle-zhongcao-v3.js — 蓝白华夫提花种草图 v3：换拍摄角度（2026-10-22 用户定）
 * 背景：v1 床头过窄透视失真；v2 img2img 修复用户仍不满意 → v3 放弃原构图，换机位重拍
 * 机位（用户定"换一个拍摄角度"）：床尾正前方近正面三分之四微俯视角，床头板完整朝向镜头——
 *   正面机位床头床尾宽度差天然小，从构图上杜绝"床头过窄"问题
 * 锁定：ref-blue-waffle-scene.jpg（配色/AB双面）+ ref-blue-waffle-texture.jpg（A面提花肌理），颜色纹理 1:1
 * 用法: node scripts/seeany-blue-waffle-zhongcao-v3.js
 * 输出: public/images/staging/blue-waffle-zhongcao-34-v3.png
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
const OUT = path.join(STAGING, 'blue-waffle-zhongcao-34-v3.png');

const PROMPT = [
  // 1. 产品锚定段（双参考锁颜色纹理）
  '两张参考图只锁定床品的颜色与纹理：参考图1锁定整体配色与AB双面结构、参考图2锁定A面提花肌理，颜色分别与参考图 1:1 对应、零漂移——床上四件套 A面为蓝白宽条纹色织提花（yarn-dyed jacquard wide stripes，雾霾蓝 dusty gray-blue 低饱和带灰调、绝对不是亮蓝宝蓝 + 奶白色宽竖条相间，条纹上细腻华夫格凹凸提花肌理 waffle texture、雾面哑光），B面与被里为纯色雾霾蓝，两只枕套同为蓝白条纹提花，床品自然松弛铺设、带生活化褶皱、被面上端随意翻折露出雾霾蓝B面内里，布面零织标零印花',
  // 2. 场景构建段（全新机位：床尾正前方近正面微俯，床头板完整朝镜头）
  '3:4 竖版卧室构图，床占画面约 3/4：机位在床尾正前方、略偏右一点点，平视带轻微俯角的近正面三分之四视角——床体长轴基本正对镜头，床头在画面上方、床尾在下方，床头床尾宽度差异自然微小、符合正常透视（床头宽度约为床尾的 85-90%）；奶油白布艺弧形软包床头板完整朝向镜头、宽度与床体严格匹配，两只枕头并排总宽与床头端床宽一致；床头板后方是暖米色墙面，墙上挂一幅细框原木抽象挂画；床头左右两侧各一只原木床头柜（对称布局），左侧柜上一盏奶白陶瓷褶皱罩台灯、右侧柜上一只粗陶小花瓶插两支干芦苇和两本叠放的布面书；被面中央放一本翻开的家居杂志和一只藤编托盘、托盘上一杯带拉花拿铁；床尾斜搭一条燕麦色华夫格针织毯（几何编织纹理、带流苏）；画面左侧是一扇挂亚麻白纱帘的高窗，窗前一株大型天堂鸟绿植（阔叶带自然脉络）；地面铺奶咖色短绒地毯，浅原木色地板；前中远景层次自然，有呼吸感留白',
  // 3. 光线氛围段
  '温暖金色时刻自然日光，从左侧高窗透过亚麻白纱帘漫射入室，在床品提花肌理与墙面形成柔和斑驳的纱帘光影，华夫格凹凸肌理在侧光下呈现细腻明暗，柔和漫射渐变阴影，窗边日光温润光晕，自然光线衰减，暖色温',
  // 4. 镜头画质段
  '专业室内家居摄影，2K 超高清，标准 50mm 镜头视角（避免广角畸变，床体横平竖直不变形），浅景深电影镜头效果（焦点锁定床品提花肌理，前景与背景自然虚化），细微复古胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质',
  // 5. 品牌调性段（站内图分支）
  '整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 风，床品雾霾蓝在暖光环境下仍保持灰调蓝不偏色不变亮，温暖、松弛、治愈的生活方式杂志感',
  // 6. 负向规避段
  '零改动产品颜色质感（蓝色保持灰调雾霾蓝，禁止变成亮蓝/宝蓝/青色）；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、广角畸变、扭曲透视、床头床尾透视比例失真（床头过窄或过宽都不行）、任何文字水印 logo、人物及人体任何部位（包括手）、宠物、玩偶公仔、熨烫挺括的床品状态',
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
      inputImgs: [await localRefDataUri('ref-blue-waffle-scene.jpg'), await localRefDataUri('ref-blue-waffle-texture.jpg')],
      imgNum: 1, imgRatio: '3:4',
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
  console.log(`创建任务: blue-waffle-v3 task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUT, buf);
  console.log(`已保存 ${OUT} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
