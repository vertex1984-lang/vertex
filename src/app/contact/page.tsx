import Reveal from '@/components/Reveal';

export default function ContactPage() {
  return (
    <div className="px-6 lg:px-10 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#8B5A2B] mb-2">Get in Touch</p>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-[#333] mb-4">Contact Us</h1>
          <p className="text-lg text-[#555] max-w-2xl mx-auto">
            Have a question, need support, or just want to say hello? We&apos;re here for you — reach out and we&apos;ll get back to you as soon as we can.
          </p>
        </div>

        {/* Contact Cards */}
        <Reveal delay={100}>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="w-14 h-14 rounded-full bg-[#8B5A2B]/10 flex items-center justify-center mx-auto mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5A2B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#333] mb-2">Email</h3>
            <a
              href="mailto:Contact@Makimoohome.com"
              className="text-[#8B5A2B] font-medium hover:underline break-all"
            >
              Contact@Makimoohome.com
            </a>
            <p className="text-sm text-[#888] mt-3">
              We will answer your email within 12 hours.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="w-14 h-14 rounded-full bg-[#8B5A2B]/10 flex items-center justify-center mx-auto mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5A2B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#333] mb-2">Address</h3>
            <p className="text-sm text-[#555] leading-relaxed">
              FLAT/RM C 13/F<br />
              HARVARD COMMERCIAL BUILDING<br />
              105-111 THOMSON ROAD<br />
              WAN CHAI, HK
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="w-14 h-14 rounded-full bg-[#8B5A2B]/10 flex items-center justify-center mx-auto mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5A2B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#333] mb-2">Response Time</h3>
            <p className="text-sm text-[#555] leading-relaxed">
              We aim to respond to all inquiries within 12 hours during business days. For order-related questions, please include your order number.
            </p>
          </div>
        </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={150}>
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-[#333] mb-3">We&apos;d Love to Hear From You</h2>
          <p className="text-[#555] max-w-xl mx-auto mb-6">
            Whether it&apos;s product feedback, partnership opportunities, or simply a question about your order — drop us a line and our team will take care of it.
          </p>
          <a
            href="mailto:Contact@Makimoohome.com"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-semibold text-sm transition hover:opacity-90"
            style={{ backgroundColor: '#8B5A2B' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Send Us an Email
          </a>
        </div>
        </Reveal>
      </div>
    </div>
  );
}
