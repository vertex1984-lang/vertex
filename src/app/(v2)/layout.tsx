import V2Header from "@/components/v2/V2Header";
import V2Footer from "@/components/v2/V2Footer";
import BackToTop from "@/components/BackToTop";
import MiniCart from "@/components/MiniCart";
import ChatWidget from "@/components/ChatWidget";
import ScrollRestoration from "@/components/v2/ScrollRestoration";
import { Suspense } from "react";
import { stylesByCategory } from "@/data/style-tagged";
import { beddingMaterialSubs } from "@/lib/bedding-nav-subs";

export default function V2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 顶部导航下拉子项：各类目在售产品的风格列表（服务端算好传入，与 /products Collections 同步）；
  // bedding 例外：按材质分组（与该类目页 Collections 一致）
  const catStyles = { ...stylesByCategory(), bedding: beddingMaterialSubs() };
  return (
    /* overflow-x-clip：防横向溢出且不创建滚动容器（sticky 头部不受影响）；V2 全宽布局，无 1400px 盒子。
       V2Header 是 sticky 文档流定位（2026-10-11 全站推广），main 不加 padding-top——
       大图页由各自页面用负 margin 衬到导航下方，内页在页面级保留小额呼吸留白 */
    <div className="w-full overflow-x-clip bg-off-white">
      <V2Header catStyles={catStyles} />
      <main>{children}</main>
      <V2Footer />
      <MiniCart />
      {/* CookieConsent 已移除（2026-09-28 用户定：美国市场无强制 Cookie 提示法规，弹窗干扰首访用户） */}
      <BackToTop />
      <ChatWidget />
      {/* 后退/前进恢复滚动位置（useSearchParams 需 Suspense 包裹以满足静态导出） */}
      <Suspense fallback={null}>
        <ScrollRestoration />
      </Suspense>
    </div>
  );
}
