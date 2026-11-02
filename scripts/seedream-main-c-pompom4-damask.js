/**
 * seedream-main-c-pompom4-damask.js — POMPOM4-DAMASK-QUEEN 主图（C 方案 55° 高机位，2026-11-02）
 * 参考图：供应链产品图（仅取颜色/花型/绒球镶边，构图机位按模板）
 * 依据：C:\Users\12021\Desktop\主图规则\产品主图生成规则（bedding-sheets-duvet-sets）.md
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');

const SCENE =
  '现代简约卧室，浅原木+藤编床头板，床头两侧浅原木床头柜。' +
  '床铺"半整理"状态：被套自然铺开带柔和生活感褶皱，不刻意拉平也不凌乱，能看清面料垂坠。' +
  '道具站位固定：画面左下角一盆琴叶榕绿植；一侧床头柜上放一杯咖啡和一本翻开的书。床上和床尾不要出现任何毯子、盖毯或毛毯。' +
  '清晨低角度自然光从左侧白纱帘透入，在被面形成柔和 directional 光影。' +
  '白平衡中性准确：床品颜色与参考图 1:1 一致，画面整体不得偏黄；温暖感只来自晨光方向和原木/藤编/燕麦色道具。' +
  '专业室内家居摄影，照片级真实感，高清细节，无文字无水印无 logo。';

const CAMERA_C =
  '构图要求（最高优先级）：忽略参考图的构图和机位，仅参考床品的颜色、图案和镶边。' +
  '镜头机位：55° 高机位纵向俯拍——相机位于床尾右上方高处，沿床身长度方向朝床头俯拍，接近垂直俯视床面。' +
  '方向锁定：床头板在画面左上方、只占顶部一条边，床尾在画面右下方，床身从左上向右下对角延伸（与系列其他主图完全同向，不得镜像）。' +
  '枕头从高位俯视看到完整枕面；看不到墙面、窗户和壁灯。' +
  '被面和枕面占画面 75% 以上，是绝对主体；画面底部可见一小条地板。';

const prompt =
  '以参考图中的床品为准：苔藓绿色（莫松染 moss green，低饱和橄榄绿调花纹，不深不暗、忌偏黄绿）大马士革卷草纹四件套，' +
  '花型为密集规则的大马士革卷草藤蔓纹样，奶白米色底 + 橄榄绿色提花花纹，' +
  '面料是加厚雕花牛奶绒（milk velvet）：短密绒面、柔软哑光、有厚度感和浮雕立体感，不是平滑棉布，' +
  '被套翻折处露出纯色橄榄绿绒面里料，边缘有一圈深橄榄棕色绒球（pom-pom）流苏镶边，绒球小而密，' +
  '颜色、花型密度、绒面质感、绒球镶边与参考图 1:1 一致，不改色、不扭曲纹样、不改变镶边样式，画面里不要出现人手。' +
  SCENE + CAMERA_C;

(async () => {
  // 2026-11-02 用户定：参考图用 alicdn 供应链链接（不用本地文件）；本版换莫松染橄榄绿色款参考图
  const src = 'https://cbu01.alicdn.com/img/ibank/O1CN01XAzN7Ar3SgE1bRrw_!!2208020949973-0-cib.jpg';
  const b64 = Buffer.from(await (await fetch(src)).arrayBuffer()).toString('base64');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      prompt,
      image: `data:image/jpeg;base64,${b64}`,
      response_format: 'url',
      size: '1536x2048',
      stream: false,
      watermark: false,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(JSON.stringify(data).slice(0, 500));
  const imgUrl = data.data?.[0]?.url;
  if (!imgUrl) throw new Error('无结果图: ' + JSON.stringify(data).slice(0, 500));
  const buf = Buffer.from(await (await fetch(imgUrl)).arrayBuffer());
  const dest = path.join(ROOT, 'public', 'images', 'staging', 'main-c-pompom4-damask.jpg');
  fs.writeFileSync(dest, buf);
  console.log(`已保存 ${dest} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
