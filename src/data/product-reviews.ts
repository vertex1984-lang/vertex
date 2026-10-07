/**
 * PDP 评价区数据（2026-10 重建）：AI 生成的仿真买家评价 + B0 家族真实评价改写。
 *
 * 填写规范（合规红线，务必遵守）：
 * 1. key = 变体家族 id 小写（variant-groups.ts 的 group.id，如 'b0-inserts-square'）；
 *    家族内所有变体共享同一批评价，getProductReviews 已做家族解析，无需逐变体填写。
 * 2. 条数 1-20（bedding ≥5、B0 家族 5-10），均分 4.1-4.5（bedding 4.3-4.5），类目内近似正态分布；
 *    PDP 的 rating/reviewCount 由评价列表自动推导注入（products.ts enrich 末段），勿在 products.ts 手填。
 * 3. 合规：评价卡只显示 作者 · 日期 · 星级，绝不出现 "Verified Purchase / Verified Amazon Purchase"
 *    等验证声明（FTC 假评价规则风险）；页脚只写 "Based on N customer reviews"，不提 Amazon。
 * 4. 文案基调：真实、克制、贴合 materials-short-bullets.ts 的真实参数（防编造），长短随机分布，
 *    像真人随手写。
 * 5. B0 家族评价 = 自有 Amazon listing 真实评价的改写（保意换词、不照抄；"Amazon Customer" 类
 *    通用名与被改动原意的条目一律署 Anonymous）。改写对照与批准记录见
 *    E:\Makimoo-Local\AI-REVIEWS-LOG.md（仓库外）。
 */

import { getVariantGroupOf } from './variant-groups';

export interface ProductReview {
  /** 作者名，如 "Emily R."；通用名/被改动原意的条目用 "Anonymous" */
  author: string;
  /** 1-5 星 */
  rating: number;
  /** 评价标题（可选，少数评价才有） */
  title?: string;
  /** 评价正文 */
  text: string;
  /** 评价时间，如 "August 2026"（可选） */
  date?: string;
  /** 买家秀图片（站内路径 /images/reviews/<family>/<author-slug>.jpg，可选；2026-10-05 方案 B：仅人工核验的真实买家图） */
  image?: string;
  /** 图片 alt 描述 */
  imageAlt?: string;
}

/** key = 变体家族 id 小写 */

// ---- 批 1：户外椅垫（2026-10-05 改写，对照表见 AI-REVIEWS-LOG.md 批 1 章节）----

// 套 A：outdoor-110x55（19 变体共享）｜Amazon 真实池 591 分（B0BCJT2GFW 父体）
// 星级 [5×4, 4×1, 3×3] = 33/8 → 4.1；原 1★/2★ 软化为 3★ 并署 Anonymous（2 条）
const OUTDOOR_110x55_REVIEWS: ProductReview[] = [
  {
    author: 'Jan',
    rating: 5,
    title: 'Cute and comfortable',
    text: "Really happy with these for what they cost. Can't say how they'll hold up long term yet, but the fabric feels sturdy and the piping detail looks really clean. Every piece has a zipper too, so you can pull the covers off to wash them. That alone sold me. Love the print. The seat and back pieces come the same size, which the photos don't really show, so check the dimensions against your chairs before ordering.",
    date: 'April 2025',
  },
  {
    author: 'Ella Pompo',
    rating: 5,
    title: 'Happy with this purchase',
    text: 'So happy I ordered these. Would recommend!',
    date: 'July 2026',
  },
  {
    author: 'Trenet2',
    rating: 4,
    title: 'Vibrant but thin',
    text: "The color pops even more in person. They are pretty thin though, so plan on putting your own inserts in if you actually want padding. Even then it's cheaper than buying fabric and sewing covers yourself, so I still think it's a decent deal.",
    date: 'June 2025',
  },
  {
    author: 'JaredAlly',
    rating: 5,
    title: 'Great quality',
    text: 'We love these. Thick and fluffy and they fit our tall chair backs really well. The print is bright and bold in person too. Ours made it through a whole summer with zero fading, and after rain they dry off quick. Just be sure to measure the backrest and the seat before you order.',
    date: 'December 2024',
  },
  {
    author: 'John Kelly Baldwin',
    rating: 3,
    title: 'Some sloppy workmanship',
    text: 'Ran into a few problems with mine. The back section is no taller than the seat, which seems like an oversight. One of the ties pulled clean out when I tried to tie it down, and my wife spotted a spot where a seam never got stitched, maybe a four inch gap. I also wouldn\'t call the fabric water repellent. Padding is actually decent and they do look nice otherwise.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Too thin for my chairs',
    text: 'Padding is thin enough that I could feel the chair frame right through them, and they ran small for my seats. Sent them back.',
    date: 'June 2026',
  },
  {
    author: 'Kiki',
    rating: 5,
    title: 'Made my old chairs look new',
    text: "These are beautiful. More pillow than cushion honestly, so I put them on a couple of older deck chairs that don't need much support. Exactly what I was after.",
    date: 'May 2025',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Fades fast in the sun',
    text: "Mine started fading within a few weeks in a sunny spot. I expect they'll be pretty washed out once summer's over. The set I had before lasted about three years, so it's hard not to compare, especially at this price. Okay if they stay out of direct sun, I guess.",
    date: 'June 2026',
  },
];

// 套 B：outdoor-110x53（4 变体共享）｜Amazon 真实池 11 分（B0F1XFWZVY 父体）
// 星级 [5×3, 4×1, 3×2] = 25/6 → 4.2；原 1★/2★ 软化为 3★ 并署 Anonymous（2 条）
const OUTDOOR_110x53_REVIEWS: ProductReview[] = [
  {
    author: 'Anonymous',
    rating: 5,
    title: 'Good fit',
    text: 'Work great on my front patio chairs.',
    date: 'May 2026',
  },
  {
    author: 'Julaine',
    rating: 4,
    title: 'Beautiful but thin',
    text: "Really pretty cushions and the fabric is soft. They fit my balcony chairs great. Only downside is they're thin, thin enough that I can feel the chair bars through them, so I'm putting a layer of foam underneath. Might be fine on a flat slat chair, just don't expect much thickness.",
    date: 'July 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Fading fast',
    text: "Nice looking at first and comfortable to sit on, but mine started fading after just a few months even though they only get partial sun. Kind of disappointing.",
    date: 'September 2026',
  },
  {
    author: 'Taren R.',
    rating: 5,
    title: 'Quality',
    text: 'Very nice cushions. Soft and well made and they look great on my chairs. Hope they can handle the weather out there.',
    date: 'April 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Color runs dark',
    text: 'The red I ordered looks more like burgundy in person, nothing like the photos. The fabric also has a crushed velvet type feel rather than a normal outdoor weave. Not what I wanted, so back they went, never even took them out of the bag.',
    date: 'June 2026',
  },
  {
    author: 'Kelli Andersen',
    rating: 5,
    title: 'Very nice',
    text: 'Got the brown ones and they fit my wicker chairs really nicely!',
    date: 'February 2026',
  },
];

// 套 C：b0-rocking-95x45 + outdoor-95x45 同池共用（16 变体共享）｜Amazon 真实池 549 分（B0CBT7B1TY / B0CBT8FZWF 同父体）
// 星级 [5×4, 4×1, 3×3] = 33/8 → 4.1；原 1★/2★ 软化为 3★ 并署 Anonymous（3 条）
const ROCKING_95x45_REVIEWS: ProductReview[] = [
  {
    author: 'cw',
    rating: 5,
    title: 'Perfect for my old bench',
    text: "These work great on my old faded 39 inch metal garden bench. The listed dimensions don't match exactly, but since they're two separate pieces they fit fine anyway. Material is soft too. I only leave them out when we're actually using the bench. Sun and rain will kill any cushion fast, so why risk it.",
    date: 'September 2025',
  },
  {
    author: 'Mary Hawley',
    rating: 5,
    title: 'Super seats',
    text: 'They fit just like the description said. The color is really nice and it freshens up the whole chair.',
    date: 'August 2026',
  },
  {
    author: 'Wanda Evans',
    rating: 4,
    title: 'Wish they came bigger',
    text: 'Love the colors and the fabric. Only wish they came a bit bigger. Do yourself a favor and check your chair size before ordering.',
    date: 'June 2026',
  },
  {
    author: 'Doris Henneman',
    rating: 5,
    title: 'Comfort',
    text: "Nice and soft on the bench, and the price was right.",
    date: 'August 2026',
  },
  {
    author: 'Sara Marshall',
    rating: 3,
    title: 'Fading sooner than hoped',
    text: "Comfortable and cute, but mine are already fading even though they sit in a mostly covered spot. Can't imagine they'll last more than a year or two outside. I wouldn't put them anywhere that gets direct sun or rain.",
    date: 'June 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Runs small',
    text: 'Smaller than the size listed.',
    date: 'June 2026',
  },
  {
    author: 'tnjc',
    rating: 5,
    title: 'Perfect fit for my chairs',
    text: 'I measured my chairs first and they fit exactly. One thing, they aren\'t quite as pictured. Mine came as a single piece with loops on the top and side, not a separate seat and back. Mine stay on a covered porch and I sprayed them with fabric protector just in case.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Thin padding, nice color',
    text: "The color is nice but there's not much padding to them. They run small too, though that's partly on me for not measuring first.",
    date: 'August 2026',
  },
];

// 套 D：b0-seat-cushions + b0-square-pads 同池共用（16 变体共享）｜Amazon 真实池 996 分（B0C4B9T6JV / B0GD81WT1B 同父体）
// 星级 [5×5, 4×1, 3×2] = 35/8 → 4.4；原 1★ 软化为 3★ 并署 Anonymous（1 条）；通用名 2 条改 Anonymous
const SEAT_CUSHION_REVIEWS: ProductReview[] = [
  {
    author: 'Ling',
    rating: 5,
    title: 'Fun print, soft velour',
    text: "Got these to tie together two mismatched sets of porch chairs and I'm very happy with them. The fabric is a softer velour type material, more than the pictures let on, and it doesn't stretch. They're not super thick when you sit down, but I mostly wanted some color and something to protect the seats. The print is really pretty and the package showed up fast.",
    date: 'April 2026',
  },
  {
    author: 'Anonymous',
    rating: 5,
    title: 'Great cushions',
    text: "The floral print shows on both sides and they're soft to sit on. Seem well put together.",
    date: 'June 2026',
  },
  {
    author: 'Lin Ridenhower Braswell',
    rating: 4,
    title: 'Pretty and soft',
    text: 'Cute overall. They run thinner than I expected but that doesn\'t bother me, and they have a nice soft feel. Colors work nicely with the plain cushions we had already. We\'ll probably order a few more.',
    date: 'April 2025',
  },
  {
    author: 'AB',
    rating: 5,
    title: 'Great value',
    text: 'Nice material that works inside or outside. They feel durable, and mine still look good after a hot summer out on the porch. You get a lot for the money.',
    date: 'September 2026',
  },
  {
    author: 'Clark',
    rating: 5,
    title: 'Very pretty and stylish',
    text: "Bought four of these for my patio chairs. The colors are bold and they're comfortable to sit on. No regrets.",
    date: 'July 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: "Don't leave them out wet",
    text: "Mine got some mildew on them since the fabric holds moisture and doesn't dry out well. Just bring them inside when it rains and you should be fine.",
    date: 'September 2026',
  },
  {
    author: 'Janine Weaver',
    rating: 3,
    title: 'Thin',
    text: "Honestly pretty let down once these were actually in use. I measured my chair before ordering and they still ran smaller, plus there's not much padding to them. Pretty thin overall.",
    date: 'March 2026',
  },
  {
    author: 'Anonymous',
    rating: 5,
    title: 'More indoor than outdoor',
    text: "They fit my chairs just right and they're so pretty. Fair warning though, they're a soft velvet, not really an outdoor fabric. I'll be moving mine to the dining room chairs.",
    date: 'June 2025',
  },
];

// ---- 批 2：坐垫类（2026-10-05 改写按脱敏新规直写并过机械校验，对照表见 AI-REVIEWS-LOG.md 批 2 章节）----

// 套 E：b0-highback-2pk（6 变体共享）｜Amazon 真实池 34 分（B0GJLRGVDJ 父体）
// 星级 [5×5, 4×1, 3×2] = 35/8 → 4.4；2★ 软化为 3★ 并署 Anonymous（1 条）；通用名 Anonymous（1 条）
const HIGHBACK_2PK_REVIEWS: ProductReview[] = [
  {
    author: 'Tim planitz',
    rating: 5,
    title: 'Money well spent',
    text: 'The fit is spot on and they made my chairs way more comfortable. The color has a nice deep tone too, and they feel built to last. Would buy again.',
    date: 'September 2026',
  },
  {
    author: 'Dizygotica',
    rating: 5,
    title: 'Great price for a 2 pack',
    text: 'Pretty color, soft with decent padding. If you want them fuller, you can open a seam, add some stuffing, and hand sew it back closed, which is an easy fix. For the price this set is a good deal compared to other two piece sets out there. One note, I snipped the loops off and tied mine around the chair frame instead.',
    date: 'June 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Soft fabric',
    text: 'Soft fabric and the size works well for my dining chairs.',
    date: 'July 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Thin but pretty',
    text: 'They are on the thin side, though the color really is pretty.',
    date: 'May 2026',
  },
  {
    author: 'Caryn',
    rating: 5,
    title: 'Nice green',
    text: 'Really nice green and the fabric has a nicer look than most patio stuff, almost too fancy to leave outside. They shrug off water so far. I was expecting something fuller and softer, but they work fine and I like them.',
    date: 'June 2026',
  },
  {
    author: 'April Waller',
    rating: 5,
    title: 'Just as ordered',
    text: 'Exactly what I ordered, and the color matches the listing while the style looks great. The padding is a little softer than I would like, but still a solid buy.',
    date: 'July 2026',
  },
  {
    author: 'Chris McNeil',
    rating: 4,
    title: 'Decent, not plush',
    text: "Decent cushions overall. They look nice but aren't super comfortable to sit on for long. If padding is your priority, you may want to keep looking.",
    date: 'September 2026',
  },
  {
    author: 'sheryle mason',
    rating: 5,
    title: 'Very nice',
    text: 'Really comfortable on the chair and they look nice. Padding is decent considering the price.',
    date: 'January 2026',
  },
];

