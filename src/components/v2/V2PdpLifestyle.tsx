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
 */
interface LifestyleCard {
  image: string;
  caption: string;
  desc: string;
  alt: string;
  className: string;
}

const SETS: Record<'pillows' | 'cushions' | 'solids' | 'prints', { gridClass: string; cards: LifestyleCard[] }> = {
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

export default function V2PdpLifestyle({ cat = 'pillows' }: { cat?: 'pillows' | 'cushions' | 'solids' | 'prints' }) {
  const set = SETS[cat];
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
