import Reveal from '@/components/Reveal';
import DragScroll from '@/components/v2/DragScroll';
import V2ProductCard from '@/components/v2/V2ProductCard';
import { v2url } from '@/lib/v2paths';
import type { MakimooProduct } from '@/data/products';

interface V2FeaturedProductsProps {
  products: MakimooProduct[];
}

const stripCls =
  'flex gap-5 lg:gap-6 overflow-x-auto pb-2 pr-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

/**
 * 左标题 + 右横滑产品条（2026-09-22 用户定：与 bedding 页 New Arrivals 同款版式，
 * 替代原桌面 5:12 bento 画报网格）——左列 eyebrow + 标题 + View More 描边按钮（→ /best-sellers/），
 * 右侧 8 张 V2ProductCard 单行横滑（DragScroll）；移动端标题块在上、产品条在下。
 * 文案 2026-09-22 用户定：eyebrow "Most Loved" + 标题 "Best Sellers"（原 "Editor's Picks / Featured Products"）；
 * 注意数据源仍是 Featured 配额制选品，仅展示文案为 Best Sellers。
 * 产品卡尺寸/间距与主页 Shop by Scene、You May Also Like 一致（lg:w-[min(25vw,440px)]、gap-5 lg:gap-6）。
 * 数据由页面传入（getFeaturedProducts 类目配额制，共 8 个）。
 */
export default function V2FeaturedProducts({ products }: V2FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="pt-8 lg:pt-12 pb-16 lg:pb-24">
      <Reveal>
        <div className="lg:flex lg:items-stretch">
          {/* 左列：eyebrow + 标题 + View More（副标题按用户要求不加，2026-09） */}
          <div className="px-6 lg:pl-10 lg:pr-6 mb-8 lg:mb-0 lg:w-[480px] lg:flex-shrink-0 lg:flex lg:flex-col">
            <div className="lg:max-w-[340px]">
              <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
                Most Loved
              </p>
              <h2 className="text-2xl lg:text-5xl font-extrabold tracking-tight text-charcoal leading-tight mb-8">
                Best Sellers
              </h2>
              <div>
                <a
                  href={v2url('/best-sellers/')}
                  className="inline-block px-7 py-3 rounded-full border-2 border-brand text-brand text-xs lg:text-sm font-semibold tracking-wide uppercase transition hover:bg-brand hover:text-cream"
                >
                  View More
                </a>
              </div>
            </div>
          </div>
          {/* 右侧：8 张产品卡单行横滑（触摸滑动 + 鼠标拖拽，无箭头） */}
          <div className="flex-1 min-w-0 pl-6 lg:pl-4">
            <DragScroll className={stripCls}>
              {products.slice(0, 8).map((product) => (
                <div key={product.id} className="w-[56vw] sm:w-[42vw] lg:w-[min(25vw,440px)] flex-shrink-0">
                  <V2ProductCard product={product} />
                </div>
              ))}
            </DragScroll>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
