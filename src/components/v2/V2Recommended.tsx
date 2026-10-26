'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import GroupProductCard from '@/components/v2/GroupProductCard';
import { buildGroupCardsFromCards, type GroupCard } from '@/lib/group-cards';
import type { V2CardProduct } from '@/components/v2/V2ProductCard';
import { v2url } from '@/lib/v2paths';
import { getRecentlyViewed } from '@/lib/recently-viewed';
import type { RecommendedCandidate } from '@/data/home-sections';

const MAX_ITEMS = 10;
// 只参考最近浏览的 5 个产品，越近权重越高（5→1）
const HISTORY_DEPTH = 5;

// 标题去重 key（同 featured-sections）：同款多色/多尺寸只占一个推荐位
const titleKey = (title: string) =>
  title.toLowerCase().replace(/\(.*?\)/g, '').slice(0, 30).trim();

// 组 key（familyKey 前缀；无组单品 = asin 小写，与 buildGroupCardsFromCards 同口径）
const groupKeyOfCard = (c: V2CardProduct) => (c.familyKey ?? c.asin.toLowerCase()).split('::')[0];

interface V2RecommendedProps {
  // 服务端已选好（src/data/home-sections.ts）：无浏览历史时的兜底榜单（Best Sellers 前 10）
  fallback: V2CardProduct[];
  // 全部在售产品的精简卡片 + 打分标签（按 handle 索引），供 client 按浏览历史个性化
  candidates: Record<string, RecommendedCandidate>;
}

/**
 * V2 首页关联推荐区（替换原 New Arrivals 位）：根据用户浏览历史推荐产品。
 * 算法：取最近浏览的 5 个产品（权重 5→1 递减），对每个候选在售产品打分——
 *   同类目 +3、同色系 +2、同场景 +1（乘以浏览权重累加），
 * 排除已浏览产品、按标题去重，再按组 key 合并同组（2026-10-22 一组一卡 + 色卡口径：
 * 同组只出一张卡，卡位由最高分成员决定、首屏选中色 = 命中成员颜色，色卡变体 = 全部
 * 在售候选中该组的颜色），取分数最高的 10 个组。
 * 无浏览历史（或无有效推荐）时回退到 server 传入的 Best Sellers 兜底榜单（同样按组合并）。
 * 展示与 Shop by Color 相同：标题 + 单行横滑产品卡（触摸滑动 + 鼠标拖拽，同 Shop by Category，无箭头）+ 底部 View More 按钮。
 */
