import { resolveUrl } from '@/lib/paths';

/**
 * V2PdpLifestyle —— PDP 种草双图区（2026-10-12 用户定）：新版 PDP 信任条下方、
 * You May Also Like 上方。图片为现成素材（微信导入），卡面文字只写场景意境，不提产品。
 * 仅 pillows / cushions 类 PDP 渲染（按类目出对应场景图，跨类目展示不搭）。
 * 纯展示，无点击跳转（2026-10-12 用户定：去掉所有链接）。
 * 布局：移动端全出血上下堆叠（打满屏宽，用户定）；桌面端并排，直角无圆角。
 *  - pillows（2026-10-12 用户定）：Sunday Morning 竖图在左（5/12），
 *    Rainy Day 横图在右（7/12，裁为 4:3），顶端对齐，竖图略高
 *  - cushions：两张竖图各半（3:4 × 2）
 *  - cushions/solids 系列：两张竖图各半（3:4 × 2），门廊绿垫 + 海滨藏青垫场景
 */
interface LifestyleCard {
  image: string;
  caption: string;
  desc: string;
  alt: string;
  className: string;
}

const SETS: Record<'pillows' | 'cushions' | 'solids', { gridClass: string; cards: LifestyleCard[] }> = {
  pillows: {
    gridClass: 'lg:grid-cols-12 lg:items-start',
    cards: [
      {
        image: '/images/pdp-lifestyle/pillow-lifestyle-tall.webp',
        caption: 'Sunday Morning',
        desc: 'Sunlight through sheer curtains',
        alt: 'Sunlit bedroom with soft pillows on white bedding in morning light',
        className: 'aspect-[3/4] lg:col-span-5',
      },
      {
        image: '/images/pdp-lifestyle/pillow-lifestyle-wide.webp',
        caption: 'Rainy Day In',
        desc: 'A warm lamp, a good book, nowhere to be',
        alt: 'Cozy reading nook with textured throw pillows, warm lamplight and rain on the window',
        className: 'aspect-[3/2] lg:aspect-[4/3] lg:col-span-7',
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
};

export default function V2PdpLifestyle({ cat = 'pillows' }: { cat?: 'pillows' | 'cushions' | 'solids' }) {
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
