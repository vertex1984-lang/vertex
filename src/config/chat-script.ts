// mock 导购剧本引擎（策略层）：多信号打分推荐 + 多轮流程 + 本地产品知识库。
// 智能化说明：从买家一句话中提取 房间/材质偏好/颜色/预算/尺寸 多个信号，
// 对知识库加权打分取 Top3，并生成个性化推荐理由；支持"再来点"换批轮换。
// 二期接入线上 LLM：CONTACT_CONFIG.llm 指向聊天代理后真 AI 接待，
// 本剧本引擎仍作为 LLM 失败/离线场景的兜底，接口见 handleUserInput。

import { CONTACT_CONFIG } from "./contact";

export type ProductCard = {
  title: string;
  price: string;
  image: string;
  url: string;
};

export type ChatReply = { text: string; products?: ProductCard[] };

export type ChatFlow =
  | "idle"
  | "rug_room"
  | "size_place"
  | "material_follow"
  | "entry_space"
  | "beyond"
  | "leave_email"
  | "leave_text";

export type FlowChip = { label: string; value: string };

/** 会话记忆：当前推荐主题 + 已推荐过的产品 + 跨品类软推荐是否已触发（由展示层持有并回传） */
export type ChatMemory = { lastTopic: string | null; shown: string[]; crossSold?: boolean };

export type EngineResult = {
  replies: ChatReply[];
  nextFlow: ChatFlow;
  chips?: FlowChip[];
  /** 本轮确立/延续的推荐主题（room 或 vibe 或品类），undefined = 不改变记忆 */
  topic?: string | null;
  /** 本轮触发了跨品类软推荐 */
  crossSold?: boolean;
};

const EMAIL_RE = /[^\s<>@]+@[^\s<>@]+\.[^\s<>@]{2,}/;

type Rug = ProductCard & {
  size: string;
  material: string;
  rooms: string[];
  vibe: string;
  colors: string[];
  tier: "budget" | "mid" | "premium";
  /** 品类：rug = 面积地毯（100 x 200cm 起），mat = 小尺寸垫（50 x 80cm），及椅垫/靠枕/毛巾等全站品类；缺省按 rug 处理 */
  kind?: "rug" | "mat" | "cushion" | "pillow" | "towel" | "cover" | "basket";
};

