/**
 * Blog 数据层（Ideas & Inspiration）
 *
 * - 文案与预览稿 1:1 迁移（D:\opencode_workspace\blog-preview\index.html）
 * - 产品卡仅存 key + 展示文案：价格/图片/PDP 链接在渲染层按 key 从
 *   PRODUCTS_DATA（products.ts）实时解析，保证与站点数据一致
 * - key 为小写 asin（与 materials-map / shopify-map 一致）
 */

export interface BlogFaq {
  q: string;
  a: string;
}

export interface BlogProductRef {
  /** 产品 key（小写 asin），渲染层按 PRODUCTS_DATA asin 反查 */
  key: string;
  /** 眉头分类行，如 "Faux Rabbit Fur · 160 × 200 cm" */
  category: string;
  /** 展示名（短标题风格） */
  name: string;
  /** 一句话说明 */
  desc: string;
}

export interface BlogBlock {
  type:
    | "h2"
    | "p"
    | "list"
    | "olist"
    | "table"
    | "prosCons"
    | "products"
    | "faq"
    | "takeaway"
    | "image";
  text?: string;
  items?: string[];
  head?: string[];
  rows?: string[][];
  pros?: string[];
  cons?: string[];
  products?: BlogProductRef[];
  productsNote?: string;
  faqs?: BlogFaq[];
  src?: string;
  alt?: string;
  caption?: string;
}

export interface BlogReco {
  slug: string;
  image: string;
  cat: string;
  title: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: number;
  excerpt: string;
  cardImage: string;
  metaDescription: string;
  lede: string;
  blocks: BlogBlock[];
  recos: BlogReco[];
  cta: { heading: string; text: string; label: string; href: string };
}

