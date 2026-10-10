'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { getLocalCart, getShopifyCart, openMiniCart } from '@/lib/cart';
import { searchProducts, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { fabricByMaterial, fabricDisplayName } from '@/data/bedding-fabrics';
import { PILLOW_TYPES, PILLOW_MATERIALS } from '@/data/pillows-taxonomy';
import { getSubcategoriesOf } from '@/data/subcategories';

// V2 导航：cat 非空的项带 mega menu（该类目在售风格 + 示例图卡）
// Featured 导航项已移除（2026-09 用户要求）；/best-sellers、/new-arrivals
// 两个精选页保留（首页 View More 等入口进入），原 /featured 汇总页保留但全站无入口
const navLinks = [
  // Bedding 一级入口 2026-09-27 用户定改回 /products?cat=bedding（/bedding/ 落地页已删除，
  // 老 URL 由页面本身兼容转跳）
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

// Mega menu 右侧示例图卡（每类 1-2 张：collections 分类图 + featured 场景图）
interface MenuCard {
  image: string;
  caption: string;
  linkLabel: string;
  href: string;
}
const MEGA_CARDS: Record<string, MenuCard[]> = {
  bedding: [
    { image: '/images/products/LINEN3-SAGE-TWIN/1.webp', caption: 'Pure linen, naturally breathable.', linkLabel: 'Shop 100% Linen', href: '/bedding/linen/' },
    { image: '/images/products/1688-916370884976-C5/1.webp', caption: 'Soft washed feel, easy everyday care.', linkLabel: 'Shop Washed Cotton-Like', href: '/bedding/washed-cotton/' },
  ],
  blankets: [
    { image: '/images/collections/blanket.webp', caption: 'Plush throws for couch & bed.', linkLabel: 'Shop Blankets', href: '/products?cat=blankets' },
    { image: '/images/products/1688-969627065032-C39/1.webp', caption: 'Faux rabbit fur softness.', linkLabel: 'Shop Faux Fur', href: '/products?cat=blankets' },
  ],
  cushions: [
    { image: '/images/collections/cushions.webp', caption: 'Comfort for every seat.', linkLabel: 'Shop Cushions', href: '/products?cat=cushions' },
    { image: '/images/products/B0CBT7R7NN/1.webp', caption: 'A best seller for a reason.', linkLabel: 'Shop Corduroy Classics', href: '/products?cat=cushions&sub=corduroy' },
  ],
  pillows: [
    { image: '/images/collections/pillows.webp', caption: 'Plush fillings, premium covers.', linkLabel: 'Shop Pillows', href: '/products?cat=pillows' },
    // 2026-10-08：形态类改为 pillow-inserts / pillow-cases / neck-pillows，改指 pillow-inserts 二级页
    { image: '/images/featured/b0cqc5qjfj.webp', caption: 'Refresh any room.', linkLabel: 'Shop Pillow Inserts', href: '/pillows/pillow-inserts/' },
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

// ── Mega menu 多列布局（2026-09 升级，对标 Parachute）──
interface MenuLink {
  label: string;
  /** 链接下一行小字描述（Parachute "Crisp. Cool." 式，可选） */
  desc?: string;
  href: string;
  /** 无产品的占位项（如 Sheets/Duvet Covers）：置灰不可点，不再跳 #on-the-loom 锚点（2026-09-27 用户定） */
  comingSoon?: boolean;
}
interface MenuColumn {
  title: string;
  /** 列标题可点（→ 类目汇总页）；无则纯标题 */
  href?: string;
  links: MenuLink[];
}

/** 组装某个类目的 mega menu 列：首列 = 类目子项（bedding 为面料列，描述取自 bedding-fabrics
 *  注册表，链接直达面料二级 PLP /bedding/[fabric]/；pillows 为形态列 + Material 列，
 *  直达 /pillows/[slug]/，2026-09-30 用户定），末列 = Featured 固定入口
 *  （bedding 例外，2026-09 用户定：增加 "Bedding" 产品类型列，标题链 /bedding/，
 *    各类型深链到 /bedding/ 页对应锚点；Fabric Guide 在面料列末尾；
 *    2026-10-09 用户定：Bedding 类型列与 Shop by Fabric 面料列调换位置——类型列在前、面料列在后） */
function menuColumns(cat: string, styles: { key: string; label: string }[]): MenuColumn[] {
  const current = navLinks.find((l) => l.cat === cat);
  const featured: MenuLink[] = [
    { label: 'Best Sellers', desc: 'Most loved.', href: '/best-sellers/' },
    { label: 'New Arrivals', desc: 'Just landed.', href: '/new-arrivals/' },
  ];
  // Pillows 重构（2026-09-30 用户定，照搬 bedding 双列模型）：
  // 首列 = 形态（Bed/Decorative/Cases/Neck → /pillows/[slug]/ 二级 PLP），
  // 次列 = Material（Down 无产品置灰 coming soon）；不带 Featured 列（2026-09-30 用户定删除）
  if (cat === 'pillows') {
    return [
      {
        title: 'Pillows',
        href: current?.href,
        links: PILLOW_TYPES.map((t) => ({
          label: t.label,
          desc: t.menuDesc,
          href: `/pillows/${t.slug}/`,
        })),
      },
      {
        title: 'Material',
        links: PILLOW_MATERIALS.map((m) =>
          m.key === 'down'
            ? { label: m.label, desc: m.menuDesc, href: '/products?cat=pillows', comingSoon: true }
            : { label: m.label, desc: m.menuDesc, href: `/pillows/${m.slug}/` }
        ),
      },
    ];
  }
  // Cushions 重构（2026-10-09 用户定）：首列 = 风格 3 类（Corduroy Classics / Soft Solids /
  // Floral & Prints，取自 subcategories 注册表，与 /products?cat=cushions 分区、筛选同源），
  // 直达 /cushions/[slug]/ 二级 PLP（与 pillows/bedding 细分类目同构）；Featured 列保持不变
  if (cat === 'cushions') {
    return [
      {
        title: 'Cushions',
        href: current?.href,
        links: getSubcategoriesOf('cushions').map((s) => ({
          label: s.label,
          desc: s.blurb,
          href: `/cushions/${encodeURIComponent(s.key)}/`,
        })),
      },
      { title: 'Featured', links: featured },
    ];
  }
  const first: MenuColumn = {
    title: cat === 'bedding' ? 'Shop by Fabric' : (current?.label || cat),
    // bedding 面料列标题不可点（面料没有汇总页，每个面料有独立 PLP）；其他类目链到类目页
    href: cat === 'bedding' ? undefined : current?.href,
    links: styles.map((s) => {
      const fb = cat === 'bedding' ? fabricByMaterial(s.key) : undefined;
      return {
        // bedding 面料列展示名统一走 fabricDisplayName（2026-10-09：Washed Cotton-Like 显为 Brushed Cotton）
        label: cat === 'bedding' ? fabricDisplayName(s.label) : s.label,
        desc: fb?.desc,
        href: fb ? `/bedding/${fb.slug}/` : `/products?cat=${cat}&sub=${encodeURIComponent(s.key)}`,
      };
    }),
  };
  if (cat === 'bedding') {
    first.links.push({ label: 'Fabric Guide', desc: 'Find your feel.', href: '/fabric-guide/' });
    // 2026-10-09 用户定：Bedding 类型列与 Shop by Fabric 面料列调换位置（类型列在前）
    return [
      {
        title: 'Bedding',
        href: '/products?cat=bedding',
        links: [
          // Bed Sets 合并入口（2026-09 用户定：4P/3P 合并为一项，页内两分区展示）；
          // 单类型页 /bedding/4-piece-sets/、/bedding/3-piece-sets/ 保留兜底无入口；
          // Comforter Sets 入口 2026-09-26 移除（唯一 comforter 家族 1688-916370884976 实为被套 3 件套，已归 three）；
          // Duvet Covers 2026-10 上线：ice silk 缎面 + 9 款独立被套单件（LINEN3-DUVET / DUVSET-DUVET）；
          // Sheets 无产品：置灰不可点（不再跳 /bedding/#on-the-loom，2026-09-27 用户反馈点击误导）
          { label: 'Bed Sets', desc: 'Duvet covers, sheets & pillowcases.', href: '/bedding/bed-sets/' },
          { label: 'Sheets', desc: 'Coming soon.', href: '/bedding/#on-the-loom', comingSoon: true },
          { label: 'Duvet Covers', desc: 'Covers only — mix & match.', href: '/bedding/duvet-covers/' },
          { label: 'Blankets', desc: 'Plush throws & layers.', href: '/products?cat=blankets' },
        ],
      },
      first,
    ];
  }
  return [first, { title: 'Featured', links: featured }];
}
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
  // Mega menu：当前展开的分类（'' = 收起）
  const [openMenu, setOpenMenu] = useState('');
  // 移动抽屉 2026-09 改为底部上弹（82dvh，页头保持露出可点），不再需要对齐页头下缘
  const headerRef = useRef<HTMLDivElement>(null);
  // 抽屉里当前展开二级类目的一级类目（'' = 全部折叠）；抽屉关闭时复位
  const [expandedCat, setExpandedCat] = useState('');
  useEffect(() => {
    if (!mobileOpen) setExpandedCat('');
  }, [mobileOpen]);

  // iOS 26 Safari 首屏染色对策（2026-10-10 用户实测：刚打开时刘海区橙色，
  // 滚动过一次后/回顶后均正常）——Safari 26 在"页面从未滚动过"时不把页面内容
  // 合成到刘海/状态栏区，而是用采样色（公告条橙）涂染色层；只要滚动过一次就
  // 永久切换为合成实际内容（米色安全条）。故加载后做一次无感知的 1px instant
  // 滚动触发该状态切换（即社区实测的 "scroll runway" 方案）。多时机补刀：
  // 挂载时 / window load / 300ms 后各试一次，仅 scrollY===0 时才动，不干扰
  // 浏览器刷新后的滚动位置恢复。1px 低于实底阈值（30/60px），不会触发头部状态变化。
  useEffect(() => {
    const nudge = () => {
      if (window.scrollY === 0) window.scrollTo({ top: 1, behavior: 'instant' as ScrollBehavior });
    };
    nudge();
    window.addEventListener('load', nudge);
    const t = setTimeout(nudge, 300);
    return () => {
      window.removeEventListener('load', nudge);
      clearTimeout(t);
    };
  }, []);

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
    // 挂载时立即同步一次：浏览器刷新后恢复滚动位置时不会再发 scroll 事件，
    // 不初始化会卡在透明态，导航文字与页面内容重叠
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 双保险（2026-09 用户环境 scroll 事件疑似不生效）：文档顶部 60px 处的哨兵离开视口即实底。
  // IntersectionObserver 与 scroll 事件是相互独立的机制，任一可用都能驱动 solid 状态
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const ob = new IntersectionObserver(
      (entries) => setScrolled(!entries[0].isIntersecting)
    );
    ob.observe(el);
    return () => ob.disconnect();
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
  // 其余页面是浅色页头，从首屏起即为实底样式，避免 cream 文字看不清。
  // 尾段 /index 或 /index.html 归一化为首页（静态托管可能以此形式serve首页）
  const normalizedPath = (pathname || '').replace(/\/+$/, '').replace(/\/index(\.html)?$/, '');
  const transparentStart = normalizedPath === '' || normalizedPath === '/about';
  // 移动端（<lg）恒实底（2026-10-10 iOS 26 Safari 刘海染色对策的配套）：固定头部容器在移动端
  // 必须是不透明米色底（否则 Safari 染色采样器穿过透明容器采到公告条橙色，刘海区被染色），
  // 米色底上 cream 白字/反转白 logo 会隐形，故移动端首页/About 不再使用透明态
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  // mega menu 展开时强制实底，保证导航文字在面板上可读；
  // 搜索面板展开时同样强制实底（2026-10-10 用户反馈：桌面端搜索面板是实底米色，
  // 透明头部叠在大图上与面板不协调）
  const solid = scrolled || !transparentStart || openMenu !== '' || searchOpen || isMobile;

  // 透明态（首屏大图）用 cream 文字，实底后用 charcoal
  const textColor = solid ? 'text-charcoal' : 'text-cream';
  const iconHover = solid
    ? 'hover:bg-brand/10 hover:text-brand'
    : 'hover:bg-cream/15 hover:text-cream';

  return (
    <>
      {/* 滚动哨兵：absolute 定位在文档顶下 60px（与 scroll 滞回阈值同位），
          滚过即离开视口 → IntersectionObserver 驱动 solid（scroll 事件之外的第二通道） */}
      <div ref={sentinelRef} aria-hidden="true" className="absolute left-0 w-px h-px pointer-events-none" style={{ top: 60 }} />
      {/* iOS 26 Safari 刘海染色对策（2026-10-10 实测两轮）：Safari 26 自行在刘海/状态栏区涂染色层，
          颜色采样自贴近顶缘的 fixed/sticky 元素自身的背景色，透明容器会被穿过、采到公告条橙色
          （独立 z-60 安全条、theme-color 均已被实测无效）。故移动端容器自身给不透明米色底
          （bg-off-white），桌面 lg 保持透明不影响大图页头；配套移动端头部恒实底（见 solid 逻辑）。 */}
      <div ref={headerRef} className="fixed top-0 z-50 w-full bg-off-white lg:bg-transparent">
        {/* 刘海安全条（viewport-fit=cover）：网站底色涂满刘海/状态栏区域，
            高度=安全区上内边距；无刘海设备上 env 取 0，不产生任何高度 */}
        <div aria-hidden="true" className="w-full bg-off-white" style={{ height: 'env(safe-area-inset-top, 0px)' }} />
        {/* Announcement Bar：全端展示同一文案（2026-09-29 用户定：移动端恢复，与桌面端一致）；
            移动端字号略缩 + nowrap 保证单行不折行；向下滚动超过阈值后收起，回到顶部附近再展开 */}
        <div
          className={`bg-brand text-cream text-center text-[11px] lg:text-xs font-medium tracking-wide px-4 overflow-hidden transition-all duration-300 ${
            scrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-10 py-2 opacity-100'
          }`}
        >
          <span className="whitespace-nowrap">Free Shipping on Orders Over $49 | 30-Day Easy Returns</span>
        </div>

        {/* 移动端头部压缩（2026-09 用户定 py-2=60px；2026-10-10 用户定再压至 py-1=52px，
            让出高度给 hero 图片区）：图标按钮保持 w-11 h-11 = 44px 触控目标。
            桌面保持 py-4 + h-14 = 88px。
            依赖头部高度的两处同步：页面顶部留白、筛选条吸顶（top-[calc(52px+env(safe-area-inset-top))]）——
            2026-10-10 起统一以 calc(原值+env(safe-area-inset-top)) 表达（viewport-fit=cover 刘海适配） */}
        <header
          className={`flex items-center justify-between px-6 lg:px-10 py-1 lg:py-4 transition-all duration-300 ${textColor} ${
            solid ? 'bg-off-white/95 backdrop-blur shadow-md' : 'bg-transparent'
          }`}
        >
          <a href={v2url('/')} className="flex items-center gap-2">
            <img
              src={resolveUrl('/images/brand/makimoo-logo.webp')}
              alt="Makimoo"
              className="h-9 lg:h-14 w-auto object-contain transition-all duration-300"
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
              onClick={() => setMobileOpen((v) => !v)}
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

          {/* Search Panel：导航下方的下拉面板，不遮全屏、不锁滚动，点外部/Esc 关闭；
              背景与实底头部同规格（bg-off-white/95 + backdrop-blur，2026-10-10 用户反馈两者色差不协调） */}
          {searchOpen && (
            <div
              className="absolute top-full left-0 right-0 bg-off-white/95 backdrop-blur border-y border-warm-gray shadow-[0_12px_32px_rgba(60,45,30,0.12)] text-charcoal"
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
              {/* 左：多列链接（Parachute 风格）——首列类目子项（bedding = 面料列，带质感短句），次列 Featured 固定入口 */}
              <div className="flex gap-12">
                {menuColumns(openMenu, catStyles[openMenu] || []).map((col) => (
                  <div key={col.title} className="flex-shrink-0 w-44">
                    {col.href ? (
                      <a
                        href={v2url(col.href)}
                        onClick={() => setOpenMenu('')}
                        className="group/title inline-flex items-center gap-2 text-sm font-bold tracking-[0.15em] uppercase text-charcoal pb-3 mb-4 border-b border-charcoal/20 hover:text-brand transition-colors"
                      >
                        {col.title}
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/title:translate-x-1">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </a>
                    ) : (
                      <span className="inline-flex items-center text-sm font-bold tracking-[0.15em] uppercase text-charcoal pb-3 mb-4 border-b border-charcoal/20">
                        {col.title}
                      </span>
                    )}
                    <div className="flex flex-col gap-3.5">
                      {col.links.map((l) => (
                        l.comingSoon ? (
                          <span key={l.href + l.label} className="cursor-default">
                            <span className="block text-sm font-medium text-[#B5AFA7]">
                              {l.label}
                            </span>
                            {l.desc && <span className="mt-0.5 block text-xs text-[#C9C3BB]">{l.desc}</span>}
                          </span>
                        ) : (
                        <a
                          key={l.href + l.label}
                          href={v2url(l.href)}
                          onClick={() => setOpenMenu('')}
                          className="group/item"
                        >
                          <span className="block text-sm font-medium text-charcoal-light group-hover/item:text-brand transition-colors">
                            {l.label}
                          </span>
                          {l.desc && <span className="mt-0.5 block text-xs text-[#999]">{l.desc}</span>}
                        </a>
                        )
                      ))}
                    </div>
                  </div>
                ))}
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

      {/* Mobile Drawer（2026-09 用户定改为底部上弹）：面板贴屏幕下缘、限高 82dvh，
          顶部露出约 18% 原网页；z-40 低于页头（z-50），页头汉堡/× 按钮始终可点；
          遮罩覆盖包括露出网页在内的全屏区域，点遮罩（抽屉外任意处）关闭；
          顶部圆角 + 小横杠把手做 bottom sheet 视觉暗示（暂不加下滑手势，用户定） */}
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
            className="absolute left-0 right-0 bottom-0 bg-off-white text-charcoal rounded-t-2xl px-8 pb-8 pt-2 overflow-y-auto shadow-[0_-16px_40px_rgba(60,45,30,0.25)]"
            style={{
              maxHeight: '82dvh',
              animation: 'slideUp 0.25s ease-out',
              // viewport-fit=cover：底部内容避开 Home 指示条
              paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))',
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
          {/* drag handle：bottom sheet 视觉把手（纯装饰，不绑手势） */}
          <div className="w-10 h-1 mx-auto mb-2 rounded-full bg-charcoal/15" aria-hidden="true" />
          <nav className="flex flex-col gap-1">
            <a
              href={v2url('/')}
              onClick={() => setMobileOpen(false)}
              className="text-base font-semibold text-charcoal py-3 px-4 rounded-lg hover:text-brand hover:bg-brand/5 transition"
            >
              Home
            </a>
            {/* 一级类目整行点击展开/收起该类目风格列表（默认折叠）；展开后首项
                "Shop All {类目}" 链到类目汇总页 */}
            {navLinks.map((link) => {
              const expanded = expandedCat === link.cat;
              const subs = (catStyles[link.cat] || []).map((s) => ({
                key: s.key,
                label: s.label,
                href: `/products?cat=${link.cat}&sub=${encodeURIComponent(s.key)}`,
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
                      {/* bedding/pillows/cushions 不渲染 "Shop All" 首项（2026-09 用户定）：
                          汇总页入口由下方组标题链接承担（同桌面列标题可点） */}
                      {link.href && link.cat !== 'bedding' && link.cat !== 'pillows' && link.cat !== 'cushions' && (
                        <a
                          href={v2url(link.href)}
                          onClick={() => setMobileOpen(false)}
                          className="block text-sm font-semibold text-brand py-2 pl-8 pr-4 rounded-lg hover:bg-brand/5 transition"
                        >
                          Shop All {link.label} →
                        </a>
                      )}
                      {/* bedding/pillows/cushions 抽屉二级与桌面 mega menu 同构（2026-09 用户定：移动端/桌面端导航统一）——
                          bedding = 面料组（SHOP BY FABRIC）+ 类型组（BEDDING）；
                          pillows = 形态组（PILLOWS）+ 材质组（MATERIAL）；
                          cushions = 风格 3 类（Corduroy / Solids / Prints，2026-10-09 用户定）；
                          Featured 列不进移动端抽屉（与 bedding/pillows 一致）；
                          组标题 = 主层级缩进（mx-4）+ 下划线（同桌面列标题 border-b 样式），
                          子类目 pl-8 缩进，层级一眼可辨（2026-09 用户反馈：原同缩进分不清） */}
                      {link.cat === 'bedding' || link.cat === 'pillows' || link.cat === 'cushions'
                        ? menuColumns(link.cat, catStyles[link.cat] || [])
                            .filter((col) => col.title !== 'Featured')
                            .map((col) => (
                            <div key={col.title}>
                              {col.href ? (
                                <a
                                  href={v2url(col.href)}
                                  onClick={() => setMobileOpen(false)}
                                  className="block text-[11px] font-bold tracking-[0.15em] uppercase text-[#999] mt-3 mb-1 mx-4 pb-2 border-b border-charcoal/10 hover:text-brand transition"
                                >
                                  {col.title} →
                                </a>
                              ) : (
                                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#999] mt-3 mb-1 mx-4 pb-2 border-b border-charcoal/10">
                                  {col.title}
                                </p>
                              )}
                              {col.links.map((l) => (
                                l.comingSoon ? (
                                  <span
                                    key={l.href + l.label}
                                    className="block text-sm text-[#B5AFA7] py-2 pl-8 pr-4 cursor-default"
                                  >
                                    {l.label}
                                    <span className="ml-2 text-xs text-[#C9C3BB]">{l.desc}</span>
                                  </span>
                                ) : (
                                <a
                                  key={l.href + l.label}
                                  href={v2url(l.href)}
                                  onClick={() => setMobileOpen(false)}
                                  className="block text-sm text-charcoal-light py-2 pl-8 pr-4 rounded-lg hover:text-brand hover:bg-brand/5 transition"
                                >
                                  {l.label}
                                </a>
                                )
                              ))}
                            </div>
                          ))
                        : subs.map((sub) => (
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
