import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * V2PdpLifestyle —— PDP 种草双图区（2026-10-12 用户定 v2）：新版 PDP 信任条下方、
 * You May Also Like 上方。横图（雨天阅读角，近景特写多色抱枕）+ 竖图（晨光卧室远景），
 * 图片为现成素材（微信导入，横图已裁 3:2）；卡面文字只写场景意境，不提产品。
 * 仅 pillows 类 PDP 渲染（图片内容为抱枕场景，跨类目展示不搭）；
 * 两张卡都链 Decorative Pillow Cases 二级类目页（/pillows/pillow-cases/）。
 * 布局：移动端全出血上下堆叠（打满屏宽，用户定）；桌面端横图 2/3 + 竖图 1/3 并排同高
 * （3:2 横图跨两列 + 3:4 竖图一列，高度数学上相等）。卡片直角无圆角（2026-10-12 用户定）。
 */
const CARDS = [
  {
    image: '/images/pdp-lifestyle/pillow-lifestyle-wide.webp',
    caption: 'Rainy Day In',
    desc: 'A warm lamp, a good book, nowhere to be',
    alt: 'Cozy reading nook with textured throw pillows, warm lamplight and rain on the window',
    className: 'aspect-[3/2] lg:col-span-2',
  },
  {
    image: '/images/pdp-lifestyle/pillow-lifestyle-tall.webp',
    caption: 'Sunday Morning',
    desc: 'Sunlight through sheer curtains',
    alt: 'Sunlit bedroom with soft pillows on white bedding in morning light',
    className: 'aspect-[3/4]',
  },
];
const HREF = '/pillows/pillow-cases/';

export default function V2PdpLifestyle() {
  return (
    <section className="mt-8 lg:mt-12">
      <div className="mx-auto max-w-[1520px] lg:w-[80%] lg:max-w-none grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-5 lg:px-10">
        {CARDS.map((card) => (
          <a
            key={card.image}
            href={v2url(HREF)}
            className={`group relative block overflow-hidden ${card.className}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveUrl(card.image)}
              alt={card.alt}
              loading="lazy"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
          </a>
        ))}
      </div>
    </section>
  );
}