export const BLOG_POSTS: BlogPost[] = [
  // ==================== 1. Rug Materials ====================
  {
    slug: "rug-materials",
    title: "Rug Materials Explained: Faux Rabbit Fur, Faux Cashmere & Printed Polyester",
    category: "Materials",
    date: "September 15, 2026",
    readTime: 8,
    excerpt:
      "Which soft rug material actually fits your room? A plain-language comparison of the three materials behind most affordable area rugs, including the trade-offs listings rarely mention.",
    cardImage: "/images/blog/photo-rug-materials.jpg",
    metaDescription:
      "Faux rabbit fur vs faux cashmere vs printed polyester rugs compared: feel, durability, shedding, care and the trade-offs product listings rarely mention.",
    lede:
      "Most soft, affordable area rugs come down to three materials: faux rabbit fur, faux cashmere, or printed low-pile polyester. Faux rabbit fur feels the softest underfoot and suits low-traffic rooms. Faux cashmere trades a little of that luxury for the durability daily use demands. Printed low-pile polyester gives up the plushness and, in return, handles pets, spills and hallways without complaint.",
    blocks: [
      { type: "p", text: "The comparisons below reflect how these materials actually behave in homes, including what product listings tend to leave out." },
      { type: "h2", text: "The three materials at a glance" },
      {
        type: "table",
        head: ["Material", "Feel", "Durability", "Shedding", "Care", "Best for"],
        rows: [
          ["Faux rabbit fur", "Plush, fur-like", "Low–moderate", "Common in the first weeks", "Gentle vacuum, spot clean", "Bedrooms, nurseries, low-traffic rooms"],
          ["Faux cashmere", "Soft, smooth, denser", "Moderate", "Minimal", "Regular vacuum, spot clean", "Living rooms, everyday comfort"],
          ["Printed low-pile polyester", "Smooth, flat", "High", "None", "Vacuum or wipe clean", "High-traffic areas, homes with pets"],
        ],
      },
      { type: "h2", text: "Faux rabbit fur: the softest option, with caveats" },
      { type: "p", text: "Faux rabbit fur rugs use long, fine polyester fibers engineered to mimic the density and softness of real fur. Underfoot, nothing else in this price range comes close; it's the material people mean when they say a rug feels \"like walking on a cloud.\"" },
      { type: "p", text: "That softness has a cost. The long fibers are more delicate than a looped or cut pile, so these rugs show wear faster in hallways and under dining chairs. Most also shed lightly for the first few weeks. That's normal, and it settles with regular, gentle vacuuming. Because the fibers trap crumbs and dust, homes with messy pets may find them demanding to keep clean." },
      {
        type: "prosCons",
        pros: [
          "Softest underfoot feel at this price point",
          "Warm, cozy look that suits bedrooms and nurseries",
          "Naturally cushioned, comfortable for sitting on the floor",
        ],
        cons: [
          "Sheds lightly in the first weeks of use",
          "Wears faster under chairs and in hallways",
          "Traps crumbs and dust, so it needs more frequent cleaning",
        ],
      },
      {
        type: "products",
        products: [
          {
            key: "1688-595229918569-c2",
            category: "Faux Rabbit Fur · 160 × 200 cm",
            name: "Plush Faux Rabbit Fur Area Rug — Off White",
            desc: "A classic example of the material: long-pile faux rabbit fur with a low-profile construction that tucks under beds and sofas.",
          },
        ],
      },
      { type: "h2", text: "Faux cashmere: plushness built for daily use" },
      { type: "p", text: "Faux cashmere is a fine, densely woven polyester with a brushed finish. It reads as \"soft\" rather than \"furry\": smoother and lower than faux rabbit fur, and noticeably denser. That density is the practical difference: the fibers spring back instead of matting, so these rugs hold their look in living rooms and under furniture legs." },
      { type: "p", text: "Many faux cashmere rugs add a silicone non-slip backing, which solves a second problem: rugs that slide on hard floors. For a family living room, this is usually the better-balanced pick. The trade-off: it doesn't have the dramatic, fluffy look of fur, and the hand-feel, while soft, is less luxurious." },
      {
        type: "products",
        products: [
          {
            key: "1688-1052742241013-c3",
            category: "Faux Cashmere · 160 × 230 cm",
            name: "Vintage Faux Cashmere Area Rug — Sage Green",
            desc: "Faux cashmere pile with a silicone non-slip backing — the durability-oriented end of the soft-rug spectrum.",
          },
        ],
      },
      { type: "h2", text: "Printed low-pile polyester: the practical workhorse" },
      { type: "p", text: "Printed polyester rugs start with a short, flat pile (around 0.4–0.5 cm) and apply the pattern by printing rather than weaving. The result is a thin, smooth rug that chairs slide over easily, doors clear without catching, and vacuum cleaners handle without fuss." },
      { type: "p", text: "Because the pattern is printed, detail is excellent, which is why intricate Persian- and Turkish-style designs are almost always done this way at accessible prices. The surface is also the easiest of the three to keep clean: most everyday spills wipe off, and the short pile traps far less dust than a shag." },
      { type: "p", text: "The compromise is feel. A flat pile is neat rather than cozy; nobody describes it as luxurious underfoot. For entryways, dining areas, and households with pets or small children, though, that's usually the right trade." },
      { type: "h2", text: "Low pile vs. shag: does height matter more than material?" },
      { type: "p", text: "Pile height and material are related but separate choices. Height decides how a rug is used: low pile (under 1 cm) fits under doors and dining chairs and cleans easily; medium-to-high pile feels cushioned but needs more room and more care. Material decides how it feels and wears. A short list for quick decisions:" },
      {
        type: "list",
        items: [
          "Doorway or dining room: low pile, any material. Height is non-negotiable here",
          "Barefoot comfort first: faux rabbit fur, in a room without heavy traffic",
          "Softness plus durability: faux cashmere",
          "Pets, spills, entryways: printed low-pile polyester",
        ],
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        faqs: [
          {
            q: "Are polyester rugs okay for a living room?",
            a: "Yes: printed low-pile polyester is one of the most practical living room choices because it resists stains and handles foot traffic well. If you want a softer feel underfoot, faux cashmere offers more comfort while still tolerating daily use.",
          },
          {
            q: "Do faux fur rugs shed a lot?",
            a: "Most shed lightly for the first two to four weeks as loose fibers from manufacturing work free. Regular gentle vacuuming (no beater bar) speeds this up. After the initial period, shedding drops off noticeably.",
          },
          {
            q: "Which material is best with kids and pets?",
            a: "Printed low-pile polyester. It's the easiest to clean, doesn't trap crumbs, and has no long fibers for claws to snag. Save faux fur for bedrooms and nurseries where traffic is lighter and softness matters more.",
          },
          {
            q: "Are synthetic rug materials safe for allergies?",
            a: "Synthetic fibers are naturally hypoallergenic and resist dust mites better than wool. That said, any rug holds dust on its surface. Low-pile options collect less and are easier to vacuum thoroughly, which matters more than fiber type for most allergy sufferers.",
          },
        ],
      },
      {
        type: "takeaway",
        text: "Faux rabbit fur wins on feel, printed polyester on practicality, and faux cashmere splits the difference. Match the material to the room's traffic level first and the decision largely makes itself.",
      },
    ],
    recos: [
      { slug: "rug-size-guide", image: "/images/blog/photo-rug-size-guide.jpg", cat: "Buying Guides", title: "Rug Size Guide: How to Choose the Right Rug for Every Room" },
      { slug: "low-pile-vs-shag", image: "/images/blog/photo-low-pile-vs-shag.jpg", cat: "Rug 101", title: "Low Pile vs. Shag: Pile Height, Explained" },
    ],
    cta: {
      heading: "Explore soft, easy-care rugs",
      text: "From plush faux fur to wipe-clean low pile — find the right feel for your floor.",
      label: "Shop Area Rugs",
      href: "/categories/?cat=mats&sub=area-rugs",
    },
  },

  // ==================== 2. Rug Size Guide ====================
  {
    slug: "rug-size-guide",
    title: "Rug Size Guide: How to Choose the Right Rug for Every Room",
    category: "Buying Guides",
    date: "September 15, 2026",
    readTime: 6,
    excerpt:
      "The front-leg rule, room-by-room size charts, and the sizing mistake almost everyone makes.",
    cardImage: "/images/blog/photo-rug-size-guide.jpg",
    metaDescription:
      "Rug size guide with room-by-room charts in inches and centimeters: living room, bedroom, nursery and dining — plus the front-leg rule and four sizing mistakes to avoid.",
    lede:
      "The fastest rule in rug sizing: at least the front legs of your sofa or bed should sit on the rug, with roughly 6–12 inches (15–30 cm) of rug extending beyond the furniture on each side. When you're torn between two sizes, go larger: an undersized rug is the single most common living room mistake.",
    blocks: [
      { type: "p", text: "Measure your space first, then use the room-by-room chart below. Sizes are given in feet/inches with centimeter equivalents, since listings vary between the two." },
      { type: "h2", text: "The front-leg rule (and why bigger is safer)" },
      { type: "p", text: "A rug anchors a seating or sleeping group. If only the coffee table sits on it and all the furniture legs land on bare floor, the room reads as disconnected, and the rug looks like an afterthought." },
      { type: "p", text: "Three setups work, in descending order of \"designed\" feel:" },
      {
        type: "olist",
        items: [
          "All legs on the rug: the classic, grounded look; needs the largest size",
          "Front legs on, back legs off: the most popular compromise; works in most living rooms",
          "Furniture off the rug entirely: acceptable only in small rooms, and only with a rug large enough to fill the space between furniture",
        ],
      },
      {
        type: "image",
        src: "/images/blog/rug-size-diagram.svg",
        alt: "A rug sized so the sofa's front legs rest on it",
        caption: "Front legs on the rug: the safest default for most living rooms.",
      },
      { type: "h2", text: "Size by room" },
      {
        type: "table",
        head: ["Room", "Works well", "Even better", "Notes"],
        rows: [
          ["Living room (compact)", "100 × 200 cm (≈3′3″ × 6′7″)", "160 × 230 cm (≈5′3″ × 7′7″)", "Front legs of sofa on the rug; leave 30+ cm of floor visible at the edges"],
          ["Living room (large)", "160 × 230 cm", "240 × 300 cm (8′ × 10′)", "All furniture legs on the rug if space allows"],
          ["Bedroom — queen bed", "160 × 230 cm", "—", "Rug starts under the bottom third of the bed; extends 45–60 cm past foot and sides"],
          ["Bedroom — king bed", "160 × 230 cm", "240 × 300 cm", "Wider beds need more side coverage; don't go below 160 cm wide"],
          ["Nursery / bedside", "100 × 160 cm (≈3′3″ × 5′3″)", "160 × 200 cm", "Prioritize soft, washable materials; keep it clear of the crib footprint"],
          ["Entryway", "80 × 150 cm runner or 2′ × 3′", "—", "Low pile only — doors must swing clear"],
          ["Dining", "160 × 230 cm", "240 × 300 cm", "Chairs stay on the rug even when pulled out: add 60 cm on all sides of the table"],
        ],
      },
      { type: "h2", text: "Common rug sizes, decoded" },
      { type: "p", text: "Listings mix imperial and metric, which makes comparison harder than it needs to be. Quick conversions for the sizes you'll see most:" },
      {
        type: "list",
        items: [
          "2′ × 3′ (60 × 90 cm) — entryways, beside a reading chair, layering",
          "100 × 200 cm (≈3′3″ × 6′7″) — compact living rooms, reading nooks, entryways; fits under doors easily at low pile heights",
          "5′ × 8′ (150 × 240 cm) — the most common \"starter\" living room size; also works under a queen bed",
          "160 × 230 cm (≈5′3″ × 7′7″) — the sweet spot for most living rooms and dining nooks for four",
          "8′ × 10′ (240 × 300 cm) — large living rooms where all furniture sits fully on the rug",
        ],
      },
      {
        type: "products",
        products: [
          {
            key: "1688-744995685423-c2",
            category: "Low Pile · 100 × 200 cm",
            name: "Geometric Low-Pile Area Rug — Black & White",
            desc: "A compact-room size with a 0.4 cm pile that clears doors and works under a sofa's front legs.",
          },
        ],
      },
      { type: "h2", text: "Four sizing mistakes (and how to avoid them)" },
      {
        type: "olist",
        items: [
          "Buying too small. The classic error. A small rug floating in the middle of the floor makes the whole room feel sparse. If in doubt, size up.",
          "Ignoring door swings and clearances. Anything thicker than ~1 cm at a doorway needs measuring: check the gap under the door before buying plush.",
          "Wrong shape for the room. Long, narrow rooms and hallways take runners; square rooms take square or round rugs. A rectangle in a square room can leave awkward bare corners.",
          "Skipping the rug pad. A pad prevents sliding, adds cushioning, and stops back-and-forth abrasion that wears both rug and floor. On hard floors it's not optional.",
        ],
      },
      {
        type: "products",
        products: [
          {
            key: "1688-745181807454-c2",
            category: "Low Pile · 160 × 230 cm",
            name: "Persian-Style Vintage Area Rug — Navy",
            desc: "The living-room sweet spot: large enough for the front-leg rule, low enough for doorways and dining sets.",
          },
        ],
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        faqs: [
          {
            q: "What size rug under a queen bed?",
            a: "160 × 230 cm is the minimum that works well: place the rug so it starts under the bottom third of the bed and extends past the foot and sides. A 240 × 300 cm rug lets nightstands sit on it too, which is the more luxurious look.",
          },
          {
            q: "Can a rug be too big?",
            a: "Yes, but it's far rarer than too small. You want 30–45 cm of visible floor between the rug edge and the walls. If the rug nearly touches the walls on every side, the room loses its sense of boundaries.",
          },
          {
            q: "Do I really need a rug pad?",
            a: "On hard floors, yes. A pad prevents sliding (a safety issue), adds cushioning, and reduces wear on both the rug backing and the floor finish. On carpet, pads are mostly unnecessary.",
          },
          {
            q: "Round or rectangular?",
            a: "Rectangular suits most rooms and furniture groups. Round rugs work under round dining tables, in reading nooks, and to soften boxy square rooms, but they cover less floor area than a rectangle of the same nominal size.",
          },
        ],
      },
      {
        type: "takeaway",
        text: "Front legs on the rug, 30–45 cm of floor visible around the edges, and size up when in doubt. Get those three right and almost any rug style will work in the room.",
      },
    ],
    recos: [
      { slug: "rug-materials", image: "/images/blog/photo-rug-materials.jpg", cat: "Materials", title: "Rug Materials Explained: Faux Rabbit Fur, Faux Cashmere & Printed Polyester" },
      { slug: "nursery-rugs", image: "/images/blog/photo-nursery-rugs.jpg", cat: "Buying Guides", title: "Nursery & Bedroom Rugs: Softness, Safety and Size" },
    ],
    cta: {
      heading: "Find your size",
      text: "Area rugs from 100 × 160 to 160 × 230 cm — low pile and plush, in sizes that fit the chart above.",
      label: "Shop Area Rugs",
      href: "/categories/?cat=mats&sub=area-rugs",
    },
  },

  // ==================== 3. Chair Cushion Materials ====================
  {
    slug: "cushion-materials",
    title: "Chair Cushion Materials Compared: Fiberfill, Corduroy & Water-Resistant Fabrics",
    category: "Cushions",
    date: "September 16, 2026",
    readTime: 7,
    excerpt:
      "What's inside matters less than what's outside: how to match the cover fabric to the room.",
    cardImage: "/images/blog/photo-cushion-materials.jpg",
    metaDescription:
      "Chair cushion materials explained: polyester fiberfill vs foam, corduroy vs printed polyester vs water-resistant covers — with honest pros, cons and care guidance.",
    lede:
      "Inside, almost every tufted chair cushion is the same recipe: soft polyester fiberfill covered by fabric, so the cover becomes the real decision. Printed polyester covers are the practical choice for everyday dining chairs, corduroy brings warmth and texture to indoor spaces, and water-resistant fabrics prove themselves on patios and gardens.",
    blocks: [
      { type: "p", text: "The cover, not the filling, is where the real material decision sits. The three common covers differ more than their price tags suggest." },
      { type: "h2", text: "Fill first: what's actually inside" },
      { type: "p", text: "At accessible prices, the filling is almost always polyester fiber (often called fiberfill): a lightweight, springy material that bounces back after sitting and dries quickly if it gets damp. Foam-core cushions exist, but they cost more, feel firmer, and hold water far longer, which is one reason fiberfill dominates outdoor-rated cushions." },
      { type: "p", text: "Quality within fiberfill comes down to density and tufting. Deep button tufting stitches through the pad at intervals, holding the fill evenly distributed instead of letting it drift into lumps. A well-tufted pad keeps its shape through a season of daily meals; a loosely filled one flattens in months." },
      { type: "h2", text: "The cover is the real decision" },
      {
        type: "table",
        head: ["Cover fabric", "Feel", "Best for", "Care"],
        rows: [
          ["Printed polyester", "Smooth, light", "Everyday dining & kitchen chairs, indoors or under cover", "Spot clean"],
          ["Corduroy", "Ribbed, warm texture", "Indoor dining rooms, desks, reading chairs", "Spot clean, brush gently"],
          ["Water-resistant polyester", "Slightly coated", "Patios, gardens, balconies", "Wipe clean"],
        ],
      },
      { type: "h2", text: "Printed polyester: the everyday default" },
      { type: "p", text: "Printed polyester covers keep costs down and patterns crisp, which is why the widest color and print selection is always in this group. The weave is tight enough for daily contact with clothing, and spills sit on the surface long enough to blot. The compromise: it's a pragmatic fabric rather than a luxurious one, smooth and neat without much softness." },
      {
        type: "prosCons",
        pros: ["Widest choice of colors and patterns", "Light and quick-drying", "Most affordable cushion category"],
        cons: ["Plain hand-feel, neat rather than plush", "Thin covers can show wear at tie points over years"],
      },
      { type: "h2", text: "Corduroy: texture for indoor rooms" },
      { type: "p", text: "Corduroy covers swap print for texture: the ribbed weave reads as warm and tailored, and it feels noticeably softer against arms and legs than flat polyester. It suits indoor rooms such as dining rooms, home offices and reading corners, where its main practical advantage shows: ribs disguise light creasing and daily dust between cleanings." },
      { type: "p", text: "The trade-off is weather. Corduroy holds moisture in its ribs and dries slowly, so it belongs indoors or on genuinely covered porches. Keep it out of rain, and fluff the ribs occasionally with a soft brush to prevent flattening where people actually sit." },
      {
        type: "products",
        products: [
          {
            key: "b0gd84d8vc",
            category: "Printed Polyester · 43 × 43 cm",
            name: "Tufted Square Seat Pads with Ties, Set of 2 — Green Lantern",
            desc: "The everyday formula: plush fiberfill under a printed polyester cover, with corner ties for a secure fit.",
          },
          {
            key: "b0cbt7rfk2",
            category: "Corduroy · 95 × 45 cm",
            name: "Tufted Corduroy Chair Cushions with Backrest, Set of 2 — Coffee",
            desc: "Ribbed corduroy over thick fiberfill, with a four-tie system that anchors both backrest and seat.",
          },
        ],
      },
      { type: "h2", text: "Water-resistant fabrics: built for the patio" },
      { type: "p", text: "Outdoor-rated cushions use a coated or tightly woven polyester that makes spills and light rain bead up instead of soaking in. Paired with quick-drying fiberfill, a water-resistant cover is what separates a cushion that survives a wet morning from one that stays damp for days." },
      { type: "p", text: "Two honest caveats. Water-resistant is not waterproof: seams and ties still let water through in a downpour, so covered areas remain better. And coatings fade first under strong sun; fade-resistant treatments help, but no fabric at this price shrugs off a full summer of direct UV indefinitely. If your chairs live outdoors year-round, plan on covers or a winter indoors." },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        faqs: [
          {
            q: "Are fiber-filled cushions comfortable for long dinners?",
            a: "Yes, provided the fill is dense and tufted. A thick, well-tufted fiberfill pad supports 1–2 hours of sitting comfortably; beyond that, any fiberfill compresses. Foam cores last longer under constant use but cost more and suit indoors only.",
          },
          {
            q: "Can chair cushions go in the washing machine?",
            a: "Most tufted cushions with fiberfill should be spot-cleaned. Machine washing saturates the fill and can cause lumping as it dries. Check the label; when in doubt, a damp cloth with mild soap handles most spills.",
          },
          {
            q: "What's the difference between waterproof and water-resistant?",
            a: "Water-resistant fabric beads light moisture: drips, dew, a spilled glass. Waterproof means seams and fabric block water entirely, which is rare in cushions at this price. For uncovered patios, treat water-resistant as fair-weather gear.",
          },
          {
            q: "How long does fiberfill cushioning last?",
            a: "With daily use, expect one to two seasons before noticeable flattening. Rotating or flipping the cushion spreads the compression, and a few hours in the sun occasionally helps the fibers rebound.",
          },
        ],
      },
      {
        type: "takeaway",
        text: "The filling is usually fiberfill, so judge it by density and tufting. Spend the real decision on the cover: printed polyester for value, corduroy for indoor texture, water-resistant fabric wherever rain is possible.",
      },
    ],
    recos: [
      { slug: "cushion-size-guide", image: "/images/blog/photo-cushion-size-guide.jpg", cat: "Buying Guides", title: "Chair Cushion Size Guide: Seat Pads, High-Back Sets & Rocking Chair Cushions" },
      { slug: "rug-materials", image: "/images/blog/photo-rug-materials.jpg", cat: "Materials", title: "Rug Materials Explained: Faux Rabbit Fur, Faux Cashmere & Printed Polyester" },
    ],
    cta: {
      heading: "Cushion your chairs",
      text: "Tufted seat pads and high-back sets for dining rooms, desks and patios.",
      label: "Shop Cushions",
      href: "/products?cat=cushions",
    },
  },

  // ==================== 4. Chair Cushion Size Guide ====================
  {
    slug: "cushion-size-guide",
    title: "Chair Cushion Size Guide: Seat Pads, High-Back Sets & Rocking Chair Cushions",
    category: "Buying Guides",
    date: "September 16, 2026",
    readTime: 6,
    excerpt:
      "Measure once, buy right: the three measurements that decide whether a cushion fits your chair.",
    cardImage: "/images/blog/photo-cushion-size-guide.jpg",
    metaDescription:
      "Chair cushion size guide: measure for seat pads (43 × 43 cm), high-back sets (95 × 45 cm), rocking chair two-piece sets and oversized patio cushions — plus three fit mistakes to avoid.",
    lede:
      "A seat pad should match your chair's seat with roughly 1–2 cm of coverage to spare on each side. Most dining and kitchen chairs take a 43 × 43 cm (17″ × 17″) square pad; chairs with backs are better served by a high-back set around 95 × 45 cm (≈37″ × 18″).",
    blocks: [
      { type: "p", text: "Chair cushions are more size-sensitive than rugs: too big looks sloppy and stresses the ties, too small slides. Three measurements decide it." },
      { type: "h2", text: "Measure in three steps" },
      {
        type: "olist",
        items: [
          "Seat width and depth. Measure the flat sitting surface, edge to edge. The pad should match or be up to 2 cm smaller, never larger, or it drapes over the edges.",
          "Back height. If you want the backrest covered, measure from the seat surface to the top of the backrest, then subtract 5–10 cm: the back pad should stop below the top rail so the chair's design still shows.",
          "Thickness against armrests. A thick pad (8–10 cm) raises sitting height by that much. Chairs with arms, or tucking under a table, usually want 5–8 cm instead.",
        ],
      },
      { type: "h2", text: "Size by chair type" },
      {
        type: "table",
        head: ["Chair type", "Typical size", "Notes"],
        rows: [
          ["Dining / kitchen chair (seat only)", "43 × 43 cm (17″ × 17″) square pad", "The most common size; look for corner ties to stop sliding"],
          ["Dining chair with back", "95 × 45 cm (≈37″ × 18″) set", "One-piece or two-piece; back pad ≈50 × 45 cm, seat ≈45 × 45 cm"],
          ["Rocking chair", "Two-piece: back 50 × 43 cm (20″ × 17″) + seat 43 × 43 cm (17″ × 17″)", "Upper and lower pads sold as sets; ties anchor both to the frame"],
          ["Large patio / garden armchair", "110 × 53–55 cm (≈43″ × 21″) one-piece", "Full back-and-seat coverage for high-back outdoor furniture"],
          ["Office / desk chair", "40–45 cm square, 5–7 cm thick", "Thinner pads preserve desk and armrest height"],
        ],
      },
      { type: "h2", text: "One-piece or two-piece high-back sets?" },
      { type: "p", text: "One-piece cushions connect the backrest and seat as a single panel: they stay aligned automatically and look tailored, which suits fixed dining chairs. Two-piece sets use a separate back pad and seat pad connected by ties. They cost a little adjustment time but flex to fit curved or unusually spaced backs, and you can replace one piece without redoing the other." },
      { type: "p", text: "For standard straight-backed chairs, either works. For rocking chairs, where the back tilts and the seat moves, two-piece sets track the movement better and are the traditional choice." },
      {
        type: "products",
        products: [
          {
            key: "b0cjhx7xkl",
            category: "Seat Pad · 43 × 43 cm",
            name: "Tufted Houndstooth Seat Pads with Ties, Set of 2 — Navy Blue",
            desc: "The standard dining-chair size: a 43 × 43 cm tufted pad with ties to anchor it in place.",
          },
          {
            key: "b0cw19gmpq",
            category: "High-Back Set · 95 × 45 cm",
            name: "Chair Cushion Set with Backrest and Seat Pads — Navy Houndstooth",
            desc: "The two-piece dining-chair format: square back pad plus contoured seat pad, both with corner ties.",
          },
        ],
      },
      { type: "h2", text: "Three fit mistakes to avoid" },
      {
        type: "olist",
        items: [
          "Buying too large. A pad that overhangs the seat edge hangs, creases, and pulls on its ties every time someone sits down. Match the seat, don't exceed it.",
          "Going too thick for the space. Thick is cozy until it isn't: check the gap under armrests and the distance to the tabletop before choosing anything over 8 cm.",
          "Ignoring tie placement. Ties need something to anchor to: rails, spindles, or chair legs. A smooth shell chair with nothing to tie onto will fight you; look for non-slip backing instead.",
        ],
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        faqs: [
          {
            q: "Will a 43 × 43 cm pad fit my chair?",
            a: "Measure the flat sitting surface. If it's between 40 and 43 cm on both sides, yes: the pad should cover the seat with a small margin. Chairs smaller than 40 cm (some bistro and children's chairs) need a smaller pad to avoid overhang.",
          },
          {
            q: "Do high-back sets work on chairs with curved backs?",
            a: "Two-piece sets do. The separate back pad ties at its own points and flexes to gentle curves. One-piece cushions assume a straight back and will gap or bunch on strongly curved chairs.",
          },
          {
            q: "How thick should a seat pad be?",
            a: "5–8 cm for dining chairs (comfortable but you can still reach the table), 8–10 cm for lounge and rocking chairs where sinking in is the point, and under 5 cm for desk chairs to preserve ergonomics.",
          },
          {
            q: "Are ties really necessary?",
            a: "On wood, metal, or wicker frames, yes. Smooth plastic shells and upholstered chairs are the exception: there, a non-slip backing does the job ties otherwise would.",
          },
        ],
      },
      {
        type: "takeaway",
        text: "Measure the seat, keep the pad equal or slightly smaller, match thickness to armrests. When a chair has a back worth cushioning, a tied two-piece set is the most forgiving format.",
      },
    ],
    recos: [
      { slug: "cushion-materials", image: "/images/blog/photo-cushion-materials.jpg", cat: "Materials", title: "Chair Cushion Materials Compared: Fiberfill, Corduroy & Water-Resistant Fabrics" },
      { slug: "door-mats-101", image: "/images/blog/photo-door-mats-101.jpg", cat: "Mats", title: "Door Mats 101: How Entry Mats Actually Trap Dirt" },
    ],
    cta: {
      heading: "Find your chair's fit",
      text: "Seat pads in 43 × 43 cm and high-back sets in 95 × 45 cm — tufted, tied, in classic patterns.",
      label: "Shop Cushions",
      href: "/products?cat=cushions",
    },
  },

  // ==================== 5. Pillow Filling ====================
  {
    slug: "pillow-filling",
    title: "Pillow Filling Explained: Polyester Fiber, Down Alternative & Memory Foam",
    category: "Pillows",
    date: "September 16, 2026",
    readTime: 7,
    excerpt:
      "Three fills, three very different nights. Which one matches how you actually sleep.",
    cardImage: "/images/blog/photo-pillow-filling.jpg",
    metaDescription:
      "Pillow filling guide: hollow-fibre polyester vs down alternative vs memory foam — feel, support, washing and which fill matches your sleep position and budget.",
    lede:
      "Three fills cover almost every pillow in a home: hollow-fibre polyester (light, washable, affordable), down alternative (cloud-like softness without feathers), and memory foam (slow-rebound contouring for targeted support). Memory foam goes where your neck does the work: travel, reading upright, side sleeping with a sore neck. Hollow fibre handles decorative inserts and guest rooms; down alternative is the everyday sleeping fill.",
    blocks: [
      { type: "p", text: "Night to night, the differences between them show up fast." },
      { type: "h2", text: "Three fills, compared" },
      {
        type: "table",
        head: ["Fill", "Feel", "Support", "Care", "Best for"],
        rows: [
          ["Hollow-fibre polyester", "Light, springy", "Gentle", "Machine washable", "Decorative inserts, guest rooms, budget refreshes"],
          ["Down alternative", "Cloud-like, plush", "Medium, moldable", "Machine washable", "Everyday sleeping pillows, all sleep positions"],
          ["Memory foam", "Dense, contouring", "High, targeted", "Cover only, spot clean foam", "Neck support, travel, upright resting"],
        ],
      },
      { type: "h2", text: "Hollow-fibre polyester: light, washable, affordable" },
      { type: "p", text: "Hollow fibre is polyester spun into strands with air channels, which keeps it light and lets it spring back after compression. It's the standard fill for decorative cushion inserts, the pads inside your favorite covers, because it's cheap, breathable, and genuinely machine washable." },
      { type: "p", text: "Its limits: loft is lower than down alternative, and it flattens with sustained use. The fix is mechanical: a daily pat and a periodic wash restore most of the bounce. Quilted constructions (diamond stitching across the shell) hold the fill more evenly and resist the lumping that plain inserts develop over time." },
      {
        type: "prosCons",
        pros: ["Machine washable, the easiest fill to keep fresh", "Light and breathable", "Most affordable fill by a wide margin"],
        cons: ["Flattens faster than the alternatives", "Modest loft, less dramatic plumpness in covers"],
      },
      { type: "h2", text: "Down alternative: plushness without feathers" },
      { type: "p", text: "Down alternative is fine microfiber engineered to mimic the softness of down: it compresses fully, molds around your head, and springs back slowly rather than instantly. In a sleeping pillow, that balance matters: firm enough to keep your neck aligned, soft enough to shape to your position, whatever it is." },
      { type: "p", text: "It's also the forgiving choice. Unlike true down, it's hypoallergenic, washes without drama, and costs a fraction of the price. Look for reinforced seams and a tight shell weave (embossed microfiber is common): the shell determines whether the fill stays distributed or migrates into lumps." },
      {
        type: "products",
        products: [
          {
            key: "b0gd846fs2",
            category: "Down Alternative · 40 × 70 cm",
            name: "Embossed Microfiber Bed Pillows, Set of 2 — White",
            desc: "Down-alternative fill in a breathable embossed shell — the everyday sleeping-pillow formula, machine washable.",
          },
        ],
      },
      { type: "h2", text: "Memory foam: contouring where it counts" },
      { type: "p", text: "Memory foam is a different category of support: high-density foam that compresses slowly under pressure and holds the shape it's given. For pillows, that means the foam molds to the curve of your neck and keeps it supported, which is why it dominates travel neck pillows and ergonomic bed pillows alike." },
      { type: "p", text: "The honest trade-offs: memory foam sleeps warmer than fiber (look for ventilated or mesh-panel designs if that matters), it can't be machine washed, only the cover comes off, and its support is positional. A U-shaped travel pillow is excellent in a seat and useless in a bed. Match the format to the use." },
      {
        type: "products",
        products: [
          {
            key: "b0c8j237v3",
            category: "Memory Foam · Travel",
            name: "U-Shaped Memory Foam Travel Neck Pillow — Navy Blue",
            desc: "Slow-rebound foam with an adjustable snap closure and a velvet cover — support designed for upright rest.",
          },
        ],
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        faqs: [
          {
            q: "Which fill is best for side sleepers?",
            a: "Down alternative with a medium-to-high loft. Side sleepers need a pillow tall enough to fill the gap between shoulder and head; hollow fibre usually can't hold that height under real weight, and memory foam's fixed shape doesn't suit the shoulder-tuck position.",
          },
          {
            q: "Do polyester pillows flatten over time?",
            a: "Yes, expect noticeable softening after 12–24 months of nightly use. Washing and thorough drying resets much of the loft; daily fluffing slows the process. Decorative inserts that aren't slept on last far longer.",
          },
          {
            q: "Can you wash memory foam?",
            a: "No. Waterlogged foam tears easily and dries slowly enough to grow mildew inside. Remove and machine-wash the cover; spot-clean the foam itself with a barely damp cloth and let it air-dry fully.",
          },
          {
            q: "What size insert goes in a decorative cover?",
            a: "One size up from the cover fills it out best. A 45 × 45 cm insert in a 45 × 45 cm cover looks flat; the same cover over a slightly larger, well-filled pad looks full. Just don't force it: overstuffed covers stress seams.",
          },
        ],
      },
      {
        type: "takeaway",
        text: "Hollow fibre for covers and guest rooms, down alternative for the pillows you actually sleep on, memory foam for necks that need contouring. Match the fill to the job and the pillow stops being a guess.",
      },
    ],
    recos: [
      { slug: "rug-materials", image: "/images/blog/photo-rug-materials.jpg", cat: "Materials", title: "Rug Materials Explained: Faux Rabbit Fur, Faux Cashmere & Printed Polyester" },
      { slug: "door-mats-101", image: "/images/blog/photo-door-mats-101.jpg", cat: "Mats", title: "Door Mats 101: How Entry Mats Actually Trap Dirt" },
    ],
    cta: {
      heading: "Pillows for every night",
      text: "Down alternative bed pillows, hollow-fibre inserts and memory foam travel support.",
      label: "Shop Pillows",
      href: "/products?cat=pillows",
    },
  },

  // ==================== 6. Door Mats 101 ====================
  {
    slug: "door-mats-101",
    title: "Door Mats 101: How Entry Mats Actually Trap Dirt",
    category: "Mats",
    date: "September 16, 2026",
    readTime: 5,
    excerpt:
      "Scrape, absorb, hold: the three-zone principle behind a mat that really keeps floors clean.",
    cardImage: "/images/blog/photo-door-mats-101.jpg",
    metaDescription:
      "How door mats work: the scrape-absorb-hold principle, indoor vs outdoor placement, material comparison (coir, rubber, imitation sisal, microfibre) and proper mat sizing.",
    lede:
      "A good entry mat does three jobs in about two strides: scrape grit off shoe soles, absorb moisture, and hold both away from your floors. No single mat does all three well, so split the work: a coarse scraper mat outside the door, an absorbent loop-pile mat inside. Make each at least as wide as the door, ideally 75–90 cm deep, so both feet land on it.",
    blocks: [
      { type: "p", text: "Understood that way, most \"useless\" doormats are simply doing only one of the three jobs." },
      { type: "h2", text: "The three-zone principle" },
      {
        type: "olist",
        items: [
          "Scrape. Stiff, coarse fibers break dried mud loose from treads and soles. This needs texture; soft mats can't do it.",
          "Absorb. Rain-wet shoes need something that takes moisture in: dense fiber loops or microfibre surfaces, not slick rubber.",
          "Hold. Whatever comes off the shoe has to disappear into the pile and stay there until cleaning. Shallow or glossy mats release everything back onto the floor.",
        ],
      },
      { type: "p", text: "No single thin mat excels at all three. The reason a mat \"doesn't work\" is usually that it was asked to." },
      { type: "h2", text: "Indoors vs outdoors: split the job" },
      { type: "p", text: "Outside the door, use a scraper: rubber fingers, stiff bristles, or coarse natural fibre. Their whole job is the first zone, knocking grit loose, and they survive rain because water drains straight through." },
      { type: "p", text: "Inside the door, use an absorbent holder: a dense loop-pile mat (imitation sisal is the common construction) with a non-slip backing. By the second stride, shoes are dry enough that the mat's job is catching the last fine dust and holding it in the loops until vacuum day." },
      { type: "p", text: "Check the door's swing clearance before buying: most loop-pile mats sit 8–10 mm high, which clears standard doors, but low-clearance doors want a mat under 6 mm." },
      { type: "h2", text: "Common mat materials compared" },
      {
        type: "table",
        head: ["Material", "Main job", "Wet performance", "Care"],
        rows: [
          ["Coir (coconut fibre)", "Scrape — stiff natural bristles", "Poor when soaked; slow to dry", "Shake, vacuum"],
          ["Rubber scraper", "Scrape — toughest mud", "Excellent; drains through", "Hose off"],
          ["Imitation sisal loop", "Hold + absorb (indoor)", "Good; absorbs and dries reasonably", "Vacuum, shake out"],
          ["Microfibre top", "Absorb", "Excellent", "Machine washable"],
        ],
      },
      { type: "h2", text: "Size and placement" },
      {
        type: "list",
        items: [
          "Width: at least the door's width, ideally wider. Traffic doesn't walk a straight line.",
          "Depth: 75–90 cm so a natural two-stride walk keeps both feet on the mat. A 40 cm strip catches one shoe, one time.",
          "Standard fit: 50 × 80 cm covers a single doorway well and fits most entry floors; some indoor mats are scored so you can trim them to fit alcoves.",
          "Backing matters: a non-slip underside is what lets a mat do its job on tile and hardwood. A sliding mat stops being walked on.",
        ],
      },
      {
        type: "products",
        products: [
          {
            key: "1688-1016436401519",
            category: "Indoor Loop Pile · 50 × 80 cm",
            name: "Imitation Sisal Door Mat, Non-Slip & Absorbent, 2-Pack — Camel Brown",
            desc: "Dense 8 mm loop pile for the inside job: absorbs, holds grit, trims to fit — with a non-slip backing.",
          },
        ],
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        faqs: [
          {
            q: "How often should I clean an entry mat?",
            a: "Shake or beat out indoor mats weekly, vacuum them every two weeks, and give them a proper deep clean monthly. A mat that's visibly holding material is past due — the pile can only hold so much before shoes pick it back up.",
          },
          {
            q: "Is coir better than synthetic mats?",
            a: "For scraping outdoors, coir is excellent: stiff, natural, cheap. But it degrades fast when soaked, so it belongs under cover. Synthetics (rubber, polypropylene loops) handle weather better and suit exposed doorways.",
          },
          {
            q: "What size do I need for double doors?",
            a: "Match the combined width, typically 150–180 cm, either with one wide runner-style mat or two standard mats side by side. Keep depth at 75–90 cm for full stride coverage.",
          },
          {
            q: "Do I need a doormat on carpet?",
            a: "Yes. Carpet needs more protection, not less. Use a low-profile mat with a non-slip or felt backing that won't stain the carpet pile, and keep it under ~6 mm so the door clears it.",
          },
        ],
      },
      {
        type: "takeaway",
        text: "One mat can't scrape, absorb and hold at once. Pair a scraper outside with an absorbent loop-pile mat inside, each as wide as the door and deep enough for two strides, and the rest of your floors stay cleaner for longer.",
      },
    ],
    recos: [
      { slug: "cushion-size-guide", image: "/images/blog/photo-cushion-size-guide.jpg", cat: "Buying Guides", title: "Chair Cushion Size Guide: Seat Pads, High-Back Sets & Rocking Chair Cushions" },
      { slug: "rug-size-guide", image: "/images/blog/photo-rug-size-guide.jpg", cat: "Buying Guides", title: "Rug Size Guide: How to Choose the Right Rug for Every Room" },
    ],
    cta: {
      heading: "Start at the door",
      text: "Absorbent, non-slip entry mats — cut-to-fit sizes for every entryway.",
      label: "Shop Mats",
      href: "/products?cat=mats",
    },
  },

  // ==================== 7. Low Pile vs Shag ====================
  {
    slug: "low-pile-vs-shag",
    title: "Low Pile vs. Shag: Pile Height, Explained",
    category: "Rug 101",
    date: "September 16, 2026",
    readTime: 6,
    excerpt:
      "What pile height means for comfort, cleaning and where a rug can go.",
    cardImage: "/images/blog/photo-low-pile-vs-shag.jpg",
    metaDescription:
      "Low pile vs medium vs shag rugs: what pile height means for comfort, door clearance, cleaning and durability — with a band-by-band comparison table.",
    lede:
      "Pile height, how far the rug's fibers stand above its backing, decides more about daily life with a rug than color or material does. Low pile (under 1 cm) belongs in doorways, dining rooms and busy floors. Medium pile suits living rooms. Shag (2 cm and up) is for bedrooms and barefoot zones. Height decides where a rug can go; material decides how it feels.",
    blocks: [
      { type: "p", text: "The bands, one by one." },
      { type: "h2", text: "What pile height actually measures" },
      { type: "p", text: "Pile is the fiber you see and touch; the backing is what it's anchored to. Height is measured from backing to fiber tip. Listings split into three practical bands:" },
      {
        type: "table",
        head: ["Band", "Typical height", "Feel", "Cleaning", "Fits"],
        rows: [
          ["Low pile", "0.4–1 cm", "Flat, smooth, firm", "Easiest — vacuum fully, wipe spills", "Entryways, dining rooms, hallways, kitchens"],
          ["Medium pile", "1–2 cm", "Cushioned but tidy", "Regular vacuum, occasional deep clean", "Living rooms, bedrooms"],
          ["High pile / shag", "2–5 cm", "Deep, plush, sink-in", "Demands care — no beater bars", "Bedrooms, nurseries (toddler+), reading nooks"],
        ],
      },
      { type: "p", text: "Printed low-pile rugs typically sit around 0.4–0.5 cm, thin enough to clear doors and sit under dining chairs. Faux fur and shaggy constructions run 2–5 cm depending on fiber length." },
      { type: "h2", text: "Low pile: where function wins" },
      { type: "p", text: "Low pile is the format that says yes to everything. Doors swing over it. Dining chairs slide instead of snagging. Vacuum cleaners pass in straight lines without wrestling. And because the fibers are short, spills stay near the surface where a cloth can actually reach them." },
      { type: "p", text: "It's also the most durable-looking format: wear shows on high pile as matting and tangling, but a low-pile surface wears evenly and prints stay crisp for years. The compromise is feel: flat pile is neat, not luxurious. Nobody sinks their toes into a 0.5 cm rug and sighs." },
      {
        type: "prosCons",
        pros: ["Clears doors and slides under furniture", "Chairs move freely — dining rooms, offices", "Easiest to vacuum and spot clean"],
        cons: ["Minimal cushioning underfoot", "Less sound absorption in echoey rooms"],
      },
      { type: "h2", text: "Shag: where comfort wins" },
      { type: "p", text: "Shag and faux fur rugs are comfort equipment. Long fibers (2 cm and beyond) spread pressure across thousands of soft points, absorb sound, and make cold floors livable in winter. In a bedroom or a reading corner, that's the entire product." },
      { type: "p", text: "The costs are real, though. Long fibers trap crumbs, dust and pet hair deep in the pile where surface vacuuming can't reach. They snag on vacuum beater bars, so you'll need to switch it off or use an upholstery attachment. And in traffic paths, shag mats down and tangles; it's a barefoot-zone material, not a hallway material." },
      {
        type: "products",
        products: [
          {
            key: "1688-744995685423-c2",
            category: "Low Pile · 0.4 cm · 100 × 200 cm",
            name: "Geometric Low-Pile Area Rug — Black & White",
            desc: "Classic low-pile territory: door-safe, chair-friendly, and the easiest surface in the house to keep clean.",
          },
        ],
      },
      { type: "h2", text: "Does height affect durability?" },
      { type: "p", text: "Indirectly, yes. Low-pile surfaces show wear slowly and evenly: there's little fiber length to lose. High pile wears by matting: fibers in walked paths bend and tangle flat, which reads as \"old\" even when the rug is structurally fine. Rotating a shag rug every few months spreads the traffic and doubles its good-looking years." },
      { type: "p", text: "Shedding also tracks with fiber length in faux fur and shaggy constructions: longer cut fibers shed more in the first weeks (this settles; see our cleaning guide for the routine)." },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        faqs: [
          {
            q: "Can I use a beater-bar vacuum on shag?",
            a: "No. The rotating bar grabs long fibers and pulls them out or tangles them. Switch the beater bar off (most vacuums allow it) or use the upholstery/hard-floor attachment, and vacuum in the direction of the pile.",
          },
          {
            q: "Is thicker always more comfortable?",
            a: "Under bare feet, generally yes. But thickness has trade-offs: doors, dining chairs and desk chairs all prefer thin. Comfort per centimeter is highest at medium pile, the sweet spot for living rooms.",
          },
          {
            q: "What pile height works in a nursery?",
            a: "Short-to-medium (under 1.5 cm) for infant floor time: long fibers hold more dust and are harder to keep genuinely clean. Save the deep shag for toddler-and-up reading corners.",
          },
          {
            q: "Does pile height affect shedding?",
            a: "In cut-pile constructions, longer fibers mean more initial shedding, since the loose ends from manufacturing have more length to work free. It tapers off within weeks; low-pile printed rugs barely shed at all.",
          },
        ],
      },
      {
        type: "takeaway",
        text: "Height is a placement decision. Low pile wherever doors, chairs and traffic live; medium for shared rooms; shag only where bare feet are the point, paired with the right vacuum routine from day one.",
      },
    ],
    recos: [
      { slug: "clean-soft-rug", image: "/images/blog/photo-clean-soft-rug.jpg", cat: "Care & Cleaning", title: "How to Clean a Soft Rug (Without Ruining It)" },
      { slug: "rug-materials", image: "/images/blog/photo-rug-materials.jpg", cat: "Materials", title: "Rug Materials Explained: Faux Rabbit Fur, Faux Cashmere & Printed Polyester" },
    ],
    cta: {
      heading: "Pick your pile",
      text: "Low-pile prints for busy rooms, plush faux fur for barefoot zones.",
      label: "Shop Area Rugs",
      href: "/categories/?cat=mats&sub=area-rugs",
    },
  },

  // ==================== 8. Clean a Soft Rug ====================
  {
    slug: "clean-soft-rug",
    title: "How to Clean a Soft Rug (Without Ruining It)",
    category: "Care & Cleaning",
    date: "September 16, 2026",
    readTime: 7,
    excerpt:
      "Vacuum settings, spill response and the mistakes that flatten plush fibers for good.",
    cardImage: "/images/blog/photo-clean-soft-rug.jpg",
    metaDescription:
      "How to clean soft rugs without damage: gentle vacuuming settings, the blot protocol for spills, a stain quick-reference table, deep-cleaning frequency and what actually ruins plush fibers.",
    lede:
      "Most soft rugs aren't ruined by dirt — they're ruined by cleaning: too much water, too much heat, or a beater bar that shreds long fibers. Vacuum gently and often, blot spills immediately (never rub), deep clean sparingly, and dry completely. That's ninety percent of rug care.",
    blocks: [
      { type: "p", text: "The routine differs by pile height, so we'll split low-pile and shag where it matters." },
      { type: "h2", text: "Vacuuming: gentle and regular beats aggressive and rare" },
      { type: "p", text: "Vacuum low-pile rugs once or twice a week on normal settings. For shag, faux fur and any long-pile construction, switch the beater bar off. The rotating brush grabs long fibers and pulls them from the backing. Use the upholstery attachment instead, and stroke in the direction of the pile so the fibers lie back naturally." },
      { type: "p", text: "Two habits extend a plush rug's life noticeably: vacuum under furniture edges where dust settles unseen, and give shag a weekly fluff: a quick rake with your hands or a wide-tooth comb keeps long fibers from tangling into felt." },
      { type: "h2", text: "Spills: the blot protocol" },
      { type: "p", text: "Time matters more than product. Fresh spills sit near the surface; set spills travel into the backing. The sequence:" },
      {
        type: "olist",
        items: [
          "Blot, never rub. Rubbing grinds the spill deeper and distorts the pile. Press a clean, dry cloth straight down, then lift.",
          "Work from the outside in. Start at the spill's edge and move toward the center. Cleaning the other way spreads the stain into a ring.",
          "Mild soap and cold water. A drop of dish soap in a cup of cold water handles most household spills. Dampen the cloth, don't pour the rug.",
          "Dry fully. Blot with a dry towel, then air-dry — a fan on low speeds it up. Heat (hair dryers, radiators) can set stains and warp backings.",
        ],
      },
      { type: "h2", text: "Common stains, quick reference" },
      {
        type: "table",
        head: ["Spill", "First move", "Then"],
        rows: [
          ["Coffee / wine", "Blot immediately, cold water", "Mild soap solution, blot, rinse cloth, blot dry"],
          ["Pet urine", "Blot heavily", "Enzyme cleaner (follow label); avoid steam — heat locks the odor in"],
          ["Mud", "Let it dry completely", "Vacuum the crumbs, then treat residue with soap solution"],
          ["Grease / oil", "Blot surface excess", "Minimal dry-cleaning solvent on a cloth — test a corner first"],
          ["Pen / marker", "Don't scrub", "Dab with rubbing alcohol on a cotton ball, working outward"],
        ],
      },
      {
        type: "products",
        products: [
          {
            key: "1688-595229918569-c2",
            category: "Faux Rabbit Fur · 160 × 200 cm",
            name: "Plush Faux Rabbit Fur Area Rug — Off White",
            desc: "Long-pile rugs reward the gentle routine: no beater bar, blot-only spills, direction-of-pile vacuuming.",
          },
        ],
      },
      { type: "h2", text: "Deep cleaning: rarely, and gently" },
      { type: "p", text: "Low-pile rugs tolerate an occasional deeper wash: a damp mop-style pass with diluted soap, or (if the label allows) a gentle shampoo, followed by a full dry. Do it every 12–18 months, not monthly; over-wetting is the fastest route to backing damage and musty smell." },
      { type: "p", text: "Shag and faux fur should never be soaked or machine-washed. Beyond a certain water load, long fibers mat permanently and backing adhesives let go. For a genuine deep clean, dry-cleaning powder products or a professional with plush-rug experience are the safe paths." },
      { type: "h2", text: "The five things that actually ruin soft rugs" },
      {
        type: "olist",
        items: [
          "Heat. Hot water and dryers set stains, shrink backings, and crimp synthetic fibers. Cold water, air drying.",
          "Oversaturation. Water that reaches the backing takes days to dry and breeds odor. Damp cloth, not a pour.",
          "Beater bars on long pile. One aggressive pass can pull a visible stripe of fiber out of a shag.",
          "Bleach and harsh chemicals. They don't just discolor — they weaken synthetic fibers so the pile snaps later at that spot.",
          "Skipping the rug pad. A pad stops the grinding motion between rug and floor that wears both — and keeps the rug flat while you clean it.",
        ],
      },
      {
        type: "products",
        products: [
          {
            key: "1688-744995685423",
            category: "Low Pile · 100 × 200 cm",
            name: "Modern Geometric Area Rug — Grey Beige",
            desc: "The forgiving end of the spectrum: a printed low-pile surface that vacuums clean and wipes down after spills.",
          },
        ],
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        faqs: [
          {
            q: "Can I use a carpet shampooer on a shag rug?",
            a: "Not recommended. Shampooers saturate deeply and their brushes agitate against the pile direction, exactly the two things long fibers hate. Spot-clean, or use a dry-cleaning powder, or call a professional for periodic deep cleans.",
          },
          {
            q: "How do I dry a wet rug quickly?",
            a: "Blot hard with dry towels first; they pull more water than you'd expect. Then elevate airflow: fan on low, windows open, rug flat. Never apply heat. If the backing got soaked, prop the rug on its side to air the underside too.",
          },
          {
            q: "Is baking soda safe for deodorizing rugs?",
            a: "Yes. Sprinkle a thin layer, let it sit for an hour or overnight, then vacuum thoroughly. On shag, work it in gently with your hand and allow extra vacuuming passes; residue buried in long fibers dulls them.",
          },
          {
            q: "Does a rug pad really help with cleaning?",
            a: "Indirectly but meaningfully: pads stop the rug from sliding while you blot and vacuum, prevent floor finish from staining into a damp backing, and reduce the fiber-grinding friction that makes rugs look old faster.",
          },
        ],
      },
      {
        type: "takeaway",
        text: "Cold water, blotting, gentle vacuuming, rare deep cleans. Almost every ruined soft rug was killed by heat, soaking, or a beater bar; avoid those three and even a plush faux fur rug ages gracefully.",
      },
    ],
    recos: [
      { slug: "low-pile-vs-shag", image: "/images/blog/photo-low-pile-vs-shag.jpg", cat: "Rug 101", title: "Low Pile vs. Shag: Pile Height, Explained" },
      { slug: "rug-materials", image: "/images/blog/photo-rug-materials.jpg", cat: "Materials", title: "Rug Materials Explained: Faux Rabbit Fur, Faux Cashmere & Printed Polyester" },
    ],
    cta: {
      heading: "Rugs worth keeping",
      text: "Low-pile easy-cleaners and plush fibers — matched to how you actually live.",
      label: "Shop Area Rugs",
      href: "/categories/?cat=mats&sub=area-rugs",
    },
  },

  // ==================== 9. Persian Styling ====================
  {
    slug: "persian-styling",
    title: "How to Style a Vintage Persian-Style Rug in a Modern Home",
    category: "Styling",
    date: "September 16, 2026",
    readTime: 8,
    excerpt:
      "Five room scenarios, a color rule you can remember, and the combos that quietly fail.",
    cardImage: "/images/blog/photo-persian-styling.jpg",
    metaDescription:
      "Styling a vintage Persian-style rug in a modern home: five room pairings, the one-color rule for accents, and four combinations that quietly fail — with practical color tables.",
    lede:
      "A vintage Persian-style rug is the easiest way to give a modern room a sense of history — if you let it lead. Pull one secondary color from the pattern into your pillows and art, keep the large furniture neutral, and give the rug most of the room's pattern budget.",
    blocks: [
      { type: "p", text: "Five room scenarios cover nearly every situation. But first, why this works at all." },
      { type: "h2", text: "Why vintage patterns flatter modern rooms" },
      { type: "p", text: "Traditional medallion and botanical designs were built to be busy: dense borders, layered motifs, a dozen shades. In a room of clean lines and flat colors, that density stops being noise and becomes the interest. The distressed, slightly faded finish common on vintage-style pieces softens the pattern further, which is exactly why it pairs with minimalism better than a high-contrast new rug would." },
      { type: "p", text: "The practical takeaway: a busy rug needs a calm room more than a calm rug needs a busy room." },
      { type: "h2", text: "Five pairings that work" },
      {
        type: "olist",
        items: [
          "Modern minimalist. White or light-grey walls, a low neutral sofa, black accents: the rug becomes the room's only pattern and carries it effortlessly. This is the highest-impact, lowest-risk pairing.",
          "Boho layered. Plants, rattan, linen, a stack of throws — the rug grounds the collection. In boho rooms the rug should sit under at least the front legs of the seating so it reads as part of the composition, not a mat beside it.",
          "Cream and greige soft rooms. All-beige rooms risk flatness; a multicolor vintage rug supplies the missing contrast without introducing a color scheme. Pick a rug whose field tone is close to your floor covering for a smooth transition.",
          "Dark walls. Navy, forest or charcoal walls with a warm, faded rug is a dramatic, grown-up combination. The rule: keep the rug's background warm (red-based, cream-based) so it glows against the cool wall instead of disappearing into it.",
          "Dining corners. Practical as much as pretty — patterned vintage rugs hide crumbs between cleanings far better than solid colors, and low-pile versions let chairs slide.",
        ],
      },
      { type: "h2", text: "The one-color rule" },
      { type: "p", text: "You don't need to match everything in the rug; that's how rooms get overdone. Instead, pick one secondary tone from the pattern and repeat it two or three times in small doses: cushions, a throw, an art print, a vase. Roughly 20–30% of the room's accent color should echo that tone." },
      {
        type: "table",
        head: ["Rug's dominant field", "Secondary tones to borrow", "Accent pairings that work"],
        rows: [
          ["Red / rust field", "Deep blue, ivory, ochre", "Navy cushions, brass lamps, walnut wood"],
          ["Blue / navy field", "Cream, rust, sage", "Cream sofa covers, terracotta pots, light oak"],
          ["Beige / cream field", "Muted red, teal, olive", "Almost anything — the room's palette stays free"],
          ["Multicolor faded", "Whichever tone appears 2nd-most", "Repeat it in exactly two accessories, stop there"],
        ],
      },
      {
        type: "products",
        products: [
          {
            key: "1688-745181807454-c2",
            category: "Vintage Style · 160 × 230 cm",
            name: "Turkish Persian-Style Vintage Rug — Navy Blue",
            desc: "A blue-field medallion design: pairs naturally with cream seating and warm wood, or glows against dark walls.",
          },
        ],
      },
      { type: "h2", text: "Four combinations that quietly fail" },
      {
        type: "olist",
        items: [
          "Pattern on pattern without scale contrast. A dense vintage rug plus a busy curtain or striped sofa competes rather than layers. If you must mix patterns, change the scale dramatically: big medallion with a small, quiet stripe.",
          "A rug that's too small. In seating areas, a vintage rug floating in the middle of bare floor looks like a placemat. Revisit the front-leg rule before blaming the style.",
          "Fighting it with more color. Three or four accent colors pulled from the rug splits the room's attention. One, maybe two, repeated.",
          "Dark floor, dark rug, nothing between. A navy rug on walnut flooring needs a light layer: cream sofa, pale wall, or the rug vanishes. Contrast is what makes pattern visible.",
        ],
      },
      {
        type: "products",
        products: [
          {
            key: "1688-745181807454-c5",
            category: "Vintage Style · 160 × 230 cm",
            name: "Persian-Style Vintage Medallion Rug — Cream Multicolor",
            desc: "A cream-field design — the most flexible version of the style for rooms that already have a palette.",
          },
        ],
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        faqs: [
          {
            q: "Will a vintage-style rug date the room in a few years?",
            a: "Medallion and botanical motifs have cycled in and out of fashion for over a century without ever leaving, which is what makes them classic rather than trendy. The faded treatment, in particular, reads timeless in both traditional and modern rooms.",
          },
          {
            q: "Do vintage rugs work on dark floors?",
            a: "Yes, with one adjustment: keep something light between floor and the rug's darkest tones, such as a cream sofa leg or a natural fiber runner under the coffee table, or simply choose a cream-field rather than navy-field design. Contrast keeps the pattern legible.",
          },
          {
            q: "What wall colors are safest?",
            a: "Neutrals such as white, off-white, greige and soft grey let the rug lead. If you want color on walls, pull it from the rug's secondary tones and keep it muted; saturated walls compete with a saturated rug.",
          },
          {
            q: "Can I layer or mix two vintage-style rugs?",
            a: "Yes, and it's a signature boho move. The rule: shared palette (both rugs contain the same 2–3 tones) but different pattern scale, such as a dense medallion under a wide-border geometric. Same-scale pairs look accidental.",
          },
        ],
      },
      {
        type: "takeaway",
        text: "Let the rug carry the pattern, borrow one secondary color for the room's accents, and keep everything else calm. A vintage Persian-style rug doesn't need a themed room; it needs a quiet one.",
      },
    ],
    recos: [
      { slug: "rug-size-guide", image: "/images/blog/photo-rug-size-guide.jpg", cat: "Buying Guides", title: "Rug Size Guide: How to Choose the Right Rug for Every Room" },
      { slug: "low-pile-vs-shag", image: "/images/blog/photo-low-pile-vs-shag.jpg", cat: "Rug 101", title: "Low Pile vs. Shag: Pile Height, Explained" },
    ],
    cta: {
      heading: "Ground the room",
      text: "Persian- and Turkish-style vintage rugs in navy, cream and faded multicolor — 160 × 230 cm.",
      label: "Shop Area Rugs",
      href: "/categories/?cat=mats&sub=area-rugs",
    },
  },

  // ==================== 10. Nursery & Bedroom ====================
  {
    slug: "nursery-rugs",
    title: "Nursery & Bedroom Rugs: Softness, Safety and Size",
    category: "Buying Guides",
    date: "September 16, 2026",
    readTime: 6,
    excerpt:
      "What matters more in a bedroom rug: pile, padding or washability? All three, ranked.",
    cardImage: "/images/blog/photo-nursery-rugs.jpg",
    metaDescription:
      "Nursery and bedroom rug guide: safety priorities (non-slip, pile height by age), size charts for bedside and full-surround placement, and material picks that survive real life.",
    lede:
      "Bedroom and nursery rugs get judged by a different standard than living-room rugs: they're stepped on barefoot at 3 a.m., sat on during floor play, and cleaned far more often. Prioritize cleanability, then non-slip safety, then size. Plushness is the reward you earn once the first three are settled.",
    blocks: [
      { type: "p", text: "The decisions, in order." },
      { type: "h2", text: "What's different about these rooms" },
      { type: "p", text: "A living-room rug meets shoes; a bedroom rug meets feet, knees and spilled milk. Three consequences: the surface must be pleasant for skin contact, it must survive frequent spot-cleaning, and it must never slide. Nighttime trips to the door happen half-awake." },
      { type: "p", text: "In nurseries, add a fourth: whatever the baby lies and crawls on ends up in close contact with skin and hands, so fiber type and cleaning routine matter more than pattern." },
      { type: "h2", text: "Safety first, in order" },
      {
        type: "olist",
        items: [
          "Non-slip backing is non-negotiable. On hardwood or tile, every rug in a sleep space needs a grippy underside or a pad. Sliding rugs cause more real injuries than any material concern.",
          "Pile height by age. For infant floor time, short-to-medium pile (under 1.5 cm) is the practical choice — it holds less dust, vacuums genuinely clean, and dries fast after the inevitable spills. Deep shag and faux fur shine in toddler-and-up reading corners instead.",
          "Materials. Synthetic fibers (polyester family) are naturally hypoallergenic and washable — the sensible nursery default. Natural fibers like jute feel rustic but scratch tender knees. If certifications matter to you, look for OEKO-TEX-type labels, which test finished textiles for common harmful substances.",
        ],
      },
      { type: "h2", text: "Size by setup" },
      {
        type: "table",
        head: ["Placement", "Works well", "Notes"],
        rows: [
          ["Bedside strip (each side)", "60 × 90 to 80 × 120 cm", "The 3 a.m. mat — soft landing exactly where feet land"],
          ["Foot of a queen bed", "100 × 160 cm", "Covers the walk-out zone; stays clear of the door swing"],
          ["Full surround, queen", "160 × 200 cm", "Extends past the sides; nightstands can sit on it"],
          ["Full surround, king", "160 × 230 cm or larger", "Wider beds need wider coverage to stay underfoot-safe"],
          ["Nursery center", "100 × 160 to 160 × 200 cm", "Keep it clear of the crib footprint and the dresser-to-door path"],
        ],
      },
      { type: "h2", text: "Material picks by age" },
      { type: "p", text: "Infant rooms: a low-to-medium pile washable rug is the honest answer. It survives the spit-up-and-crumbs cycle, vacuums genuinely clean, and dries fast. Plushness can come from a washable play mat layered on top during tummy-time months." },
      { type: "p", text: "Toddler and up: faux rabbit fur and plush shag earn their place, a soft landing for floor play and a cozy reading corner. Choose a dense, well-tufted construction and commit to the gentle cleaning routine: no beater bars, blot-only spills." },
      { type: "p", text: "Guest bedrooms: anything goes. This is where a plush faux fur rug delivers maximum comfort for minimum traffic wear." },
      {
        type: "products",
        products: [
          {
            key: "1688-595229918569",
            category: "Faux Rabbit Fur · 160 × 200 cm",
            name: "Ultra Soft Faux Rabbit Fur Area Rug — Light Camel",
            desc: "Full bedside coverage in a warm neutral — the toddler-and-up comfort pick for reading corners and cold floors.",
          },
          {
            key: "1688-996768645117-c2",
            category: "Shaggy Oval · 100 × 160 cm",
            name: "Oval Fluffy Tie-Dye Shaggy Rug — Light Grey",
            desc: "An oval bedside silhouette with a low-profile shag — soft underfoot without becoming a tripping hazard.",
          },
        ],
      },
      { type: "h2", text: "The cleaning reality" },
      { type: "p", text: "Whatever you choose will be cleaned more often than any other rug in the house. Build the routine around that: a surface that spot-cleans with cold water and mild soap, a non-slip pad so the rug stays put while you do it, and (for infant rooms) a construction you'd genuinely be willing to replace in two years without grief. Rugs are consumables in a nursery; treat the purchase that way and none of it hurts." },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        faqs: [
          {
            q: "Are faux fur rugs safe in a nursery?",
            a: "For infants, hold off: long fibers hold more dust and are harder to sanitize properly. From toddler age up, a well-tufted faux fur rug in a play corner is fine and much loved. Keep it out of the crib zone either way.",
          },
          {
            q: "What size rug goes beside a queen bed?",
            a: "Two bedside runners (60 × 90 cm each) is the budget-friendly answer; a single 160 × 200 cm rug under the foot half of the bed is the more designed look. Both keep feet off cold floors at the wake-up spot.",
          },
          {
            q: "Round or rectangular for a nursery?",
            a: "Round rugs suit reading nooks and soften boxy rooms, but they cover less area at the same nominal size, and nurseries are about usable floor. Rectangular (100 × 160 or 160 × 200) is the practical default; round is the accent.",
          },
          {
            q: "How do I stop a bedroom rug sliding on hardwood?",
            a: "A full-size non-slip pad under the rug; it's safer and more effective than spray grips or tape, which can mark floors. Check that the pad itself is rated for hardwood finishes (some rubber pads discolor polyurethane over time).",
          },
        ],
      },
      {
        type: "takeaway",
        text: "Cleanability first, non-slip always, size to the real walk paths, and only then buy the plush. A bedroom or nursery rug earns its softness by surviving its job.",
      },
    ],
    recos: [
      { slug: "rug-size-guide", image: "/images/blog/photo-rug-size-guide.jpg", cat: "Buying Guides", title: "Rug Size Guide: How to Choose the Right Rug for Every Room" },
      { slug: "clean-soft-rug", image: "/images/blog/photo-clean-soft-rug.jpg", cat: "Care & Cleaning", title: "How to Clean a Soft Rug (Without Ruining It)" },
    ],
    cta: {
      heading: "Soft landings",
      text: "Plush faux fur and easy-clean rugs in bedside and nursery sizes.",
      label: "Shop Area Rugs",
      href: "/categories/?cat=mats&sub=area-rugs",
    },
  },
];

/** 按 slug 取文章 */
export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/** 全站唯一分类标签（列表页分组/筛选用） */
export const BLOG_CATEGORIES = ["Materials", "Buying Guides", "Rug 101", "Care & Cleaning", "Styling", "Cushions", "Pillows", "Mats"];
