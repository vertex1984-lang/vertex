'use client';

/**
 * PDP v2 升级版详情页（仅 NEW_PRODUCT_HANDLES 白名单内商品使用）。
 * 功能：图集（缩略图在下）/ 花色切换 / 尺寸选择 / 锚点 Tab（非吸顶）/ 详情附图 /
 *      扩展规格表 / 示例评价区 / 信任徽章 / 移动端吸底加购。
 * 美术：全部使用 V2 设计 token（brand/charcoal/warm-gray/off-white/cream）。
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getProductByHandle } from '@/data/products';
import { MATERIALS_MAP } from '@/data/materials-map';
import { getVariantGroupOf } from '@/data/variant-groups';
import { PDP_MAIN_34_ASINS, PDP_MAIN_PREPEND_IMAGES } from '@/data/pdp-main-34-asins';
import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { addToShopifyCart, addToLocalCart, notifyCartUpdated, openMiniCart } from '@/lib/cart';
import { formatPrice } from '@/lib/currency';
import { trackEvent, GA_CURRENCY, GaItem } from '@/lib/gtag';
import { addRecentlyViewed } from '@/lib/recently-viewed';
import { useToast } from '@/components/Toast';
import ImageLightbox from '@/components/ImageLightbox';
import { getProductSpecs, formatDimensionsDual, formatWeightDual } from '@/lib/specs';
import { beddingPdpHeading, beddingUsSizeLabel, classifySet } from '@/data/bedding-families';
import { getCareCopy, RUG_TITLE_RE } from '@/lib/care-copy';
import EstimatedDelivery from '@/components/v2/EstimatedDelivery';
import StarDisplay from '@/components/v2/StarDisplay';
import PdpStoryBlocks from '@/components/v2/PdpStoryBlocks';
import BoughtTogether from '@/components/BoughtTogether';
import DragScroll from '@/components/v2/DragScroll';
import V2PdpLifestyle from '@/components/v2/V2PdpLifestyle';
import GroupProductCard from '@/components/v2/GroupProductCard';
import type { GroupCard } from '@/lib/group-cards';
import { useGallerySwipe } from '@/lib/use-gallery-swipe';

interface ProductDetailUpgradeProps {
  handle: string;
  /** 同款异色成员（含缩略图 URL），由服务端 page 组装传入；二维家族已按颜色去重 */
  colorVariants?: { asin: string; handle: string; color: string; size?: string; thumb: string; inStock: boolean }[];
  /** 全家族尺寸档（可选；二维/尺寸家族才有）。handle=null 的档位 = 当前花色无此规格，前端渲染为置灰不可选；
   *  asin 供 bedding 美式尺寸标签取 ASIN 后缀（2026-10-21） */
  sizeVariants?: { handle: string | null; asin?: string; size: string; inStock: boolean }[];
  /** "You May Also Like" 关联推荐组卡（page.tsx 用 getPdpRelatedFamilies 构建期算好），渲染在信任条下方。
   *  2026-10-22 用户定：一组一卡 + 色卡——同组只出一张卡，色卡展示全部颜色 */
  relatedProducts?: GroupCard[];
}

// 尺寸选项（仅地毯类使用）：当前尺寸可选中，其余灰色"即将推出"；
// 其他分类不显示该占位（review #3：地毯尺寸串台到毛巾/床品等页面）
const SIZE_PRESETS = ['140 x 200 cm', '160 x 200 cm', '160 x 230 cm', '180 x 250 cm', '100 x 200 cm', '100 x 160 cm'];

// 尺寸双标（2026-10-25 领导定：尺寸要 cm 和 inch 对照）：
// '80 x 160cm' → '80 x 160cm / 31.5 x 63in'（inch 取 0.5 精度，与 formatDimensionsDual 同口径）
function sizeDualLabel(size: string): string {
  const m = size.match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/i);
  if (!m) return size;
  const a = parseFloat(m[1]);
  const b = parseFloat(m[2]);
  const r = (v: number) => String(Math.round((v / 2.54) * 2) / 2);
  return `${a} x ${b}cm / ${r(a)} x ${r(b)}in`;
}

// Shipping & Return 为通用文案（2026-10-12 用户定：Shipping & Delivery 与 Returns & Refunds 合并为一节）；
// Care 节由 getCareCopy 按分类生成（src/lib/care-copy.ts，与老版 PDP 共用）
const ACCORDION_SECTIONS_BASE = [
  {
    title: 'Shipping & Return',
    body: 'Free shipping on all orders. Orders are processed within 1-2 business days and typically arrive within 5-10 business days depending on your location. We offer an extended 30-day return period — if you are not satisfied, contact us and we will cover the return shipping cost.',
  },
];

// 滚动信任条文案（2026-09-29 用户定，购买区精简后更多信任元素在此滚动展示）；
// 渲染时数组拼接两遍实现无缝循环（配合 globals.css 的 animate-marquee）
const TRUST_MARQUEE_ITEMS = [
  'Free shipping over $49',
  '30-day easy returns',
  'Secure checkout',
  'Trusted brand',
  '500K+ items sold a year Worldwide',
  'Premium materials, honest prices',
];

