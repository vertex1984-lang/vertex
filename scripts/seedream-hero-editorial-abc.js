/**
 * seedream-hero-editorial-abc.js — 首页 Hero 杂志大片级候选图 A/B/C 三方向（seedream 5.0 pro，2026-10-27）
 * 用户定：A 侘寂建筑感 loft / B 自然边界消融 / C 编辑室装置感；每方向生成桌面 2048x1152 + 移动 1152x2048。
 * 硬约束（三方向共用）：奶油暖调、无人物无文字、桌面版左侧留文案负空间、移动版中下部留文案区。
 * 不用参考图（纯文生图，最大化场景创作自由度）。
 * 输出：public/images/staging/hero-editorial-{a,b,c}-{desktop,mobile}.jpg
 * 用法: node scripts/seedream-hero-editorial-abc.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || require('fs').readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const SEED = 47302;

const QUALITY =
  '专业家居生活摄影，杂志大片级画质，8K 超高清，超写实真实物理材质，布料褶皱、亚麻纹理、木与石的肌理细节清晰；低饱和暖奶油调，光线是画面主角之一。' +
  '无人物、无文字、无水印、无 logo、无图标按钮界面元素；规避高饱和色彩、冷色调、塑料 CGI 质感、平涂死黑阴影、扭曲透视、凌乱脏感。';

const D_COMP = '横幅 16:9 宽幅构图：主体床位于画面中右部并完整入镜不切边；画面左侧约三分之一是干净、低细节的柔和负空间（纯净的墙面、地面或光影渐变，无杂物无浓重投影），供后期排版留白。';
const M_COMP = '竖幅 9:16 竖版构图（独立重新构图，不是横版裁切）：取景紧凑，床体占画面约 80%-85%，中下部为床品或地面等低细节区域供后期排版，视觉重心落在床与光影上，画面丰满无大面积空白。';

const SCENES = {
  a: 'A方向·侘寂建筑感 loft：一张床置于开阔的挑高微水泥 loft 空间，是场景中唯一主角——整面弧形微水泥暖灰米色墙、一个拱形门洞引入纵深，床品为奶油白亚麻蓬松微乱、床尾搭燕麦色毛毯。清晨光从高处侧窗斜射入，在微水泥墙面形成克制的柔和条状光影。地面是暖灰微水泥，床下一块手工编织米色地毯。氛围安静、雕塑感、像 Kinfolk 杂志封面；低机位平视，纵深构图。',
  b: 'B方向·自然边界消融：一张床放在一整面落地玻璃前，窗外是清晨薄雾中的朦胧山野（虚化成灰绿米色渐变），室内外边界模糊。奶白色亚麻床品半透光、被晨光照得微微发亮，被子掀开一半、枕头微微凹陷。老橡木地板，床边一盏纸罩落地灯。氛围避世、有呼吸感、像 Cereal 杂志大片；晨雾柔光是整幅图的主角。',
  c: 'C方向·编辑室装置感：影棚级布景——床像艺术装置一样置于单色暖灰褐（greige）无缝背景前，无窗无墙线，只有一束大型柔光箱般的顶侧光。床品是奶白+驼色多层叠搭（蓬松羽绒被、针织毯、亚麻枕），褶皱被光雕出丰富明暗。旁边一把设计师藤编木单椅上随意搭着一件亚麻衣物。氛围克制高级、像 The Row 或 Jil Sander 的时尚大片。',
};

async function gen(prompt, size, dest, seed) {
  console.log(`调用 seedream 5.0 pro: ${path.basename(dest)}（${size}）`);
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      seed,
      prompt,
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
  console.log(`  已保存 (${buf.length} bytes), size=${data.data[0].size}, seed=${seed}`);
}

(async () => {
  let s = SEED;
  for (const k of ['a', 'b', 'c']) {
    await gen(D_COMP + SCENES[k] + QUALITY, '2048x1152', path.join(OUT, `hero-editorial-${k}-desktop.jpg`), s++);
    await gen(M_COMP + SCENES[k] + QUALITY, '1152x2048', path.join(OUT, `hero-editorial-${k}-mobile.jpg`), s++);
  }
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
