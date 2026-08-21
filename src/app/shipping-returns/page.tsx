import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description: 'Free shipping on all orders and an extended 30-day worry-free return policy at Makimoo.',
};

export default function ShippingReturnPage() {
  return (
    <div className="px-6 lg:px-10 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#8B5A2B] mb-2">Our Policies</p>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-[#333] mb-4">Shipping & Return Policy</h1>
          <p className="text-lg text-[#555] max-w-2xl mx-auto">
            At Makimoo, we want you to absolutely love your new home essentials. If things don&apos;t quite work out, we&apos;re here to help make the process as seamless as possible.
          </p>
        </div>

        {/* Shipping Policy */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8B5A2B]/10 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5A2B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#333]">Shipping Policy</h2>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#333] mb-2">Free U.S. Shipping on All Orders</h3>
              <p className="text-[#555] leading-relaxed">
                We are proud to offer free standard shipping on every order, with no minimum purchase required.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-[#8B5A2B] font-bold shrink-0">Domestic Shipping:</span>
                <span className="text-[#555]">Currently, Makimoo ships exclusively within the contiguous United States. We do not ship to Alaska, Hawaii, U.S. Territories, or APO/FPO addresses at this time.</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#8B5A2B] font-bold shrink-0">Processing Time:</span>
                <span className="text-[#555]">Orders are typically processed and shipped within 1–3 business days.</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#8B5A2B] font-bold shrink-0">Standard Shipping:</span>
                <span className="text-[#555]">5–7 business days.</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#8B5A2B] font-bold shrink-0">Oversized/Heavy Items:</span>
                <span className="text-[#555]">For large furniture or heavy home goods, shipping times and carriers may vary. You will receive specific tracking details once the item leaves our warehouse.</span>
              </div>
            </div>

            <div className="border-t border-[#E8E2DA] pt-5">
              <h3 className="text-lg font-bold text-[#333] mb-2">Order Tracking</h3>
              <p className="text-[#555] leading-relaxed">
                Once your order has shipped, you will receive a confirmation email with a tracking number. Please allow up to 24 hours for the tracking information to update.
              </p>
            </div>
          </div>
        </section>

        {/* Return Policy */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8B5A2B]/10 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5A2B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#333]">Return Policy</h2>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#333] mb-2">30-Day Returns</h3>
              <p className="text-[#555] leading-relaxed">
                We stand by the quality of our products. If you are not completely satisfied with your purchase, you may return eligible items within 30 days of delivery for a full refund.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#333] mb-2">Return Conditions</h4>
              <p className="text-[#555] leading-relaxed mb-2">
                To be eligible for a return, items must be in their original condition: unused, unwashed, unassembled.
              </p>
              <div className="bg-[#F8F5F0] rounded-xl p-4 text-sm text-[#555] italic leading-relaxed">
                <strong className="text-[#8B5A2B] not-italic">Note for Home Goods/Furniture:</strong> Please do not assemble or heavily handle items if you intend to return them. Items that show signs of use, assembly, pet hair, odors, or missing original packaging will not qualify for a refund.
              </div>
            </div>

            <div className="border-t border-[#E8E2DA] pt-5">
              <h4 className="font-semibold text-[#333] mb-2">Non-Returnable Items</h4>
              <p className="text-[#555] mb-3">For hygiene and safety reasons, the following items cannot be returned:</p>
              <ul className="space-y-2">
                {[
                  'Customized or personalized items (e.g., monogrammed pillows, made-to-order furniture)',
                  'Bedding, mattress toppers, and intimate items once used',
                  'Items that have been assembled, used, or washed',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#8B5A2B] font-bold text-sm mt-0.5">✕</span>
                    <span className="text-[#555]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Refunds & Return Shipping */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8B5A2B]/10 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5A2B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#333]">Refunds & Return Shipping</h2>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#333] mb-2">Free Return Shipping Labels</h3>
              <p className="text-[#555] leading-relaxed mb-3">
                At Makimoo, we want returns to be hassle-free. We provide a free prepaid return shipping label for all eligible returns. There are no restocking fees, and return shipping costs are completely covered by us.
              </p>
              <div className="space-y-2 text-sm text-[#555]">
                <p className="italic">If you choose to use your own shipping carrier instead of our provided label, return shipping costs will be your responsibility.</p>
                <p><strong className="text-[#8B5A2B]">Refund Amount:</strong> Your refund will be issued to your original payment method for the full purchase price of the item.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Initiate a Return */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8B5A2B]/10 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5A2B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#333]">How to Initiate a Return</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Contact Us',
                desc: 'Email our support team at support@makimoo.com with your order number and the item(s) you wish to return.',
              },
              {
                step: 2,
                title: 'Get Your Label',
                desc: 'Our team will review your request and send you a Return Merchandise Authorization (RMA) number along with your free prepaid return shipping label.',
              },
              {
                step: 3,
                title: 'Ship It Back',
                desc: 'Securely pack the item in its original packaging, attach the shipping label, and drop it off at the designated carrier location. Do not send packages back without an RMA number, as they will be refused.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-[#333] mb-1">{item.title}</h3>
                  <p className="text-[#555] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Refund Processing */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8B5A2B]/10 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5A2B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#333]">Refund Processing</h2>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-4">
            <p className="text-[#555] leading-relaxed">
              Once we receive your returned item at our warehouse, our team will inspect it to ensure it meets the return criteria.
            </p>
            <ul className="space-y-3">
              {[
                'If approved, your refund will be processed to your original payment method within 5–7 business days.',
                'Please allow an additional billing cycle for the refund to appear on your bank or credit card statement.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#8B5A2B] font-bold">✓</span>
                  <span className="text-[#555]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Damaged or Defective Items */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8B5A2B]/10 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5A2B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#333]">Damaged or Defective Items?</h2>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-[#555] leading-relaxed mb-4">
              If your item arrives damaged or defective, please contact us at{' '}
              <a href="mailto:support@makimoo.com" className="text-[#8B5A2B] font-medium hover:underline">
                support@makimoo.com
              </a>{' '}
              within 48 hours of delivery. Please include photos of the damaged product and the packaging so we can resolve the issue immediately with a replacement or full refund.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="text-center text-sm text-[#888] italic">
          Makimoo reserves the right to update this policy at any time. All returns are subject to verification and final approval by our warehouse team.
        </div>
      </div>
    </div>
  );
}
