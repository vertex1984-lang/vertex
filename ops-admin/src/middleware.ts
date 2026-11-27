import { NextResponse, type NextRequest } from 'next/server';
import { verifySession, SESSION_COOKIE } from '@/lib/session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  const isAuthPage = pathname.startsWith('/login');
  const isAuthApi = pathname.startsWith('/api/auth/');
  // 心愿单云接口（批次 2）：调用方是 vertex 买家浏览器（无 admin 会话），
  // 不走本中间件，接口内部以 x-wishlist-token 共享密钥自保（见 api/wishlist/route.ts）。
  // ⚠ 前缀 startsWith 同时覆盖 /api/wishlist-capture（批次 5 游客留资，2026-11-17）——
  // 若把这里收窄成精确匹配，必须把新路径显式加进放行清单，否则捕获面板提交会 302 到登录页
  const isWishlistApi = pathname.startsWith('/api/wishlist');
  // 评价提交（批次 3）：仅放行买家 POST（x-review-token 自保）；
  // 同路径的 GET/PATCH/DELETE 为后台审核操作，仍走会话保护
  const isPublicReviewSubmit = pathname === '/api/reviews' && req.method === 'POST';
  // 到货通知（2026-11-15 展示层订阅）：同模式——仅放行买家 POST（x-notify-token 自保），GET 走会话
  const isNotifyApi = pathname.startsWith('/api/subscribe');
  const isPublicNotifySubmit = isNotifyApi && req.method === 'POST';
  // 登录激励券码（2026-11-21 批次）：放行买家 POST（注册发券，x-rewards-token 自保）与
  // 买家 GET ?emailHash=（/account My Rewards 拉自己的券，同令牌自保，接口内校验哈希格式）；
  // PUT（配置）/ DELETE / 无参 GET（台账全量）仍走会话保护
  const isRewardsApi = pathname.startsWith('/api/rewards');
  const isPublicRewards =
    (req.method === 'POST' || (req.method === 'GET' && req.nextUrl.searchParams.has('emailHash'))) &&
    isRewardsApi;
  // CORS 预检（验收 P0-1）：浏览器预检请求匿名（不带 cookie），必须放行到 route 的
  // OPTIONS handler（lib/cors.ts corsPreflight），否则预检 401 无 ACAO → 前台全部 Failed to fetch
  const isBuyerApiPreflight =
    req.method === 'OPTIONS' &&
    (isWishlistApi || pathname === '/api/reviews' || isNotifyApi || isRewardsApi);

  if (!session) {
    if (
      isAuthPage || isAuthApi || isWishlistApi ||
      isPublicReviewSubmit || isPublicNotifySubmit || isPublicRewards || isBuyerApiPreflight
    ) {
      return NextResponse.next();
    }
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
