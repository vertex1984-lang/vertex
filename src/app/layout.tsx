import type { Metadata, Viewport } from "next";
import "./globals.css";
import AnalyticsLoader from "@/components/AnalyticsLoader";
import MetaLoader from "@/components/MetaLoader";
import WishlistCaptureModal from "@/components/v2/WishlistCaptureModal";
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
  // 品牌图标全套（支付信任整改 2026-11-22 T1：源图 public/images/brand/makimoo-icon.webp
  // 生成——favicon.ico 多尺寸在 src/app 文件约定注入 /favicon.ico；icon.png 512 供高分屏
  // 标签；apple-touch-icon.png 180 为米色底品牌标（iOS 添加到主屏）。仅动本段，
  // Meta Loader 挂载与既有 metadata 其余字段零触碰）
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
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
        {/* Montserrat 已自托管（globals.css @font-face → /fonts/*.woff2），不再依赖 Google Fonts */}
        <link rel="preload" href="/fonts/montserrat-latin-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/montserrat-latin-500.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/montserrat-latin-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="antialiased" style={{ backgroundColor: '#F8F5F0' }}>
        <ToastProvider>
          {children}
          {/* GA4：NEXT_PUBLIC_GA_ID 有值时经 AnalyticsLoader 加载。
              CookieConsent 横幅已全站移除（2026-11-26 用户定：美国市场无强制 Cookie 提示法规，
              弹窗干扰首访用户；analytics_storage 默认 granted，广告类保持 denied） */}
          <AnalyticsLoader />
          {/* Meta Pixel：横幅已移除、US 市场视为默认授权——MetaLoader 门控改为默认注入
              （仅 localStorage makimoo-consent === 'declined' 时跳过，兼容横幅回归场景） */}
          <MetaLoader />
          {/* 游客心愿单捕获面板（批次 5）：全站单例——PLP 卡片/PDP 收藏新增时由
              wishlist-capture.ts 事件触发（内部自判未登录+冷却，条件不满足零渲染开销） */}
          <WishlistCaptureModal />
        </ToastProvider>
      </body>
    </html>
  );
}