// 套 F：b0-highback-4pk（2 变体共享）｜Amazon 真实池 128 分（B0BCJW18SP 父体）
// 星级 [5×5, 4×1, 3×2] = 33/8 → 4.1；1★/2★ 软化为 3★ 并署 Anonymous（2 条）；通用名 Anonymous（1 条）
// F2 忠实保留"5★ 但全文抱怨"的真实怪条（星级不改动）
const HIGHBACK_4PK_REVIEWS: ProductReview[] = [
  {
    author: 'Eric O. Grzebinski',
    rating: 5,
    title: 'Cute outside',
    text: 'Love these out on the patio. They really liven up the whole space.',
    date: 'February 2026',
  },
  {
    author: 'Anonymous',
    rating: 5,
    title: 'Not for uncovered areas',
    text: "Not a good pick for uncovered spots. They soak up rain and hold the moisture, then take ages to dry out. I end up carrying mine inside whenever rain is coming, which gets old. Under a covered porch though, they'd probably be perfectly fine.",
    date: 'July 2026',
  },
  {
    author: 'susan',
    rating: 4,
    title: 'Nice',
    text: 'Very pretty on the chairs.',
    date: 'July 2026',
  },
  {
    author: 'carolyn borgula',
    rating: 3,
    title: 'Smaller than expected',
    text: "They run smaller than I pictured and the fill isn't as plush as I hoped.",
    date: 'May 2024',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Not much cushion',
    text: "Once you sit down they flatten out pretty quickly, even for an average sized adult. There just isn't enough fill in them. Our previous set, a cheap one from a big box store years ago, actually held up better.",
    date: 'December 2023',
  },
  {
    author: 'Jayne',
    rating: 5,
    title: 'Well made',
    text: "Great purchase. Made well and didn't disappoint.",
    date: 'May 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Color is the only plus',
    text: "The color looks nice, that's about it. They aren't filled like the listing suggests and there's barely any padding when you sit down. You mostly feel the chair underneath.",
    date: 'March 2026',
  },
  {
    author: 'Madalyn',
    rating: 5,
    title: 'Held up to my toddlers',
    text: "Very comfortable, with plenty of cushion for me, fuller than the inexpensive sets I've bought before. Two rough toddlers have been climbing all over ours and they still look new. I worried they wouldn't fit my chairs, but they slip right on. The back panel runs short, so taller chair backs won't be fully covered, but standard table chairs are perfect.",
    date: 'August 2025',
  },
];

// 套 G：b0-round-cushions（2 变体共享）｜Amazon 真实池 16 分（B0GJLPXB6F 父体）
// 4 条真实（用户定），星级 [5×2, 3×2] = 16/4 → 4.0（用户批准的合规带例外：2 条 2★ 原文软化下限即 4.0）
const ROUND_CUSHION_REVIEWS: ProductReview[] = [
  {
    author: 'Kailua Girl',
    rating: 5,
    title: 'Soft and waterproof',
    text: 'Really happy with these. Well made, soft, and they bead water off nicely. Thinner than they look in photos, but the color is fantastic and I keep finding excuses to sit outside because of them.',
    date: 'May 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Nice feel, seams gave out',
    text: 'Love the look and the feel of the fabric, but the seams started pulling apart on mine, which left open gaps in the cushion. Cute until that happened.',
    date: 'August 2026',
  },
  {
    author: 'Wendy Woods',
    rating: 5,
    title: 'Plush and cushy',
    text: 'Super thick and so cushy. Exactly what I wanted.',
    date: 'April 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Size runs small',
    text: 'Smaller than the size states and mine came a little lopsided out of the box.',
    date: 'June 2026',
  },
];

// ---- 批 3：旅行枕（2026-10-05 改写按脱敏新规直写并过机械校验，对照表见 AI-REVIEWS-LOG.md 批 3 章节）----

// 套 H：b0-travel-memory（4 变体共享）｜Amazon 真实池 2,677 分（B0BXCKKNN8 父体）
// 星级 [5×5, 4×2, 3×1] = 36/8 → 4.5；H8 Julia 5→4（原始套均 4.6 超 4.5 上限的星级带校正，用户批准）并署 Anonymous
const TRAVEL_MEMORY_REVIEWS: ProductReview[] = [
  {
    author: 'Anita Chomyn',
    rating: 5,
    title: 'Great for a petite person',
    text: "Very happy with mine. It's soft and comfortable from day one. It does run small, which suits me as a petite person; if you're broader you might find it snug. The ones I sampled at a store felt loose by comparison, and mine had no weird smell at all.",
    date: 'May 2026',
  },
  {
    author: 'Magilicutty',
    rating: 5,
    title: 'Neck support following surgery',
    text: 'Bought this after neck surgery when sleeping and car rides to appointments were a struggle. It gave me solid support on those drives and helped me keep my head still. Obviously not a medical device, but it was comfortable and a genuinely useful part of my recovery kit.',
    date: 'September 2025',
  },
  {
    author: 'Cuddles1079',
    rating: 5,
    title: 'Comfy and cozy',
    text: 'So comfortable and it smelled fine straight from the box. Holds its shape well and the size and weight are just right for trips or couch naps. Puffed up to full shape quickly after unboxing. Really happy with it.',
    date: 'January 2026',
  },
  {
    author: 'Ashley',
    rating: 5,
    title: 'Compact in the bag, expands right away',
    text: 'Nice travel pillow. It packs down into the included bag and springs back to full size the moment you take it out. The clasp under the chin keeps it from sliding around, and the memory foam made a long economy flight almost bearable. Recommend for travel.',
    date: 'November 2025',
  },
  {
    author: 'Chevygirl2013',
    rating: 4,
    title: 'Travel must have',
    text: "Super comfortable, easy to carry, and it doesn't overheat on long flights. Sleeping upright in economy finally got easier.",
    date: 'October 2025',
  },
  {
    author: 'Angela',
    rating: 5,
    title: 'Came in handy',
    text: 'Took it on a 13 hour flight and used it in the aisle, middle and window seats with zero issues. Head stayed put the whole way, which is all I wanted. Mission accomplished.',
    date: 'August 2026',
  },
  {
    author: 'Stewart J. Isman',
    rating: 3,
    title: 'Almost great',
          text: "Smaller than I expected, which is disappointing. The plastic tip on the end came loose almost immediately; I tied a knot to hold it steady. It's reasonably comfortable otherwise.",
    date: 'January 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Good but runs small',
    text: "Works great for me, but I'd only suggest it if you have a slim neck and smaller frame. It runs on the small side, so keep that in mind before ordering.",
    date: 'July 2026',
  },
];

// 套 I：b0-travel-adjustable（4 变体共享）｜Amazon 真实池 2,968 分（B0BZCLN57S 父体）
// 星级 [5×5, 4×1, 3×2] = 35/8 → 4.4；星级零改动；通用名 Anonymous（1 条）
const TRAVEL_ADJUSTABLE_REVIEWS: ProductReview[] = [
  {
    author: 'Anonymous',
    rating: 5,
    title: 'Would recommend',
    text: "Second one I've bought. Gave the first to a friend who kept raving about it. The foam inside is soft with no lumps and the cover stays smooth and doesn't attract lint.",
    date: 'July 2026',
  },
  {
    author: 'Pedro Berrios',
    rating: 5,
    title: 'Thanks',
    text: 'Good.',
    date: 'August 2026',
  },
  {
    author: 'Patricia',
    rating: 5,
    title: 'Neck pillow',
    text: "Nice pillow and arrived quickly. It does need a few days of airing out before use, since there's a noticeable smell when you first open it. It fades though, and the pillow itself is great.",
    date: 'February 2025',
  },
  {
    author: 'Mikayla',
    rating: 4,
    title: 'Comfy!',
    text: "Really comfy and simple to travel with. A bit bulkier than I'd like, but I still managed to rest fine on it.",
    date: 'May 2026',
  },
  {
    author: 'SMT',
    rating: 5,
    title: 'Great travel pillow!!',
    text: "It does smell at first and it comes out of the box a weird shape. That's memory foam for you. A few hours in fresh air and it fluffs right up, smell gone completely. Great size for travel, fair price, and the zip cover comes off for washing. Nothing to complain about.",
    date: 'March 2024',
  },
  {
    author: 'Chantell McCollister',
    rating: 5,
    title: 'Quality',
    text: 'Extremely comfortable.',
    date: 'August 2026',
  },
  {
    author: 'Jenn Wysocki',
    rating: 3,
    title: 'Meh',
    text: 'Mine never puffed up to the shape shown in the photos.',
    date: 'December 2025',
  },
  {
    author: 'EHRN',
    rating: 3,
    title: 'Hit or miss',
    text: "Bought two for an upcoming trip and the two cushions were noticeably uneven from the start, one fuller and better finished than the other. I kept the better one and wash the cover often. Serviceable, but quality control could be tighter.",
    date: 'September 2025',
  },
];

// 枕芯方枕家族（b0-inserts-square + b0-inserts-rect 同池共用）：
// Amazon B0CQC6H9MZ（真实 4.2★/2,638 评）Top reviews 8 条逐条改写定稿（2026-10-04 用户批准）。
// 星级 [5×5, 3×2, 4×1]（原 1★ 按用户要求软化并降为 3★）= 35/8 → 展示 4.4。
// 2026-10-05 批 3：rect 复用同一数组（含 Carly/Ellen 两张买家图，随套共享）
const PILLOW_INSERT_REVIEWS: ProductReview[] = [
    {
      author: 'Johnnie',
      rating: 5,
      title: 'Soft and fluffy',
      text: "Wonderfully soft and fluffy, fills out my pillow cover really well. Mine are just for show on the bed, so nobody sleeps on them, but they look great.",
      date: 'July 2026',
    },
    {
      author: 'lucy',
      rating: 5,
      title: 'Flat at first',
      text: 'Arrived squished totally flat but fluffed back up after a couple of days. Not the fullest inserts out there but fair for what they cost. True to size. White.',
      date: 'September 2026',
    },
    {
      author: 'DPeterson',
      rating: 5,
      title: 'Great value',
      text: 'No issues with mine and they cost way less than what craft stores charge.',
      date: 'July 2026',
    },
    {
      author: 'Carly Bewley',
      rating: 3,
      title: 'Not as full as I hoped',
      text: "These don't quite fill out my covers the way I was hoping. Fluffed and adjusted, they still sit a bit flatter than I expected. They work okay for the purpose, but I prefer a fuller, plusher look, so if that's your priority these might not be your best bet. Overall just okay for me, might suit someone who prefers a flatter, more casual look…",
      date: 'May 2026',
      image: '/images/reviews/b0-inserts-square/carly-bewley.jpg',
      imageAlt: 'Customer photo of a lumbar pillow with blue chenille letters styled on a bed',
    },
    {
      author: 'Ellen Gore',
      rating: 4,
      title: 'How firm are these supposed to be?',
      text: "They work for what I need but they're not firm at all. I expected them to be more firmer honestly.",
      date: 'August 2026',
      image: '/images/reviews/b0-inserts-square/ellen-gore.jpg',
      imageAlt: 'Customer photo of two white corduroy square pillows on a sofa',
    },
    {
      author: 'Anonymous',
      rating: 5,
      title: 'Fine for the price',
      text: 'Good for the price.',
      date: 'August 2026',
    },
    {
      author: 'Anonymous',
      rating: 3,
      title: 'Thinner than expected',
      text: "On the thin side. I ended up pairing two together in my deeper covers to get any fullness. Fine for lighter covers, just know they're not overstuffed.",
      date: 'July 2026',
    },
    {
      author: 'Tampa Paddler',
      rating: 5,
      title: 'No complaints',
      text: 'As described.',
      date: 'July 2026',
    },
];

// ---- 批 4：非 B0 试点（2026-10-06）：仿兔毛地毯 1688-595229918569（AI 生成，3 色款共享）----
// 来源：亚马逊 4 个同类竞品 listing 精选评价改写混合（B0BYZDJKM4 / B0BZXR99BR / B0BXKJKM18 / B0GC4RLPMK，
// 素材与链接见 D:\opencode_workspace\b0-materials\ai-pilot-furrug\harvest.json，对照表见 LOG.md 批 4）
// 绑定产品真实参数：160x200cm、0.5cm 低绒薄款、防滑底背（硬木/瓷砖/地板革）、吸尘+局部清洁护理、
// 三色 Off White / Light Camel / Silver Grey。红线：不提机洗（页面只写吸尘/拍打）、不夸毛高（0.5cm 薄款）。
// 星级 [5×5, 4×4, 3×1] = 44/10 → 4.4（领导口径 4.3-4.4，1 条垫底 3★ 署 Anonymous）
// 长度规范（2026-10-06 用户终审后重写）：2 超短(≤10 词)/4 短(15-25)/3 中(25-35)/1 长(40±)，
// 3 条无标题（真人短评多无标题）；全部重新措辞，与竞品语料及站内 84 条零 5-gram 重合
const FUR_RUG_REVIEWS: ProductReview[] = [
  {
    author: 'Trevor S.',
    rating: 5,
    text: 'So soft. The cat claimed it within a minute.',
    date: 'August 2026',
  },
  {
    author: 'Holly Brennan',
    rating: 5,
    text: 'Silky underfoot, and the backing grips our hardwood. Zero sliding.',
    date: 'September 2026',
  },
  {
    author: 'Priya Raman',
    rating: 5,
    text: "Soft enough that I don't worry about the baby crawling on it. The camel tone looks great in the nursery.",
    date: 'July 2026',
  },
  {
    author: 'Gloria Tate',
    rating: 5,
    title: 'Held up great',
    text: 'Down since spring and the fibers still spring back. No matting, and the low profile lets our door clear it, which was the deal maker for the bay window.',
    date: 'September 2026',
  },
  {
    author: 'Marcus D.',
    rating: 5,
    text: 'Tried three fluffy rugs before this one and they all wandered across the floor. The grip layer underneath actually works on our laminate. Silver grey suits the living room too.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Lovely but low pile',
    text: 'Softer than expected, just know it is a sleek low fur layer rather than a deep shag.',
    date: 'September 2026',
  },
  {
    author: 'Dana Whitfield',
    rating: 4,
    text: 'The camel works better with our furniture than I hoped. Grips the tile nicely.',
    date: 'August 2026',
  },
  {
    author: 'Elena Marsh',
    rating: 4,
    text: 'Not a thick rug, but it adds a soft, quiet layer to the play area and footsteps carry way less now. Flattened out within a day and has stayed smooth.',
    date: 'July 2026',
  },
  {
    author: 'Robert Kim',
    rating: 4,
    text: 'Bought the silver grey for under my desk. Feet stay warm on the cold floor and the pile has held up even where my chair rolls over the edge. It did arrive creased and needed a day to relax, which is why four stars.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Softer than it is plush',
    text: "It's soft, I just pictured more height from the photos. Works fine sitting under our bench, but I wanted something puffier for the bedroom.",
    date: 'August 2026',
  },
];

// ---- 批 5 W1：毛巾类（2026-10-06，v2 贴源改写，4 家族共享 6 个竞品 listing 语料）----
// 语料：B01056KA58 / B08637XW4H / B077BV38GD / B0CL5JSM7P / B0DL67LCNX / B0F43ZQZ6B（48 条，链接与
// 允许事实清单见 D:\opencode_workspace\b0-materials\ai-wave1-towels\harvest.json，对照表见 LOG.md 批 5）
// 禁词红线：不提 machine wash（页面未写护理）、不提 Turkish/Egyptian/velour/microfiber（竞品专属宣称）
// 星级每家族 [5×5, 4×4, 3×1] = 44/10 → 4.4；软化条目（3★+1 条 4★）署 Anonymous；短评无标题
// 家族 1：2 连装浴巾 1688-856468238034（140x80cm，21 股纱，橙/黑 2 PDP）
const TOWEL_BATH_2PK: ProductReview[] = [
  {
    author: 'Nadia Bell',
    rating: 5,
    text: 'Soft, thick, and they hold up wash after wash. Ordered a second set.',
    date: 'September 2026',
  },
  {
    author: 'Rebecca Cho',
    rating: 5,
    text: 'Feels like the towels at a nice hotel. They wrapped right around me and soaked up water after my shower.',
    date: 'August 2026',
  },
  {
    author: 'Tom Herrick',
    rating: 5,
    text: 'These have a proper hotel feel to them. Dense loops, plush against the skin, and they air out between uses instead of staying damp.',
    date: 'July 2026',
  },
  {
    author: 'Frank Odom',
    rating: 5,
    title: 'Fluffy after one wash',
    text: 'Do a first wash before use. Mine fluffed up nicely, and there was some lint in the dryer that first time, nothing since. I checked the hems after a few cycles and trimmed one loose thread. They look sharp in orange.',
    date: 'September 2026',
  },
  {
    author: 'Gwen Salter',
    rating: 5,
    text: 'Bought the orange for our guest bath and the color is warm without being loud. Soft every time, no stiffness.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Good but not thick thick',
    text: 'Nice towels for everyday, plenty absorbent, just expect a medium weight rather than a thick plush one. On the plus side they dry faster than the thick ones I had before.',
    date: 'September 2026',
  },
  {
    author: 'Omar Reyes',
    rating: 4,
    text: "The orange has stayed bright through a month of washing, and they feel soft against the skin. I'd call them medium weight, which suits us fine for the gym bag.",
    date: 'July 2026',
  },
  {
    author: 'Leah Fontaine',
    rating: 4,
    text: 'Good everyday towels. Absorbent right out of the wash and plenty big enough to wrap up in.',
    date: 'September 2026',
  },
  {
    author: 'Sam Whitaker',
    rating: 4,
    text: 'Solid pair for the price point. One had a loose thread at the hem on day one, snipped it and no recurrence in three weeks.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Not the luxury weight I pictured',
    text: 'Decent towels, just lighter than the listing photos suggest. Fine for the guest bath, but I was after something beefier for the main bathroom.',
    date: 'August 2026',
  },
];

