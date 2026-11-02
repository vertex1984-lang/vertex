/**
 * seedream-main-c-sheetset-sample.js — Sheet Sets 主图展示样图（2026-10-31）
 * 与 Sheets & Duvet Sets 同一签名（场景/机位/道具），展示差异：无被套，
 * 床单床头处 turn-down 翻折 + 枕套枕为视觉主体。
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images', 'products', 'SHEETSET-SAGEGREEN-QUEEN', '1.webp');

const PROMPT =
  '以参考图中的床品面料为准：灰绿色（sage green，低饱和灰调豆绿，不是鲜绿不是墨绿）细条纹水洗棉床单套件' +
  '（只有床笠、床单和两个枕套，没有被套），条纹为细密规则的纵向细条，水洗做旧微皱肌理，' +
  '颜色、条纹间距与参考图 1:1 一致，不改色、不扭曲条纹图案。' +
  '现代简约卧室，浅原木+藤编床头板，床头两侧浅原木床头柜。' +
  '床的铺法（与四件套系列的关键差异）：床上没有被套、没有蓬松被体——床笠包床垫，床单铺平，' +
  '床单在床头处向外翻折出一道约 30cm 的整齐折边（turn-down 折角），露出床单反面同色面料；' +
  '两个套着枕套的枕头立靠床头板，是画面的视觉主体；整体半整理状态，自然微皱不刻意拉平。' +
  '道具站位固定：画面左下角一盆琴叶榕绿植；一侧床头柜上放一杯咖啡和一本翻开的书。床上和床尾不要出现任何毯子、盖毯或毛毯。' +
  '清晨低角度自然光从左侧白纱帘透入，在床单上形成柔和 directional 光影。' +
  '白平衡中性准确：床品颜色与参考图 1:1 一致，画面整体不得偏黄；温暖感只来自晨光方向和原木/藤编/燕麦色道具。' +
  '构图要求（最高优先级）：忽略参考图的构图和机位，仅参考床品的颜色和图案。' +
  '镜头机位：55° 高机位纵向俯拍——相机位于床尾右上方高处，沿床身长度方向朝床头俯拍，接近垂直俯视床面。' +
  '方向锁定：床头板在画面左上方、只占顶部一条边，床尾在画面右下方，床身从左上向右下对角延伸（与系列其他主图完全同向，不得镜像）。' +
  '枕头从高位俯视看到完整枕面；看不到墙面、窗户和壁灯。' +
  '床面和枕面占画面 75% 以上，是绝对主体；画面底部可见一小条地板。' +
  '专业室内家居摄影，照片级真实感，高清细节，无文字无水印无 logo。';

(async () => {
  const b64 = fs.readFileSync(SRC).toString('base64');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      prompt: PROMPT,
      image: `data:image/webp;base64,${b64}`,
      response_format: 'url',
      size: '1536x2048',
      stream: false,
      watermark: false,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(JSON.stringify(data).slice(0, 500));
  const buf = Buffer.from(await (await fetch(data.data[0].url)).arrayBuffer());
  fs.writeFileSync(path.join(ROOT, 'public', 'images', 'staging', 'main-c-sheetset-sagegreen.jpg'), buf);
  console.log(`已保存 main-c-sheetset-sagegreen.jpg (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
