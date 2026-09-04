import V2Header from "@/components/v2/V2Header";
import V2Footer from "@/components/v2/V2Footer";
import BackToTop from "@/components/BackToTop";
import MiniCart from "@/components/MiniCart";
import CookieConsent from "@/components/CookieConsent";

export default function V2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* overflow-x-clip：防横向溢出且不创建滚动容器；V2 全宽布局，无 1400px 盒子。
       V2Header 是 fixed 定位，main 不加 padding-top——页面第一屏（hero）从视口顶开始 */
    <div className="w-full overflow-x-clip bg-off-white">
      <V2Header />
      <main>{children}</main>
      <V2Footer />
      <MiniCart />
      <CookieConsent />
      <BackToTop />
    </div>
  );
}