// 产品知识库（与站内 11 款地毯一致，附色系/价位标签供打分）
const RUGS: Rug[] = [
  {
    title: "Soft Low-Pile Geometric Rug — Grey & Beige",
    price: "$34.90",
    image: "/images/products/1688-744995685423/1.webp",
    url: "/products/soft-low-pile-modern-geometric-area-rug-for-living-room-1688-744995685423",
    size: "100 x 200cm",
    material: "Printed low pile",
    rooms: ["living", "bedroom", "entryway"],
    vibe: "easy-clean",
    colors: ["grey", "beige", "neutral"],
    tier: "budget",
  },
  {
    title: "Minimalist Geometric Area Rug — Black & White",
    price: "$34.90",
    image: "/images/products/1688-744995685423-C2/1.webp",
    url: "/products/minimalist-geometric-area-rug-for-living-room-bedroom-1688-744995685423-c2",
    size: "100 x 200cm",
    material: "Printed low pile",
    rooms: ["living", "bedroom", "entryway"],
    vibe: "easy-clean",
    colors: ["black", "white", "grey", "neutral"],
    tier: "budget",
  },
  {
    title: "Ultra-Soft Faux Rabbit Fur Rug — Off White",
    price: "$199.00",
    image: "/images/products/1688-595229918569/1.webp",
    url: "/products/ultra-soft-faux-rabbit-fur-area-rug-for-modern-living-room-1688-595229918569",
    size: "160 x 200cm",
    material: "Faux rabbit fur",
    rooms: ["bedroom", "living"],
    vibe: "plush",
    colors: ["white", "cream", "neutral"],
    tier: "premium",
  },
  {
    title: "Plush Faux Rabbit Fur Rug — Light Camel",
    price: "$199.00",
    image: "/images/products/1688-595229918569-C2/1.webp",
    url: "/products/luxurious-plush-faux-rabbit-fur-area-rug-ultra-soft-carpet-1688-595229918569-c2",
    size: "160 x 200cm",
    material: "Faux rabbit fur",
    rooms: ["bedroom", "living"],
    vibe: "plush",
    colors: ["camel", "beige", "tan", "neutral"],
    tier: "premium",
  },
  {
    title: "Distressed Vintage Persian Rug — Amber & Teal",
    price: "$199.00",
    image: "/images/products/1688-745181807454-C3/1.webp",
    url: "/products/elegant-distressed-oriental-vintage-area-rug-traditional-1688-745181807454-c3",
    size: "160 x 230cm",
    material: "Printed low pile",
    rooms: ["living", "dining"],
    vibe: "easy-clean",
    colors: ["amber", "orange", "teal", "blue", "colorful"],
    tier: "premium",
  },
  {
    title: "Turkish Persian Diamond Rug — Navy & Ivory",
    price: "$199.00",
    image: "/images/products/1688-745181807454-C2/1.webp",
    url: "/products/turkish-persian-vintage-area-rug-geometric-diamond-pattern-1688-745181807454-c2",
    size: "160 x 230cm",
    material: "Printed low pile",
    rooms: ["living", "dining"],
    vibe: "easy-clean",
    colors: ["navy", "blue", "purple", "ivory", "colorful"],
    tier: "premium",
  },
  {
    title: "Faux Cashmere Vintage Rug — Sage",
    price: "$99.00",
    image: "/images/products/1688-1052742241013-C3/1.webp",
    url: "/products/distressed-vintage-boho-area-rug-ultra-soft-faux-cashmere-1688-1052742241013-c3",
    size: "160 x 230cm",
    material: "Faux cashmere",
    rooms: ["living", "bedroom"],
    vibe: "plush",
    colors: ["sage", "green", "grey", "muted"],
    tier: "mid",
  },
  {
    title: "Bohemian Medallion Rug — Navy",
    price: "$99.00",
    image: "/images/products/1688-1052742241013-C2/1.webp",
    url: "/products/soft-plush-vintage-american-bohemian-area-rug-persian-1688-1052742241013-c2",
    size: "160 x 230cm",
    material: "Faux cashmere",
    rooms: ["living", "bedroom"],
    vibe: "plush",
    colors: ["navy", "blue"],
    tier: "mid",
  },
  {
    title: "Oval Shaggy Rug — Warm Khaki",
    price: "$39.00",
    image: "/images/products/1688-996768645117/1.webp",
    url: "/products/luxury-oval-shaggy-area-rug-ultra-soft-silky-plush-carpet-1688-996768645117",
    size: "100 x 200cm",
    material: "Silky shaggy",
    rooms: ["bedroom", "entryway"],
    vibe: "plush",
    colors: ["khaki", "beige", "neutral"],
    tier: "budget",
  },
  {
    title: "Colorful Anatolian Striped Rug",
    price: "$199.00",
    image: "/images/products/1688-745181807454/1.webp",
    url: "/products/vintage-area-rug-with-colorful-anatolian-persian-tribal-1688-745181807454",
    size: "160 x 230cm",
    material: "Printed low pile",
    rooms: ["living", "dining"],
    vibe: "easy-clean",
    colors: ["colorful", "red", "rainbow"],
    tier: "premium",
  },
  {
    title: "Bohemian Medallion Rug — Red & Blue",
    price: "$199.00",
    image: "/images/products/1688-745181807454-C4/1.webp",
    url: "/products/turkish-persian-vintage-area-rug-bohemian-geometric-1688-745181807454-c4",
    size: "160 x 230cm",
    material: "Printed low pile",
    rooms: ["living", "bedroom", "dining"],
    vibe: "easy-clean",
    colors: ["red", "blue", "green", "ivory", "colorful"],
    tier: "premium",
  },
  {
    title: "Faded Medallion Rug — Cream & Teal",
    price: "$199.00",
    image: "/images/products/1688-745181807454-C5/1.webp",
    url: "/products/oriental-traditional-turkish-persian-vintage-area-rug-160-x-1688-745181807454-c5",
    size: "160 x 230cm",
    material: "Printed low pile",
    rooms: ["living", "bedroom", "dining"],
    vibe: "easy-clean",
    colors: ["navy", "orange", "pink", "teal", "cream", "colorful"],
    tier: "premium",
  },
  {
    title: "Vintage Medallion Rug — Multicolor",
    price: "$199.00",
    image: "/images/products/1688-745181807454-C6/1.webp",
    url: "/products/vintage-medallion-indoor-area-rug-for-living-room-bedroom-1688-745181807454-c6",
    size: "160 x 230cm",
    material: "Printed low pile",
    rooms: ["living", "bedroom", "dining"],
    vibe: "easy-clean",
    colors: ["blue", "red", "beige", "colorful"],
    tier: "premium",
  },
  {
    title: "Tribal Striped Rug — Red & Gold",
    price: "$199.00",
    image: "/images/products/1688-745181807454-C7/1.webp",
    url: "/products/colorful-geometric-tribal-turkish-persian-style-area-rug-1688-745181807454-c7",
    size: "160 x 230cm",
    material: "Printed low pile",
    rooms: ["living", "bedroom", "dining"],
    vibe: "easy-clean",
    colors: ["red", "blue", "green", "gold", "colorful"],
    tier: "premium",
  },
  {
    title: "Oriental Medallion Rug — Black & Gold",
    price: "$199.00",
    image: "/images/products/1688-745181807454-C8/1.webp",
    url: "/products/elegant-turkish-persian-area-rug-vintage-oriental-medallion-1688-745181807454-c8",
    size: "160 x 230cm",
    material: "Printed low pile",
    rooms: ["living", "bedroom", "dining"],
    vibe: "easy-clean",
    colors: ["black", "gold", "neutral"],
    tier: "premium",
  },
  {
    title: "Vintage Persian Rug — Rust & Teal",
    price: "$99.00",
    image: "/images/products/1688-1052742241013/1.webp",
    url: "/products/plush-american-vintage-persian-area-rug-faux-cashmere-non-1688-1052742241013",
    size: "160 x 230cm",
    material: "Faux cashmere",
    rooms: ["living", "bedroom"],
    vibe: "plush",
    colors: ["rust", "orange", "teal", "red"],
    tier: "mid",
    kind: "rug",
  },
  {
    title: "Distressed Persian Medallion Rug — Multicolor",
    price: "$199.00",
    image: "/images/products/1688-1052742241013-C4/1.webp",
    url: "/products/distressed-vintage-persian-floral-medallion-large-area-rug-1688-1052742241013-c4",
    size: "160 x 230cm",
    material: "Faux cashmere",
    rooms: ["living", "bedroom"],
    vibe: "plush",
    colors: ["ivory", "red", "navy", "colorful"],
    tier: "premium",
    kind: "rug",
  },
  {
    title: "Persian Medallion Rug — Teal Blue",
    price: "$199.00",
    image: "/images/products/1688-1052742241013-C5/1.webp",
    url: "/products/american-vintage-oriental-persian-style-area-rug-soft-faux-1688-1052742241013-c5",
    size: "160 x 230cm",
    material: "Faux cashmere",
    rooms: ["living", "bedroom"],
    vibe: "plush",
    colors: ["teal", "blue", "navy", "ivory"],
    tier: "premium",
    kind: "rug",
  },
  {
    title: "Vintage Persian Rug — Rust Orange",
    price: "$199.00",
    image: "/images/products/1688-1052742241013-C6/1.webp",
    url: "/products/vintage-american-persian-style-area-rug-imitation-cashmere-1688-1052742241013-c6",
    size: "160 x 230cm",
    material: "Faux cashmere",
    rooms: ["living", "bedroom"],
    vibe: "plush",
    colors: ["rust", "orange", "blue", "neutral"],
    tier: "premium",
    kind: "rug",
  },
  {
    title: "Oval Tie-Dye Shaggy Rug — Light Grey",
    price: "$25.99",
    image: "/images/products/1688-996768645117-C2/1.webp",
    url: "/products/oval-fluffy-area-rug-large-modern-tie-dye-style-shaggy-1688-996768645117-c2",
    size: "100 x 160cm",
    material: "Silky shaggy",
    rooms: ["bedroom", "living"],
    vibe: "plush",
    colors: ["grey", "colorful"],
    tier: "mid",
    kind: "rug",
  },
  {
    title: "Nordic Oval Shaggy Rug — Snow White",
    price: "$25.99",
    image: "/images/products/1688-996768645117-C3/1.webp",
    url: "/products/nordic-oval-plush-area-rug-tie-dyed-silky-faux-fur-shag-1688-996768645117-c3",
    size: "100 x 160cm",
    material: "Silky shaggy",
    rooms: ["bedroom", "living"],
    vibe: "plush",
    colors: ["white", "cream", "neutral"],
    tier: "mid",
    kind: "rug",
  },
  {
    title: "Faux Rabbit Fur Shaggy Rug — Silver Grey",
    price: "$99.99",
    image: "/images/products/1688-595229918569-C3/1.webp",
    url: "/products/super-soft-faux-rabbit-fur-area-rug-thick-plush-shaggy-1688-595229918569-c3",
    size: "160 x 200cm",
    material: "Faux rabbit fur",
    rooms: ["living", "bedroom"],
    vibe: "plush",
    colors: ["grey", "silver", "neutral"],
    tier: "premium",
    kind: "rug",
  },
  {
    title: "Plush Non-Slip Cotton Bath Mats — Set of 2 (50 x 80cm)",
    price: "$19.99",
    image: "/images/products/1688-828008656438/1.webp",
    url: "/products/plush-hotel-style-thick-cotton-bath-mats-set-of-2-non-slip-1688-828008656438",
    size: "50 x 80cm",
    material: "Cotton",
    rooms: ["entryway", "bathroom"],
    vibe: "easy-clean",
    colors: ["white"],
    tier: "budget",
    kind: "mat",
  },
  {
    title: "Quick-Dry Cotton Bath Mats 2-Pack — 50 x 80cm",
    price: "$19.99",
    image: "/images/products/1688-828008656438-C2/1.webp",
    url: "/products/2-pack-luxury-hotel-style-100-cotton-bath-mats-50-x-80-cm-1688-828008656438-c2",
    size: "50 x 80cm",
    material: "Cotton",
    rooms: ["entryway", "bathroom"],
    vibe: "easy-clean",
    colors: ["white"],
    tier: "budget",
    kind: "mat",
  },
  {
    title: "Jacquard Cotton Bath Mat Set — 50 x 80cm",
    price: "$19.99",
    image: "/images/products/1688-828008656438-C3/1.webp",
    url: "/products/2-pack-luxury-hotel-style-cotton-bath-mat-set-extra-thick-1688-828008656438-c3",
    size: "50 x 80cm",
    material: "Cotton",
    rooms: ["entryway", "bathroom"],
    vibe: "easy-clean",
    colors: ["white"],
    tier: "budget",
    kind: "mat",
  },
  {
    title: "Throw Pillow Inserts 45 x 45cm — Set of 2",
    price: "$12.99",
    image: "/images/products/B0CQC6H9MZ/1.webp",
    url: "/products/throw-pillow-inserts-45cm-x-45cm-18-x-18-cushion-inserts-hol-b0cqc6h9mz",
    size: "45 x 45cm",
    material: "Fluffy hollow fibre",
    rooms: ["living", "bedroom"],
    vibe: "plush",
    colors: ["white", "neutral"],
    tier: "budget",
    kind: "pillow",
  },
  {
    title: "Pillow Inserts 50 x 50cm — Set of 2",
    price: "$10.00",
    image: "/images/products/B0F62ZY8ZN/2.webp",
    url: "/products/square-throw-pillow-inserts-50-x-50-cm-set-of-2-cushion-b0f62zy8zn",
    size: "50 x 50cm",
    material: "Fluffy hollow fibre",
    rooms: ["living", "bedroom"],
    vibe: "plush",
    colors: ["white", "neutral"],
    tier: "budget",
    kind: "pillow",
  },
  {
    title: "Pillow Inserts 50 x 70cm — Set of 2",
    price: "$15.99",
    image: "/images/products/B0F62Y59CW/2.webp",
    url: "/products/makimoo-pillow-inserts-50-x-70-cm-set-of-2-soft-fluffy-b0f62y59cw",
    size: "50 x 70cm",
    material: "Fluffy hollow fibre",
    rooms: ["living", "bedroom"],
    vibe: "plush",
    colors: ["white", "neutral"],
    tier: "budget",
    kind: "pillow",
  },
  {
    title: "Pillow Inserts 60 x 60cm — Set of 2",
    price: "$16.99",
    image: "/images/products/B0F62Y3XT9/2.webp",
    url: "/products/premium-square-throw-pillow-inserts-60-x-60-cm-set-of-2-b0f62y3xt9",
    size: "60 x 60cm",
    material: "Fluffy hollow fibre",
    rooms: ["living", "bedroom"],
    vibe: "plush",
    colors: ["white", "neutral"],
    tier: "budget",
    kind: "pillow",
  },
  {
    title: "Embossed Cushion Covers 50 x 70cm — Set of 2",
    price: "$13.55",
    image: "/images/products/B0GJLDMT57/2.webp",
    url: "/products/makimoo-embossed-cushion-covers-set-of-2-soft-breathable-b0gjldmt57",
    size: "50 x 70cm",
    material: "Breathable microfibre",
    rooms: ["living", "bedroom"],
    vibe: "easy-clean",
    colors: ["white", "neutral"],
    tier: "budget",
    kind: "cover",
  },
  {
    title: "Tufted Outdoor Chair Cushions — 43 x 43cm (2-Pack)",
    price: "$20.99",
    image: "/images/products/B0GD84D8VC/4.webp",
    url: "/products/set-of-2-tufted-outdoor-chair-cushions-with-ties-square-b0gd84d8vc",
    size: "43 x 43cm",
    material: "Tufted, with ties",
    rooms: ["living", "dining"],
    vibe: "plush",
    colors: ["neutral"],
    tier: "mid",
    kind: "cushion",
  },
  {
    title: "Colorful Floral Chair Cushions — 43 x 43cm (2-Pack)",
    price: "$20.99",
    image: "/images/products/B0GD93XKHR/4.webp",
    url: "/products/makimoo-set-of-2-thick-comfortable-tufted-colorful-floral-b0gd93xkhr",
    size: "43 x 43cm",
    material: "Tufted, with ties",
    rooms: ["living", "dining"],
    vibe: "plush",
    colors: ["colorful"],
    tier: "mid",
    kind: "cushion",
  },
  {
    title: "Waterproof Outdoor Bench Cushion — 90 x 45cm (2-Pack)",
    price: "$27.99",
    image: "/images/products/B0GJSTTGY5/10.webp",
    url: "/products/makimoo-outdoor-chair-cushions-2-pack-waterproof-tufted-b0gjsttgy5",
    size: "90 x 45cm",
    material: "Waterproof tufted",
    rooms: ["living", "dining"],
    vibe: "easy-clean",
    colors: ["neutral"],
    tier: "mid",
    kind: "cushion",
  },
  {
    title: "Outdoor Dining Chair Cushions — Set of 4",
    price: "$117.99",
    image: "/images/products/B0BBZSGDBQ/1.webp",
    url: "/products/set-of-4-outdoor-dining-chair-cushions-comfort-patio-seating-b0bbzsgdbq",
    size: "Set of 4",
    material: "Comfort patio seating",
    rooms: ["living", "dining"],
    vibe: "easy-clean",
    colors: ["neutral"],
    tier: "premium",
    kind: "cushion",
  },
  {
    title: "Cotton Bath Towels 2-Pack — 140 x 80cm",
    price: "$27.99",
    image: "/images/products/1688-856468238034/3.webp",
    url: "/products/premium-2-pack-cotton-bath-towels-extra-soft-highly-1688-856468238034",
    size: "140 x 80cm",
    material: "Pure cotton",
    rooms: ["bathroom"],
    vibe: "plush",
    colors: ["white", "neutral"],
    tier: "mid",
    kind: "towel",
  },
  {
    title: "Striped Beach Towels — 75 x 180cm (2-Pack)",
    price: "$32.99",
    image: "/images/products/1688-952595759182/2.webp",
    url: "/products/2-pack-soft-thick-cotton-beach-towels-oversized-striped-1688-952595759182",
    size: "75 x 180cm",
    material: "Soft thick cotton",
    rooms: ["outdoor"],
    vibe: "easy-clean",
    colors: ["colorful", "striped"],
    tier: "mid",
    kind: "towel",
  },
  {
    title: "Checkered Diatomaceous Kitchen Mat — 50 x 80cm",
    price: "$19.99",
    image: "/images/products/1688-1038477616596/2.webp",
    url: "/products/american-style-checkered-kitchen-mat-diatomaceous-earth-1688-1038477616596",
    size: "50 x 80cm",
    material: "Diatomaceous earth",
    rooms: ["entryway", "kitchen"],
    vibe: "easy-clean",
    colors: ["white", "grey"],
    tier: "budget",
    kind: "mat",
  },
  {
    title: "Oval Diatomaceous Bath Mats — 50 x 80cm (2-Pack)",
    price: "$19.99",
    image: "/images/products/1688-985677811504/7.webp",
    url: "/products/2-pack-soft-diatomaceous-earth-bath-mats-oval-super-1688-985677811504",
    size: "50 x 80cm",
    material: "Diatomaceous earth",
    rooms: ["entryway", "bathroom"],
    vibe: "easy-clean",
    colors: ["grey"],
    tier: "budget",
    kind: "mat",
  },
  {
    title: "Handmade Wicker Bike Basket",
    price: "$39.99",
    image: "/images/products/B098F1BKJQ/1.webp",
    url: "/products/bike-basket-for-women-s-beach-cruiser-or-scooter-the-origina-b098f1bkjq",
    size: "One size",
    material: "Natural rattan",
    rooms: ["outdoor"],
    vibe: "easy-clean",
    colors: ["brown", "neutral"],
    tier: "mid",
    kind: "basket",
  },
];

