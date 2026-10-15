/**
 * seeany-bedding-lifestyle.js — Bedding 种草图（2026-10-15）
 * 按 docs/lifestyle-image-rules.md 六段式种草图指令标准生成：
 *   1) bedding-brushed-modern    — Brushed Cotton（Washed Cotton-Like）现代风格卧室，
 *      替换 PDP 双图区 bedding-brushed-sunlit.webp（缎面质感不符，用户定）→ 站内图品牌调性
 *   2) bedding-linen-farmhouse   — 100% Linen 燕麦色，farmhouse 乡村风 → 社媒种草调性
 *   3) bedding-linenlike-farmhouse — Linen-Like 紫粉印花蕾丝边（shabby chic），farmhouse → 社媒种草调性
 * 参考图 = 对应产品灰底主图线上 URL（img2img 锁布料质感与颜色 1:1）。
 * 用法: node scripts/seeany-bedding-lifestyle.js [job名]   （不传则全跑）
 * 输出: public/images/pdp-lifestyle/{job}.webp（2:3 → 1200×1800 webp q82；API 不支持时回退 4:3）
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const KEY = (() => {
  const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
  return (env.match(/^SEEANY_API_KEY=(.+)$/m) || [])[1]?.trim();
})();
if (!KEY) { console.error('缺少 SEEANY_API_KEY'); process.exit(1); }

const API = 'https://api.seeany.com/api/ai/smarttask';
const OUT = path.join(__dirname, '..', 'public', 'images', 'pdp-lifestyle');
fs.mkdirSync(OUT, { recursive: true });

// 六段式共享段：3光线 4镜头 5调性 6负向
const LIGHT = '光线氛围：温暖金色时刻自然日光透过白纱帘与木百叶漫射入室，床面与地面形成柔和斑驳光影，柔和漫射渐变阴影，窗边日光自带温润光晕，自然光线衰减，暖色温';
const LIGHT_MORNING = '光线氛围：清晨柔和自然日光透过亚麻窗帘漫射入室，床面与木地板上形成细腻光影渐变，柔和漫射阴影，光线自然衰减，明亮通透带温润光晕';
const LENS = '镜头画质：专业室内家居摄影，8K超高清，浅景深电影镜头效果（焦点锁定床品，前景与背景自然虚化），画面带细微复古胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质';
const BRAND = '品牌调性：整体暖色温奶油色调，米色#F8F5F0 + 暖棕#8B5A2B品牌调性，低饱和ins风';
const NATURAL = '色彩风格：ins生活方式博主实拍感，自然真实色彩还原，白平衡准确，清爽通透不发闷，色彩饱和自然不刻意暖调，像真实博主家里的随手拍大片';
const NEG = '负向规避：零改动床品的颜色印花与布料质感，规避塑料CGI质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视、任何文字水印logo';

const JOBS = [
  {
    name: 'bedding-brushed-beige',
    refs: ['https://www.makimoohome.com/images/products/DUVSET-BEIGE-QUEEN/1.webp'],
    prompt: [
      '产品锚定：以参考图中的被套三件套为绝对主角（米色 warm beige 纯色），精准锁定其布料——磨毛棉（brushed cotton）哑光雾面、细腻绒感、带自然柔和褶皱，颜色与参考图1:1对应不变，被套与两个枕套造型尺寸比例原样复刻，布面零织标零印花',
      '场景构建（现代简约风格卧室，ins博主家，清晨）：浅灰布艺软包床居中，床上铺米色磨毛棉被套三件套，被面自然蓬松褶皱、一角随意掀起为视觉焦点；床尾搭一条奶白粗棒针流苏毯；一侧原木床头柜带实木纹理，上置粗陶咖啡杯碟（拿铁带拉花）、一本翻开的家居杂志、黄铜小托盘插香薰蜡烛；另一侧黑色细杆落地灯，旁边白瓷花瓶插一枝吊钟绿植；地面铺米灰几何编织短毛地毯，哑光浅灰乳胶漆墙面挂一幅细框暖调抽象线条画，角落大型琴叶榕叶片带自然脉络绒面质感，窗边白纱帘半掩；前景中景远景层次分明，画面有呼吸感留白，松弛lived-in不刻意摆拍',
      LIGHT, LENS, BRAND, NEG,
    ].join('。'),
  },
  {
    name: 'bedding-brushed-gray',
    refs: ['https://www.makimoohome.com/images/products/DUVSET-GRAY-QUEEN/1.webp'],
    prompt: [
      '产品锚定：以参考图中的被套三件套为绝对主角（中性灰色 soft gray 纯色），精准锁定其布料——磨毛棉（brushed cotton）哑光雾面、细腻绒感、带自然柔和褶皱，颜色与参考图1:1对应不变，被套与两个枕套造型尺寸比例原样复刻，布面零织标零印花',
      '场景构建（现代风格卧室，ins博主家，傍晚华灯初上）：深胡桃木矮床架居中，床上铺灰色磨毛棉被套三件套，被面自然褶皱、床尾一角垂落为视觉焦点；床尾搭一条燕麦色羊毛流苏毯；一侧黑色金属边几上放一杯冒着热气的红茶、一本摊开扣放的书、一副金丝眼镜与小型香薰蜡烛点燃；另一侧纸罩落地灯散暖光，粗陶罐插干花芦苇；地面铺深灰几何编织长毛地毯，哑光水泥灰墙面挂一幅黑白摄影细框画，角落橄榄树盆栽叶片带自然脉络，落地窗外虚化的城市黄昏灯光；前景中景远景层次分明，画面安静有呼吸感，松弛lived-in不刻意摆拍',
      '光线氛围：傍晚柔和余晖透窗漫射入室，与落地灯、蜡烛的多重暖光交融，床面与墙面形成柔和斑驳光影，光线自然衰减，整个房间笼罩在温暖柔和的光晕里，温馨治愈',
      LENS, BRAND, NEG,
    ].join('。'),
  },
  {
    name: 'bedding-brushed-modern',
    refs: ['https://www.makimoohome.com/images/products/1688-916370884976-C5/1.webp'],
    prompt: [
      '产品锚定：以参考图中的床上三件套为绝对主角（浅蓝与芝士奶油双面双色 reversible two-tone，浅蓝色面朝上、被角翻折露出奶油色内面），精准锁定其布料——水洗磨毛棉（brushed cotton）哑光雾面、细腻绒感、带自然柔和褶皱，颜色与参考图1:1对应不变，被套枕套造型尺寸比例原样复刻，布面零织标零印花',
      '场景构建（现代简约风格卧室，ins博主家）：浅灰色布艺软包床居中，床上铺浅蓝与芝士奶油双面磨毛棉床品，被面自然蓬松褶皱、被角随意翻折为视觉焦点；床尾搭一条奶白粗棒针流苏毯；一侧原木床头柜带实木纹理，上置粗陶咖啡杯碟（拿铁带拉花）、一本翻开的家居杂志、黄铜小托盘插香薰蜡烛；另一侧黑色细杆落地灯散暖光，旁边白瓷花瓶插一枝吊钟绿植；地面铺米灰几何编织短毛地毯，哑光浅灰乳胶漆墙面挂一幅细框暖调抽象线条画，角落大型琴叶榕叶片带自然脉络绒面质感，窗边白纱帘半掩；前景中景远景层次分明，画面有呼吸感留白，松弛lived-in不刻意摆拍',
      LIGHT, LENS, BRAND, NEG,
    ].join('。'),
  },
  {
    name: 'bedding-linen-farmhouse',
    refs: ['https://www.makimoohome.com/images/products/LINEN3-OATMEAL-QUEEN/1.webp'],
    prompt: [
      '产品锚定：以参考图中的床上三件套为绝对主角（燕麦色 oatmeal beige），精准锁定其布料——100%天然亚麻，粗粝麻质纹理、天然褶皱肌理、哑光质朴手感、越洗越软的lived-in质感，颜色与参考图1:1对应不变，被套枕套造型尺寸比例原样复刻，布面零织标零印花',
      '场景构建（farmhouse美式乡村风卧室）：做旧白漆实木床架带磨损木纹肌理居中，床上铺燕麦色亚麻床品，被面自然大褶皱、一侧被角掀开露出奶白华夫格盖毯为视觉焦点；床尾搭一条焦糖色粗棒针流苏毯；床头上方原木横梁，白漆木板墙面带做旧质感；一侧做旧原木床头柜上放粗陶罐插干棉花枝与满天星、一杯热红茶冒热气、两本叠放布面旧书；另一侧复古黄铜壁灯散暖光；窗台粗陶盆种香草绿植，旁边藤编篮里露出针织毯一角；地面条纹黄麻编织地毯，墙上挂一顶草帽与复古木框植物标本画，木百叶窗透进晨光；前景中景远景层次分明，画面安静质朴有呼吸感，松弛lived-in不刻意摆拍',
      LIGHT_MORNING, LENS, NATURAL, NEG,
    ].join('。'),
  },
  {
    name: 'bedding-linenlike-farmhouse',
    refs: ['https://www.makimoohome.com/images/products/BEDSET4-MAUVE-QUEEN/1.webp'],
    prompt: [
      '产品锚定：以参考图中的床上四件套为绝对主角（紫粉色 purple pink 小碎花印花带白色蕾丝花边 shabby chic 款式），精准锁定其布料——仿亚麻质感面料，柔滑抗皱、带细腻微纹理与哑光垂坠感，印花图案与蕾丝花边细节原样保留，颜色与参考图1:1对应不变，被套枕套造型尺寸比例原样复刻，布面零织标',
      '场景构建（farmhouse乡村木屋卧室，法式田园混搭）：白色做旧铁艺床带复古弯花线条居中，床上铺紫粉小碎花蕾丝边床品，被面自然蓬松褶皱、一角随意翻起为视觉焦点；床头靠两个奶白钩针编织抱枕，床尾搭一条奶油色手工钩针毯；原木墙板带自然年轮纹理刷白做旧，一侧复古原木床头柜上放陶瓷小花瓶插野花花束、一盏点亮的花卉玻璃罩台灯、一本摊开的书与老花镜；窗台一排粗陶小盆种薰衣草与香草，旁边藤编野餐篮装满毛线团；地面做旧宽板木地板铺碎花边黄麻地毯，墙上挂 vintage 花卉版画与干花束挂饰，白蕾丝纱帘透进晨光；前景中景远景层次分明，画面浪漫质朴有呼吸感，松弛lived-in不刻意摆拍',
      LIGHT_MORNING, LENS, NATURAL, NEG,
    ].join('。'),
  },
];

async function createTask(job, ratio) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KEY}`,
      'User-Agent': 'seeany-api',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      aiTypeId: 113,
      aiType: 'smartImg',
      prompt: job.prompt,
      inputImgs: job.refs,
      imgNum: 1,
      imgRatio: ratio,
      mode: 'gpt-image-2.5-sunburst',
      size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`${job.name}: ${JSON.stringify(data)}`);
  return data.data.task_uuid;
}

async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 90; i++) {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api' },
    });
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
    await new Promise(r => setTimeout(r, 5000));
  }
  throw new Error('轮询超时');
}

(async () => {
  const only = process.argv.slice(2);
  let ratio = '2:3';
  let dims = { width: 1200, height: 1800 };
  let probed = false;
  for (const job of JOBS) {
    if (only.length && !only.includes(job.name)) continue;
    const dest = path.join(OUT, `${job.name}.webp`);
    console.log(`创建任务: ${job.name}（${ratio}）`);
    let uuid;
    try {
      uuid = await createTask(job, ratio);
    } catch (e) {
      const msg = String(e.message);
      // 仅在明确为比例不支持时回退 4:3，余额不足等错误直接抛出
      if (probed || ratio === '4:3' || !/ratio|比例|尺寸/i.test(msg)) throw e;
      console.log(`  2:3 不支持（${msg.slice(0, 120)}），回退 4:3`);
      ratio = '4:3';
      dims = { width: 1600, height: 1200 };
      probed = true;
      uuid = await createTask(job, ratio);
    }
    console.log(`  task_uuid=${uuid}, 等待生成...`);
    const imgUrl = await pollTask(uuid);
    let buf;
    for (let a = 0; a < 3; a++) {
      try {
        const res = await fetch(imgUrl);
        buf = Buffer.from(await res.arrayBuffer());
        break;
      } catch (e) {
        if (a === 2) throw e;
        console.log(`  下载失败，${(a + 1) * 5}s 后重试...`);
        await new Promise(r => setTimeout(r, (a + 1) * 5000));
      }
    }
    await sharp(buf).resize({ ...dims, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(dest);
    console.log(`  已保存 ${dest}`);
  }
  console.log('全部完成');
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
