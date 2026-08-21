import React from 'react';
import Reveal from '@/components/Reveal';

/**
 * 政策页统一骨架：Contact / Shipping & Returns / Privacy / Terms 共用
 * - PolicyHeader：居中小标签 + 大标题 + 副标题 + Last Updated 徽章
 * - PolicySection：左侧图标 + 标题 + 白底圆角卡片
 * - PolicyToc：桌面端 sticky 侧栏 / 移动端横向滚动 chip 条
 */

export interface TocItem {
  id: string;
  label: string;
}

export function PolicyHeader({
  eyebrow,
  title,
  subtitle,
  updated,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  updated?: string;
}) {
  return (
    <div className="text-center mb-12 lg:mb-14">
      <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#8B5A2B] mb-3">{eyebrow}</p>
      <h1 className="text-3xl lg:text-5xl font-extrabold text-[#333] mb-4">{title}</h1>
      {subtitle && <p className="text-base lg:text-lg text-[#555] max-w-2xl mx-auto">{subtitle}</p>}
      {updated && (
        <p className="mt-4">
          <span className="inline-block px-3 py-1 text-xs font-medium text-[#8B5A2B] bg-[#8B5A2B]/10 rounded-full">
            Last Updated: {updated}
          </span>
        </p>
      )}
    </div>
  );
}

export function PolicySection({
  id,
  icon,
  index,
  title,
  children,
  className = '',
}: {
  id?: string;
  icon?: React.ReactNode;
  /** 传数字时显示棕色序号圆点（优先级低于 icon） */
  index?: number;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mb-8 scroll-mt-24 ${className}`}>
      <Reveal>
        <div className="flex items-center gap-3 mb-4">
          {icon ? (
            <div className="w-9 h-9 rounded-full bg-[#8B5A2B]/10 flex items-center justify-center shrink-0 text-[#8B5A2B]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {icon}
              </svg>
            </div>
          ) : index !== undefined ? (
            <div className="w-9 h-9 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {index}
            </div>
          ) : null}
          <h2 className="text-xl lg:text-2xl font-bold text-[#333]">{title}</h2>
        </div>
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">{children}</div>
      </Reveal>
    </section>
  );
}

/** 目录：lg 起 sticky 侧栏，移动端横向滚动 chips */
export function PolicyToc({ items }: { items: TocItem[] }) {
  return (
    <>
      {/* 移动端：横向滚动 chip 条 */}
      <nav className="lg:hidden mb-8 -mx-6 px-6 overflow-x-auto" aria-label="Table of contents">
        <div className="flex gap-2 w-max py-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="shrink-0 px-3.5 py-1.5 text-xs font-medium text-[#8B5A2B] bg-white border border-[#E8E2DA] rounded-full hover:bg-[#F8F5F0] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
      {/* 桌面端：sticky 侧栏（由调用方放进 grid 列） */}
      <nav className="hidden lg:block sticky top-24 self-start" aria-label="Table of contents">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8B5A2B] mb-4">On This Page</p>
        <ul className="space-y-1 border-l border-[#E8E2DA]">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="block -ml-px pl-4 py-1.5 text-sm text-[#777] border-l-2 border-transparent hover:text-[#8B5A2B] hover:border-[#8B5A2B] transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

/** 长政策页布局：有目录时移动端 chip 条 + 桌面端左 sticky 侧栏右内容 */
export function PolicyLayout({
  toc,
  children,
}: {
  toc?: TocItem[];
  children: React.ReactNode;
}) {
  if (!toc || toc.length === 0) {
    return <div className="max-w-3xl mx-auto">{children}</div>;
  }
  return (
    <div className="max-w-6xl mx-auto">
      {/* 移动端：横向滚动 chip 条 */}
      <nav className="lg:hidden mb-8 -mx-6 px-6 overflow-x-auto" aria-label="Table of contents">
        <div className="flex gap-2 w-max py-1">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="shrink-0 px-3.5 py-1.5 text-xs font-medium text-[#8B5A2B] bg-white border border-[#E8E2DA] rounded-full hover:bg-[#F8F5F0] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
        {/* 桌面端：sticky 侧栏 */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24" aria-label="Table of contents">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8B5A2B] mb-4">On This Page</p>
            <ul className="space-y-1 border-l border-[#E8E2DA]">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block -ml-px pl-4 py-1.5 text-sm text-[#777] border-l-2 border-transparent hover:text-[#8B5A2B] hover:border-[#8B5A2B] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

/** 页面底部“仍有疑问”联系条 */
export function PolicyContactStrip() {
  return (
    <Reveal>
      <div className="mt-12 bg-[#F8F5F0] border border-[#E8E2DA] rounded-2xl p-8 text-center">
        <h3 className="text-lg font-bold text-[#333] mb-2">Still Have Questions?</h3>
        <p className="text-sm text-[#555] mb-5">
          Our support team answers every email within 12 hours on business days.
        </p>
        <a
          href="mailto:support@makimoohome.com"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: '#8B5A2B' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          support@makimoohome.com
        </a>
      </div>
    </Reveal>
  );
}
