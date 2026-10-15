'use client';

/**
 * SceneView —— Shop the Look 单场景沉浸式组合页主体（2026-10-14 MVP）。
 * 交互：全景图热区圆点 → 点按弹商品小卡（可加购/去 PDP）；
 * 图下方商品清单可勾选 → 吸底条显示组合价 + 一键全部加购（批量 cart lines，一次请求）；
 * 底部"换风格"切换同系列其他场景。
 * 热区坐标为图片百分比，圆点相对 <img> 渲染框定位，桌面/移动端自适应。
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

type SceneCard = Pick<
  SceneViewData,
  'slug' | 'title' | 'style' | 'tagline' | 'heroImage' | 'heroAlt'
>;

function cardImageUrl(image: string) {
  return image.includes('cdn.shopify.com') ? shopifyImageUrl(image, 400) : resolveUrl(image);
}

export default function SceneView({
  scene,
  otherScenes,
}: {
  scene: SceneViewData;
  otherScenes: SceneCard[];
}) {
  const { toast } = useToast();
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(scene.hotspots.map((h) => h.handle))
  );
  const [addingAll, setAddingAll] = useState(false);
  const [addingOne, setAddingOne] = useState(false);

  const active = scene.hotspots.find((h) => h.handle === activeHandle) ?? null;

  const selectedItems = useMemo(
    () => scene.hotspots.filter((h) => selected.has(h.handle)),
    [scene.hotspots, selected]
  );
  const comboPrice = selectedItems.reduce((sum, h) => sum + parseFloat(h.price || '0'), 0);
  const currency = scene.hotspots[0]?.currency ?? 'USD';

  const toggle = (handle: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(handle)) next.delete(handle);
      else next.add(handle);
      return next;
    });
  };

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
    const items = selectedItems.filter((h) => h.inStock);
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
    <div className="pb-28">
      {/* 标题区 */}
      <header className="px-4 pt-6 pb-5 text-center lg:pt-10 lg:pb-8">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand">
          Shop the Look · {scene.style}
        </p>
        <h1 className="mt-2 text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal">
          {scene.title}
        </h1>
        <p className="mt-2 text-sm text-charcoal/60">{scene.tagline}</p>
        <p className="mt-1 text-xs text-charcoal/40">Tap a dot on the photo to shop it</p>
      </header>

      {/* 全景图 + 热区圆点：移动端全宽；桌面端限高居中，圆点随图缩放 */}
      <div className="lg:text-center">
        <div className="relative inline-block w-full lg:w-auto lg:h-[82vh] lg:max-w-full">
          <img
            src={resolveUrl(scene.heroImage)}
            alt={scene.heroAlt}
            className="block w-full h-auto lg:w-auto lg:h-full select-none"
            draggable={false}
          />
          {scene.hotspots.map((h) => (
            <button
              key={h.handle}
              type="button"
              aria-label={`${h.title} — ${h.label}`}
              onClick={() => setActiveHandle(h.handle)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <span className="absolute inset-0 rounded-full bg-white/60 animate-ping [animation-duration:2.5s]" />
              <span
                className={`relative flex h-7 w-7 lg:h-8 lg:w-8 items-center justify-center rounded-full border-2 border-white shadow-lg transition ${
                  activeHandle === h.handle ? 'bg-brand scale-110' : 'bg-white/90 group-hover:bg-brand'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    activeHandle === h.handle ? 'bg-white' : 'bg-brand group-hover:bg-white'
                  }`}
                />
              </span>
              {/* 桌面端悬停悬浮小卡（移动端保持点按弹层，不启用）：
                  纵向——圆点在图上 1/4 处以上时小卡向下展开，否则向上；
                  横向——靠左/右边缘的圆点让小卡改与圆点对齐，避免溢出图片 */}
              <span
                className={`pointer-events-none absolute z-10 hidden w-52 lg:group-hover:block ${
                  h.y < 25 ? 'top-full mt-3' : 'bottom-full mb-3'
                } ${
                  h.x <= 25
                    ? 'left-1/2'
                    : h.x >= 75
                      ? 'right-1/2'
                      : 'left-1/2 -translate-x-1/2'
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
                      {formatPrice(h.price, h.currency)}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-charcoal/45">Click the dot to shop</span>
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 商品清单（勾选参与组合加购） */}
      <section className="mx-auto max-w-3xl px-4 pt-8 lg:pt-12">
        <h2 className="text-lg lg:text-xl font-bold text-charcoal">In this scene</h2>
        <ul className="mt-4 divide-y divide-warm-gray/60">
          {scene.hotspots.map((h) => (
            <li key={h.handle} className="flex items-center gap-3 py-3">
              <button
                type="button"
                onClick={() => setActiveHandle(h.handle)}
                className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-warm-gray bg-white"
                aria-label={`Preview ${h.title}`}
              >
                <img src={cardImageUrl(h.image)} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
              <div className="min-w-0 flex-1">
                <a
                  href={v2url(`/products/${h.handle}/`)}
                  className="block truncate text-sm font-semibold text-charcoal hover:text-brand"
                >
                  {h.title}
                </a>
                <p className="mt-0.5 text-xs text-charcoal/50">{h.label}</p>
                <p className="mt-0.5 text-sm font-bold text-brand">
                  {formatPrice(h.price, h.currency)}
                  {!h.inStock && <span className="ml-2 text-xs font-normal text-charcoal/40">Out of stock</span>}
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs text-charcoal/60">
                <input
                  type="checkbox"
                  checked={selected.has(h.handle)}
                  onChange={() => toggle(h.handle)}
                  disabled={!h.inStock}
                  className="h-4 w-4 accent-brand"
                />
                <span className="hidden sm:inline">Include</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      {/* 换风格切换 */}
      {otherScenes.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 pt-10 lg:pt-14">
          <h2 className="text-lg lg:text-xl font-bold text-charcoal">Switch the vibe</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:gap-5">
            {otherScenes.map((s) => (
              <a
                key={s.slug}
                href={v2url(`/scenes/${s.slug}/`)}
                className="group relative block overflow-hidden rounded-xl aspect-[4/3]"
              >
                <img
                  src={resolveUrl(s.heroImage)}
                  alt={s.heroAlt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <p className="text-cream text-xs font-semibold tracking-[0.2em] uppercase">{s.style}</p>
                  <p className="mt-0.5 text-cream/90 text-sm font-semibold">{s.title}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 吸底组合加购条 */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-warm-gray bg-cream/95 backdrop-blur px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-charcoal/60">
              {selectedItems.length} of {scene.hotspots.length} items
            </p>
            <p className="text-base font-extrabold text-charcoal">
              {formatPrice(comboPrice.toFixed(2), currency)}
            </p>
          </div>
          <button
            type="button"
            onClick={addAll}
            disabled={addingAll || selectedItems.filter((h) => h.inStock).length === 0}
            className="h-11 shrink-0 rounded-full bg-brand px-6 text-sm font-semibold text-cream transition hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60"
          >
            {addingAll ? 'Adding...' : 'Add All to Cart'}
          </button>
        </div>
      </div>

      {/* 热区商品小卡弹层（吸底 sheet，桌面端居中卡片） */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/40 lg:items-center"
          onClick={() => setActiveHandle(null)}
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
                  {formatPrice(active.price, active.currency)}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setActiveHandle(null)}
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
                {!active.inStock ? 'Out of Stock' : addingOne ? 'Adding...' : 'Add to Cart'}
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
