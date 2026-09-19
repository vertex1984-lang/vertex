'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { getLocalCart, getShopifyCart, openMiniCart } from '@/lib/cart';
import { getFavorites } from '@/lib/favorites';
import { searchProducts, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';

// V2 导航：cat 非空的项带 mega menu（该类目在售风格 + 示例图卡）
// 首项 Featured 只作弹窗入口（href 空 = 菜单标题/移动端主项不跳转）；
// 弹窗子项指向两个独立精选页 /best-sellers、/new-arrivals
//（/featured-products 已隐藏并移除导航入口，2026-09 用户要求），
// 原 /featured 汇总页保留但全站无入口
const navLinks = [
  { label: 'Featured', href: '', cat: 'featured' },
  { label: 'Bedding', href: '/products?cat=bedding', cat: 'bedding' },
  { label: 'Pillows', href: '/products?cat=pillows', cat: 'pillows' },
  { label: 'Cushions', href: '/products?cat=cushions', cat: 'cushions' },
  { label: 'Towels', href: '/products?cat=towels', cat: 'towels' },
  { label: 'Mats', href: '/products?cat=mats', cat: 'mats' },
  { label: 'Blankets', href: '/products?cat=blankets', cat: 'blankets' },
  { label: 'Decor', href: '/products?cat=decor', cat: 'decor' },
  { label: 'Dining', href: '/products?cat=dining', cat: 'dining' },
  // Blog 不放在顶部导航（2026-09 用户要求），仅保留底部 footer 入口
];

// Featured 弹窗的左侧子项：两个独立精选页（Featured Products 项已随页面隐藏移除）
const FEATURED_SUBS = [
  { label: 'Best Sellers', href: '/best-sellers' },
  { label: 'New Arrivals', href: '/new-arrivals' },
];

// Mega menu 右侧示例图卡（每类 1-2 张：collections 分类图 + featured 场景图；Featured 为 2 张对应两个模块）
interface MenuCard {
  image: string;
  caption: string;
  linkLabel: string;
  href: string;
}
const MEGA_CARDS: Record<string, MenuCard[]> = {
  featured: [
    { image: '/images/featured/b0cbt7r7nn.webp', caption: 'Customer Favorites', linkLabel: 'Best Sellers', href: '/best-sellers' },
    { image: '/images/products/B0F1XFWZVY/1.webp', caption: 'Just Landed', linkLabel: 'New Arrivals', href: '/new-arrivals' },
  ],
  bedding: [
    { image: '/images/collections/bedding.webp', caption: 'Soft, breathable bedding sets.', linkLabel: 'Shop Bedding', href: '/products?cat=bedding' },
    { image: '/images/featured/bedset4-beige-full.webp', caption: 'All-season comfort, easy care.', linkLabel: 'Shop Duvet Sets', href: '/products?cat=bedding' },
  ],
  blankets: [
    { image: '/images/collections/blanket.webp', caption: 'Plush throws for couch & bed.', linkLabel: 'Shop Blankets', href: '/products?cat=blankets' },
    { image: '/images/products/1688-969627065032-C39/1.webp', caption: 'Faux rabbit fur softness.', linkLabel: 'Shop Faux Fur', href: '/products?cat=blankets' },
  ],
  cushions: [
    { image: '/images/collections/cushions.webp', caption: 'Comfort for every seat.', linkLabel: 'Shop Cushions', href: '/products?cat=cushions' },
    { image: '/images/products/B0CBT7R7NN/1.webp', caption: 'A best seller for a reason.', linkLabel: 'Shop Rocking Chair', href: '/products?cat=cushions&sub=rocking' },
  ],
  pillows: [
    { image: '/images/collections/pillows.webp', caption: 'Plush fillings, premium covers.', linkLabel: 'Shop Pillows', href: '/products?cat=pillows' },
    { image: '/images/featured/b0cqc5qjfj.webp', caption: 'Refresh any room.', linkLabel: 'Shop Pillow Inserts', href: '/products?cat=pillows&sub=basic' },
  ],
  towels: [
    { image: '/images/collections/towels.webp', caption: 'Hotel-style cotton, every day.', linkLabel: 'Shop Towels', href: '/products?cat=towels' },
    { image: '/images/products/1688-952595759182/1.webp', caption: 'Oversized and quick-drying.', linkLabel: 'Shop Beach Towels', href: '/products?cat=towels&sub=beach' },
  ],
  mats: [
    { image: '/images/collections/mats.webp', caption: 'Soft grounding for every room.', linkLabel: 'Shop Mats', href: '/products?cat=mats' },
    { image: '/images/products/1688-1046667161713/1.webp', caption: 'Cushioned comfort underfoot.', linkLabel: 'Shop Kitchen Mats', href: '/products?cat=mats&sub=kitchen' },
  ],
  others: [
    { image: '/images/collections/others.webp', caption: 'Extras for daily living.', linkLabel: 'Shop Others', href: '/products?cat=others' },
    { image: '/images/featured/b0bzcln57s.webp', caption: 'Comfort on the road.', linkLabel: 'Shop Travel', href: '/products?cat=others&sub=travel' },
  ],
  decor: [
    { image: '/images/products/1688-807393887857-C2/1.webp', caption: 'Framed canvas, tribal style.', linkLabel: 'Shop Wall Art', href: '/products?cat=decor&sub=wall-art' },
    { image: '/images/products/1688-730512046265-C2/1.webp', caption: 'Boho burlap textures.', linkLabel: 'Shop Boho Art', href: '/products?cat=decor&sub=wall-art' },
  ],
  dining: [
    { image: '/images/products/1688-899672152256-C2/1.webp', caption: 'Handwoven rattan trays.', linkLabel: 'Shop Trays', href: '/products?cat=dining&sub=trays' },
    { image: '/images/products/1688-743606980882-C2/1.webp', caption: 'Serve & display in style.', linkLabel: 'Shop Serving', href: '/products?cat=dining&sub=trays' },
  ],
};

// 热门搜索关键词（hardcode 占位，可后续按真实搜索数据替换）
const HOT_SEARCHES = ['Cushions', 'Pillows', 'Towels', 'Mats', 'Neck Pillow'];

interface V2HeaderProps {
  /** 各类目（小写 productType）在售产品的风格列表，服务端 stylesByCategory() 传入；
   *  导航下拉子项与 /products Collections、首页 Shop by Style 同步（2026-09 用户定） */
  catStyles?: Record<string, { key: string; label: string }[]>;
}

export default function V2Header({ catStyles = {} }: V2HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MakimooProduct[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);
  // Mega menu：当前展开的分类（'' = 收起）
  const [openMenu, setOpenMenu] = useState('');
  // 移动抽屉顶端对齐到页头下缘（页头保持露出可点）；打开瞬间量一次页头高度
  const headerRef = useRef<HTMLDivElement>(null);
  const [drawerTop, setDrawerTop] = useState(96);
  // 抽屉里当前展开二级类目的一级类目（'' = 全部折叠）；抽屉关闭时复位
  const [expandedCat, setExpandedCat] = useState('');
  useEffect(() => {
    if (!mobileOpen) setExpandedCat('');
  }, [mobileOpen]);

  useEffect(() => {
    // 滞回阈值：滚动超过 60px 变实底，回到 30px 以下才恢复透明，
    // 避免在阈值附近来回抖动
    let last = false;
    const onScroll = () => {
      const y = window.scrollY;
      const next = last ? y > 30 : y > 60;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // 只有移动端菜单锁定滚动；搜索面板不锁定（原页面保持可交互）
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen, searchOpen]);

  // Esc 关闭搜索遮罩、mega menu 和移动端菜单
  useEffect(() => {
    if (!mobileOpen && !searchOpen && !openMenu) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setSearchOpen(false);
        setOpenMenu('');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen, searchOpen, openMenu]);

  // 路由变化时收起 mega menu
  useEffect(() => {
    setOpenMenu('');
  }, [pathname]);

  // 购物车角标：本地购物车 + Shopify 购物车数量之和
  // 仅在 mount 和购物车变化事件时刷新（Shopify 数量需一次 API 请求，不在渲染期发起）
  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const localCount = getLocalCart().reduce((sum, item) => sum + item.quantity, 0);
      let shopifyCount = 0;
      const cart = await getShopifyCart();
      if (cart?.lines?.edges) {
        shopifyCount = cart.lines.edges.reduce(
          (sum: number, edge: { node: { quantity: number } }) => sum + edge.node.quantity,
          0
        );
      }
      if (!cancelled) setCartCount(localCount + shopifyCount);
    };
    refresh();
    window.addEventListener('makimoo:cart-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      cancelled = true;
      window.removeEventListener('makimoo:cart-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // 收藏角标
  useEffect(() => {
    const refresh = () => setFavCount(getFavorites().length);
    refresh();
    window.addEventListener('makimoo:favorites-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('makimoo:favorites-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // 搜索建议：300ms 防抖，本地即时过滤
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      setSuggestions(enrichProductsWithShopifyData(searchProducts(q)).slice(0, 6));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    window.location.href = v2url(`/products/?q=${encodeURIComponent(q)}`);
  };

  // 只有首页（/）和 About（/about/）有大图页头，保持「透明 → 滚动实底」；
  // 其余页面是浅色页头，从首屏起即为实底样式，避免 cream 文字看不清
  const normalizedPath = (pathname || '').replace(/\/+$/, '');
  const transparentStart = normalizedPath === '' || normalizedPath === '/about';
  // mega menu 展开时强制实底，保证导航文字在面板上可读
  const solid = scrolled || !transparentStart || openMenu !== '';

  // 透明态（首屏大图）用 cream 文字，实底后用 charcoal
  const textColor = solid ? 'text-charcoal' : 'text-cream';
  const iconHover = solid
    ? 'hover:bg-brand/10 hover:text-brand'
    : 'hover:bg-cream/15 hover:text-cream';

  return (
    <>
      <div ref={headerRef} className="fixed top-0 z-50 w-full">
        {/* Announcement Bar：向下滚动超过阈值后收起（桌面/移动一致），回到顶部附近再展开 */}
        <div
          className={`bg-brand text-cream text-center text-xs font-medium tracking-wide px-4 overflow-hidden transition-all duration-300 ${
            scrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-10 py-2 opacity-100'
          }`}
        >
          Free Shipping on Orders Over $49 | 30-Day Easy Returns
        </div>

        <header
          className={`flex items-center justify-between px-6 lg:px-10 py-4 transition-all duration-300 ${textColor} ${
            solid ? 'bg-off-white/95 backdrop-blur shadow-md' : 'bg-transparent'
          }`}
        >
          <a href={v2url('/')} className="flex items-center gap-2">
            <img
              src={resolveUrl('/images/brand/makimoo-logo.webp')}
              alt="Makimoo"
              className="h-12 lg:h-14 w-auto object-contain transition-all duration-300"
              style={solid ? undefined : { filter: 'brightness(0) invert(1)' }}
            />
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => {
              const navCls = 'relative py-1 text-base hover:text-brand transition-colors group';
              const underline = (
                <span className={`absolute bottom-0 left-0 h-0.5 bg-brand transition-all ${
                  openMenu && openMenu === link.cat ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              );
              // Featured 没有落地页（href 为空）：用 button 只切换 mega menu，
              // 避免空 href 的 <a> 在中键点击/无 JS 时刷新当前页
              if (!link.href) {
                return (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => setOpenMenu((prev) => (prev === link.cat ? '' : link.cat))}
                    aria-expanded={openMenu === link.cat}
                    className={navCls}
                  >
                    {link.label}
                    {underline}
                  </button>
                );
              }
              return (
                <a
                  key={link.href}
                  href={v2url(link.href)}
                  onClick={(e) => {
                    // 带 mega menu 的导航项：点击切换菜单展开/收起，不直接跳转
                    //（汇总页/类目页从菜单内的标题链接进入）
                    if (!link.cat) return;
                    e.preventDefault();
                    setOpenMenu((prev) => (prev === link.cat ? '' : link.cat));
                  }}
                  aria-expanded={link.cat ? openMenu === link.cat : undefined}
                  className={navCls}
                >
                  {link.label}
                  {underline}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className={`w-11 h-11 rounded-full transition flex items-center justify-center ${iconHover}`}
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16" y2="16"/>
              </svg>
            </button>

            {/* 收藏入口（带数量角标；暂无独立收藏页，点击进商品汇总页） */}
            <a
              href={v2url('/favorites/')}
              className={`relative w-11 h-11 rounded-full transition flex items-center justify-center ${iconHover}`}
              aria-label={favCount > 0 ? `Favorites, ${favCount} items` : 'Favorites'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {favCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-cream text-[10px] font-bold flex items-center justify-center">
                  {favCount > 99 ? '99+' : favCount}
                </span>
              )}
            </a>

            <button
              onClick={openMiniCart}
              className={`relative w-11 h-11 rounded-full transition flex items-center justify-center ${iconHover}`}
              aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M6 6L5 3H2"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-cream text-[10px] font-bold flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* 汉堡按钮 = 抽屉开关：打开时图标变 ×，再点一次关闭（页头始终露出在抽屉上方） */}
            <button
              onClick={() => {
                if (!mobileOpen) {
                  setDrawerTop(headerRef.current?.offsetHeight ?? 96);
                }
                setMobileOpen((v) => !v);
              }}
              className="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1"
              aria-label={mobileOpen ? 'Close menu' : 'Menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <span className="text-2xl leading-none">&times;</span>
              ) : (
                <>
                  <span className="block w-5 h-0.5 bg-current rounded" />
                  <span className="block w-5 h-0.5 bg-current rounded" />
                  <span className="block w-5 h-0.5 bg-current rounded" />
                </>
              )}
            </button>
          </div>

          {/* Search Panel：导航下方的下拉面板，不遮全屏、不锁滚动，点外部/Esc 关闭 */}
          {searchOpen && (
            <div
              className="absolute top-full left-0 right-0 bg-off-white border-y border-warm-gray shadow-[0_12px_32px_rgba(60,45,30,0.12)] text-charcoal"
              style={{ animation: 'fadeIn 0.18s ease-out' }}
            >
              <div className="max-w-2xl mx-auto px-6 py-5">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search products..."
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg text-sm border-2 border-warm-gray focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none bg-white"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-11 px-5 rounded-lg text-sm font-semibold text-cream bg-brand transition hover:bg-brand-dark flex-shrink-0"
                    aria-label="Submit search"
                  >
                    Search
                  </button>
                </form>

                {/* 即时建议（300ms 防抖，client-side 过滤） */}
                {suggestions.length > 0 && (
                  <div className="mt-3 bg-white rounded-xl border border-warm-gray overflow-hidden max-h-80 overflow-y-auto">
                    {suggestions.map((p) => (
                      <a
                        key={p.id}
                        href={v2url(`/products/${p.handle}/`)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-off-white transition"
                      >
                        {p.images?.[0] && (
                          <img
                            src={resolveUrl(p.images[0].url)}
                            alt={p.images[0].altText || p.title}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-off-white border border-warm-gray"
                            loading="lazy"
                          />
                        )}
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-brand w-16 flex-shrink-0 truncate">
                          {p.productType}
                        </span>
                        <span className="text-sm text-charcoal line-clamp-2">{p.title}</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* 热门搜索 chips */}
                {suggestions.length === 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-light mb-2.5">Popular Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {HOT_SEARCHES.map((term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-4 py-2 rounded-full bg-white border border-warm-gray text-sm text-charcoal-light hover:border-brand hover:text-brand transition"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Mega Menu（桌面端）：点击分类导航展开/收起，左侧二级类目 + 右侧示例图卡（Parachute 风格）；Esc / 点外部 / 路由变化关闭 */}
        {openMenu && (
          <div
            className="hidden lg:block absolute top-full left-0 right-0 bg-off-white border-y border-warm-gray shadow-[0_12px_32px_rgba(60,45,30,0.12)] text-charcoal"
            style={{ animation: 'fadeIn 0.18s ease-out' }}
          >
            <div className="px-6 lg:px-10 py-9 flex gap-14 justify-center">
              {/* 左：分类总链接 + 二级类目列表（Featured 无汇总页入口，标题为纯文字） */}
              <div className="flex-shrink-0 w-56">
                {(() => {
                  const current = navLinks.find((l) => l.cat === openMenu);
                  const titleClass =
                    'inline-flex items-center gap-2 text-sm font-bold tracking-[0.15em] uppercase text-charcoal pb-3 mb-4 border-b border-charcoal/20';
                  const arrow = (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/title:translate-x-1">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  );
                  return current?.href ? (
                    <a href={v2url(current.href)} className={`group/title ${titleClass} hover:text-brand transition-colors`}>
                      {current.label}
                      {arrow}
                    </a>
                  ) : (
                    <span className={titleClass}>{current?.label}</span>
                  );
                })()}
                <div className="flex flex-col gap-3.5">
                  {openMenu === 'featured'
                    ? FEATURED_SUBS.map((sub) => (
                        <a
                          key={sub.href}
                          href={v2url(sub.href)}
                          onClick={() => setOpenMenu('')}
                          className="text-sm font-medium text-charcoal-light hover:text-brand transition-colors"
                        >
                          {sub.label}
                        </a>
                      ))
                    : (catStyles[openMenu] || []).map((sub) => (
                        <a
                          key={sub.key}
                          href={v2url(`/products?cat=${openMenu}&sub=${sub.key}`)}
                          className="text-sm font-medium text-charcoal-light hover:text-brand transition-colors"
                        >
                          {sub.label}
                        </a>
                      ))}
                </div>
              </div>

              {/* 右：示例图卡（图 + 大写小标题 + 下划线跳转链接） */}
              <div className="flex gap-6">
                {(MEGA_CARDS[openMenu] || []).map((card) => (
                  <div key={card.image} className="w-[230px]">
                    <a href={v2url(card.href)} onClick={() => setOpenMenu('')} className="group/card block">
                      <div className="aspect-[4/5] overflow-hidden rounded-lg bg-warm-gray">
                        <img
                          src={resolveUrl(card.image)}
                          alt={card.caption}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />
                      </div>
                    </a>
                    {/* 文案样式与全站产品卡一致：品牌棕 eyebrow + 深灰标题 + 下划线 hover 渐入 */}
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#8B5A2B]">
                      {card.caption}
                    </p>
                    <a
                      href={v2url(card.href)}
                      onClick={() => setOpenMenu('')}
                      className="group/link mt-1 inline-flex items-center gap-1.5 text-[#8B5A2B]"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/link:translate-x-0.5">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                      <span className="relative text-sm font-medium text-[#333]">
                        {card.linkLabel}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-[#8B5A2B] transition-all duration-300 group-hover/link:w-full" />
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer：不再铺满全屏——z-40 低于页头（z-50），页头保持露出，
          汉堡/× 按钮始终可点；抽屉从页头下缘开始，限高内部滚动，
          其余区域盖半透明遮罩，点遮罩（抽屉外任意处）关闭 */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          // touchend 即 preventDefault + 关闭：阻止浏览器在抽屉消失后向同一触点
          // 补发 click（幽灵点击会落到下层原始网页的链接上触发转跳）
          onTouchEnd={(e) => {
            e.preventDefault();
            setMobileOpen(false);
          }}
        >
          <div
            className="absolute left-0 right-0 bg-off-white text-charcoal px-8 pb-8 pt-4 overflow-y-auto shadow-[0_16px_40px_rgba(60,45,30,0.25)]"
            style={{
              top: drawerTop,
              maxHeight: `calc(100vh - ${drawerTop}px)`,
              animation: 'fadeIn 0.18s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
          <nav className="flex flex-col gap-1">
            <a
              href={v2url('/')}
              onClick={() => setMobileOpen(false)}
              className="text-base font-semibold text-charcoal py-3 px-4 rounded-lg hover:text-brand hover:bg-brand/5 transition"
            >
              Home
            </a>
            {/* 一级类目整行点击展开/收起该类目风格列表（默认折叠）；展开后首项
                "Shop All {类目}" 链到类目汇总页（Featured 无汇总页，无此项） */}
            {navLinks.map((link) => {
              const expanded = expandedCat === link.cat;
              const subs =
                link.cat === 'featured'
                  ? FEATURED_SUBS.map((s) => ({ key: s.href, label: s.label, href: s.href }))
                  : (catStyles[link.cat] || []).map((s) => ({
                      key: s.key,
                      label: s.label,
                      href: `/products?cat=${link.cat}&sub=${s.key}`,
                    }));
              return (
                <div key={link.label}>
                  <button
                    onClick={() => setExpandedCat(expanded ? '' : link.cat)}
                    aria-expanded={expanded}
                    className="w-full flex items-center justify-between text-base font-semibold text-charcoal py-3 px-4 rounded-lg hover:text-brand hover:bg-brand/5 transition"
                  >
                    {link.label}
                    <svg
                      className={`w-4 h-4 text-charcoal-light transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {/* grid-rows 0fr/1fr 过渡实现高度自适应的展开动画，无需写死高度 */}
                  <div
                    className={`grid transition-all duration-300 ${
                      expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      {link.href && (
                        <a
                          href={v2url(link.href)}
                          onClick={() => setMobileOpen(false)}
                          className="block text-sm font-semibold text-brand py-2 pl-8 pr-4 rounded-lg hover:bg-brand/5 transition"
                        >
                          Shop All {link.label} →
                        </a>
                      )}
                      {subs.map((sub) => (
                        <a
                          key={sub.key}
                          href={v2url(sub.href)}
                          onClick={() => setMobileOpen(false)}
                          className="block text-sm text-charcoal-light py-2 pl-8 pr-4 rounded-lg hover:text-brand hover:bg-brand/5 transition"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
          </div>
        </div>
      )}

      {/* 点击面板外部区域关闭搜索 / mega menu */}
      {searchOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setSearchOpen(false)} aria-hidden="true" />
      )}
      {openMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenMenu('')} aria-hidden="true" />
      )}
    </>
  );
}
