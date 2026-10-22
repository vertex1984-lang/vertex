/**
 * seeany-duvset-gray-zhongcao.js — DUVSET-GRAY-QUEEN（浅灰磨毛超细纤维四件套）3:4 种草图（2026-10-22 用户定）
 * 规则：docs/lifestyle-image-rules.md 六段式；mode = gpt-image-2.5-sunburst；站内图分支色调（米色 #F8F5F0 + 暖棕 #8B5A2B）
 * 本次重点（用户定）：纯文生图、不参考现有图；床的摆放方式要与 Cotton Percale / 100% Linen 两张主图明显区别
 *   ——那两张是「机位床尾偏左、床头在画面右后方、藤编床头板、窗在左」，
 *   本图改为「机位床尾偏右三分之四视角、床头在画面左后方、低矮原木条板床头板、窗在右」；
 *   床占画面约 3/4（与那两张截取前占图比一致）
 * 用法: node scripts/seeany-duvset-gray-zhongcao.js
 * 输出: public/images/staging/duvset-gray-zhongcao-34.png
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
const OUT = path.join(ROOT, 'public', 'images', 'staging', 'duvset-gray-zhongcao-34.png');

const PROMPT = [
  // 1. 产品锚定段（无参考图，纯文生图——用文字精准锁定产品）
  '主角产品：浅灰色磨毛超细纤维床上四件套（light gray soft brushed microfiber duvet cover set，雾面哑光磨毛肌理、细腻短绒触感、柔和不反光），被套自然松弛地铺在床上、被面上端约三分之一处随意翻折露出内里，两只同色系浅灰枕套套着饱满枕头、一只正放一只微斜，床品带自然生活化褶皱、不刻意熨烫，布面零织标零印花',
  // 2. 场景构建段（床摆放区别于既有主图：床头在左后、机位床尾偏右、窗在右）
  '3:4 竖版卧室构图，床占画面约 3/4：机位在床尾偏右侧的三分之四视角，床头朝向画面左后方——低矮的原木条板床头板（浅橡木色、带木纹年轮）贴左侧暖米色墙面；床头板左上方挂一幅细框原木抽象挂画；床头左侧角落立着一盏弧形原木落地灯（亚麻灯罩）；床尾右侧前景有一只原木长凳，凳面搭着一条奶白色粗棒针羊毛毯（粗大针织纹理、自然垂坠到地毯）；被面中央偏右随意放着一本翻开的家居杂志和一个藤编托盘、托盘上一只粗陶白瓷咖啡杯；床头右侧有一只原木床头柜，柜上一小盆尤加利和两本叠放的布面书；画面右侧是一扇挂亚麻白纱帘的窗户，窗前一株大型橄榄树盆栽（叶片带自然脉络）；地面铺奶咖色羊毛几何编织地毯，浅原木色地板；前中远景层次自然，有呼吸感留白',
  // 3. 光线氛围段
  '温暖金色时刻自然日光，从右侧窗户透过亚麻白纱帘漫射入室，在床品褶皱、床头板与地板上形成柔和斑驳的纱帘光影，柔和漫射渐变阴影，窗边日光自带温润光晕，自然光线衰减，暖色温',
  // 4. 镜头画质段
  '专业室内家居摄影，2K 超高清，浅景深电影镜头效果（焦点锁定床品，前景床尾凳与背景窗边绿植自然虚化），细微复古胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质',
  // 5. 品牌调性段（站内图分支）
  '整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 风，温暖、松弛、治愈的生活方式杂志感',
  // 6. 负向规避段
  '零改动产品浅灰颜色与磨毛质感；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视、床头床尾透视比例失真、任何文字水印 logo、人物及人体任何部位（包括手）、宠物、玩偶公仔、熨烫挺括的床品状态',
].join('。');

async function createTask() {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt: PROMPT,
      inputImgs: [], imgNum: 1, imgRatio: '3:4',
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
  console.log(`创建任务: duvset-gray task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUT, buf);
  console.log(`已保存 ${OUT} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