// ---------- 信号提取与打分 ----------

type Signals = {
  room: string | null;
  vibe: string | null;
  colors: string[];
  budget: "low" | "high" | null;
  size: string | null;
  kind: "rug" | "mat" | "cushion" | "pillow" | "towel" | "cover" | "basket" | null;
};

function extractSignals(t: string): Signals {
  const sig: Signals = { room: null, vibe: null, colors: [], budget: null, size: null, kind: null };
  if (
    /pillow ?case|cushion cover/.test(t)
  ) sig.kind = "cover";
  else if (/pillow insert|cushion pad/.test(t)) sig.kind = "pillow";
  else if (/chair cushion|seat cushion|seat pad|dining chair/.test(t)) sig.kind = "cushion";
  else if (/\bpillow\b/.test(t)) sig.kind = "pillow";
  else if (/\bcushion\b/.test(t)) sig.kind = "cushion";
  else if (/towel/.test(t)) sig.kind = "towel";
  else if (/basket/.test(t)) sig.kind = "basket";
  else if (/\bmat\b|doormat|door mat|bath mat|floor mat|diatomace/.test(t)) sig.kind = "mat";
  else if (/rug|carpet/.test(t)) sig.kind = "rug";
  if (/living|sofa|couch|lounge|dining/.test(t)) sig.room = "living";
  else if (/bed|bedside|sleep|night/.test(t)) sig.room = "bedroom";
  else if (/entry|hall|door|porch/.test(t)) sig.room = "entryway";
  if (/plush|cozy|soft|fur|fluff|warm|shaggy/.test(t)) sig.vibe = "plush";
  else if (/easy.?clean|practical|stain|low.?pile/.test(t)) sig.vibe = "easy-clean";
  const colorMap: [RegExp, string][] = [
    [/grey|gray/, "grey"],
    [/beige/, "beige"],
    [/black/, "black"],
    [/white|cream|ivory/, "white"],
    [/navy|blue/, "navy"],
    [/camel|tan|brown/, "camel"],
    [/khaki|olive/, "khaki"],
    [/sage|green/, "sage"],
    [/rust|orange/, "rust"],
    [/teal/, "teal"],
    [/colorful|rainbow|multicolor|colorful/, "colorful"],
    [/red/, "red"],
    [/purple/, "purple"],
  ];
  for (const [re, c] of colorMap) if (re.test(t) && !sig.colors.includes(c)) sig.colors.push(c);
  if (/cheap|affordable|budget|inexpensive/.test(t)) sig.budget = "low";
  else if (/premium|luxur|high.?end/.test(t)) sig.budget = "high";
  if (/100 x 200|small/.test(t)) sig.size = "100 x 200cm";
  else if (/160 x 230|large|big/.test(t)) sig.size = "160 x 230cm";
  else if (/160 x 200/.test(t)) sig.size = "160 x 200cm";
  return sig;
}

