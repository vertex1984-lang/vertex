/**
 * seeany-boucle-lifestyle.js — Bouclé 泰迪绒抱枕套种草图
 * 2026-10-13 按 docs/lifestyle-image-rules.md 六段式种草图指令标准重生成（Pinterest/INS 引流级）。
 * 参考图 = Bouclé 抱枕套灰底主图（线上 URL，img2img 锁布料质感）：
 *   奶白 MK-PC-BOUCLE-WHITE-45（奶油风客厅）/ 燕麦 MK-PC-BOUCLE-OATMEAL-45（原木风卧室）
 * 用法: node scripts/seeany-boucle-lifestyle.js [job名]   （不传则全跑）
 * 输出: public/images/pdp-lifestyle/{job}.webp（Pinterest 竖图 2:3，2K → 1200×1800 webp q82；API 不支持 2:3 时回退 4:3 → 1600×1200）
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

// 六段式：1产品锚定 2场景构建 3光线氛围 4镜头画质 5品牌调性 6负向规避
const LIGHT = '光线氛围：温暖金色时刻自然日光透过木百叶与白纱帘漫射入室，地面与家具上形成柔和斑驳的百叶光影，柔和漫射渐变阴影，窗边日光自带温润光晕，自然光线衰减，整体暖色温';
const LENS = '镜头画质：专业室内家居摄影，8K超高清，浅景深电影镜头效果（焦点锁定抱枕，前景茶几与背景绿植自然虚化），画面带细微复古胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质';
const BRAND = '品牌调性：整体暖色温奶油色调，米色#F8F5F0 + 暖棕#8B5A2B品牌调性，低饱和ins风';
// 社媒种草图变体（2026-10-13 用户定）：不绑网站色系，ins博主实拍感、自然真实色彩
const NATURAL = '色彩风格：ins生活方式博主实拍感，自然真实色彩还原，白平衡准确，清爽通透不发闷，色彩饱和自然不刻意暖调，像真实博主家里的随手拍大片';
const NEG = '负向规避：零改动抱枕的颜色与布料质感，规避塑料CGI质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视、任何文字水印logo';

const JOBS = [
  {
    name: 'pillow-boucle-sofa',
    refs: [
      'https://www.makimoohome.com/images/products/MK-PC-BOUCLE-WHITE-45/1.webp',
      'https://www.makimoohome.com/images/products/MK-PC-BOUCLE-SAGE-45/1.webp',
    ],
    prompt: [
      '产品锚定：以两张参考图中的抱枕为绝对主角（参考图1=奶白色 warm ivory，参考图2=鼠尾草绿 sage green），精准锁定其布料——泰迪绒/卷圈绒（bouclé）颗粒感卷毛肌理、蓬松柔软、哑光雾面质感，两个抱枕颜色分别与参考图1:1对应不变，抱枕造型与尺寸比例原样复刻，布面零织标零印花',
      '场景构建（ins奶油风客厅，中世纪复古混搭）：奶油白棉麻布艺沙发居中，一个奶白色与一个鼠尾草绿泰迪绒抱枕一正一斜自然倚放、前后错开为视觉焦点（混色搭配、低饱和撞色），沙发扶手垂落一条燕麦色粗棒针流苏毛毯；前方天然洞石异形茶几带石材天然孔隙纹理，上置粗陶拿铁杯（带拉花）、一本翻开的家居杂志、小支香薰蜡烛与原木托盘；沙发旁原木边几带实木年轮纹理，上放粗陶罐插吊钟绿植；地面铺几何编织长毛羊毛地毯，背景黄铜杆落地灯散暖光，哑光米色乳胶漆墙面挂一幅暖调抽象小画，角落大型琴叶榕叶片带自然脉络绒面质感；前景中景远景层次分明，画面有呼吸感留白，松弛lived-in不刻意摆拍',
      LIGHT, LENS, BRAND, NEG,
    ].join('。'),
  },
  {
    name: 'pillow-boucle-bed',
    refs: [
      'https://www.makimoohome.com/images/products/MK-PC-BOUCLE-OATMEAL-45/1.webp',
      'https://www.makimoohome.com/images/products/MK-PC-BOUCLE-DUSTYROSE-45/1.webp',
    ],
    prompt: [
      '产品锚定：以两张参考图中的抱枕为绝对主角（参考图1=燕麦色 oatmeal beige，参考图2=灰粉色 dusty rose），精准锁定其布料——泰迪绒/卷圈绒（bouclé）颗粒感卷毛肌理、蓬松柔软、哑光雾面质感，两个抱枕颜色分别与参考图1:1对应不变，抱枕造型与尺寸比例原样复刻，布面零织标零印花',
      '场景构建（ins原木风卧室晨光）：原木床头板带自然深浅木纹肌理，米白亚麻四件套带自然褶皱，一个燕麦色与一个灰粉色泰迪绒抱枕随意斜靠、一前一后错开为视觉焦点（混色搭配、低饱和撞色），被角自然掀起露出奶白华夫格盖毯，床尾搭一条焦糖色针织毯；一侧原木床头柜上放粗陶花瓶插干花芦苇、一杯温水、两本叠放的布面旧书；另一侧藤编吊灯垂下暖光，窗台陶盆绿植，地面黄麻编织圆毯，哑光米色墙面挂一幅细框线描小画，白纱帘透进晨光；前景中景远景层次分明，画面安静柔和有呼吸感，松弛lived-in不刻意摆拍',
      LIGHT, LENS, BRAND, NEG,
    ].join('。'),
  },
  {
    name: 'pillow-boucle-wide',
    refs: [
      'https://www.makimoohome.com/images/products/MK-PC-BOUCLE-OATMEAL-45/1.webp',
      'https://www.makimoohome.com/images/products/MK-PC-BOUCLE-DUSTYROSE-45/1.webp',
    ],
    prompt: [
      '产品锚定：以两张参考图中的抱枕为准（参考图1=燕麦色 oatmeal beige，参考图2=灰粉色 dusty rose），精准锁定其布料——泰迪绒/卷圈绒（bouclé）颗粒感卷毛肌理、蓬松柔软、哑光雾面质感，两个抱枕颜色分别与参考图1:1对应不变，抱枕造型与尺寸比例原样复刻，布面零织标零印花',
      '场景构建（ins博主家卧室全景远景视角，傍晚温暖氛围）：镜头拉远呈现整个卧室全景——原木大床位于画面中景，白色亚麻床品带自然褶皱，床头靠着一个燕麦色与一个灰粉色泰迪绒抱枕一正一斜（混色搭配、低饱和撞色），床尾搭一条粗棒针流苏毯；床头两侧原木床头柜上各有一盏点亮的暖光台灯、粗陶小花瓶插干花、叠放的布面书；床尾一张原木长凳上搭着针织毯；画面一侧白纱帘透进傍晚余晖，窗边大型绿植，天花板藤编吊灯散发暖光，地面几何编织羊毛地毯，角落原木边几上香薰蜡烛点燃；整个空间层次丰富、远景构图展现完整卧室场景，温暖包裹感强，松弛lived-in不刻意摆拍',
      '光线氛围：傍晚柔和余晖透窗漫射入室，与台灯、吊灯、蜡烛的多重暖光交融，床面与墙面形成柔和斑驳光影，光线自然衰减，整个房间笼罩在温暖柔和的光晕里，温馨治愈',
      '镜头画质：专业室内家居摄影，8K超高清，浅景深电影镜头效果（焦点锁定床与抱枕，前景与背景自然虚化），画面带细微胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质',
      NATURAL, NEG,
    ].join('。'),
  },
  {
    name: 'pillow-boucle-nook',
    refs: [
      'https://www.makimoohome.com/images/products/MK-PC-BOUCLE-WHITE-45/1.webp',
      'https://www.makimoohome.com/images/products/MK-PC-BOUCLE-DUSTYROSE-45/1.webp',
    ],
    prompt: [
      '产品锚定：以两张参考图中的抱枕为准（参考图1=奶白色 warm ivory，参考图2=灰粉色 dusty rose），精准锁定其布料——泰迪绒/卷圈绒（bouclé）颗粒感卷毛肌理、蓬松柔软、哑光雾面质感，两个抱枕颜色分别与参考图1:1对应不变，抱枕造型与尺寸比例原样复刻，布面零织标零印花',
      '场景构建（ins风窗边阅读角，上午自然光）：靠窗的原木飘窗长台上铺米白棉麻坐垫，一个奶白色与一个灰粉色泰迪绒抱枕随意靠着窗户一左一右（混色搭配、低饱和撞色），旁边搭一条燕麦色针织毯；飘窗上放着一杯冒着热气的红茶、一本摊开扣放的书、一副金丝眼镜；旁边原木小边几上粗陶小花瓶插一枝尤加利；白纱帘半掩，窗外虚化的绿色树影；地面剑麻编织地毯，角落藤编收纳篮里露出毛毯一角；画面安静有呼吸感，松弛lived-in不刻意摆拍',
      '光线氛围：上午柔和的自然日光透过白纱帘漫射进来，在坐垫与抱枕上形成细腻光影渐变，光线自然衰减，通透明亮',
      '镜头画质：专业室内家居摄影，8K超高清，浅景深电影镜头效果（焦点锁定抱枕，前景与窗外景色自然虚化），画面带细微胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质',
      NATURAL, NEG,
    ].join('。'),
  },
  {
    name: 'pillow-boucle-bench',
    refs: [
      'https://www.makimoohome.com/images/products/MK-PC-BOUCLE-OATMEAL-45/1.webp',
      'https://www.makimoohome.com/images/products/MK-PC-BOUCLE-SAGE-45/1.webp',
    ],
    prompt: [
      '产品锚定：以两张参考图中的抱枕为准（参考图1=燕麦色 oatmeal beige，参考图2=鼠尾草绿 sage green），精准锁定其布料——泰迪绒/卷圈绒（bouclé）颗粒感卷毛肌理、蓬松柔软、哑光雾面质感，两个抱枕颜色分别与参考图1:1对应不变，抱枕造型与尺寸比例原样复刻，布面零织标零印花',
      '场景构建（ins风玄关/床尾长凳场景，午后自然光）：一条原木长凳带自然木纹肌理靠墙摆放，一个燕麦色与一个鼠尾草绿泰迪绒抱枕随意放在长凳上一前一后错开（混色搭配、低饱和撞色），凳上搭着一条奶白华夫格毯；长凳下方放着编织篮和一双棉麻拖鞋，旁边地面剑麻地毯；白墙挂一顶草帽和一个帆布托特包，原木挂钩；旁边绿植（琴叶榕或橄榄树）叶片带自然脉络；画面简洁有层次，松弛lived-in不刻意摆拍',
      '光线氛围：午后柔和自然光从侧窗漫射入室，墙面与地面形成柔和光影渐变，光线自然衰减，明亮通透',
      '镜头画质：专业室内家居摄影，8K超高清，浅景深电影镜头效果（焦点锁定长凳上的抱枕，前景绿植与背景自然虚化），画面带细微胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质',
      NATURAL, NEG,
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
