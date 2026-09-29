'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  // PDP 上智能导购气泡抬高到底部 7rem（给吸底加购条让位），回顶按钮再叠到气泡上方，
  // 两者不再重叠（2026-09-29 用户反馈）
  const isPDP = pathname?.includes('/products/');

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`fixed right-6 ${
        isPDP
          ? 'bottom-[calc(11.5rem+env(safe-area-inset-bottom))]'
          : 'bottom-[calc(6rem+env(safe-area-inset-bottom))]'
      } z-[1000] w-11 h-11 rounded-full text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ backgroundColor: '#8B5A2B' }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