function scoreRug(r: Rug, sig: Signals): number {
  let s = 0;
  const rk = r.kind ?? "rug";
  if (sig.kind) s += rk === sig.kind ? 3 : -2;
  if (sig.room && r.rooms.includes(sig.room)) s += 3;
  if (sig.vibe && r.vibe === sig.vibe) s += 2;
  if (sig.colors.length && r.colors.some((c) => sig.colors.includes(c))) s += 2;
  if (sig.size && r.size === sig.size) s += 2;
  if (sig.budget === "low") s += r.tier === "budget" ? 2 : r.tier === "mid" ? 1 : -1;
  if (sig.budget === "high") s += r.tier === "premium" ? 2 : r.tier === "mid" ? 1 : -1;
  return s;
}

function hasSignals(sig: Signals): boolean {
  return Boolean(sig.room || sig.vibe || sig.colors.length || sig.budget || sig.size || sig.kind);
}

function reasonLine(sig: Signals): string {
  const bits: string[] = [];
  if (sig.room === "living") bits.push("the living room");
  else if (sig.room === "bedroom") bits.push("the bedroom");
  else if (sig.room === "entryway") bits.push("the entryway");
  if (sig.kind === "mat") bits.push("slim mats");
  else if (sig.kind === "rug") bits.push("full-size rugs");
  else if (sig.kind === "cushion") bits.push("chair cushions");
  else if (sig.kind === "pillow") bits.push("pillow inserts");
  else if (sig.kind === "towel") bits.push("towels");
  else if (sig.kind === "cover") bits.push("cushion covers");
  else if (sig.kind === "basket") bits.push("unique finds");
  if (sig.vibe === "plush") bits.push("plush comfort");
  else if (sig.vibe === "easy-clean") bits.push("easy care");
  if (sig.budget === "low") bits.push("budget-friendly picks");
  else if (sig.budget === "high") bits.push("a premium look");
  if (sig.size) bits.push(sig.size);
  if (sig.colors.length) bits.push(`a ${sig.colors.join(" & ")} palette`);
  return bits.length ? `Got it — ${bits.join(", ")} — these fit best:` : "These fit best:";
}

