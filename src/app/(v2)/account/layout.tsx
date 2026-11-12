import type { Metadata } from 'next';
import AccountGuard from '@/components/v2/AccountGuard';
import AccountNav from '@/components/v2/AccountNav';

/**
 * /account/* 布局（批次 2）：AccountGuard 客户端守卫（无 token → /login 回跳）
 * + 账户子导航。V2 Header/Footer 由 (v2) 布局提供。
 */
export const metadata: Metadata = {
  title: 'My Account',
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccountGuard>
      <div className="bg-off-white min-h-screen px-4 lg:px-10 pt-28 lg:pt-36 pb-16 lg:pb-24">
        <div className="mx-auto w-full max-w-4xl">
          <h1 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal mb-4 lg:mb-6">My Account</h1>
          <AccountNav />
          <div className="pt-6 lg:pt-8">{children}</div>
        </div>
      </div>
    </AccountGuard>
  );
}
