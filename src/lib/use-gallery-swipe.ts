/**
 * PDP 主图滑动切图 hook（两版详情页共用）。
 * - 横向位移 ≥50px 且大于纵向位移 → 触发上一张/下一张（循环）
 * - 上下滑动不拦截（配合容器 touch-pan-y，垂直滚动仍归页面）
 * - 滑动后吞掉紧跟的合成 click：避免横滑被误判为"点击打开灯箱"；
 *   未触发 click 时标记会在下一次 touchstart 重置，不会吞掉后续正常点击
 * 回调经 ref 中转，组件每次渲染传新闭包也无妨（不会重置触摸状态）。
 */
import { useCallback, useRef } from 'react';

const THRESHOLD = 50;

export function useGallerySwipe(onPrev: () => void, onNext: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const cbs = useRef({ onPrev, onNext });
  cbs.current = { onPrev, onNext };

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    swiped.current = false;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const s = start.current;
    if (!s) return;
    const dx = e.changedTouches[0].clientX - s.x;
    const dy = e.changedTouches[0].clientY - s.y;
    start.current = null;
    if (Math.abs(dx) >= THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      swiped.current = true;
      if (dx < 0) cbs.current.onNext(); else cbs.current.onPrev();
    }
  }, []);

  /** onClick 守卫：刚发生过滑动时返回 true（组件据此跳过本次点击逻辑） */
  const wasSwiped = useCallback(() => {
    if (swiped.current) {
      swiped.current = false;
      return true;
    }
    return false;
  }, []);

  return { onTouchStart, onTouchEnd, wasSwiped };
}