/** 按信号打分取下一批（排除已推荐）；全部分数为 0 返回空数组 */
function bestBatch(partial: Partial<Signals>, shown: string[], n = 3): Rug[] {
  const sig: Signals = { room: null, vibe: null, colors: [], budget: null, size: null, kind: null, ...partial };
  return RUGS.filter((r) => !shown.includes(r.url) && scoreRug(r, sig) > 0)
    .sort((a, b) => scoreRug(b, sig) - scoreRug(a, sig))
    .slice(0, n);
}

const EXHAUSTED_TEXT =
  "That's everything in that direction! Want to explore another room, category, or material?";

// "再来点"的主题筛选映射（基于会话记忆里的 lastTopic）
const TOPIC_FILTER: Record<string, (r: Rug) => boolean> = {
  living: (r) => r.rooms.includes("living"),
  bedroom: (r) => r.rooms.includes("bedroom"),
  entryway: (r) => r.rooms.includes("entryway"),
  plush: (r) => r.vibe === "plush",
  "easy-clean": (r) => r.vibe === "easy-clean",
  cushion: (r) => r.kind === "cushion",
  pillow: (r) => r.kind === "pillow",
  towel: (r) => r.kind === "towel",
  cover: (r) => r.kind === "cover",
  basket: (r) => r.kind === "basket",
};
const TOPIC_LABEL: Record<string, string> = {
  living: "the living room",
  bedroom: "the bedroom",
  entryway: "entryways",
  plush: "plush picks",
  "easy-clean": "easy-care picks",
  cushion: "chair cushions",
  pillow: "pillow inserts",
  towel: "towels",
  cover: "cushion covers",
  basket: "unique finds",
};

const ROOM_CHIPS: FlowChip[] = [
  { label: "Living room", value: "Living room" },
  { label: "Bedroom", value: "Bedroom" },
  { label: "Entryway / hallway", value: "Entryway" },
];

