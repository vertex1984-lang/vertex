'use client';

/**
 * PDP 预售模块（2026-11-10 预售系统第一批）。
 * 内容：Pre-Order 徽章 + 预售价倒计时（客户端每 30s 刷新；SSG 水合前显示静态截止日，
 * 首帧一致无布局跳变）+ 到货窗口 + 发货前免费取消 + mini FAQ（何时扣款/能否取消/延期怎么办）。
 * 美术：V2 token（brand/cream/warm-gray），与站内信任信息模块同语言。
 * 竞品口径见 data/preorder.ts 头注（UO 交期双展示 / Z Gallerie 日期区间 / FTC 延期通知）。
 */
import { useEffect, useState } from 'react';
import { preorderOf, type PreorderConfig } from '@/data/preorder';

function countdown(deadline: string): string | null {
  const ms = new Date(deadline).getTime() - Date.now();
  if (ms <= 0) return null;
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m`;
}

export default function PreorderBox({ config: c }: { config: PreorderConfig }) {
  const [left, setLeft] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setLeft(countdown(c.deadline));
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, [c.deadline]);

  const faqs: { q: string; a: string }[] = [
    { q: 'When am I charged?', a: 'Today, at checkout — your pre-order price is locked in immediately.' },
    { q: 'Can I cancel?', a: 'Yes. Free cancellation any time before your order departs the port. After departure, cancellations convert to store credit.' },
    { q: 'What if it\u2019s delayed?', a: 'We\u2019ll email you the moment the schedule moves, with the choice to wait or receive a full refund.' },
  ];

  return (
    <div className="rounded-2xl border border-brand/35 bg-brand/5 p-4 lg:p-5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-brand text-cream">
          Pre-Order
        </span>
        <span className="text-xs font-semibold text-brand tabular-nums" aria-live="polite">
          {left ? `Price ends in ${left}` : `Pre-order price ends ${c.deadlineLabel}`}
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold text-charcoal">
        Arrives {c.arrivesLabel}
        <span className="font-normal text-charcoal-light"> · Free cancellation before departure</span>
      </p>
      <p className="mt-1.5 text-xs text-charcoal-light leading-relaxed">{c.reason}</p>
      <div className="mt-3 pt-1 border-t border-brand/20 divide-y divide-brand/15">
        {faqs.map((f) => (
          <details key={f.q} className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none py-2 text-xs font-semibold text-charcoal [&::-webkit-details-marker]:hidden">
              {f.q}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-charcoal-light transition-transform group-open:rotate-90">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </summary>
            <p className="pb-2 text-xs text-charcoal-light leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

/** 购物车行内预售提示（cart 页 + MiniCart 共用）：handle 命中预售配置才渲染，未配置返回 null */
export function PreorderLineNote({ handle, className }: { handle: string; className?: string }) {
  const c = preorderOf(handle);
  if (!c) return null;
  return (
    <p className={className}>
      Pre-Order · Arrives {c.arrivesLabel}
    </p>
  );
}
