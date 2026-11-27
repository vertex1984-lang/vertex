'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/dashboard', label: '仪表盘', icon: '📊' },
  { href: '/products', label: '商品管理', icon: '📦' },
  { href: '/preorder', label: '预售管理', icon: '🏷️' },
  { href: '/orders', label: '订单管理', icon: '📋' },
  { href: '/promotions', label: '促销活动', icon: '🎉' },
  { href: '/reviews', label: '评价管理', icon: '⭐' },
  { href: '/rewards', label: '券码发放', icon: '🎟️' },
  { href: '/notifies', label: '到货通知', icon: '🔔' },
  { href: '/wishlist', label: '心愿单选品', icon: '💗' },
  { href: '/changes', label: '变更与发布', icon: '🚀' },
  { href: '/health', label: '数据健康', icon: '🩺' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-white">
        <div className="px-5 py-5">
          <div className="text-lg font-semibold">Makimoo 后台</div>
          <div className="text-xs text-zinc-400">本地演示版</div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  active ? 'bg-brand-50 font-medium text-brand-700' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <span>{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-zinc-200 px-5 py-4">
          <div className="mb-2 text-xs text-zinc-400">admin · 管理员</div>
          <button onClick={logout} className="text-sm text-zinc-500 hover:text-red-600">
            退出登录
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
