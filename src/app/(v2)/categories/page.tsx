import { Metadata } from 'next';
import V2RelatedGuides from '@/components/v2/V2RelatedGuides';
import GroupProductCard from '@/components/v2/GroupProductCard';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { CATEGORY_DEFS, BEDDING_MATERIAL_ORDER, getSubcategoriesOf } from '@/data/subcategories';
import { buildBlanketFamilies, BLANKET_SECTIONS, blanketSectionOf } from '@/data/blanket-families';
import {
  buildSetFamilies,
  clusterSetFamilies,
  setFamilyKeyOf,
  type SetFamily,
  type SetKind,
} from '@/data/bedding-families';
import { familyKeyOf } from '@/lib/family-cards';
import { buildGroupCards } from '@/lib/group-cards';
import { clusterFamilies, dedupeFamilyColors } from '@/lib/listing-dedupe';
import { sortTowelFamilies, visibleTowelFamilies } from '@/data/towel-families';
import { sortCushionFamilies, visibleCushionFamilies } from '@/data/cushion-families';
import {
  PILLOW_TYPES,
  applyPillowCardMerges,
  isPillowProduct,
  pillowTypeOf,
} from '@/data/pillows-taxonomy';
import { STYLE_DISPLAY_RULES } from '@/data/style-tagged';
import { getStyleTagWithOverride } from '@/data/product-tags';
import { MATERIALS_MAP } from '@/data/materials-map';
import { resolveUrl } from '@/lib/paths';
import V2DragScrollRow from '@/components/v2/V2DragScrollRow';
import { v2url } from '@/lib/v2paths';
import { sortByWeight, weightOf } from '@/lib/weights';

export const metadata: Metadata = {
  title: 'Shop by Category',
  description: 'Browse all Makimoo categories: bedding, pillows, cushions, towels, blankets, mats and more home comfort essentials.',
};

/** 全宽 hero 大图（2026-10-19 用户定：categories 页头改氛围图） */
const HERO_IMAGE = '/images/brand/collection-banner-new.webp';

/**
 * 每类目最多展示 3 排（2026-10-20 用户定），列数与全站 PLP 同节奏（2 / lg:3 / xl:4）：
 * 移动端 3 排 = 6 张、lg = 9 张、xl = 12 张；超出在分区底部出 View More 文字链。
 * 第 7-9 张 lg 起可见、第 10-12 张 xl 才可见，用响应式 hidden 控制，保证任何屏宽都只露 3 排。
 */
const ROW_LIMIT_CLASSES = (i: number) =>
  i >= 9 ? 'hidden xl:block' : i >= 6 ? 'hidden lg:block' : '';

/** View More 的可见性跟随实际被藏掉的卡片：只在「当前屏宽下有卡片被藏」时出现 */
const VIEW_MORE_CLASSES = (total: number) =>
  total <= 9 ? 'lg:hidden' : total <= 12 ? 'xl:hidden' : '';

type FamilyList = ReturnType<typeof buildBlanketFamilies>;

/** bedding 一级页（V2BeddingShop）的分区顺序——与 SECTION_KIND_ORDER 保持一致 */
const SET_SECTION_ORDER: SetKind[] = ['four', 'duvet', 'comforter'];

/**
 * 复刻 V2BeddingShop 的家族排序管道（面料位次 → Queen 代表权重 → 同族聚拢），
 * 按一级页分区顺序平铺，返回 套装家族 key → 位次。
 */
function beddingPlpOrder(inCat: MakimooProduct[]): Map<string, number> {
  const all = buildSetFamilies(inCat);
  // 与 V2BeddingShop.sortFamilies 同口径
  const sortLikePlp = (list: SetFamily[]): SetFamily[] => {
    const rankOf = (f: SetFamily) => {
      const i = BEDDING_MATERIAL_ORDER.indexOf(f.materials[0] || '');
      return i === -1 ? 999 : i;
    };
    const reps = sortByWeight(list.map((f) => f.rep));
    const byRep = new Map(list.map((f) => [f.rep.id, f]));
    const ordered = reps.map((r) => byRep.get(r.id)!).filter(Boolean);
    ordered.sort((a, b) => rankOf(a) - rankOf(b)); // 稳定排序：同面料内保持权重序
    return clusterSetFamilies(ordered);
  };
  const flat = SET_SECTION_ORDER.flatMap((kind) => sortLikePlp(all.filter((f) => f.kind === kind)));
  return new Map(flat.map((f, i) => [f.key, i]));
}

