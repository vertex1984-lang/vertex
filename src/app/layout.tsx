import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";

export const metadata: Metadata = {
  title: "Makimoo: Premium Home Essentials",
  description: "Shop Makimoo Home Products, Bring Comfort to Your Home. Free Shipping & 60-day Worry Free Return",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{ backgroundColor: '#F8F5F0' }}>
        <div className="w-full max-w-[1400px] mx-auto shadow-lg overflow-hidden" style={{ backgroundColor: '#F8F5F0' }}>
          <Header />
          <main>{children}</main>
          <Footer />
          <BackToTop />
        </div>
        {/* GA4：全站为原生 <a> 整页跳转，gtag config 的自动 page_view 即可覆盖 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
