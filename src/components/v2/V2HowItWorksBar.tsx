import { Fragment } from 'react';
import { v2url } from '@/lib/v2paths';

/**
 * V2HowItWorksBar —— 紧贴 hero 的流程说明条（2026-11-28 用户定，仿 Parachute 促销条手法，
 * /drop-home 试验页专用）。单行连贯横条：标签 + 3 个顺序步骤 + 箭头；
 * 末尾 "Learn more →" 提示整条可点，进 /pre-order/ 详情页。
 * v3（同日用户定）：恢复单行布局（撤掉 Why 两行版）；条高在原始 py-3/lg:py-3.5 基础上 +20%
 * （py-3.5/lg:py-4）；保留 -mt-px 移动端缝隙修复。
 * 底色 charcoal 深炭，与上方米色 hero 形成编辑感对比。
 * 此条取代了原 V2HowItWorks 卡片区在 /drop-home 的位置（组件保留，未删）。
 */

const STEPS = ['You pre-order', 'We make your batch', 'Ships in ~5 weeks'];

export default function V2HowItWorksBar() {
  return (
    // 移动端 -mt-px 向上叠 1px：盖住 hero 底边因小数像素渲染漏出的米色细线（2026-11-28 用户反馈）
    <section aria-label="How Makimoo works" className="relative -mt-px lg:mt-0 bg-charcoal text-cream">
      <a href={v2url('/pre-order/')} className="group block">
        <div className="flex items-center gap-3 lg:gap-4 overflow-x-auto whitespace-nowrap px-6 lg:px-10 py-3.5 lg:py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:justify-center">
          <span className="shrink-0 text-[10px] lg:text-xs font-semibold tracking-[0.25em] uppercase text-cream/60">
            How Makimoo Works
          </span>
          {STEPS.map((s, i) => (
            <Fragment key={s}>
              {i === 0 && <span aria-hidden="true" className="shrink-0 text-cream/40 text-xs">·</span>}
              {i > 0 && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="shrink-0 text-cream/50"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              )}
              <span className="shrink-0 text-[11px] lg:text-sm font-semibold text-cream transition-colors group-hover:text-white">
                {s}
              </span>
            </Fragment>
          ))}
          {/* 可点击提示：进入 /pre-order/ 详情页（2026-11-28 用户定） */}
          <span aria-hidden="true" className="shrink-0 text-cream/40 text-xs">·</span>
          <span className="shrink-0 text-[11px] lg:text-sm font-semibold text-cream/85 underline underline-offset-4 decoration-cream/40 transition-colors group-hover:text-white group-hover:decoration-cream">
            Learn more →
          </span>
        </div>
      </a>
    </section>
  );
}
