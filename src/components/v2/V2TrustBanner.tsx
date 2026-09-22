import Reveal from '@/components/Reveal';
import { resolveUrl } from '@/lib/paths';

/**
 * 首页信任区（2026-09-22 用户定：替代原 Review 轮播 V2ReviewCarousel，组件保留未删）——
 * 左右双卡、中间留缝（用户定：不用拼接整图，直接空隙隔开），桌面 3:2 左宽右窄：
 * 左卡（宽）= 卧室场景图（trust-reviews.webp）+ 品牌信任文案（eyebrow "Makimoo" + 主标题手动两行 + 年销 50 万件副文案，
 * 全部白字 + 左侧暗渐变）；右卡（窄）= 水洗棉面料图（fabric-washed-cotton-like.webp）+ 三条短评价（占位文案，待真实评价数据接入）。
 * 移动端左卡 8/9（2026-09-23 用户定：原 4/5 高度减 10%）、右卡（评价卡）4/3 稍矮（2026-09-22 用户定，图由 object-cover 裁切）。
 * 图片沿革（2026-09-22~23 用户定）：左卡 卧室图 trust-reviews.webp（seeany-trust-banner.js 21:9 裁切）→ seeany 材质特写
 *   trust-texture.webp（seeany-trust-texture.js）→ 水洗棉面料图 → 恢复卧室图 trust-reviews.webp（2026-09-23）；
 *   右卡 seeany 客厅图 trust-living.webp → 水洗棉面料图 → 亚麻产品细节图（LINEN3-OATMEAL-QUEEN/3.webp）→ 回滚为水洗棉面料图（2026-09-23）。
 *   被替换的生成图文件保留未删（trust-texture / trust-living 已无引用）。
 */

// 占位短评价（2026-09-22 用户定：先编几条，字少；待真实评价接入后替换）
const REVIEWS = [
  { quote: 'Soft, sturdy, and beautifully made.', author: 'Emily R.' },
  { quote: 'Five stars — these sell out fast for a reason.', author: 'Daniel K.' },
  { quote: 'Arrived fast and looks exactly like the photos.', author: 'Sofia L.' },
];

export default function V2TrustBanner() {
  return (
    <section className="px-3 lg:px-10 pt-8 lg:pt-0 pb-16 lg:pb-24">
      <Reveal>
        {/* 桌面 3:2 左宽右窄，文案卡固定在左、评价卡在右（2026-09-22 用户定）；
            行高由左侧文案卡 16/9 定，右侧评价卡拉伸对齐 */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-3 lg:gap-5">
          {/* 左卡（宽）：卧室场景图（最初的 trust-reviews.webp，2026-09-23 用户定恢复）+ 品牌信任文案（白字 + 左侧暗渐变）；主标题 <br> 手动控两行（用户定：不要三行）；
              桌面 16/9 定行高，手机端 8/9（2026-09-23 用户定：在原 4/5 基础上高度减少 10%） */}
          <div className="relative overflow-hidden rounded-xl aspect-[8/9] sm:aspect-[4/3] lg:aspect-[16/9]">
            <img
              src={resolveUrl('/images/brand/trust-reviews.webp')}
              alt="Makimoo customer bedroom"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-5 lg:px-12 max-w-md">
                <p className="text-[10px] lg:text-xs font-semibold tracking-[0.25em] uppercase text-cream/90">
                  Makimoo
                </p>
                <h2 className="mt-2 text-xl sm:text-2xl lg:text-4xl font-extrabold tracking-tight text-cream leading-tight">
                  A Trusted Name on Major<br />Retail Platforms
                </h2>
                <p className="mt-3 text-xs sm:text-sm lg:text-base text-cream/85 leading-relaxed">
                  Over half a million products sold every year — and counting.
                </p>
              </div>
            </div>
          </div>

          {/* 右卡（窄）：水洗棉面料图 + 短评价（底部暗渐变压白字）；手机端 4/3 横一些（2026-09-22 用户定：高度降低，图由 object-cover 裁切） */}
          <div className="relative overflow-hidden rounded-xl aspect-[4/3] lg:aspect-auto">
            <img
              src={resolveUrl('/images/fabric-guide/fabric-washed-cotton-like.webp')}
              alt="Makimoo washed cotton fabric"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-8 space-y-3 lg:space-y-4">
              {REVIEWS.map((r) => (
                <div key={r.author}>
                  <p className="text-xs tracking-[0.15em] text-[#E8B04B]">★★★★★</p>
                  <p className="mt-0.5 text-sm lg:text-base font-semibold text-cream leading-snug">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                  <p className="text-xs text-cream/70">— {r.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
