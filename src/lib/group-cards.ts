/**
 * 组卡共享辅助（2026-10-22 新增）：全站产品卡从「组::颜色」家族卡升级为「一组一卡 + 色卡」——
 * 同一变体组只出一张卡，卡上用圆形实拍小图色卡（swatch）展示全部颜色，点色卡联动切换
 * 卡面主图/价格/评分，点卡身跳转当前选中色的 PDP（组件见 GroupProductCard.tsx）。
 *
 * 刻意拆卡策略不变（在更上游的成族/过滤逻辑里，本模块不感知）：
 * towels 按二级分类拆卡（buildBlanketFamilies extraKey）、cushions 隐藏 Set of 4、
 * bedding 剔除缎面 1688 组 + BEDSET4-BC 纯色组。
 *
 * 代表款选择：调用方传入已排序的家族列表（在售优先/权重序），组卡代表 = 首个家族的 rep。
 */
import { getVariantGroupOf } from '@/data/variant-groups';
import { CARD_SQUARE_IMAGE_ASINS } from '@/data/image-aspect-overrides';
import { buildBlanketFamilies, type BlanketFamily } from '@/data/blanket-families';
import { spotlightImage } from '@/components/v2/card-utils';
import { familyCardDisplay, familyKeyOf, familyColorOf } from '@/lib/family-cards';
import type { MakimooProduct } from '@/data/products';
import type { V2CardProduct } from '@/components/v2/V2ProductCard';

/** 组卡单个颜色变体（色卡成员）：缩略图口径同 PDP 色点（shopifyImages[0] || images[0].url），
 *  卡面主图口径 = spotlightImage（与初始卡图同源，避免点色卡后图跳变） */
export interface GroupCardVariant {
  asin: string;
  handle: string;
  color: string;
  /** 色卡圆形缩略图（PDP 色点口径） */
  thumb: string;
  /** 选中该色后的卡面主图（spotlightImage 口径） */
  imageUrl: string;
  imageAlt: string;
  /** 该色家族 From 价（同色多尺寸取最低） */
  price: string;
  currency: string;
  rating?: number;
  reviewCount?: number;
  /** 缺货成员灰显但仍可点看（2026-10-22 用户定） */
  inStock: boolean;
  /** 当前图为套装场景时 object-cover 居中 50%；折叠图不设此标记，继续走 80% 焦点 */
  centerCrop?: boolean;
  /** 卡面 1:1 方图不裁切（CARD_SQUARE_IMAGE_ASINS 白名单，2026-10-22 用户定） */
  squareImage?: boolean;
}

/** 组卡 rep 精简字段：父组件算展示 flag/分区用（imageWhiteBg/subcategory/asin 等），卡组件本身不读 */
export type GroupCardRep = Pick<
  MakimooProduct,
  | 'id'
  | 'asin'
  | 'title'
  | 'handle'
  | 'productType'
  | 'subcategory'
  | 'tags'
  | 'imageWhiteBg'
  | 'rating'
  | 'reviewCount'
>;

export interface GroupCard {
  /** 组 key：变体组 id（towels 拆卡带 ::二级分类 后缀）；无变体组单品 = asin 小写 */
  key: string;
  rep: GroupCardRep;
  /** 卡面标题覆盖（familyCardDisplay 分派，与 PLP 同口径；颜色部分由色卡取代，不再有 colorLine） */
  titleOverride?: string;
  /** 默认跳转 = 组代表 PDP（未选色时点卡身 / 点 +N 圆点） */
  handle: string;
  /** 默认卡面主图 = 组代表 spotlightImage */
  imageUrl: string;
  imageAlt: string;
  rating?: number;
  reviewCount?: number;
  /** 组内最低价（初始显示 "From $xx"） */
  fromPrice: string;
  currency: string;
  /** 首屏默认选中的颜色（PDP 相关推荐等 = 打分最高成员的颜色）；缺省不选中 */
  initialColor?: string;
  /** 每色一个变体（顺序 = 家族列表顺序）；空数组 = 无变体组单品（无色卡单卡） */
  variants: GroupCardVariant[];
  /** 默认卡面为套装场景时居中 50%；折叠入口图不设此标记 */
  centerCrop?: boolean;
  /** 卡面 1:1 方图不裁切（CARD_SQUARE_IMAGE_ASINS 白名单，按卡面当前显示图判定） */
  squareImage?: boolean;
  /** bedding 家族材质（badge 数据口径保留；badge 开关全站关闭中，见 GroupProductCard） */
  materials?: string[];
}

