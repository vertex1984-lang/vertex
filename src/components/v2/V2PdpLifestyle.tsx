import { resolveUrl } from '@/lib/paths';

/**
 * V2PdpLifestyle —— PDP 种草双图区（2026-10-12 用户定）：新版 PDP 信任条下方、
 * You May Also Like 上方。图片为现成素材（微信导入），卡面文字只写场景意境，不提产品。
 * 仅 pillows / cushions 类 PDP 渲染（按类目出对应场景图，跨类目展示不搭）。
 * 纯展示，无点击跳转（2026-10-12 用户定：去掉所有链接）。
 * 布局：移动端全出血上下堆叠（打满屏宽，用户定）；桌面端并排，直角无圆角。
 *  - pillows（2026-10-12 用户定）：Rainy Day 横图在左（7/12，裁为 4:3），
 *    Sunday Morning 竖图在右（5/12），顶端对齐，两图高度基本齐平
 *  - cushions：两张竖图各半（3:4 × 2）
 *  - cushions/solids 系列：两张竖图各半（3:4 × 2），门廊绿垫 + 海滨藏青垫场景
 *  - cushions/prints（Floral & Prints，2026-10-12 用户供图替换原通用 café/花店图）：
 *    天台黄昏几何垫 + 海滨蓝绿植物垫场景
 *  - pillows/boucle 系列（2026-10-13 用户定，AI 生成混色场景，Pinterest 级）：
 *    两张 2:3 竖图各半——奶白+鼠尾草绿客厅 / 燕麦+灰粉卧室，移动端裁 3:4
 *  - travel 颈枕（2026-10-14 用户供图）：居家沙发阅读 + 游轮甲板旅行场景，两张 3:4 各半
 *  - bedding/linenlike（2026-10-14/15）：紫粉碎花蕾丝 farmhouse（AI 生成种草图，替换原摩洛哥供图）
 *    + 乡村木屋淡紫印花（用户供图）卧室场景，两张 3:4 各半；仅材质为 Linen-Like 的 bedding PDP 渲染
 *  - bedding/brushedcotton（2026-10-15 AI 生成种草图，用户定）：米色磨毛棉清晨现代卧室
 *    （DUVSET-BEIGE-QUEEN 锚定）+ 灰色磨毛棉傍晚现代卧室（DUVSET-GRAY-QUEEN 锚定），
 *    两张 3:4 各半；仅材质为 Washed Cotton-Like（展示名 Brushed Cotton）的 bedding PDP 渲染
 *  - bedding/linen（2026-10-15）：farmhouse 燕麦亚麻（AI 生成种草图）+ 城市夜景炭灰亚麻
 *    （用户供图，方形裁 3:4）；仅材质为 100% Linen 的 bedding PDP 渲染
 *  - bedding/satin（2026-10-15 用户供图）：法式轻奢香槟灰双色缎面 + 明亮现代香槟缎面
 *    卧室场景，两张 3:4 各半；仅材质为 Satin 的 bedding PDP 渲染
 */
interface LifestyleCard {
  image: string;
  caption: string;
  desc: string;
  alt: string;
  className: string;
}

/** towels（mk-towel-lsc 长绒棉毛巾，2026-10-16 AI 生成种草图，用户定）：
 *  挂杆场景按 PDP 当前颜色出对应图（6 色各一张 1:1），单卡布局——移动端全出血方形，
 *  桌面端限宽居中保持 1:1 构图（挂钩在画面顶部，宽幅裁剪会切掉，故不做横向裁切） */
const TOWEL_HOOKS: Record<string, { caption: string; desc: string; alt: string }> = {
  cream: { caption: 'Slow Mornings', desc: 'Sunlight, steam, and soft terry', alt: 'Cream long-staple cotton towels hanging on wooden wall hooks in a sunlit modern bathroom' },
  oatmeal: { caption: 'Golden Hour', desc: 'Warm light on quiet walls', alt: 'Oatmeal long-staple cotton towels hanging on wooden wall hooks in a sunlit modern bathroom' },
  sage: { caption: 'Fresh Start', desc: 'Sunlit terry on wooden hooks', alt: 'Sage green long-staple cotton towels hanging on wooden wall hooks in a sunlit modern bathroom' },
  dustyrose: { caption: 'Soft Hours', desc: 'A warm bath, nowhere to be', alt: 'Dusty rose long-staple cotton towels hanging on wooden wall hooks in a sunlit modern bathroom' },
  lightgrey: { caption: 'Calm & Clear', desc: 'Morning light, nothing to rush', alt: 'Light grey long-staple cotton towels hanging on wooden wall hooks in a sunlit modern bathroom' },
  dustyblue: { caption: 'Blue Hour', desc: 'Cool air and warm water', alt: 'Dusty blue long-staple cotton towels hanging on wooden wall hooks in a sunlit modern bathroom' },
};

