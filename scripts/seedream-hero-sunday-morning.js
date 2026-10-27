/**
 * seedream-hero-sunday-morning.js — 首页 Hero「慵懒周末早晨」种草图（seedream 5.0 pro，2026-10-27）
 * 用户已确认指令：奶油燕麦色系、睡过一夜的松弛感床铺、清晨漫射暖光、左侧负空间给文案；
 * 桌面 2048x1152（16:9）与移动 1152x2048（9:16）分别独立构图生成。
 * 参考图1 = 现行 hero（hero-autumn-desktop.webp），仅锚定暖奶油调性与光影质感，床品配色改为奶油燕麦。
 * 输出：public/images/staging/hero-sunday-desktop.jpg / hero-sunday-mobile.jpg
 * 用法: node scripts/seedream-hero-sunday-morning.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || require('fs').readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const REF_STYLE = path.join(ROOT, 'public', 'images', 'brand', 'hero-autumn-desktop.webp');
const SEED = 91827;

const common =
  // 产品/场景段
  '一间慵懒周末早晨的卧室：一张睡过一夜的双人床，奶油白与燕麦色系的床品——被子自然掀开一半、床单带着睡过的柔软褶皱、枕头有轻微凹陷、一只枕头微微歪斜，呈现"刚刚起床"的真实松弛感（不是精心铺好的床，但也绝不凌乱邋遢）；一条浅色华夫格针织毯随意搭在床尾，一角垂落。' +
  '床体为浅色原木床架，地面是浅橡木地板与米色长绒地毯。场景物品密度适中偏丰富、全部与松弛生活方式匹配：床头原木柜上一杯冒着微微热气的咖啡、一本翻开扣放的书、一盏亚麻灯罩的小台灯；床尾凳或藤编篮里随意搭着一条折叠的毛毯；床边的地毯上放着一双软底拖鞋；床头墙上挂两幅小幅原木框抽象画；窗边一盆琴叶榕。所有道具克制有序、不堆砌不抢戏。' +
  // 光线氛围段
  '清晨柔和的漫射自然光透过白纱帘洒入，暖色调温润奶油感，通透明亮；特别注意：墙面干净，没有大面积窗帘或植物的投影，光影只以柔和的窗光渐变呈现；整体影调与参考图1的暖奶油质感一致（参考图1仅用于锚定影调与光影氛围，床品配色以本提示词的奶油燕麦为准，不要参考图1的鼠尾草绿）。' +
  // 画质段
  '专业家居生活摄影，8K 超高清，超写实真实物理材质，棉布褶皱、针织纹理、木纹细节清晰；ins 生活方式博主实拍感，低饱和暖奶油调，松弛、舒适、治愈。' +
  // 负向段
  '无人物、无文字、无水印、无 logo、无图标按钮界面元素；规避凌乱脏感（松弛≠杂乱）、高饱和色彩、冷色调、塑料 CGI 质感、平涂死黑阴影、墙面大面积投影、扭曲透视。';

const desktopPrompt =
  '横幅 16:9 宽幅构图：床体位于画面中右部，床头床尾完整入镜不切边；画面左侧约三分之一是干净、低细节的米白墙面与柔和窗光区域（纯粹的墙面，没有大面积窗帘投影、没有明显物体轮廓的影子），供后期排版留白。' + common;

const mobilePrompt =
  '竖幅 9:16 竖版构图（独立重新构图，不是横版裁切）：取景紧凑，镜头离床更近——床体占画面约 85%，从床头上方一点点墙延伸到床尾毯子垂坠处，床头顶部只留少量墙面，左右两侧都带到床头柜、台灯、咖啡杯等场景物件；视觉重心落在蓬松的被褥与枕头上，画面丰满温暖，没有大面积空白。' + common;

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function gen(prompt, size, dest, seed) {
  console.log(`调用 seedream 5.0 pro: ${path.basename(dest)}（${size}）`);
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      seed,
      prompt,
      image: [await dataUri(REF_STYLE)],
      response_format: 'url',
      size,
      stream: false,
      watermark: false,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(JSON.stringify(data).slice(0, 500));
  const imgUrl = data.data?.[0]?.url;
  if (!imgUrl) throw new Error('无结果图: ' + JSON.stringify(data).slice(0, 500));
  const imgRes = await fetch(imgUrl);
  if (!imgRes.ok) throw new Error(`结果图下载失败: HTTP ${imgRes.status}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 ${dest} (${buf.length} bytes), size=${data.data[0].size}, seed=${seed}, tokens=${data.usage?.total_tokens}`);
}

(async () => {
  // v2 桌面已修文字瑕疵；v3 用户反馈：桌面左侧纱帘投影太大、移动端太空白——
  // 增加场景物品密度（台灯/床尾凳/拖鞋/挂画）、墙面禁大面积投影、移动端取景更紧凑
  await gen(desktopPrompt, '2048x1152', path.join(OUT, 'hero-sunday-desktop-v3.jpg'), SEED + 10);
  await gen(mobilePrompt, '1152x2048', path.join(OUT, 'hero-sunday-mobile-v2.jpg'), SEED + 11);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
