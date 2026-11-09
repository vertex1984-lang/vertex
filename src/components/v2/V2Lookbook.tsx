'use client';

import { useEffect, useState } from 'react';
import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { formatPrice, isComingSoonAmount } from '@/lib/currency';
import { v2url } from '@/lib/v2paths';
import {
  LOOKBOOK,
  LOOKBOOK_ROOM_LABELS,
  LOOKBOOK_CATEGORY_LABELS,
  type LookbookRoom,
  type LookbookCategory,
} from '@/data/lookbook';

/** 图卡产品热区（image → 热区列表），由服务端页面从 scenes.ts / inspiration-scenes.ts 现算传入。
    title/image/price/currency（2026-11-09 领导要求恢复悬停预览卡）：scenes.ts 热点自带，
    inspiration-scenes 热点由 lookbook-hotspots.ts 服务端经产品库补齐 */
export interface LookbookHotspot {
  handle: string;
  x: number;
  y: number;
  label: string;
  spotId?: string;
  title?: string;
  image?: string;
  price?: string;
  currency?: string;
}

/** 卡片条目（服务端合并场景图后的口径；category='' 的场景卡只在 All Categories 下出现） */
export interface LookbookCardItem {
  image: string;
  alt: string;
  room: LookbookRoom;
  category: LookbookCategory | '';
  href: string;
}

/**
 * V2Lookbook —— 种草图瀑布流（2026-10-30 重构，用户定）：
 * 全量版在 /scenes/（筛选+全部图），/inspiration 只放 preview 前 N 张 + View all 出口。
 * 筛选：房间（Bedroom/Living Room/...）+ 类目（Bedding/Pillows/...）两组 chips，
 * 组合过滤；CSS columns 瀑布流，移动端单列全出血、桌面 2~3 列。
 * 图卡纯展示 + 整卡跳转（场景详情页 / PDP / 类目页），无 hover 类目标签（2026-11-05 用户定下线）。
 * 卡片列表（2026-11-05 用户定）：85 个场景图（全部有热区）合并进来——服务端页面经
 * lookbook-hotspots.ts 的 mergedLookbookItems() 现算（场景卡 addedAt 新→旧在前，
 * 原 LOOKBOOK 去重接后；场景 room/category 由热区产品多数决自动推导），以 items prop 传入。
 * 产品热区圆点（2026-11-05 用户定）：有锚点数据的图（scenes.ts heroImage /
 * inspiration-scenes.ts after 图命中）在图上叠品牌色实心圆点
 * （样式 = PDP 双图区 "This item" 圆点去掉文字牌），点圆点直接跳对应 PDP，
 * 不弹产品小卡；无锚点的图保持纯图卡。圆点数据同样由服务端页面经
 * lookbook-hotspots.ts 现算传入（scenes.ts 依赖产品库，不进客户端 bundle）。
 * 房间筛选支持 ?room=xxx URL 参数初始化（teaser 房间卡直链，2026-11-02 用户定）。
 * preview 模式：不显示筛选 chips，只取前 N 条。
 */

type RoomFilter = LookbookRoom | 'all';
type CatFilter = LookbookCategory | 'all';

const chipCls = (active: boolean) =>
  `rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
    active
      ? 'bg-charcoal text-white'
      : 'border border-charcoal/15 text-charcoal/70 hover:border-charcoal/40'
  }`;

/** 卡片小图 URL：Shopify CDN 图走图片服务缩放，本地图直接解析 */
function dotCardImageUrl(image: string) {
  return image.includes('cdn.shopify.com') ? shopifyImageUrl(image, 400) : resolveUrl(image);
}

