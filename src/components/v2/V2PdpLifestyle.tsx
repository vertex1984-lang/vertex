import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * V2PdpLifestyle —— PDP 种草双图区（2026-10-12 用户定）：新版 PDP 信任条下方、
 * You May Also Like 上方。装饰枕套场景图（scripts/seeany-pdp-lifestyle.js 生成，
 * 规则同 seeany-mood-feed.js 种草规范：暖色调、ins 生活方式杂志感、lived-in、浅景深），
 * 卡面文字沿用首页 MoodCard 两行式（小 caps 名 + 一行描述），底部渐变保证可读。
 * 仅 pillows 类 PDP 渲染（图片内容为枕套场景，跨类目展示不搭）；
 * 两张卡都链 Decorative Pillow Cases 二级类目页（/pillows/pillow-cases/）。
 * 布局：移动端上下堆叠，桌面端双列并排；宽度与 You May Also Like 一致（80%/1520px）。
 */
const CARDS = [
  {
    image: '/images/pdp-lifestyle/pillow-corduroy-nook.webp',
    caption: 'Soft Corduroy',
    desc: 'Warm textures for slow afternoons',
    alt: 'Caramel corduroy throw pillows resting on a cream armchair in a warm reading nook',
  },
  {
    image: '/images/pdp-lifestyle/pillow-cotton-bed.webp',
    caption: 'Washed Cotton',
    desc: 'Quiet mornings in muted sage',
    alt: 'Sage washed-cotton pillow cases on white linen bedding in soft morning light',
  },
];
const HREF = '/pillows/pillow-cases/';

export default function V2PdpLifestyle() {
  return (
    <section className="mt-8 lg:mt-12">
      <div className="mx-auto max-w-[1520px] lg:w-[80%] lg:max-w-none px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        {CARDS.map((card) => (
          <a
            key={card.image}
            href={v2url(HREF)}
            className="group relative block overflow-hidden rounded-xl aspect-[4/3]"
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
