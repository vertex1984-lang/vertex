/**
 * seeany-percalejac-oatbeige-duvetonly-foldback.js — 单独被套主图试做·局部翻折露内面（2026-10-23 用户定）
 * 背景：俯视对折灰底方向放弃（条纹宽度对不上）；改为用户给的构图（粉色条纹被套参考图）：
 *   镜头近距离裁切床体一角，只呈现部分被套；被套上部向床头方向翻折，露出纯色内面；
 *   不要任何小摆件（无书籍/托盘/杯饮）。
 * 参考图 1（布料锚·整体配色）：PERCALEJAC-OATBEIGE-QUEEN/1-3x4.webp
 * 参考图 2（织纹锚）：PERCALEJAC-OATBEIGE-QUEEN/3.webp（华夫格提花肌理 + 奶白宽条纹/燕麦窄条纹宽度比）
 * 输出：public/images/staging/percalejac-oatbeige-duvetonly-foldback-34.png
 * 用法: node scripts/seeany-percalejac-oatbeige-duvetonly-foldback.js
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
  // 场景构图（用户给的粉色条纹被套参考图的做法）
  '场景：3:4 竖版，暖调极简卧室。镜头近距离取景床体侧角，画面只呈现床的局部与部分被套——' +
  '被套铺在床垫上，上部约三分之一向床头方向整齐翻折，露出被套的纯色内面（纯色奶白，无条纹），' +
  '翻折边线自然平直，内面与条纹外面形成质感对比；被套边缘自然垂坠盖住床垫侧面，露出少量原木床架与地毯。' +
  '画面中只有床与被套：没有枕头、没有被芯、没有任何小摆件（无书籍、无托盘、无杯饮、无花瓶）。' +
  // 光线
  '光线：柔和暖调自然光从侧窗洒入，布面有细腻明暗层次与柔软褶皱阴影，暖色温，奶油色调低饱和。' +
  // 镜头画质
  '镜头：专业家居纺织品摄影，8K 超高清，焦距略近的局部取景，布料肌理清晰锐利，超写实真实物理材质。' +
  // 负向规避
  '规避：零改动产品颜色质感；无塑料 CGI 质感、无平涂死黑阴影、无高饱和色彩、' +
  '无失真反光、无扭曲透视；画面无任何文字、水印、logo、人物、道具。';

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
  const dest = path.join(OUT, 'percalejac-oatbeige-duvetonly-foldback-34.png');
  console.log('创建任务: Oat Beige 单独被套 局部翻折露内面（无摆件）');
  const uuid = await createTask([await dataUri(REF_FABRIC), await dataUri(REF_DETAIL)]);
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 ${dest} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
