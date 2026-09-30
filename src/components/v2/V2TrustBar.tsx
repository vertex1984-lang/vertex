/**
 * 首页信任条：紧贴 Hero 下方的一条窄带，只放真实可兑现的信任信息。
 * 2026-09-30（用户定）：版式改为与 /about/ 数据条同款的四格"大数字 + 标签"，
 * 但字号与行距全面收窄——全端 4 格单行排列（移动端不做 2×2，高度才能压到最低），
 * 移动端数字 lg、桌面 3xl（about 页是 3xl/5xl），上下 padding 约是 about 页的一半。
 * 数据口径与 about 页数据条一致（src/app/(v2)/about/page.tsx STATS），改动需两边同步。
 * 服务端组件，无交互。
 */

const STATS = [
  { figure: '500K+', label: 'Items Sold Every Year' },
  { figure: '10+', label: 'Years in Home Textiles' },
  { figure: '20K+', label: 'Product Reviews on Amazon' },
  { figure: 'Millions', label: 'Customers Worldwide' },
];

export default function V2TrustBar() {
  return (
    <section className="bg-[#F5F0E9] border-y border-[#E8E2DA]">
      <div className="max-w-[1400px] lg:w-[80%] lg:max-w-none mx-auto px-6 py-4 lg:py-6">
        {/* 桌面端限宽向中间集中（2026-09-30 用户定：四格在 80% 宽容器里分得太散） */}
        <div className="grid grid-cols-4 gap-2 lg:gap-6 text-center mx-auto lg:max-w-[900px]">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-lg lg:text-3xl font-extrabold tracking-tight text-brand mb-1">{s.figure}</p>
              <p className="text-[8px] lg:text-[10px] font-semibold uppercase tracking-[0.1em] lg:tracking-[0.15em] leading-snug text-charcoal-light">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