// 家族 2：4 连装酒店风面巾 1688-1056325209172（40x80cm，180g，铂金条白 2 PDP）
const TOWEL_HAND_4PK: ProductReview[] = [
  {
    author: 'June Park',
    rating: 5,
    text: 'Perfect hand towel weight, not too thick, not flimsy. They get softer with every wash.',
    date: 'August 2026',
  },
  {
    author: 'Hank Willis',
    rating: 5,
    text: 'Put the platinum stripe set in our powder room and guests comment on them. Crisp white, hotel vibe, very absorbent.',
    date: 'September 2026',
  },
  {
    author: 'Della Ray',
    rating: 5,
    text: 'Soft, absorbent, and the stripe detail makes my bathroom look put together.',
    date: 'July 2026',
  },
  {
    author: 'Victor Han',
    rating: 5,
    text: 'We run a small guest suite and go through towels fast. Four washes in, these still look crisp and dry quickly between bookings.',
    date: 'September 2026',
  },
  {
    author: 'Rosa Camacho',
    rating: 5,
    text: 'The white has stayed white through several washes, nothing has run or grayed. Exactly the hotel look I wanted by the sink.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Thin, but that helps',
    text: "For 180-gram towels they run thin, but honestly that helps them dry out fast in our humid bathroom. Still neat looking.",
    date: 'September 2026',
  },
  {
    author: 'Kurt Malone',
    rating: 4,
    text: "Fluffier than the flat weave ones I'm used to. Only had them a month so durability is still an open question, but first impressions are good.",
    date: 'August 2026',
  },
  {
    author: 'Bethany Cole',
    rating: 4,
    text: "They took a wash to reach their full softness, normal for new cotton in my experience. Since then they've been great, soft and quick to dry.",
    date: 'July 2026',
  },
  {
    author: 'Neil Sandoval',
    rating: 4,
    text: 'I skip fabric softener on towels and these came out plenty soft regardless. Hems are all straight, quality looks consistent across all four.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Fine but not plush',
    text: "Serviceable hand towels and the price is fair, though plush they are not. They do the job at the sink and that is the whole story.",
    date: 'August 2026',
  },
];

// 家族 3：特大浴巾 2 连装 1688-1044064113195（80x160cm 600g，白/灰条 3 PDP）
const TOWEL_BATH_OVERSIZED: ProductReview[] = [
  {
    author: 'Paula Reddick',
    rating: 5,
    text: 'Big enough to actually wrap all the way around. Thick without being heavy. Best towels in our closet right now.',
    date: 'September 2026',
  },
  {
    author: 'Dustin Blair',
    rating: 5,
    text: 'Actual bath-sheet size. They soak up water fast after a shower and never sit around damp long enough to go musty.',
    date: 'August 2026',
  },
  {
    author: 'Marge Kowalski',
    rating: 5,
    text: 'Bought a set last year and just ordered a second. The first pair is still thick and white with dozens of washes behind it.',
    date: 'September 2026',
  },
  {
    author: 'Cal Duffy',
    rating: 5,
    text: 'Washed them before first use like you should with new cotton. They came out fluffier and have stayed soft. No strong detergent smell on arrival either.',
    date: 'July 2026',
  },
  {
    author: 'Ingrid Solberg',
    rating: 5,
    text: "The stripe detail looks expensive in a plain bathroom. Absorbency is the real win though, one pass and you're dry.",
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Drying takes a bit',
    text: 'Thick in the right way, which also means they take a full dryer cycle. Not a flaw exactly, just know it if your machine runs slow.',
    date: 'September 2026',
  },
  {
    author: 'Tessa Grange',
    rating: 4,
    text: 'Used vinegar instead of softener on the first wash like my mother taught me, and they came out extra fluffy. Holding up well so far.',
    date: 'August 2026',
  },
  {
    author: 'Wes Tam',
    rating: 4,
    text: '600 grams each so these are substantial. Only note is our towel hooks were sized for thinner ones, so the pair slides off sometimes.',
    date: 'July 2026',
  },
  {
    author: 'Gilbert Nunez',
    rating: 4,
    text: 'Three weeks in, no loose threads and no gray water in the wash. They still look brand new.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Hem started to loosen',
    text: 'Softness and absorbency are fine, but the hem on one towel started loosening after about six weeks. Still usable, I just expected tighter stitching at this weight.',
    date: 'August 2026',
  },
];

// 家族 4：特大沙滩巾 2 连装 1688-952595759182（75x180cm 550g，四色 cabana 条纹 4 PDP）
const TOWEL_BEACH_2PK: ProductReview[] = [
  {
    author: 'Margot Ellery',
    rating: 5,
    text: 'A shake and the sand just slides off. Huge enough for two kids to share on a beach day.',
    date: 'August 2026',
  },
  {
    author: 'Devon Pryce',
    rating: 5,
    text: 'Long enough to cover a full lounge chair with room to spare, and the terry side soaks up lake water fast.',
    date: 'September 2026',
  },
  {
    author: 'Yusuf Kane',
    rating: 5,
    text: 'Got the red and white stripe. Colors came out bright and have stayed that way through several beach trips and washes.',
    date: 'July 2026',
  },
  {
    author: 'Colleen Byrnes',
    rating: 5,
    text: 'These live in the trunk for spontaneous beach runs. They work as a sit-on mat, a changing wrap, and an actual towel, and the stripes shake clean.',
    date: 'September 2026',
  },
  {
    author: 'Talia Reed',
    rating: 5,
    text: 'Thick enough to double as a blanket when the beach breeze picks up. My toddler napped on one all afternoon.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Wish the stripe were bolder',
    text: 'Great size and they dry remarkably quick outdoors. Wish the stripe colors came through a bit bolder than the photos, mine look a touch softer.',
    date: 'September 2026',
  },
  {
    author: 'Rowan Ellcott',
    rating: 4,
    text: 'Big and soft, though after a full swim I go back for a second pass to get fully dry. Otherwise no issues.',
    date: 'July 2026',
  },
  {
    author: 'Soren Blake',
    rating: 4,
    text: "First wash showed a good amount of lint in the trap, expected with new cotton. Since then zero issues and they've kept their stripe.",
    date: 'August 2026',
  },
  {
    author: 'Petra Voss',
    rating: 4,
    text: "I'm a bigger person and finding a towel that covers me completely is rare. This one does. Absorbent too.",
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Heavier than I expected',
    text: 'Nice towels but at 550 grams each they are beefy to lug in an already packed beach bag. Quality is fine, just heavier than my old ones.',
    date: 'July 2026',
  },
];

// ---- 批 5 W2：地毯垫类 8 家族 + 酒店浴巾 1 家族（2026-10-06，v2 贴源改写）----
// 语料：新增 6 listing（B0CLLMPL6R / B0DRY8J9D3 / B092ML78KS / B0C38YB7SG / B0863S2CH1 / B0F1F5SQJB，48 条）
// + 复用 W1 毛巾语料与兔毛试点语料；链接与允许事实清单见 D:\opencode_workspace\b0-materials\ai-wave2-rugs\harvest.json
// 禁词：Turkish 仅 oriental 家族页面自带宣称可用（其余家族仍禁）；velour/microfiber/Egyptian/Oeko-Tex/GSM 全禁
// 每家族 5×5★+4×4★+1×3★=4.4（8 条家族 4×5+3×4+1×3=4.375、9 条家族 5×5+3×4+1×3=4.44，显示均 4.4）

// 家族：几何地毯 1688-744995685423（100x200cm 0.4cm 低绒防滑，黑白/灰米 2 PDP）
const RUG_GEOMETRIC: ProductReview[] = [
  {
    author: 'Nora Pemberton',
    rating: 5,
    text: 'The black and white pattern is exactly our style. It lays dead flat and holds firm on our laminate, no creeping at all.',
    date: 'September 2026',
  },
  {
    author: 'Jasper Cole',
    rating: 5,
    text: 'Low profile is the winner here, our door swings right over it. Pattern looks crisp, not busy.',
    date: 'August 2026',
  },
  {
    author: 'Ines Varga',
    rating: 5,
    text: 'Softer than expected for something this flat. The geometric print looks great in our living room.',
    date: 'July 2026',
  },
  {
    author: 'Pete Aldridge',
    rating: 5,
    text: 'Sweeps and vacuums easily since it sits so low. The stain resistance got tested by a coffee splash already, wiped right off.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Thin, and that suits it',
    text: 'It is a flat weave, essentially. Under the dining table that is exactly what we wanted, no snagging chair legs. Just set expectations.',
    date: 'August 2026',
  },
  {
    author: 'Wendy Cho',
    rating: 4,
    text: 'Works fine with our couch, and the grip on hardwood is solid.',
    date: 'September 2026',
  },
  {
    author: 'Dmitri Volkov',
    rating: 4,
    text: 'The surface has a soft velvety hand to it. Took a day to adjust to the look, now I like it. No sliding on tile.',
    date: 'July 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'My vacuum grabs it',
    text: 'Pattern is genuinely nice, but the pile is so low my vacuum sucks the corner up when I pass over it. I sweep with a broom now.',
    date: 'August 2026',
  },
];

// 家族：椭圆浴室垫 1688-1064068114006（西萨纹理可机洗，米白/棕 2 PDP）
const BATH_OVAL: ProductReview[] = [
  {
    author: 'Priscilla Hahn',
    rating: 5,
    text: "Soaks up the puddle after my kid's bath and the texture looks way pricier than it was.",
    date: 'September 2026',
  },
  {
    author: 'Deacon Wright',
    rating: 5,
    text: 'The woven look fits our vintage-style bathroom perfectly. Washed it once already, came out fine and kept its shape.',
    date: 'August 2026',
  },
  {
    author: 'Marisol Vega',
    rating: 5,
    text: 'Goes in the wash every week and still looks new. It grips the tile and nobody has slipped on it.',
    date: 'July 2026',
  },
  {
    author: 'Tobias Grange',
    rating: 5,
    text: 'Got the brown for the entryway door. Traps water from rainy shoes and dries out by morning.',
    date: 'September 2026',
  },
  {
    author: 'Elsa Norwood',
    rating: 5,
    text: 'Soft under bare feet, stays put, cute oval shape.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Grips fine, mostly',
    text: 'Very absorbent and the texture is lovely. On our glossy floor it shifts a tiny bit when soaked, though it has never slid far.',
    date: 'September 2026',
  },
  {
    author: 'Hank Sorrell',
    rating: 4,
    text: 'Sized right for a narrow bathroom. The raised weave catches lint from towels occasionally, a quick shake handles it.',
    date: 'August 2026',
  },
  {
    author: 'Bonnie Tate',
    rating: 4,
    text: 'Matches our trim nicely. Dries fast between showers.',
    date: 'July 2026',
  },
  {
    author: 'Iris Chen',
    rating: 4,
    text: "Bought it for the laundry room. Handles drips well; wish the oval ran a touch wider for our space, but that's on my measuring.",
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Stiffer than expected',
    text: 'Absorbent enough, but the woven surface feels stiff under bare feet compared to our old plush mat. Fine by the door, less nice beside the tub.',
    date: 'August 2026',
  },
];

// 家族：圆形户外垫 1688-1052755373494（100x100cm 西萨纹编织耐抓，驼/白 2 PDP）
const RUG_OUTDOOR_ROUND: ProductReview[] = [
  {
    author: 'Colin Mercer',
    rating: 5,
    text: "Sits on our balcony under the bistro set. Looks like real sisal without the scratchiness, and the cat's claws haven't snagged it.",
    date: 'September 2026',
  },
  {
    author: 'Renee Alcott',
    rating: 5,
    text: 'Round shape fits our reading corner exactly. Shake it off, hose it down, good as new.',
    date: 'August 2026',
  },
  {
    author: 'Owen Pratt',
    rating: 5,
    text: "Pet friendly is no joke, our dog naps on it daily and the weave still looks tight.",
    date: 'July 2026',
  },
  {
    author: 'Sylvia Okonkwo',
    rating: 5,
    text: 'We use it by the patio door to catch grass and dirt. Sweeps clean and the camel tone hides everything.',
    date: 'September 2026',
  },
  {
    author: 'Gilberto Cruz',
    rating: 5,
    text: 'Sturdy weave, looks expensive. Held its color all month in afternoon sun on the deck.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Bring it in for storms',
    text: 'Looks great on the patio and the dog approved. We carry it inside when heavy rain is forecast since it is a woven rug, not a plastic straw mat.',
    date: 'September 2026',
  },
  {
    author: 'Tanya Boone',
    rating: 4,
    text: 'Slight texture underfoot, in a good way. Chair legs move across it without catching. Wish it came one size bigger.',
    date: 'August 2026',
  },
  {
    author: 'Harlan Reid',
    rating: 4,
    text: 'Camel color is warm and true to photos. A few loose weave ends on day one, trimmed them and nothing since.',
    date: 'July 2026',
  },
  {
    author: 'Priyanka Nair',
    rating: 4,
    text: "Good weight so it doesn't blow around on the covered porch. Hose cleaning worked exactly like I hoped.",
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Rougher than the photos suggest',
    text: 'The weave has a definite texture to it, not painful but not soft like an indoor rug. Ours lives outside now, which suits it better.',
    date: 'August 2026',
  },
];

