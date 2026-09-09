import type { Metadata } from 'next';
import V2PageHeader from '@/components/v2/V2PageHeader';
import { PolicySection, PolicyLayout, PolicyContactStrip, TocItem } from '@/components/Policy';
import { v2url } from '@/lib/v2paths';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions governing your use of the Makimoo website and purchases of our products.',
};

const TOC: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'online-store-terms', label: 'Online Store Terms' },
  { id: 'general-conditions', label: 'General Conditions' },
  { id: 'accuracy-information', label: 'Accuracy of Information' },
  { id: 'products-pricing-availability', label: 'Products & Pricing' },
  { id: 'billing-account-information', label: 'Billing & Account Info' },
  { id: 'optional-tools', label: 'Optional Tools' },
  { id: 'third-party-links', label: 'Third-Party Links' },
  { id: 'user-comments-feedback-submissions', label: 'User Submissions' },
  { id: 'personal-information', label: 'Personal Information' },
  { id: 'errors-inaccuracies-omissions', label: 'Errors & Omissions' },
  { id: 'prohibited-uses', label: 'Prohibited Uses' },
  { id: 'disclaimer-limitation-liability', label: 'Disclaimer & Liability' },
  { id: 'indemnification', label: 'Indemnification' },
  { id: 'severability', label: 'Severability' },
  { id: 'termination', label: 'Termination' },
  { id: 'entire-agreement', label: 'Entire Agreement' },
  { id: 'governing-law', label: 'Governing Law' },
  { id: 'changes-to-terms', label: 'Changes to Terms' },
  { id: 'contact-information', label: 'Contact Information' },
];

