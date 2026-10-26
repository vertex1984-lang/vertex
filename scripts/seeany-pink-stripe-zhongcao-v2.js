/**
 * seeany-pink-stripe-zhongcao-v2.js — 粉白细条纹种草图 v2：修纹理 + 床体下方多余布料（2026-10-22 用户定）
 * 问题（用户定）：v1 ①条纹纹理有深色痕迹、线条不连贯、出现短线段与重叠；②床体下方多出一块垂落的不明布料
 *   （床笠是套在床垫上的，不该有垂下来的布）
 * 方案：参考图1=v1 锁角度/构图/场景 1:1（床侧机位保持），参考图2=ref-pink-stripe.jpg 锁真实纹理与颜色
 * 用法: node scripts/seeany-pink-stripe-zhongcao-v2.js
 * 输出: public/images/staging/pink-stripe-zhongcao-34-v2.png
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
const OUT = path.join(STAGING, 'pink-stripe-zhongcao-34-v2.png');

const PROMPT = [
  // 1. 产品锚定段（参考图2 锁真实纹理颜色，条纹质量重点约束）
  '以参考图2为床品材质与颜色的绝对基准 1:1 复刻：A面粉白细条纹色织提花（灰粉裸粉 dusty pink 低饱和细竖条 + 奶白底色细密相间，细腻提花肌理带轻微自然绉感、雾面哑光），B面纯色灰粉裸粉，两只枕套同为细条纹——条纹质量必须完美：每一根细条纹都是清晰、连续、完整的长线条，从布面一端自然延伸到另一端，随床品褶皱自然弯曲起伏但绝不中断；条纹间距均匀一致，颜色是均匀干净的灰粉色，严禁出现断线、短线段、错位、重叠、重影、摩尔纹、深浅不一的色块、深色斑点或污迹，布面整体干净平整',
  // 2. 场景锁定段（参考图1 锁角度构图场景）
  '构图与场景完全沿用参考图1、零增减零移位：3:4 竖版、床占画面约 3/4、床左侧中部偏床尾的三分之四侧面机位（床头在左、床体向右下延伸），浅橡木原木条板床头板、床头板上方两幅细框原木挂画、床头左侧弧形原木落地灯、被面上翻开的杂志与粗陶马克杯、床尾右侧原木藤编长凳配奶白粗棒针羊毛毯、画面右侧挂亚麻白纱帘的窗户与大型琴叶榕、奶咖色羊毛几何编织地毯与浅原木色地板；光线与参考图1一致：右侧窗户金色时刻自然日光透过纱帘漫射，柔和斑驳光影，暖色温',
  // 3. 瑕疵修复段（本次核心）
  '必须修正参考图1的两处瑕疵：①被套与枕套的条纹纹理按第1段要求重建为完美连续的细条纹，消除一切断线/短线/重叠/深痕；②床体下方结构合理化——床笠紧紧包裹床垫（fitted sheet 套在床垫上、仅在床垫边缘贴合包裹，不外露下垂），被套从床垫边缘自然垂坠一小段、垂坠长度克制（离地明显悬空，不拖到地毯），床体下方绝不允许出现任何额外垂落的布料、床裙式围布或来历不明的布片，床垫以下直接是浅原木床架与床腿、结构清晰干净',
  // 4. 镜头画质段
  '专业室内家居摄影，2K 超高清，标准 50mm 镜头视角（避免广角畸变，床体横平竖直不变形），浅景深电影镜头效果（焦点锁定床品条纹肌理，前景与背景自然虚化），细微复古胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质',
  // 5. 品牌调性段（站内图分支）
  '整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 风，床品灰粉在暖光下保持低饱和裸粉不偏艳不变亮，温暖、松弛、治愈的生活方式杂志感',
  // 6. 负向规避段
  '零改动构图与场景；严禁条纹断线/短线段/重叠/重影/摩尔纹/深色斑点污迹；严禁床体下方多余垂落布料/床裙/来历不明布片；粉色保持低饱和灰粉裸粉禁止艳粉亮粉桃红；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、广角畸变、扭曲透视、任何文字水印 logo、人物及人体任何部位（包括手）、宠物、玩偶公仔',
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
      inputImgs: [await localRefDataUri('pink-stripe-zhongcao-34.png'), await localRefDataUri('ref-pink-stripe.jpg')],
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
      if (status === 'failed') throw new Error(`任务失败: ${data.data.error_message || '未知原因'}`);
    } catch (e) {
      if (e.message.startsWith('任务失败') || e.message.startsWith('查询失败') || e.message.startsWith('无结果图')) throw e;
      console.log('  fetch 重试中...');
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error('轮询超时');
}

(async () => {
  const uuid = await createTask();
  console.log(`创建任务: pink-stripe-v2 task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUT, buf);
  console.log(`已保存 ${OUT} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
