import type { Metadata } from "next";
import V2ProductDetailClient from './V2ProductDetailClient';
import ProductDetailUpgrade from './ProductDetailUpgrade';
import V2RecentlyViewed from '@/components/v2/V2RecentlyViewed';
import V2ProductReviews from '@/components/v2/V2ProductReviews';
import V2RelatedGuides from '@/components/v2/V2RelatedGuides';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { isNewProductHandle } from '@/data/new-product-handles';
import { getVariantGroupOf } from '@/data/variant-groups';
import { STORE_CURRENCY } from '@/lib/currency';

const SITE_URL = 'https://www.makimoohome.com';

export function generateStaticParams() {
  return PRODUCTS_DATA.map((p) => ({ handle: p.handle }));
}

function getWords(text: string, count: number): string {
  const words = text.trim().split(/\s+/);
  return words.slice(0, count).join(' ');
}

function getProductImageUrl(product: MakimooProduct): string {
  const first = product.shopifyImages && product.shopifyImages.length > 0 ? product.shopifyImages[0] : product.images[0]?.url;
  if (!first) return `${SITE_URL}/images/brand/hero-bg.webp`;
  return first.startsWith('http') ? first : `${SITE_URL}${first}`;
}

export function generateMetadata({ params }: { params: { handle: string } }): Metadata {
  const raw = PRODUCTS_DATA.find((p) => p.handle === params.handle);
  if (!raw) return { title: 'Product Not Found' };
  const product = enrichProductsWithShopifyData([raw])[0];
  // 精简标题整体作为页标题（新标题公式本身已 ≤10 词左右）
  const title = product.title;
  const description = getWords(product.title, 15);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/products/${product.handle}/`,
      images: [{ url: getProductImageUrl(product), alt: product.title }],
    },
  };
}

// asin 大小写不敏感的唯一查找入口（变体组成员为小写、商品数据可能为大写，如 B0 系列）
const PRODUCTS_BY_ASIN = new Map(PRODUCTS_DATA.map((p) => [p.asin.toLowerCase(), p]));

export default function V2ProductDetailPage({ params }: { params: { handle: string } }) {
  const product = PRODUCTS_DATA.find((p) => p.handle === params.handle);
  const enriched = product ? enrichProductsWithShopifyData([product])[0] : null;
  const isNew = isNewProductHandle(params.handle);

  // 花色/尺寸切换数据（仅白名单新品）：
  // - 纯颜色家族（地毯）：色圆点 = 全部成员
  // - 二维/尺寸家族（成员带 size）：色圆点按颜色去重（代表成员优先当前尺寸）；尺寸项 = 同色其他尺寸
  const variantData = enriched && isNew
    ? (() => {
        const group = getVariantGroupOf(enriched.asin);
        if (!group) return { colorVariants: [], sizeVariants: [] };
        const toVariant = (m: (typeof group.members)[number]) => {
          const p = PRODUCTS_BY_ASIN.get(m.asin.toLowerCase());
          const ep = p ? enrichProductsWithShopifyData([p])[0] : null;
          // 色点缩略图：优先白底图（imageWhiteBg 与 shopifyImages 同源同序，见 products.ts applyMaterialsData）
          const wbIdx = ep?.imageWhiteBg?.indexOf(true) ?? -1;
          const wbThumb = wbIdx >= 0 ? ep?.shopifyImages?.[wbIdx] : undefined;
          return {
            asin: m.asin,
            handle: m.handle,
            color: m.color,
            size: m.size,
            thumb: wbThumb || ep?.shopifyImages?.[0] || ep?.images[0]?.url || '',
            inStock: ep ? (ep.hasShopifyData ? (ep.shopifyAvailable ?? false) : (ep.availableForSale === true)) : false,
          };
        };
        const hasSizes = group.members.some((m) => m.size);
        // 大小写不敏感匹配当前成员（B0 组成员为小写、商品数据为大写）
        const currentMember = group.members.find(
          (m) => m.asin.toLowerCase() === enriched.asin.toLowerCase()
        );
        if (!hasSizes) {
          return { colorVariants: group.members.map(toVariant), sizeVariants: [] };
        }
        // 同尺寸成员优先作色代表；色圆点按颜色去重
        const ordered = currentMember
          ? [...group.members].sort(
              (a, b) => Number(b.size === currentMember.size) - Number(a.size === currentMember.size)
            )
          : group.members;
        const seenColors = new Set<string>();
        const colorVariants = ordered
          .filter((m) => {
            if (seenColors.has(m.color)) return false;
            seenColors.add(m.color);
            return true;
          })
          .map(toVariant);
        // 展示顺序 = 颜色在家族文件序中的首次出现位置（与当前页/代表成员尺寸无关，
        // 任何成员页色点排列一致）；去重代表仍优先同尺寸（上方 ordered 排序），点击色点尽量保持当前尺寸
        const colorFirstIdx = new Map<string, number>();
        group.members.forEach((m, i) => {
          if (!colorFirstIdx.has(m.color)) colorFirstIdx.set(m.color, i);
        });
        colorVariants.sort(
          (a, b) => (colorFirstIdx.get(a.color) ?? 0) - (colorFirstIdx.get(b.color) ?? 0)
        );
        // 尺寸项：同色成员按尺寸去重（同尺寸重复 SKU 取第一个）
        const seenSizes = new Set<string>();
        // 尺寸行 = 全家族出现过的尺寸档（Single → Set of N → cm 数字升序）；
        // 当前花色有该档 → 返回可跳转成员；当前花色没有该档 → handle=null（前端渲染为置灰不可选）
        const sizeRank = (s: string): number => {
          const setM = s.match(/^Set of (\d+)/i);
          if (setM) return 1000 + Number(setM[1]);
          const numM = s.match(/^(\d+)/);
          if (numM) return Number(numM[1]);
          return 1;
        };
        const sizeVariants = [...group.members]
          .filter((m) => m.size)
          .sort((a, b) => sizeRank(a.size!) - sizeRank(b.size!))
          .filter((m) => {
            if (seenSizes.has(m.size!)) return false;
            seenSizes.add(m.size!);
            return true;
          })
          .map((m) => {
            const sameCombo = currentMember
              ? group.members.find((x) => x.size === m.size && x.color === currentMember.color)
              : undefined;
            if (!sameCombo) return { handle: null as string | null, size: m.size!, inStock: false };
            const v = toVariant(sameCombo);
            return { handle: v.handle, size: m.size!, inStock: v.inStock };
          });
        return { colorVariants, sizeVariants };
      })()
    : { colorVariants: [], sizeVariants: [] };
  const { colorVariants, sizeVariants } = variantData;

  // JSON-LD Product 结构化数据（有真实评价数据时才输出 aggregateRating）
  const jsonLd = enriched
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: enriched.title,
        image: enriched.shopifyImages && enriched.shopifyImages.length > 0
          ? enriched.shopifyImages.slice(0, 3)
          : enriched.images.slice(0, 3).map((img) => img.url.startsWith('http') ? img.url : `${SITE_URL}${img.url}`),
        description: enriched.description.slice(0, 300),
        brand: { '@type': 'Brand', name: 'Makimoo' },
        offers: {
          '@type': 'Offer',
          url: `${SITE_URL}/products/${enriched.handle}/`,
          priceCurrency: STORE_CURRENCY,
          price: enriched.shopifyPrice || enriched.priceRange.minVariantPrice.amount,
          availability: (enriched.shopifyAvailable ?? enriched.availableForSale)
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
        ...(enriched.rating != null && enriched.reviewCount != null && enriched.reviewCount > 0
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: enriched.rating,
                reviewCount: enriched.reviewCount,
              },
            }
          : {}),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {isNew ? (
        <ProductDetailUpgrade handle={params.handle} colorVariants={colorVariants} sizeVariants={sizeVariants} />
      ) : (
        <V2ProductDetailClient handle={params.handle} />
      )}
      {/* 真实评价区（新旧 PDP 共用；product-reviews.ts 无数据时不渲染） */}
      {product && (
        <V2ProductReviews asin={product.asin} rating={product.rating} reviewCount={product.reviewCount} />
      )}
      {/* Related Guides 关联阅读（优化手册 PDP 模块；按类目挑 3 张指南卡） */}
      {product && <V2RelatedGuides cat={product.productType.toLowerCase()} />}
      {/* "You May Also Like" 两版推荐区（新品 Complete the Look / 老品 More Comfort）
          2026-09 用户定已从 PDP 移除；QuickAddCard.tsx 组件文件保留磁盘备用 */}
      <V2RecentlyViewed currentHandle={params.handle} />
    </>
  );
}
