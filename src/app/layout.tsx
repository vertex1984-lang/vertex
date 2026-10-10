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

// 刘海屏适配 v7（2026-10-10，按 1ar.io Safari 26 采样规则文档）：保留 viewport-fit=cover
// ——它是 env(safe-area-inset-*) 生效的前提，对染色本身不起决定作用（v6 去掉 cover 证伪）。
// 染色根治在 V2Header：公告条/导航行的背景移到 absolute 子层（Safari 26 不采样 fixed
// 元素内部的 absolute 子元素），html/body 米色作采样回退。themeColor 仅作旧版补充提示。
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F8F5F0',
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
