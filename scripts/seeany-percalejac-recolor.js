/**
 * seeany-percalejac-recolor.js — PERCALEJAC 三色主图：以 HAZE 主图为底做 img2img 换色（2026-10-22 用户定）
 * 需求：图的结构、细节不变，只改床品颜色（ROSE=Dusty Pink / GREY=Light Grey / OATBEIGE=Oatmeal Beige）；
 *       每张床上小物件摆放和褶皱有轻微差别；面料织纹提花肌理与底图 1:1（零纹理描述，只指向参考图）
 * 用法: node scripts/seeany-percalejac-recolor.js
 * 输出: public/images/staging/percalejac-{rose,grey,oatbeige}-34.png
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
const BASE = path.join(ROOT, 'public', 'images', 'products', 'PERCALEJAC-HAZE-QUEEN', '1-3x4.webp');

const VARIANTS = [
  {
    out: 'percalejac-rose-34.png',
    colorZh: '低饱和灰粉色（dusty pink，干枯玫瑰调，近似 #C8A7A4）',
    vary: '杂志合上斜放在被面左侧，藤编托盘连带咖啡杯移到被面右侧偏下，被面褶皱形态与参考图有轻微自然差异',
  },
  {
    out: 'percalejac-grey-34.png',
    colorZh: '中性浅灰色（light grey，干净素色灰，近似 #BABDBF，不带蓝调）',
    vary: '杂志翻到另一页放在被面右侧，藤编托盘连带咖啡杯放在被面左侧，被面褶皱形态与参考图有轻微自然差异',
  },
  {
    out: 'percalejac-oatbeige-34.png',
    colorZh: '燕麦米色系（oatmeal beige，温暖低饱和燕麦色，近似 #D3C5B0）',
    vary: '杂志位置不变但翻页姿态略有不同，咖啡杯从托盘中拿出放到被面上、托盘留在原处，床尾搭毯的搭法和被面褶皱与参考图有轻微自然差异',
  },
];

function buildPrompt(v) {
  return [
    // 1. 换色锚定段（织纹肌理零描述，1:1 锁底图；只改颜色）
    `以参考图为底图做整图复刻：整张照片的场景、构图、机位、家具、灯光、植物、挂画、地毯全部与参考图 1:1 保持一致，唯一改变的是床上四件套的颜色——被套和两个枕套的宽条纹图案、织纹肌理与参考图完全一致、原样保留，仅将条纹中的灰蓝色替换为${v.colorZh}，条纹中的白色条纹保持白色不变；被面上端翻折露出的纯色内里（B 面）同步改为与条纹主色同色系的纯色；除床品颜色外，画面中任何其他物体的颜色都不改变`,
    // 2. 轻微变化段（用户定：小物件和褶皱有细微差别）
    `床上小物件与被面褶皱允许有轻微自然变化：${v.vary}；除此之外画面结构与参考图一致`,
    // 3. 光线氛围段
    '保持参考图的光线氛围：温暖自然日光从左侧窗户透过纱帘漫射入室，墙面有柔和斑驳光影，暖色温',
    // 4. 镜头画质段
    '专业室内家居摄影，2K 超高清，浅景深，细微胶片颗粒，超写实真实材质',
    // 5. 品牌调性段
    '整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 风',
    // 6. 负向规避段
    '床品织纹与图案一切以参考图为准、仅换色；规避塑料 CGI 质感、高饱和色彩、卡通画风、扭曲透视、任何文字水印 logo、人物及人体任何部位、宠物、玩偶公仔',
  ].join('。');
}

async function baseDataUri() {
  const sharp = require('sharp');
  const buf = await sharp(BASE).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 90 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask(prompt, refUri) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs: [refUri], imgNum: 1, imgRatio: '3:4',
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
  const refUri = await baseDataUri();
  for (const v of VARIANTS) {
    const out = path.join(STAGING, v.out);
    const uuid = await createTask(buildPrompt(v), refUri);
    console.log(`创建任务: ${v.out} task_uuid=${uuid}`);
    const imgUrl = await pollTask(uuid);
    const res = await fetch(imgUrl);
    if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(out, buf);
    console.log(`已保存 ${out} (${buf.length} bytes)`);
  }
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
