/**
 * seeany-gray-patch-zhongcao.js — 灰色拼接提花四件套 3:4 种草图（2026-10-22 用户定）
 * 规则：docs/lifestyle-image-rules.md 六段式；mode = gpt-image-2.5-sunburst；站内图分支（#F8F5F0 + #8B5A2B）
 * 纹理策略（2026-10-22 用户定，AGENTS.md 经验）：提花/印花类零纹理文字描述，只挂参考图让 img2img 迁移
 * 结构类约束保留文字：床占约 3/4（与其他 bedding 主图近似）、床底无垂布、50mm 防畸变
 * 机位：床右侧中部偏床尾三分之四侧拍（床头在右、床尾向左延伸），区别于既有各版
 * 用法: node scripts/seeany-gray-patch-zhongcao.js
 * 输出: public/images/staging/gray-patch-zhongcao-34.png
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
const OUT = path.join(STAGING, 'gray-patch-zhongcao-34.png');

const PROMPT = [
  // 1. 产品锚定段（零纹理描述，只指向参考图——2026-10-22 用户定）
  '使用参考图中的床上四件套：这套床品的外观与参考图完全一致、1:1 原样还原，就像把参考图里同一套床品从原床上拿下来、原封不动铺到新场景的床上，床品的所有视觉特征全部以参考图为准，布面零织标零印花',
  // 2. 场景构建段（床右侧机位 + 床底结构约束）
  '3:4 竖版卧室，床占画面约 3/4，机位在床右侧中部偏床尾的三分之四侧面视角（床头在右、床体向左下延伸）：奶油白布艺弧形软包床头板贴右侧暖米色墙面，床头上方挂一幅细框原木抽象挂画，床头右侧一只圆形原木边几、上面一盏奶白陶瓷褶皱罩台灯和一只粗陶小花瓶插两支干芦苇；床品自然松弛铺好、带生活化褶皱，被面上端随意翻折；被面中央放一本翻开的家居杂志和一只藤编托盘、托盘上一杯带拉花拿铁；床尾左侧前景一只原木长凳，凳面搭燕麦色华夫格针织毯；画面左侧是一扇挂亚麻白纱帘的高窗，窗前一株大型天堂鸟绿植；床笠紧紧包裹床垫不外露下垂、被套从床垫边缘自然垂坠一小段且明显离地，床垫以下是床架与床腿、结构干净，床底不出现任何额外垂落的布料；地面铺奶咖色短绒地毯，浅原木色地板',
  // 3. 光线氛围段
  '温暖金色时刻自然日光从左侧高窗透过纱帘漫射入室，布面与墙面有柔和斑驳的纱帘光影，暖色温，安静治愈',
  // 4. 镜头画质段
  '专业室内家居摄影，2K 超高清，50mm 标准镜头（避免广角畸变，床体横平竖直不变形），浅景深（焦点在床品，前景背景自然虚化），细微胶片颗粒，超写实真实材质',
  // 5. 品牌调性段（站内图分支）
  '整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 风，床品在暖光环境下颜色仍以参考图为准不偏色，温暖松弛的生活方式杂志感',
  // 6. 负向规避段（标准简版）
  '床品外观一切以参考图为准；床底无多余垂布床裙；规避塑料 CGI 质感、高饱和色彩、卡通画风、扭曲透视、床头床尾透视比例失真、任何文字水印 logo、人物及人体任何部位、宠物、玩偶公仔',
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
      inputImgs: [await localRefDataUri('ref-gray-patch.jpg')], imgNum: 1, imgRatio: '3:4',
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
  console.log(`创建任务: gray-patch task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUT, buf);
  console.log(`已保存 ${OUT} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