/** 家族 → 组 key：有变体组 = 组 id（保留 towels 拆卡的 ::二级分类 后缀）；无组 = 家族 key（asin） */
export function groupKeyOfFamily(f: Pick<BlanketFamily, 'key' | 'color' | 'rep'>): string {
  const g = getVariantGroupOf(f.rep.asin);
  if (!g) return f.key;
  // buildBlanketFamilies 系家族 key = `${组id}::${颜色}[::extraKey]`（towels extraKey = 二级分类）：
  // 去掉颜色段、保留拆卡后缀；bedding SetFamily key 非此形式（如 bedset4-gray）→ 直接按组并卡
  const prefix = `${g.id}::`;
  if (f.key.startsWith(prefix)) {
    const rest = f.key.slice(prefix.length);
    if (rest === f.color) return g.id;
    if (rest.startsWith(`${f.color}::`)) return g.id + rest.slice(f.color.length);
  }
  return g.id;
}

/** 产品 → 组 key（无拆卡后缀的平口径；全量组卡索引/推荐位折叠用） */
export function groupKeyOfProduct(p: { asin: string }): string {
  return getVariantGroupOf(p.asin)?.id ?? p.asin.toLowerCase();
}

const slimRep = (p: MakimooProduct): GroupCardRep => ({
  id: p.id,
  asin: p.asin,
  title: p.title,
  handle: p.handle,
  productType: p.productType,
  subcategory: p.subcategory,
  tags: p.tags,
  imageWhiteBg: p.imageWhiteBg,
  rating: p.rating,
  reviewCount: p.reviewCount,
});

const inStockOf = (p: MakimooProduct): boolean =>
  p.hasShopifyData === true && p.shopifyAvailable === true;

// 2026-10-24 用户定：仅独立被套的非入口变体使用套装 3:4 场景图，需居中 50% 裁剪；
// 折叠入口图（images[0]=1.webp）为 3:4 原图，不标 centerCrop，无需焦点偏移。
const centerCropOf = (p: MakimooProduct): boolean =>
  /-duvet$/.test(p.asin.toLowerCase()) && p.images[0]?.url.endsWith('/1-3x4.webp') === true;

