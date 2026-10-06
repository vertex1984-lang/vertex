import type { Metadata, Viewport } from "next";
import "./globals.css";
import AnalyticsLoader from "@/components/AnalyticsLoader";
import ToastProvider from "@/components/Toast";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.makimoohome.com'),
  title: {
    default: "Makimoo: Premium Home Essentials",
    template: "%s | Makimoo",
  },
  description: "Shop Makimoo Home Products, Bring Comfort to Your Home. Free Shipping & 30-day Worry Free Return",
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

// 刘海屏适配（2026-10-07 用户反馈 iPhone 刘海两侧透出公告条橙色且滚动后不消失）：
// 不使用 viewport-fit=cover —— 页面收进安全区，刘海/底部 home 指示条区域由系统
// 以 body 背景色（米白 #F8F5F0）填充，公告条橙色不再侵入；底部吸底元素由系统自动避让，
// 各 fixed 元素的 env(safe-area-inset-bottom) 在此模式下取 0（无害）。
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// WebSite + SearchAction JSON-LD（站点级结构化数据）
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Makimoo',
  url: 'https://www.makimoohome.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.makimoohome.com/products/?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="antialiased" style={{ backgroundColor: '#F8F5F0' }}>
        <ToastProvider>
          {children}
          {/* GA4 仅在用户同意 Cookie 后由 AnalyticsLoader 加载（严格模式） */}
          <AnalyticsLoader />
        </ToastProvider>
      </body>
    </html>
  );
}
