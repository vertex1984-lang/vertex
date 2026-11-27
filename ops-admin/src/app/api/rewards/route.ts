import { NextRequest } from 'next/server';
import {
  addCouponGrant,
  getCouponGrantsByHash,
  getRewardsConfig,
  readDb,
  setRewardsConfig,
} from '@/lib/db';
import { REWARDS_TOKEN } from '@/lib/env';
import { corsJson, corsPreflight } from '@/lib/cors';

/**
 * 登录激励券码接口（2026-11-21 批次 T2/T3）：
 * - POST：vertex 前台发放申请（注册成功 reason='signup'；浏览器跨域带
 *   x-rewards-token 共享密钥，同 wishlist/reviews/notify 模式）——middleware 仅放行
 *   本路径 POST，接口内以共享令牌自保。reason='review' 只允许 admin 内部
 *   （reviews PATCH approve 分支）调用，前台传 review 一律拒绝。
 * - GET ?emailHash=：按邮箱哈希拉取已获券（/account My Rewards 用，x-rewards-token 自保，
 *   只投影非敏感字段，无邮箱明文）；不带 emailHash = 后台台账全量（走 middleware 会话保护）。
 * - PUT：发放配置（开关/比例），后台会话保护。
 * - OPTIONS：CORS 预检（新增令牌 x-rewards-token 已同步 lib/cors.ts Allow-Headers——铁律）。
 */
function tokenOk(req: NextRequest): boolean {
  return (req.headers.get('x-rewards-token') || '') === REWARDS_TOKEN;
}

export async function OPTIONS() {
  return corsPreflight();
}

/** 前台投影：无邮箱明文 */
function publicGrant(g: { code: string; reason: string; percentOff: number; createdAt: string; status: string }) {
  return { code: g.code, reason: g.reason, percentOff: g.percentOff, createdAt: g.createdAt, status: g.status };
}

/** 双用途 GET：
 *  - ?emailHash=：买家侧按邮箱哈希拉自己的券（middleware 放行，x-rewards-token 自保，无邮箱明文）
 *  - 无参：后台台账 + 配置（middleware 会话保护；含邮箱明文，仅供本地核对）
 */
export async function GET(req: NextRequest) {
  const hash = (req.nextUrl.searchParams.get('emailHash') || '').trim().toLowerCase();
  if (hash) {
    if (!tokenOk(req)) return corsJson({ error: '未授权' }, { status: 401 });
    if (!/^[0-9a-f]{64}$/.test(hash)) return corsJson({ error: 'emailHash 格式不合法' }, { status: 400 });
    const grants = getCouponGrantsByHash(hash).map(publicGrant);
    return corsJson({ items: grants });
  }
  const db = readDb();
  return corsJson({ config: getRewardsConfig(), items: db.couponGrants, total: db.couponGrants.length });
}

export async function POST(req: NextRequest) {
  if (!tokenOk(req)) return corsJson({ error: '未授权' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const email = String(body?.email || '').trim().toLowerCase();
  const reason = String(body?.reason || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return corsJson({ error: '邮箱格式不合法' }, { status: 400 });
  }
  // 前台只允许触发 signup（notify-consent 走 /api/subscribe 带 consent；
  // review 只能由 admin 审核 approve 分支内部发放——防前台伪造评价身份绕过审核）
  if (reason !== 'signup') {
    return corsJson({ error: '不支持的发放类型' }, { status: 400 });
  }
  const cfg = getRewardsConfig();
  if (!cfg.enabled) {
    // 开关关闭：全链路静默不发（响应仍 ok，granted=false，前台不显示文案）
    return corsJson({ ok: true, granted: false });
  }
  const grant = addCouponGrant(email, 'signup', cfg.percentOff);
  return corsJson({ ok: true, granted: Boolean(grant) });
}

/** 发放配置更新（会话保护） */
export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const patch: { enabled?: boolean; percentOff?: number } = {};
  if (typeof body?.enabled === 'boolean') patch.enabled = body.enabled;
  if (typeof body?.percentOff === 'number') patch.percentOff = body.percentOff;
  if (Object.keys(patch).length === 0) {
    return corsJson({ error: '缺少可更新字段（enabled / percentOff）' }, { status: 400 });
  }
  const cfg = setRewardsConfig(patch);
  return corsJson({ ok: true, config: cfg });
}