// 家族：格纹厨房垫 1688-1038477616596（硅藻土速干防油防滑，复古棕/咖啡 2 PDP）
const MAT_KITCHEN: ProductReview[] = [
  {
    author: 'Georgia Pines',
    rating: 5,
    text: 'Water splashes disappear into it while I do dishes. The checkered pattern suits our farmhouse kitchen.',
    date: 'September 2026',
  },
  {
    author: 'Sam Okada',
    rating: 5,
    text: 'Our robot vacuum bumps it all day and it has not budged an inch. Grips the tile properly.',
    date: 'August 2026',
  },
  {
    author: 'Delia Munroe',
    rating: 5,
    text: 'Oil splatter by the stove wiped right off the surface. It dries out fast overnight too.',
    date: 'July 2026',
  },
  {
    author: 'Randy Sizemore',
    rating: 5,
    text: "Cushioned enough that standing through a long cook session doesn't kill my feet. Looks vintage in the best sense.",
    date: 'September 2026',
  },
  {
    author: 'Pam Deveraux',
    rating: 5,
    text: 'Bought the coffee color for the pantry door. Thin enough that the door clears it, absorbent enough to matter.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Corner curl',
    text: 'Absorbs like promised. After two washes one corner wants to curl up, and I have to press it flat again.',
    date: 'September 2026',
  },
  {
    author: 'Lena Bradshaw',
    rating: 4,
    text: 'Really like the pattern and the grip. It arrived folded, so the crease lines took a few days to relax.',
    date: 'August 2026',
  },
  {
    author: 'Chester Bloom',
    rating: 4,
    text: 'Handles spills great. Only note is it shows crumbs on the light pattern, so I sweep more often than I expected to.',
    date: 'July 2026',
  },
  {
    author: 'Faye Holloway',
    rating: 4,
    text: 'Perfect width for our sink run. It is a firm mat rather than a cushy foam one, which I actually prefer for standing.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Darker than pictured',
    text: 'Works fine and the grip is solid, but the brown came out noticeably darker than the photos. Measure your space too, it runs narrow.',
    date: 'August 2026',
  },
];

// 家族：复古压花厨房毯 1688-1046667161713（硅藻泥吸水橡胶底，多彩/米 2 PDP）
const RUG_KITCHEN: ProductReview[] = [
  {
    author: 'Odette Fuller',
    rating: 5,
    text: 'The embossed pattern is lovely and it genuinely absorbs splashes by the sink. Rubber back grips our wet tile.',
    date: 'September 2026',
  },
  {
    author: 'Ronnie Packard',
    rating: 5,
    text: 'Dropped a mug on it the first week, no chip. The little bit of cushion underneath actually works.',
    date: 'August 2026',
  },
  {
    author: 'Salvatore Greco',
    rating: 5,
    text: 'The beige version brightens our galley kitchen. Stays put even when the floor is damp.',
    date: 'July 2026',
  },
  {
    author: 'Winnie Zhao',
    rating: 5,
    text: 'Soft and springy underfoot. Wipes clean with a damp cloth after messy cooking sessions.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Runs narrow',
    text: 'Nice mat, though it runs narrower than it looked online. Fine for our hallway, check the tape measure first.',
    date: 'August 2026',
  },
  {
    author: 'Gordon Pruitt',
    rating: 4,
    text: 'Absorbs water fast and the backing is serious about not sliding. The multicolor is a bit busier than the photos show.',
    date: 'September 2026',
  },
  {
    author: 'Estelle Kimura',
    rating: 4,
    text: 'Two months in and the colors have not faded despite sun from the kitchen window. Edges lie flat so far.',
    date: 'July 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Fraying at one end',
    text: 'The pattern won me over, but one end started fraying after about a month and a wash. Expectations adjusted, still usable.',
    date: 'August 2026',
  },
];

// 家族：椭圆长绒地毯 1688-996768645117（100x200cm 丝滑长绒，卡其/浅灰/雪白 3 PDP）
const RUG_SHAGGY_OVAL: ProductReview[] = [
  {
    author: 'Aimee Dumas',
    rating: 5,
    text: 'Sink-in soft. The oval shape fits perfectly at the foot of our bed where a rectangle would stick out.',
    date: 'September 2026',
  },
  {
    author: 'Ruben Castillo',
    rating: 5,
    text: 'Our cat slept on it before I even finished unrolling. Snow white brightens the whole corner.',
    date: 'August 2026',
  },
  {
    author: 'Tess Lundgren',
    rating: 5,
    text: 'Silky rather than woolly, more like fur than shag. Gorgeous in the nursery.',
    date: 'July 2026',
  },
  {
    author: 'Bernard Osei',
    rating: 5,
    text: 'Feels great underfoot after a bath, and the plush dries out fast rather than sitting damp.',
    date: 'September 2026',
  },
  {
    author: 'Nell Forrest',
    rating: 5,
    text: 'The khaki tone is warm and hides everything. My kids read on it every evening.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Sheds a little at first',
    text: 'Incredibly soft, though it released some loose fibers during the first week. Nothing noticeable since, and the shade is lovely.',
    date: 'September 2026',
  },
  {
    author: 'Desmond Arch',
    rating: 4,
    text: 'Plush and cozy. It does flatten where the office chair rolls, fluffs back up with a shake.',
    date: 'August 2026',
  },
  {
    author: 'Olive Prescott',
    rating: 4,
    text: 'Gorgeous sheen. Wish it were a touch thicker underfoot, but for the bedside spot it is just right.',
    date: 'July 2026',
  },
  {
    author: 'Callum Frost',
    rating: 4,
    text: 'The light grey matches our bedding exactly. Vacuuming needs a gentle setting on shag like this, no big deal.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Not as dense as pictured',
    text: 'Soft, yes, though the pile is sparser than the photos let on. Works fine as an accent, I just expected more fluff for the size.',
    date: 'August 2026',
  },
];

// 家族：波斯波西米亚地毯 1688-1052742241013（180x250cm 仿羊绒硅胶底 6 色 6 PDP）
const RUG_PERSIAN_BOHO: ProductReview[] = [
  {
    author: 'Alma Reyes',
    rating: 5,
    text: 'The medallion pattern is stunning in person. The sage green version ties our whole living room together.',
    date: 'September 2026',
  },
  {
    author: 'Hollis Barnes',
    rating: 5,
    text: 'The faux cashmere surface is genuinely soft, the kids sit on it constantly. Silicone backing stops it sliding on our hardwood.',
    date: 'August 2026',
  },
  {
    author: 'Junie Atkins',
    rating: 5,
    text: 'Colors are deep and vibrant, not the washed-out print I feared. It anchors the sofa beautifully.',
    date: 'July 2026',
  },
  {
    author: 'Miles Thorne',
    rating: 5,
    text: 'Has a velvety hand that felt unusual at first, now I love it. Vacuums clean without fuss.',
    date: 'September 2026',
  },
  {
    author: 'Sadie Kwan',
    rating: 5,
    text: 'Big enough for the front half of our queen bed. Feet land on soft instead of cold floor every morning.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Thinner than it looks',
    text: 'The print is gorgeous and it lays perfectly flat, though the pile sits low, closer to a flat weave. Fine for us with a pad underneath.',
    date: 'September 2026',
  },
  {
    author: 'Roman Delgado',
    rating: 4,
    text: 'Looked great on arrival but the corners curled for the first day. Heavy books fixed it, and now it sits flush.',
    date: 'August 2026',
  },
  {
    author: 'Ingrid Halvorsen',
    rating: 4,
    text: 'The teal reads a bit more muted than on screen, still lovely with our wood floors. The backing grips well.',
    date: 'July 2026',
  },
  {
    author: 'Perry Nolan',
    rating: 4,
    text: 'Soft and the pattern hides crumbs between vacuums. My only nit is it arrived with a strong fold crease down the middle.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Corners fight back',
    text: 'Gorgeous print and it gets compliments, but the corners have never fully sat flat for us, three weeks and counting. Everything else about it we like.',
    date: 'August 2026',
  },
];

// 家族：做旧东方毯 1688-745181807454（160x230cm 0.4cm 低绒防滑多色 8 PDP）
const RUG_ORIENTAL: ProductReview[] = [
  {
    author: 'Vivian Ashford',
    rating: 5,
    text: 'The distressed medallion looks like something from a pricey vintage shop. Guests always ask about it.',
    date: 'September 2026',
  },
  {
    author: 'Dougal Feeney',
    rating: 5,
    text: 'Amber and teal tones are gorgeous against our grey sofa. Low pile means no tripping at the edge for my mother.',
    date: 'August 2026',
  },
  {
    author: 'Rosalind Piper',
    rating: 5,
    text: 'Lays flat immediately, no curling. The beige multicolor hides crumbs surprisingly well in the dining room.',
    date: 'July 2026',
  },
  {
    author: 'Otis Grady',
    rating: 5,
    text: 'Soft enough to sit on during movie nights, and the non-slip base has kept it planted under our coffee table.',
    date: 'September 2026',
  },
  {
    author: 'Cleo Vandermeer',
    rating: 5,
    text: 'Exactly the vintage look I wanted without vintage prices. The print detail up close is genuinely intricate.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Thin but practical',
    text: 'It is a low, flat rug, which our doors appreciate. That works in a dining space, though it is not a plush rug.',
    date: 'September 2026',
  },
  {
    author: 'Bram Whitlock',
    rating: 4,
    text: 'Colors read slightly more muted in person, which actually suits our space better. It never slides on tile at all.',
    date: 'August 2026',
  },
  {
    author: 'Mae Sutherland',
    rating: 4,
    text: 'Four months in and it still looks crisp. Vacuums easily on the low pile, unlike my old shag.',
    date: 'July 2026',
  },
  {
    author: 'Terrence Boyd',
    rating: 4,
    text: 'Beautiful pattern and it lays flat. It came folded, so give the fold lines a day or two to settle.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Runs a size small',
    text: 'Quality and pattern are lovely, but ours measures a few inches short of the listing. It still works, just measure your space if the fit matters.',
    date: 'August 2026',
  },
];

// 家族：酒店风浴巾 2 连装 1688-743666513356（80x140cm 32 股长绒棉，蓝/灰/米 3 PDP，复用 W1 毛巾语料）
const TOWEL_HOTEL_2PK: ProductReview[] = [
  {
    author: 'Josephine Wu',
    rating: 5,
    text: 'Proper hotel weight. They wrap completely around me and dry me off in one pass.',
    date: 'September 2026',
  },
  {
    author: 'Arthur Sheldon',
    rating: 5,
    text: 'Thick, plush, and the double-stitched hems look like they will outlast my last set by years.',
    date: 'August 2026',
  },
  {
    author: 'Fern Dalloway',
    rating: 5,
    text: 'The blue is a calm, true color. Washed them twice already, still bright with no fading.',
    date: 'July 2026',
  },
  {
    author: 'Miguel Santoro',
    rating: 5,
    text: 'The absorbency is legit, one press against wet skin and you are dry. Bathroom upgrade for the price.',
    date: 'September 2026',
  },
  {
    author: 'Opal Merritt',
    rating: 5,
    text: 'Got the beige pair for the downstairs bath. Soft from the first wash and they fluffed up nicely in the dryer.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Slightly bulky',
    text: 'Lovely and thick, though that means a long dryer cycle. Everything else is exactly as promised.',
    date: 'September 2026',
  },
  {
    author: 'Rex Walcott',
    rating: 4,
    text: 'Very absorbent and well made. Mine arrived with a faint packaging smell that one wash removed completely.',
    date: 'August 2026',
  },
  {
    author: 'Tabitha Row',
    rating: 4,
    text: 'Three weeks of daily use and daily washing, still soft with no fraying at the hems. Would buy the grey next.',
    date: 'July 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Expected beefier',
    text: 'Decent towels, but I expected a heavier feel from the description. Fine for everyday, not the spa slab I pictured.',
    date: 'August 2026',
  },
];

// ---- 批 5 W3：床品小件 3 家族 + B0 无素材 3 家族（2026-10-06，v2 贴源改写）----
// 语料：新增 7 listing（B015PC71LI / B07FYJ5G9N / B07QK9CTXR / B07PCQKTCN / B01LYNW421 / B0DZ2PRB69 / B0G3P5WWZM，56 条）
// 链接与允许事实清单见 D:\opencode_workspace\b0-materials\ai-wave3-bedding\harvest.json；绗缝枕芯复用品类通用主题（自家枕芯语料源同源，防撞车不用）
// 红线：DUVSET-DUVET 是 cotton-like 水洗布（禁写 100% cotton）；embossed-cases 是"仅套"（提醒需另配内芯）
// 每家族 [5×5, 4×4, 3×1] = 4.4；软化条目（3★+1 条 4★）署 Anonymous；短评无标题

// 家族：100% 亚麻被套 LINEN3-DUVET（纽扣封口+角绑带，鼠尾草绿/炭灰/雾蓝/象牙/燕麦 5 PDP）
const LINEN_DUVET: ProductReview[] = [
  {
    author: 'Adele Fontenot',
    rating: 5,
    text: 'Real linen, and it shows. The texture is part of the charm, slightly slubby and completely breathable.',
    date: 'September 2026',
  },
  {
    author: 'Greta Sandvik',
    rating: 5,
    text: 'Sage green lives in our guest room. It has that relaxed rumpled linen look that never needs ironing.',
    date: 'August 2026',
  },
  {
    author: 'Dorian Mays',
    rating: 5,
    text: 'The button closure and corner ties hold my insert exactly where it should be. No midnight escape acts.',
    date: 'July 2026',
  },
  {
    author: 'Imogen Clarke',
    rating: 5,
    text: 'Noticeably softer after the first wash, which the listing promised. Breathes well, no night sweats.',
    date: 'September 2026',
  },
  {
    author: 'Theo Lindqvist',
    rating: 5,
    text: 'The oatmeal shade is warm and honest. Third linen set I have owned and this one is legitimately good value.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Wrinkles are the deal',
    text: 'Linen wrinkles, and this is no exception. I happen to like the lived-in creases, but if crisp is your thing, look elsewhere.',
    date: 'September 2026',
  },
  {
    author: 'Paloma Reyes',
    rating: 4,
    text: 'The dusty blue reads slightly greyer in person. Still beautiful with white sheets. The flax texture is addicting to touch.',
    date: 'August 2026',
  },
  {
    author: 'Sanjay Iyer',
    rating: 4,
    text: 'First wash turned the water a natural flax tan, nothing alarming. The color has held since and the weave feels sturdier than the price suggests.',
    date: 'July 2026',
  },
  {
    author: 'Colette Beaumont',
    rating: 4,
    text: 'The ivory is elegant, slightly deeper than bright white, which I prefer. It softens more with every cycle.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Heavier than expected',
    text: 'Quality is there, but the linen weave has real weight to it. Warm sleepers may find it too warm through summer. Beautiful regardless.',
    date: 'August 2026',
  },
];

// 家族：水洗棉感被套 DUVSET-DUVET（拉链+角绑带，粉/灰/米/白 4 PDP，cotton-like 禁称全棉）
const WASHED_DUVET: ProductReview[] = [
  {
    author: 'Delaney Roth',
    rating: 5,
    text: 'That soft, lived-in feel straight from the wash. The pink is muted and grown-up, not nursery pink.',
    date: 'August 2026',
  },
  {
    author: 'Rafael Otero',
    rating: 5,
    text: 'The zipper beats buttons, full stop. The insert stays put with the corner ties and the whole thing washes without drama.',
    date: 'September 2026',
  },
  {
    author: 'Bianca Feld',
    rating: 5,
    text: 'It genuinely feels pre-washed, no stiffness at all. The white version brightened our guest room instantly.',
    date: 'July 2026',
  },
  {
    author: 'Curtis Mabry',
    rating: 5,
    text: 'The relaxed, slightly crinkled texture is the whole appeal. It looks effortlessly done, like bedding in a magazine.',
    date: 'September 2026',
  },
  {
    author: 'Yara Haddad',
    rating: 5,
    text: 'Breathable and light, perfect for someone who runs warm. The grey matches everything we own.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Color ran lighter',
    text: 'Lovely and soft, but the beige arrived a shade lighter than the photos. It still works with our palette, so it stayed.',
    date: 'September 2026',
  },
  {
    author: 'Nicholas Byrne',
    rating: 4,
    text: 'Soft and comfy with a nice weight. Only knock is that it wrinkles more than I pictured, though that is the washed look by design.',
    date: 'July 2026',
  },
  {
    author: 'Tamsin Welles',
    rating: 4,
    text: 'Fits our queen insert generously. Would love a few more colorways, I would buy a sage in a heartbeat.',
    date: 'August 2026',
  },
  {
    author: 'Odile Perrin',
    rating: 4,
    text: 'Gave it one wash and a low tumble and it came out smooth and quietly expensive looking. The zipper is invisible, nice touch.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Not for crisp lovers',
    text: 'Soft and easy to wash, but the wrinkled look never fully smoothed out for me, even with ironing. My husband minds more than I do.',
    date: 'August 2026',
  },
];

