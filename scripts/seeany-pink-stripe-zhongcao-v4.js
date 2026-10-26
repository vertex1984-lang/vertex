/**
 * seeany-pink-stripe-zhongcao-v4.js — 粉白细条纹种草图 v4：全新精简指令（2026-10-22 用户定）
 * 背景：v2/v3 对纹理的微观约束（实线/短划/断点等）过多导致失真 → 用户定：全新指令、限制收敛，
 *   纹理只做一句"完全还原参考图"，交给 img2img 迁移，不再技术化描述
 * 用法: node scripts/seeany-pink-stripe-zhongcao-v4.js
 * 输出: public/images/staging/pink-stripe-zhongcao-34-v4.png
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
const OUT = path.join(STAGING, 'pink-stripe-zhongcao-34-v4.png');

const PROMPT = [
  // 1. 产品锚定段（收敛为一句：完全还原参考图）
  '把参考图中的床上四件套完整搬进新场景：布料的纹理、图案、颜色与参考图 1:1 完全还原（A面粉白细条纹提花、B面纯色裸粉、枕套同A面），就像把同一套床品重新铺到另一张床上，布面零织标零印花',
  // 2. 场景构建段
  '3:4 竖版卧室，床占画面约 3/4，机位在床左侧中部偏床尾的三分之四侧面视角（床头在左、床体向右下延伸）：浅橡木原木条板床头板贴暖米色墙面，床头上方挂两幅细框原木小挂画，床头左侧一盏弧形原木落地灯；床品自然松弛铺好、带生活化褶皱，被面上端随意翻折露出纯色内里；被面中央放一本翻开的家居杂志和一只粗陶马克杯；床尾右侧前景一只原木藤编长凳，凳面搭奶白色粗棒针羊毛毯；画面右侧是挂亚麻白纱帘的窗户，窗前一株大型琴叶榕；地面铺奶咖色羊毛地毯，浅原木色地板',
  // 3. 光线氛围段
  '温暖金色时刻自然日光从右侧窗户透过纱帘漫射入室，布面与墙面有柔和斑驳的纱帘光影，暖色温，安静治愈',
  // 4. 镜头画质段
  '专业室内家居摄影，2K 超高清，50mm 标准镜头，浅景深（焦点在床品，前景背景自然虚化），细微胶片颗粒，超写实真实材质',
  // 5. 品牌调性段（站内图分支）
  '整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 风，温暖松弛的生活方式杂志感',
  // 6. 负向规避段（标准简版）
  '零改动床品纹理与颜色；规避塑料 CGI 质感、高饱和色彩、卡通画风、扭曲透视、任何文字水印 logo、人物及人体任何部位、宠物、玩偶公仔',
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
  console.log(`创建任务: pink-stripe-v4 task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUT, buf);
  console.log(`已保存 ${OUT} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