/** 家族列表（已排序）→ 组卡列表：同组家族并成一张卡，每色一个色卡变体 */
export function buildGroupCards(
  families: (Pick<BlanketFamily, 'key' | 'color' | 'rep' | 'sizes' | 'fromPrice' | 'currency'> & {
    materials?: string[];
  })[]
): GroupCard[] {
  const groups = new Map<string, { fams: typeof families }>();
  for (const f of families) {
    const k = groupKeyOfFamily(f);
    const e = groups.get(k);
    if (e) e.fams.push(f);
    else groups.set(k, { fams: [f] });
  }
  return Array.from(groups.entries()).map(([key, e]) => {
    const fs = e.fams;
    // 2026-10-24 用户定：LINEN3-DUVET / PERCALE-DUVET 以组首成员（2026-10-25 起 Ivory / Sky Queen）为唯一入口；
    // 2026-10-26 用户定：VELSTRIPE 同口径（组首 = Charcoal Queen，卡面主图 = 组首 featuredImage）；
    // 2026-10-26 用户定：1688-1071466105053 格纹组同口径（组首 = Black Queen；同日迁移 1688 sku，组首不变）；其他变体组代表规则不变
    const preferredAsin = key === 'LINEN3-DUVET' || key === 'PERCALE-DUVET' || key === 'VELSTRIPE' || key === '1688-1071466105053'
      ? getVariantGroupOf(fs[0].rep.asin)?.members[0]?.asin.toLowerCase()
      : undefined;
    // 2026-10-26 用户定：地毯组卡优先用「代表 SKU 已上架」的色作代表（卡面图/链接/标题/From 价落到可买页）；
    // 其它类目维持原顺序取第一个家族
    const launchedRepFam = fs.find(
      (f) => f.rep.productType === 'Mats' && f.rep.hasShopifyData === true && f.rep.shopifyAvailable === true
    );
    const repFam = preferredAsin
      ? fs.find((f) => f.rep.asin.toLowerCase() === preferredAsin) ?? fs[0]
      : launchedRepFam ?? fs[0];
    const rep = repFam.rep;
    // 尺寸并集：cushions 等标题规则（cushionCardTitle）需要家族尺寸带
    const sizes: string[] = [];
    for (const f of fs) for (const s of f.sizes) if (!sizes.includes(s)) sizes.push(s);
    const prices = fs
      .map((f) => parseFloat(f.fromPrice))
      .filter((n) => !Number.isNaN(n) && n > 0);
    // 每色一个变体；同色重复家族兜底去重（首个 = 顺序最优）
    // 2026-10-24：rep 家族（如 LINEN3-DUVET 的 Ivory）排在色卡第一位；
    // PERCALE-DUVET 色卡顺序对齐变体组成员颜色顺序（Sky/Mist/Coconut/Nude，与 PERCALE 套装组一致）；
    // 2026-10-26：VELSTRIPE 同口径（色卡顺序 = 组内成员顺序 Charcoal/Sage/Denim）；
    // 2026-10-26：1688-1071466105053 格纹组同口径（色卡顺序 = 组内成员顺序 Black/Blue/Grey）；
    // 同色多尺寸家族（Mist）取 Queen 尺寸成员为该色代表（入口=折叠图口径）
    const memberOrder = key === 'PERCALE-DUVET' || key === 'VELSTRIPE' || key === '1688-1071466105053' ? getVariantGroupOf(fs[0].rep.asin)?.members : undefined;
    const memberIdxOf = (f: (typeof fs)[number]): number => {
      const i = memberOrder?.findIndex((m) => m.color.trim().toLowerCase() === f.color.trim().toLowerCase()) ?? -1;
      return i < 0 ? 999 : i;
    };
    const queenRankOf = (f: (typeof fs)[number]): number => {
      const m = memberOrder?.find((x) => x.asin.toLowerCase() === f.rep.asin.toLowerCase());
      return m?.size === '220 x 220 cm' ? 0 : 1;
    };
    const orderedFams = memberOrder
      ? [...fs].sort((a, b) => memberIdxOf(a) - memberIdxOf(b) || queenRankOf(a) - queenRankOf(b))
      : repFam === fs[0] ? fs : [repFam, ...fs.filter((f) => f !== repFam)];
    const seen = new Set<string>();
    const variants: GroupCardVariant[] = [];
    for (const f of orderedFams) {
      const ck = f.color.trim().toLowerCase();
      if (seen.has(ck)) continue;
      seen.add(ck);
      const img = spotlightImage(f.rep);
      variants.push({
        asin: f.rep.asin,
        handle: f.rep.handle,
        color: f.color,
        thumb: f.rep.shopifyImages?.[0] || f.rep.images[0]?.url || '',
        imageUrl: img.url,
        imageAlt: img.altText,
        price: f.fromPrice,
        currency: f.currency,
        rating: f.rep.rating,
        reviewCount: f.rep.reviewCount,
        inStock: inStockOf(f.rep),
        ...(centerCropOf(f.rep) ? { centerCrop: true } : {}),
        ...(CARD_SQUARE_IMAGE_ASINS.has(f.rep.asin.toLowerCase()) ? { squareImage: true } : {}),
      });
    }
    const img = spotlightImage(rep);
    // 2026-10-26 用户定：地毯类优先用已上架色的价格算 From（未上架色的低价不可购买，避免误导）
    const sellablePrices = variants
      .filter((v) => v.inStock)
      .map((v) => parseFloat(v.price))
      .filter((n) => !Number.isNaN(n) && n > 0);
    const fromPrices = rep.productType === 'Mats' && sellablePrices.length > 0 ? sellablePrices : prices;
    return {
      key,
      rep: slimRep(rep),
      titleOverride: familyCardDisplay({ rep, sizes, color: repFam.color }).titleOverride,
      handle: rep.handle,
      imageUrl: img.url,
      imageAlt: img.altText,
      rating: rep.rating,
      reviewCount: rep.reviewCount,
      fromPrice: fromPrices.length > 0 ? String(Math.min(...fromPrices)) : '',
      currency: repFam.currency,
      variants,
      materials: repFam.materials,
      ...(centerCropOf(rep) ? { centerCrop: true } : {}),
      ...(CARD_SQUARE_IMAGE_ASINS.has(rep.asin.toLowerCase()) ? { squareImage: true } : {}),
    };
  });
}

