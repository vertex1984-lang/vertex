'use client';

/**
 * Announcement Bar · 促销/预售横幅（2026-11-12 批次 1 改造自 V2PreorderBanner → PromotionsBanner）。
 *
 * 回退链：在线促销（admin-promotions.json，含倒计时到 end）→ 无促销回退预售横幅
 * （admin-preorder.json 的 sale 口径）→ 活动到期回退常规免邮文案。
 *
 * 布局约束：iOS 26 刘海对策要求公告条保持 static 文档流 + bg-brand 彩条
 * （见 V2Header 内刘海注释），本组件只替换文案与点击态、不改结构/背景。
 *
 * 时序安全（与预售横幅同一策略）：
 * - SSG 帧：构建期已过滤"在线"促销（ACTIVE_PROMOTIONS），无促销时按预售横幅静态帧渲染；
 * - 水合后每 30s 按真实时间复核在线状态 + 刷新倒计时；促销到期自动回退（无需重新构建/发布）。
 *
 * GA4：促销在线时上报 view_promotion（每次页面加载一次），点击横幅上报 select_promotion
 * （设计方案 v3 第四章归因三段漏斗 view_promotion → select_promotion → purchase 的前两段；
 * purchase 只由 Shopify 原生通道上报）。
 */
import { useEffect, useRef, useState } from 'react';
import { PREORDER_BANNER_LINE, PREORDER_SALE_DEADLINE, PREORDER_SALE_DEADLINE_LABEL } from '@/data/preorder';
import { ACTIVE_PROMOTIONS, onlinePromotionAt, type PromotionConfig } from '@/data/promotions';
import { trackViewPromotion, trackSelectPromotion } from '@/lib/gtag';

const REGULAR_COPY = 'Free Shipping on Orders Over $49 | 30-Day Easy Returns';

function countdown(deadline: string): string | null {
  const ms = new Date(deadline).getTime() - Date.now();
  if (ms <= 0) return null;
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`;
}

/** ISO → "Nov 30"（水合前静态截止日文案） */
function staticEndLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export default function PromotionsBanner() {
  // 构建期在线促销（SSG 帧与首帧客户端渲染一致，水合安全）；水合后按真实时间复核
  const [promo, setPromo] = useState<PromotionConfig | undefined>(() => ACTIVE_PROMOTIONS[0]);
  // null = 水合前（静态截止日文案）；'' = 已到期
  const [left, setLeft] = useState<string | null>(null);
  const viewFired = useRef(false);

  useEffect(() => {
    const tick = () => {
      const p = onlinePromotionAt(Date.now());
      setPromo(p);
      setLeft(p ? (countdown(p.end) ?? '') : (countdown(PREORDER_SALE_DEADLINE) ?? ''));
      // GA4: view_promotion（促销在线展示即报，每次页面加载一次）
      if (p && !viewFired.current) {
        viewFired.current = true;
        trackViewPromotion({
          promotion_id: p.name,
          promotion_name: p.bannerLine,
          creative_name: p.discountLabel,
          creative_slot: 'announcement_bar',
        });
      }
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);

  // 促销帧文案（倒计时目标 = 促销 end）。
  // P2 修复：bannerLine 常已自带折扣词（如 "Flash Sale · 30% Off Sitewide"），
  // 拼接 discountLabel 前先做包含判断，避免 "…· 30% Off Sitewide · 30% Off" 重复
  const promoLine = promo
    ? promo.bannerLine.toLowerCase().includes(promo.discountLabel.toLowerCase())
      ? promo.bannerLine
      : `${promo.bannerLine} · ${promo.discountLabel}`
    : null;
  const promoText = promo
    ? left === null
      ? `${promoLine} · Ends ${staticEndLabel(promo.end)}`
      : left
        ? `${promoLine} · Ends in ${left}`
        : null // 促销已到期 → 回退预售链
    : null;

  // 预售帧文案（倒计时目标 = 预售 sale deadline；到期回退免邮）
  const preorderText =
    left === null
      ? `${PREORDER_BANNER_LINE} · Ends ${PREORDER_SALE_DEADLINE_LABEL}`
      : left
        ? `${PREORDER_BANNER_LINE} · Ends in ${left}`
        : REGULAR_COPY;

  const text = promoText ?? preorderText;

  // 促销在线时横幅可点（select_promotion）；预售/免邮态保持原纯展示
  const handleClick = () => {
    if (!promo) return;
    trackSelectPromotion({
      promotion_id: promo.name,
      promotion_name: promo.bannerLine,
      creative_name: promo.discountLabel,
      creative_slot: 'announcement_bar',
    });
  };

  return (
    <div
      className="bg-brand text-cream text-center text-[11px] lg:text-xs font-medium tracking-wide px-4 py-2"
      onClick={handleClick}
      role={promo ? 'button' : undefined}
      {...(promo ? { tabIndex: 0, onKeyDown: (e: React.KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && handleClick() } : {})}
      style={promo ? { cursor: 'pointer' } : undefined}
    >
      <span className="whitespace-nowrap">{text}</span>
    </div>
  );
}