export default function V2Recommended({ fallback, candidates }: V2RecommendedProps) {
  // 全部在售候选按组归类（组内保持候选顺序，供色卡变体/From 价用）
  const cardsByGroup = useMemo(() => {
    const m = new Map<string, V2CardProduct[]>();
    for (const t of Object.values(candidates)) {
      const key = groupKeyOfCard(t.card);
      const list = m.get(key);
      if (list) list.push(t.card);
      else m.set(key, [t.card]);
    }
    return m;
  }, [candidates]);

  // 打分/兜底序列（产品卡）→ 组卡序列：同组首个决定卡位与首屏选中色，
  // 色卡变体取全量在售候选中该组全部颜色（不受打分序列裁剪影响）
  const collapseToGroupCards = (cards: V2CardProduct[], limit: number): GroupCard[] => {
    const seen = new Set<string>();
    const out: GroupCard[] = [];
    for (const c of cards) {
      const key = groupKeyOfCard(c);
      if (seen.has(key)) continue;
      seen.add(key);
      const g = buildGroupCardsFromCards(cardsByGroup.get(key) ?? [c])[0];
      out.push(c.familyColor ? { ...g, initialColor: c.familyColor } : g);
      if (out.length >= limit) break;
    }
    return out;
  };

  // SSR / 首帧用 Best Sellers 兜底，挂载后如有浏览历史则换成个性化推荐
  const [cards, setCards] = useState<GroupCard[]>(() =>
    collapseToGroupCards(fallback, MAX_ITEMS)
  );
  const [personalized, setPersonalized] = useState(false);

  useEffect(() => {
    const handles = getRecentlyViewed().slice(0, HISTORY_DEPTH);
    if (handles.length === 0) return;
    const viewed = handles
      .map((h) => candidates[h])
      .filter(Boolean) as RecommendedCandidate[];
    if (viewed.length === 0) return;

    const viewedIds = new Set(viewed.map((v) => v.card.id));
    const seen = new Set<string>();
    const scored = Object.values(candidates)
      .filter((t) => !viewedIds.has(t.card.id))
      .filter((t) => {
        const key = titleKey(t.card.title);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((t) => {
        let score = 0;
        viewed.forEach((v, idx) => {
          const w = HISTORY_DEPTH - idx;
          if (t.category === v.category) score += 3 * w;
          if (t.color && t.color === v.color) score += 2 * w;
          if (t.scene && t.scene === v.scene) score += 1 * w;
        });
        return { t, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    // 打分后按组 key 合并同组（同组只留最高分成员决定卡位），再取前 10 个组
    const groupCards = collapseToGroupCards(
      scored.map((s) => s.t.card),
      MAX_ITEMS
    );
    if (groupCards.length > 0) {
      setCards(groupCards);
      setPersonalized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates, cardsByGroup]);

  // 产品横滑轨道：触摸滑动 + 鼠标拖拽（同 Shop by Category，无翻页箭头）
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, scrollLeft: 0, dragging: false, moved: false, captured: false });
  const [dragging, setDragging] = useState(false);

  // pointer capture 推迟到拖动超阈值才启用：pointerdown 就 capture 会把 click 重定向到轨道，吞掉卡片跳转
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const track = trackRef.current;
    if (!track) return;
    e.preventDefault();
    dragState.current = { startX: e.clientX, scrollLeft: track.scrollLeft, dragging: true, moved: false, captured: false };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const state = dragState.current;
    const track = trackRef.current;
    if (!state.dragging || !track) return;
    const delta = e.clientX - state.startX;
    if (Math.abs(delta) > 5) {
      state.moved = true;
      if (!state.captured) {
        track.setPointerCapture(e.pointerId);
        state.captured = true;
      }
    }
    track.scrollLeft = state.scrollLeft - delta;
  };
  const endDrag = () => {
    dragState.current.dragging = false;
    setDragging(false);
  };
  // 拖拽后抑制误触点击
  const onClickCapture = (e: React.SyntheticEvent) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragState.current.moved = false;
    }
  };

  if (cards.length === 0) return null;

  return (
    <section className="pt-6 lg:pt-24 pb-16 lg:pb-24">
      <div>
        <div className="px-6 lg:px-10 mb-10 lg:mb-12">
          <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
            {personalized ? 'Based on Your Browsing' : 'Customer Favorites'}
          </p>
          {/* 2026-09 用户定：标题改 Recently Viewed；无浏览历史的新客显示的是 fallback 推荐，
              不能叫 Recently Viewed，回退为 You May Also Like */}
          <h2 className="text-2xl lg:text-5xl font-extrabold tracking-tight text-charcoal">
            {personalized ? 'Recently Viewed' : 'You May Also Like'}
          </h2>
        </div>

        {/* 产品区：单行可横滑（触摸滑动 + 鼠标拖拽，同 Shop by Category，无箭头）。
            左缘缝隙用外层 padding 实现：padding 放在滚动容器上会被 scroll-snap 视为可滚动内容，加载时首卡自动吸附回 x=0，缝隙被吃掉 */}
        <div className="pl-6 lg:pl-10">
          <div
            ref={trackRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onClickCapture={onClickCapture}
            className={`flex gap-5 lg:gap-6 overflow-x-auto pb-2 pr-6 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
              dragging ? 'cursor-grabbing snap-none' : 'snap-x snap-mandatory cursor-grab'
            }`}
          >
            {cards.map((card) => (
              <div
                key={card.key}
                className="w-[56vw] sm:w-[42vw] lg:w-[min(25vw,440px)] flex-shrink-0 snap-start"
              >
                <GroupProductCard card={card} />
              </div>
            ))}
          </div>
        </div>

        {/* 底部 View More 描边按钮（与 Shop by Category 按钮同款） */}
        <div className="mt-10 lg:mt-12 text-center">
          <a
            href={v2url('/categories/')}
            className="inline-block px-7 py-3 rounded-full border-2 border-brand text-brand text-xs lg:px-9 lg:py-3.5 lg:text-sm font-semibold tracking-wide uppercase transition hover:bg-brand hover:text-cream"
          >
            View More
          </a>
        </div>
      </div>
    </section>
  );
}
