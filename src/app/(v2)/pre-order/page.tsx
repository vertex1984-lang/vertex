import type { Metadata } from 'next';
import Link from 'next/link';
import V2PageHeader from '@/components/v2/V2PageHeader';
import { PolicyLayout, PolicySection, PolicyContactStrip } from '@/components/Policy';
import { PREORDER_LIMIT_PER_DROP } from '@/data/preorder';

/**
 * 预售规则说明 + FAQ 页（2026-11-27 用户定方案）：
 * 定位是"规则说明书"而非促销落地页——不放产品卡、不放倒计时、不放进度条。
 * 结构：福利条 → 四条规则 → 下单后时间线 → FAQ（两组手风琴）→ 轻量 CTA。
 * 数字口径：限量数读 PREORDER_LIMIT_PER_DROP 常量；30% / 35 天与 PreorderBox、
 * shipping-returns 页文案同源，改规则需三处同步（见 data/preorder.ts 头注）。
 * 入口：仅预售款 PDP 的 PreorderBox 底部链接（2026-11-27 用户定：首页/footer 均不放入口）。
 */

export const metadata: Metadata = {
  title: 'How Pre-Order Works',
  description:
    'Makimoo pre-order rules: exclusive first-drop designs at 30% off, limited to 50 per style, made to order, full refund any time before it ships.',
};

const toc = [
  { id: 'perks', label: 'Why Pre-Order' },
  { id: 'rules', label: 'The Rules' },
  { id: 'timeline', label: 'Your Order Timeline' },
  { id: 'faq', label: 'FAQ' },
];

// 用户定（2026-11-27）四福利：独家新款 / 30% 专属折扣 / 发货前无条件退款 / 超期转 store credit
const perks = [
  {
    title: 'Exclusive first-drop designs',
    desc: 'In-house styles, available here first — before anywhere else.',
  },
  {
    title: '30% pre-order pricing',
    desc: 'An exclusive thank-you for early believers. Styles return to launch price after the drop.',
  },
  {
    title: 'Full refund before it ships',
    desc: 'Change your mind any time before departure — unconditional, no questions asked.',
  },
  {
    title: 'Store credit after departure',
    desc: 'Missed the window? Cancellations after departure convert to store credit.',
  },
];

const rules = [
  {
    title: '30% off, locked at checkout',
    desc: 'You are charged today, and your pre-order price is locked in immediately. When the drop closes, every style returns to its launch price.',
  },
  {
    title: `Limited to ${PREORDER_LIMIT_PER_DROP} per style`,
    desc: 'Each first-drop style is made in a single small batch. When they are gone, they are gone — no restocks of this drop.',
  },
  {
    title: 'Made to order',
    desc: 'Production starts after you order. Every item is made in small batches, inspected, and ships within 35 days.',
  },
  {
    title: 'Free cancellation before it ships',
    desc: 'Cancel any time before your order departs for a full refund. After departure, cancellations convert to store credit.',
  },
];

const timeline = [
  {
    title: 'Order placed',
    desc: 'Your price is locked. Full refund any time before it ships.',
  },
  {
    title: 'Drop closes',
    desc: `When ${PREORDER_LIMIT_PER_DROP} are claimed — or the pre-order window ends.`,
  },
  {
    title: 'Made & inspected',
    desc: 'Small-batch production, inspected and photographed before packing — we email you photos of your freshly finished piece.',
  },
  {
    title: 'On its way to you',
    desc: 'Tracking number by email. Transit takes 2–3 weeks by fast sea freight.',
  },
];

