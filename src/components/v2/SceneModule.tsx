'use client';

/**
 * SceneModule —— /scenes/ 瀑布流页里的单场景模块（2026-10-14）。
 * 结构：自然比例全景图（热区圆点 + 桌面悬停小卡）+ 图下组合加购条
 * （选中商品 chips 可移除 + 组合价 + Add All，批量 cart lines 一次请求）。
 * 与 PDP 式详情页 /scenes/[slug]/（SceneView）共用数据口径，但加购条内联在模块里，
 * 不用吸底条——一页多场景，吸底会互相打架。
 */

import { useMemo, useState } from 'react';
import type { SceneHotspotCard, SceneViewData } from '@/data/scenes';
import {
  addMultipleToShopifyCart,
  addToShopifyCart,
  addToLocalCart,
  notifyCartUpdated,
  openMiniCart,
} from '@/lib/cart';
import { formatPrice } from '@/lib/currency';
import { trackEvent, GA_CURRENCY } from '@/lib/gtag';
import { useToast } from '@/components/Toast';
import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

function cardImageUrl(image: string) {
  return image.includes('cdn.shopify.com') ? shopifyImageUrl(image, 400) : resolveUrl(image);
}

function hkey(h: SceneHotspotCard) {
  return h.spotId ?? h.handle;
}

function priceLabel(price: string, currency: string) {
  return parseFloat(price) > 0 ? formatPrice(price, currency) : 'Coming Soon';
}

