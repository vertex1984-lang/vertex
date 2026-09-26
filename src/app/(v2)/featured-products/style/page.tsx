import type { Metadata } from 'next';
import V2StyleCard from '@/components/v2/V2StyleCard';
import { v2url } from '@/lib/v2paths';
import { styleCards } from '@/data/style-tagged';

export const metadata: Metadata = {
  // 注意：本站 generateMetadata/metadata 的 title 不吃根 layout 的 "%s | Makimoo" 模板，后缀需手写
  title: 'Shop by Style | Makimoo',
  description:
    'Browse Makimoo pieces by interior style — Farmhouse, Rattan & Woven, Persian & Vintage, Bohemian, Modern, African & Tribal and Hotel.',
};

/** Styles 汇总页：/featured-products/style/ — 全部有在售产品的风格入口卡网格。
 *  新增风格（STYLE_RULES 扩充且有产品）自动出现在此页；首页 Bento 的 Discover More 指向这里。 */
export default function StylesIndexPage() {
  const cards = styleCards();

  return (
    <div className="px-3 lg:px-10 pt-24 lg:pt-36 pb-10 lg:pb-14">
      {/* 页头（同 /products 类目页）：面包屑 + 左对齐标题 + 右侧风格数 */}
      <nav className="text-xs lg:text-sm text-[#999] mb-2 lg:mb-3" aria-label="Breadcrumb">
        <a href={v2url('/')} className="hover:text-[#8B5A2B] transition-colors">Home</a>
        <span className="mx-1.5">/</span>
        <span className="text-[#555]">Shop by Style</span>
      </nav>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6 lg:mb-10">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-[#333]">Shop by Style</h1>
        <p className="text-sm text-[#777]">{cards.length} style{cards.length === 1 ? '' : 's'}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-5">
        {cards.map((card) => (
          <V2StyleCard key={card.key} card={card} />
        ))}
      </div>
    </div>
  );
}
