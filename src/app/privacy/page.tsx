import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Makimoo collects, uses, and protects your personal information when you shop with us.',
};

export default function PrivacyPage() {
  return (
    <div className="px-6 lg:px-10 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#8B5A2B] mb-2">Your Privacy Matters</p>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-[#333] mb-4">Privacy Policy</h1>
          <p className="text-sm text-[#888]">Last Updated: May 2026</p>
        </div>

        {/* Intro */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <p className="text-[#555] leading-relaxed mb-4">
            At Makimoo (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and protect your information when you visit our website makimoohome.com (the &ldquo;Site&rdquo;) and purchase our home goods products.
          </p>
          <p className="text-[#555] leading-relaxed">
            By accessing or using our Site, you agree to the practices described in this Privacy Policy. If you do not agree, please discontinue your use of the Site.
          </p>
        </div>

        {/* Section 1 */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
            <h2 className="text-xl font-bold text-[#333]">Information We Collect</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
            <p className="text-[#555]">We collect information in the following ways:</p>

            {/* 1A */}
            <div>
              <h3 className="text-base font-bold text-[#333] mb-3">A. Information You Provide Directly</h3>
              <div className="space-y-3">
                {[
                  { label: 'Purchase Information', desc: 'When you make a purchase, we collect your name, billing address, shipping address, email address, and phone number.' },
                  { label: 'Payment Information', desc: 'We collect your credit card number or other payment details. We do not store your full credit card information on our servers; it is processed securely by our third-party payment processors.' },
                  { label: 'Account Information', desc: 'If you create an account, we collect your username, password, and account preferences.' },
                  { label: 'Customer Service Communications', desc: 'If you contact us for support or returns, we collect the information you provide, such as order numbers, photos of products, and correspondence.' },
                ].map((item) => (
                  <div key={item.label}>
                    <span className="text-[#8B5A2B] font-semibold">{item.label}: </span>
                    <span className="text-[#555]">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 1B */}
            <div>
              <h3 className="text-base font-bold text-[#333] mb-3">B. Information Collected Automatically</h3>
              <p className="text-[#555] mb-2">When you browse our Site, we automatically collect certain information about your device and usage, including:</p>
              <ul className="space-y-1.5">
                {[
                  'IP address',
                  'Browser type and version',
                  'Operating system',
                  'Pages viewed, time spent on pages, and links clicked',
                  'Referring website addresses',
                  'Geographic location (country/state level)',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#8B5A2B] font-bold text-sm mt-0.5">•</span>
                    <span className="text-[#555]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 1C */}
            <div>
              <h3 className="text-base font-bold text-[#333] mb-2">C. Information from Cookies and Tracking Technologies</h3>
              <p className="text-[#555]">
                We use cookies, web beacons, and similar tracking technologies to collect the information listed above. Cookies are small text files stored on your device that help us improve the Site and personalize your experience.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
            <h2 className="text-xl font-bold text-[#333]">How We Use Your Information</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-[#555] mb-4">We use the information we collect for the following purposes:</p>
            <ul className="space-y-3">
              {[
                { title: 'To Process and Fulfill Orders', desc: 'Including processing payments, calculating shipping costs, and delivering your home goods to your address.' },
                { title: 'To Manage Returns', desc: 'Facilitating our 30-day return process and generating free return shipping labels.' },
                { title: 'To Communicate With You', desc: 'Sending order confirmations, shipping updates, and customer support responses.' },
                { title: 'For Marketing', desc: 'Sending promotional emails, newsletters, and special offers (only if you have opted in).' },
                { title: 'To Improve Our Site and Services', desc: 'Analyzing usage trends, debugging technical issues, and personalizing your shopping experience.' },
                { title: 'For Fraud Prevention and Security', desc: 'Detecting and preventing fraudulent transactions and protecting the security of our Site.' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#8B5A2B] font-bold">✓</span>
                  <span className="text-[#555]"><strong className="text-[#333]">{item.title}:</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
            <h2 className="text-xl font-bold text-[#333]">How We Share Your Information</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-5">
            <p className="text-[#555]">We do <strong>not sell</strong> your personal information to third parties. We may share your information only in the following circumstances:</p>

            <div>
              <h3 className="text-base font-bold text-[#333] mb-2">Service Providers</h3>
              <p className="text-[#555] mb-2">We share information with trusted third-party companies that help us operate our business, such as:</p>
              <ul className="space-y-1.5">
                {[
                  { label: 'E-commerce Platform', desc: 'Shopify (to host our Site and process orders).' },
                  { label: 'Payment Gateways', desc: 'Stripe, PayPal, etc. (to securely process payments).' },
                  { label: 'Shipping Carriers', desc: 'UPS, FedEx, USPS (to print labels and deliver your packages).' },
                  { label: 'Marketing & Analytics', desc: 'Google Analytics, email marketing platforms (to analyze traffic and send emails).' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#8B5A2B] font-bold text-sm mt-0.5">•</span>
                    <span className="text-[#555]"><strong className="text-[#333]">{item.label}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#333] mb-2">Legal Requirements</h3>
              <p className="text-[#555]">We may disclose your information if required to do so by law, in response to a subpoena, court order, or other lawful request by a governmental authority.</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#333] mb-2">Business Transfers</h3>
              <p className="text-[#555]">If Makimoo is involved in a merger, acquisition, or sale of assets, your personal information may be transferred as part of that transaction.</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#333] mb-2">To Protect Our Rights</h3>
              <p className="text-[#555]">We may share information to enforce our terms of service, protect our rights, property, or safety, or that of our customers and others.</p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-sm shrink-0">4</div>
            <h2 className="text-xl font-bold text-[#333]">Your Privacy Rights (U.S. Residents)</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-5">
            <p className="text-[#555]">Depending on your state of residence, you may have specific rights regarding your personal information.</p>

            <div className="bg-[#F8F5F0] rounded-xl p-5">
              <h3 className="text-base font-bold text-[#333] mb-3">California Residents (CCPA)</h3>
              <p className="text-[#555] mb-3">If you are a California resident, you have the right to:</p>
              <ul className="space-y-2">
                {[
                  { title: 'Know', desc: 'Request to know what personal information we have collected about you in the past 12 months.' },
                  { title: 'Delete', desc: 'Request that we delete your personal information (with certain exceptions).' },
                  { title: 'Opt-Out of Sale/Sharing', desc: 'We do not sell your personal information. We also do not share your personal information for cross-context behavioral advertising. Therefore, no opt-out is necessary.' },
                  { title: 'Non-Discrimination', desc: 'We will not discriminate against you for exercising your CCPA rights.' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#8B5A2B] font-bold text-sm mt-0.5">•</span>
                    <span className="text-[#555]"><strong className="text-[#333]">{item.title}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#333] mb-2">Other State Laws</h3>
              <p className="text-[#555]">Residents of other U.S. states may have similar rights to access, correct, or delete their personal data. We will respond to all verifiable requests in accordance with applicable state laws.</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#333] mb-2">How to Exercise Your Rights</h3>
              <p className="text-[#555]">
                To submit a privacy rights request, please email us at{' '}
                <a href="mailto:privacy@makimoohome.com" className="text-[#8B5A2B] font-medium hover:underline">
                  privacy@makimoohome.com
                </a>
                . We will respond to your request within 45 days, as required by law.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-sm shrink-0">5</div>
            <h2 className="text-xl font-bold text-[#333]">Email Marketing (CAN-SPAM Compliance)</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-4">
            <p className="text-[#555]">If you opt in to receive our marketing emails, you consent to receive promotional communications from Makimoo. You can opt out at any time by:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="text-[#8B5A2B] font-bold">✓</span>
                <span className="text-[#555]">Clicking the &ldquo;Unsubscribe&rdquo; link at the bottom of any marketing email.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#8B5A2B] font-bold">✓</span>
                <span className="text-[#555]">Contacting us directly at <a href="mailto:support@makimoohome.com" className="text-[#8B5A2B] font-medium hover:underline">support@makimoohome.com</a>.</span>
              </li>
            </ul>
            <p className="text-[#555]">We honor all opt-out requests within 10 business days.</p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-sm shrink-0">6</div>
            <h2 className="text-xl font-bold text-[#333]">Cookies and Do Not Track Signals</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-4">
            <p className="text-[#555]">Most web browsers are set to accept cookies by default. You can usually configure your browser settings to remove or reject cookies. However, if you disable cookies, some features of our Site may not function properly.</p>
            <p className="text-[#555]">Some browsers offer a &ldquo;Do Not Track&rdquo; (DNT) feature. Because there is currently no industry standard for how to respond to DNT signals, our Site does not currently respond to them.</p>
          </div>
        </section>

        {/* Section 7 */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-sm shrink-0">7</div>
            <h2 className="text-xl font-bold text-[#333]">Data Security</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-[#555]">
              We implement industry-standard administrative, technical, and physical security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. This includes using SSL encryption on our Site to protect data in transit. However, no method of internet transmission or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-sm shrink-0">8</div>
            <h2 className="text-xl font-bold text-[#333]">Children&apos;s Privacy (COPPA)</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-4">
            <p className="text-[#555]">Our Site and products are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13.</p>
            <p className="text-[#555]">If we become aware that we have inadvertently collected information from a child under 13, we will take steps to delete that information immediately. If you believe we have collected information from a child, please contact us.</p>
          </div>
        </section>

        {/* Section 9 */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-sm shrink-0">9</div>
            <h2 className="text-xl font-bold text-[#333]">Third-Party Links</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-[#555]">
              Our Site may contain links to third-party websites (e.g., social media pages, partner sites). We are not responsible for the privacy practices or the content of these third-party sites. We encourage you to review the privacy policies of any third-party site you visit.
            </p>
          </div>
        </section>

        {/* Section 10 */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-sm shrink-0">10</div>
            <h2 className="text-xl font-bold text-[#333]">Changes to This Privacy Policy</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-[#555]">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will post the updated policy on this page and update the &ldquo;Last Updated&rdquo; date at the top. Your continued use of the Site after any changes constitutes your acceptance of the updated policy.
            </p>
          </div>
        </section>

        {/* Section 11 */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-sm shrink-0">11</div>
            <h2 className="text-xl font-bold text-[#333]">Contact Us</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-[#555] mb-4">If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
            <div className="space-y-2">
              <p className="text-[#333] font-semibold">Makimoo</p>
              <p className="text-[#555]">
                Email: <a href="mailto:privacy@makimoohome.com" className="text-[#8B5A2B] font-medium hover:underline">privacy@makimoohome.com</a>
              </p>
              <p className="text-[#555]">
                Customer Support: <a href="mailto:support@makimoohome.com" className="text-[#8B5A2B] font-medium hover:underline">support@makimoohome.com</a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
