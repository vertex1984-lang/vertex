/**
 * seeany-waffle-variants-zhongcao.js — 华夫格色织提花四件套 3 个同类型产品 3:4 主图（2026-10-22 用户定）
 * 规则：docs/lifestyle-image-rules.md 六段式；mode = gpt-image-2.5-sunburst；站内图分支色调（米色 #F8F5F0 + 暖棕 #8B5A2B）
 * 方案（用户定）：以 blue-waffle-zhongcao-34.png 为布局基准（场景/构图/家具摆件 1:1 保持），
 *   每个产品自己的参考图只锁定床品的颜色与花纹（只改颜色花纹，其他细节保持）；
 *   床品褶皱形态与床上小物件（杂志/托盘/杯子/毯子）位置允许轻微自然差异，避免三张图完全雷同
 * 用法: node scripts/seeany-waffle-variants-zhongcao.js
 * 输出: public/images/staging/waffle-zhongcao-{pink,gray,oat}-34.png
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
const LAYOUT_REF = 'blue-waffle-zhongcao-34.png';

const PRODUCTS = [
  {
    id: 'pink',
    ref: 'ref-waffle-pink.jpg',
    colorDesc: 'A面为灰粉+奶白宽条纹色织提花（dusty pink 低饱和灰粉裸粉、绝对不是艳粉亮粉，与奶白色宽竖条相间，条纹上细腻华夫格凹凸提花肌理、雾面哑光），B面与被里为纯色灰粉（与参考图2被子翻折处露出的纯色内里一致）',
    colorGuard: '粉色保持低饱和灰粉裸粉，禁止变成艳粉/亮粉/桃红',
  },
  {
    id: 'gray',
    ref: 'ref-waffle-gray.jpg',
    colorDesc: 'A面为浅灰+奶白宽条纹色织提花（light gray 低饱和浅灰，与奶白色宽竖条相间，条纹上细腻华夫格凹凸提花肌理、雾面哑光），B面与被里为纯色浅灰（与参考图2被子翻折处露出的纯色内里一致）',
    colorGuard: '灰色保持低饱和浅灰，禁止变成深灰/蓝灰/发亮',
  },
  {
    id: 'oat',
    ref: 'ref-waffle-oat.jpg',
    colorDesc: 'A面为燕麦奶咖+奶白宽条纹色织提花（oatmeal beige 低饱和燕麦浅驼，与奶白色宽竖条相间，条纹上细腻华夫格凹凸提花肌理、雾面哑光），B面与被里为纯色浅驼奶咖（与参考图2被子翻折处露出的纯色内里一致）',
    colorGuard: '燕麦色保持低饱和浅驼奶咖，禁止变成深棕/焦糖色',
  },
];

function buildPrompt(p) {
  return [
    // 1. 产品锚定段（参考图1=布局基准，参考图2=颜色花纹唯一来源）
    `两张参考图分工：参考图1锁定整图构图与场景布局 1:1 不变；参考图2只锁定床品的颜色与花纹——床上四件套 ${p.colorDesc}，两只枕套同为A面条纹提花，床品颜色与参考图2 1:1 对应、零漂移，布面零织标零印花`,
    // 2. 场景构建段（沿用布局基准，仅褶皱与小物件轻微变化）
    '完全沿用参考图1的场景与构图：3:4 竖版、床占画面约 3/4、机位床尾正中略偏左，奶油白布艺弧形软包床头板在右后、床头右侧圆形原木边几配奶白陶瓷褶皱罩台灯与粗陶干芦苇花瓶、墙面两幅细框原木挂画、左侧高窗挂亚麻白纱帘、窗前大型天堂鸟绿植、奶咖色短绒地毯与浅原木色地板，全部保持原位不动；仅允许三处轻微自然变化：床品褶皱形态与被面翻折位置略有不同、被面上翻开的杂志与藤编托盘杯饮的摆放位置稍作移动、床尾燕麦色华夫格针织毯的搭法略有变化——变化幅度克制，整体布局观感与参考图1一致',
    // 3. 光线氛围段
    '与参考图1一致的温暖金色时刻自然日光，从左侧高窗透过亚麻白纱帘漫射入室，床品提花肌理在侧光下呈现细腻明暗，墙面与地毯上柔和斑驳的纱帘光影，柔和漫射渐变阴影，窗边日光温润光晕，自然光线衰减，暖色温',
    // 4. 镜头画质段
    '专业室内家居摄影，2K 超高清，浅景深电影镜头效果（焦点锁定床品提花肌理，前景与背景自然虚化），细微复古胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质',
    // 5. 品牌调性段（站内图分支）
    `整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 风，床品在暖光环境下仍保持参考图2的颜色不偏色（${p.colorGuard}），温暖、松弛、治愈的生活方式杂志感`,
    // 6. 负向规避段
    `零改动场景布局与产品颜色质感（${p.colorGuard}）；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视、床头床尾透视比例失真、任何文字水印 logo、人物及人体任何部位（包括手）、宠物、玩偶公仔、熨烫挺括的床品状态`,
  ].join('。');
}

async function localRefDataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(path.join(STAGING, file)).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 88 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask(prompt, refs) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs: refs, imgNum: 1, imgRatio: '3:4',
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
  const layoutRef = await localRefDataUri(LAYOUT_REF);
  for (const p of PRODUCTS) {
    const prompt = buildPrompt(p);
    const refs = [layoutRef, await localRefDataUri(p.ref)];
    const uuid = await createTask(prompt, refs);
    console.log(`创建任务: waffle-${p.id} task_uuid=${uuid}`);
    const imgUrl = await pollTask(uuid);
    const res = await fetch(imgUrl);
    if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const out = path.join(STAGING, `waffle-zhongcao-${p.id}-34.png`);
    fs.writeFileSync(out, buf);
    console.log(`已保存 ${out} (${buf.length} bytes)`);
  }
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
