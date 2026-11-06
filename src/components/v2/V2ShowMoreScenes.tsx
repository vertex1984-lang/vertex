'use client';

import { useState, type ReactNode } from 'react';

/**
 * V2ShowMoreScenes —— Shop the Look 折叠区（2026-11-07 用户定）：
 * 出镜场景多于首屏 3 个时，第 4~6 个场景仍由服务端渲染为 children 传入本组件，
 * 默认 hidden（display:none）——隐藏期间 lazy 图片完全不加载，客户端 bundle 零增量；
 * 点击 "Show More Scenes (N)" 一次性展开，展开后按钮消失（不做折叠回缩，后续要再加）。
 * 上限口径由父组件保证：最多传入 MAX_SCENES - INITIAL_SCENES = 3 个。
 */
export default function V2ShowMoreScenes({ count, children }: { count: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-warm-gray text-xs lg:text-sm font-medium tracking-widest uppercase text-charcoal-light transition-colors hover:text-brand hover:border-brand"
          >
            Show More Scenes ({count})
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      )}
      <div hidden={!open} className="space-y-8 lg:space-y-10">
        {children}
      </div>
    </>
  );
}
