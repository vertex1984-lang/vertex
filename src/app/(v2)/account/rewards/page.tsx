import type { Metadata } from 'next';
import RewardsClient from './RewardsClient';

/** /account/rewards 静态壳（T2 My Rewards；守卫由 account/layout 的 AccountGuard 提供） */
export const metadata: Metadata = {
  title: 'My Rewards',
};

export default function RewardsPage() {
  return <RewardsClient />;
}