const PLACE_CHIPS: FlowChip[] = [
  { label: "Under a coffee table", value: "Under a coffee table" },
  { label: "Beside the bed", value: "Beside the bed" },
  { label: "In the entryway", value: "In the entryway" },
];

const MATERIAL_CHIPS: FlowChip[] = [
  { label: "Plush & cozy", value: "Plush & cozy" },
  { label: "Easy to clean", value: "Easy to clean" },
];

const ENTRY_SPACE_CHIPS: FlowChip[] = [
  { label: "Spacious — open hallway", value: "Spacious entryway" },
  { label: "Pretty tight", value: "Tight entryway" },
];

const BEYOND_CHIPS: FlowChip[] = [
  { label: "Chair cushions", value: "Chair cushions" },
  { label: "Pillow inserts", value: "Pillow inserts" },
  { label: "Towels", value: "Towels" },
  { label: "Bath & kitchen mats", value: "Bath and kitchen mats" },
  { label: "Something unique", value: "Something unique" },
];

/** 跨品类软推荐：地毯推荐后追加椅垫/靠枕（每会话一次） */
function withCrossSell(
  replies: ChatReply[],
  memory: ChatMemory,
): { replies: ChatReply[]; crossSold?: boolean } {
  if (memory.crossSold) return { replies };
  const pool = RUGS.filter(
    (r) => (r.kind === "cushion" || r.kind === "pillow") && !memory.shown.includes(r.url),
  );
  if (pool.length === 0) return { replies };
  return {
    replies: [
      ...replies,
      {
        text: "By the way — fresh cushions and pillow inserts pair beautifully with a new rug. Two favorites:",
        products: pool.slice(0, 2),
      },
    ],
    crossSold: true,
  };
}

