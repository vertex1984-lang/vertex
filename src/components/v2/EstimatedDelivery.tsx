/**
 * 预计送达日期（PDP buy box 用，两版详情页共用）。
 * "Order today, arrives {range}"：按现有 5-10 工作日政策动态计算。
 * 静态导出 HTML 的构建日期会过期，所以日期只在客户端水合后计算填充；
 * 水合前显示传入的 fallback 文案（与现有静态行一致），无空白、无布局跳变。
 * 只跳过周末，不算法定假日（与"5-10 business days"的政策口径一致）。
 */
import { useEffect, useState } from 'react';

const BUSINESS_DAYS_MIN = 5;
const BUSINESS_DAYS_MAX = 10;

function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d;
}

export default function EstimatedDelivery({ fallback }: { fallback: string }) {
  const [range, setRange] = useState<string | null>(null);

  useEffect(() => {
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const a = addBusinessDays(new Date(), BUSINESS_DAYS_MIN);
    const b = addBusinessDays(new Date(), BUSINESS_DAYS_MAX);
    setRange(`${fmt(a)} – ${fmt(b)}`);
  }, []);

  return (
    <span className={range ? 'text-brand font-medium' : undefined}>
      {range ? `Order today, arrives ${range}` : fallback}
    </span>
  );
}
