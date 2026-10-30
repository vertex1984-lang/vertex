'use client';

import { useState } from 'react';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import {
  LOOKBOOK,
  LOOKBOOK_ROOM_LABELS,
  LOOKBOOK_CATEGORY_LABELS,
  type LookbookRoom,
  type LookbookCategory,
} from '@/data/lookbook';

/**
 * V2Lookbook —— 种草图瀑布流（2026-10-30 重构，用户定）：
 * 全量版在 /scenes/（筛选+全部图），/inspiration 只放 preview 前 N 张 + View all 出口。
 * 筛选：房间（Bedroom/Living Room/...）+ 类目（Bedding/Pillows/...）两组 chips，
 * 组合过滤；CSS columns 瀑布流，移动端单列全出血、桌面 2~3 列。
 * 图卡纯展示 + 整卡跳转（PDP 或类目页），无热点（热点精选在 /inspiration Featured 区）。
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

export default function V2Lookbook({ preview }: { preview?: number }) {
  const [room, setRoom] = useState<RoomFilter>('all');
  const [cat, setCat] = useState<CatFilter>('all');

  const rooms = Object.keys(LOOKBOOK_ROOM_LABELS) as LookbookRoom[];
  const cats = Object.keys(LOOKBOOK_CATEGORY_LABELS) as LookbookCategory[];

  const filtered = LOOKBOOK.filter(
    (i) => (room === 'all' || i.room === room) && (cat === 'all' || i.category === cat),
  );
  const items = preview ? filtered.slice(0, preview) : filtered;

  return (
    <div>
      {/* 筛选条：房间一行、类目一行（移动端可横滑）；preview 模式隐藏。
          移动端图瀑布全出血，chips 单独保留 px-4 内边距 */}
      {!preview && (
      <div className="space-y-2.5 px-4 lg:px-0">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button className={chipCls(room === 'all')} onClick={() => setRoom('all')}>
            All Rooms
          </button>
          {rooms.map((r) => (
            <button key={r} className={chipCls(room === r)} onClick={() => setRoom(r)}>
              {LOOKBOOK_ROOM_LABELS[r]}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
        {items.map((i) => (
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
            {/* hover 蒙层 + 类目标签 */}
            <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
            <span className="absolute left-3 bottom-3 bg-black/45 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {LOOKBOOK_CATEGORY_LABELS[i.category]}
            </span>
          </a>
        ))}
      </div>
      {items.length === 0 && (
        <p className="mt-10 text-center text-sm text-charcoal/50">
          No looks for this combination yet — try another filter.
        </p>
      )}
    </div>
  );
}
