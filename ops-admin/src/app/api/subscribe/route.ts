import { NextRequest } from 'next/server';
import { addCouponGrant, addNotify, getRewardsConfig, readDb } from '@/lib/db';
import { NOTIFY_TOKEN } from '@/lib/env';
import { corsJson, corsPreflight } from '@/lib/cors';

/**
 * 到货通知（2026-11-15 上线方案 1.1 / 技术清单 2.1）：
 * - POST：买家在展示层（S1）/Coming Soon 页提交订阅（vertex 浏览器跨域调用，无 admin 会话）
 *   ——middleware 仅放行本路径 POST，接口内以 x-notify-token 共享密钥自保（同 wishlist/reviews 模式）
 * - GET：后台名单（按 handle 分组，运营手动触达用），走会话保护
 *
 * 2026-11-21 追加（T3）：请求体带 marketingConsent=true 时（会议决策「留资 + 询问数字营销
 * consent」），按券码发放开关幂等发一张 notify-consent 券（granted=true 供前台成功态展示文案；
 * 开关关闭 / 不勾 consent / 已发过 = granted=false，前台不显示）。
 */
function tokenOk(req: NextRequest): boolean {
  return (req.headers.get('x-notify-token') || '') === NOTIFY_TOKEN;
}

export async function OPTIONS() {
  return corsPreflight();
}

/** 买家订阅 */
export async function POST(req: NextRequest) {
  if (!tokenOk(req)) return corsJson({ error: '未授权' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const handle = String(body?.handle || '').trim();
  const email = String(body?.email || '').trim().toLowerCase();
  if (!handle || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return corsJson({ error: '缺少 handle 或邮箱格式不合法' }, { status: 400 });
  }
  const marketingConsent = body?.marketingConsent === true;
  const record = addNotify(handle, email);
  // T3 notify-consent 发券（幂等；开关关闭 = 全链路静默不发）
  let couponGranted = false;
  if (marketingConsent) {
    const cfg = getRewardsConfig();
    if (cfg.enabled) {
      couponGranted = Boolean(addCouponGrant(email, 'notify-consent', cfg.percentOff));
    }
  }
  return corsJson({ ok: true, handle: record.handle, at: record.at, marketingConsent, granted: couponGranted });
}

/** 后台名单（会话保护；按产品分组计数 + 明细） */
export async function GET() {
  const db = readDb();
  const byHandle = new Map<string, { handle: string; count: number; emails: { email: string; at: string }[] }>();
  for (const n of db.notifySubscribes) {
    const g = byHandle.get(n.handle) || { handle: n.handle, count: 0, emails: [] };
    g.count += 1;
    g.emails.push({ email: n.email, at: n.at });
    byHandle.set(n.handle, g);
  }
  return corsJson({
    total: db.notifySubscribes.length,
    groups: [...byHandle.values()].sort((a, b) => b.count - a.count),
  });
}
