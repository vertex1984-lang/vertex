import Reveal from '@/components/Reveal';
import DragScroll from '@/components/v2/DragScroll';
import V2ProductCard from '@/components/v2/V2ProductCard';
import { v2url } from '@/lib/v2paths';
import type { MakimooProduct } from '@/data/products';

interface V2FeaturedProductsProps {
  products: MakimooProduct[];
}

/**
 * 首页 Best Sellers（2026-09 用户定：由 Featured Products 区改标题而来，数据规则/顺序不变 =
 * getFeaturedProducts 类目配额权重序，共 8 个卡位；View More 指 /best-sellers/）。
 * 桌面端横向轨道（原编辑画报 bento 弃用）：卡宽 min(25vw,440px) 与 Shop by Color 一致，
 * 一屏 4 张 + 右缘露出第 5 张一角 + 渐隐遮罩，明示后面还有；移动端同为横轨（56vw）。
 * 标题与 Shop by Color 同对齐（全宽 px-6 lg:px-10，无版心限制）+ 小字副标题（2026-09 用户定）。
 * 全端共用一条 DragScroll 轨道（触摸滑动 + 鼠标拖拽，无箭头）。
 */
export default function V2FeaturedProducts({ products }: V2FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="pt-8 lg:pt-12 pb-16 lg:pb-24">
      {/* 标题行：标题 + 小字副标题（与 Shop by Color 同对齐：全宽 px-6 lg:px-10） */}
      <Reveal>
        <div className="px-6 lg:px-10 mb-8 lg:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal">
            Best Sellers
          </h2>
          <p className="mt-3 text-sm lg:text-base text-charcoal-light max-w-xl">
            Our most popular pieces — tried, loved, and ready for your home.
          </p>
        </div>
      </Reveal>

      {/* 横轨：外层 pl 制造左缘缝隙（padding 放滚动容器上会被 scroll-snap 吃掉），
          右缘渐隐遮罩 + 第 5 张露角提示可继续滑 */}
      <Reveal>
        <div className="relative">
          <div className="pl-6 lg:pl-10">
            <DragScroll className="flex gap-5 lg:gap-6 overflow-x-auto pb-2 pr-6 lg:pr-10 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {products.slice(0, 8).map((product) => (
                <div
                  key={product.id}
                  className="w-[56vw] sm:w-[42vw] lg:w-[min(25vw,440px)] flex-shrink-0 snap-start"
                >
                  <V2ProductCard product={product} />
                </div>
              ))}
            </DragScroll>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-16 lg:w-24 bg-gradient-to-l from-off-white via-off-white/70 to-transparent"
          />
        </div>
      </Reveal>

      {/* 产品卡下方居中 VIEW MORE 描边按钮（与 Shop by Category 按钮同款） */}
      <Reveal delay={200}>
        <div className="mt-10 lg:mt-12 text-center">
          <a
            href={v2url('/best-sellers/')}
            className="inline-block px-7 py-3 rounded-full border-2 border-brand text-brand text-xs lg:px-9 lg:py-3.5 lg:text-sm font-semibold tracking-wide uppercase transition hover:bg-brand hover:text-cream"
          >
            View More
          </a>
        </div>
      </Reveal>
    </section>
  );
}
