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
    text: 'So glad I ordered these. Would recommend!',
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
    text: 'Bought this after neck surgery when sleeping and car rides to appointments were a struggle. It gave me solid support on those drives and reminded me to keep my head still. Obviously not a medical device, but it was comfortable and a genuinely useful part of my recovery kit.',
    date: 'September 2025',
  },
  {
    author: 'Cuddles1079',
    rating: 5,
    title: 'Comfy and cozy',
    text: 'So comfortable and it smelled fine right out of the package. Holds its shape well and the size and weight are just right for trips or couch naps. Puffed up to full shape quickly after unboxing. Really happy with it.',
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
    text: "Smaller than I expected, which is disappointing. The plastic tip on the end came loose almost immediately; I tied a knot to keep it in place. It's reasonably comfortable otherwise.",
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
      text: "Super soft and fluffy, and it fills out my pillow cover really well. Mine are just for show on the bed, so nightly use is untested, but they look great.",
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