/**
 * 分区内家族卡顺序对齐各一级类目页（2026-10-20 用户定）——直接复用各 PLP 的排序管道，
 * 家族按「在一级页卡片序列中的首次位次」排序（代表品口径差异是早期顺序漂移的根因）：
 * bedding  = V2BeddingShop：buildSetFamilies → 面料位次 → Queen 代表权重 → 同族聚拢，分区平铺；
 * pillows  = V2PillowsShop：同色去重 → 权重 → 家族聚拢 → 列表卡合并，按 PILLOW_TYPES 分区平铺；
 * towels   = V2TowelsShop：sortTowelFamilies → 二级分类注册表分区（家族构建见下方 visibleTowelFamilies）；
 * cushions = V2CushionsShop：sortCushionFamilies → 风格注册表分区；
 * blankets = V2BlanketsShop：系列分区（BLANKET_SECTIONS）→ 代表权重；
 * 其余类目（mats/decor）= /products 默认视图：≥2 风格组且 ≥4 款时按 STYLE_DISPLAY_RULES
 * 分区（分区内 = 同色去重 → 权重 → 家族聚拢），否则整表同口径平铺。
 */
function orderLikeCategoryPage(catValue: string, inCat: MakimooProduct[], families: FamilyList): FamilyList {
  const weightRank = new Map(sortByWeight(families.map((f) => f.rep)).map((r, i) => [r.id, i]));
  const w = (f: FamilyList[number]) => weightRank.get(f.rep.id) ?? 1e9;
  const byIdxThenWeight = (idx: (f: FamilyList[number]) => number) =>
    [...families].sort((a, b) => idx(a) - idx(b) || w(a) - w(b));
  /** 按一级页卡片序列的家族 key 位次排序（找不到的家族沉底，按权重兜底） */
  const byKeyIdx = (keyIdx: Map<string, number>, keyOf: (f: FamilyList[number]) => string) =>
    [...families].sort(
      (a, b) => (keyIdx.get(keyOf(a)) ?? 1e9) - (keyIdx.get(keyOf(b)) ?? 1e9) || w(a) - w(b)
    );
  switch (catValue) {
    case 'bedding':
      return byKeyIdx(beddingPlpOrder(inCat), (f) => setFamilyKeyOf(f.rep.asin));
    case 'pillows': {
      const cards = applyPillowCardMerges(
        clusterFamilies(sortByWeight(dedupeFamilyColors(inCat)))
      ).list;
      const flat = PILLOW_TYPES.flatMap((t) => cards.filter((p) => pillowTypeOf(p) === t.key));
      return byKeyIdx(new Map(flat.map((p, i) => [familyKeyOf(p), i])), (f) => f.key);
    }
    case 'towels': {
      const order = getSubcategoriesOf('towels').map((s) => s.key);
      const idx = (f: FamilyList[number]) => {
        const i = order.indexOf(f.rep.subcategory || '');
        return i < 0 ? 999 : i;
      };
      // Array.sort 稳定：二级分类分区内保持 sortTowelFamilies 的变体组聚拢顺序
      return sortTowelFamilies(families).sort((a, b) => idx(a) - idx(b));
    }
    case 'cushions': {
      const order = getSubcategoriesOf('cushions').map((s) => s.key);
      const idx = (f: FamilyList[number]) => {
        const i = order.indexOf(f.rep.subcategory || '');
        return i < 0 ? 999 : i;
      };
      return sortCushionFamilies(families).sort((a, b) => idx(a) - idx(b));
    }
    case 'blankets':
      return byIdxThenWeight((f) => {
        const i = BLANKET_SECTIONS.findIndex((s) => s.key === blanketSectionOf(f));
        return i < 0 ? 999 : i;
      });
    default: {
      const styleKeyOf = (p: MakimooProduct) =>
        getStyleTagWithOverride(MATERIALS_MAP[p.asin.toLowerCase()]?.title || p.title, p.productType, p.asin).key;
      const deduped = dedupeFamilyColors(inCat);
      const useSections = new Set(inCat.map(styleKeyOf)).size >= 2 && inCat.length >= 4;
      const flat = useSections
        ? STYLE_DISPLAY_RULES.flatMap((rule) =>
            clusterFamilies(sortByWeight(deduped.filter((p) => styleKeyOf(p) === rule.key)))
          )
        : clusterFamilies(sortByWeight(deduped));
      return byKeyIdx(new Map(flat.map((p, i) => [familyKeyOf(p), i])), (f) => f.key);
    }
  }
}

