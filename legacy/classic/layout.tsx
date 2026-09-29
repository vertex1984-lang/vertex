import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import MiniCart from "@/components/MiniCart";

export default function ClassicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* overflow-x-clip：防横向溢出且不创建滚动容器（overflow:hidden 会导致 Header sticky 失效） */
    <div className="w-full max-w-[1400px] mx-auto shadow-lg overflow-x-clip" style={{ backgroundColor: '#F8F5F0' }}>
      <Header />
      <main>{children}</main>
      <Footer />
      <BackToTop />
      <MiniCart />
      {/* CookieConsent 已移除（2026-09-28 用户定：美国市场无强制 Cookie 提示法规） */}
    </div>
  );
}
