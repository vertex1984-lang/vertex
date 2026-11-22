'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { clearCustomerToken } from '@/lib/customer';
import { v2url } from '@/lib/v2paths';

/**
 * 账户子导航（批次 2）：概览 / 订单 / 地址簿 / 资料 / 心愿单 + Sign out。
 * 桌面 = 顶部横排 tab；移动端 = 横向滚动 tab（比 bottom sheet 简单可靠，
 * 5 项横滚在 375px 宽度无布局压力）。
 */
const ITEMS = [
  { href: '/account/', label: 'Overview' },
  { href: '/account/orders/', label: 'Orders' },
  { href: '/account/rewards/', label: 'Rewards' },
  { href: '/account/addresses/', label: 'Addresses' },
  { href: '/account/profile/', label: 'Profile' },
  { href: '/account/wishlist/', label: 'Wishlist' },
];

export default function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    clearCustomerToken();
    // 心愿单回到纯本地视图（云合并失效），广播一次让已挂载页面刷新
    window.dispatchEvent(new CustomEvent('makimoo:favorites-updated'));
    router.replace(v2url('/login/?signedOut=1'));
  }

  return (
    <div className="border-b border-warm-gray">
      <nav className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Account">
        {ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/account/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={v2url(item.href)}
              className={`relative whitespace-nowrap px-3.5 py-3 text-sm font-medium transition-colors ${
                active ? 'text-brand' : 'text-charcoal-light hover:text-charcoal'
              }`}
            >
              {item.label}
              <span className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-all ${active ? 'bg-brand' : 'bg-transparent'}`} />
            </Link>
          );
        })}
        <button
          onClick={signOut}
          disabled={signingOut}
          className="ml-auto whitespace-nowrap px-3.5 py-3 text-sm font-medium text-charcoal-light hover:text-red-600 transition disabled:opacity-50"
        >
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </nav>
    </div>
  );
}
