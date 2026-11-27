import { NextRequest } from 'next/server';
import { addCouponGrant, addReview, getRewardsConfig, moderateReview, readDb, removeReview, setReviewCouponFlag } from '@/lib/db';
import { REVIEW_TOKEN } from '@/lib/env';
import { corsJson, corsPreflight } from '@/lib/cors';

/**
 * 评价闭环（批次 3）：
 * - POST：买家提交待审核评价（vertex 静态站调用，无 admin 会话）——middleware 对本路径
 *   仅放行 POST，接口内以 x-review-token 共享密钥自保（同 wishlist 模式）
 * - GET / PATCH / PUT / DELETE：后台审核操作，走 middleware 登录会话保护
 *   PATCH { id, action: 'approve'|'reject', couponFlag? } = 审核 + 返券标记（仅记录，闸门 A TODO）
 * - OPTIONS：CORS 预检应答（批次 3 验收 P0-1：买家浏览器跨域带自定义头必预检；
 *   全部响应均带 lib/cors.ts 的 ACAO 头，否则浏览器 fetch 直接 reject 读不到错误体）
 */

function tokenOk(req: NextRequest): boolean {
  return (req.headers.get('x-review-token') || '') === REVIEW_TOKEN;
}

export async function OPTIONS() {
  return corsPreflight();
}

/** 买家提交待审核评价 */
export async function POST(req: NextRequest) {
  if (!tokenOk(req)) return corsJson({ error: '未授权' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const handle = String(body?.handle || '').trim();
  const text = String(body?.text || '').trim();
  const rating = Math.round(Number(body?.rating));
  if (!handle || !text || !(rating >= 1 && rating <= 5)) {
    return corsJson({ error: '缺少必填字段（handle / text / rating 1-5）' }, { status: 400 });
  }
  if (text.length > 1000) return corsJson({ error: '评价内容过长（≤1000 字符）' }, { status: 400 });
  // 登录身份（2026-11-21 T2）：vertex 登录用户提交时带上 customerEmail（从 account 资料取）；
  // 匿名提交不带 → 不参与发券（保持现有匿名 pending 流程）
  const customerEmail =
    typeof body?.customerEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customerEmail.trim())
      ? body.customerEmail.trim().toLowerCase()
      : undefined;
  const review = addReview({
    handle,
    productTitle: body?.productTitle ? String(body.productTitle).slice(0, 200) : undefined,
    author: body?.author ? String(body.author).trim().slice(0, 40) : undefined,
    title: body?.title ? String(body.title).trim().slice(0, 80) : undefined,
    text,
    rating,
    ...(customerEmail ? { customerEmail } : {}),
  });
  return corsJson({ ok: true, id: review.id, status: review.status });
}

/** 审核列表（后台） */
export async function GET() {
  const db = readDb();
  // 待审核在前，其余按提交时间倒序
  const items = [...db.reviews].sort((a, b) => {
    const ap = a.status === 'pending' ? 0 : 1;
    const bp = b.status === 'pending' ? 0 : 1;
    return ap - bp || (a.at < b.at ? 1 : -1);
  });
  return corsJson({ items });
}

/** 审核（通过/拒绝）+ 返券标记；approve 且评价带登录身份时自动发放评价券（2026-11-21 T2） */
export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const id = String(body?.id || '').trim();
  const action = body?.action === 'approve' ? 'approve' : body?.action === 'reject' ? 'reject' : '';
  if (!id || !action) return corsJson({ error: '缺少必填字段（id / action）' }, { status: 400 });
  const couponFlag = typeof body?.couponFlag === 'boolean' ? body.couponFlag : undefined;
  const review = moderateReview(id, action, couponFlag);
  if (!review) return corsJson({ error: '评价不存在' }, { status: 404 });
  // T2 评价送券：approve + 评价带登录身份 + 总开关开启 → 幂等发放（同条评价只发一次）。
  // reject / 匿名评价 / 开关关闭 = 不发放（验证重点：券码只在三条路径发放）。
  let couponGranted = false;
  let couponCode: string | undefined;
  if (action === 'approve' && review.customerEmail) {
    const cfg = getRewardsConfig();
    if (cfg.enabled) {
      const grant = addCouponGrant(review.customerEmail, 'review', cfg.percentOff, review.id);
      if (grant) {
        couponGranted = true;
        couponCode = grant.code;
      }
    }
  }
  return corsJson({ ok: true, review, couponGranted, ...(couponCode ? { couponCode } : {}) });
}

/** 仅更新返券标记（不影响审核状态） */
export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const id = String(body?.id || '').trim();
  if (!id || typeof body?.couponFlag !== 'boolean') {
    return corsJson({ error: '缺少必填字段（id / couponFlag）' }, { status: 400 });
  }
  const review = setReviewCouponFlag(id, body.couponFlag);
  if (!review) return corsJson({ error: '评价不存在' }, { status: 404 });
  return corsJson({ ok: true, review });
}

/** 删除（误灌数据清理用） */
export async function DELETE(req: NextRequest) {
  const id = (req.nextUrl.searchParams.get('id') || '').trim();
  if (!id) return corsJson({ error: '缺少 id' }, { status: 400 });
  const ok = removeReview(id);
  return corsJson({ ok, error: ok ? undefined : '评价不存在' }, { status: ok ? 200 : 404 });
}