export default function ProductDetailUpgrade({ handle, colorVariants = [], sizeVariants = [], relatedProducts = [] }: ProductDetailUpgradeProps) {
  const { toast } = useToast();
  const product = getProductByHandle(handle);
  const [selectedImage, setSelectedImage] = useState(0);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [sizeMenuOpen, setSizeMenuOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const sizeMenuRef = useRef<HTMLDivElement | null>(null);

  // 尺寸下拉：点击下拉框外部任意位置即关闭（2026-10-16 用户定，全站 PDP 共用此组件）；
  // 点选项/点下拉框本身关闭的行为不变。pointerdown 早于 click，不影响面板内 Link 跳转
  useEffect(() => {
    if (!sizeMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (sizeMenuRef.current && !sizeMenuRef.current.contains(e.target as Node)) {
        setSizeMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [sizeMenuOpen]);

  // GA4: view_item
  useEffect(() => {
    if (!product) return;
    const price = parseFloat(product.shopifyPrice || product.priceRange.minVariantPrice.amount);
    trackEvent('view_item', {
      currency: GA_CURRENCY,
      value: price,
      items: [{
        item_id: product.handle,
        item_name: product.title,
        item_category: product.productType,
        price,
        quantity: 1,
      } satisfies GaItem],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle]);

  // 记录最近浏览（心愿单功能已于 2026-10-12 移除，用户定）
  useEffect(() => {
    if (!product) return;
    addRecentlyViewed(product.handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle]);

  // 移动端悬浮加购条显示逻辑（2026-10-12 用户定）：加载 PDP 后不显示；
  // 向下滚动至主 Add to Cart 按键滚出视口（顶出屏幕上方）后才滑入；向上回滚、
  // 主 CTA 重新可见（直到页面顶端）都不再显示。IntersectionObserver 监听主 CTA 行
  // （mainCtaRef），初始 mainCtaVisible=true（首帧即隐藏，无闪现）；CTA 仍在视口
  // 下方（尚未滚动到，boundingClientRect.bottom > 0）同样视为隐藏，避免移动端
  // 首屏 CTA 未入视口时吸底条误显示
  const [mainCtaVisible, setMainCtaVisible] = useState(true);
  const mainCtaRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = mainCtaRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        // CTA 可见、或还在视口下方（未滚动到）→ 隐藏；只有 CTA 整体滚出视口上方 → 显示
        setMainCtaVisible(e ? (e.isIntersecting || e.boundingClientRect.bottom > 0) : true);
      },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // 主图滑动切图（手机）：横向滑动上/下一张，循环；配套圆点指示器见主图容器内
  // （2026-10-02 采自 feat/pdp-v2-features，替换旧的 touchStartX 手写滑动：循环 + 滑动后抑制误触 lightbox）
  const imageCount = product
    ? (product.shopifyImages?.length || product.images?.length || 0) +
      (PDP_MAIN_PREPEND_IMAGES[product.asin.toLowerCase()] ? 1 : 0)
    : 0;
  const swipeTo = (dir: 1 | -1) => {
    setMainImageLoaded(false);
    setSelectedImage((i) => (i + dir + imageCount) % Math.max(1, imageCount));
  };
  const { onTouchStart, onTouchEnd, wasSwiped } = useGallerySwipe(
    () => swipeTo(-1),
    () => swipeTo(1)
  );

  if (!product) {
    return (
      <div className="bg-off-white px-6 lg:px-10 pt-40 pb-24 text-center">
        <p className="text-lg text-charcoal-light">Product not found.</p>
        <a href={v2url('/categories/')} className="mt-4 inline-block text-brand underline underline-offset-4">
          Browse all products
        </a>
      </div>
    );
  }

  // 2026-10-19 用户定：PDP 图集第一张用 3:4 竖版新图（1-3x4.webp，见 pdp-main-34-asins.ts），
  // PLP 卡片/OG 等其他位置仍用 1:1 主图（1.webp），互不影响
  const pdpMain34 = PDP_MAIN_34_ASINS.has(product.asin.toLowerCase())
    ? `/images/products/${product.asin}/1-3x4.webp`
    : null;
  const productImages = (product.shopifyImages && product.shopifyImages.length > 0)
    ? product.shopifyImages.map((url, i) => ({
        url: pdpMain34 && i === 0 ? pdpMain34 : url,
        mainUrl: pdpMain34 && i === 0 ? pdpMain34 : shopifyImageUrl(url, 1200),
        lightboxUrl: pdpMain34 && i === 0 ? pdpMain34 : shopifyImageUrl(url, 2048),
        thumbUrl: pdpMain34 && i === 0 ? pdpMain34 : shopifyImageUrl(url, 200),
        altText: product.title,
        whiteBg: product.imageWhiteBg?.[i] ?? false,
      }))
    : product.images.map((img, i) => ({
        url: pdpMain34 && i === 0 ? pdpMain34 : img.url,
        mainUrl: pdpMain34 && i === 0 ? pdpMain34 : img.url,
        lightboxUrl: pdpMain34 && i === 0 ? pdpMain34 : img.url,
        thumbUrl: pdpMain34 && i === 0 ? pdpMain34 : img.url,
        altText: img.altText, whiteBg: product.imageWhiteBg?.[i] ?? false,
      }));

  // 2026-10-26 用户定：个别产品把"产品卡主图"前置为 PDP 图集第一张（其余图依次后移，
  // 见 pdp-main-34-asins.ts 的 PDP_MAIN_PREPEND_IMAGES）
  const pdpPrepend = PDP_MAIN_PREPEND_IMAGES[product.asin.toLowerCase()];
  if (pdpPrepend) {
    productImages.unshift({
      url: pdpPrepend,
      mainUrl: pdpPrepend,
      lightboxUrl: pdpPrepend,
      thumbUrl: pdpPrepend,
      altText: product.title,
      whiteBg: false,
    });
  }

  // 详情附图区已随 Description 模块删除（2026-09-29 用户定）

  const hasShopifyData = product.hasShopifyData;
  const isInStock = hasShopifyData ? (product.shopifyAvailable ?? false) : (product.availableForSale === true);
  const displayPrice = product.shopifyPrice || product.priceRange.minVariantPrice.amount;
  const displayCurrency = product.shopifyCurrencyCode || product.priceRange.minVariantPrice.currencyCode;
  const showCompareAt = product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(displayPrice);

  // 标题：enrich 短标题（新标题公式已写入 short-titles）；
  // 原始长标题副行已于 2026-10-12 移除（用户定：PDP 不显示副标题）；
  // 2026-10-21 用户定：bedding 例外——主标题改 材质+类型、新增 类型副标题+美式尺寸 副行（见下方 beddingHeading）
  const shortTitle = product.title;

  // 面包屑已于 2026-10-19 全站移除（用户定），原面包屑类目变量（catSlug/catLabel/catHref）一并删除

  // 变体组（同款异色）
  const group = getVariantGroupOf(product.asin);
  const currentColor = group?.members.find((m) => m.handle === handle)?.color ?? null;

  // 规格
  const specs = getProductSpecs(product.asin);
  const materialSku = MATERIALS_MAP[product.asin.toLowerCase()]?.sku;
  const dimsStr = formatDimensionsDual(specs?.dimensionsCm);
  const weightStr = formatWeightDual(product.shopifyWeight, product.shopifyWeightUnit);
  const colorStr = product.title.match(/\(([^)]+)\)\s*$/)?.[1] ?? currentColor;
  // 绒高：仅当商品自身描述里有明确数值时才展示（防编造）
  const pileMatch = product.description.match(/(\d+(?:\.\d+)?)\s*cm\s*(?:pile|build|height|thick)/i)
    || product.description.match(/(?:pile|profile|thick)[^\d]{0,15}(\d+(?:\.\d+)?)\s*cm/i);
  const pileStr = pileMatch ? `${pileMatch[1]} cm` : null;

  // 尺寸选项（预设 ∪ 当前实际尺寸）
  const currentSizeStr = specs?.dimensionsCm ? `${specs.dimensionsCm[0]} x ${specs.dimensionsCm[1]} cm` : null;
  const sizeOptions = currentSizeStr && !SIZE_PRESETS.includes(currentSizeStr)
    ? [...SIZE_PRESETS, currentSizeStr]
    : SIZE_PRESETS;

  // 护理文案（按分类映射，地毯特判）+ 地毯判断（尺寸占位仅地毯显示）
  const careCopy = getCareCopy(product.productType, product.title);
  const isRug = RUG_TITLE_RE.test(product.title);
  const isBedding = (product.productType || '').toLowerCase() === 'bedding';
  // 四件套（被套+床笠+2枕套，classifySet = 'four'）的 Size Guide 需附床笠尺寸表
  // （2026-10-21 用户定，美式床笠标准尺寸调研：Bed Bath & Beyond / Or&Zon 口径）
  const beddingHasFittedSheet = isBedding && classifySet(product.asin) === 'four';

  // bedding PDP 标题区 + 美式尺寸（2026-10-21 用户定，规则函数见 bedding-families.ts）：
  // 主标题 = 材质 + 类型（如 "Cotton Percale Duvet Cover Set"）；副标题 = 类型组件清单 + 美式尺寸
  // （如 "Duvet cover & two pillowcases · Queen"）。当前 cm 尺寸优先取尺寸变体当前项，
  // 兜底解析短标题内 cm（独立被套单件无尺寸变体）
  const currentSizeIdx = sizeVariants.findIndex((sv) => sv.handle === handle);
  const currentVariantCm = (currentSizeIdx >= 0 ? sizeVariants[currentSizeIdx].size : undefined)
    ?? product.title.match(/\d+\s*x\s*\d+\s*cm/i)?.[0];
  const beddingHeading = isBedding ? beddingPdpHeading(product.asin, currentVariantCm) : null;
  const displayTitle = beddingHeading?.title ?? shortTitle;
  // 尺寸选项美式标签：同名撞车（1688 缎面家族 150x200/180x220 同映射 Twin / Twin XL 等）补 cm 消歧
  const beddingSizeLabels = (() => {
    if (!isBedding || sizeVariants.length === 0) return null;
    const raw = sizeVariants.map((sv) => beddingUsSizeLabel(sv.asin ?? '', sv.size) || sv.size);
    const counts = new Map<string, number>();
    for (const l of raw) counts.set(l, (counts.get(l) ?? 0) + 1);
    return sizeVariants.map((sv, i) => ((counts.get(raw[i]) ?? 0) > 1 ? `${raw[i]} (${sv.size})` : raw[i]));
  })();

  const quickSpecs = [
    pileStr ? { icon: 'layers', label: 'Pile', value: `Low profile ${pileStr}` } : null,
    // Material / Care 卡已按领导反馈移除（材料与护理信息保留在底部 Specifications 表中）
  ].filter(Boolean) as { icon: string; label: string; value: string }[];

  const specRows: { label: string; value: string; muted?: boolean }[] = [
    { label: 'Brand', value: 'Makimoo' },
    { label: 'Category', value: product.productType },
    ...(specs?.material ? [{ label: 'Material', value: specs.material }] : []),
    ...(colorStr ? [{ label: 'Color', value: colorStr }] : []),
    ...(dimsStr ? [{ label: 'Dimensions', value: dimsStr }] : []),
    ...(pileStr ? [{ label: 'Pile Height', value: pileStr }] : []),
    ...(weightStr ? [{ label: 'Weight', value: weightStr }] : []),
    ...(materialSku ? [{ label: 'SKU', value: materialSku }] : []),
    { label: 'Care', value: careCopy.spec },
    { label: 'Availability', value: isInStock ? 'In Stock' : 'Currently Unavailable', muted: !isInStock },
  ];

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const price = parseFloat(displayPrice);
    trackEvent('add_to_cart', {
      currency: GA_CURRENCY,
      value: price * quantity,
      items: [{
        item_id: product.handle,
        item_name: product.title,
        item_category: product.productType,
        price,
        quantity,
      } satisfies GaItem],
    });
    try {
      if (product.hasShopifyData && product.shopifyVariantId) {
        const result = await addToShopifyCart(product.shopifyVariantId, quantity);
        if (result) {
          notifyCartUpdated();
          openMiniCart();
          toast('Added to cart!');
        } else {
          toast('Failed to add to cart. Please try again.', 'error');
        }
      } else {
        addToLocalCart({
          id: product.id,
          title: product.title,
          image: resolveUrl(product.shopifyImages?.[0] || product.images[0]?.url || ''),
          price: displayPrice,
          quantity,
          handle: product.handle,
        });
        notifyCartUpdated();
        openMiniCart();
        toast('Added to cart!');
      }
    } catch {
      toast('Something went wrong. Please try again.', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  // 手风琴（桌面在右栏 Details 下方，移动端在右栏底部）。
  // 2026-09-29 用户定：Description 图文区删除；Specifications 大表改为手风琴一节；
  // 顺序 Product Details / Care & Maintenance 在前，Shipping / Returns 在后。
  // 2026-10-12 用户定：Specifications 更名 Product Details，原 DETAILS 卖点列表并入该节
  // （卖点在上、规格表在下），购买区不再单独显示 Details 块；Product Details 提到最前。
  // specs 节渲染卖点+规格表（行多时 maxHeight 需要更大），其余节渲染纯文案
  const detailBullets = (product.featureBullets ?? product.description.split(/\.\s+/).filter((s) => s.trim().length > 10)).slice(0, 5);
  const accordionSections: { title: string; body?: string; specs?: boolean }[] = [
    { title: 'Product Details', specs: true },
    { title: 'Care & Maintenance', body: careCopy.long },
    ...ACCORDION_SECTIONS_BASE,
  ];
  const shippingCareBlock = (
    <>
      <div className="border-b border-warm-gray">
        {accordionSections.map((section, i) => (
          <div key={section.title} className="border-t border-warm-gray">
            <button
              onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
              className={`w-full flex items-center justify-between pb-4 text-left ${i === 0 ? 'pt-7' : 'pt-4'}`}
              aria-expanded={openAccordion === i}
            >
              <span className="text-sm font-semibold text-charcoal">{section.title}</span>
              <svg
                className={`w-4 h-4 text-brand transition-transform duration-300 ${openAccordion === i ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: openAccordion === i ? (section.specs ? '1100px' : '200px') : '0' }}
            >
              {section.specs ? (
                <>
                  {/* 卖点列表（原购买区 Details 块并入，2026-10-12 用户定） */}
                  <ul className="space-y-3 pt-1 pb-4">
                    {detailBullets.map((feature, bi) => (
                      <li key={bi} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </span>
                        <span className="text-[13px] lg:text-sm text-charcoal-light leading-relaxed">{feature.trim()}</span>
                      </li>
                    ))}
                  </ul>
                  <table className="w-full mb-4 border-t border-warm-gray">
                    <tbody>
                      {specRows.map((row, ri) => (
                        <tr key={row.label} className={ri > 0 ? 'border-t border-warm-gray/60' : ''}>
                          <td className="py-2.5 pr-3 text-xs text-charcoal-light w-2/5 align-top">{row.label}</td>
                          <td className={`py-2.5 text-xs font-medium align-top ${row.muted ? 'text-red-500' : 'text-charcoal'}`}>
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <p className="text-sm text-charcoal-light leading-relaxed pb-4">{section.body}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    // pb-24 移动端底 padding 已移除（2026-10-12 用户定：评价区下移页尾后，该 padding 在
    // Brand Story 与评价摘要之间形成 ~96px 大空隙；吸底加购条占位由 page.tsx 尾部 h-20  spacer 承担）
    <div className="bg-off-white">
      {/* 面包屑已全站移除（2026-10-19 用户定：PDP 顶部 Home / Category / Title 区块删除；
          原桌面端 pt-10 由下方图集 section 的 lg:mt-10 承接，顶部间距不变） */}

      {/* ① 顶部：左图集 + 右购买信息；移动端必须显式 grid-cols-1 + 子项 min-w-0：
          隐式 auto 列会被缩略图横排撑到内容宽度，导致整页横向溢出、右侧被裁（与老版 PDP 同坑）。
          移动端首屏压缩（付费落地优化 P1）：面包屑移动端隐藏、移动端无区块上边距（图片贴合顶部导航）、
          图集与购买栏间距 gap-5（原 gap-10 在移动端留出大段空白，2026-09-28 手机实测标题仍被切在屏外）。
          桌面端（2026-09-29 用户定）：容器宽 80% 屏宽，提高首屏占屏比（原 1400px 居中两侧留白过多）；
          图集:购买栏 = 10:9（2026-10-19 用户定：购买栏在 8:6 基础上再加宽 20%（6fr→7.2fr，等比化简 10:9），
          图集对应收窄；历史：8:5 → 8:6 → 10:9）；
          页面下方品牌故事/面料板块同宽 80% 对齐 */}
      <section className="px-6 lg:px-10 lg:mt-10">
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-[10fr_9fr] gap-5 lg:gap-12 max-w-[1520px] lg:w-[80%] lg:max-w-none">
          {/* 左：图集。移动端（2026-09-29 用户定）：主图 1:1.05 近方微竖通栏，方源图 object-cover 居中裁剪
              （仅左右各裁约 2.4%，几乎不损失画面；4:5 竖版左右裁 10% 与模糊背景方案均已弃用）；
              缩略图栏改为底部圆点指示器 + 左右滑动切换；桌面端方图 cover + 缩略图竖排在主图左侧（2026-09-29 用户定）。
              2026-10-21 用户定：全站 PDP 图集区统一 3:4（用户后续全站更新 3:4 源图；imageAspect 覆盖机制保留，
              见 image-aspect-overrides.ts，历史值均为 3/4）。历史：10-19 仅 bedding 默认 3:4，非 bedding 1:1.05/方图 */}
          <div className={`min-w-0 max-lg:-mx-6${productImages.length > 1 ? ' lg:grid lg:grid-cols-[5rem_1fr] lg:gap-4' : ''}`}>
            {/* 缩略图竖排（桌面端，主图左侧；2026-09-29 用户定：主图占比大，缩略图在下方时首屏看不到切换器）。
                grid 行高由主图 aspect-square 决定，竖排列 min-h-0 + overflow-y-auto 超高时列内滚动；
                移动端隐藏（用主图底部圆点指示器 + 滑动切换） */}
            {productImages.length > 1 && (
              <div className="hidden lg:flex lg:flex-col gap-3 lg:min-h-0 lg:overflow-y-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedImage(i); setMainImageLoaded(false); }}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition flex-shrink-0 bg-white ${
                      selectedImage === i ? 'border-brand' : 'border-warm-gray hover:border-brand/40'
                    }`}
                  >
                    <img src={resolveUrl(img.thumbUrl)} alt={img.altText} loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div
              className={`aspect-[3/4] lg:rounded-2xl overflow-hidden lg:border lg:border-warm-gray cursor-zoom-in relative group bg-white touch-pan-y`}
              onClick={() => { if (wasSwiped()) return; setLightboxOpen(true); }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {!mainImageLoaded && <div className="absolute inset-0 animate-pulse bg-warm-gray" />}
              <img
                key={productImages[selectedImage]?.mainUrl}
                src={resolveUrl(productImages[selectedImage]?.mainUrl || '')}
                alt={productImages[selectedImage]?.altText || product.title}
                onLoad={() => setMainImageLoaded(true)}
                ref={(el) => { if (el && el.complete && el.naturalWidth > 0) setMainImageLoaded(true); }}
                className={`relative w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.04] ${
                  productImages[selectedImage]?.whiteBg ? 'object-contain p-6 sm:p-8' : ''
                } ${mainImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
              <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-brand opacity-0 group-hover:opacity-100 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/>
                </svg>
              </div>
              {/* 移动端圆点指示器：当前第几张，可点跳转（2026-10-02 采自 feat/pdp-v2-features：胶囊造型 + 滑动后抑制误触） */}
              {productImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden z-10">
                  {productImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); if (wasSwiped()) return; setMainImageLoaded(false); setSelectedImage(i); }}
                      aria-label={`View image ${i + 1}`}
                      className={`h-2 rounded-full transition-all shadow-[0_1px_3px_rgba(0,0,0,0.4)] ${selectedImage === i ? 'w-4 bg-white' : 'w-2 bg-white/60'}`}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* 手风琴桌面端位置已移至右栏 Details/规格速览下方（2026-09-29 用户定），此处不再渲染 */}
          </div>

          {/* 右：购买信息栏（min-w-0 防 grid 隐式列被内容撑宽） */}
          <div className="lg:pt-2 min-w-0">
            {/* 移动端首屏压缩（2026-09-28 用户定：浏览器地址栏+工具栏显示时价格仍进不了首屏）：
                类目徽章移动端隐藏、行间距收紧；桌面端保持原布局。
                心愿单按钮（桌面购买区 + 移动端主图悬浮）已于 2026-10-12 移除（用户定） */}
            <div className="flex items-center justify-between gap-4 mb-2 lg:mb-4">
              <div className="flex items-center gap-2">
                {/* 类目徽章可点击回对应大类目页（2026-10-19 用户定） */}
                <a
                  href={v2url(`/products/?cat=${encodeURIComponent((product.productType || '').toLowerCase())}`)}
                  className="hidden lg:inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-brand text-cream hover:opacity-85 transition"
                >
                  {product.productType}
                </a>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${isInStock ? 'text-brand' : 'text-charcoal-light'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isInStock ? 'bg-brand' : 'bg-charcoal-light'}`} />
                  {isInStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* 平板档（lg~xl，1024-1280px，如 iPad Pro 11/13 竖屏）用 text-2xl：右栏仅约 380px 宽，
                text-4xl 会挤成 3-4 行（2026-09-29 用户实测排版异常）；≥xl 才用大标题 */}
            <h1 className="text-lg lg:text-2xl xl:text-4xl font-extrabold tracking-tight text-charcoal leading-snug mb-2">{displayTitle}</h1>
            {beddingHeading && (
              <p className="text-sm lg:text-base text-charcoal-light -mt-1 mb-2">{beddingHeading.subtitle}</p>
            )}

            {/* Rating + 价格：评价分布条与 "Based on N customer reviews"
                在页尾评价区（V2ProductReviews 摘要带，Recently Viewed 正上方）；
                购买区只保留一行评分（2026-10-13 领导定）：点击星或评论数不再弹评分详情，
                直接平滑转跳到页尾评价区（#pdp2-reviews）；无评价产品零变化 */}
            {(() => {
              const hasRating = product.rating != null && product.reviewCount != null && product.reviewCount > 0;
              const ratingRow = hasRating ? (
                <button
                  type="button"
                  onClick={() => document.getElementById('pdp2-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  aria-label="Jump to customer reviews"
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <StarDisplay rating={product.rating!} size={18} />
                  <span className="text-sm text-charcoal-light group-hover:text-brand transition">
                    {product.rating!.toFixed(1)} ({product.reviewCount!.toLocaleString()} reviews)
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="text-charcoal-light group-hover:text-brand group-hover:translate-x-0.5 transition"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ) : null;
              const priceBlock = isInStock ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-xl lg:text-4xl font-extrabold text-brand">{formatPrice(displayPrice, displayCurrency)}</span>
                  {showCompareAt && (
                    <>
                      <span className="text-base lg:text-lg text-charcoal-light line-through">{formatPrice(product.compareAtPrice!, displayCurrency)}</span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-light text-cream">
                        Save {Math.round((1 - parseFloat(displayPrice) / parseFloat(product.compareAtPrice!)) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <span className="text-xl font-semibold text-charcoal-light">Out of Stock</span>
              );
              return (
                <>
                  {ratingRow && <div className="mb-4 w-fit">{ratingRow}</div>}
                  <div className="mb-4 lg:mb-6">{priceBlock}</div>
                </>
              );
            })()}

            {/* Details 卖点与规格速览已下移至购买区信任信息之后（首屏聚焦图片+价格+CTA） */}

            {/* 花色切换器（同款异色圆点，点击跳转对应花色页——replace 导航：变体/尺寸切换不压历史栈，
                点多少个变体后退都直接回列表页，2026-10-22 用户定）；移动端 56px 紧凑版（2026-09-28 对标竞品压缩选择区） */}
            {colorVariants.length > 1 && (() => {
              const current = colorVariants.find((v) => v.handle === handle);
              return (
                <div className="mb-5 lg:mb-7">
                  <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-light mb-2 lg:mb-3">
                    Color{current ? `: ${current.color}` : ''}
                  </p>
                  {/* 移动端 48px 色点：360px 窄屏一行放 5 个不折行（2026-09-29 用户实测 56px 会换行且右侧留大空隙） */}
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    {colorVariants.map((v) => {
                      const isCurrent = v.handle === handle;
                      return (
                        <Link
                          key={v.asin}
                          href={v2url(`/products/${v.handle}/`)}
                          replace
                          title={v.color}
                          aria-label={`${v.color}${isCurrent ? ' (current)' : ''}`}
                          className={`relative w-12 h-12 lg:w-16 lg:h-16 xl:w-[88px] xl:h-[88px] rounded-full overflow-hidden border-2 transition hover:scale-105 ${
                            isCurrent ? 'border-brand shadow-md' : 'border-warm-gray hover:border-brand/40'
                          }`}
                        >
                          <img
                            src={resolveUrl(v.thumb)}
                            alt={v.color}
                            loading="lazy"
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] object-cover"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* 尺寸选择器（2026-10-12 用户定：标题与选择器合并为一行——一个圆角框内左 "Size" 标签、
                右当前值 ▾，字体样式不变；原标题行+下划线选择器两段式弃用）：
                点击展开选项面板；变体组带尺寸 → 跳转对应尺寸页（缺货/无此规格在面板内灰显）；
                地毯等无变体 → 预设尺寸（非当前 Coming soon）。Bedding 品类 Size guide 入口移到框下方右侧。
                2026-10-21 用户定：只有一个尺寸变体时不渲染选择器（无可选，尺寸信息标题已带） */}
            {(sizeVariants.length > 1 || (isRug && currentSizeStr)) && (
            <div ref={sizeMenuRef} className="mb-5 lg:mb-7">
              <button
                type="button"
                onClick={() => setSizeMenuOpen((v) => !v)}
                aria-expanded={sizeMenuOpen}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-charcoal/25 bg-white"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-light">Size</span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-charcoal">
                  {sizeVariants.length > 0
                    ? (beddingSizeLabels?.[currentSizeIdx] ?? sizeDualLabel(sizeVariants.find((sv) => sv.handle === handle)?.size ?? 'Select size'))
                    : (beddingSizeLabels?.[currentSizeIdx] ?? sizeDualLabel(currentSizeStr ?? ''))}
                  <svg className={`w-4 h-4 text-charcoal-light transition-transform ${sizeMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </span>
              </button>
              {isBedding && sizeVariants.length > 0 && (
                <div className="mt-1.5 text-right">
                  <button type="button" onClick={() => setSizeGuideOpen(true)} className="text-xs text-brand underline underline-offset-2 hover:no-underline">
                    Size guide
                  </button>
                </div>
              )}
              {sizeMenuOpen && (
                <div className="mt-2 rounded-xl border border-warm-gray bg-white shadow-lg overflow-hidden">
                  {sizeVariants.length > 0
                    ? sizeVariants.map((sv, i) => {
                        const active = sv.handle === handle;
                        const unavailable = sv.handle === null;
                        const label = (
                          <>
                            {beddingSizeLabels?.[i] ?? sizeDualLabel(sv.size)}
                            {unavailable && <span className="ml-1 text-[11px] font-normal opacity-70">✕</span>}
                            {!unavailable && !sv.inStock && <span className="ml-1.5 text-[11px] font-normal opacity-60">(Out of Stock)</span>}
                          </>
                        );
                        if (unavailable) {
                          return (
                            <div key={sv.size} aria-disabled="true" className="px-4 py-2.5 text-sm text-charcoal-light/50">
                              {label}
                            </div>
                          );
                        }
                        return active ? (
                          <div key={sv.size} aria-current="true" className="px-4 py-2.5 text-sm font-semibold text-brand bg-brand/5 flex items-center justify-between">
                            {label}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                          </div>
                        ) : (
                          <Link key={sv.size} replace href={v2url(`/products/${sv.handle}/`)} className="block px-4 py-2.5 text-sm text-charcoal hover:bg-off-white transition">
                            {label}
                          </Link>
                        );
                      })
                    : sizeOptions.map((size) => {
                        const active = size === currentSizeStr;
                        return active ? (
                          <div key={size} aria-current="true" className="px-4 py-2.5 text-sm font-semibold text-brand bg-brand/5 flex items-center justify-between">
                            {size}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                          </div>
                        ) : (
                          <button
                            key={size}
                            type="button"
                            onClick={() => { setSizeMenuOpen(false); toast('This size is coming soon'); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-charcoal-light/60"
                          >
                            {size}
                            <span className="ml-1.5 text-[11px] opacity-70">(Coming soon)</span>
                          </button>
                        );
                      })}
                </div>
              )}
            </div>
            )}

            {/* 规格速览 chips 已下移至购买区信任信息之后 */}

            {/* 数量 + 加购（mainCtaRef：悬浮加购条显隐联动的观测目标） */}
            {isInStock && (
              <div ref={mainCtaRef} className="flex flex-col sm:flex-row gap-3.5 mb-3">
                <div className="flex items-center border border-warm-gray rounded-full overflow-hidden bg-white self-start">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 hover:bg-off-white transition flex items-center justify-center text-charcoal text-xl"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number" value={quantity} min={1} max={99} readOnly
                    className="w-14 h-12 border-none text-center text-sm lg:text-base font-semibold text-charcoal bg-white outline-none"
                    aria-label="Quantity"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 hover:bg-off-white transition flex items-center justify-center text-charcoal text-xl"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                {product.hasShopifyData && product.shopifyVariantId ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm xl:text-base font-bold whitespace-nowrap text-cream bg-brand transition hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60"
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M6 6L5 3H2"/>
                    </svg>
                  </button>
                ) : product.amazonUrl ? (
                  <a
                    href={product.amazonUrl}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm xl:text-base font-bold whitespace-nowrap text-cream bg-brand transition hover:bg-brand-dark"
                  >
                    Shop on Amazon
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M7 17L17 7M17 7H7M17 7v10"/>
                    </svg>
                  </a>
                ) : (
                  /* 2026-10-25 领导定"非 coming soon"：无 Shopify 数据且无 amazonUrl 的站内商品
                     （如尺寸变体兄弟页）→ 本地购物车直购（addToLocalCart 兜底已存在） */
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm xl:text-base font-bold whitespace-nowrap text-cream bg-brand transition hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60"
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M6 6L5 3H2"/>
                    </svg>
                  </button>
                )}
              </div>
            )}
            {/* 免邮/退货信任徽章行已于 2026-10-12 移除（用户定：Add to Cart 下方不再显示这两个字段，
                信任信息由下方滚动信任条承担）；预计送达保留（送达日期单独加粗一行） */}
            {isInStock && (
              <p className="text-sm font-semibold text-charcoal mb-6">
                <EstimatedDelivery fallback="Ships within 1-2 business days" />
              </p>
            )}

            {/* 规格速览 chips（材料与护理信息保留在底部 Product Details 表） */}
            {quickSpecs.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5 mb-8">
              {quickSpecs.map((spec) => (
                <div key={spec.label} className="flex items-start gap-2.5 rounded-xl bg-white border border-warm-gray px-3.5 py-3">
                  <QuickSpecIcon name={spec.icon} />
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wide text-charcoal-light font-semibold">{spec.label}</p>
                    <p className="text-sm font-medium text-charcoal truncate">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* 运保 + 信任徽章 + 手风琴：桌面端放右栏 Details/规格速览下方（2026-09-29 用户定，原图集下方位置弃用）；移动端在右栏底部 */}
            <div className="hidden lg:block mb-8">
              {shippingCareBlock}
            </div>
            <div className="lg:hidden mb-8">
              {shippingCareBlock}
            </div>

            {/* Pairs Well With 搭配购（2026-10-12 用户定）：手风琴（Product Details 等）下方；
                纯规则配对（枕套↔同尺寸枕芯、床品→睡眠枕芯、坐垫→同系列），
                无销售数据故不用 "Frequently Bought Together" 命名 */}
            <BoughtTogether product={product} />
          </div>
        </div>
      </section>

      {/* 评价区已于 2026-10-12 移至 page.tsx（Recently Viewed 正上方，用户定） */}

      {/* 滚动信任条（2026-09-29 用户定：购买区信任信息精简为免邮/退货两条，
          年销/安全支付/发货时效等更多信任元素移到此处展示；锚点 Tab 条与 Description/Specs 大区已删除。
          桌面端不滚动（用户定）：只渲染一排并居中；移动端双份拼接无缝横滚） */}
      <div className="mt-10 overflow-hidden border-y border-warm-gray bg-white py-3.5">
        <div className="flex w-max animate-marquee lg:w-full lg:justify-center lg:animate-none">
          {[...TRUST_MARQUEE_ITEMS, ...TRUST_MARQUEE_ITEMS].map((text, i) => (
            <span key={i} className={`inline-flex items-center gap-2.5 px-7 text-xs lg:text-sm font-medium text-charcoal whitespace-nowrap ${i >= TRUST_MARQUEE_ITEMS.length ? 'lg:hidden' : ''}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand flex-shrink-0" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <polyline points="8.5 12 11 14.5 15.5 10" />
              </svg>
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* You May Also Like（2026-09-29 用户定：信任条下方、Brand Story 上方；宽度与上下模块一致 80%；
          单行横滑——触屏原生滚动 + 桌面鼠标拖拽（DragScroll），无箭头、无 View All 按钮。
          卡片宽度按"露出半张"设计（用户定：右缘露出下一张的一部分，暗示可滑）：
          桌面可见约 4.5 张（卡宽 = (100% - 4×gap)/4.5）；移动端 w-[38vw] 可见 2 张 + 约 30px 缝隙） */}
      {/* 种草双图区（2026-10-12 用户定）：信任条下方、You May Also Like 上方，
          仅 pillows / cushions 类 PDP 渲染（按类目出对应场景图，跨类目展示不搭）；
          cushions 中 solids 系列出专属场景图（门廊+海滨，用户定）；
          pillows 中 boucle 系列出专属混色场景图（2026-10-13 用户定，AI 生成 2:3 竖图） */}
      {(() => {
        const cat = product.productType.toLowerCase();
        if (cat === 'pillows') {
          // 颈枕（Neck Pillows 子类目，源数据 Travel 归一化为 Pillows/subcategory=neck-pillow）出专属场景图（2026-10-14 用户供图）
          if (product.subcategory === 'neck-pillow') return <V2PdpLifestyle cat="neck" />;
          // 床枕三系列（down / down-feather / microfiber，2026-10-19 用户定）：右图换明亮晨间猫图
          if (group && ['DOWN-PILLOW', 'DOWN-FEATHER-PILLOW', 'MICROFIBER-PILLOW'].includes(group.id))
            return <V2PdpLifestyle cat="bedpillows" />;
          return <V2PdpLifestyle cat={handle.includes('boucle') ? 'boucle' : 'pillows'} />;
        }
        if (cat === 'cushions') {
          // solids / prints（Floral & Prints，2026-10-12 用户供图）各有专属场景图
          const sub = product.subcategory;
          return <V2PdpLifestyle cat={sub === 'solids' ? 'solids' : sub === 'prints' ? 'prints' : 'cushions'} />;
        }
        if (cat === 'bedding') {
          // 100% Linen / Linen-Like / Washed Cotton-Like（展示名 Washed Cotton）/ Satin 各出专属场景图
          // （2026-10-14/15 用户供图 + AI 种草图）；材质口径与面料 PLP 一致（material 原子词精确匹配）
          const mats = specs?.material?.split(', ') ?? [];
          if (mats.includes('100% Linen')) return <V2PdpLifestyle cat="linen" />;
          if (mats.includes('Linen-Like')) return <V2PdpLifestyle cat="linenlike" />;
          if (mats.includes('Washed Cotton-Like')) return <V2PdpLifestyle cat="brushedcotton" />;
          if (mats.includes('Satin')) return <V2PdpLifestyle cat="satin" />;
          return null;
        }
        if (cat === 'towels') {
          // 长绒棉毛巾（mk-towel-lsc，2026-10-16 用户定）：种草图按当前颜色出对应挂杆场景单图
          if (group?.id !== 'mk-towel-lsc') return null;
          const slug = { Cream: 'cream', Oatmeal: 'oatmeal', Sage: 'sage', 'Dusty Rose': 'dustyrose', 'Light Grey': 'lightgrey', 'Dusty Blue': 'dustyblue' }[currentColor || ''] || 'sage';
          return <V2PdpLifestyle cat="towels" towelColor={slug} />;
        }
        return null;
      })()}

      {relatedProducts.length > 0 && (
        <section className="mt-12 mb-12 lg:mt-16 lg:mb-20">
          <div className="mx-auto max-w-[1520px] lg:w-[80%] lg:max-w-none px-6 lg:px-10">
            <h2 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal mb-6 lg:mb-8">
              You May Also Like
            </h2>
            <DragScroll className="flex gap-4 lg:gap-5 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {relatedProducts.map((card) => (
                <div key={card.key} className="w-[38vw] sm:w-[30vw] lg:w-[calc((100%-5rem)/4.5)] flex-shrink-0 snap-start">
                  <GroupProductCard card={card} />
                </div>
              ))}
            </DragScroll>
          </div>
        </section>
      )}

      {/* Brand Story（自动轮转两版：品牌公信力 / 布料工艺）+ Fabric Guide（仅 bedding），
          每屏一个板块，2026-09-29 用户定参照 Parachute 版式 */}
      <PdpStoryBlocks showFabricGuide={isBedding} />

      {/* 全屏图片查看器 */}
      {lightboxOpen && (
        <ImageLightbox
          images={productImages.map((img) => ({ mainUrl: img.lightboxUrl, thumbUrl: img.thumbUrl, altText: img.altText }))}
          index={selectedImage}
          onIndexChange={(i) => { setSelectedImage(i); setMainImageLoaded(false); }}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Size Guide 弹层（bedding PDP，2026-09-28 用户要求）：尺寸 cm/英寸/适配床型对照表 */}
      {sizeGuideOpen && (
        <div
          className="fixed inset-0 z-[1300] flex items-center justify-center bg-charcoal/50 px-4"
          onClick={() => setSizeGuideOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Size guide"
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white shadow-xl px-6 py-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSizeGuideOpen(false)}
              aria-label="Close size guide"
              className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-off-white text-charcoal-light hover:text-charcoal transition flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <p className="text-base font-bold text-charcoal mb-1">Size Guide</p>
            <p className="text-xs text-charcoal-light mb-4">
              {beddingHasFittedSheet ? 'Set dimensions by bed size.' : 'Duvet cover dimensions by size.'}
            </p>
            {beddingHasFittedSheet ? (
              /* 四件套（2026-10-21 用户定）：单表统一格式，按床型分行，被套/床笠/枕套同版式
                 （in 为主 + cm 次行）；尺寸取全店四件套（bedset4/sateen4）真实规格——
                 被套 Twin 68x88 / Full 80x88 / Queen 88x88 / King 104x90 in，
                 床笠 39x75 / 54x75 / 60x80 / 78x80 in（pocket 16 in / 40 cm，用户确认），
                 枕套 20x26 / 20x26 / 20x30 / 20x36 in */
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-charcoal-light border-b border-warm-gray">
                    <th className="py-2 pr-2 font-semibold align-bottom">Size</th>
                    <th className="py-2 pr-2 font-semibold align-bottom">Duvet Cover</th>
                    <th className="py-2 pr-2 font-semibold align-bottom">
                      Fitted Sheet
                      <span className="block text-[10px] font-normal normal-case tracking-normal">
                        16 in (40 cm) pocket
                      </span>
                    </th>
                    <th className="py-2 font-semibold align-bottom">Pillowcases</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Twin', '68 x 88 in', '173 x 224 cm', '39 x 75 in', '99 x 191 cm', '20 x 26 in', '51 x 66 cm'],
                    ['Full', '80 x 88 in', '203 x 224 cm', '54 x 75 in', '137 x 191 cm', '20 x 26 in', '51 x 66 cm'],
                    ['Queen', '88 x 88 in', '224 x 224 cm', '60 x 80 in', '152 x 203 cm', '20 x 30 in', '51 x 76 cm'],
                    ['King', '104 x 90 in', '264 x 229 cm', '78 x 80 in', '198 x 203 cm', '20 x 36 in', '51 x 91 cm'],
                  ].map(([size, duvIn, duvCm, fitIn, fitCm, pcIn, pcCm]) => (
                    <tr key={size} className="border-b border-warm-gray/60 last:border-0">
                      <td className="py-2.5 pr-2 font-medium text-charcoal align-top">{size}</td>
                      {[[duvIn, duvCm], [fitIn, fitCm], [pcIn, pcCm]].map(([inch, cm], i) => (
                        <td key={i} className={`py-2.5 align-top text-charcoal-light ${i < 2 ? 'pr-2' : ''}`}>
                          <span className="block">{inch}</span>
                          <span className="block text-[11px] text-charcoal-light/80">{cm}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-charcoal-light border-b border-warm-gray">
                  <th className="py-2 pr-2 font-semibold">Size (cm)</th>
                  <th className="py-2 pr-2 font-semibold">Inches</th>
                  <th className="py-2 font-semibold">Fits</th>
                </tr>
              </thead>
              <tbody>
                {sizeVariants.map((sv) => {
                  const m = sv.size.match(/(\d+)\s*x\s*(\d+)/i);
                  const a = m ? Number(m[1]) : null;
                  const b = m ? Number(m[2]) : null;
                  const inches = a && b ? `${Math.round(a / 2.54)} x ${Math.round(b / 2.54)} in` : '—';
                  const width = a && b ? Math.min(a, b) : null;
                  const fits = width === null ? '—' : width <= 180 ? 'Twin / Twin XL' : width <= 210 ? 'Full / Queen' : 'King / Cal King';
                  return (
                    <tr key={sv.size} className="border-b border-warm-gray/60 last:border-0">
                      <td className="py-2.5 pr-2 font-medium text-charcoal">{sv.size}</td>
                      <td className="py-2.5 pr-2 text-charcoal-light">{inches}</td>
                      <td className="py-2.5 text-charcoal-light">{fits}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            )}
            <p className="mt-4 text-[11px] leading-relaxed text-charcoal-light">
              {beddingHasFittedSheet
                ? 'Fitted sheet is elasticized all around with a 16 in (40 cm) deep pocket — match it to your mattress size. For the duvet cover, measure your insert and choose the closest size.'
                : 'Pillowcases: 20 x 26 in (51 x 66 cm). Measure your duvet insert and choose the closest cover size.'}
            </p>
          </div>
        </div>
      )}

      {/* 移动端悬浮加购条（2026-10-12 用户定显隐逻辑）：加载不显示；主 CTA 滚出视口 → 滑入；
          回滚至主 CTA 可见 → 收起，直到页面顶端都不再显示 */}
      {isInStock && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-[1200] lg:hidden bg-white border-t border-warm-gray shadow-[0_-4px_16px_rgba(60,45,30,0.10)] px-4 pt-3 flex items-center gap-3 transition-transform duration-300 ${
            mainCtaVisible ? 'translate-y-full' : 'translate-y-0'
          }`}
          style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
        >
          <img
            src={resolveUrl(productImages[0]?.thumbUrl || '')}
            alt={product.title}
            className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-brand leading-tight">{formatPrice(displayPrice, displayCurrency)}</p>
            <p className="text-[11px] text-charcoal-light truncate">{displayTitle}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="h-11 px-6 rounded-full text-sm font-semibold text-cream transition active:scale-95 disabled:opacity-60 flex-shrink-0 bg-brand"
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- 小图标 ---------- */

function QuickSpecIcon({ name }: { name: string }) {
  const common = 'w-[18px] h-[18px] text-brand flex-shrink-0 mt-0.5';
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'layers':
      return <svg className={common} viewBox="0 0 24 24" {...stroke}><path d="M12 2L2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5" /></svg>;
    case 'swatch':
      return <svg className={common} viewBox="0 0 24 24" {...stroke}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>;
    case 'sparkle':
      return <svg className={common} viewBox="0 0 24 24" {...stroke}><path d="M12 3l1.9 5.8L20 10l-5.8 1.9L12 18l-2.2-6.1L4 10l6.1-1.2L12 3z"/><path d="M19 15l.9 2.6L22 18.5l-2.1.9L19 22l-.9-2.6-2.1-.9 2.1-.9L19 15z"/></svg>;
    default:
      return null;
  }
}
