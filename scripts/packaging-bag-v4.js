/**
 * packaging-bag-v4.js — Makimoo 床品收纳袋包装设计 v4 帆布版（2026-11-17）
 * 版式同 v3：正面左下角小号 logo、无 slogan；背面完全素面无 logo（保留底部棕色装饰车线）。
 * 材质换为暖米白 12oz 棉帆布（细腻平整），棕色帆布提手+棕色对比色车线。
 * 参考图：图1/图2 = 用户实物袋（袋型），图3 = makimoo-logo.webp（logo 图形）。
 * 输出：E:/Makimoo Website/packaging-design/packaging-v4-canvas-<front|back>.jpg（2048x1536 横版）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const OUT_DIR = 'E:/Makimoo Website/packaging-design';

const BAG_FRONT = 'E:/微信/xwechat_files/wxid_na48u1r9pwya22_fc25/temp/RWTemp/2026-11/ad72bb36f7f9f6084f20b222edbf9074.jpg';
const BAG_TOP = 'E:/微信/xwechat_files/wxid_na48u1r9pwya22_fc25/temp/RWTemp/2026-11/87baf3209d0fbbab8f0343b10af80ae3/eafc5a85e6d8953fcb08844728fc2b30.jpg';
const LOGO = path.join(__dirname, '..', 'public', 'images', 'brand', 'makimoo-logo.webp');

const dataUri = (p) => {
  const mime = p.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
  return `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`;
};

const SHAPE =
  '参考图1和图2是同一款床上用品收纳包装袋的实物照片：软质横向长方形拉链布袋，袋身宽明显大于高，' +
  '顶部一条贯通长拉链，正面袋身上车缝两条织带提手（提手下端在袋面矩形车线加固），袋身柔软微塌、四角有自然褶皱。' +
  '袋型、比例、提手位置与数量、拉链结构必须严格参照参考图1和图2，不得改成硬挺箱型或竖款。';

const MATERIAL =
  '材质为暖米白色12oz棉帆布：织纹细腻平整、表面干净，哑光，比麻布更挺括一些但仍保持软袋的自然垂感。' +
  '提手为深棕色棉织带，袋身边缝用深棕色对比色车线。';

const SHOT =
  '电商产品棚拍：米白色（#F8F5F0）无缝背景，柔和均匀自然光，照片级真实感，高清细节，无水印无杂物。';

const JOBS = [
  {
    dest: 'packaging-v4-canvas-front.jpg',
    refs: [BAG_FRONT, BAG_TOP, LOGO],
    prompt:
      SHAPE + MATERIAL +
      '正面展示：袋身正面左下角印刷一个小号品牌logo（约占袋面宽度1/5，比例克制协调）：' +
      '深棕色（#4E3829）细线圆框内一只正面牛头剪影（双角、双耳向两侧平伸、两只镂空圆眼、下颌两侧波浪形鬃毛轮廓），' +
      '图形严格参照参考图3、不得重新设计；圆框正下方紧跟小写"makimoo"字标（字体接近即可）。' +
      '除左下角这一处小号logo外，袋身正面其他区域完全素色无印刷，不要出现任何其他文字或标语。' +
      '相机正面平视角度，完整展示袋身正面与顶部提手。' + SHOT,
  },
  {
    dest: 'packaging-v4-canvas-back.jpg',
    refs: [BAG_FRONT],
    prompt:
      SHAPE + MATERIAL +
      '背面展示：袋身背面完全素色，没有任何印刷、没有logo、没有文字，' +
      '仅袋身底部一道深棕色装饰车线。两条棕色提手自然搭在袋顶。' +
      '相机正面平视角度，完整展示袋身背面。' + SHOT,
  },
];

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const job of JOBS) {
    const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
      body: JSON.stringify({
        model: 'doubao-seedream-5-0-pro-260628',
        prompt: job.prompt,
        image: job.refs.map(dataUri),
        response_format: 'url',
        size: '2048x1536',
        stream: false,
        watermark: false,
      }),
    });
    const data = await res.json();
    if (!res.ok || data.error) { console.error(`[${job.dest}] API 失败:`, JSON.stringify(data).slice(0, 300)); continue; }
    const buf = Buffer.from(await (await fetch(data.data[0].url)).arrayBuffer());
    const out = path.join(OUT_DIR, job.dest);
    fs.writeFileSync(out, buf);
    console.log(`[${job.dest}] 已保存 (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
