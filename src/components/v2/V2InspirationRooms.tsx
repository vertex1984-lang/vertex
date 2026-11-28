import {
  mergedLookbookItems,
  lookbookHotspotsByImage,
} from '@/data/lookbook-hotspots';
import V2InspirationRoomRow, {
  type InspirationRoomCard,
} from './V2InspirationRoomRow';

/**
 * V2InspirationRooms —— /drop-home Inspiration 区（2026-11-28 用户定，取代 V2InspirationTeaser）：
 * 三个房间分区：Living Room / Bedroom / Dining Nook。
 * 每区横向滑动卡片（mergedLookbookItems 按 room 过滤取前 7 张，场景卡 addedAt 新→旧在前），
 * 卡上展示产品热点（V2ImageHotspots，与 PDP 双图区同款悬停/点按交互）。
 * 2026-11-28 用户定（二轮）：主标题改为 Inspiration + 副标题简介；区域宽度与上方
 * Soft Essentials 一致（通栏 px-6 lg:px-10，不再 88% 限宽）；卡片尺寸/最小宽度/缩放
 * 与 Next Drops 卡片一致（68vw → lg:flex-1 lg:min-w-[440px]）；
 * View more 链接改到各分区标题行右侧常驻（不再是行尾尾卡）。
 * 场景合并与热点 enrich 依赖产品库（scenes.ts），只能在本服务端组件现算后以 props
 * 传给客户端行组件（同 /scenes、/inspiration 页面模式，勿从客户端 import 数据源）。
 */

const ROOMS = [
  { room: 'living-room', label: 'Living Room', href: '/scenes/?room=living-room' },
  { room: 'bedroom', label: 'Bedroom', href: '/scenes/?room=bedroom' },
  { room: 'dining', label: 'Dining Nook', href: '/scenes/?room=dining' },
] as const;

const CARDS_PER_ROOM = 7;

export default function V2InspirationRooms() {
  const items = mergedLookbookItems();
  const hotspotsByImage = lookbookHotspotsByImage();

  const rows = ROOMS.map((r) => {
    const cards: InspirationRoomCard[] = items
      .filter((i) => i.room === r.room)
      .slice(0, CARDS_PER_ROOM)
      .map((i) => ({
        image: i.image,
        alt: i.alt,
        // enrich 后 title/image 必有；price 兜底空串（小卡不显示价格行）
        hotspots: (hotspotsByImage[i.image] ?? []).map((h) => ({
          handle: h.handle,
          x: h.x,
          y: h.y,
          label: h.label,
          title: h.title ?? '',
          image: h.image ?? '',
          price: h.price ?? '',
          currency: h.currency ?? 'USD',
        })),
      }));
    return { ...r, cards };
  }).filter((r) => r.cards.length > 0);

  return (
    <section className="pb-11 lg:pb-16">
      <h2 className="px-6 lg:px-10 pt-8 lg:pt-11 text-2xl lg:text-[32px] font-extrabold tracking-tight text-charcoal">
        Inspiration{' '}
        <span className="block lg:inline mt-1 lg:mt-0 text-lg lg:text-2xl font-semibold text-brand">
          Makimoo for every corner of your home.
        </span>
      </h2>
      {rows.map((r, i) => (
        <V2InspirationRoomRow
          key={r.room}
          label={r.label}
          viewMoreHref={r.href}
          cards={r.cards}
          tight={i === 0}
        />
      ))}
    </section>
  );
}
