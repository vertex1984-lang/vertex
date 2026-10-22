/**
 * seeany-blue-stripe-zhongcao-34.js — 蓝调几何条纹床品 3:4 种草图（2026-10-21 用户定）
 * 用途：根据用户提供的参考图（staging/ref-blue-stripe-bed.jpg）生成种草图级竖版场景图
 * 画面（2026-10-21 三轮，用户定：按 docs/lifestyle-image-rules.md 六段式标准 + 温馨奶油色调
 *   匹配网站色系 #F8F5F0 + #8B5A2B）：床品 1:1 还原参考图（奶白底 + 灰色几何细条纹方块被套枕套，
 *   内面/反折处/床笠低饱和灰蓝 dusty blue，颜色锁定不偏亮不偏艳），仅环境转暖奶油场景；
 *   床体占画面约 4/5，3:4 竖版微俯拍
 * 输出：public/images/staging/blue-stripe-zhongcao-34.png
 * 用法: node scripts/seeany-blue-stripe-zhongcao-34.js
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
const SRC = path.join(ROOT, 'public', 'images', 'staging', 'ref-blue-stripe-bed.jpg');
const OUT_PNG = path.join(ROOT, 'public', 'images', 'staging', 'blue-stripe-zhongcao-34.png');

// 六段式指令（docs/lifestyle-image-rules.md，2026-10-21 用户确认版）
const PROMPT = [
  // 1. 产品锚定段
  '以这张参考图为绝对基准：床上的床品套件 1:1 完全还原——被套和枕套为奶白底色配灰色几何细条纹方块图案（细密灰条纹组成的错落矩形块），棉质面料细腻哑光质感；被套反折处、枕套内面与床笠为低饱和灰蓝色（dusty blue / 雾霾蓝，发灰、柔和、不鲜艳）；床品的图案、配色、材质、褶皱、造型比例全部 1:1 保持不变，尤其蓝色部分必须严格还原参考图的灰蓝色调，不得偏亮、偏艳、偏天蓝色；布面零织标零印花',
  // 2. 场景构建段（2026-10-21 四轮：加"床体结构真实合理"约束——上一版床架/床垫结构出错，用户定重新生成、布局不变）
  '场景为温馨奶油风卧室：3:4 竖版构图，床为宽幅大床（king size 双人床），床体横向充分舒展、占据画面绝大部分空间（约 4/5 画面），床头一排四只以上枕头并排铺开以体现床面宽阔；镜头略低角度微俯拍，从床尾侧前方取景；床体结构必须真实合理——标准床架承托标准床垫，床垫与床架严密贴合，床头板与床架连接自然牢固，床体为规则长方体且严格符合透视原理（床头与床尾实际同宽，仅近大远小自然渐变），不得出现悬浮、错位、变形、收窄失真或不合理的拼接；奶白色软包床头板配浅原木床架（带自然木纹质感），床头一侧奶油色陶瓷台灯配亚麻灯罩，原木边几上放一本翻开的生活方式杂志和一只粗陶咖啡杯，床尾自然搭一条燕麦色羊毛针织毯（几何编织纹理），画面一角大型琴叶榕绿植（叶片带自然脉络），床下浅色羊毛几何编织地毯，墙上挂一幅细框原木挂画，窗户挂亚麻白纱帘；前景、中景、远景层次丰富，有呼吸感留白',
  // 3. 光线氛围段
  '温暖金色时刻自然日光透过白纱帘漫射入室，床品与木地板上形成柔和斑驳光影，柔和漫射渐变阴影，窗边日光自带温润光晕，自然光线衰减，暖色温',
  // 4. 镜头画质段
  '专业室内家居摄影，2K 超高清，浅景深电影镜头效果（焦点锁定床品，前景与背景自然虚化），细微复古胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质',
  // 5. 品牌调性段（站内图分支）
  '整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 风，温馨、舒适、松弛的生活方式杂志感',
  // 6. 负向规避段
  '零改动产品颜色质感（灰蓝不偏亮不偏艳）；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、鲜亮天蓝色、卡通插画画风、失真反光、扭曲透视、任何文字水印 logo、人物、宠物、玩偶公仔',
].join('。');

async function localRefDataUri() {
  const sharp = require('sharp');
  const buf = await sharp(SRC).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 88 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask(prompt) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs: [await localRefDataUri()], imgNum: 1, imgRatio: '3:4',
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
  if (!fs.existsSync(SRC)) { console.error(`找不到参考图: ${SRC}`); process.exit(1); }
  const uuid = await createTask(PROMPT);
  console.log(`创建任务: blue-stripe-zhongcao-34 task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUT_PNG, buf);
  console.log(`已保存 ${OUT_PNG} (${buf.length} bytes)`);
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
