import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import V2PageHeader from '@/components/v2/V2PageHeader';
import V2ContactForm from '@/components/v2/V2ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Have a question or need support? Reach out to the Makimoo team — we answer every email within 12 hours.',
};

// 2026-09-30 用户定：删除 Address 卡片，保留 Email 和 Response Time
const CONTACT_INFO = [
  {
    title: 'Email',
    icon: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
    content: (
      <>
        <a href="mailto:support@makimoohome.com" className="text-brand font-medium hover:underline break-all">
          support@makimoohome.com
        </a>
        <p className="text-sm text-charcoal-light mt-1">We will answer your email within 12 hours.</p>
      </>
    ),
  },
  {
    title: 'Response Time',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    content: (
      <p className="text-sm text-charcoal-light leading-relaxed">
        We aim to respond to all inquiries within 12 hours during business days. For order-related questions, please include your order number.
      </p>
    ),
  },
];

export default function V2ContactPage() {
  return (
    <>
      <V2PageHeader
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]}
        title="Get in Touch"
        subtitle="Have a question, need support, or just want to say hello? We're here for you — reach out and we'll get back to you as soon as we can."
      />

      <section className="bg-off-white">
        {/* 2026-09-30 用户定：桌面端 80% 屏宽，表单左、信息卡右两栏排版 */}
        <div className="max-w-[1400px] lg:max-w-none lg:w-[80%] mx-auto px-6 lg:px-10 py-14 lg:py-20">
          <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10 lg:items-start">
            <Reveal>
              <V2ContactForm />
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-8 lg:mt-0 space-y-4">
                {CONTACT_INFO.map((item) => (
                  <div key={item.title} className="bg-cream rounded-2xl border border-warm-gray p-6 flex gap-5">
                    <div className="w-11 h-11 rounded-full bg-off-white flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-brand">
                        {item.icon}
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-charcoal mb-1">{item.title}</h3>
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