// 内容与 (classic)/terms 完全一致；站内政策链接改写为 v2url
export default function V2TermsPage() {
  return (
    <>
      <V2PageHeader
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Terms of Service' }]}
        title="Terms of Service"
        meta="Last Updated: May 2026"
      />

      <section className="bg-off-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <PolicyLayout toc={TOC}>
            {/* Intro */}
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <p className="text-[#555] leading-relaxed mb-4">
                Welcome to Makimoo (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the makimoohome.com website (the &ldquo;Site&rdquo;) and the services we provide through it (collectively, the &ldquo;Service&rdquo;), including browsing, purchasing home goods, and using any related features or tools.
              </p>
              <p className="text-[#555] leading-relaxed">
                By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, please do not use the Site or the Service.
              </p>
            </div>

            {/* Section 1 */}
            <PolicySection id="overview" index={1} title="Overview">
              <div className="space-y-4">
                <p className="text-[#555]">This Site is operated by Makimoo. Throughout these Terms, &ldquo;we,&rdquo; &ldquo;us,&rdquo; and &ldquo;our&rdquo; refer to Makimoo and its applicable affiliates. The Service includes this Site, all content, tools, and features made available through it, and the home goods products we offer for sale.</p>
                <p className="text-[#555]">By visiting the Site and/or making a purchase, you agree that:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">You will comply with these Terms and all applicable laws.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">You are at least the age of majority in your state of residence.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">If you have minor dependents who use the Site, you are responsible for their activity and have consented to their use.</span>
                  </li>
                </ul>
                <p className="text-[#555]">We reserve the right to update, change, or replace any part of these Terms at any time by posting changes on this page. It is your responsibility to review these Terms periodically. Your continued use of the Site after any changes constitutes your acceptance of the revised Terms.</p>
              </div>
            </PolicySection>

            {/* Section 2 */}
            <PolicySection id="online-store-terms" index={2} title="Online Store Terms">
              <div className="space-y-4">
                <p className="text-[#555]">By using the Service, you represent and warrant that:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">You are at least the age of majority in your state of residence, or you have parental consent to use the Site, and you accept responsibility for any minor dependents who use the Site under your account.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">You will not use the Site or any products for any illegal or unauthorized purpose.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">You will not violate any applicable local, state, national, or international law or regulation (including, without limitation, copyright laws).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">You will not transmit any viruses, malware, or any other code or material that is harmful or destructive.</span>
                  </li>
                </ul>
                <p className="text-[#555]">Any breach of these Terms may result in immediate termination of your access to the Service, at our sole discretion.</p>
              </div>
            </PolicySection>

            {/* Section 3 */}
            <PolicySection id="general-conditions" index={3} title="General Conditions">
              <div className="space-y-4">
                <p className="text-[#555]">We reserve the right to refuse service to anyone, at any time, for any reason.</p>
                <p className="text-[#555]">You acknowledge that transmissions over the internet and across networks are never entirely private or secure. While we take reasonable steps to protect your information, you understand that:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Content (other than payment data) may be transferred unencrypted; and</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Transmissions may be modified to conform to technical requirements of networks or devices.</span>
                  </li>
                </ul>
                <p className="text-[#555]">You may not reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service, or use of the Service, for any commercial purpose without our express written permission.</p>
                <p className="text-[#555]">Section headings are included for convenience only and do not limit or otherwise affect these Terms.</p>
              </div>
            </PolicySection>

            {/* Section 4 */}
            <PolicySection id="accuracy-information" index={4} title="Accuracy, Completeness, and Timeliness of Information">
              <div className="space-y-4">
                <p className="text-[#555]">We strive to provide accurate information on the Site, but we do not guarantee that any content is accurate, complete, or current. The Site is provided for general information only and should not be relied upon as the sole basis for decisions without consulting more authoritative or timely sources.</p>
                <p className="text-[#555]">Historical information on the Site is not current and is provided for reference only.</p>
                <p className="text-[#555]">We may modify the content of the Site at any time without notice, but we have no obligation to update any information.</p>
                <p className="text-[#555]">You agree that it is your responsibility to monitor changes to the Site and these Terms.</p>
              </div>
            </PolicySection>

            {/* Section 5 */}
            <PolicySection id="products-pricing-availability" index={5} title="Products, Pricing, and Availability">
              <div className="space-y-4">
                <p className="text-[#555]">Some products or services may be available exclusively online and may be subject to our <a href={v2url('/shipping-returns/')} className="text-[#8B5A2B] font-medium hover:underline">Return &amp; Refund Policy</a>.</p>
                <p className="text-[#555]">We have made every effort to display product colors and images as accurately as possible, but we cannot guarantee that your monitor&rsquo;s display of any color will be accurate.</p>
                <p className="text-[#555]">We reserve the right, but are not obligated, to:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Limit sales of any product or service to any person, region, or jurisdiction;</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Limit the quantities of any product or service that we offer; and</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Discontinue any product at any time.</span>
                  </li>
                </ul>
                <p className="text-[#555]">All product descriptions, pricing, and availability are subject to change at any time without notice at our sole discretion.</p>
                <p className="text-[#555]">Any offer for any product or service made on the Site is void where prohibited.</p>
              </div>
            </PolicySection>

            {/* Section 6 */}
            <PolicySection id="billing-account-information" index={6} title="Billing and Account Information">
              <div className="space-y-4">
                <p className="text-[#555]">You agree to:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Provide current, complete, and accurate purchase and account information for all orders.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Promptly update your account information (including email address and payment details) so that we can complete transactions and contact you as needed.</span>
                  </li>
                </ul>
                <p className="text-[#555]">We reserve the right to:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Refuse any order you place.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Limit or cancel quantities purchased per person, per household, or per order (including orders placed under the same account, payment method, or billing/shipping address).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Limit or prohibit orders that, in our sole judgment, appear to be placed by dealers, resellers, or distributors.</span>
                  </li>
                </ul>
                <p className="text-[#555]">If we change or cancel an order, we may attempt to notify you using the contact information provided at the time of the order.</p>
                <p className="text-[#555]">For details on returns and refunds, please see our <a href={v2url('/shipping-returns/')} className="text-[#8B5A2B] font-medium hover:underline">Return &amp; Refund Policy</a>.</p>
              </div>
            </PolicySection>

            {/* Section 7 */}
            <PolicySection id="optional-tools" index={7} title="Optional Tools">
              <div className="space-y-4">
                <p className="text-[#555]">We may provide access to third-party tools or features over which we have no control or input. You acknowledge and agree that:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Such tools are provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without any warranties, representations, or conditions of any kind, whether express or implied.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">We do not endorse or assume any responsibility for any third-party tools.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Your use of any optional third-party tools is entirely at your own risk and discretion.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">You should review and understand the terms and privacy practices of any third-party provider before using its tools.</span>
                  </li>
                </ul>
                <p className="text-[#555]">We may also offer new services, features, or tools through the Site in the future. Any such new features will also be subject to these Terms.</p>
              </div>
            </PolicySection>

            {/* Section 8 */}
            <PolicySection id="third-party-links" index={8} title="Third-Party Links">
              <div className="space-y-4">
                <p className="text-[#555]">The Site may contain links to third-party websites or resources that are not owned or controlled by us. You acknowledge and agree that:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">We are not responsible for the content, accuracy, or practices of any third-party sites or resources.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">We do not warrant or assume any liability for any third-party materials, products, or services.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Any transactions or interactions you have with third parties are solely between you and that third party.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Any complaints, claims, or questions regarding third-party products or services should be directed to the relevant third party.</span>
                  </li>
                </ul>
              </div>
            </PolicySection>

            {/* Section 9 */}
            <PolicySection id="user-comments-feedback-submissions" index={9} title="User Comments, Feedback, and Submissions">
              <div className="space-y-4">
                <p className="text-[#555]">If you submit comments, feedback, suggestions, ideas, or other materials (collectively, &ldquo;User Submissions&rdquo;) to us&mdash;whether at our request or unsolicited&mdash;you agree that:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">We may, at any time, without restriction, edit, copy, publish, distribute, translate, and otherwise use in any medium any User Submissions you provide.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">We are under no obligation to keep any User Submissions confidential, pay compensation for any User Submissions, or respond to any User Submissions.</span>
                  </li>
                </ul>
                <p className="text-[#555]">You will not submit any User Submissions that:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold text-sm mt-0.5">•</span>
                    <span className="text-[#555]">Violate any third-party right (including copyright, trademark, privacy, or other proprietary right);</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold text-sm mt-0.5">•</span>
                    <span className="text-[#555]">Are unlawful, libelous, defamatory, obscene, or otherwise objectionable;</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold text-sm mt-0.5">•</span>
                    <span className="text-[#555]">Contain any viruses or other malicious code that could affect the operation of the Site or any related systems.</span>
                  </li>
                </ul>
                <p className="text-[#555]">You are solely responsible for the accuracy and legality of your User Submissions, and we assume no liability for them.</p>
                <p className="text-[#555]">We may, but are not obligated to, monitor or remove content we determine, in our sole discretion, to be unlawful, offensive, or otherwise objectionable or in violation of these Terms.</p>
              </div>
            </PolicySection>

            {/* Section 10 */}
            <PolicySection id="personal-information" index={10} title="Personal Information">
              <p className="text-[#555]">
                Your submission of personal information through the Site is governed by our <a href={v2url('/privacy/')} className="text-[#8B5A2B] font-medium hover:underline">Privacy Policy</a>, which is incorporated into these Terms by reference. Please review our <a href={v2url('/privacy/')} className="text-[#8B5A2B] font-medium hover:underline">Privacy Policy</a> to understand our practices.
              </p>
            </PolicySection>

            {/* Section 11 */}
            <PolicySection id="errors-inaccuracies-omissions" index={11} title="Errors, Inaccuracies, and Omissions">
              <div className="space-y-4">
                <p className="text-[#555]">From time to time, the Site may contain typographical errors, inaccuracies, or omissions relating to product descriptions, pricing, promotions, offers, shipping charges, transit times, or availability. We reserve the right to:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Correct any errors, inaccuracies, or omissions at any time (including after you have submitted an order).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Change or update information on the Site without prior notice.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold">✓</span>
                    <span className="text-[#555]">Cancel orders if any information on the Site is inaccurate, at our sole discretion.</span>
                  </li>
                </ul>
                <p className="text-[#555]">We have no obligation to update, amend, or clarify information on the Site, except as required by law.</p>
              </div>
            </PolicySection>

            {/* Section 12 */}
            <PolicySection id="prohibited-uses" index={12} title="Prohibited Uses">
              <div className="space-y-4">
                <p className="text-[#555]">You are prohibited from using the Site or its content:</p>
                <ul className="space-y-2">
                  {[
                    'For any unlawful purpose;',
                    'To solicit others to perform or participate in any unlawful acts;',
                    'To violate any international, federal, state, or local law or regulation;',
                    'To infringe upon or violate our intellectual property rights or the intellectual property rights of others;',
                    'To harass, abuse, harm, threaten, defame, or otherwise violate the legal rights of others (including rights of privacy and publicity);',
                    'To submit false or misleading information;',
                    'To upload or transmit viruses, malware, or any other malicious code;',
                    'To collect or track the personal information of others without consent;',
                    'To spam, phish, crawl, scrape, or use automated means to access the Site without our prior written consent;',
                    'For any obscene or immoral purpose; or',
                    'To interfere with or circumvent the security features of the Site or any related systems.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#8B5A2B] font-bold text-sm mt-0.5">•</span>
                      <span className="text-[#555]">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[#555]">We reserve the right to terminate your access to the Site for any violation of these prohibited uses, at our sole discretion.</p>
              </div>
            </PolicySection>

            {/* Section 13 */}
            <PolicySection id="disclaimer-limitation-liability" index={13} title="Disclaimer of Warranties; Limitation of Liability">
              <div className="space-y-4">
                <p className="text-[#555]">We do not guarantee, represent, or warrant that:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold text-sm mt-0.5">•</span>
                    <span className="text-[#555]">Your use of the Service will be uninterrupted, timely, secure, or error-free;</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold text-sm mt-0.5">•</span>
                    <span className="text-[#555]">The results obtained from the use of the Service will be accurate or reliable; or</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8B5A2B] font-bold text-sm mt-0.5">•</span>
                    <span className="text-[#555]">Any errors in the Service will be corrected.</span>
                  </li>
                </ul>
                <p className="text-[#555]">You expressly agree that your use of, or inability to use, the Service is at your sole risk. The Service and all products and services provided through the Service are, except as expressly stated by us, provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without any representations, warranties, or conditions of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement.</p>
                <p className="text-[#555]">To the maximum extent permitted by law, in no event shall Makimoo, its directors, officers, employees, affiliates, agents, contractors, licensors, or service providers be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind (including, without limitation, lost profits, lost revenue, lost savings, loss of data, or replacement costs) arising from your use of or inability to use the Service, any products procured through the Service, or any other claim related in any way to your use of the Service or any content or products, even if we have been advised of the possibility of such damages. Because some states or jurisdictions do not allow the exclusion or limitation of liability for consequential or incidental damages, our liability in such jurisdictions shall be limited to the maximum extent permitted by law.</p>
              </div>
            </PolicySection>

            {/* Section 14 */}
            <PolicySection id="indemnification" index={14} title="Indemnification">
              <p className="text-[#555]">You agree to indemnify, defend, and hold harmless Makimoo and its parent, subsidiaries, affiliates, officers, directors, agents, contractors, licensors, and service providers from any claims, demands, damages, losses, costs, or expenses (including reasonable attorneys&rsquo; fees) arising out of or in connection with:</p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-start gap-3">
                  <span className="text-[#8B5A2B] font-bold text-sm mt-0.5">•</span>
                  <span className="text-[#555]">Your breach of these Terms or any documents incorporated by reference;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#8B5A2B] font-bold text-sm mt-0.5">•</span>
                  <span className="text-[#555]">Your violation of any applicable law or regulation; or</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#8B5A2B] font-bold text-sm mt-0.5">•</span>
                  <span className="text-[#555]">Your violation of any rights of a third party.</span>
                </li>
              </ul>
            </PolicySection>

            {/* Section 15 */}
            <PolicySection id="severability" index={15} title="Severability">
              <p className="text-[#555]">If any provision of these Terms is determined to be unlawful, void, or unenforceable, that provision shall be enforced to the maximum extent permitted by law, and the unenforceable portion shall be deemed severed from these Terms. Such determination shall not affect the validity and enforceability of any other remaining provisions.</p>
            </PolicySection>

            {/* Section 16 */}
            <PolicySection id="termination" index={16} title="Termination">
              <div className="space-y-4">
                <p className="text-[#555]">These Terms are effective unless and until terminated by either you or us.</p>
                <p className="text-[#555]">You may terminate these Terms at any time by ceasing to use the Site and, if applicable, notifying us that you no longer wish to use the Service.</p>
                <p className="text-[#555]">We may terminate these Terms at any time, without notice, if we reasonably believe you have failed to comply with any provision of these Terms.</p>
                <p className="text-[#555]">Upon termination, all provisions that by their nature should survive (including, without limitation, disclaimers, limitations of liability, indemnification, and governing law) shall remain in effect.</p>
                <p className="text-[#555]">Termination will not relieve you of any obligations or liabilities that accrued prior to the termination date.</p>
              </div>
            </PolicySection>

            {/* Section 17 */}
            <PolicySection id="entire-agreement" index={17} title="Entire Agreement">
              <div className="space-y-4">
                <p className="text-[#555]">These Terms, together with any policies or operating rules posted by us on the Site, constitute the entire agreement between you and Makimoo relating to the Service and supersede any prior or contemporaneous agreements, communications, and proposals (whether oral or written) between you and us.</p>
                <p className="text-[#555]">The failure of us to exercise or enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. Any ambiguities in the interpretation of these Terms shall not be construed against the drafting party.</p>
              </div>
            </PolicySection>

            {/* Section 18 */}
            <PolicySection id="governing-law" index={18} title="Governing Law">
              <p className="text-[#555]">These Terms and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of the United States and the State of New York, without regard to its conflict of law principles.</p>
            </PolicySection>

            {/* Section 19 */}
            <PolicySection id="changes-to-terms" index={19} title="Changes to Terms of Service">
              <p className="text-[#555]">We reserve the right, at our sole discretion, to update, change, or replace any part of these Terms at any time by posting changes on this page. It is your responsibility to check this page periodically for changes. Your continued use of the Site or the Service after the posting of any changes constitutes acceptance of those changes.</p>
            </PolicySection>

            {/* Section 20 */}
            <PolicySection id="contact-information" index={20} title="Contact Information">
              <p className="text-[#555] mb-4">If you have any questions about these Terms, please contact us:</p>
              <div className="space-y-2">
                <p className="text-[#333] font-semibold">Makimoo</p>
                <p className="text-[#555]">
                  Email: <a href="mailto:support@makimoohome.com" className="text-[#8B5A2B] font-medium hover:underline">support@makimoohome.com</a>
                </p>
                <p className="text-[#555]">
                  Website: <a href="https://www.makimoohome.com" className="text-[#8B5A2B] font-medium hover:underline">https://www.makimoohome.com</a>
                </p>
              </div>
            </PolicySection>

            <PolicyContactStrip />
          </PolicyLayout>
        </div>
      </section>
    </>
  );
}
