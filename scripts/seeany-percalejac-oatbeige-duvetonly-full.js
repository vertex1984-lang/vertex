/**
 * seeany-percalejac-oatbeige-duvetonly-full.js — 单独被套主图试做·满床铺陈少量场景（2026-10-23 用户定）
 * 构图（用户给的灰绿条纹被套参考图做法）：3:4 竖图，床体占画面绝大部分（约 85%），
 *   被套套好被芯呈饱满蓬松状态铺满床面，床侧至床尾的斜侧角度；只留少量场景——
 *   顶部边缘露出少量床头柜（蜡烛/小件）与木地板，枕头顶部裁切只露一角；床面放一本翻开的杂志。
 * 参考图 1（布料锚·整体配色）：PERCALEJAC-OATBEIGE-QUEEN/1-3x4.webp
 * 参考图 2（织纹锚）：PERCALEJAC-OATBEIGE-QUEEN/3.webp（华夫格提花肌理 + 奶白宽条纹/燕麦窄条纹宽度比）
 * 输出：public/images/staging/percalejac-oatbeige-duvetonly-full-34.png
 * 用法: node scripts/seeany-percalejac-oatbeige-duvetonly-full.js
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
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const REF_FABRIC = path.join(ROOT, 'public', 'images', 'products', 'PERCALEJAC-OATBEIGE-QUEEN', '1-3x4.webp'); // 布料配色来源
const REF_DETAIL = path.join(ROOT, 'public', 'images', 'products', 'PERCALEJAC-OATBEIGE-QUEEN', '3.webp'); // 织纹特写基准

const prompt =
  // 产品锚定
  '被套面料严格锚定两张参考图：燕麦米色（oat beige）与奶白色（cream white）相间的竖向条纹提花棉质面料，' +
  '华夫格编织肌理以第二张特写图为准；奶白色条纹明显宽于燕麦米色条纹（约 4:3），' +
  '颜色、条纹宽度比例与参考图 1:1 对应，零改动；布面零织标零印花。参考图仅作布料来源，严禁沿用其场景。' +
  // 场景构图（用户给的灰绿条纹被套参考图做法）
  '场景：3:4 竖版。床体占画面绝大部分（约 85%）：被套套好被芯，呈饱满蓬松、自然松弛的状态铺满整张床，' +
  '镜头从床侧偏床尾的位置斜向取景，被套的竖向条纹沿床面自然起伏，边缘垂坠盖住床垫侧面。' +
  '只留少量场景：画面顶部边缘露出少量原木床头柜（上放一支蜡烛与小陶件）与浅色木地板，' +
  '枕头在顶部被裁切只露一角；床面中部放一本翻开的素色杂志。除此之外无任何道具。' +
  // 光线
  '光线：柔和明亮的自然日光从侧窗洒入，布面有细腻明暗层次与柔软褶皱阴影，整体清爽通透、暖色温奶油色调、低饱和。' +
  // 镜头画质
  '镜头：专业家居纺织品摄影，8K 超高清，布料肌理清晰锐利，超写实真实物理材质。' +
  // 负向规避
  '规避：零改动产品颜色质感；无塑料 CGI 质感、无平涂死黑阴影、无高饱和色彩、' +
  '无失真反光、无扭曲透视；画面无任何文字、水印、logo、人物。';

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask(inputImgs) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs, imgNum: 1, imgRatio: '3:4',
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
  const dest = path.join(OUT, 'percalejac-oatbeige-duvetonly-full-34.png');
  console.log('创建任务: Oat Beige 单独被套 满床铺陈少量场景图');
  const uuid = await createTask([await dataUri(REF_FABRIC), await dataUri(REF_DETAIL)]);
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 ${dest} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
