/**
 * seedream-main-c-sheetsets.js — Sheet Sets 全类目主图批量生成（2026-11-01）
 * 规则：产品主图生成规则（bedding-sheet-sets）.md —— 同签名、不同铺法、无毯子。
 * 每款单独描述面料：床单/床笠纯色 + 枕套图案（全部款式均为"纯色床单 + 图案枕套"结构）。
 * 输出：public/images/staging/main-c-sheetset-<name>.jpg（1536x2048）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');

/** 每款的面料描述（床单/床笠纯色 + 枕套图案，与产品描述/参考图核对过） */
const PRODUCTS = [
  {
    asin: 'SHEETSET-GINGHAM-QUEEN',
    name: 'gingham',
    fabric:
      '床笠和床单是纯色浅灰色（light grey，低饱和、不带任何图案）；' +
      '只有两个枕套是灰白格纹（gingham check，中等大小规则方格，灰与米白相间），格纹大小、灰度与参考图 1:1 一致。',
  },
  {
    asin: 'SHEETSET-POLKA-QUEEN',
    name: 'polka',
    fabric:
      '床笠和床单是纯色深藏蓝色（deep navy，浓郁深蓝、不带任何图案）；' +
      '只有两个枕套是灰蓝色底（dusty blue）散布深藏青波点（polka dots，中等大小圆点、间距疏松不规则），波点大小与配色与参考图 1:1 一致。',
  },
  {
    asin: 'SHEETSET-SAND-QUEEN',
    name: 'sand',
    fabric:
      '床笠和床单是纯色暖沙米色（sand beige，暖调浅驼、不带任何图案）；' +
      '只有两个枕套是沙米色细格纹提花（fine yarn-dyed check jacquard，细密规则的小格纹、有织物质感），格纹与颜色与参考图 1:1 一致。',
  },
  {
    asin: 'SHEETSET-PETAL-QUEEN',
    name: 'petal',
    fabric:
      '床笠和床单是纯色裸粉色（blush pink，低饱和奶粉色、不带任何图案）；' +
      '只有两个枕套是裸粉色细条纹提花（fine stripe jacquard，细密规则竖条、同色系深浅交织），条纹与颜色与参考图 1:1 一致。',
  },
  {
    asin: 'SHEETSET-VINE-QUEEN',
    name: 'vine',
    fabric:
      '床笠和床单是纯色灰绿色丝绒（sage green velvet，短绒哑光、不带任何图案）；' +
      '只有两个枕套是奶白色立体藤蔓浮雕提花丝绒（carved plush vine pattern，凸起藤蔓卷草纹），枕套边缘饰有棕色小球球花边（pom-pom trim），纹样与配色与参考图 1:1 一致。',
  },
  {
    asin: 'SHEETSET-IVORY-QUEEN',
    name: 'ivory',
    fabric:
      '床笠和床单是纯色象牙白丝绒（ivory white velvet，暖调奶白、短绒哑光、不带任何图案）；' +
      '只有两个枕套是象牙白菱格编纹立体提花丝绒（diamond-and-braid jacquard velvet，规则菱格纹样、有浮雕感），纹样与颜色与参考图 1:1 一致。',
  },
  {
    asin: 'SHEETSET-HEART-QUEEN',
    name: 'heart',
    fabric:
      '床笠和床单是纯色暖棕褐色（warm tan，亚麻质感、低饱和暖驼色、不带任何图案）；' +
      '只有两个枕套是暖棕褐色底散布深棕色小爱心印花（small heart print，小巧爱心、间距疏松），爱心大小与配色与参考图 1:1 一致。',
  },
  {
    asin: 'SHEETSET-MOCHA-QUEEN',
    name: 'mocha',
    fabric:
      '床笠和床单是纯色摩卡棕色丝绒（mocha brown velvet，暖调中棕、短绒哑光、不带任何图案）；' +
      '只有两个枕套是灰绿色底配暖棕色双细条纹丝绒（sage green ground with warm-brown twin fine stripes，成对细竖条规则排列），条纹与配色与参考图 1:1 一致。',
  },
  {
    asin: 'SHEETSET-SAGEGREEN-QUEEN',
    name: 'sagegreen',
    fabric:
      '床笠和床单是纯色灰绿色（sage green，低饱和灰调豆绿、不带任何图案）；' +
      '只有两个枕套是灰绿色细条纹（yarn-dyed fine stripe，细密规则竖条、同色系深浅交织），条纹与颜色与参考图 1:1 一致。',
  },
];

const scenePrompt = (fabric) =>
  '以参考图中的床品面料为准：床单套件（只有床笠、床单和两个枕套，没有被套）。' +
  '关键配色分离：' + fabric +
  '颜色与图案 1:1 还原参考图，不改色、不扭曲图案。' +
  '现代简约卧室，浅原木+藤编床头板，床头两侧浅原木床头柜。' +
  '床的铺法（关键）：床上没有被套、没有蓬松被体——床笠包床垫，纯色床单铺平，' +
  '床单在床头处向外翻折出一道约 30cm 的整齐折边（turn-down 折角），露出床单反面同色面料；' +
  '两个套着枕套的枕头立靠床头板，是画面的视觉主体；整体半整理状态，自然微皱不刻意拉平。' +
  '道具站位固定：画面左下角一盆琴叶榕绿植；一侧床头柜上放一杯咖啡和一本翻开的书。床上和床尾不要出现任何毯子、盖毯或毛毯。' +
  '清晨低角度自然光从左侧白纱帘透入，在床品上形成柔和 directional 光影。' +
  '白平衡中性准确：床品颜色与参考图 1:1 一致，画面整体不得偏黄；温暖感只来自晨光方向和原木/藤编/燕麦色道具。' +
  '构图要求（最高优先级）：忽略参考图的构图和机位，仅参考床品的颜色和图案。' +
  '镜头机位：55° 高机位纵向俯拍——相机位于床尾右上方高处，沿床身长度方向朝床头俯拍，接近垂直俯视床面。' +
  '方向锁定：床头板在画面左上方、只占顶部一条边，床尾在画面右下方，床身从左上向右下对角延伸（与系列其他主图完全同向，不得镜像）。' +
  '枕头从高位俯视看到完整枕面；看不到墙面、窗户和壁灯。' +
  '床面和枕面占画面 75% 以上，是绝对主体；画面底部可见一小条地板。' +
  '专业室内家居摄影，照片级真实感，高清细节，无文字无水印无 logo。';

(async () => {
  for (const p of PRODUCTS) {
    const src = path.join(ROOT, 'public', 'images', 'products', p.asin, '1.webp');
    const b64 = fs.readFileSync(src).toString('base64');
    const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
      body: JSON.stringify({
        model: 'doubao-seedream-5-0-pro-260628',
        prompt: scenePrompt(p.fabric),
        image: `data:image/webp;base64,${b64}`,
        response_format: 'url',
        size: '1536x2048',
        stream: false,
        watermark: false,
      }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      console.error(`[${p.name}] API 失败:`, JSON.stringify(data).slice(0, 300));
      continue;
    }
    const buf = Buffer.from(await (await fetch(data.data[0].url)).arrayBuffer());
    fs.writeFileSync(path.join(ROOT, 'public', 'images', 'staging', `main-c-sheetset-${p.name}.jpg`), buf);
    console.log(`[${p.name}] 已保存 (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
