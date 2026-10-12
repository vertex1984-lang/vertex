/**
 * 星级显示（半星能力）：2026-10-10 领导定，≥4.3 显示四星半。
 * r2 = round(avg*2)/2（4.3→4.5、4.1/4.2→4.0、4.8→5.0）；数字精确一位小数由调用方渲染。
 * 纯组件（无 'use client'），服务器/客户端组件均可用；半星 = 空星底 + clipPath 左半填充。
 */
export default function StarDisplay({
  rating,
  size = 18,
  className = 'text-brand',
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const r2 = Math.round(rating * 2) / 2;
  const floor = Math.floor(r2);
  return (
    <span className={`flex ${className}`} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => {
        const full = i <= floor;
        const half = !full && r2 - floor === 0.5 && i === floor + 1;
        return (
          <span key={i} className="relative inline-block flex-shrink-0" style={{ width: size, height: size }}>
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="absolute inset-0"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {(full || half) && (
              <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="currentColor"
                className="absolute inset-0"
                style={half ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
          </span>
        );
      })}
    </span>
  );
}