export default function V2Lookbook({
  preview,
  hotspotsByImage,
  items,
}: {
  preview?: number;
  hotspotsByImage?: Record<string, LookbookHotspot[]>;
  /** 服务端合并后的卡片列表（场景图 + 原 LOOKBOOK 去重）；缺省回退 LOOKBOOK 静态数据 */
  items?: LookbookCardItem[];
}) {
  const [room, setRoom] = useState<RoomFilter>('all');
  const [cat, setCat] = useState<CatFilter>('all');

  const rooms = Object.keys(LOOKBOOK_ROOM_LABELS) as LookbookRoom[];

  // 2026-11-02 用户定：支持 ?room=xxx 初始筛选（首页 Inspiration teaser 各房间卡直链进来）；
  // 静态导出无法用 useSearchParams（需 Suspense），改在挂载后读 window.location（与 products 页同口径）
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get('room');
    if (r && (rooms as string[]).includes(r)) setRoom(r as LookbookRoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cats = Object.keys(LOOKBOOK_CATEGORY_LABELS) as LookbookCategory[];

  const filtered = (items ?? LOOKBOOK).filter(
    (i) => (room === 'all' || i.room === room) && (cat === 'all' || i.category === cat),
  );
  const shown = preview ? filtered.slice(0, preview) : filtered;

  return (
    <div>
      {/* 筛选条：房间一行、类目一行（移动端可横滑）；preview 模式隐藏。
          移动端图瀑布全出血，chips 单独保留 px-4 内边距 */}
      {!preview && (
      <div className="space-y-2.5 px-4 lg:px-0">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <button className={chipCls(room === 'all')} onClick={() => setRoom('all')}>
            All Rooms
          </button>
          {rooms.map((r) => (
            <button key={r} className={chipCls(room === r)} onClick={() => setRoom(r)}>
              {LOOKBOOK_ROOM_LABELS[r]}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <button className={chipCls(cat === 'all')} onClick={() => setCat('all')}>
            All Categories
          </button>
          {cats.map((c) => (
            <button key={c} className={chipCls(cat === c)} onClick={() => setCat(c)}>
              {LOOKBOOK_CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* 瀑布流 */}
      <div className="mt-6 columns-1 sm:columns-2 2xl:columns-3 gap-3 lg:gap-5 [&>*]:mb-3 lg:[&>*]:mb-5">
        {shown.map((i) => {
          const dots = hotspotsByImage?.[i.image];
          return (
          <a
            key={i.image}
            href={v2url(i.href)}
            className="group relative block break-inside-avoid overflow-hidden rounded-none sm:rounded-lg bg-cream"
          >
            <img
              src={resolveUrl(i.image)}
              alt={i.alt}
              loading="lazy"
              className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {/* 产品热区圆点（2026-11-05 用户定）：品牌色实心 + 白描边 + 呼吸波纹，
                样式同 PDP 双图区 "This item" 圆点（去文字牌）；点圆点直接跳对应 PDP */}
            {dots?.map((h, di) => (
              <span
                key={`${h.handle}-${h.spotId ?? di}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
              >
                <button
                  type="button"
                  aria-label={`Shop ${h.label}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.assign(v2url(`/products/${h.handle}/`));
                  }}
                  className="group/dot relative block"
                >
                  <span className="absolute inset-0 rounded-full bg-white/60 animate-ping [animation-duration:2.5s]" />
                  <span className="relative flex h-8 w-8 lg:h-9 lg:w-9 items-center justify-center rounded-full border-2 border-white bg-brand shadow-lg transition group-hover/dot:scale-110">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  {/* 桌面悬停产品预览卡（2026-11-09 领导要求恢复：悬停圆点显示产品信息小卡，
                      点击仍直接跳 PDP；圆点在图上 1/4 以上时向下展开，靠边与圆点对齐防溢出） */}
                  {h.title && (
                    <span
                      className={`pointer-events-none absolute z-20 hidden w-52 lg:group-hover/dot:block ${
                        h.y < 25 ? 'top-full mt-3' : 'bottom-full mb-3'
                      } ${h.x <= 25 ? 'left-0' : h.x >= 75 ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}
                    >
                      <span className="flex items-center gap-2.5 rounded-xl border border-warm-gray bg-cream/95 p-2.5 text-left shadow-xl backdrop-blur">
                        <span className="block h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-warm-gray bg-white">
                          {h.image && (
                            <img
                              src={dotCardImageUrl(h.image)}
                              alt=""
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs font-semibold leading-snug text-charcoal line-clamp-2">
                            {h.title}
                          </span>
                          <span className="mt-0.5 block text-sm font-bold text-brand">
                            {isComingSoonAmount(h.price) ? 'Coming Soon' : formatPrice(h.price ?? '0', h.currency || 'USD')}
                          </span>
                          <span className="mt-0.5 block text-[10px] text-charcoal/45">Click to shop</span>
                        </span>
                      </span>
                    </span>
                  )}
                </button>
              </span>
            ))}
          </a>
          );
        })}
      </div>
      {shown.length === 0 && (
        <p className="mt-10 text-center text-sm text-charcoal/50">
          No looks for this combination yet — try another filter.
        </p>
      )}
    </div>
  );
}
