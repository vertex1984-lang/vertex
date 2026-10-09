/**
 * seeany-cushion-family-mains.js — cushions 页三组家族卡棚拍主图（2026-10-09）
 * 标准对齐 B0CBT7B1TY / B0CXDZF2WQ 主图：浅灰纯色棚拍背景、柔和棚拍光、底部浅阴影、
 * 无文字无 logo、**画面只有一只坐垫**（使用形态 L 形站立，3/4 侧面视角）；1:1，2K → 1200×1200。
 * 用法: node scripts/seeany-cushion-family-mains.js
 * 输出: public/images/staging/<ASIN>/main.webp
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

const COMMON =
  '**不要任何织标/标签/logo/水印文字**，布面完全纯净。浅灰色纯色摄影棚背景（light gray seamless studio background），' +
  '柔和均匀的棚拍光线，底部自然柔和的浅阴影，写实摄影，画面干净高级。' +
  '构图：**只展示一只椅垫**（画面中仅此一只，不要叠放、不要多只、不要椅子），使用形态：**靠背向后微仰约105度（不要垂直挺立），坐垫水平向右前方延伸、显得修长**，' +
  '整体呈舒展低矮的 L 形；相机从右前方略高处拍摄（四分之三侧面视角 + 轻微俯视），能看到坐垫的前边缘厚度与右侧面；' +
  '整体居中构图，占画面约 80%，四周留白均匀，绑带自然下垂不外扬。';

const SQUARE_COMMON =
  '**画面中只允许出现一只坐垫（a single cushion only）**，绝对不要第二只、不要叠放、不要并排；' +
  '**不要任何织标/标签/logo/水印文字**，布面完全纯净。浅灰色纯色摄影棚背景（light gray seamless studio background），' +
  '柔和均匀的棚拍光线，底部自然柔和的浅阴影，写实摄影，画面干净高级。' +
  '构图：单只方形坐垫平放，四分之三俯视角度（能看到坐垫厚度与前边缘），整体居中构图，占画面约 80%，四周留白均匀。';

const JOBS = [
  {
    asin: 'B0CBT7R7NN',
    ref: 'https://www.makimoohome.com/images/products/B0CBT7R7NN/1.webp',
    prompt:
      '以参考图中的椅垫为准：浅暖灰色灯芯绒（warm light grey corduroy）面料、细条纹绒面质感、簇绒（tufted）纽扣凹点、' +
      '靠背与坐垫一体成型呈 L 形、靠背顶部两角和坐垫两侧各有一条绑带，保持完全一致的面料质感、颜色、工艺与版型。' + COMMON,
  },
  {
    asin: 'B0CBT7RFK2',
    ref: 'https://www.makimoohome.com/images/products/B0CBT7RFK2/3.webp',
    prompt:
      '以参考图中的椅垫为准：咖啡棕色灯芯绒（coffee brown corduroy）面料、细条纹绒面质感、簇绒（tufted）纽扣凹点、' +
      '靠背与坐垫一体成型呈 L 形、靠背顶部两角和坐垫两侧各有一条绑带，保持完全一致的面料质感、颜色、工艺与版型。' + COMMON,
  },
  {
    asin: 'B0C39ZSD3Q',
    ref: 'https://www.makimoohome.com/images/products/B0C39ZSD3Q/2.webp',
    prompt:
      '以参考图中的椅垫为准：卡其米色底佩斯利花纹印花（khaki/beige ground paisley floral print，红蓝绿配色）面料、平滑户外布面质感、' +
      '靠背与坐垫一体成型呈 L 形、无簇绒、四角各有一条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + COMMON,
  },
  {
    asin: 'B0C33LZ5PW',
    ref: 'https://www.makimoohome.com/images/products/B0C33LZ5PW/3.webp',
    prompt:
      '以参考图中的椅垫为准：橙红棕竖条纹印花（orange/red/brown vertical stripes）面料、平滑户外布面质感、' +
      '靠背与坐垫一体成型呈 L 形、边缘有滚边（piped edge）、四角各有一条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + COMMON,
  },
  {
    asin: 'B0C33M24L3',
    ref: 'https://www.makimoohome.com/images/products/B0C33M24L3/2.webp',
    prompt:
      '以参考图中的椅垫为准：青蓝色底佩斯利花纹印花（teal blue ground paisley print，米白/红/棕配色）面料、平滑户外布面质感、' +
      '靠背与坐垫一体成型呈 L 形、边缘有滚边（piped edge）、四角各有一条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + COMMON,
  },
  {
    asin: 'B0BBZSGDBQ',
    ref: 'https://www.makimoohome.com/images/products/B0BBZSGDBQ/1.webp',
    prompt:
      '以参考图中的椅垫为准：米白底大丽花花卉印花（cream ground dahlia floral print，红/橙/绿配色）面料、平滑户外布面质感、' +
      '靠背与坐垫一体成型呈 L 形、边缘有滚边（piped edge）、四角各有一条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + COMMON,
  },
  {
    asin: 'B0C3B265XJ',
    ref: 'https://www.makimoohome.com/images/products/B0C3B265XJ/4.webp',
    prompt:
      '以参考图中的椅垫为准：水彩花卉印花（watercolor floral print，粉/紫/青绿配色）面料、平滑户外布面质感、' +
      '靠背与坐垫一体成型呈 L 形、边缘有滚边（piped edge）、四角各有一条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + COMMON,
  },
  {
    asin: 'B0BCJQYYL1',
    ref: 'https://www.makimoohome.com/images/products/B0BCJQYYL1/1.webp',
    prompt:
      '以参考图中的椅垫为准：卡其米色底花鸟印花（khaki/cream ground with birds and floral print）面料、平滑户外布面质感、' +
      '靠背与坐垫一体成型呈 L 形、边缘有滚边（piped edge）、靠背顶部两角和坐垫两侧各有一条绑带，' +
      '保持完全一致的面料质感、印花图案、配色与版型。' + COMMON,
  },
  {
    asin: 'B0CC5WN6JJ',
    ref: 'https://www.makimoohome.com/images/products/B0CC5WN6JJ/3.webp',
    prompt:
      '以参考图中的椅垫为准：白底黑色丛林猎豹印花（black-and-white jungle leopard toile print）面料、平滑户外布面质感、' +
      '靠背与坐垫一体成型呈 L 形、靠背顶部两角和坐垫两侧各有一条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + COMMON,
  },
  {
    asin: 'B0C33LXRVK',
    ref: 'https://www.makimoohome.com/images/products/B0C33LXRVK/2.webp',
    prompt:
      '以参考图中的椅垫为准：米白底佩斯利花卉印花（cream ground paisley floral print，红/蓝/橄榄绿配色）面料、平滑户外布面质感、' +
      '靠背与坐垫一体成型呈 L 形、无簇绒、四角各有一条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + COMMON,
  },
  {
    asin: 'B0C33LPY5G',
    ref: 'https://www.makimoohome.com/images/products/B0C33LPY5G/2.webp',
    prompt:
      '以参考图中的椅垫为准：米色底红蓝花卉印花（beige ground floral print，朱红花朵配藏青与青绿叶片）面料、平滑户外布面质感、' +
      '靠背与坐垫一体成型呈 L 形、无簇绒、四角各有一条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + COMMON,
  },
  {
    asin: 'B0C4B9T6JV',
    ref: 'https://www.makimoohome.com/images/products/B0C4B9T6JV/3.webp',
    prompt:
      '以参考图中的椅垫为准：绿色系编织纹印花（green woven basketweave stripe print，翠绿/黄绿/米色交织）面料、平滑户外布面质感、簇绒（tufted）凹点、' +
      '**方形扁平坐垫（无靠背）**、一侧有两条绑带，保持完全一致的面料质感、印花图案、配色与版型。' +
      '**画面中只允许出现一只坐垫（a single cushion only）**，绝对不要第二只、不要叠放、不要并排；' +
      '**不要任何织标/标签/logo/水印文字**，布面完全纯净。浅灰色纯色摄影棚背景（light gray seamless studio background），' +
      '柔和均匀的棚拍光线，底部自然柔和的浅阴影，写实摄影，画面干净高级。' +
      '构图：单只方形坐垫平放，四分之三俯视角度（能看到坐垫厚度与前边缘），整体居中构图，占画面约 80%，四周留白均匀。',
  },
  {
    asin: 'B0CW19GMPQ',
    ref: 'https://www.makimoohome.com/images/products/B0CW19GMPQ/1.webp',
    prompt:
      '以参考图中的椅垫为准：藏青白千鸟格印花（navy blue and white houndstooth print）面料、平滑布面质感、簇绒（tufted）纽扣凹点、' +
      '靠背与坐垫一体成型呈 L 形、靠背顶部两角和坐垫两侧各有一条绑带（绑带末端蝴蝶结自然下垂），保持完全一致的面料质感、印花图案、配色与版型。' + COMMON,
  },
  {
    asin: 'B0C4BC7Q4S',
    ref: 'https://www.makimoohome.com/images/products/B0C4BC7Q4S/4.webp',
    prompt:
      '以参考图中的坐垫为准：米白底佩斯利花卉印花（cream ground paisley floral print，红/橄榄绿/蓝配色）面料、平滑布面质感、簇绒（tufted）凹点、' +
      '**方形扁平坐垫（无靠背，画面只有一只）**、一侧有两条绑带，保持完全一致的面料质感、印花图案、配色与版型。' +
      '**不要任何织标/标签/logo/水印文字**，布面完全纯净。浅灰色纯色摄影棚背景（light gray seamless studio background），' +
      '柔和均匀的棚拍光线，底部自然柔和的浅阴影，写实摄影，画面干净高级。' +
      '构图参考原图：单只方形坐垫平放，四分之三俯视角度，整体居中构图，占画面约 80%，四周留白均匀。',
  },
  {
    asin: 'B0C4BCD4DY',
    ref: 'https://www.makimoohome.com/images/products/B0C4BCD4DY/1.webp',
    prompt:
      '以参考图中的坐垫为准：水彩花卉印花（watercolor floral print，玫粉/翠绿/蓝配色）面料、平滑布面质感、簇绒（tufted）凹点、' +
      '方形扁平坐垫（无靠背）、一侧有两条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + SQUARE_COMMON,
  },
  {
    asin: 'B0C4BBVS53',
    ref: 'https://www.makimoohome.com/images/products/B0C4BBVS53/1.webp',
    prompt:
      '以参考图中的坐垫为准：青蓝绿色底佩斯利印花（turquoise teal ground paisley print，红/米白点缀）面料、平滑布面质感、簇绒（tufted）凹点、' +
      '方形扁平坐垫（无靠背）、一侧有两条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + SQUARE_COMMON,
  },
  {
    asin: 'B0C4BDLLFK',
    ref: 'https://www.makimoohome.com/images/products/B0C4BDLLFK/1.webp',
    prompt:
      '以参考图中的坐垫为准：橙红棕米白竖条纹印花（orange red brown cream vertical stripes）面料、平滑布面质感、簇绒（tufted）凹点、' +
      '方形扁平坐垫（无靠背）、一侧有两条绑带（橙色绑带），保持完全一致的面料质感、印花图案、配色与版型。' + SQUARE_COMMON,
  },
  {
    asin: 'B0CJHX7XKL',
    ref: 'https://www.makimoohome.com/images/products/B0CJHX7XKL/1.webp',
    prompt:
      '以参考图中的坐垫为准：藏青白千鸟格印花（navy blue and white houndstooth print）面料、平滑布面质感、簇绒（tufted）凹点、' +
      '方形扁平坐垫（无靠背）、一侧有两条绑带（末端蝴蝶结），保持完全一致的面料质感、印花图案、配色与版型。' + SQUARE_COMMON,
  },
  {
    asin: 'B0GD84D8VC',
    ref: 'https://www.makimoohome.com/images/products/B0GD84D8VC/1.webp',
    prompt:
      '以参考图中的坐垫为准：翠绿底白色佩斯利曼陀罗印花（emerald green ground white paisley mandala print）面料、平滑布面质感、簇绒（tufted）凹点、' +
      '方形扁平坐垫（无靠背）、一侧有两条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + SQUARE_COMMON,
  },
  {
    asin: 'B0GD81WT1B',
    ref: 'https://www.makimoohome.com/images/products/B0GD81WT1B/1.webp',
    prompt:
      '以参考图中的坐垫为准：青绿色底花卉印花（turquoise ground floral print，橙/黄/绿花朵）面料、平滑布面质感、簇绒（tufted）凹点、' +
      '方形扁平坐垫（无靠背）、一侧有两条绑带（末端蝴蝶结），保持完全一致的面料质感、印花图案、配色与版型。' + SQUARE_COMMON,
  },
  {
    asin: 'B0GD93XKHR',
    ref: 'https://www.makimoohome.com/images/products/B0GD93XKHR/1.webp',
    prompt:
      '以参考图中的坐垫为准：彩色曼陀罗花卉印花（multicolor mandala floral print，红/橙/蓝/绿/黄多彩配色）面料、平滑布面质感、簇绒（tufted）凹点、' +
      '方形扁平坐垫（无靠背）、一侧有两条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + SQUARE_COMMON,
  },
  {
    asin: 'B0CJ8TJL56',
    ref: 'https://cdn.shopify.com/s/files/1/0995/3843/6394/files/3_b3757b7d-5879-4645-899d-5a84b0be4a8b.jpg?v=1777856746&width=2048',
    prompt:
      '以参考图中的坐垫为准：墨绿米色千鸟格印花（dark green and beige houndstooth print）面料、平滑布面质感、簇绒（tufted）凹点、' +
      '方形扁平坐垫（无靠背）、一侧有两条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + SQUARE_COMMON,
  },
  {
    asin: 'B0CJHSLCZ5',
    ref: 'https://cdn.shopify.com/s/files/1/0995/3843/6394/files/3_2104373d-ff1a-450d-bb3c-bc0456b727c6.jpg?v=1777856899&width=2048',
    prompt:
      '以参考图中的坐垫为准：红色米色千鸟格印花（red and beige houndstooth print）面料、平滑布面质感、簇绒（tufted）凹点、' +
      '方形扁平坐垫（无靠背）、一侧有两条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + SQUARE_COMMON,
  },
  {
    asin: 'B0CJHL4LZP',
    ref: 'https://www.makimoohome.com/images/products/B0CJHL4LZP/5.webp',
    prompt:
      '以参考图中的坐垫为准：油画风花卉印花（oil painting floral print，灰绿底色配黄/橙/紫/红色花卉，印象派笔触）面料、平滑布面质感、簇绒（tufted）凹点、' +
      '方形扁平坐垫（无靠背）、一侧有两条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + SQUARE_COMMON,
  },
  {
    asin: 'B0BCJV24JR',
    ref: 'https://www.makimoohome.com/images/products/B0BCJV24JR/4.webp',
    prompt:
      '以参考图中的椅垫为准：青绿色底热带棕榈叶印花（teal ground tropical palm leaf print，绿/橙棕叶片）面料、平滑户外布面质感、无簇绒、' +
      '靠背与坐垫一体成型呈 L 形、四角各有一条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + COMMON,
  },
  {
    asin: 'B0F1XFWZVY',
    ref: 'https://www.makimoohome.com/images/products/B0F1XFWZVY/5.webp',
    prompt:
      '以参考图中的椅垫为准：深藏青色纯色（solid navy blue）面料、平滑细绒布面质感、簇绒（tufted）纽扣凹点、' +
      '靠背与坐垫一体成型呈 L 形、**靠背顶部为圆弧拱形（rounded arched top）**、靠背顶部两侧和坐垫两侧各有一条绑带（末端蝴蝶结），保持完全一致的面料质感、颜色、工艺与版型。' +
      '**这是高背款（high-back）：靠背长度必须明显大于坐垫深度（靠背约为坐垫深度的 1.3 倍），整体挺拔修长**.' + COMMON,
  },
  {
    asin: 'B0F1XMTYNC',
    ref: 'https://www.makimoohome.com/images/products/B0F1XMTYNC/5.webp',
    prompt:
      '以参考图中的椅垫为准：墨绿色纯色（solid dark forest green）面料、平滑细绒布面质感、簇绒（tufted）纽扣凹点、' +
      '靠背与坐垫一体成型呈 L 形、**靠背顶部为圆弧拱形（rounded arched top）**、靠背顶部两侧和坐垫两侧各有一条绑带（末端蝴蝶结），保持完全一致的面料质感、颜色、工艺与版型。' + COMMON,
  },
  {
    asin: 'B0F1XS27XS',
    ref: 'https://www.makimoohome.com/images/products/B0F1XS27XS/4.webp',
    prompt:
      '以参考图中的椅垫为准：酒红色纯色（solid burgundy wine red）面料、平滑细绒布面质感、簇绒（tufted）纽扣凹点、' +
      '靠背与坐垫一体成型呈 L 形、**靠背顶部为圆弧拱形（rounded arched top）**、靠背顶部两侧和坐垫两侧各有一条绑带（末端蝴蝶结），保持完全一致的面料质感、颜色、工艺与版型。' + COMMON,
  },
  {
    asin: 'B0F1XS7VKY',
    ref: 'https://www.makimoohome.com/images/products/B0F1XS7VKY/4.webp',
    prompt:
      '以参考图中的椅垫为准：巧克力棕色纯色（solid chocolate brown）面料、平滑细绒布面质感、簇绒（tufted）纽扣凹点、' +
      '靠背与坐垫一体成型呈 L 形、**靠背顶部为圆弧拱形（rounded arched top）**、靠背顶部两侧和坐垫两侧各有一条绑带（末端蝴蝶结），保持完全一致的面料质感、颜色、工艺与版型。' + COMMON,
  },
  {
    asin: 'B0CBT8FZWF',
    ref: 'https://www.makimoohome.com/images/products/B0CBT8FZWF/4.webp',
    prompt:
      '以参考图中的椅垫为准：焦糖棕黄色灯芯绒（caramel tan corduroy）面料、细条纹绒面质感、簇绒（tufted）纽扣凹点、' +
      '靠背与坐垫一体成型呈 L 形、靠背顶部两角和坐垫两侧各有一条绑带（末端蝴蝶结），保持完全一致的面料质感、颜色、工艺与版型。' + COMMON,
  },
  {
    asin: 'B0DSGCLBVW',
    ref: 'https://www.makimoohome.com/images/products/B0DSGCLBVW/4.webp',
    prompt:
      '以参考图中的椅垫为准：蓝绿水彩树叶印花（blue green watercolor leaves print，藏青/翠绿/薄荷配色）面料、平滑户外布面质感、' +
      '靠背与坐垫一体成型呈 L 形、靠背顶部两角和坐垫两侧各有一条绑带（末端蝴蝶结），保持完全一致的面料质感、印花图案、配色与版型。' + COMMON,
  },
  {
    asin: 'B0GJLRGVDJ',
    ref: 'https://www.makimoohome.com/images/products/B0GJLRGVDJ/4.webp',
    prompt:
      '以参考图中的椅垫为准：咖啡棕色纯色（solid coffee brown）面料、平滑细绒布面质感、簇绒（tufted）凹点、' +
      '靠背与坐垫一体成型呈 L 形、靠背顶部两角和坐垫两侧各有一条绑带，保持完全一致的面料质感、颜色、工艺与版型。' + COMMON,
  },
  {
    asin: 'B0F1V8VMP4',
    ref: 'https://www.makimoohome.com/images/products/B0F1V8VMP4/5.webp',
    prompt:
      '以参考图中的椅垫为准：深藏青色纯色（solid navy blue）面料、平滑细绒布面质感、簇绒（tufted）凹点、' +
      '靠背与坐垫一体成型呈 L 形、靠背顶部两角和坐垫两侧各有一条绑带，保持完全一致的面料质感、颜色、工艺与版型。' +
      '**注意：参考图左下角的小织标不要出现**.' + COMMON,
  },
  {
    asin: 'B0F1Y91HPR',
    ref: 'https://cdn.shopify.com/s/files/1/0995/3843/6394/files/2_fe9a11bb-8a40-44eb-98c1-972043f1097f.jpg?v=1777859589&width=2048',
    prompt:
      '以参考图中的坐垫为准：深墨绿色纯色（solid dark forest green）面料、平滑绒面质感、簇绒（tufted）放射状凹点缝线、' +
      '**圆形厚坐垫（round thick seat cushion，无靠背、无绑带）**，保持完全一致的面料质感、颜色、工艺与版型。' +
      '**画面中只允许出现一只坐垫（a single cushion only）**，绝对不要第二只、不要叠放、不要并排；' +
      '**不要任何织标/标签/logo/水印文字**，布面完全纯净。浅灰色纯色摄影棚背景（light gray seamless studio background），' +
      '柔和均匀的棚拍光线，底部自然柔和的浅阴影，写实摄影，画面干净高级。' +
      '构图：单只圆形坐垫平放，四分之三俯视角度（能看到坐垫的厚度与圆形前边缘），整体居中构图，占画面约 80%，四周留白均匀。',
  },
  {
    asin: 'B0FNQRRV78',
    ref: 'https://www.makimoohome.com/images/products/B0FNQRRV78/4.webp',
    prompt:
      '以参考图中的坐垫为准：藏青与正红棋盘格拼接（navy blue and red checkerboard color-block patchwork）绒面质感面料、簇绒（tufted）凹点、' +
      '方形扁平坐垫（无靠背）、上边两角各有一条绑带（末端蝴蝶结），保持完全一致的面料质感、拼接图案、配色与版型。' +
      '**注意：参考图左侧边缘的小织标不要出现**.' + SQUARE_COMMON,
  },
  {
    asin: 'B0GD7RR5PH',
    ref: 'https://www.makimoohome.com/images/products/B0GD7RR5PH/1.webp',
    prompt:
      '以参考图中的坐垫为准：白底多彩热带植物花鸟印花（white ground multicolor tropical botanical floral print，粉/紫/蓝/橙花朵配黑白枝叶）面料、平滑户外布面质感、' +
      '方形扁平坐垫（无靠背、无绑带），保持完全一致的面料质感、印花图案、配色与版型。' +
      '**注意：参考图是两只叠放且带织标，生成图只要一只、不要织标**.' + SQUARE_COMMON,
  },
  {
    asin: 'B0CC5RGRPS',
    ref: 'https://www.makimoohome.com/images/products/B0CC5RGRPS/1.webp',
    prompt:
      '以参考图中椅子上的坐垫为准：蓝底白瓣水彩菊花印花（blue ground white-petal watercolor chrysanthemum print，深浅蓝色底配米白花瓣）面料、平滑户外布面质感、无簇绒、' +
      '靠背与坐垫一体成型呈 L 形、四角各有一条绑带，印花图案、配色与版型必须与参考图完全一致（不要改成油画风格）.' +
      '**注意：参考图是椅子上的场景图，生成图只要一只坐垫**.' + COMMON,
  },
  {
    asin: 'B0GJSTTGY5',
    ref: 'https://www.makimoohome.com/images/products/B0GJSTTGY5/1.webp',
    prompt:
      '以参考图中椅子上的坐垫为准：深墨绿色纯色（solid dark forest green）面料、平滑户外布面质感、簇绒（tufted）凹点缝线（无纽扣）、' +
      '靠背与坐垫一体成型呈 L 形，保持完全一致的面料质感与颜色。' +
      '**版型要求：这是高背款（high-back），靠背高度明显大于坐垫深度（靠背约为坐垫深度的 1.2~1.3 倍）；坐垫偏方正紧凑、不要过长；' +
      '靠背顶部两角各有一条绑带（系成环形扣袢/蝴蝶结），坐垫两侧前角各有一条绑带（末端蝴蝶结），共四条**.' +
      '**注意：参考图是两只椅子上的场景图，生成图只要一只坐垫**.' + COMMON,
  },
  {
    asin: 'B0C3B16L6R',
    ref: 'https://www.makimoohome.com/images/products/B0C3B16L6R/2.webp',
    prompt:
      '以参考图中的椅垫为准，**印花必须精确复刻参考图**：翠绿/青色底 + 米色编织条印花（teal-green ground with beige hand-drawn woven rattan stripe print），' +
      '编织条是**不规则、手绘感、粗细不一、随意交叉弯曲的有机线条**（不是规则棋盘格、不是方正格子），保持完全一致的面料质感、印花图案、配色与版型；' +
      '平滑户外布面质感、无簇绒、靠背与坐垫一体成型呈 L 形、四角各有一条绑带。' +
      '**这是高背款（high-back）：靠背高度略长于坐垫深度（靠背约为坐垫深度的 1.1 倍，不要过长）**.' + COMMON,
  },
  {
    asin: 'B0CC5TLWFS',
    ref: 'https://www.makimoohome.com/images/products/B0CC5TLWFS/1.webp',
    prompt:
      '以参考图中椅子上的坐垫为准：多彩几何人字纹印花（multicolor geometric chevron print，青绿/粉/橙/蓝/米白色块）面料、平滑户外布面质感、无簇绒、' +
      '靠背与坐垫一体成型呈 L 形、四角各有一条绑带（末端蝴蝶结），保持完全一致的面料质感、印花图案、配色与版型。' +
      '**注意：参考图是椅子上的场景图，生成图只要一只坐垫**.' + COMMON,
  },
  {
    asin: 'B0DSGCKWXW',
    ref: 'https://www.makimoohome.com/images/products/B0DSGCKWXW/1.webp',
    prompt:
      '以参考图中椅子上的坐垫为准：米白底多彩水彩花卉印花（cream ground multicolor watercolor floral print，红/粉/黄/紫花朵）面料、平滑户外布面质感、无簇绒、' +
      '靠背与坐垫一体成型呈 L 形、四角各有一条绑带（末端蝴蝶结），保持完全一致的面料质感、印花图案、配色与版型。' +
      '**注意：参考图是两只椅子上的场景图，生成图只要一只坐垫**.' + COMMON,
  },
  {
    asin: 'B0DSGFXLDV',
    ref: 'https://www.makimoohome.com/images/products/B0DSGFXLDV/5.webp',
    prompt:
      '以参考图中的椅垫为准，**印花必须精确复刻参考图**：黑底多彩郁金香花卉印花（black ground multicolor tulip floral print，蓝/粉/黄/红/橙色花朵配紫色枝叶）面料、平滑户外布面质感、无簇绒、' +
      '靠背与坐垫一体成型呈 L 形、靠背顶部两角各有一条绑带（环形扣袢）、坐垫两侧前角各有一条绑带（末端蝴蝶结），保持完全一致的面料质感、印花图案、配色与版型。' + COMMON,
  },
  {
    asin: 'B0CC5VNQY3',
    ref: 'https://www.makimoohome.com/images/products/B0CC5VNQY3/1.webp',
    prompt:
      '以参考图中椅子上的坐垫为准：米白底郁金香花卉印花（cream ground tulip floral print，红/橙/紫郁金香配绿色枝叶）面料、平滑户外布面质感、无簇绒、' +
      '靠背与坐垫一体成型呈 L 形、四角各有一条绑带，保持完全一致的面料质感、印花图案、配色与版型。' +
      '**注意：参考图是两只椅子上的场景图，生成图只要一只坐垫**.' + COMMON,
  },
  {
    asin: 'B0CC5Y77DC',
    ref: 'https://www.makimoohome.com/images/products/B0CC5Y77DC/2.webp',
    prompt:
      '以参考图中的椅垫为准：米色底蝴蝶昆虫印花（beige ground butterfly and insect print，蓝/红蝴蝶、蜻蜓、瓢虫配小花）面料、细帆布质感、无簇绒、' +
      '靠背与坐垫一体成型呈 L 形、四角各有一条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + COMMON,
  },
  {
    asin: 'B0C4BD7Q5X',
    ref: 'https://www.makimoohome.com/images/products/B0C4BD7Q5X/4.webp',
    prompt:
      '以参考图中的坐垫为准：米白底热带花卉印花（cream ground bold tropical botanical print，大红/藏青/青绿色花朵枝叶）面料、平滑户外布面质感、簇绒（tufted）凹点、' +
      '**方形扁平坐垫（无靠背）**、一侧有两条绑带，保持完全一致的面料质感、印花图案、配色与版型。' +
      '**注意：参考图带织标，生成图不要织标**.' + SQUARE_COMMON,
  },
  {
    asin: 'B0C39ZMK7H',
    ref: 'https://cdn.shopify.com/s/files/1/0995/3843/6394/files/2_e24e6945-373c-4cf8-b0d5-b1ba867ee030.jpg?v=1777482770&width=2048',
    prompt:
      '以参考图中的椅垫为准：米白底红蓝花卉印花（cream ground red and navy floral print，大红色花朵、藏青与青绿色叶片）面料、平滑户外布面质感、无簇绒、' +
      '靠背与坐垫一体成型呈 L 形、四角各有一条绑带，保持完全一致的面料质感、印花图案、配色与版型。' + COMMON,
  },
  {
    asin: 'B0GJLPXB6F',
    ref: 'https://www.makimoohome.com/images/products/B0GJLPXB6F/6.webp',
    prompt:
      '以参考图中的坐垫为准：深安哥拉红色纯色（solid deep angora red）天鹅绒质感面料（soft velvet-touch fabric）、簇绒（tufted）放射状凹点缝线、' +
      '**圆形厚坐垫（round thick floor/seat cushion，无靠背、无绑带）**，保持完全一致的面料质感、颜色、工艺与版型。' +
      '**画面中只允许出现一只坐垫（a single cushion only）**，绝对不要第二只、不要叠放、不要并排；' +
      '**不要任何织标/标签/logo/水印文字**，布面完全纯净。浅灰色纯色摄影棚背景（light gray seamless studio background），' +
      '柔和均匀的棚拍光线，底部自然柔和的浅阴影，写实摄影，画面干净高级。' +
      '构图：单只圆形坐垫平放，四分之三俯视角度（能看到坐垫的厚度与圆形前边缘），整体居中构图，占画面约 80%，四周留白均匀。',
  },
  {
    asin: 'B0F1YDRDTX',
    ref: 'https://www.makimoohome.com/images/products/B0F1YDRDTX/3.webp',
    prompt:
      '以参考图中的坐垫为准：深藏青色纯色（solid deep navy blue）天鹅绒质感面料（soft velvet-touch fabric）、簇绒（tufted）放射状凹点缝线、' +
      '**圆形厚坐垫（round thick floor/seat cushion，无靠背、无绑带）**，保持完全一致的面料质感、颜色、工艺与版型。' +
      '**画面中只允许出现一只坐垫（a single cushion only）**，绝对不要第二只、不要叠放、不要并排；' +
      '**不要任何织标/标签/logo/水印文字**，布面完全纯净。浅灰色纯色摄影棚背景（light gray seamless studio background），' +
      '柔和均匀的棚拍光线，底部自然柔和的浅阴影，写实摄影，画面干净高级。' +
      '构图：单只圆形坐垫平放，四分之三俯视角度（能看到坐垫的厚度与圆形前边缘），整体居中构图，占画面约 80%，四周留白均匀。',
  },
  {
    asin: 'B0F1Y4J48T',
    ref: 'https://cdn.shopify.com/s/files/1/0995/3843/6394/files/2_6bd8b1b0-ca61-4d99-9f57-cc2328c8a570.jpg?v=1777859537&width=2048',
    prompt:
      '以参考图中的坐垫为准：墨绿与驼棕棋盘格拼接（dark green and camel brown checkerboard patchwork）天鹅绒质感面料、簇绒（tufted）凹点、' +
      '**方形扁平坐垫（无靠背）**、上边两角各有一条绑带，保持完全一致的面料质感、拼接图案、配色与版型。' +
      '**画面中只允许出现一只坐垫（a single cushion only）**，绝对不要第二只、不要叠放、不要并排；' +
      '**不要任何织标/标签/logo/水印文字**（参考图角落的纸质吊牌不要出现），布面完全纯净。浅灰色纯色摄影棚背景（light gray seamless studio background），' +
      '柔和均匀的棚拍光线，底部自然柔和的浅阴影，写实摄影，画面干净高级。' +
      '构图：单只方形坐垫平放，四分之三俯视角度（能看到坐垫厚度与前边缘），整体居中构图，占画面约 80%，四周留白均匀。',
  },
];

async function createTask(job) {
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
      inputImgs: [job.ref],
      imgNum: 1,
      imgRatio: '1:1',
      mode: 'gpt-image-2.5',
      size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(JSON.stringify(data));
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
    const { status, progress } = data.data;
    if (i % 6 === 0) console.log(`  [${uuid.slice(0, 8)}] ${status} ${progress ?? 0}%`);
    if (status === 'succeeded' || status === 'partial_failed') {
      const img = data.data.assets?.[0]?.images?.[0]?.url;
      if (!img) throw new Error(`无结果图: ${JSON.stringify(data.data).slice(0, 300)}`);
      return img;
    }
    if (status === 'failed') throw new Error(`任务失败: ${data.data.error_message || '未知原因'}`);
    await new Promise(r => setTimeout(r, 5000));
  }
  throw new Error('轮询超时');
}

async function run(job) {
  console.log(`创建任务: ${job.asin} 棚拍主图（单只）`);
  const uuid = await createTask(job);
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  const buf = Buffer.from(await res.arrayBuffer());
  const outDir = path.join(__dirname, '..', 'public', 'images', 'staging', job.asin);
  fs.mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, 'main.webp');
  await sharp(buf).resize({ width: 1200, height: 1200, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(dest);
  console.log(`  已保存 ${dest}`);
}

(async () => {
  const filter = process.argv.slice(2).map(s => s.toUpperCase());
  const jobs = filter.length ? JOBS.filter(j => filter.includes(j.asin)) : JOBS;
  let failed = 0;
  for (const job of jobs) {
    try { await run(job); } catch (e) { failed++; console.error(`${job.asin} 失败:`, e.message); }
  }
  if (failed) process.exit(1);
  console.log('全部完成');
})();