export default function V2CategoriesPage() {
  const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);

  const sections = CATEGORY_DEFS.map((cat) => {
    // 产品范围对齐一级类目页（2026-10-20 用户定）：pillows 含跨挂旅行颈枕（同 isPillowProduct）
    const match = (p: (typeof enriched)[number]) =>
      cat.value === 'pillows'
        ? isPillowProduct(p)
        : p.productType.toLowerCase() === cat.value ||
          p.tags.some((t) => t.toLowerCase().includes(cat.value));

    // 组卡（2026-10-22 用户定：一组一卡 + 色卡——同变体组只出一张卡，色卡展示全部颜色）：
    // 用未去重的全量列表成族（buildBlanketFamilies 需看到全部尺寸 SKU 才有正确 From 价）；
    // 权重 excluded 的产品先剔除（2026-10-20：sortByWeight 会排除它们，一级页不出现，
    // categories 对齐一级页口径不同步展示）；
    // towels/cushions 复用一级页的成族口径（towels 按二级分类分族；cushions 剔除隐藏款）；
    // 卡片顺序 2026-10-20 用户定：对齐各一级类目页的排列顺序（见 orderLikeCategoryPage），
    // 并卡后每类最多取 12 个组（xl 3 排，小屏按上表再裁）
    const inCat = enriched.filter(match).filter((p) => !weightOf(p.asin)?.excluded);
    const baseFamilies =
      cat.value === 'towels'
        ? visibleTowelFamilies(inCat)
        : cat.value === 'cushions'
          ? visibleCushionFamilies(inCat)
          : buildBlanketFamilies(inCat);
    const allFamilies = orderLikeCategoryPage(cat.value, inCat, baseFamilies);
    const allCards = buildGroupCards(allFamilies);
    const families = allCards.slice(0, 12);

    return { ...cat, families, totalFamilies: allCards.length };
  }).filter((s) => s.families.length > 0);

  const totalStyles = sections.reduce((sum, s) => sum + s.totalFamilies, 0);

  return (
    <>
      {/* 全宽 hero：大图烘托氛围（2026-10-19 用户定；替代原 V2PageHeader 面包屑页头，顶部导航/面包屑移除） */}
      <section className="relative w-full h-[36vh] lg:h-[46vh] overflow-hidden">
        <img
          src={resolveUrl(HERO_IMAGE)}
          alt="Makimoo comfort essentials styled in a warm sunlit bedroom"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 via-charcoal/20 to-transparent" />
        {/* 2026-10-20 用户定：移动端文字上移到图片上方浅色区（白字可读），桌面保持垂直居中 */}
        <div className="absolute inset-0 flex items-start pt-8 lg:pt-0 lg:items-center">
          {/* 2026-10-20 用户定：categories 页版心对齐 bedding 列表页（全宽 px-3 lg:px-10） */}
          <div className="w-full px-3 lg:px-10">
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-cream">
              Shop by Category
            </h1>
            <p className="mt-3 lg:mt-4 text-sm lg:text-base text-cream/85 max-w-xl">
              Bedding, pillows, cushions, towels, blankets, mats and more — browse {totalStyles} comfort essentials by category.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-off-white">
        {/* 2026-10-20 用户定：版心与 bedding 列表页一致（全宽 px-3 lg:px-10，不再 80% 居中）；
            顶部 padding 收紧（pt-1 lg:pt-3），hero 与锚点条间距对齐 bedding 页 hero 快链（移动端 mt-3=12px 口径） */}
        <div className="px-3 lg:px-10 pt-1 lg:pt-3 pb-10 lg:pb-14">

          {/* 类目锚点导航条（2026-10-20 用户定：hero 下方类目快链，点击平滑跳转到对应分区；
              样式仿 /products?cat=bedding hero 快链——桌面文字链接带 ›，移动端横滑 pill；
              吸顶跟随滚动：top 对齐页头高度（移动端实测 52px——py-2 + logo h-9；桌面 88px），
              负 margin 让实底背景打满屏宽，z-30 低于移动端抽屉遮罩 z-40） */}
          <nav
            className="lg:hidden sticky top-[52px] z-30 bg-off-white -mx-3 px-3 py-2 mb-2 flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Categories"
          >
            {sections.map((cat) => (
              <a
                key={cat.value}
                href={`#cat-${cat.value}`}
                className="flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full border border-warm-gray bg-white text-xs text-charcoal hover:border-brand hover:text-brand transition-colors"
              >
                {cat.label}
              </a>
            ))}
          </nav>
          {/* 桌面端同上（2026-10-20 用户定：屏宽不足不换行，单行可拖拽滚动，见 V2DragScrollRow） */}
          <V2DragScrollRow
            className="hidden lg:flex flex-nowrap sticky top-[88px] z-30 bg-off-white -mx-10 px-10 py-3 mb-4 items-center gap-x-7 gap-y-2 text-sm"
            ariaLabel="Categories"
          >
            {sections.map((cat) => (
              <a
                key={cat.value}
                href={`#cat-${cat.value}`}
                className="group inline-flex items-center gap-1 text-charcoal hover:text-brand transition-colors"
              >
                {cat.label}
                <span className="transition-transform group-hover:translate-x-0.5">›</span>
              </a>
            ))}
          </V2DragScrollRow>

          {/* 类目分区：仿 bedding 页格局——分区标题（带 styles 角标）+ 简介 + 家族卡网格，
              分区间细分隔线；scroll-mt 避让 fixed 页头供锚点跳转。
              不用 Reveal 包分区（2026-10-20 修复）：分区高达 ~2000px，Reveal 的
              IntersectionObserver threshold 0.1 要求整元素 10% 入视口（≈200px），
              首屏只能露出一百余像素永远达不到阈值 → 整页分区卡在 opacity:0 全空白 */}
          <div>
            {sections.map((cat, i) => (
              <section
                key={cat.value}
                id={`cat-${cat.value}`}
                className={`scroll-mt-32 lg:scroll-mt-36 py-10 lg:py-14 ${
                  i === 0 ? 'pt-2 lg:pt-4' : 'border-t border-[#E8E2DA]'
                }`}
              >
                  <div className="mb-5 lg:mb-8">
                    <h2 className="text-lg lg:text-2xl font-extrabold text-charcoal">
                      {cat.label}
                      <sup className="ml-1.5 align-super text-xs lg:text-sm font-semibold text-[#999]">
                        {cat.totalFamilies}
                      </sup>
                    </h2>
                    <p className="mt-1 text-xs lg:text-sm text-[#999]">{cat.intro}</p>
                  </div>

                  {/* 组卡网格（图 / 标题 / 色卡行 / From 价）；最多 3 排，超出见底部 View More */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
                    {cat.families.map((c, fi) => (
                      <div key={c.key} className={`min-w-0 ${ROW_LIMIT_CLASSES(fi)}`}>
                        <GroupProductCard
                          card={c}
                          compactText
                        />
                      </div>
                    ))}
                  </div>

                  {/* View More（2026-10-20 用户定：分割简洁、不侵入、不带横线）：居中文字链，进该类目完整列表页 */}
                  {cat.totalFamilies > 6 && (
                    <div
                      className={`mt-6 lg:mt-8 text-center ${VIEW_MORE_CLASSES(cat.totalFamilies)}`}
                    >
                      <a
                        href={v2url(`/products/?cat=${cat.value}`)}
                        className="group inline-flex items-center gap-1.5 text-xs lg:text-sm font-medium tracking-widest uppercase text-charcoal-light transition-colors hover:text-brand"
                      >
                        View more {cat.label}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </a>
                    </div>
                  )}
                </section>
            ))}
          </div>

          {/* 页尾：指南入口（未配置类目 → 最新 3 篇 blog） */}
          <div className="mt-20 lg:mt-28">
            <V2RelatedGuides cat="all" heading="Need help deciding?" />
          </div>
        </div>
      </section>
    </>
  );
}