export default function SceneModule({ scene }: { scene: SceneViewData }) {
  const { toast } = useToast();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [addingAll, setAddingAll] = useState(false);
  const [addingOne, setAddingOne] = useState(false);

  const active = scene.hotspots.find((h) => hkey(h) === activeKey) ?? null;

  const buyableItems = useMemo(
    () => scene.hotspots.filter((h) => h.inStock && parseFloat(h.price) > 0),
    [scene.hotspots]
  );
  const comboPrice = buyableItems.reduce((sum, h) => sum + parseFloat(h.price || '0'), 0);
  const hasUnpriced = buyableItems.length < scene.hotspots.length;
  const currency = scene.hotspots[0]?.currency ?? 'USD';

  const addOne = async (h: SceneHotspotCard) => {
    setAddingOne(true);
    trackEvent('add_to_cart', {
      currency: GA_CURRENCY,
      value: parseFloat(h.price),
      items: [{ item_id: h.handle, item_name: h.title, price: parseFloat(h.price), quantity: 1 }],
    });
    try {
      if (h.variantId) {
        const result = await addToShopifyCart(h.variantId, 1);
        if (!result) {
          toast('Failed to add to cart. Please try again.', 'error');
          return;
        }
      } else {
        addToLocalCart({
          id: h.handle,
          title: h.title,
          image: resolveUrl(h.image),
          price: h.price,
          quantity: 1,
          handle: h.handle,
        });
      }
      notifyCartUpdated();
      openMiniCart();
      toast('Added to cart!');
    } catch {
      toast('Something went wrong. Please try again.', 'error');
    } finally {
      setAddingOne(false);
    }
  };

  const addAll = async () => {
    const items = buyableItems;
    if (items.length === 0) return;
    setAddingAll(true);
    trackEvent('add_to_cart', {
      currency: GA_CURRENCY,
      value: comboPrice,
      items: items.map((h) => ({
        item_id: h.handle,
        item_name: h.title,
        price: parseFloat(h.price),
        quantity: 1,
      })),
    });
    try {
      const withVariant = items.filter((h) => h.variantId);
      const withoutVariant = items.filter((h) => !h.variantId);
      let ok = true;
      if (withVariant.length > 0) {
        const result = await addMultipleToShopifyCart(
          withVariant.map((h) => ({ merchandiseId: h.variantId!, quantity: 1 }))
        );
        ok = Boolean(result);
      }
      for (const h of withoutVariant) {
        addToLocalCart({
          id: h.handle,
          title: h.title,
          image: resolveUrl(h.image),
          price: h.price,
          quantity: 1,
          handle: h.handle,
        });
      }
      if (!ok) {
        toast('Failed to add to cart. Please try again.', 'error');
        return;
      }
      notifyCartUpdated();
      openMiniCart();
      toast(`Added ${items.length} item${items.length > 1 ? 's' : ''} to cart!`);
    } catch {
      toast('Something went wrong. Please try again.', 'error');
    } finally {
      setAddingAll(false);
    }
  };

  return (
    <div className="break-inside-avoid">
      {/* 场景图：自然比例，宽度占满列；热区圆点 + 桌面悬停小卡 */}
      <div className="relative overflow-hidden">
        <img
          src={resolveUrl(scene.heroImage)}
          alt={scene.heroAlt}
          loading="lazy"
          draggable={false}
          className="block w-full h-auto select-none"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent" />
        <div className="pointer-events-none absolute bottom-3 left-4 lg:bottom-4 lg:left-5">
          <p className="text-cream text-[11px] lg:text-xs font-semibold tracking-[0.2em] uppercase">
            {scene.style}
          </p>
          <p className="mt-0.5 text-cream text-base lg:text-lg font-bold">{scene.title}</p>
        </div>
        {scene.hotspots.map((h) => (
          <button
            key={hkey(h)}
            type="button"
            aria-label={`${h.title} — ${h.label}`}
            onClick={() => setActiveKey(hkey(h))}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
          >
            <span className="absolute inset-0 rounded-full bg-white/60 animate-ping [animation-duration:2.5s]" />
            <span
              className={`relative flex h-7 w-7 lg:h-8 lg:w-8 items-center justify-center rounded-full border-2 border-white shadow-lg transition ${
                activeKey === hkey(h) ? 'bg-brand scale-110' : 'bg-white/90 group-hover:bg-brand'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  activeKey === hkey(h) ? 'bg-white' : 'bg-brand group-hover:bg-white'
                }`}
              />
            </span>
            {/* 桌面悬停小卡：圆点在图上 1/4 以上时向下展开；靠边圆点与圆点对齐防溢出 */}
            <span
              className={`pointer-events-none absolute z-10 hidden w-52 lg:group-hover:block ${
                h.y < 25 ? 'top-full mt-3' : 'bottom-full mb-3'
              } ${
                h.x <= 25 ? 'left-1/2' : h.x >= 75 ? 'right-1/2' : 'left-1/2 -translate-x-1/2'
              }`}
            >
              <span className="flex items-center gap-2.5 rounded-xl border border-warm-gray bg-cream/95 p-2.5 text-left shadow-xl backdrop-blur">
                <span className="block h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-warm-gray bg-white">
                  <img src={cardImageUrl(h.image)} alt="" className="h-full w-full object-cover" loading="lazy" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold leading-snug text-charcoal line-clamp-2">
                    {h.title}
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-brand">
                    {priceLabel(h.price, h.currency)}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-charcoal/45">Click the dot to shop</span>
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* 组合展示条：场景内全部产品 chips（纯展示）+ 组合价 + Add All */}
      <div className="flex flex-wrap items-center gap-2 border border-t-0 border-warm-gray/60 bg-cream px-3 py-2.5 lg:border-t lg:-mt-1 lg:px-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {scene.hotspots.map((h) => (
            <span
              key={hkey(h)}
              className="flex items-center gap-1 rounded-full border border-warm-gray bg-white py-0.5 pl-0.5 pr-2.5"
            >
              <img
                src={cardImageUrl(h.image)}
                alt=""
                className="h-6 w-6 rounded-full object-cover"
                loading="lazy"
              />
              <span className="max-w-20 truncate text-[11px] text-charcoal/70">
                {h.inStock ? priceLabel(h.price, h.currency) : 'Coming Soon'}
              </span>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-extrabold text-charcoal">
            {buyableItems.length > 0
              ? `${hasUnpriced ? 'From ' : ''}${formatPrice(comboPrice.toFixed(2), currency)}`
              : 'Coming Soon'}
          </span>
          <button
            type="button"
            onClick={addAll}
            disabled={addingAll || buyableItems.length === 0}
            className="h-9 rounded-full bg-brand px-4 text-xs font-semibold text-cream transition hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60"
          >
            {addingAll ? 'Adding...' : 'Add All'}
          </button>
        </div>
      </div>

      {/* 热区商品小卡弹层 */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/40 lg:items-center"
          onClick={() => setActiveKey(null)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl bg-cream p-4 shadow-2xl lg:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-4">
              <a
                href={v2url(`/products/${active.handle}/`)}
                className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-warm-gray bg-white"
              >
                <img src={cardImageUrl(active.image)} alt={active.title} className="h-full w-full object-cover" />
              </a>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-charcoal/50">{active.label}</p>
                <a
                  href={v2url(`/products/${active.handle}/`)}
                  className="mt-1 block text-sm font-semibold leading-snug text-charcoal hover:text-brand line-clamp-2"
                >
                  {active.title}
                </a>
                <p className="mt-1 text-base font-bold text-brand">
                  {priceLabel(active.price, active.currency)}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setActiveKey(null)}
                className="self-start text-charcoal/40 hover:text-charcoal text-xl leading-none px-1"
              >
                ×
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => addOne(active)}
                disabled={addingOne || !active.inStock}
                className="h-11 flex-1 rounded-full bg-brand text-sm font-semibold text-cream transition hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60"
              >
                {!active.inStock ? 'Coming Soon' : addingOne ? 'Adding...' : 'Add to Cart'}
              </button>
              <a
                href={v2url(`/products/${active.handle}/`)}
                className="flex h-11 flex-1 items-center justify-center rounded-full border border-brand text-sm font-semibold text-brand transition hover:bg-brand/5"
              >
                View Details
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
