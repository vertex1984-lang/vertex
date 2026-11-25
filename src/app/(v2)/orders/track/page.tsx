import type { Metadata } from 'next';
import OrdersTrackClient from './OrdersTrackClient';

/**
 * 免登录查单页（批次 1）：静态导出 + 纯客户端查询（fetch /data/order-status.json）。
 * 数据由 makimoo-admin 订单台账发布写入（只含邮箱哈希，无明文）。
 */
export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Track your Makimoo order with your order number and email — no account needed.',
};

export default function OrdersTrackPage() {
  return <OrdersTrackClient />;
}
