import type { Metadata } from "next";
import V2ProductDetailClient from './V2ProductDetailClient';
import ProductDetailUpgrade from './ProductDetailUpgrade';
import QuickAddCard, { QuickAddCardData } from './QuickAddCard';
import V2ProductCard from '@/components/v2/V2ProductCard';
import V2RecentlyViewed from '@/components/v2/V2RecentlyViewed';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { isNewProductHandle } from '@/data/new-product-handles';
import { getVariantGroupOf } from '@/data/variant-groups';
import { STORE_CURRENCY } from '@/lib/currency';

const SITE_URL = 'https://www.makimoohome.com';

// 互补类目推荐表：详情页底部不推同类目（同类需求已由花色切换器覆盖），
// 改推搭配品类；每个类目配置按优先级排列的互补序列
const COMPLEMENT: Record<string, string[]> = {
  Mats: ['Cushions', 'Pillows', 'Bath'],
  Cushions: ['Mats', 'Pillows', 'Bath'],
  Pillows: ['Cushions', 'Mats', 'Bath'],
  Bath: ['Mats', 'Cushions', 'Others'],
  Others: ['Cushions', 'Pillows', 'Bath'],
  Travel: ['Pillows', 'Cushions', 'Others'],
  Dining: ['Cushions', 'Bath', 'Mats'],
};
const RELATED_LIMIT = 6;

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
            inStock: ep ? (ep.hasShopifyData ? (ep.shopifyAvailable ?? false) : false) : false,
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

  // Complete the Look（仅白名单新品）：互补类目轮转选取 6 款在售产品
  const quickAddCards: QuickAddCardData[] = enriched && isNew
    ? (() => {
        const all = enrichProductsWithShopifyData(PRODUCTS_DATA);
        const complementOrder = COMPLEMENT[enriched.productType] ?? [];
        const pools = complementOrder.map((cat) =>
          all.filter((p) =>
            p.productType === cat &&
            p.handle !== enriched.handle &&
            p.hasShopifyData &&
            p.shopifyAvailable
          )
        );
        const picked: MakimooProduct[] = [];
        const cursors = pools.map(() => 0);
        while (picked.length < RELATED_LIMIT) {
          let progressed = false;
          for (let i = 0; i < pools.length && picked.length < RELATED_LIMIT; i++) {
            if (cursors[i] < pools[i].length) {
              picked.push(pools[i][cursors[i]]);
              cursors[i]++;
              progressed = true;
            }
          }
          if (!progressed) break;
        }
        if (picked.length < RELATED_LIMIT) {
          for (const p of all) {
            if (picked.length >= RELATED_LIMIT) break;
            if (p.handle === enriched.handle || picked.some((q) => q.handle === p.handle)) continue;
            if (!p.hasShopifyData || !p.shopifyAvailable) continue;
            picked.push(p);
          }
        }
        return picked.map((p) => ({
          id: p.id,
          title: p.title,
          handle: p.handle,
          image: p.shopifyImages?.[0] || p.images[0]?.url || '',
          price: p.shopifyPrice || p.priceRange.minVariantPrice.amount,
          currency: p.shopifyCurrencyCode || p.priceRange.minVariantPrice.currencyCode,
          inStock: p.hasShopifyData ? (p.shopifyAvailable ?? false) : false,
          whiteBg: p.imageWhiteBg?.[0] ?? false,
          productType: p.productType,
          variantId: p.shopifyVariantId,
        }));
      })()
    : [];

  // You May Also Like（仅老商品走原逻辑）：同分类的其他在售产品，排除自身，最多 4 个
  const related = enriched && !isNew
    ? (() => {
        const sizeMatch = enriched.title.match(/\d+\s*x\s*\d+/i)?.[0].replace(/\s/g, '').toLowerCase();
        const price = parseFloat(enriched.shopifyPrice || enriched.priceRange.minVariantPrice.amount);
        return enrichProductsWithShopifyData(PRODUCTS_DATA)
          .filter((p) =>
            p.handle !== enriched.handle &&
            p.productType === enriched.productType &&
            p.hasShopifyData &&
            p.shopifyAvailable
          )
          .map((p) => {
            const pPrice = parseFloat(p.shopifyPrice || p.priceRange.minVariantPrice.amount);
            const sameSize = sizeMatch ? p.title.replace(/\s/g, '').toLowerCase().includes(sizeMatch) : false;
            const nearPrice = price > 0 && Math.abs(pPrice - price) / price <= 0.3;
            return { p, score: (sameSize ? 2 : 0) + (nearPrice ? 1 : 0) };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 4)
          .map(({ p }) => p);
      })()
    : [];

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
      {isNew && quickAddCards.length > 0 && (
        <section className="bg-off-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14 lg:py-20">
            <div className="max-w-2xl mb-8 lg:mb-10">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2">Complete the Look</p>
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-charcoal mb-3">
                You May Also Like
              </h2>
              <p className="text-sm lg:text-base text-charcoal-light">
                Pair it with customer favorites — everything you need to pull the room together.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickAddCards.map((card) => (
                <QuickAddCard key={card.id} card={card} />
              ))}
            </div>
          </div>
        </section>
      )}
      {!isNew && related.length > 0 && (
        <section className="bg-off-white">
          <div className="max-w-[1400px] mx-auto px-3 lg:px-10 py-14 lg:py-20">
            <div className="mb-8 lg:mb-12">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2">More Comfort</p>
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-charcoal">
                You May Also Like
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6">
              {related.map((p) => (
                <V2ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      <V2RecentlyViewed currentHandle={params.handle} />
    </>
  );
}
