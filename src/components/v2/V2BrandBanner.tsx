import Reveal from '@/components/Reveal';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * V2 首页全宽 Brand Banner（纯图版）
 * 桌面：brand-banner.webp（1456×574 生活场景图）按 1456/444（约 3.3:1）锁定比例全宽展示，
 *        object-cover 从上下裁切（object-position 保持 center，沙发主体完整露出）；
 *        极宽屏高度超 85vh 时进一步从上下裁切；
 * 移动：brand-banner-mobile.webp（900×1200，正好 3:4）aspect-[3/4] 无裁切。
 * 图片本身不含文字；叠加文案暂不使用（后续需要时在两个 <a> 内补叠加层）。
 * 整图可点击跳转全部产品。两张图均带 ken-burns 缓慢缩放动画（与 hero 同款 12s keyframes）；
 * CSS animation 会覆盖 transform，故不使用 hover 缩放。
 */
export default function V2BrandBanner() {
  return (
    <section className="w-full">
      <Reveal>
        {/* 桌面端：锁定 1456/444（约 3.3:1）比例全宽展示，极宽屏超 85vh 时从上下进一步裁切 */}
        <a
          href={v2url('/products/')}
          className="group relative hidden sm:block w-full aspect-[1456/444] max-h-[85vh] overflow-hidden"
        >
          <img
            src={resolveUrl('/images/brand/brand-banner.webp')}
            alt="Makimoo — comfort essentials for every home"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
          />
        </a>

        {/* 移动端：竖版 3:4（与原图比例一致，无裁切） */}
        <a
          href={v2url('/products/')}
          className="group relative block sm:hidden w-full aspect-[3/4] overflow-hidden"
        >
          <img
            src={resolveUrl('/images/brand/brand-banner-mobile.webp')}
            alt="Makimoo — comfort essentials for every home"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
          />
        </a>
      </Reveal>
    </section>
  );
}