const SETS: Record<'pillows' | 'cushions' | 'solids' | 'prints' | 'boucle' | 'neck' | 'linenlike' | 'brushedcotton' | 'linen' | 'satin', { gridClass: string; cards: LifestyleCard[] }> = {
  satin: {
    gridClass: 'lg:grid-cols-2',
    cards: [
      {
        image: '/images/pdp-lifestyle/bedding-satin-french.webp',
        caption: 'Parisian Chic',
        desc: 'Satin sheen and gilded light',
        alt: 'Champagne and grey two-tone satin bedding on an ornate French-style bed in an elegant bedroom',
        className: 'aspect-[3/4]',
      },
      {
        image: '/images/pdp-lifestyle/bedding-satin-champagne.webp',
        caption: 'Soft Glow',
        desc: 'Morning light on champagne satin',
        alt: 'Champagne satin bedding on an upholstered bed in a bright modern bedroom with morning sunlight',
        className: 'aspect-[3/4]',
      },
    ],
  },
  linen: {
    gridClass: 'lg:grid-cols-2',
    cards: [
      {
        image: '/images/pdp-lifestyle/bedding-linen-farmhouse.webp',
        caption: 'Farmhouse Mornings',
        desc: 'Coffee steam and wrinkled linen',
        alt: 'Oatmeal 100% linen bedding with natural wrinkles on a distressed white wooden bed in a farmhouse bedroom',
        className: 'aspect-[3/4]',
      },
      {
        image: '/images/pdp-lifestyle/bedding-linen-city.webp',
        caption: 'City Dusk',
        desc: 'Skyline views and charcoal linen',
        alt: 'Charcoal linen bedding on a wooden bed in a modern apartment bedroom with city skyline view at dusk',
        className: 'aspect-[3/4]',
      },
    ],
  },
  brushedcotton: {
    gridClass: 'lg:grid-cols-2',
    cards: [
      {
        image: '/images/pdp-lifestyle/bedding-brushed-gray.webp',
        caption: 'Evening In',
        desc: 'Warm lamps and city lights',
        alt: 'Soft gray brushed cotton duvet cover set on a dark walnut bed in a modern bedroom at dusk',
        className: 'aspect-[3/4]',
      },
      {
        image: '/images/pdp-lifestyle/bedding-brushed-beige.webp',
        caption: 'Slow Mornings',
        desc: 'Sunlight, coffee, and nowhere to rush',
        alt: 'Warm beige brushed cotton duvet cover set on a grey upholstered bed in a modern sunlit bedroom',
        className: 'aspect-[3/4]',
      },
    ],
  },
  linenlike: {
    gridClass: 'lg:grid-cols-2',
    cards: [
      {
        image: '/images/pdp-lifestyle/bedding-linenlike-farmhouse.webp',
        caption: 'Shabby Chic',
        desc: 'Lace trim and wildflower mornings',
        alt: 'Purple pink floral print bedding with white lace trim on a white iron bed in a farmhouse bedroom',
        className: 'aspect-[3/4]',
      },
      {
        image: '/images/pdp-lifestyle/bedding-linenlike-cottage.webp',
        caption: 'Country Air',
        desc: 'A quiet room in the countryside',
        alt: 'Lavender floral print bedding in a rustic wood cabin bedroom',
        className: 'aspect-[3/4]',
      },
    ],
  },
  neck: {
    gridClass: 'lg:grid-cols-2',
    cards: [
      {
        image: '/images/pdp-lifestyle/neck-home.webp',
        caption: 'Stay In',
        desc: 'Neck-deep in a good book',
        alt: 'Woman wearing a memory foam neck pillow while reading on a sofa at home',
        className: 'aspect-[3/4]',
      },
      {
        image: '/images/pdp-lifestyle/neck-travel.webp',
        caption: 'Away We Go',
        desc: 'Sea breeze and window seats',
        alt: 'Cream neck pillow on a wooden deck lounger of a cruise ship at sunset',
        className: 'aspect-[3/4]',
      },
    ],
  },
  boucle: {
    gridClass: 'lg:grid-cols-2',
    cards: [
      {
        image: '/images/pdp-lifestyle/pillow-boucle-wide.webp',
        caption: 'Golden Hour',
        desc: 'Vinyl, dusk light, and a worn-in chair',
        alt: 'Dusty rose boucle pillow on a brown leather armchair beside a record player at dusk',
        className: 'aspect-[3/4] lg:aspect-[2/3]',
      },
      {
        image: '/images/pdp-lifestyle/pillow-boucle-bench.webp',
        caption: 'Come On In',
        desc: 'A soft landing, right at the door',
        alt: 'White boucle pillow on a dark wooden entryway bench in soft daylight',
        className: 'aspect-[3/4] lg:aspect-[2/3]',
      },
    ],
  },
  pillows: {
    gridClass: 'lg:grid-cols-12 lg:items-start',
    cards: [
      {
        image: '/images/pdp-lifestyle/pillow-lifestyle-wide.webp',
        caption: 'Rainy Day In',
        desc: 'A warm lamp, a good book, nowhere to be',
        alt: 'Cozy reading nook with textured throw pillows, warm lamplight and rain on the window',
        className: 'aspect-[3/2] lg:aspect-[4/3] lg:col-span-7',
      },
      {
        image: '/images/pdp-lifestyle/pillow-lifestyle-tall.webp',
        caption: 'Sunday Morning',
        desc: 'Sunlight through sheer curtains',
        alt: 'Sunlit bedroom with soft pillows on white bedding in morning light',
        className: 'aspect-[3/4] lg:col-span-5',
      },
    ],
  },
  cushions: {
    gridClass: 'lg:grid-cols-2',
    cards: [
      {
        image: '/images/pdp-lifestyle/cushion-lifestyle-cafe.webp',
        caption: 'Café Hours',
        desc: 'Sunlit seats and slow sips',
        alt: 'Tufted caramel chair cushion on a bentwood chair in a sunlit café corner',
        className: 'aspect-[3/4]',
      },
      {
        image: '/images/pdp-lifestyle/cushion-lifestyle-florist.webp',
        caption: 'Morning Blooms',
        desc: 'Fresh flowers, quiet streets',
        alt: 'Cream tufted chair cushion on a wooden chair inside a flower shop',
        className: 'aspect-[3/4]',
      },
    ],
  },
  solids: {
    gridClass: 'lg:grid-cols-2',
    cards: [
      {
        image: '/images/pdp-lifestyle/cushion-solids-porch.webp',
        caption: 'Porch Season',
        desc: 'Sweet tea and slow evenings',
        alt: 'Deep green tufted cushion on a wicker chair on a lush shaded porch at dusk',
        className: 'aspect-[3/4]',
      },
      {
        image: '/images/pdp-lifestyle/cushion-solids-coastal.webp',
        caption: 'Harbor Mornings',
        desc: 'Sea air at the breakfast table',
        alt: 'Navy blue tufted chair cushion on a wooden chair in a bright coastal breakfast nook',
        className: 'aspect-[3/4]',
      },
    ],
  },
  prints: {
    gridClass: 'lg:grid-cols-2',
    cards: [
      {
        image: '/images/pdp-lifestyle/cushion-prints-rooftop.webp',
        caption: 'Rooftop Dusk',
        desc: 'City lights, front-row seats',
        alt: 'Colorful geometric patio chair cushion on a rooftop terrace with string lights and city skyline at dusk',
        className: 'aspect-[3/4]',
      },
      {
        image: '/images/pdp-lifestyle/cushion-prints-coastal.webp',
        caption: 'Ocean Air',
        desc: 'Salt breeze and slow mornings',
        alt: 'Blue-green leaf print chair cushion on a rattan chair on a sunny ocean-view balcony',
        className: 'aspect-[3/4]',
      },
    ],
  },
};

