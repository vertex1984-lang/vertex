'use client';

/**
 * 首次到访 PDP 信任卡（2026-09-28 付费落地信任增强 B，两版 PDP 共用）：
 * 付费流量大量是首次到访用户，决策点缺品牌级背书；首访在购买区显示本卡，
 * localStorage 'makimoo:pdp-seen' 标记后不再显示（老客不打扰）。
 * 内容只放真实可兑现信息（平台在售体量 / 年销 50 万件 / 退货承诺 / 配送时效），
 * 不放虚构星级/评价数/媒体 logo。
 * 注意：静态导出站点，首访判断必须在客户端水合后做（useEffect），
 * 服务端 HTML 不含本卡，避免水合不一致；关闭按钮仅隐藏当次。
 */

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'makimoo:pdp-seen';

const POINTS = [
  {
    text: 'A trusted name on major retail platforms',
    icon: (
      <>
        <circle cx="12" cy="9" r="6" />
        <polyline points="8.5 8.8 11 11.3 15.5 6.8" />
        <path d="m8.2 13.9-1.7 7.1 5.5-3 5.5 3-1.7-7.1" />
      </>
    ),
  },
  {
    text: '500K+ items sold a year — and counting',
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <polyline points="8.5 12 11 14.5 15.5 10" />
      </>
    ),
  },
  {
    text: '30-day free returns — we cover return shipping',
    icon: (
      <>
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </>
    ),
  },
  {
    text: 'Free shipping over $49, arrives in 5-10 business days',
    icon: (
      <>
        <path d="M14 17h-9V5h9v12Z" />
        <path d="M14 9h4l3 3v5h-3" />
        <circle cx="8" cy="17.5" r="1.8" />
        <circle cx="17.5" cy="17.5" r="1.8" />
      </>
    ),
  },
];

export default function FirstVisitTrustCard({ className = '' }: { className?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setShow(true);
        localStorage.setItem(STORAGE_KEY, '1');
      }
    } catch {
      // 隐私模式等 localStorage 不可用时：每次到访都视为首访展示（不阻断页面）
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className={`relative rounded-xl border border-warm-gray bg-[#F5F0E9] p-4 ${className}`}>
      <button
        onClick={() => setShow(false)}
        aria-label="Dismiss"
        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-charcoal-light hover:text-charcoal hover:bg-warm-gray/60 transition"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
      <p className="text-[13px] font-bold text-charcoal mb-2.5 pr-8">First time here? Shop with confidence</p>
      <ul className="space-y-2">
        {POINTS.map((p) => (
          <li key={p.text} className="flex items-start gap-2 text-xs text-charcoal-light leading-snug">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="text-brand flex-shrink-0 mt-px"
            >
              {p.icon}
            </svg>
            {p.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
