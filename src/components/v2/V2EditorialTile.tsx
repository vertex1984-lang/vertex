import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import type { EditorialTile } from '@/data/editorial-tiles';

/**
 * PLP 网格种草图位（2026-11-01 新增；同日两次调整）：
 * - 占两个产品卡宽度（col-span-2）；桌面端 3:2 横图，移动端打满屏宽 1:1 方图（双 img 按断点切换）
 * - 整卡点击跳对应产品 PDP；图下信息区 = 场景短句，
 *   图上左下角叠 "Shop this look ›" 胶囊（保底可识别为可点内容）
 * - 版式对齐 GroupProductCard：同 bg-warm-gray 占位、同 hover 放大、同信息区内边距，
 *   让它融入网格节奏但一眼能读出是内容位而非商品卡
 */
export default function V2EditorialTile({ tile }: { tile: EditorialTile }) {
  return (
    <a href={v2url(`/products/${tile.handle}/`)} className="group col-span-2 block overflow-hidden">
      <div className="relative aspect-square lg:aspect-[3/2] overflow-hidden bg-warm-gray">
        <img
          src={resolveUrl(tile.mobileImage)}
          alt={tile.alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 lg:hidden"
        />
        <img
          src={resolveUrl(tile.image)}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 hidden lg:block"
        />
        <div className="absolute bottom-2.5 left-2.5">
          <span className="px-2.5 py-1 rounded-full bg-cream/90 text-charcoal text-[10px] font-semibold tracking-wide">
            Shop this look ›
          </span>
        </div>
      </div>
      <div className="p-3 lg:p-4">
        <h3 className="text-[11px] lg:text-xs font-semibold text-charcoal leading-snug line-clamp-2">
          {tile.caption}
        </h3>
        <p className="mt-1 text-[10px] lg:text-[11px] text-[#999]">Styled by Makimoo</p>
      </div>
    </a>
  );
}