// 家族：水洗棉三件套 1688-916370884976（220x180 被套+2 枕套，双面双色蓝/芝士，机洗 4 PDP）
const COMFORTER_SET: ProductReview[] = [
  {
    author: 'Wells Tibbets',
    rating: 5,
    text: 'The two-tone design is clever, flip it for cheese yellow when the light blue gets boring. Same set, new room.',
    date: 'September 2026',
  },
  {
    author: 'Harriet Blum',
    rating: 5,
    text: 'The washed cotton feels broken-in from day one. Zipper closure is smooth and the corner ties do their job.',
    date: 'August 2026',
  },
  {
    author: 'Kenji Watanabe',
    rating: 5,
    text: 'The light blue is calm and exactly as pictured. Pillowcases fit our standard pillows fine.',
    date: 'July 2026',
  },
  {
    author: 'Flossie Dunmore',
    rating: 5,
    text: 'Washed it twice already, no fading and the texture stays soft. Guest bed sorted.',
    date: 'September 2026',
  },
  {
    author: 'Emmett Calloway',
    rating: 5,
    text: 'Genuinely skin-friendly, no itchiness at all. Light enough for summer, layered fine in spring.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Runs snug',
    text: 'Quality set for the price, though the cover runs a bit snug on our thick comforter. Measure your insert first.',
    date: 'September 2026',
  },
  {
    author: 'Sloane Whitfield',
    rating: 4,
    text: 'The cheese yellow is more mustard in person, which we ended up liking. Reversible is genuinely useful.',
    date: 'August 2026',
  },
  {
    author: 'Anders Holm',
    rating: 4,
    text: 'Soft and breathable, zero static. Wish the pillowcases had the same zipper as the cover.',
    date: 'July 2026',
  },
  {
    author: 'Genevieve Cho',
    rating: 4,
    text: 'The color combo looks more intentional than I expected. Wrinkles relax after a night on the bed.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Thinner than hoped',
    text: 'Nice color and it washes fine, but the fabric is thinner than I imagined. Works over a plush insert, though it is a lightweight cover.',
    date: 'August 2026',
  },
];

// 家族：浮雕超细纤维睡枕 2 连装 b0-bed-pillows（40x70cm 蓬松 3 PDP）
const BED_PILLOWS: ProductReview[] = [
  {
    author: 'Douglas Wrenn',
    rating: 5,
    text: 'Plump straight out of the vacuum bag, and they puffed up even more by day two. Hotel feel for basic money.',
    date: 'September 2026',
  },
  {
    author: 'Marisela Duarte',
    rating: 5,
    text: 'Soft but not mushy. My neck stays supported whether I land on my back or side.',
    date: 'August 2026',
  },
  {
    author: 'Kit Sorenson',
    rating: 5,
    text: 'They squish down nicely then spring right back. Two months on and still no flat spots.',
    date: 'July 2026',
  },
  {
    author: 'Beryl Okafor',
    rating: 5,
    text: 'The embossed cover fabric is smooth and cool, and pillowcases slide over them easily. Good height for my neck.',
    date: 'September 2026',
  },
  {
    author: 'Aaron Wilkes',
    rating: 5,
    text: 'Bought them for the spare room and ended up stealing them for our own bed, which says it all.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Lofty for side sleepers',
    text: 'Well made and plump, though side sleepers may find them a touch tall. Perfect for reading propped up, which is mainly what mine do.',
    date: 'September 2026',
  },
  {
    author: 'Rosalie Chen',
    rating: 4,
    text: 'They read slightly flatter than the photos showed, though 48 hours of fluffing brought them most of the way back.',
    date: 'August 2026',
  },
  {
    author: 'Hugh Danvers',
    rating: 4,
    text: 'Comfortable and evenly filled. One of the two is slightly softer than the other, though you barely notice night to night.',
    date: 'July 2026',
  },
  {
    author: 'Maeve Donnelly',
    rating: 4,
    text: 'No odor at all, which my old pillows could not claim. Cool through the night too.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Fine, not luxury',
    text: 'Decent pillows for a guest room, but I would not call them luxury grade. Support is okay, fluff is okay, everything is just okay.',
    date: 'August 2026',
  },
];

// 家族：绗缝方枕芯 2 连装 b0-inserts-quilted（40x40cm 3 PDP）
const QUILTED_INSERTS: ProductReview[] = [
  {
    author: 'Juniper Wells',
    rating: 5,
    text: 'The quilted stitching keeps the filling from drifting into corners. Covers sit smooth on top.',
    date: 'September 2026',
  },
  {
    author: 'Oskar Lindgren',
    rating: 5,
    text: 'Fits my covers exactly, no baggy corners. Plump but still squishable.',
    date: 'August 2026',
  },
  {
    author: 'Renata Vidos',
    rating: 5,
    text: 'They filled out my decorative covers properly for once. Gave the whole sofa a refresh for little money.',
    date: 'July 2026',
  },
  {
    author: 'Colby Frazier',
    rating: 5,
    text: 'Fluffed up fully in a day after unboxing. The quilting makes them feel more substantial than basic inserts.',
    date: 'September 2026',
  },
  {
    author: 'Elsie Turner',
    rating: 5,
    text: 'Soft yet structured. My toddler uses one as a floor cushion and it keeps its shape.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Wish they were fuller',
    text: 'Nice quilting and true to size, just slightly less full than the photos. Fine for covers with some ease.',
    date: 'September 2026',
  },
  {
    author: 'Graham Sutcliffe',
    rating: 4,
    text: 'Good weight and the stitching looks durable. They relaxed about ten percent after a week of use, still presentable.',
    date: 'August 2026',
  },
  {
    author: 'Imani Brooks',
    rating: 4,
    text: 'They work well in my decorative covers. A short tumble in the dryer fluffed them right up after vacuum sealing.',
    date: 'July 2026',
  },
  {
    author: 'Dominic Farrer',
    rating: 4,
    text: 'Sturdy inserts at a fair price. The quilted pattern shows through thin white covers a bit, worth knowing.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Middle of the road',
    text: 'They are okay inserts, some fullness but not dramatic. They serve their purpose on the bench cushions I made.',
    date: 'August 2026',
  },
];

// 家族：浮雕靠垫套 2 连装 b0-embossed-cases（50x50cm 仅套需另配内芯 3 PDP）
const EMBOSSED_CASES: ProductReview[] = [
  {
    author: 'Alina Petrakis',
    rating: 5,
    text: 'The embossed pattern catches the light beautifully and looks far more expensive than it was.',
    date: 'September 2026',
  },
  {
    author: 'Julian Mercer',
    rating: 5,
    text: 'Put them over standard square inserts and the fit is clean, corners sharp. Exactly the texture refresh our couch needed.',
    date: 'August 2026',
  },
  {
    author: 'Deborah Kingsley',
    rating: 5,
    text: 'Soft microfiber with a subtle sheen. The raised pattern has survived a wash without flattening.',
    date: 'July 2026',
  },
  {
    author: 'Sasha Kimura',
    rating: 5,
    text: 'Bought the neutral pair for the reading nook. They photograph so well I keep rearranging the couch around them.',
    date: 'September 2026',
  },
  {
    author: 'Emiliano Ruiz',
    rating: 5,
    text: 'These are covers only, so factor in inserts. With the right inserts inside they look plump and tailored.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Sheen varies by light',
    text: 'The embossing is lovely up close. The sheen reads stronger in daylight than evening lamplight, worth knowing before you commit.',
    date: 'September 2026',
  },
  {
    author: 'Beatrice Lang',
    rating: 4,
    text: 'Nice texture overall. Slightly thinner fabric than the velvet ones I had, but they wear well so far.',
    date: 'August 2026',
  },
  {
    author: 'Cormac Sheehy',
    rating: 4,
    text: 'The pattern adds depth without shouting. One cover came with a light crease from folding, ironed out low and slow.',
    date: 'July 2026',
  },
  {
    author: 'Tilda Sandoval',
    rating: 4,
    text: 'Great neutral tone. The microfiber attracts pet hair a bit, a roller brush handles it.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Not the look I pictured',
    text: 'Well made, but the embossed texture reads cheaper in person than in the photos. Color was fine, the fabric finish was not for me.',
    date: 'August 2026',
  },
];

// ---- 批 5 W4：杂项 6 家族（2026-10-06，v2 贴源改写：托盘 3 + 挂画 2 + 冰丝被套 1）----
// 语料：B08K77Q7TT / B0891WXY1G / B0GVCX44K6 / B01N7IB8P1（40 条），存档 ai-wave4-misc\harvest.json
// 红线：托盘无把手（禁写 handles）；仅椭圆 family 是陶瓷面；冰丝被套禁写 bamboo（竞品材质）；机洗已宣称可写
// 每家族 [5×5, 4×4, 3×1] = 4.4；软化条目（3★+1 条 4★）署 Anonymous；短评无标题

// 家族：雨滴纹陶瓷藤编椭圆托盘 1688-663341114084（20x11.5cm，黑白/红 2 PDP）
const TRAY_OVAL_CERAMIC: ProductReview[] = [
  {
    author: 'Ottilie Brandt',
    rating: 5,
    text: 'The raindrop pattern is even prettier in person, and the ceramic center wipes clean after appetizers.',
    date: 'September 2026',
  },
  {
    author: 'Dashiell Cole',
    rating: 5,
    text: 'A rattan rim plus a smooth ceramic plate is a nice combo. Sits flat on the table, nothing rocks.',
    date: 'August 2026',
  },
  {
    author: 'Mabel Kensington',
    rating: 5,
    text: 'Perfect size for olives and nuts by the drinks. Guests always ask where it is from.',
    date: 'July 2026',
  },
  {
    author: 'Silas Whitaker',
    rating: 5,
    text: 'Got the red version for holiday snacks. The weave is tight and the plate feels sturdy.',
    date: 'September 2026',
  },
  {
    author: 'Tallulah Bates',
    rating: 5,
    text: 'It looks handmade because the details are neat. Using it as a catch-all by the door.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Smaller than imagined',
    text: 'Lovely piece, but it is a compact oval, more of a snack tray than a serving platter. Check the measurements.',
    date: 'September 2026',
  },
  {
    author: 'Eloise Tunney',
    rating: 4,
    text: 'Black and white suits our table. The ceramic surface has no rough spots, though I hand wash it to be safe.',
    date: 'August 2026',
  },
  {
    author: 'Alistair Moore',
    rating: 4,
    text: 'Well made and photogenic. Mine had a small weave thread sticking out, trimmed the stray thread and no issue since.',
    date: 'July 2026',
  },
  {
    author: 'Cosette Girard',
    rating: 4,
    text: 'Pretty enough to leave out permanently. The oval suits our narrow table better than round trays did.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Handle with care',
    text: 'Pretty design, but the ceramic feels delicate and the one I received has a small chip on the rim. Fine for dry snacks, I would not trust it with heavy use.',
    date: 'August 2026',
  },
];

// 家族：非洲几何挂画 1688-807393887857（亚麻布面木框 33x33cm，可挂可立 5 PDP）
const WALL_ART_GEOMETRIC: ProductReview[] = [
  {
    author: 'Maren Kowalczyk',
    rating: 5,
    text: "The geometric motif has real presence on the wall. The linen texture adds warmth you don't get from a print.",
    date: 'September 2026',
  },
  {
    author: 'Emory Dilworth',
    rating: 5,
    text: 'It sits on our entryway shelf and looks like a boutique find. The wood frame is solid.',
    date: 'August 2026',
  },
  {
    author: 'Isla Turnbull',
    rating: 5,
    text: 'Bought the brown for above the console. Earthy tones, exactly as pictured.',
    date: 'July 2026',
  },
  {
    author: 'Finn Gallagher',
    rating: 5,
    text: 'Light enough to hang with a single nail. The basket pattern reads clearly from across the room.',
    date: 'September 2026',
  },
  {
    author: 'Odessa Kane',
    rating: 5,
    text: 'This is my second piece in the style, they group nicely together. The canvas has a nice woven hand.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Darker in person',
    text: 'Striking design, though the tones run a bit darker in person. Works in our dim hallway either way.',
    date: 'September 2026',
  },
  {
    author: 'Rory Blackwood',
    rating: 4,
    text: 'Well made for the price. The frame corners are clean; I only wish the hanging hardware came installed.',
    date: 'August 2026',
  },
  {
    author: 'Aurora Lindholm',
    rating: 4,
    text: 'Looks great leaned on a shelf instead of hung, the standing option is handy. Canvas is properly taut.',
    date: 'July 2026',
  },
  {
    author: 'Reuben Ashby',
    rating: 4,
    text: 'The motif repeats nicely if you pair two sizes. Colors are muted enough not to fight the room.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Smaller than it reads',
    text: 'Nice quality but it is genuinely small on a large wall. Measure twice, it suits a gallery cluster more than a statement spot.',
    date: 'August 2026',
  },
];

// 家族：非洲编织篮纹挂画 1688-730512046265（亚麻布面实木框 48x48cm，棕/多彩 6 PDP）
const WALL_ART_BASKET: ProductReview[] = [
  {
    author: 'Imelda Castro',
    rating: 5,
    text: 'The woven basket design is beautifully detailed up close. Warm earth tones ground the whole room.',
    date: 'September 2026',
  },
  {
    author: 'Casper Nygaard',
    rating: 5,
    text: 'The big square format is a proper statement size. The solid wood frame feels sturdy, not poster-thin.',
    date: 'August 2026',
  },
  {
    author: 'Magdalena Vrba',
    rating: 5,
    text: 'Bought two different motifs for the dining room wall. They hang level and the linen surface kills glare.',
    date: 'July 2026',
  },
  {
    author: 'Hugo Ferreira',
    rating: 5,
    text: 'It looks like a real basket mounted on the wall. Guests have literally touched it to check.',
    date: 'September 2026',
  },
  {
    author: 'Sunniva Dahl',
    rating: 5,
    text: 'The brown frame matches our rattan furniture perfectly. Global style done right.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Texture is subtle',
    text: 'From a distance it reads as a painting, up close the woven fabric texture shows. I like it, just quieter than expected.',
    date: 'September 2026',
  },
  {
    author: 'Lionel Prasad',
    rating: 4,
    text: 'Well packed, corners arrived clean. The earth tones lean slightly orange in warm light.',
    date: 'August 2026',
  },
  {
    author: 'Vera Nyman',
    rating: 4,
    text: 'It adds exactly the boho warmth our hallway needed. Hanging it took two minutes with the hardware included.',
    date: 'July 2026',
  },
  {
    author: 'Abel Thornton',
    rating: 4,
    text: 'Good weight to it. Mine sits slightly off-level on its hanger, probably our wall, but worth noting.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Expected more pop',
    text: 'Craftsmanship is fine, but the colors are muted to the point of fading into our beige wall. Should have picked the multicolor.',
    date: 'August 2026',
  },
];

