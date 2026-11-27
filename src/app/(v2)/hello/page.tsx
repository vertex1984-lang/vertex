import type { Metadata } from 'next';

/**
 * /hello — 包裹感谢卡扫码落地页（2026-11-27 用户定方案 v2，按感谢卡规格单 v6 修订）：
 * 定位是感谢卡的"数字延续"——语气与卡片一致：服务在前、克制、全页无促销。
 * 结构：问候（续写卡片背面的信）→ 三个动作卡（Track / Care / Write to us）→
 * UGC 区（与卡片正面 CTA 逐字一致 + 三个社媒按钮）→ 洗护指南手风琴 → 落款细线。
 * 100% 手机扫码场景：单栏 max-w-md，无图零 JS（手风琴用原生 details），noindex。
 * 合规红线（规格单）：全页不出现 organic / eco-friendly / bamboo，不写 Made in USA。
 * 注意：社媒按钮上线前需确认账号已开通且有人维护（规格单 02 节）。
 */

export const metadata: Metadata = {
  title: 'Hello',
  description: 'Thank you for letting Makimoo into your home.',
  robots: { index: false, follow: false },
};

const actions = [
  {
    title: 'Track your order',
    desc: 'Shipping status & pre-order updates',
    href: '/account',
    external: false,
    icon: (
      <>
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </>
    ),
  },
  {
    title: 'Care for your piece',
    desc: 'Washing & drying notes',
    href: '#care',
    external: false,
    icon: (
      <>
        <path d="M12 2.7s6.5 7 6.5 11.3a6.5 6.5 0 11-13 0C5.5 9.7 12 2.7 12 2.7z" />
      </>
    ),
  },
  {
    title: 'Write to us',
    desc: 'Anything isn\u2019t right? We answer within 12 hours.',
    href: 'mailto:hello@makimoohome.com',
    external: true,
    icon: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
  },
];

const socials = [
  { name: 'TikTok', handle: '@makimoo', href: 'https://www.tiktok.com/@makimoo' },
  { name: 'Instagram', handle: '@makimoo', href: 'https://www.instagram.com/makimoo' },
  { name: 'Facebook', handle: '/makimoo', href: 'https://www.facebook.com/makimoo' },
];

const careNotes = [
  {
    q: 'Linen',
    a: 'Machine wash cold on a gentle cycle with like colors. Tumble dry low and remove while slightly damp — linen softens with every wash. Do not bleach.',
  },
  {
    q: 'Long-staple cotton',
    a: 'Machine wash cold with like colors. Tumble dry low to keep the sheen; avoid high heat. Do not bleach.',
  },
  {
    q: 'Everyday notes',
    a: 'Wash dark and light colors separately. Skip fabric softener on towels — it coats the fibers and reduces absorbency.',
  },
];

export default function HelloPage() {
  return (
    <section className="bg-off-white">
      <div className="max-w-md mx-auto px-6 py-14 lg:py-20">
        {/* 问候区：续写卡片背面的信；细线元素呼应卡片 0.5pt 细线 */}
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand">Makimoo</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-charcoal">Hello,</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-charcoal-light">
          Thank you for letting Makimoo into your home. We hope this piece brings you comfort, day after day.
        </p>
        <div className="mt-8 w-14 border-t border-charcoal/40" />

        {/* 三个动作卡 */}
        <div className="mt-10 space-y-3">
          {actions.map((a) => (
            <a
              key={a.title}
              href={a.href}
              className="flex items-center gap-4 bg-white border border-warm-gray rounded-2xl p-5 transition hover:border-brand/60"
            >
              <span className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0 text-brand">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {a.icon}
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-[#333]">{a.title}</span>
                <span className="block mt-0.5 text-xs text-charcoal-light">{a.desc}</span>
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-charcoal-light">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </a>
          ))}
        </div>

        {/* UGC 区：与卡片正面 CTA 逐字一致 */}
        <div className="mt-12 text-center">
          <h2 className="text-lg font-extrabold tracking-tight text-charcoal">Share your corner</h2>
          <p className="mt-2 text-sm text-charcoal-light leading-relaxed">
            Tag @makimoo in your photos — we share a few of our favorites every week.
          </p>
          <div className="mt-5 flex justify-center gap-2.5">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-brand/50 text-brand text-xs font-semibold transition hover:bg-brand/5"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>

        {/* 洗护指南（动作卡 2 的锚点） */}
        <div id="care" className="mt-12 scroll-mt-24">
          <h2 className="text-lg font-extrabold tracking-tight text-charcoal">Care for your piece</h2>
          <div className="mt-3 divide-y divide-warm-gray/70 border-t border-b border-warm-gray/70">
            {careNotes.map((c) => (
              <details key={c.q} className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none py-3.5 text-sm font-semibold text-[#333] [&::-webkit-details-marker]:hidden">
                  {c.q}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 ml-4 text-charcoal-light transition-transform group-open:rotate-90">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </summary>
                <p className="pb-4 text-sm text-charcoal-light leading-relaxed">{c.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* 落款：细线 + 规格单落款原句 */}
        <div className="mt-14 text-center">
          <div className="w-14 mx-auto border-t border-charcoal/40" />
          <p className="mt-5 text-xs tracking-[0.2em] uppercase text-charcoal-light">
            Makimoo · Simple Life, Better Comfort.
          </p>
        </div>
      </div>
    </section>
  );
}
