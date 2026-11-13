'use client';

import { useCustomer } from '@/lib/use-customer';
import ProfileForms from './ProfileForms';

/**
 * /account/profile（批次 2 B3 / 批次 3 任务 1.1 重构）：loading 期间渲染骨架，
 * customerGet 完成后才 mount ProfileForms（初始值直接取 profile）——修复回访输入框空。
 */
export default function AccountProfilePage() {
  const { profile, loading } = useCustomer();

  if (loading || !profile) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-warm-gray rounded w-1/3" />
        <div className="h-32 bg-warm-gray rounded-2xl" />
        <div className="h-32 bg-warm-gray rounded-2xl" />
      </div>
    );
  }

  return <ProfileForms profile={profile} />;
}
