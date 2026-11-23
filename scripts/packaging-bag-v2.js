/**
 * packaging-bag-v2.js — Makimoo 床品收纳袋包装设计 v2（2026-11-17）
 * 修正点：袋型严格参照用户实物照片；logo 图形严格参照品牌文件；粗麻布纹理加粗。
 * 参考图：图1/图2 = 用户实物袋（袋型），图3 = makimoo-logo.webp（logo 图形）。
 * 输出：E:/Makimoo Website/packaging-design/packaging-v2-burlap-<front|back>.jpg（2048x1536 横版）
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
  '材质改为燕麦米色粗麻布（burlap/黄麻质感）：纹理必须粗犷——粗股麻纱、明显的经纬交织孔眼、' +
  '自然麻结颗粒与轻微毛边感，哑光无光泽。提手改为深棕色棉织带。';

const LOGO_RULE =
  '印刷logo严格参照参考图3：深棕色（#4E3829）细线圆框内一只正面牛头剪影（双角、双耳向两侧平伸、两只镂空圆眼、下颌两侧波浪形鬃毛轮廓），' +
  '图形部分必须与参考图3完全一致、不得重新设计；圆框下方配小写"makimoo"字标（字体接近即可，不强制一致），' +
  '最下方一行小字"Comfort, Woven Into Every Day"。丝网印刷效果，油墨略吃进麻布纹理。';

const SHOT =
  '电商产品棚拍：米白色（#F8F5F0）无缝背景，柔和均匀自然光，照片级真实感，高清细节，无水印无杂物。';

const JOBS = [
  {
    dest: 'packaging-v2-burlap-front.jpg',
    refs: [BAG_FRONT, BAG_TOP, LOGO],
    prompt:
      SHAPE + MATERIAL +
      '正面展示：袋身正面偏左下区域居中印刷品牌logo组合（圆形牛头徽章+"makimoo"字标+slogan），' +
      LOGO_RULE + '相机正面平视角度，完整展示袋身正面与顶部提手。' + SHOT,
  },
  {
    dest: 'packaging-v2-burlap-back.jpg',
    refs: [BAG_FRONT, LOGO],
    prompt:
      SHAPE + MATERIAL +
      '背面展示：袋身背面大面积素色无印刷，仅右下角印一个小号深棕色圆形牛头徽章（与参考图3的图形完全一致），' +
      '袋身底部一道深棕色装饰车线。两条棕色提手自然垂落或搭在袋顶。相机正面平视角度，完整展示袋身背面。' + SHOT,
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
