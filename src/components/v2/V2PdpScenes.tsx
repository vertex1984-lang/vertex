import Link from 'next/link';
import V2ImageHotspots from '@/components/v2/V2ImageHotspots';
import V2ShowMoreScenes from '@/components/v2/V2ShowMoreScenes';
import type { BeforeAfterHotspot } from '@/components/v2/hotspots';
import { getProductScenes, type ProductSceneRef } from '@/data/product-scenes';
import { SCENES } from '@/data/scenes';
import { getProductByHandle } from '@/data/products';

/**
 * V2PdpScenes —— PDP 反向场景展示（2026-11-05/06 用户定）：
 * 商品出现在 Shop the Look 场景图里时，PDP 渲染对应场景图 + 全部热区定位点。
 * 数据来自 product-scenes.ts 反向映射（scenes.ts 派生，自动同步）。
 * 试点已验收（2026-11-06 用户浏览器实测通过），PILOT_SLUGS 已清空 = 全量放开。
 * 首屏展示 3 个场景（addedAt 新的优先）；更多场景折叠进 Show More Scenes 按钮一次展开，
 * 全量上限 6 个（2026-11-07 用户定）；商品未出镜时渲染 null，零成本。
 *
 * 交互（2026-11-06 用户定）：复用双图区 V2ImageHotspots 两段式——点圆点弹产品小卡，
 * 小卡整卡跳对应 PDP，点图空白处收起；本 PDP 商品（isCurrent）品牌色标记、
 * 小卡提示 "You're viewing this product" 不可跳，场景入口走图下 Explore Scene。
 * 热区过滤（2026-11-06 用户报 404）：scenes.ts 部分热点 handle 无对应落地页
 * （历史数据债，如 oval 1688-996768645117-c2），无落地页的圆点不渲染——
 * 过滤口径同双图区 enrichHotspots（getProductByHandle 命中才出点）。
 * 服务端组件：产品库只在服务端取用（lookbook-hotspots.ts 同款纪律），
 * 仅 V2ImageHotspots 这一个客户端孤岛进 bundle。
 */

/** 首屏场景数（2026-11-07 用户定：2 → 3）；更多场景折叠进 Show More Scenes 按钮 */
const INITIAL_SCENES = 3;
/** 全量上限（2026-11-07 用户定：最多 6，超出部分不展示，最新的优先） */
const MAX_SCENES = 6;

/** 试点白名单（2026-11-06 试点验收通过后清空 = 全量放开）。语义：空数组 = 全部场景；
    非空 = 只渲染白名单场景（灰度回切用）——注意 includes 过滤器对空数组恒 false，
    必须配合 length 判断，否则清空会导致全站区块消失（2026-11-06 抽查实测踩坑） */
const PILOT_SLUGS: string[] = [];

/** 热区 → 产品小卡字段（口径同 V2PdpBeforeAfterDuo.enrichHotspots）；
    无落地页的 handle 跳过（圆点不渲染，杜绝 404） */
function enrichHotspots(
  sceneSlug: string,
  currentHandle: string,
): BeforeAfterHotspot[] {
  const scene = SCENES.find((s) => s.slug === sceneSlug);
  if (!scene) return [];
  const current = getProductByHandle(currentHandle);
  if (!current) return [];
  const currentImage =
    current.shopifyImages?.[0] ?? current.featuredImage ?? current.images[0]?.url ?? '';
  const currentPrice =
    current.shopifyPrice ?? current.priceRange.minVariantPrice.amount;
  const currentCurrency =
    current.shopifyCurrencyCode ?? current.priceRange.minVariantPrice.currencyCode;

  const out: BeforeAfterHotspot[] = [];
  for (const h of scene.hotspots) {
    if (h.handle.toLowerCase() === currentHandle.toLowerCase()) {
      out.push({
        handle: h.handle,
        title: current.title,
        image: currentImage,
        price: currentPrice,
        currency: currentCurrency,
        x: h.x,
        y: h.y,
        label: h.label,
        isCurrent: true,
      });
      continue;
    }
    const p = getProductByHandle(h.handle);
    if (!p) continue;
    out.push({
      handle: p.handle,
      title: p.title,
      image: p.shopifyImages?.[0] ?? p.featuredImage ?? p.images[0]?.url ?? '',
      price: p.shopifyPrice ?? p.priceRange.minVariantPrice.amount,
      currency: p.shopifyCurrencyCode ?? p.priceRange.minVariantPrice.currencyCode,
      x: h.x,
      y: h.y,
      label: h.label,
    });
  }
  return out;
}

export default function V2PdpScenes({ handle }: { handle: string }) {
  const refs = getProductScenes(handle)
    .filter((r) => PILOT_SLUGS.length === 0 || PILOT_SLUGS.includes(r.slug))
    // 先滤后切（2026-11-07 用户定改 3+Show More 时顺手修正）：死场景不占名额
    .filter((r) => enrichHotspots(r.slug, handle).length > 0)
    .slice(0, MAX_SCENES);
  if (refs.length === 0) return null;
  const visible = refs.slice(0, INITIAL_SCENES);
  const hidden = refs.slice(INITIAL_SCENES);

  const renderScene = (ref: ProductSceneRef) => {
    const hotspots = enrichHotspots(ref.slug, handle);
    return (
      <figure key={ref.slug} className="mx-auto max-w-[1520px] lg:w-[80%] lg:max-w-none px-6 lg:px-10">
        <V2ImageHotspots image={ref.heroImage} alt={ref.heroAlt} hotspots={hotspots} />
        <figcaption className="mt-3 flex items-baseline justify-between gap-4">
          <div>
            <p className="text-sm lg:text-base font-semibold text-charcoal">{ref.title}</p>
            <p className="mt-0.5 text-[11px] lg:text-xs text-[#999]">{ref.tagline}</p>
          </div>
          <Link
            href={`/scenes/${ref.slug}`}
            className="group inline-flex items-center gap-1 flex-shrink-0 text-xs lg:text-sm font-medium tracking-widest uppercase text-charcoal-light transition-colors hover:text-brand"
          >
            Explore Scene
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </figcaption>
      </figure>
    );
  };

  return (
    <section className="mt-8 lg:mt-12">
      <div className="mx-auto max-w-[1520px] lg:w-[80%] lg:max-w-none px-6 lg:px-10">
        <h2 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal">Shop the Look</h2>
        <p className="mt-1 text-xs lg:text-sm text-[#999]">
          This piece appears in our styled scenes — tap a dot to shop the look.
        </p>
      </div>
      <div className="mt-4 lg:mt-6 space-y-8 lg:space-y-10">
        {visible.map(renderScene)}
        {hidden.length > 0 && (
          <V2ShowMoreScenes count={hidden.length}>{hidden.map(renderScene)}</V2ShowMoreScenes>
        )}
      </div>
    </section>
  );
}