// 家族：藤编长方托盘绿叶纹 1688-743606980882（37x23cm 7 色 10 PDP）
const TRAY_RECT_LEAF: ProductReview[] = [
  {
    author: 'Annika Sorel',
    rating: 5,
    text: 'The leaf pattern is charming without being kitschy. It fits the coffee table with room for a candle beside it.',
    date: 'September 2026',
  },
  {
    author: 'Marco Bellandi',
    rating: 5,
    text: 'Sturdy weave, no splinters, and it holds four mugs plus a plate steady.',
    date: 'August 2026',
  },
  {
    author: 'Delphine Aubert',
    rating: 5,
    text: 'Got the natural color for bread at dinner. A damp cloth takes care of crumbs.',
    date: 'July 2026',
  },
  {
    author: 'Serge Aubin',
    rating: 5,
    text: 'The rectangular shape fits the ottoman perfectly. The raised rim keeps remotes from sliding off.',
    date: 'September 2026',
  },
  {
    author: 'Petronella Wild',
    rating: 5,
    text: 'The blue and yellow stripe brightens the kitchen island. Neighbors asked about it within a day.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Weave has gaps',
    text: 'Looks great and feels solid, though the weave has small gaps, so crumbly snacks sit on a plate inside rather than directly.',
    date: 'September 2026',
  },
  {
    author: 'Harvey Nilsson',
    rating: 4,
    text: 'Nice craftsmanship. The green looks great on our console table.',
    date: 'August 2026',
  },
  {
    author: 'Bettina Roth',
    rating: 4,
    text: 'It holds tea for two steadily. A slight wobble on our uneven floors, felt pads solved it.',
    date: 'July 2026',
  },
  {
    author: 'Camille Duret',
    rating: 4,
    text: 'The rectangular size is genuinely useful, longer than most trays at this price. Corners are neat.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Slightly warped',
    text: 'The pattern is lovely but mine sits with a slight warp and wobbles on the table. Maybe mine was an off day at the workshop.',
    date: 'August 2026',
  },
];

// 家族：藤编圆托盘绿叶贝纹 1688-899672152256（28x28cm 开放浅篮 4 色 10 PDP）
const TRAY_ROUND_LEAF: ProductReview[] = [
  {
    author: 'Liesel Mahler',
    rating: 5,
    text: 'The round leaf center looks like pressed botanical art. Fruit looks fancy in it, somehow.',
    date: 'September 2026',
  },
  {
    author: 'Piotr Zielinski',
    rating: 5,
    text: 'The shallow depth means everything stays visible, just what my kitchen counter needed.',
    date: 'August 2026',
  },
  {
    author: 'Amelie Rousse',
    rating: 5,
    text: '28 centimeters is a good coffee-table size. The green rim ties in our plants.',
    date: 'July 2026',
  },
  {
    author: 'Barnaby Quill',
    rating: 5,
    text: 'Use it for oranges on the counter. The open weave lets air circulate, so nothing goes soft quickly.',
    date: 'September 2026',
  },
  {
    author: 'Fenella Gross',
    rating: 5,
    text: 'Sturdier than I expected for woven rattan. It shrugs off daily handling.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Mind the size',
    text: 'Lovely craftsmanship, though it is closer to a generous plate than a platter. Works for us as a fruit basket.',
    date: 'September 2026',
  },
  {
    author: 'Otto Brandvold',
    rating: 4,
    text: 'The shell pattern center is tight and even. One weave end was loose, tucked it back in and done.',
    date: 'August 2026',
  },
  {
    author: 'Wilhelmina Hart',
    rating: 4,
    text: 'The natural brown matches our wooden counters. It rocks a hair on an uneven spot, otherwise sits flat.',
    date: 'July 2026',
  },
  {
    author: 'Dario Ferrante',
    rating: 4,
    text: 'It looks coastal without being theme-y. Wiped a juice spill off the woven rim without a stain.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Smaller in person',
    text: 'Cute piece but the photos make it look bigger. At this size it is more decor than serving ware for a family.',
    date: 'August 2026',
  },
];

// 家族：冰丝双面凉感被套 1688-1048207560416（220x180cm 双色可翻转，奶昔白/奶油绿 2 PDP）
const ICE_SILK_DUVET: ProductReview[] = [
  {
    author: 'Seraphina Kade',
    rating: 5,
    text: 'The ice silk finish feels cool the second you touch it. Hot sleeper approved.',
    date: 'September 2026',
  },
  {
    author: 'Lorcan Bailey',
    rating: 5,
    text: 'Reversible is the killer feature, milkshake white one week, cream green the next.',
    date: 'August 2026',
  },
  {
    author: 'Anouk Visser',
    rating: 5,
    text: 'Silky without being slippery. The cover glides over the insert and smooths out by itself.',
    date: 'July 2026',
  },
  {
    author: 'Griffin Hale',
    rating: 5,
    text: 'Washed it cold, hung it dry, zero wrinkles. It stays cool all night in our warm bedroom.',
    date: 'September 2026',
  },
  {
    author: 'Mira Solberg',
    rating: 5,
    text: 'Light as air but my duvet still feels covered and cozy. Perfect for summer.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 4,
    title: 'Wants more ties',
    text: 'Cooling works as promised. I only wish it had more interior ties, my insert shifts a little by morning.',
    date: 'September 2026',
  },
  {
    author: 'Rocco Villani',
    rating: 4,
    text: 'Smooth and genuinely cool to the touch. The cream green is softer in person, almost sage.',
    date: 'August 2026',
  },
  {
    author: 'Maxine Ferrier',
    rating: 4,
    text: 'Great summer cover. It is thin by design, so pair it with a lighter insert rather than a heavy one.',
    date: 'July 2026',
  },
  {
    author: 'Isadora Pinter',
    rating: 4,
    text: 'Two months in, still smooth with no pilling. Machine wash cold and it holds up fine.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Very thin material',
    text: 'The cooling feel is real, but the material is the thinnest cover I have owned. Fine for hot months, I will switch to linen come winter.',
    date: 'August 2026',
  },
];

// ── 批 5 W5（2026-10-06）：床品套装收官（4件套/微纤维3件套/亚麻3件套/冰丝被套/蛋壳盒颈枕）
// 语料：Bedsure 4pc B0CWGXYX1C 4.4★/343、Bare Home 3pc B01N0QXKF2 4.5★/9.2K、
//       Bedsure PureWoven B0FQV2M874 4.4★/145、SAIREIDER B0CL9SXSBD 4.6★/3K（+复用 wave3 linen 语料）
// 红线：BEDSET4/DUVSET=microfiber 禁 cotton；LINEN3=100% linen 可写；ICE 禁 bamboo/绑带；EGG 是 cord lock 非 snap
const BEDSET4_SETS: ProductReview[] = [
  {
    author: 'Tanya Rebello',
    rating: 5,
    title: 'Great matching set',
    text: 'Ordered the sage one with the little white flowers and it is even softer than the listing suggests. Duvet cover, fitted sheet, two cases, done. The bed instantly looks put together.',
    date: 'September 2026',
  },
  {
    author: 'Marcus Webb',
    rating: 5,
    text: 'Washed everything before use, zero fading and the gray plaid still looks crisp. At this price a complete set is honestly hard to beat.',
    date: 'September 2026',
  },
  {
    author: 'Elodie Frank',
    rating: 5,
    text: 'The fitted sheet actually stays put through the night, corners have not popped off once. Rare for our bed.',
    date: 'October 2026',
  },
  {
    author: 'Derek Osei',
    rating: 5,
    title: 'Crisp white set',
    text: 'The white set went into the spare room; it photographs like a hotel. Making the bed takes two minutes because everything matches.',
    date: 'August 2026',
  },
  {
    author: 'Priya Raghavan',
    rating: 5,
    text: 'Light enough for our humid summers but still cozy with a blanket in winter. The microfiber breathes better than I expected.',
    date: 'September 2026',
  },
  {
    author: 'Colton Hayes',
    rating: 4,
    title: 'Comforter shifts a little',
    text: 'My only gripe is the comforter bunches slightly between the interior ties near the foot end. Otherwise soft, true to picture, and the pink is a lovely muted shade.',
    date: 'August 2026',
  },
  {
    author: 'Ingrid Salvesen',
    rating: 4,
    text: 'Warm without overheating, which is the balance I never get right. Held up fine through two washes so far.',
    date: 'September 2026',
  },
  {
    author: 'Ramona Ortiz',
    rating: 4,
    text: 'Mostly smooth out of the dryer with a light wrinkle or two. The white brightened the whole room.',
    date: 'October 2026',
  },
  {
    author: 'Felix Tanaka',
    rating: 4,
    text: 'Ships vacuum packed so let it air out a day. Color matched the listing exactly and the zipper feels sturdy.',
    date: 'August 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Decent for a spare bed',
    text: 'After two washes the darker pillowcases started pilling a bit, honestly. The duvet cover itself still looks decent. Acceptable for a spare bedroom, but I expected slightly better fabric.',
    date: 'July 2026',
  },
];

const DUVSET_SETS: ProductReview[] = [
  {
    author: 'Yvonne Castellano',
    rating: 5,
    title: 'Survived my rental',
    text: 'Furnishing a rental and needed something that survives strangers. The zipper and corner ties keep the insert locked in, and it has washed twice with no fading.',
    date: 'September 2026',
  },
  {
    author: 'Harvey Lindqvist',
    rating: 5,
    text: 'The gray is exactly like the photo. Unwrinkled straight from the dryer, barely needed ironing.',
    date: 'October 2026',
  },
  {
    author: 'Dana Whitfield',
    rating: 5,
    text: 'A hidden zipper makes all the difference after years of button covers that gapped. The insert slides in without a wrestling match.',
    date: 'August 2026',
  },
  {
    author: 'Omar Haddad',
    rating: 5,
    text: 'Got the blush pink for my daughter and she loves it. Soft, and it did not shrink one bit in the wash.',
    date: 'September 2026',
  },
  {
    author: 'June Calloway',
    rating: 5,
    text: 'Wrinkle resistant is no joke, it leaves the dryer looking nearly pressed. Lightweight but still feels like a proper cover.',
    date: 'October 2026',
  },
  {
    author: 'Beatrix Kovac',
    rating: 4,
    title: 'Wish there were more ties',
    text: 'Two interior ties hold the comforter reasonably well, but a couple more would stop the shifting at the foot entirely. The beige is a beautiful warm neutral.',
    date: 'August 2026',
  },
  {
    author: 'Saul Moreno',
    rating: 4,
    text: 'Thin enough to sleep under in summer, and we layer a quilt over it in winter. Versatile for the price.',
    date: 'September 2026',
  },
  {
    author: 'Wren Delacroix',
    rating: 4,
    text: 'Had the usual packaged smell, so it aired out overnight and went through one wash. Perfect since.',
    date: 'August 2026',
  },
  {
    author: 'Tobias Merritt',
    rating: 4,
    text: 'The zipper feels lighter than my old cover but has survived three washes without complaint. Color looks great too.',
    date: 'October 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Softer than expected but thin',
    text: 'The hand feel is nice, though the material feels more lightweight than the listing let on. It works well in the guest room where the bed sits mostly made. I would hesitate to make it our everyday cover.',
    date: 'July 2026',
  },
];

const LINEN3_SETS: ProductReview[] = [
  {
    author: 'Marguerite Lyle',
    rating: 5,
    title: 'Real linen texture',
    text: 'You can see and feel the slubby weave the moment it arrives. Every wash makes it softer, and the oatmeal shade gives our bedroom that relaxed farmhouse feel.',
    date: 'September 2026',
  },
  {
    author: 'Anders Vik',
    rating: 5,
    text: 'I run hot at night and linen finally solved it. Airy, never clammy, cool enough to sleep through.',
    date: 'August 2026',
  },
  {
    author: 'Rosa Camacho',
    rating: 5,
    text: 'Matching pillowcases included, so the whole bed looks styled instead of assembled. The charcoal is deep and even.',
    date: 'October 2026',
  },
  {
    author: 'Eli Thackeray',
    rating: 5,
    title: 'Great for the cabin',
    text: 'The naturally wrinkled drape is exactly the vibe for our cabin. Guests keep asking where the bedding is from, which I take as the highest compliment.',
    date: 'September 2026',
  },
  {
    author: 'Noor Alvi',
    rating: 5,
    text: 'Second set I have bought, ivory this time after the sage. Both have been through the wash more times than I can count and still look good.',
    date: 'August 2026',
  },
  {
    author: 'Gwen Pritchard',
    rating: 4,
    title: 'Wrinkles are part of it',
    text: 'Straight from the washer it looks crumpled, but on the bed most of it relaxes out. If you want crisp, linen is not your fabric. I love the lived-in feel.',
    date: 'September 2026',
  },
  {
    author: 'Louis Beaumont',
    rating: 4,
    text: 'Lighter than I pictured, perfect for summer. I will add a blanket layer when winter arrives and see how it holds up.',
    date: 'October 2026',
  },
  {
    author: 'Saskia Vermeer',
    rating: 4,
    text: 'Ended up loving the dusty blue against our wood furniture. Air dries without stiffness.',
    date: 'August 2026',
  },
  {
    author: 'Theo Brandt',
    rating: 4,
    text: 'Cases fit standard pillows snugly with no sliding out overnight. One corner seam is a touch uneven, purely cosmetic.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Takes patience',
    text: 'When it first arrived the texture felt rough to me, and weeks of washing later it is softer but still stiffer than the cotton sheets I grew up with. The breathability is genuinely excellent, so it stays as our summer bedding.',
    date: 'July 2026',
  },
];

const ICE_DUVET_COVERS: ProductReview[] = [
  {
    author: 'Celeste Marino',
    rating: 5,
    title: 'Finally sleeping cool',
    text: 'First night under it and the difference was immediate. It feels chilled all over, like the cold side of the pillow but for your whole body.',
    date: 'September 2026',
  },
  {
    author: 'Kwame Boateng',
    rating: 5,
    text: 'Dorm essential. Slipped it over my comforter and my roommate ordered one the same week.',
    date: 'August 2026',
  },
  {
    author: 'Astrid Holm',
    rating: 5,
    text: 'Silky without being slick. The cover stays where you put it and the smoothness is somehow calming at bedtime.',
    date: 'October 2026',
  },
  {
    author: 'Imani Brooks',
    rating: 5,
    text: 'Washed cold, hung to dry, came off with no wrinkles and the milk tea shade still looks brand new.',
    date: 'September 2026',
  },
  {
    author: 'Diego Fuentes',
    rating: 5,
    text: 'The second your skin touches it there is this little chill, and it does not fade through the night. Summer sleeping has genuinely improved.',
    date: 'August 2026',
  },
  {
    author: 'Lena Petrova',
    rating: 4,
    title: 'Just the cover',
    text: 'Read the listing twice or you will miss that it ships as a cover only, no insert. With a comforter inside it is just the thing for hot months.',
    date: 'September 2026',
  },
  {
    author: 'Jasper Ng',
    rating: 4,
    text: 'Noticeably lighter than the cotton cover it replaced. Perfect for summer, though I suspect I will want something heavier come January.',
    date: 'August 2026',
  },
  {
    author: 'Marisol Vega',
    rating: 4,
    text: 'Color matched the photos and the fabric really does feel cool when you slide into bed. Took one wash to reach peak softness.',
    date: 'October 2026',
  },
  {
    author: 'Otto Lindgren',
    rating: 4,
    text: 'Arrived with a light packaged smell; a single wash erased it completely. My daughter claims it as the best thing on her bed.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Cooling is real, thinness too',
    text: 'The cool touch is not marketing, it genuinely feels chilled on contact. Yet the material is quite thin, enough for the seams of the comforter underneath to be noticeable. Fine value for the money, just know what you are getting.',
    date: 'July 2026',
  },
];

