/**
 * 首页信任条：紧贴 Hero 下方的一条窄带，只放真实可兑现的信任信息。
 * 2026-09-30（用户定）：版式改为与 /about/ 数据条同款的四格"大数字 + 标签"，
 * 但字号与行距全面收窄——全端 4 格单行排列（移动端不做 2×2，高度才能压到最低），
 * 移动端数字 lg、桌面 3xl（about 页是 3xl/5xl），上下 padding 约是 about 页的一半。
 * 2026-10-02（用户定）：文案替换为用户指定四条（含 Five-Star 星标），
 * 不再与 about 页 STATS 保持同口径（about 页维持原样）。
 * 2026-10-08（ins 版测试副本）：曾压缩为一行小字，用户验收后要求恢复原四格版式。
 * 服务端组件，无交互。
 */

const STATS = [
  { figure: '2 Million+', label: 'Customers Worldwide' },
  // star：星标置于数字前作行首装饰，与数字行高等高（2026-10-02 用户定：全条唯一图形信任符号，要跳出来）
  { figure: '14,000+', label: 'Five-Star Reviews', star: true },
  { figure: '500K+', label: 'Items Sold Every Year' },
  // label 的 \n 仅移动端折行；桌面端 whitespace-normal 一行展示（2026-10-02 用户定）
  { figure: '10+ Years', label: 'In Home\nTextiles' },
];

export default function InsTrustBar() {
  return (
    // ins 版（2026-10-08 用户定）：背景与页面底色一致（off-white）；
    // 分隔线不贯穿屏幕（用户定）——上下各一条居中的短发丝线
    // （移动端左右各缩 48px，桌面端 60% 宽；2026-10-08 用户要求再短一些）
    <section className="bg-off-white">
      <div aria-hidden="true" className="mx-12 lg:mx-auto lg:w-3/5 lg:max-w-[1200px] border-t border-[#EDE6DC]" />
      {/* 上 padding 原值、下 padding 减半（2026-10-02 用户定：与 hero 衔接保持原间距，底部压占屏比） */}
      <div className="max-w-[1400px] lg:w-[80%] lg:max-w-none mx-auto px-6 pt-4 pb-2 lg:pt-6 lg:pb-3">
        {/* 桌面端限宽向中间集中（2026-09-30 用户定：四格在 80% 宽容器里分得太散）；
            四格间 1px 浅棕竖线分隔（2026-10-02 用户定） */}
        <div className="grid grid-cols-4 gap-2 lg:gap-6 text-center mx-auto lg:max-w-[900px] divide-x divide-[#E8D9C8]">
          {STATS.map((s) => (
            <div key={s.label} className="px-1 lg:px-2">
              {/* 移动端数字收窄到 sm（2026-10-07 用户反馈：16px 时 "2 Million+" 比 1/4 格还宽，
                  nowrap 溢出挤压相邻格、视觉不居中；14px 后最长数字也能完整落入格内） */}
              <p className="text-sm lg:text-3xl font-extrabold tracking-tight text-brand mb-1 whitespace-nowrap">
                {s.figure}
              </p>
              {/* 标签区固定行高、垂直居中（2026-10-02 用户定）：移动端最长标签折 3 行
                  （CUSTOMERS SERVED WORLDWIDE），桌面 2 行；短标签对齐到中间高度 */}
              <p className="text-[8px] lg:text-[10px] font-semibold uppercase tracking-[0.1em] lg:tracking-[0.15em] leading-snug text-charcoal-light whitespace-pre-line lg:whitespace-normal min-h-[4.2em] lg:min-h-[2.75em] flex items-center justify-center">
                {/* 星标在标签文字最前，与标签同字号、品牌棕色（2026-10-02 用户定） */}
                {'star' in s && s.star && (
                  <span aria-hidden="true" className="text-brand mr-0.5">★</span>
                )}
                {s.label}
              </p>
            </div>
          ))}
        </div>
        {/* 来源脚注（2026-10-02 用户定）：移动端标签空间不够写 "on Amazon"，
            统一用一行小字注明销量与评价数据来自 Amazon，避免误解为本站评价 */}
        <p className="mt-2 lg:mt-3 text-center text-[9px] lg:text-[10px] tracking-wide text-[#999]">
          Sales &amp; review data from Amazon
        </p>
      </div>
      <div aria-hidden="true" className="mx-12 lg:mx-auto lg:w-3/5 lg:max-w-[1200px] border-b border-[#EDE6DC]" />
    </section>
  );
}
