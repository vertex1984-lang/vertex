/**
 * seeany-percale-coconut-zhongcao.js — PERCALE-COCONUT-QUEEN（椰奶白珀卡尔棉四件套）3:4 种草图（2026-10-22 用户定）
 * 规则：docs/lifestyle-image-rules.md 六段式；mode = gpt-image-2.5-sunburst；站内图分支色调（米色 #F8F5F0 + 暖棕 #8B5A2B）
 * 参考图：staging/ref-percale-coconut.webp（= 产品主图 1.webp），床品颜色/肌理 1:1 锁定
 * 用法: node scripts/seeany-percale-coconut-zhongcao.js
 * 输出: public/images/staging/percale-coconut-zhongcao-34.png
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
const REF = 'ref-percale-coconut.webp';
const OUT = path.join(STAGING, 'percale-coconut-zhongcao-34.png');

const PROMPT = [
  // 1. 产品锚定段
  '以参考图为绝对基准：床上的床品四件套 1:1 完全还原——被套、床笠与两只枕套为椰奶白纯色珀卡尔棉（coconut white cotton percale，平纹密织脆爽手感，雾面哑光，布面带细腻自然的微皱肌理，非丝光非缎面），颜色、材质肌理、造型比例全部 1:1 锁定参考图，布面零织标零印花零图案',
  // 2. 场景构建段
  '场景为温馨奶油风卧室：3:4 竖版构图，宽幅大床占据画面绝大部分空间（约 4/5 画面），镜头略低角度微俯拍，从床尾侧前方取景，床体为规则长方形、严格符合透视原理；浅原木床架（自然木纹年轮）配藤编原木床头板，床尾凳为原木藤编长凳；床头一侧洞石底座陶瓷台灯配亚麻灯罩（天然洞石孔隙纹理），原木边几上放一本翻开的生活方式杂志（无可辨识文字）和一只粗陶拿铁杯带拉花，床尾自然搭一条燕麦色羊毛针织毯（几何编织纹理、长绒流苏），画面一角大型琴叶榕绿植（叶片带自然脉络绒面质感），床下浅色羊毛几何编织长毛地毯，墙上挂一幅细框原木抽象挂画，窗户挂亚麻白纱帘；前景、中景、远景层次丰富，有呼吸感留白',
  // 3. 光线氛围段
  '温暖金色时刻自然日光透过白纱帘漫射入室，床品与木地板上形成柔和斑驳光影，柔和漫射渐变阴影，窗边日光自带温润光晕，自然光线衰减，暖色温',
  // 4. 镜头画质段
  '专业室内家居摄影，2K 超高清，浅景深电影镜头效果（焦点锁定床品，前景与背景自然虚化），细微复古胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质',
  // 5. 品牌调性段（站内图分支）
  '整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 风，温馨、舒适、松弛的生活方式杂志感',
  // 6. 负向规避段
  '零改动产品颜色质感；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视、任何文字水印 logo、人物及人体任何部位（包括手）、宠物、玩偶公仔',
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
      inputImgs: [await localRefDataUri(REF)], imgNum: 1, imgRatio: '3:4',
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
  console.log(`创建任务: percale-coconut task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUT, buf);
  console.log(`已保存 ${OUT} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