const faqGroups: { title: string; faqs: { q: string; a: string }[] }[] = [
  {
    title: 'Money & cancellation',
    faqs: [
      {
        q: 'When am I charged?',
        a: 'Today, at checkout — your pre-order price is locked in immediately.',
      },
      {
        q: 'Can I cancel?',
        a: 'Yes. Cancel any time before your order ships for a full refund — unconditional, no questions asked. After departure, cancellations convert to store credit.',
      },
      {
        q: 'What if it\u2019s delayed?',
        a: 'We\u2019ll email you the moment the schedule moves, with the choice to wait or receive a full refund.',
      },
      {
        q: 'Is the pre-order price really 30% off?',
        a: 'Yes. It\u2019s measured against the launch price each style returns to after the drop closes.',
      },
    ],
  },
  {
    title: 'Shipping & product',
    faqs: [
      {
        q: 'When will my order arrive?',
        a: 'Each pre-order product page shows the delivery window for that style. Production and inspection take up to 35 days, then transit is 2–3 weeks by fast sea freight.',
      },
      {
        q: 'Why does it take that long?',
        a: 'We don\u2019t hold warehouse stock. Every item is made to order in small batches, then inspected and photographed before packing.',
      },
      {
        q: 'Will it look exactly like the photos?',
        a: 'Every batch is inspected and photographed before packing. Natural fabrics like linen and long-staple cotton have slight texture variation — that\u2019s part of their character.',
      },
      {
        q: 'What if my size or color sells out?',
        a: `Each style is limited to ${PREORDER_LIMIT_PER_DROP}. Once it sells out, the drop closes for that style — join the notify list on the product page for the next batch.`,
      },
    ],
  },
];

export default function PreOrderPolicyPage() {
  return (
    <>
      <V2PageHeader
        crumbs={[{ label: 'Home', href: '/' }, { label: 'How Pre-Order Works' }]}
        title="Pre-order, explained."
        subtitle="How our first drop works — exclusive designs, 30% off, limited to 50 per style, made to order."
      />

      <section className="bg-off-white">
        <div className="max-w-[1400px] lg:max-w-none lg:w-[80%] mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <PolicyLayout toc={toc}>
            {/* 福利条（2026-11-27 用户定四条） */}
            <PolicySection id="perks" title="Why pre-order">
              <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
                {perks.map((p) => (
                  <div key={p.title} className="bg-white border border-warm-gray rounded-xl p-5">
                    <h3 className="font-bold text-[#333] mb-1.5">{p.title}</h3>
                    <p className="text-sm text-[#555] leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </PolicySection>

            {/* 四条规则 */}
            <PolicySection id="rules" title="The rules, in four lines">
              <ol className="space-y-4">
                {rules.map((r, i) => (
                  <li key={r.title} className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-[#333]">{r.title}</h3>
                      <p className="mt-1 text-sm text-[#555] leading-relaxed">{r.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </PolicySection>

            {/* 下单后时间线 */}
            <PolicySection id="timeline" title="What happens after you order">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {timeline.map((t, i) => (
                  <div key={t.title} className="relative bg-white border border-warm-gray rounded-xl p-5">
                    <span className="text-xs font-bold tracking-widest uppercase text-[#8B5A2B]">
                      Step {i + 1}
                    </span>
                    <h3 className="mt-1.5 font-bold text-[#333]">{t.title}</h3>
                    <p className="mt-1 text-sm text-[#555] leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            </PolicySection>

            {/* FAQ：与 PDP PreorderBox mini-FAQ 口径逐字一致 */}
            <PolicySection id="faq" title="Frequently asked questions">
              <div className="space-y-8">
                {faqGroups.map((g) => (
                  <div key={g.title}>
                    <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8B5A2B] mb-2">
                      {g.title}
                    </h3>
                    <div className="divide-y divide-warm-gray/70 border-t border-b border-warm-gray/70">
                      {g.faqs.map((f) => (
                        <details key={f.q} className="group">
                          <summary className="flex items-center justify-between cursor-pointer list-none py-3.5 text-sm font-semibold text-[#333] [&::-webkit-details-marker]:hidden">
                            {f.q}
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                              className="shrink-0 ml-4 text-[#777] transition-transform group-open:rotate-90"
                            >
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </summary>
                          <p className="pb-4 text-sm text-[#555] leading-relaxed max-w-2xl">{f.a}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </PolicySection>

            {/* 轻量 CTA：回首页预售区 */}
            <div className="text-center">
              <Link
                href="/#first-drop"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: '#8B5A2B' }}
              >
                Ready? Shop the first drop →
              </Link>
            </div>

            <PolicyContactStrip />
          </PolicyLayout>
        </div>
      </section>
    </>
  );
}
