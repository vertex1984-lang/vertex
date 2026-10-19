/**
 * seeany-bedding-34-batch.js — bedding 全类目主图 3:4 批量扩图（2026-10-19 用户定）
 * 范围：bedding 全部产品主图（按内容 MD5 去重，唯一图 72 张），排除：
 *   - DUVSET-GRAY-DUVET（用户指定主图不变）
 *   - 已是 3:4 的 3 张：PERCALE-COCONUT / PERCALE-SKY / LINEN3-SAGE-DUVET
 *   - 已从 PLP 移除的 17 张：ice silk（1688-1048207560416 / 1688-1061371343572 两族）
 *     和 BEDSET4-BC 纯色四件套（bedset4-beige/gray/pink/white）
 * 做法：以线上 1:1 主图为基准 img2img 竖版 outpainting（3:4），产品、床品褶皱、
 *   床上/画面中所有物品的摆放和细节零改动，仅沿竖直方向延展场景或纯色背景。
 * 流程：全部任务先并行提交（uuid 落 checkpoint，断线可续），再统一轮询下载到
 *   staging/bedding34-<代表ASIN>.png；随后 png→webp q85 替换组内每个 ASIN 的
 *   products/<ASIN>/1.webp（原图备份为 1-1x1-backup.webp）。
 * 用法: node scripts/seeany-bedding-34-batch.js           # 生成+替换（幂等，已完成自动跳过）
 *       node scripts/seeany-bedding-34-batch.js --gen-only # 只生成到 staging，不替换
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const GEN_ONLY = process.argv.includes('--gen-only');

const KEY = (() => {
  for (const p of [
    path.join(ROOT, '.env'),
    path.join(ROOT, '.env.local'),
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
const STAGING = path.join(ROOT, 'public', 'images', 'staging');
const CHECKPOINT = path.join(STAGING, 'bedding34-tasks.json');

const SKIP_ASIN = new Set(['duvset-gray-duvet']);
const SKIP_PREFIX = [
  'percale-coconut', 'percale-sky', // 已是 3:4
  '1688-1048207560416', '1688-1061371343572', // ice silk 已从 PLP 移除
];
const SKIP_EXACT = new Set(['linen3-sage-duvet']); // 已是 3:4
const SKIP_BC = /^bedset4-(beige|gray|pink|white)-/; // BEDSET4-BC 已从 PLP 移除

function evalArray(file, varName, typeName) {
  const src = fs.readFileSync(file, 'utf-8');
  const start = src.indexOf(`const ${varName}: ${typeName} = [`);
  if (start === -1) throw new Error(`${varName} not found in ${file}`);
  const bracketStart = src.indexOf('[', src.indexOf('= [', start));
  let depth = 0, end = -1;
  for (let i = bracketStart; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  return eval(src.slice(bracketStart, end + 1));
}

function inventory() {
  const base = evalArray(path.join(ROOT, 'src/data/products.ts'), 'BASE_PRODUCTS', 'MakimooProduct[]');
  const materials = evalArray(path.join(ROOT, 'src/data/products-materials.ts'), 'MATERIALS_PRODUCTS', 'MakimooProduct[]');
  const bedding = [...base, ...materials].filter((p) => (p.productType || '').toLowerCase() === 'bedding');
  const groups = new Map();
  for (const p of bedding) {
    const asin = p.asin.toLowerCase();
    if (SKIP_ASIN.has(asin) || SKIP_EXACT.has(asin)) continue;
    if (SKIP_PREFIX.some((pre) => asin.startsWith(pre))) continue;
    if (SKIP_BC.test(asin)) continue;
    const img = path.join(ROOT, 'public/images/products', p.asin, '1.webp');
    if (!fs.existsSync(img)) { console.log(`缺图跳过: ${p.asin}`); continue; }
    const md5 = crypto.createHash('md5').update(fs.readFileSync(img)).digest('hex');
    const g = groups.get(md5) || { file: img, asins: [] };
    g.asins.push(p.asin);
    groups.set(md5, g);
  }
  return Array.from(groups.values());
}

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
      inputImgs, imgNum: 1, imgRatio: '3:4',
      mode: 'gpt-image-2.5-sunburst', size: '2K',
    }),
  }, '创建任务');
  const data = await res.json();
  if (data.code !== 0) throw new Error(JSON.stringify(data));
  return data.data.task_uuid;
}

async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 240; i++) {
    const res = await fetchRetry(url, { headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api' } }, '轮询');
    const data = await res.json();
    if (data.code !== 0) throw new Error(`查询失败: ${JSON.stringify(data)}`);
    const { status, assets } = data.data;
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

const PROMPT =
  '以这张参考图为绝对基准做竖版扩图（outpainting），输出 3:4 竖构图：' +
  '参考图的全部内容——产品（床品）本身的颜色、材质、纹理、每一处褶皱，以及画面中所有物品（床、搭毯、枕头、床头柜、台灯、道具等）的摆放位置和细节——' +
  '全部 1:1 零改动保留在原位置，产品和床上/画面中放置物品的任何细节都不允许改变；' +
  '仅沿竖直方向延展画面：卧室场景图则向上延展墙面/窗帘、向下延展地板/地毯/床尾凳，纯色摄影棚背景图则向上下延展同色纯色背景（含原有柔和阴影），' +
  '延展部分的光线方向、色温、透视、景深与原图完全衔接，无拼接感；产品在画面中保持居中。' +
  '写实摄影质感，画面无文字、无水印、无logo、无人。';

(async () => {
  const groups = inventory();
  console.log(`待生成唯一主图: ${groups.length} 张`);
  const ckpt = fs.existsSync(CHECKPOINT) ? JSON.parse(fs.readFileSync(CHECKPOINT, 'utf-8')) : {};
  const saveCkpt = () => fs.writeFileSync(CHECKPOINT, JSON.stringify(ckpt, null, 2));

  // 第一步：全部并行提交（跳过已有 staging 成图的）
  const pending = [];
  for (const g of groups) {
    const rep = path.basename(path.dirname(g.file)).toLowerCase();
    const dest = path.join(STAGING, `bedding34-${rep}.png`);
    if (fs.existsSync(dest)) { console.log(`跳过已存在: bedding34-${rep}.png`); continue; }
    let uuid = ckpt[rep];
    if (!uuid) {
      const ref = await localRefDataUri(g.file);
      uuid = await createTask(PROMPT, [ref]);
      ckpt[rep] = uuid;
      saveCkpt();
      console.log(`已提交: ${rep} task_uuid=${uuid}`);
    } else {
      console.log(`复用任务: ${rep} task_uuid=${uuid}`);
    }
    pending.push({ rep, uuid, dest, asins: g.asins });
  }
  console.log(`提交完成，共 ${pending.length} 个任务待生成`);

  // 第二步：统一轮询下载
  const done = [];
  const failed = [];
  for (const t of pending) {
    try {
      console.log(`等待: ${t.rep} [${t.uuid.slice(0, 8)}]`);
      const imgUrl = await pollTask(t.uuid);
      const res = await fetchRetry(imgUrl, undefined, '结果图下载');
      if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(t.dest, buf);
      console.log(`  已保存 bedding34-${t.rep}.png (${buf.length} bytes)`);
      done.push(t);
    } catch (e) {
      console.error(`  失败: ${t.rep}: ${e.message}`);
      failed.push(t);
    }
  }
  console.log(`生成完成: 成功 ${done.length}，失败 ${failed.length}`);
  if (GEN_ONLY) { console.log('--gen-only，不替换正式图'); return; }

  // 第三步：png → webp 替换组内全部 ASIN 的 1.webp（含此前已存在 staging 的）
  const sharp = require('sharp');
  let replaced = 0;
  for (const g of groups) {
    const rep = path.basename(path.dirname(g.file)).toLowerCase();
    const dest = path.join(STAGING, `bedding34-${rep}.png`);
    if (!fs.existsSync(dest)) continue;
    const webp = await sharp(dest).webp({ quality: 85 }).toBuffer();
    for (const asin of g.asins) {
      const target = path.join(ROOT, 'public/images/products', asin, '1.webp');
      const backup = path.join(ROOT, 'public/images/products', asin, '1-1x1-backup.webp');
      if (!fs.existsSync(backup) && fs.existsSync(target)) fs.copyFileSync(target, backup);
      fs.writeFileSync(target, webp);
      replaced++;
    }
    console.log(`已替换: ${rep} → ${g.asins.length} 个 ASIN`);
  }
  console.log(`替换完成，共写入 ${replaced} 个 1.webp${failed.length ? `；${failed.length} 张生成失败未替换` : ''}`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