/** 未去重的 enriched 产品列表 → 组卡列表（/products 网格/搜索结果的组折叠用；保持入参顺序） */
export function collapseProductsToGroupCards(products: MakimooProduct[]): GroupCard[] {
  return buildGroupCards(buildBlanketFamilies(products));
}

/**
 * 精简卡（V2CardProduct）列表 → 组卡列表（首页 color/scene 横轨、V2Recommended 用，
 * 这些 client 组件不引入全量目录）：按 familyKey 前缀（组 id）并卡，色卡变体 = 列表内在场颜色
 * （上游均为在售筛选，inStock 恒 true；rating 由 toCardProduct 注入后可用）。
 */
export function buildGroupCardsFromCards(cards: V2CardProduct[]): GroupCard[] {
  const groups = new Map<string, V2CardProduct[]>();
  for (const c of cards) {
    const key = (c.familyKey ?? familyKeyOf(c)).split('::')[0];
    const list = groups.get(key);
    if (list) list.push(c);
    else groups.set(key, [c]);
  }
  return Array.from(groups.entries()).map(([key, list]) => {
    const seen = new Set<string>();
    const variants: GroupCardVariant[] = [];
    for (const c of list) {
      const color = c.familyColor ?? familyColorOf(c);
      const ck = color.trim().toLowerCase();
      if (seen.has(ck)) continue;
      seen.add(ck);
      const img = spotlightImage(c as MakimooProduct);
      variants.push({
        asin: c.asin,
        handle: c.handle,
        color,
        thumb: c.shopifyImages?.[0] || c.images[0]?.url || '',
        imageUrl: img.url,
        imageAlt: img.altText,
        price: c.shopifyPrice || c.priceRange.minVariantPrice.amount,
        currency: c.shopifyCurrencyCode || c.priceRange.minVariantPrice.currencyCode,
        rating: c.rating,
        reviewCount: c.reviewCount,
        inStock: true,
        ...(CARD_SQUARE_IMAGE_ASINS.has(c.asin.toLowerCase()) ? { squareImage: true } : {}),
      });
    }
    const rep = list[0];
    const prices = variants
      .map((v) => parseFloat(v.price))
      .filter((n) => !Number.isNaN(n) && n > 0);
    const img = spotlightImage(rep as MakimooProduct);
    return {
      key,
      rep: rep as unknown as GroupCardRep,
      titleOverride: familyCardDisplay({
        rep: rep as MakimooProduct,
        sizes: [],
        color: variants[0]?.color ?? '',
      }).titleOverride,
      handle: rep.handle,
      imageUrl: img.url,
      imageAlt: img.altText,
      rating: rep.rating,
      reviewCount: rep.reviewCount,
      fromPrice: prices.length > 0 ? String(Math.min(...prices)) : '',
      currency: variants[0]?.currency ?? 'USD',
      variants,
      ...(CARD_SQUARE_IMAGE_ASINS.has(rep.asin.toLowerCase()) ? { squareImage: true } : {}),
    };
  });
}