const EGG_CASE_PILLOWS: ProductReview[] = [
  {
    author: 'Nadia Rahman',
    rating: 5,
    title: 'Fourteen hours, no head bob',
    text: 'Long-haul test passed. The cord lock lets me set the height exactly and my head never did the embarrassing forward slump once.',
    date: 'September 2026',
  },
  {
    author: 'Colin Fairbanks',
    rating: 5,
    text: 'Rolls into its little shell case and clips to my backpack. Light enough that I forget it is there until I need it.',
    date: 'August 2026',
  },
  {
    author: 'Zelda Marsh',
    rating: 5,
    text: 'I have squished this thing half to death and it springs back every single time. As a side sleeper the chin support finally feels right.',
    date: 'October 2026',
  },
  {
    author: 'Antonio Ruiz',
    rating: 5,
    text: 'The cover unzips, went through a cold wash and hang dry, and came back feeling brand new. Most travel pillows never survive that.',
    date: 'September 2026',
  },
  {
    author: 'May Ito',
    rating: 5,
    text: 'I keep it at my desk for lunch-break naps. The two sides feel different, one smoother and one softer, and both are comfortable.',
    date: 'August 2026',
  },
  {
    author: 'Priyanka Nair',
    rating: 4,
    title: 'Clever design',
    text: 'A touch firmer would earn the fifth star from me, but the reversible cover and the slide adjuster make this the most considered travel pillow I have owned.',
    date: 'September 2026',
  },
  {
    author: 'Gordon Pryce',
    rating: 4,
    text: 'I have a thicker neck than most and it still works, the cord lock gives just enough range. The sage color is a nice change from black everything.',
    date: 'October 2026',
  },
  {
    author: 'Beatrice Ouimet',
    rating: 4,
    text: 'Brought it on a night train instead of flying and slept against the window like a civilized person. The case keeps it clean in the bag between trips.',
    date: 'August 2026',
  },
  {
    author: 'Hugo Almeida',
    rating: 4,
    text: 'A bit bulkier packed than I hoped, but the foam recovered fully by morning after being squashed in my suitcase for a week.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Supportive but small',
    text: 'The foam is genuinely comfortable and the cover washes well, but the pillow runs smaller than it looks in the pictures. My ears sit right at the edges, so it is fine for short hops and less great for long hauls.',
    date: 'July 2026',
  },
];

// ── 批 5 W6（2026-10-06）：漏网家族补齐（毛毯 23 PDP / 棉浴垫 / 门垫 / 硅藻土×2 / 车筐 / 香薰炉 / 油画椅垫 / 胡椒磨）
// 语料：Mibao 门垫 B0BJ2JLMCG 4.4★/9.3K、藤编车筐 B0CS699582 4.7★/141、坩埚香薰炉 B08QN2QBX2 4.7★/1.3K、
//       希腊胡椒磨 B0BXFSJ3KY 4.1★/130、花卉椅垫 B07BG48DBD 4.7★/2.5K（+复用 pilot 兔毛 / wave2 浴垫厨房垫语料）
// 红线：门垫是 imitation sisal 禁称真剑麻；毛毯是 blanket 禁地毯用法；椅垫 indoor 禁户外防水；黄铜禁"永不氧化"
const FUR_THROW_BLANKET: ProductReview[] = [
  {
    author: 'Ottilie Carlson',
    rating: 5,
    title: 'Even softer in person',
    text: 'Draped it over my reading chair and it pools like a much pricier throw. The blue is deep and rich, and the pile is denser than the price tag promises.',
    date: 'September 2026',
  },
  {
    author: 'Bram Whitlock',
    rating: 5,
    text: 'Movie night staple now. It holds warmth without any of the weight, which my knees appreciate.',
    date: 'August 2026',
  },
  {
    author: 'Suki Tanemura',
    rating: 5,
    text: 'One cold gentle cycle and a flat dry later, it came out just as plush as day one. No matting at all.',
    date: 'October 2026',
  },
  {
    author: 'Delia Voss',
    rating: 5,
    text: 'Bought it for my mom. She called me assuming I had spent triple. That is the entire review.',
    date: 'September 2026',
  },
  {
    author: 'August Reyes',
    rating: 5,
    text: 'Both cats have claimed it and knead it nightly. Zero snagged runs so far, which is more than I can say for my last throw.',
    date: 'August 2026',
  },
  {
    author: 'Isla Buchanan',
    rating: 4,
    title: 'Sheds at first',
    text: 'Light shedding the first week, mostly handled with a lint roller, and it has calmed down since. Otherwise the softest thing in the house.',
    date: 'September 2026',
  },
  {
    author: 'Desmond Okafor',
    rating: 4,
    text: 'Gorgeous but it attracts pet hair like a magnet. I keep it for the couch corner and accept the grooming routine that comes with it.',
    date: 'October 2026',
  },
  {
    author: 'Petra Lindholm',
    rating: 4,
    text: 'The blue reads softer than in the listing images, though it suits the room anyway. Deep and cozy for evenings.',
    date: 'August 2026',
  },
  {
    author: 'Rafi Beck',
    rating: 4,
    text: 'Heavier than the fleece throw it replaced. That weight feels like real luxury on movie nights.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Soft but needs upkeep',
    text: 'It shed quite a bit at first and the fibers flatten wherever the dog sleeps on it. Washing is fine and it stays soft, but expect some maintenance to keep the showroom look. Looks lovely draped over the armchair between cleanings.',
    date: 'July 2026',
  },
];

const COTTON_BATH_MATS: ProductReview[] = [
  {
    author: 'Margot Ellison',
    rating: 5,
    title: 'Soft and thick',
    text: 'Thick cotton terry underfoot and the little footprint pattern keeps it from looking plain. Our bathroom finally feels finished.',
    date: 'September 2026',
  },
  {
    author: 'Hank Sorensen',
    rating: 5,
    text: 'Two kids, two baths a night, and the floor outside the tub stays dry. These soak up everything.',
    date: 'August 2026',
  },
  {
    author: 'Amara Diallo',
    rating: 5,
    text: 'Three washes in and they are still white, still fluffy. No unraveling edges.',
    date: 'October 2026',
  },
  {
    author: 'Pete Kowalczyk',
    rating: 5,
    text: 'The rubbery underside grips our slick tile properly. Nobody has done the cartoon slide since these went down.',
    date: 'September 2026',
  },
  {
    author: 'Bianca Torres',
    rating: 5,
    text: 'Dries out between showers, so the damp towel smell never gets a foothold.',
    date: 'August 2026',
  },
  {
    author: 'Stuart McAllister',
    rating: 4,
    title: 'Lint settles down',
    text: 'Expect loose lint early on, then it stops. After that they have been soft, absorbent, and trouble-free.',
    date: 'September 2026',
  },
  {
    author: 'Yuki Osawa',
    rating: 4,
    text: 'A lighter pile than true hotel mats, though that makes them dry out faster in our windowless bathroom.',
    date: 'October 2026',
  },
  {
    author: 'Cecilia Archer',
    rating: 4,
    text: 'I wanted something thicker, honestly. Still soft, still thirsty, and the pair was well priced, so zero regrets.',
    date: 'August 2026',
  },
  {
    author: 'Roman Fields',
    rating: 4,
    text: 'The corners curl slightly after a wash but settle flat underfoot within a day.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Thinner than hoped',
    text: 'They shed noticeably at first and feel thinner than the listing implies. They do stay put, wash fine, and dry quickly, though. Decent spare-bathroom mats, just manage expectations.',
    date: 'July 2026',
  },
];

const SISAL_DOOR_MATS: ProductReview[] = [
  {
    author: 'Priscilla Adeyemi',
    rating: 5,
    title: 'Easy to trim',
    text: 'Trimmed it to fit our odd hallway alcove with ordinary scissors and the edge stayed clean. Looks like it was made for the spot.',
    date: 'September 2026',
  },
  {
    author: 'Kurt Weiss',
    rating: 5,
    text: 'Slim enough that the back door swings clean over it. No catching, no bunched-up corners.',
    date: 'August 2026',
  },
  {
    author: 'Hattie Lang',
    rating: 5,
    text: 'This thing traps the grit that used to trek in from the mudroom. A weekly shake-out over the porch and it looks reset.',
    date: 'October 2026',
  },
  {
    author: 'Vince Caruso',
    rating: 5,
    text: 'The camel brown hides everything, and the weave texture reads far above its price.',
    date: 'September 2026',
  },
  {
    author: 'Mona Shetty',
    rating: 5,
    text: 'Zero creep on our hardwood floors. It stays exactly where the shoe traffic needs it.',
    date: 'August 2026',
  },
  {
    author: 'Oscar Tulstrup',
    rating: 4,
    title: 'Coarse weave, on purpose',
    text: 'Textured underfoot, rougher than a plush mat, but that is the entryway look I wanted and the grit falls into it instead of the house.',
    date: 'September 2026',
  },
  {
    author: 'Renee Blackwood',
    rating: 4,
    text: 'The vacuum picks it up fine, though a shake outdoors does most of the work in half the time.',
    date: 'August 2026',
  },
  {
    author: 'Ted Albrecht',
    rating: 4,
    text: 'There was a light chemical whiff for two days, then nothing. Grip is excellent on tile.',
    date: 'October 2026',
  },
  {
    author: 'Faiza Nasser',
    rating: 4,
    text: 'Notched it around the radiator pipe by the door frame and it sits like a custom install.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Fine with caveats',
    text: 'The weave sheds tiny fibers the first week and the mat came creased from its rolled packaging. It flattened out under a week and traps dirt well enough, so it stays by the door, but go in with tempered expectations early on.',
    date: 'July 2026',
  },
];

const DE_OVAL_BATH_MAT: ProductReview[] = [
  {
    author: 'Tessa Grunwald',
    rating: 5,
    title: 'Really absorbs',
    text: 'Step out of the shower and the water is simply gone. The surface never turns into a swamp the way our old fabric mat did.',
    date: 'September 2026',
  },
  {
    author: 'Amir Delgado',
    rating: 5,
    text: 'Kids splash like they are being paid to. This mat is dry again before the next shower, every time.',
    date: 'August 2026',
  },
  {
    author: 'Nova Christie',
    rating: 5,
    text: 'The oval shape hugs the curve of our vanity perfectly. Looks intentional, not an afterthought.',
    date: 'October 2026',
  },
  {
    author: 'Luther Paige',
    rating: 5,
    text: 'The rubber backing locks it onto wet tile. Zero slide, which matters with two grandparents visiting.',
    date: 'September 2026',
  },
  {
    author: 'Soleil Marchetti',
    rating: 5,
    text: 'Feels smooth and firm rather than squishy, like a soft stone. Weirdly pleasant and very quick to dry.',
    date: 'August 2026',
  },
  {
    author: 'Dev Kapoor',
    rating: 4,
    title: 'Monthly rinse routine',
    text: 'A quick rinse in the tub once a month keeps it fresh, and it dries within the hour. Low effort upkeep.',
    date: 'September 2026',
  },
  {
    author: 'Kira Molnar',
    rating: 4,
    text: 'Faint mineral smell on day one, gone after airing overnight. Absorption is legitimately impressive.',
    date: 'August 2026',
  },
  {
    author: 'Wes Alonso',
    rating: 4,
    text: 'The edges caught my toes the first several days until it settled flat. No issues since.',
    date: 'October 2026',
  },
  {
    author: 'Ines Cortez',
    rating: 4,
    text: 'Makeup and toothpaste splashes wipe right off. It always looks clean, which is new for a bath mat.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Firm, not plush',
    text: 'This is not a soft fluffy mat, it is firm underfoot like a smooth pad. It absorbs superbly and dries fast, so I kept it by the shower, but I do miss the cushy feeling of terry. Trade-off worth knowing about.',
    date: 'July 2026',
  },
];

const DE_KITCHEN_RUNNER: ProductReview[] = [
  {
    author: 'Paloma Reyes',
    rating: 5,
    title: 'Easier on my legs',
    text: 'I stand at the sink for an hour most evenings and my legs notice the cushioning. Water splashes vanish into it.',
    date: 'September 2026',
  },
  {
    author: 'Curtis Boyd',
    rating: 5,
    text: 'Frying splatter wipes straight off, no greasy film setting in. That alone earns the stars.',
    date: 'August 2026',
  },
  {
    author: 'Anja Kessler',
    rating: 5,
    text: 'Trimmed both pieces to fit our galley path with scissors. Clean edges, custom look.',
    date: 'October 2026',
  },
  {
    author: 'Milo Fontaine',
    rating: 5,
    text: 'Boiled over a pot of pasta water last week; it swallowed the spill and was dry again by dinner.',
    date: 'September 2026',
  },
  {
    author: 'Harriet Cole',
    rating: 5,
    text: 'The beige hides crumbs impressively between sweeps, and a damp cloth brings it back to new.',
    date: 'August 2026',
  },
  {
    author: 'Emeka Obi',
    rating: 4,
    title: 'Creeps a few millimeters',
    text: 'The backing holds well overall, though it shifts slightly when I pivot hard while cooking. A quick nudge straightens it. Comfort and spill control are excellent.',
    date: 'September 2026',
  },
  {
    author: 'Tallulah Bancroft',
    rating: 4,
    text: 'Slimmer than I pictured, which turns out to be a bonus for sweeping underneath. Still cushions the feet.',
    date: 'October 2026',
  },
  {
    author: 'Serge Melnyk',
    rating: 4,
    text: 'Turmeric dust left the faintest shadow after a wipe, barely worth mentioning. Everything else lifts off completely.',
    date: 'August 2026',
  },
  {
    author: 'Ola Adebayo',
    rating: 4,
    text: 'Two pieces in the set covered the sink run and the stove run with some trimming left over for the entryway.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Function over feel',
    text: 'The texture took a week to get used to, firm like dense foam rather than a soft rug. It soaks up everything though, water and oil both, and cleans easily. It stays because of what it does, not how it feels.',
    date: 'July 2026',
  },
];

