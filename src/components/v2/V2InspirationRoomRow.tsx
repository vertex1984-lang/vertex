'use client';

import V2CarouselRow from './V2CarouselRow';
import V2ImageHotspots from './V2ImageHotspots';
import { v2url } from '@/lib/v2paths';
import type { BeforeAfterHotspot } from './hotspots';

export interface InspirationRoomCard {
  image: string;
  alt: string;
  hotspots: BeforeAfterHotspot[];
}

/**
 * V2InspirationRoomRow —— Inspiration 单个房间分区的横滑卡行（2026-11-28 用户定）。
 * 卡片 3:4 圆角 + 产品热点圆点；View more 链接在分区标题行右侧常驻
 * （2026-11-28 二轮用户定，不再是滑到最后才露出的行尾尾卡）。
 * 卡片尺寸与 Next Drops 区一致：移动端 68vw，桌面 lg:flex-1 + min-w-[440px] 恒定不压缩；
 * 桌面端溢出时由 V2CarouselRow 显示左右箭头。padding/scroll-px 与 Soft Essentials 对齐。
 */
export default function V2InspirationRoomRow({
  label,
  viewMoreHref,
  cards,
  tight = false,
}: {
  label: string;
  viewMoreHref: string;
  cards: InspirationRoomCard[];
  /** 首个分区：与 Inspiration 主标题的间距收紧（2026-11-28 用户定），分区间距不变 */
  tight?: boolean;
}) {
  return (
    <div className={tight ? 'mt-4 lg:mt-6' : 'mt-10 lg:mt-16'}>
      <div className="flex items-end justify-between gap-4 px-6 lg:px-10">
        <h3 className="text-base lg:text-xl font-bold tracking-tight text-charcoal">
          {label}
        </h3>
        <a
          href={v2url(viewMoreHref)}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand"
        >
          <span className="border-b border-brand/40 pb-0.5 transition-colors group-hover:border-brand">
            View more
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:translate-x-1"
            aria-hidden
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
      <V2CarouselRow className="mt-3 lg:mt-4 flex gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 lg:scroll-px-10 px-6 lg:px-10 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {cards.map((c) => (
          <div
            key={c.image}
            className="w-[68vw] shrink-0 snap-start lg:w-auto lg:flex-1 lg:min-w-[440px]"
          >
            <V2ImageHotspots
              image={c.image}
              alt={c.alt}
              hotspots={c.hotspots}
              className="rounded-lg"
            />
          </div>
        ))}
      </V2CarouselRow>
    </div>
  );
}
