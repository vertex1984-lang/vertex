import V2Header from "@/components/v2/V2Header";
import V2Footer from "@/components/v2/V2Footer";
import BackToTop from "@/components/BackToTop";
import MiniCart from "@/components/MiniCart";
import CookieConsent from "@/components/CookieConsent";
import ChatWidget from "@/components/ChatWidget";
import { stylesByCategory } from "@/data/style-tagged";
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from "@/data/products";
import { getProductSpecs } from "@/lib/specs";
import { sortBeddingMaterials } from "@/data/subcategories";

// bedding 顶部导航下拉子项：与 /products?cat=bedding 的 Collections 同一口径——
// 按材质分组（原始材质字符串，只显示有产品的，顺序按 BEDDING_MATERIAL_ORDER；2026-09 用户定）
function beddingMaterialSubs(): { key: string; label: string }[] {
  const counts = new Map<string, number>();
  for (const p of enrichProductsWithShopifyData(PRODUCTS_DATA)) {
    if (p.productType !== "Bedding") continue;
    const m = getProductSpecs(p.asin.toLowerCase())?.material;
    if (!m) continue;
    for (const x of m.split(", ")) counts.set(x, (counts.get(x) || 0) + 1);
  }
  return sortBeddingMaterials(Array.from(counts.entries()), (e) => e[1])
    .map(([label]) => ({ key: label, label }));
}

export default function V2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 顶部导航下拉子项：各类目在售产品的风格列表（服务端算好传入，与 /products Collections 同步）；
  // bedding 例外：按材质分组（与该类目页 Collections 一致）
  const catStyles = { ...stylesByCategory(), bedding: beddingMaterialSubs() };
  return (
    /* overflow-x-clip：防横向溢出且不创建滚动容器；V2 全宽布局，无 1400px 盒子。
       V2Header 是 fixed 定位，main 不加 padding-top——页面第一屏（hero）从视口顶开始 */
    <div className="w-full overflow-x-clip bg-off-white">
      <V2Header catStyles={catStyles} />
      <main>{children}</main>
      <V2Footer />
      <MiniCart />
      <CookieConsent />
      <BackToTop />
      <ChatWidget />
    </div>
  );
}