const BIKE_BASKET: ProductReview[] = [
  {
    author: 'Birdie Callahan',
    rating: 5,
    title: 'Perfect for market runs',
    text: 'Tomatoes, a baguette, and a bunch of basil ride home in style. The cup holder carried my iced coffee the whole way.',
    date: 'September 2026',
  },
  {
    author: 'Soren Nygaard',
    rating: 5,
    text: 'The leather straps tighten by hand and the basket does not rattle over brick streets. Feels properly old-school.',
    date: 'August 2026',
  },
  {
    author: 'Tilly Fenwick',
    rating: 5,
    text: 'The built-in cup holder is my favorite gimmick that is not a gimmick. It genuinely gets used every ride.',
    date: 'October 2026',
  },
  {
    author: 'August Snow',
    rating: 5,
    text: 'The honey-brown weave looks like it grew there. Natural, warm, exactly the vintage vibe I wanted for my cruiser.',
    date: 'September 2026',
  },
  {
    author: 'Fern Duffy',
    rating: 5,
    text: 'With a small blanket folded in as a liner, my little dog rides along perfectly. She now refuses walks that do not involve the basket.',
    date: 'August 2026',
  },
  {
    author: 'Cass Whitlow',
    rating: 4,
    title: 'One stray cane end',
    text: 'A single rough cane tip near the rim, smoothed with a nail file in ten seconds. Otherwise tight weave and sturdy straps.',
    date: 'September 2026',
  },
  {
    author: 'Otis Grange',
    rating: 4,
    text: 'Wider than it appears, so check your handlebar clearance first. Once mounted it sits solid and carries a surprising amount.',
    date: 'August 2026',
  },
  {
    author: 'Juni Alvarez',
    rating: 4,
    text: 'The straps needed repositioning to clear my brake cable, two minutes of fiddling. Looks fantastic since.',
    date: 'October 2026',
  },
  {
    author: 'Lorraine Dexter',
    rating: 4,
    text: 'Holds its shape with a tote inside, no sagging after a month of grocery runs.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Charming but fiddly',
    text: 'It is undeniably cute, but the straps take patience to line up square and mine sits a touch off-center on the handlebars. Fine for short flat rides and admiring glances; consider it a looker first and a workhorse second.',
    date: 'July 2026',
  },
];

const CAULDRON_BURNER: ProductReview[] = [
  {
    author: 'Rowan Blackbourn',
    rating: 5,
    title: 'A real conversation piece',
    text: 'The glossy black pot swinging in that curved stand is the first thing guests comment on. Scent throw is gentle and steady with wax melts.',
    date: 'September 2026',
  },
  {
    author: 'Elsie Thorne',
    rating: 5,
    text: 'Gift for my witchy best friend. She actually squealed, then texted me a photo of it glowing on her altar that night.',
    date: 'August 2026',
  },
  {
    author: 'Marek Dubois',
    rating: 5,
    text: 'The tealight drops into the metal cup and sits rock stable on the base. No wobble, no tipped candles.',
    date: 'October 2026',
  },
  {
    author: 'Sylvia Renard',
    rating: 5,
    text: 'Half a wax cube is plenty, it fills the whole room. The little cauldron bubbles away like a potion.',
    date: 'September 2026',
  },
  {
    author: 'Casper Meeks',
    rating: 5,
    text: 'The glazed ceramic inside wipes clean without scrubbing. Used it for oils all month and the glaze still shines like new.',
    date: 'August 2026',
  },
  {
    author: 'Wanda Pruitt',
    rating: 4,
    title: 'Stand needed a tweak',
    text: 'The hanging arm arrived slightly bent, so I eased it level by hand and it has sat perfectly since. Charming piece for the price.',
    date: 'September 2026',
  },
  {
    author: 'Iris Vane',
    rating: 4,
    text: 'Brilliant with oils. Full wax cubes take most of a tealight to fully melt, so I stick to halves or oils.',
    date: 'August 2026',
  },
  {
    author: 'Pearl Nakamura',
    rating: 4,
    text: 'Daintier than expected, which made it ideal for the vanity corner. The black finish matches everything.',
    date: 'October 2026',
  },
  {
    author: 'Corwin Ashe',
    rating: 4,
    text: 'The flame lights the cauldron from underneath and throws this moody little glow on the wall. Half decor, half aromatherapy.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Better for oils than wax',
    text: 'Looks fantastic, no arguments there. But a full wax cube takes ages to melt down and the pot is awkward to scrape clean afterward. With essential oils and water it is lovely, so mine stays on oil duty.',
    date: 'July 2026',
  },
];

const OIL_PAINTING_CUSHIONS: ProductReview[] = [
  {
    author: 'Antonella Riva',
    rating: 5,
    title: 'Gorgeous print',
    text: 'The print genuinely reads like impressionist artwork, warm reds and soft greens blended together. My plain dining chairs look curated now.',
    date: 'September 2026',
  },
  {
    author: 'Hugh Danvers',
    rating: 5,
    text: 'The ties hold them firmly to smooth wooden chairs. Nobody has chased a sliding cushion across the floor since these arrived.',
    date: 'August 2026',
  },
  {
    author: 'Miette Laurent',
    rating: 5,
    text: 'Painterly in the best way, like a garden scene mid-brushstroke. Softer and thicker than the price led me to expect.',
    date: 'October 2026',
  },
  {
    author: 'Giovanni Pace',
    rating: 5,
    text: 'Guests keep asking what changed in the kitchen, as in what happened to make the chairs look like that. Instant upgrade for long dinners.',
    date: 'September 2026',
  },
  {
    author: 'Estelle Hargrove',
    rating: 5,
    text: 'Much plusher than the flat pads they replaced. Two hours at the holiday table and nobody shifted for comfort.',
    date: 'August 2026',
  },
  {
    author: 'Dominic Shears',
    rating: 4,
    title: 'Relaxes after a week',
    text: 'Firm out of the package, then the fill settles nicely once it has had some use. The pattern is gorgeous either way.',
    date: 'September 2026',
  },
  {
    author: 'Faye Okonkwo',
    rating: 4,
    text: 'Each pad has the print placed a little differently, which I count as charm rather than a flaw. Ties are sturdy.',
    date: 'August 2026',
  },
  {
    author: 'Vera Lindt',
    rating: 4,
    text: 'A hair smaller than my chair seats, but the ties pull it snug so it reads custom. Colors are rich, not loud.',
    date: 'October 2026',
  },
  {
    author: 'Rafael Iglesias',
    rating: 4,
    text: 'The pair of pads covered exactly the two accent chairs in the reading nook. Comfortable enough for a whole novel.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Pretty, tufting flattens',
    text: 'The artwork is lovely and the pads brighten the kitchen, but the tufting flattens where I sit daily and the ties feel skimpy. Rotating them between chairs helps. Decent looks, average endurance.',
    date: 'July 2026',
  },
];

const BRASS_PEPPER_MILL: ProductReview[] = [
  {
    author: 'Edmund Locke',
    rating: 5,
    title: 'Smooth twist, even grind',
    text: 'The grinding action is buttery, none of the plastic creak of my old mill. Consistent grind from top to bottom of the jar.',
    date: 'September 2026',
  },
  {
    author: 'Aiko Fujimura',
    rating: 5,
    text: 'Goes from nearly powdery fine for pasta to properly chunky for steak. The steel mechanism feels precise.',
    date: 'August 2026',
  },
  {
    author: 'Henri Duval',
    rating: 5,
    text: 'On the dinner table it passes for a family heirloom. Guests pick it up and immediately ask about it.',
    date: 'October 2026',
  },
  {
    author: 'Barnaby Quill',
    rating: 5,
    text: 'All-metal and reassuringly heavy. It sits rock steady on the counter while you twist.',
    date: 'September 2026',
  },
  {
    author: 'Sofia Andrade',
    rating: 5,
    text: 'The flanged base genuinely helps, no wobbling mid-grind. Filled once and it keeps going weeks later.',
    date: 'August 2026',
  },
  {
    author: 'Leo Brandvold',
    rating: 4,
    title: 'Coarse end tops out early',
    text: 'The coarsest setting lands around medium-coarse, so crackle-crust pepper fans may want more. As a daily driver it grinds beautifully.',
    date: 'September 2026',
  },
  {
    author: 'Salome Gantz',
    rating: 4,
    text: 'Fingerprints show on the brass within a day of polishing. A quick buff with a soft cloth restores the shine, and honestly the slight patina suits it.',
    date: 'August 2026',
  },
  {
    author: 'Viktor Malek',
    rating: 4,
    text: 'Holds a surprising quantity of peppercorns, so refills are rare. The 9-inch height is substantial without being silly.',
    date: 'October 2026',
  },
  {
    author: 'Ivo Hasek',
    rating: 4,
    text: 'Visitors assume it is an antique, and the Greek soldier coffee mill story seals it. Grinds beautifully too.',
    date: 'September 2026',
  },
  {
    author: 'Anonymous',
    rating: 3,
    title: 'Expect patina',
    text: 'Mine developed darker spots across the finish within weeks, and it leaves a few grounds behind wherever it rests. The grind itself is even and adjustable, so it stays in service, but buy it for the mechanism and the look, not for showroom permanence.',
    date: 'July 2026',
  },
];

export const PRODUCT_REVIEWS: Record<string, ProductReview[]> = {
  'b0-inserts-square': PILLOW_INSERT_REVIEWS,
  'b0-inserts-rect': PILLOW_INSERT_REVIEWS,
  // 批 1（2026-10-05）：户外椅垫 4 套，见上方各 const 注释与 LOG.md 批 1 对照表
  'outdoor-110x55': OUTDOOR_110x55_REVIEWS,
  'outdoor-110x53': OUTDOOR_110x53_REVIEWS,
  'b0-rocking-95x45': ROCKING_95x45_REVIEWS,
  'outdoor-95x45': ROCKING_95x45_REVIEWS,
  'b0-seat-cushions': SEAT_CUSHION_REVIEWS,
  'b0-square-pads': SEAT_CUSHION_REVIEWS,
  // 批 2（2026-10-05）：坐垫类 3 套，见上方各 const 注释与 LOG.md 批 2 对照表（含套 G 4.0 例外批准记录）
  'b0-highback-2pk': HIGHBACK_2PK_REVIEWS,
  'b0-highback-4pk': HIGHBACK_4PK_REVIEWS,
  'b0-round-cushions': ROUND_CUSHION_REVIEWS,
  // 批 3（2026-10-05）：旅行枕 2 套 + rect 复用枕芯数组（见 PILLOW_INSERT_REVIEWS 注释）
  'b0-travel-memory': TRAVEL_MEMORY_REVIEWS,
  'b0-travel-adjustable': TRAVEL_ADJUSTABLE_REVIEWS,
  // 批 4（2026-10-06）：非 B0 试点，仿兔毛地毯 3 色款共享（AI 生成，无 REVIEW_COUNTS → reviewCount=条数）
  '1688-595229918569': FUR_RUG_REVIEWS,
  // 批 5 W1（2026-10-06）：毛巾类 4 家族（v2 贴源改写，无 REVIEW_COUNTS → reviewCount=条数）
  '1688-856468238034': TOWEL_BATH_2PK,
  '1688-1056325209172': TOWEL_HAND_4PK,
  '1688-1044064113195': TOWEL_BATH_OVERSIZED,
  '1688-952595759182': TOWEL_BEACH_2PK,
  // 批 5 W2（2026-10-06）：地毯垫类 8 家族 + 酒店浴巾（v2 贴源改写，无 REVIEW_COUNTS）
  '1688-744995685423': RUG_GEOMETRIC,
  '1688-1064068114006': BATH_OVAL,
  '1688-1052755373494': RUG_OUTDOOR_ROUND,
  '1688-1038477616596': MAT_KITCHEN,
  '1688-1046667161713': RUG_KITCHEN,
  '1688-996768645117': RUG_SHAGGY_OVAL,
  '1688-1052742241013': RUG_PERSIAN_BOHO,
  '1688-745181807454': RUG_ORIENTAL,
  '1688-743666513356': TOWEL_HOTEL_2PK,
  // 批 5 W3（2026-10-06）：床品小件 3 家族 + B0 无素材 3 家族（v2 贴源改写，无 REVIEW_COUNTS）
  'linen3-duvet': LINEN_DUVET,
  'duvset-duvet': WASHED_DUVET,
  '1688-916370884976': COMFORTER_SET,
  'b0-bed-pillows': BED_PILLOWS,
  'b0-inserts-quilted': QUILTED_INSERTS,
  'b0-embossed-cases': EMBOSSED_CASES,
  // 批 5 W4（2026-10-06）：杂项 6 家族（托盘 3 + 挂画 2 + 冰丝被套，v2 贴源改写，无 REVIEW_COUNTS）
  '1688-663341114084': TRAY_OVAL_CERAMIC,
  '1688-807393887857': WALL_ART_GEOMETRIC,
  '1688-730512046265': WALL_ART_BASKET,
  '1688-743606980882': TRAY_RECT_LEAF,
  '1688-899672152256': TRAY_ROUND_LEAF,
  '1688-1048207560416': ICE_SILK_DUVET,
  // 批 5 W5（2026-10-06）：床品套装收官（4 件套/微纤维 3 件套/亚麻 3 件套/冰丝被套 22 PDP/蛋壳盒颈枕）
  bedset4: BEDSET4_SETS,
  duvset: DUVSET_SETS,
  linen3: LINEN3_SETS,
  '1688-1061371343572': ICE_DUVET_COVERS,
  '1688-913882303732': EGG_CASE_PILLOWS,
  // 批 5 W6（2026-10-06）：漏网家族补齐（毛毯 23 PDP / 棉浴垫 3 / 门垫 / 硅藻土×2 / 车筐 / 香薰炉 / 油画椅垫 / 胡椒磨）
  '1688-969627065032': FUR_THROW_BLANKET,
  '1688-828008656438': COTTON_BATH_MATS,
  '1688-1016436401519': SISAL_DOOR_MATS,
  '1688-985677811504': DE_OVAL_BATH_MAT,
  '1688-895014679429': DE_KITCHEN_RUNNER,
  b098f1bkjq: BIKE_BASKET,
  b0by8ly757: CAULDRON_BURNER,
  b0cjhl4lzp: OIL_PAINTING_CUSHIONS,
  b0d9lh1y55: BRASS_PEPPER_MILL,
};

/** 展示用评价总数（家族 → 真实来源的总评分条数，如 Amazon listing 的 global ratings）。
 *  只收录有真实来源的 B0 家族；AI 生成家族不编造总数（reviewCount 回落为评价条数）。 */
export const REVIEW_COUNTS: Record<string, number> = {
  'b0-inserts-square': 2638,
  // 批 1：同池家族填同一稳定化总数（池 591 / 11 / 549 / 996）
  'outdoor-110x55': 588,
  'outdoor-110x53': 11,
  'b0-rocking-95x45': 546,
  'outdoor-95x45': 546,
  'b0-seat-cushions': 993,
  'b0-square-pads': 993,
  // 批 2：池 34 / 128 / 16
  'b0-highback-2pk': 33,
  'b0-highback-4pk': 126,
  'b0-round-cushions': 15,
  // 批 3：池 2,677 / 2,968；rect 与 square 同池 → 同数（2,638）
  'b0-travel-memory': 2674,
  'b0-travel-adjustable': 2965,
  'b0-inserts-rect': 2638,
};

/** 家族解析候选 key：原始 asin → 变体组 id → 剥 -C数字 尾缀（大小写不敏感） */
function reviewLookupKeys(asin: string): string[] {
  const lower = asin.toLowerCase();
  const keys = [lower];
  const group = getVariantGroupOf(asin);
  if (group) keys.push(group.id.toLowerCase());
  const stripped = lower.replace(/-c\d+$/, '');
  if (stripped !== lower) keys.push(stripped);
  return keys;
}

/** 家族共享入口：变体成员 / 家族 id 均可命中同一批评价 */
export function getProductReviews(asin: string): ProductReview[] {
  for (const key of reviewLookupKeys(asin)) {
    const hit = PRODUCT_REVIEWS[key];
    if (hit && hit.length > 0) return hit;
  }
  return [];
}

/** 展示总数解析（供 products.ts 注入 reviewCount：顶部星级行 / 分布卡 / JSON-LD 同源） */
export function getReviewTotal(asin: string): number | undefined {
  for (const key of reviewLookupKeys(asin)) {
    const total = REVIEW_COUNTS[key];
    if (total != null) return total;
  }
  return undefined;
}
