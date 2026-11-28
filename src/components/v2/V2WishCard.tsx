import { MakimooProduct } from '@/data/products';
import { WishItem } from '@/data/next-drops';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * V2WishCard —— 心愿解锁卡（2026-11-27，/drop-home 心愿区与 /next-drops 专区页共用）。
 * Concept 徽章 + 心愿进度条（与预售 claimed 同一视觉语言）+ Want it（演示版整卡进 PDP）。
 */
export default function V2WishCard({ wish, product }: { wish: WishItem; product: MakimooProduct }) {
  const imageUrl = product.featuredImage ?? product.images[0]?.url;
  const pct = Math.min(100, (wish.wanted / wish.goal) * 100);
  return (
    <a href={v2url(`/products/${product.handle}/`)} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-warm-gray">
        {imageUrl && (
          <img
            src={resolveUrl(imageUrl)}
            alt={product.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        {/* 状态徽章：三态语言之 Concept（心愿累积中） */}
        <span className="absolute left-2 top-2 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cream/85 text-charcoal backdrop-blur-sm">
          Concept
        </span>
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-charcoal/75 via-charcoal/35 to-transparent px-3.5 pb-3 pt-10">
          <h3 className="text-sm font-semibold text-cream leading-snug">
            {wish.fabric} {wish.name}
          </h3>
          <div className="mt-1.5">
            <div className="h-[3px] w-full rounded-full bg-cream/25 overflow-hidden">
              <div className="h-full rounded-full bg-cream transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1 text-[11px] font-medium text-cream/85">
              {wish.wanted} of {wish.goal} wanted · unlocks the batch
            </p>
          </div>
          {/* Want it（演示版：整卡进 PDP；正式版接心愿/邮箱收集） */}
          <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-cream px-4 py-1.5 text-[11px] font-bold text-charcoal transition-colors group-hover:bg-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            Want it
          </span>
        </div>
      </div>
    </a>
  );
}