export function handleUserInput(
  text: string,
  flow: ChatFlow,
  online: boolean,
  memory: ChatMemory = { lastTopic: null, shown: [] },
): EngineResult {
  const t = text.toLowerCase();

  // 留言流程：收集邮箱 → 收集留言内容 → 确认
  if (flow === "leave_email") {
    const email = text.match(EMAIL_RE)?.[0];
    if (!email) {
      return {
        replies: [
          { text: "Hmm, that doesn't look like an email address. Could you double-check it? Something like you@example.com works best." },
        ],
        nextFlow: "leave_email",
      };
    }
    try {
      localStorage.setItem("makimoo_chat_email", email);
    } catch {}
    return {
      replies: [{ text: `Got it! Now type your message — our team will reply to ${email} by email.` }],
      nextFlow: "leave_text",
    };
  }

  if (flow === "leave_text") {
    try {
      const email = localStorage.getItem("makimoo_chat_email") ?? "";
      const prev = JSON.parse(localStorage.getItem("makimoo_chat_leaves") ?? "[]");
      prev.push({ at: new Date().toISOString(), email, text });
      localStorage.setItem("makimoo_chat_leaves", JSON.stringify(prev));
    } catch {}
    return {
      replies: [
        {
          text: `Thanks! Your message has been recorded — we'll reply to your email within one business day. For anything urgent, you can also write to ${CONTACT_CONFIG.email}.`,
        },
      ],
      nextFlow: "idle",
    };
  }

  // 导购流程：房间
  if (flow === "rug_room") {
    const sig = extractSignals(t);
    // 玄关特殊处理：尺寸是否合适取决于空间大小，先分流
    if (sig.room === "entryway" || /entry|hall|door|porch/.test(t)) {
      return {
        replies: [
          { text: "Entryway sizing really depends on the space — a big rug can overwhelm a tight spot, while a slim mat may look lost in an open hallway. How big is yours?" },
        ],
        nextFlow: "entry_space",
        chips: ENTRY_SPACE_CHIPS,
      };
    }
    const room = sig.room ?? "living";
    const batch = bestBatch({ ...sig, room }, memory.shown);
    if (batch.length === 0) {
      return { replies: [{ text: EXHAUSTED_TEXT }], nextFlow: "idle", chips: ROOM_CHIPS, topic: null };
    }
    const flavor =
      room === "bedroom"
        ? "Bedrooms are all about barefoot comfort — plush faux fur and cashmere shine here:"
        : "For a living room, a 160 x 230cm rug anchors the sofa and coffee table beautifully:";
    const base = withCrossSell(
      [
        { text: flavor },
        { text: "Want sizing help or care tips for any of these?", products: batch },
      ],
      memory,
    );
    return {
      replies: base.replies,
      nextFlow: "idle",
      topic: room,
      crossSold: base.crossSold,
    };
  }

  // 玄关空间分流：宽敞 → 地毯（诚实告知尺寸下限），紧凑 → 小尺寸垫
  if (flow === "entry_space") {
    if (/spacious|open|big|large|hall/.test(t)) {
      const batch = bestBatch({ room: "entryway", kind: "rug" }, memory.shown);
      if (batch.length === 0) return { replies: [{ text: EXHAUSTED_TEXT }], nextFlow: "idle", topic: null };
      return {
        replies: [
          { text: "With room to spare, a slim 100 x 200cm rug works — heads-up that this is the smallest rug size in our collection, so make sure the door still clears it:" },
          { text: "Both are low-pile, stain-resistant and easy to clean:", products: batch },
        ],
        nextFlow: "idle",
        topic: "entryway",
      };
    }
    if (/tight|small|narrow|compact/.test(t)) {
      const batch = bestBatch({ room: "entryway", kind: "mat" }, memory.shown);
      if (batch.length === 0) return { replies: [{ text: EXHAUSTED_TEXT }], nextFlow: "idle", topic: null };
      return {
        replies: [
          { text: "Smart to size down! In a tight entryway, our 50 x 80cm cotton mats are the better fit — non-slip, absorbent and much kinder to the door swing:" },
          { text: "They sit flat, shake clean in seconds, and double as bathroom mats.", products: batch },
        ],
        nextFlow: "idle",
        topic: "entryway",
      };
    }
    return { replies: [{ text: "Ha, I need a bit more to go on — would you say the space is spacious or pretty tight?" }], nextFlow: "entry_space", chips: ENTRY_SPACE_CHIPS };
  }

  // Beyond 菜单：全站其他品类
  if (flow === "beyond") {
    if (/chair|seat|dining/.test(t)) {
      const batch = bestBatch({ kind: "cushion" }, memory.shown);
      if (batch.length === 0) return { replies: [{ text: EXHAUSTED_TEXT }], nextFlow: "idle", topic: null };
      return {
        replies: [
          { text: "Our chair cushions are tufted, thick and tie on securely — made for patios and dining sets:", products: batch },
        ],
        nextFlow: "idle",
        topic: "cushion",
      };
    }
    if (/pillow|insert/.test(t)) {
      const batch = bestBatch({ kind: "pillow" }, memory.shown);
      if (batch.length === 0) return { replies: [{ text: EXHAUSTED_TEXT }], nextFlow: "idle", topic: null };
      return {
        replies: [
          { text: "Plush pillow inserts in four sizes — 45 x 45, 50 x 50, 50 x 70 and 60 x 60cm. Pick your covers' size or grab a few:", products: batch },
        ],
        nextFlow: "idle",
        topic: "pillow",
      };
    }
    if (/towel/.test(t)) {
      const batch = bestBatch({ kind: "towel" }, memory.shown);
      if (batch.length === 0) return { replies: [{ text: EXHAUSTED_TEXT }], nextFlow: "idle", topic: null };
      return {
        replies: [
          { text: "Hotel-soft cotton towels — oversized bath towels and striped beach towels, both quick-dry:", products: batch },
        ],
        nextFlow: "idle",
        topic: "towel",
      };
    }
    if (/mat/.test(t)) {
      const batch = bestBatch({ kind: "mat" }, memory.shown);
      if (batch.length === 0) return { replies: [{ text: EXHAUSTED_TEXT }], nextFlow: "idle", topic: null };
      return {
        replies: [
          { text: "Our mats duo: quick-dry diatomaceous kitchen & bath mats, plus plush cotton bath mats — all non-slip 50 x 80cm:", products: batch },
        ],
        nextFlow: "idle",
        topic: "mat",
      };
    }
    if (/unique|basket|special/.test(t)) {
      const batch = RUGS.filter((r) => r.kind === "basket" && !memory.shown.includes(r.url));
      if (batch.length === 0) return { replies: [{ text: EXHAUSTED_TEXT }], nextFlow: "idle", topic: null };
      return {
        replies: [
          { text: "A little different: our handmade natural rattan bike basket — a bestseller with a built-in cup holder:", products: batch },
        ],
        nextFlow: "idle",
        topic: "basket",
      };
    }
    return {
      replies: [{ text: "Pick a category and I'll show you the favorites:" }],
      nextFlow: "beyond",
      chips: BEYOND_CHIPS,
    };
  }

  // 尺寸顾问：摆放位置
  if (flow === "size_place") {
    if (/coffee|sofa|couch/.test(t)) {
      const batch = bestBatch({ room: "living", size: "160 x 230cm" }, memory.shown);
      if (batch.length === 0) return { replies: [{ text: EXHAUSTED_TEXT }], nextFlow: "idle", topic: null };
      const base = withCrossSell(
        [
          { text: "Under a coffee table or along the sofa, go for 160 x 230cm — big enough to anchor the whole seating area without swallowing the room." },
          { text: "These fit that perfectly:", products: batch },
        ],
        memory,
      );
      return {
        replies: base.replies,
        nextFlow: "idle",
        topic: "living",
        crossSold: base.crossSold,
      };
    }
    if (/bed|bedside|night/.test(t)) {
      const batch = bestBatch({ room: "bedroom", size: "160 x 200cm", vibe: "plush" }, memory.shown);
      if (batch.length === 0) return { replies: [{ text: EXHAUSTED_TEXT }], nextFlow: "idle", topic: null };
      const base = withCrossSell(
        [
          { text: "Beside the bed, 160 x 200cm is the sweet spot — soft landings on both sides and doors still open easily over the slim profile." },
          { text: "My top picks for barefoot comfort:", products: batch },
        ],
        memory,
      );
      return {
        replies: base.replies,
        nextFlow: "idle",
        topic: "bedroom",
        crossSold: base.crossSold,
      };
    }
    if (/entry|hall|door/.test(t)) {
      return {
        replies: [
          { text: "Entryway sizing really depends on the space — how big is yours?" },
        ],
        nextFlow: "entry_space",
        chips: ENTRY_SPACE_CHIPS,
      };
    }
    return { replies: [{ text: "Where are you planning to place it?" }], nextFlow: "size_place", chips: PLACE_CHIPS };
  }

  // 材质顾问：偏好
  if (flow === "material_follow") {
    if (/plush|cozy|soft|fur|warm/.test(t)) {
      const batch = bestBatch({ vibe: "plush" }, memory.shown, 3).filter(
        (r) => r.material === "Faux rabbit fur" || r.material === "Silky shaggy",
      );
      const finalBatch = batch.length > 0 ? batch : bestBatch({ vibe: "plush" }, memory.shown);
      if (finalBatch.length === 0) return { replies: [{ text: EXHAUSTED_TEXT }], nextFlow: "idle", topic: null };
      return {
        replies: [
          { text: "Plush lovers, this way! Faux rabbit fur is our plushest — silky, dense and gentle on bare feet. The oval shaggy is a cozy wildcard:" },
          { text: "Care is simple: light vacuuming or a gentle shake keeps them fluffy.", products: finalBatch },
        ],
        nextFlow: "idle",
        topic: "plush",
      };
    }
    if (/clean|easy|care|low|practical/.test(t)) {
      const batch = bestBatch({ vibe: "easy-clean" }, memory.shown);
      if (batch.length === 0) return { replies: [{ text: EXHAUSTED_TEXT }], nextFlow: "idle", topic: null };
      return {
        replies: [
          { text: "Practical pick — smart! The printed low-pile rugs are stain-resistant, trap less dust, and clean with a quick vacuum or damp cloth:" },
          { text: "At just 0.4cm they also fit under doors and furniture legs with zero fuss.", products: batch },
        ],
        nextFlow: "idle",
        topic: "easy-clean",
      };
    }
    return { replies: [{ text: "What matters more to you — plush comfort or easy cleaning?" }], nextFlow: "material_follow", chips: MATERIAL_CHIPS };
  }

  // ---------- 空闲态：意图识别 ----------

  if (/leave|message|contact|email/.test(t)) {
    return {
      replies: [{ text: "Sure — what's the best email address to reach you?" }],
      nextFlow: "leave_email",
    };
  }
  if (/order|shipping|track|deliver|return|refund|cancel/.test(t)) {
    return {
      replies: [
        {
          text: online
            ? `An agent is on duty right now and will see your question here. For anything urgent, email ${CONTACT_CONFIG.email} — or tell me your question and I'll pass it along.`
            : `We're offline at the moment, so order questions are best sent as a message — tap "Leave a message" below and we'll reply by email within one business day.`,
        },
      ],
      nextFlow: "idle",
    };
  }
  if (/beyond|more finds|what else|other (products|items|finds)|something unique/.test(t)) {
    return {
      replies: [{ text: "There's more than rugs! Which corner of the home are we shopping for?" }],
      nextFlow: "beyond",
      chips: BEYOND_CHIPS,
    };
  }
  if (/material|care|wash|fur|cashmere/.test(t)) {
    return {
      replies: [
        {
          text:
            "Here's the quick guide:\n" +
            "• Faux rabbit fur — our plushest, silky and warm (bedrooms)\n" +
            "• Faux cashmere — velvety vintage prints, cozy underfoot\n" +
            "• Printed low pile — slim 0.4cm, stain-resistant, easiest care\n" +
            "• Silky shaggy — thick and fluffy for cozy corners",
        },
        { text: "Which matters more to you?" },
      ],
      nextFlow: "material_follow",
      chips: MATERIAL_CHIPS,
    };
  }
  if (/size|how big|dimension|measure/.test(t)) {
    return {
      replies: [
        { text: "Happy to help with sizing! It mostly depends on where the rug goes — where are you planning to place it?" },
      ],
      nextFlow: "size_place",
      chips: PLACE_CHIPS,
    };
  }

  // 智能推荐：一句话多信号（房间/材质/颜色/预算/尺寸/品类）直接出结果
  const sig = extractSignals(t);
  if (hasSignals(sig)) {
    // 玄关先分流：尺寸是否合适取决于空间大小
    if (sig.room === "entryway") {
      return {
        replies: [
          { text: "Entryway sizing really depends on the space — how big is yours?" },
        ],
        nextFlow: "entry_space",
        chips: ENTRY_SPACE_CHIPS,
      };
    }
    const scoredAny = RUGS.some((r) => scoreRug(r, sig) > 0);
    if (!scoredAny) {
      // 信号存在但组合无匹配：退回房间推荐或引导
      if (sig.room) {
        const batch = bestBatch({ room: sig.room }, memory.shown);
        if (batch.length > 0) {
          return { replies: [{ text: "That exact combo is tricky — here's the closest we have:", products: batch }], nextFlow: "idle", topic: sig.room };
        }
      }
      return { replies: [{ text: EXHAUSTED_TEXT }], nextFlow: "idle", chips: ROOM_CHIPS, topic: null };
    }
    const batch = bestBatch(sig, memory.shown);
    if (batch.length === 0) {
      return { replies: [{ text: EXHAUSTED_TEXT }], nextFlow: "idle", chips: ROOM_CHIPS, topic: null };
    }
    // 地毯类推荐附带跨品类软推荐（椅垫/靠枕，每会话一次）
    if (!sig.kind || sig.kind === "rug") {
      const base = withCrossSell([{ text: reasonLine(sig), products: batch }], memory);
      return {
        replies: base.replies,
        nextFlow: "idle",
        topic: sig.room ?? sig.vibe ?? null,
        crossSold: base.crossSold,
      };
    }
    return {
      replies: [{ text: reasonLine(sig), products: batch }],
      nextFlow: "idle",
      topic: sig.room ?? sig.vibe ?? sig.kind ?? null,
    };
  }

  // "再来点"：同主题换一批（排除已推荐）
  if (memory.lastTopic && /\b(more|other|another|else|again)\b/.test(t)) {
    const filter = TOPIC_FILTER[memory.lastTopic];
    const remaining = filter ? RUGS.filter((r) => filter(r) && !memory.shown.includes(r.url)) : [];
    if (remaining.length > 0) {
      return {
        replies: [{ text: `Sure — here are a few more for ${TOPIC_LABEL[memory.lastTopic]}:`, products: remaining.slice(0, 3) }],
        nextFlow: "idle",
        topic: memory.lastTopic,
      };
    }
    return {
      replies: [{ text: EXHAUSTED_TEXT }],
      nextFlow: "idle",
      chips: ROOM_CHIPS,
      topic: null,
    };
  }

  if (/recommend|choose|pick|suggest|help|looking|need|which|show|see/.test(t)) {
    return {
      replies: [{ text: "Love it! Which room is it for?" }],
      nextFlow: "rug_room",
      chips: ROOM_CHIPS,
    };
  }
  if (/^(hi|hello|hey|good)/.test(t)) {
    return {
      replies: [{ text: "Hey! I can help you pick a rug, figure out sizing, or compare materials — or pick a topic below." }],
      nextFlow: "idle",
    };
  }
  return {
    replies: [
      { text: "I can help you choose a rug, find the right size, compare materials, or pass order questions to our team. What would you like to do?" },
    ],
    nextFlow: "idle",
  };
}
