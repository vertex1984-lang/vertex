/**
 * seeany-percale-variations.js — Percale 6 色主图差异化编辑（2026-10-17 用户定，方案一）
 * 起因：6 色图由同一基准 img2img 换色，褶皱/搭毯/道具完全一致，并排有"生成感"。
 * 做法：以每色定稿图为基准 img2img，房间场景/机位/床品颜色 1:1 锁死，仅改：
 *   1) 床品褶皱重新自然铺放（每色不同走向）
 *   2) 搭毯换配色/材质/位置（低饱和撞色，逐色见 VARIATIONS）
 *   3) 小道具微调（杂志开合、杯子、枕头角度）
 * 输出：staging/percale-<key>-v2-1x1.png（确认后再替换正式图，不直接覆盖）
 * 用法: node scripts/seeany-percale-variations.js [颜色key ...]（不传 = 全部 6 色；已存在自动跳过）
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
const STAGING = path.join(__dirname, '..', 'public', 'images', 'staging');

const VARIATIONS = {
  sky: {
    zh: '天空蓝', en: 'soft muted sky blue',
    blanket: '焦糖驼色流苏针织毯，平铺在床尾左半部分',
    wrinkles: '被套表面是松软的波浪形褶皱，床面整体平整饱满、无凹陷无坑洼，右侧被角微微掀起',
    props: '杂志合拢平放，咖啡杯放在杂志上',
  },
  mist: {
    zh: '晨雾灰', en: 'light warm mist grey',
    blanket: '奶白色华夫格纹理毯，斜搭在床尾右侧、一角自然垂落到床沿外',
    wrinkles: '被套左侧被角向床头方向翻折掀起，露出内部同色内衬，褶皱从翻折处散开',
    props: '枕头一正一斜前后错开',
  },
  coconut: {
    zh: '椰奶白', en: 'warm coconut milk off-white',
    blanket: '陶土色流苏毯，斜向搭在床面中部偏右',
    wrinkles: '被套表面大面积的松软波浪褶皱，床头处被子整齐翻折一道',
    props: '去掉床头柜上的杂志，只留咖啡杯；绿植略微移向床头方向',
  },
  nude: {
    zh: '裸粉', en: 'muted nude apricot pink',
    blanket: '奶白色粗棒针织毯，平铺在床尾正中央、两端自然垂落',
    wrinkles: '被套两侧对称自然垂坠，顶部整齐翻折露出约20厘米内衬',
    props: '杂志翻开换一页的姿态，咖啡杯略移向床头内侧',
  },
  euca: {
    zh: '桉叶绿', en: 'muted eucalyptus sage green',
    blanket: '奶油白针织毯折叠后放在床尾长凳上（床面上不放搭毯）',
    wrinkles: '被套左侧大面积自然波浪褶皱，右侧平整铺展',
    props: '保持杂志翻开，咖啡杯移到床头柜更靠近台灯的位置',
  },
  lavender: {
    zh: '雾紫', en: 'muted lavender fog grey-purple',
    blanket: '浅咖色流苏针织毯，斜搭在床尾左侧、一角垂落',
    wrinkles: '被套右侧被角掀起搭在床面上形成斜向褶皱，左侧平整',
    props: '两个枕头都改为微斜倚在床头板上',
  },
};

const filters = process.argv.slice(2);
const jobs = Object.entries(VARIATIONS).filter(([k]) => !filters.length || filters.includes(k));
if (!jobs.length) { console.error('无匹配颜色'); process.exit(1); }

async function localRefDataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function fetchRetry(url, opts, label = 'fetch') {
  for (let t = 0; t < 8; t++) {
    try { return await fetch(url, opts); }
    catch (e) { console.log(`  ${label} 网络重试 ${t + 1}/8`); await new Promise((r) => setTimeout(r, 8000)); }
  }
  throw new Error(`${label} 网络持续失败`);
}

async function createTask(prompt, inputImgs) {
  const res = await fetchRetry(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs, imgNum: 1, imgRatio: '1:1',
      mode: 'gpt-image-2.5-sunburst', size: '2K',
    }),
  }, '创建任务');
  const data = await res.json();
  if (data.code !== 0) throw new Error(JSON.stringify(data));
  return data.data.task_uuid;
}

async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 120; i++) {
    const res = await fetchRetry(url, { headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api' } }, '轮询');
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
  // 网络中断前已创建的任务（复用 uuid，避免重复扣费）
  const EXISTING = { coconut: 'wf5053e4440029230c63d9b49' };
  for (const [key, v] of jobs) {
    const src = path.join(STAGING, `percale-${key}-1x1.png`);
    const dest = path.join(STAGING, `percale-${key}-v2-1x1.png`);
    if (!fs.existsSync(src)) { console.error(`缺基准图: ${src}`); process.exit(1); }
    if (fs.existsSync(dest)) { console.log(`跳过已存在: ${dest}`); continue; }
    const ref = await localRefDataUri(src);
    const prompt =
      '以这张参考图为绝对基准：暖调奶油风卧室，床上一套被套+两个枕套的三件套床品。' +
      '房间场景、机位构图、床头板、床架、床尾长凳、床头柜、台灯、挂画、地毯、窗户光线全部 1:1 零改动；' +
      `床品颜色（${v.zh}，${v.en}）与原图完全一致、零改动。` +
      '仅做以下三处改动：' +
      `1) 被套和枕套的布料褶皱重新自然铺放：${v.wrinkles}，褶皱要真实随机、保留原有光影明暗逻辑，布料保持哑光棉质 percale 质感；` +
      `2) 搭毯改为：${v.blanket}；` +
      `3) 小道具微调：${v.props}。` +
      '写实摄影质感，画面无文字、无水印、无logo、无人。';
    console.log(`创建任务: ${key} ${v.zh} 差异化（1:1, sunburst 2K）`);
    const uuid = EXISTING[key] || await createTask(prompt, [ref]);
    console.log(`  task_uuid=${uuid}${EXISTING[key] ? '（复用）' : ''}, 等待生成...`);
    const imgUrl = await pollTask(uuid);
    const res = await fetchRetry(imgUrl, undefined, '结果图下载');
    if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`  已保存 ${dest} (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
