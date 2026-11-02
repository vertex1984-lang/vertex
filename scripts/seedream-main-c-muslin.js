/**
 * seedream-main-c-muslin.js — 棉混纺双层纱四件套 C2(navy)/C3(brown) 主图（2026-11-01）
 * 参照《产品主图生成规则（bedding-sheets-duvet-sets）》（原版晨光条款）+ 同组 C1 已定稿处理：
 *   白底小碎花 + 深色碎花荷叶边（ruffle）是产品设计签名；床上无毯子。
 * 输出：public/images/staging/main-c-muslin-<navy|brown>.jpg（1536x2048）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');

const SCENE =
  '现代简约卧室，浅原木+藤编床头板，床头两侧浅原木床头柜。' +
  '床铺"半整理"状态：被套自然铺开带柔和生活感褶皱，不刻意拉平也不凌乱，能看清双层纱面料的柔软垂坠。' +
  '道具站位固定：画面左下角一盆琴叶榕绿植；一侧床头柜上放一杯咖啡和一本翻开的书。床上和床尾不要出现任何毯子、盖毯或毛毯。' +
  '清晨低角度自然光从左侧白纱帘透入，在被面形成柔和 directional 光影。' +
  '白平衡中性准确：床品颜色与参考图 1:1 一致，画面整体不得偏黄；温暖感只来自晨光方向和原木/藤编/燕麦色道具。' +
  '专业室内家居摄影，照片级真实感，高清细节，无文字无水印无 logo。';

const CAMERA_C =
  '构图要求（最高优先级）：忽略参考图的构图和机位，仅参考床品的颜色和图案。' +
  '镜头机位：55° 高机位纵向俯拍——相机位于床尾右上方高处，沿床身长度方向朝床头俯拍，接近垂直俯视床面。' +
  '方向锁定：床头板在画面左上方、只占顶部一条边，床尾在画面右下方，床身从左上向右下对角延伸（与系列其他主图完全同向，不得镜像）。' +
  '枕头从高位俯视看到完整枕面；看不到墙面、窗户和壁灯。' +
  '被面和枕面占画面 75% 以上，是绝对主体；画面底部可见一小条地板。';

const PRODUCTS = [
  {
    asin: '1025015219200-C2',
    dest: 'main-c-muslin-navy.jpg',
    fabric:
      '以参考图中的床品为准：藏青色系（navy）棉混纺双层纱（muslin double gauze）四件套——' +
      '被套和两个枕套的主体是白色/米白底 + 藏青色小碎花图案（碎花小而密、排列均匀）；' +
      '设计签名：被套边缘和两个枕套四周缝有藏青底白碎花的荷叶边（ruffle flounce）装饰，荷叶边自然波浪起伏；' +
      '双层纱面料质感：柔软蓬松、有细密自然的纱皱肌理，哑光无光泽；' +
      '颜色、碎花大小密度、荷叶边样式与参考图 1:1 一致，不改色、不扭曲图案；' +
      '床上只出现被套 + 两个枕套 + 白色床单，不要出现参考图中的纯色盖毯。',
  },
  {
    asin: '1025015219200-C3',
    dest: 'main-c-muslin-brown.jpg',
    fabric:
      '以参考图中的床品为准：栗棕色系（brown，暖调焦糖栗棕）棉混纺双层纱（muslin double gauze）四件套——' +
      '被套和两个枕套的主体是白色/米白底 + 栗棕色小碎花图案（碎花小而密、排列均匀）；' +
      '设计签名：被套边缘和两个枕套四周缝有栗棕底白碎花的荷叶边（ruffle flounce）装饰，荷叶边自然波浪起伏；' +
      '双层纱面料质感：柔软蓬松、有细密自然的纱皱肌理，哑光无光泽；' +
      '颜色、碎花大小密度、荷叶边样式与参考图 1:1 一致，不改色、不扭曲图案；' +
      '床上只出现被套 + 两个枕套 + 白色床单，不要出现参考图中的纯色盖毯。',
  },
];

(async () => {
  for (const p of PRODUCTS) {
    const src = path.join(ROOT, 'public', 'images', 'products', p.asin, '1.webp');
    const b64 = fs.readFileSync(src).toString('base64');
    const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
      body: JSON.stringify({
        model: 'doubao-seedream-5-0-pro-260628',
        prompt: p.fabric + SCENE + CAMERA_C,
        image: `data:image/webp;base64,${b64}`,
        response_format: 'url',
        size: '1536x2048',
        stream: false,
        watermark: false,
      }),
    });
    const data = await res.json();
    if (!res.ok || data.error) { console.error(`[${p.asin}] API 失败:`, JSON.stringify(data).slice(0, 300)); continue; }
    const buf = Buffer.from(await (await fetch(data.data[0].url)).arrayBuffer());
    const out = path.join(ROOT, 'public', 'images', 'staging', p.dest);
    fs.writeFileSync(out, buf);
    fs.copyFileSync(out, path.join(ROOT, 'out', 'images', 'staging', p.dest));
    console.log(`[${p.asin}] 已保存 ${p.dest} (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
