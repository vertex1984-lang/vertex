/**
 * Shop by Style：画报错落网格（Bento Mosaic）——2026-09 三稿对比后定稿方案。
 * 产品数最多的风格占 2×2 大图主卡，其余风格小卡填满；
 * 桌面端 5 列静态网格（2026-09-22 重排：主卡 2×2 + 6 张小卡 3×2 两行排完，
 * 全部风格卡一屏展示；原 4 列 3 行方案一屏只能露出 5 张），
 * 移动端 2 列平铺、主卡通栏（保持不变）。点击进 /featured-products/style/{key}/ 聚合页。
 * 底部右对齐 "Discover More →" 文字链接（非按钮）进 /featured-products/style/ 汇总页——
 * 后续新增风格主页排不下时，全部风格在汇总页可见。
 * 卡片文字（用户定）：风格名偏小字号 + 件数，无 CTA 箭头。
 */
import Reveal from '@/components/Reveal';
import V2StyleCard from '@/components/v2/V2StyleCard';
import { v2url } from '@/lib/v2paths';
import { styleCards } from '@/data/style-tagged';

export default function V2ShopByStyleBento() {
  const cards = styleCards();
  if (cards.length === 0) return null;

  // 主卡 = 产品数最多的风格，其余保持 STYLE_RULES 顺序
  const hero = cards.reduce((a, b) => (b.count > a.count ? b : a));
  const rest = cards.filter((c) => c.key !== hero.key);

  return (
    <section className="bg-off-white pt-8 lg:pt-12 pb-10 lg:pb-24">
      <Reveal>
        {/* 桌面端收窄为 95% 宽居中：卡片宽高缩小约 5%，两侧离屏幕边空隙增大（2026-09-22 用户定） */}
        <div className="px-3 lg:px-10 lg:w-[95%] lg:mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2">Find Your Look</p>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal mb-8 lg:mb-10">
            Shop by Style
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-5">
            <V2StyleCard card={hero} big />
            {rest.map((card) => (
              <V2StyleCard key={card.key} card={card} />
            ))}
          </div>
          {/* 全部风格入口：文字链接（非按钮），靠右 */}
          <div className="mt-6 lg:mt-8 text-right">
            <a
              href={v2url('/featured-products/style/')}
              className="text-sm font-semibold text-brand hover:underline underline-offset-4"
            >
              Discover More →
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
