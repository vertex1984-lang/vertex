import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import MiniCart from "@/components/MiniCart";
import AnalyticsLoader from "@/components/AnalyticsLoader";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.makimoohome.com'),
  title: {
    default: "Makimoo: Premium Home Essentials",
    template: "%s | Makimoo",
  },
  description: "Shop Makimoo Home Products, Bring Comfort to Your Home. Free Shipping & 60-day Worry Free Return",
  openGraph: {
    siteName: "Makimoo",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/brand/hero-bg.webp",
        width: 1915,
        height: 821,
        alt: "Makimoo Home — Simple Life, Better Comfort",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
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
          <MiniCart />
          <CookieConsent />
        </div>
        {/* GA4 仅在用户同意 Cookie 后由 AnalyticsLoader 加载（严格模式） */}
        <AnalyticsLoader />
      </body>
    </html>
  );
}
