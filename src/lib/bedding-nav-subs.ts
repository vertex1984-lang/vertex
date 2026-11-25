import { PRODUCTS_DATA, enrichProductsWithShopifyData } from "@/data/products";
import { getProductSpecs } from "@/lib/specs";
import { sortBeddingMaterials } from "@/data/subcategories";

/**
 * bedding 顶部导航下拉子项：与 /products?cat=bedding 的 Collections 同一口径——
 * 按材质分组（原始材质字符串，只显示有产品的，顺序按 BEDDING_MATERIAL_ORDER；2026-09 用户定）。
 *
 * 2026-11-22 从 (v2)/layout.tsx 搬出：Next app-router layout 文件只允许默认导出等
 * 少数字段，自定义具名导出会被 .next/types 的 OmitWithTag 检查判死（dev 拉起后暴露）；
 * 供 (v2)/layout 与根 not-found.tsx（全局 404 不走 (v2) 布局，手动套 V2 壳）共用。
 */
export function beddingMaterialSubs(): { key: string; label: string }[] {
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
