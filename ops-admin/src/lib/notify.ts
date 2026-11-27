/** 到货通知订阅（2026-11-15 上线方案 1.1：展示层 S1 的「到货通知」捕获）。
 * 演示版落 admin 台账（按 handle 分组名单，运营手动触达）；正式版可迁
 * Shopify customer tags / Klaviyo Back-in-Stock（技术清单 2.1 备选）。 */

export interface NotifyRecord {
  id: string;
  /** 站内 handle（订阅哪个产品页） */
  handle: string;
  /** 订阅邮箱（小写归一） */
  email: string;
  at: string;
}

/** 新增/更新订阅：同 handle+email 幂等（重复提交只刷新时间） */
export function upsertNotify(handle: string, email: string): NotifyRecord {
  return { id: `${handle.toLowerCase()}::${email}::${Date.now().toString(36)}`, handle, email, at: new Date().toISOString() };
}