export default function V2PdpLifestyle({ cat = 'pillows', towelColor }: { cat?: 'pillows' | 'cushions' | 'solids' | 'prints' | 'boucle' | 'neck' | 'linenlike' | 'brushedcotton' | 'linen' | 'satin' | 'towels'; towelColor?: string }) {
  // towels：按当前 PDP 颜色动态出单卡（缺色兜底 sage）
  if (cat === 'towels') {
    const t = TOWEL_HOOKS[towelColor || 'sage'] || TOWEL_HOOKS.sage;
    const card: LifestyleCard = {
      image: `/images/pdp-lifestyle/towel-hooks-${towelColor || 'sage'}.webp`,
      caption: t.caption,
      desc: t.desc,
      alt: t.alt,
      className: 'aspect-square lg:w-[55%] lg:mx-auto',
    };
    return (
      <section className="mt-8 lg:mt-12">
        <div className="mx-auto max-w-[1520px] lg:w-[80%] lg:max-w-none grid grid-cols-1 gap-2 lg:gap-5 lg:px-10">
          <div className={`relative overflow-hidden ${card.className}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveUrl(card.image)}
              alt={card.alt}
              loading="lazy"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 lg:bottom-5 lg:left-6">
              <p className="text-cream text-xs lg:text-sm font-semibold tracking-[0.2em] uppercase">
                {card.caption}
              </p>
              <p className="mt-0.5 text-cream/80 text-[11px] lg:text-xs tracking-wide">
                {card.desc}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  const set = SETS[cat as keyof typeof SETS];
  return (
    <section className="mt-8 lg:mt-12">
      <div className={`mx-auto max-w-[1520px] lg:w-[80%] lg:max-w-none grid grid-cols-1 ${set.gridClass} gap-2 lg:gap-5 lg:px-10`}>
        {set.cards.map((card) => (
          <div
            key={card.image}
            className={`relative overflow-hidden ${card.className}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveUrl(card.image)}
              alt={card.alt}
              loading="lazy"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 lg:bottom-5 lg:left-6">
              <p className="text-cream text-xs lg:text-sm font-semibold tracking-[0.2em] uppercase">
                {card.caption}
              </p>
              <p className="mt-0.5 text-cream/80 text-[11px] lg:text-xs tracking-wide">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
