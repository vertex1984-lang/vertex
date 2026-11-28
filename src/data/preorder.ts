/**
 * 预售系统配置（2026-11-10 立项；2026-11-12 起配置迁移 makimoo-admin，本文件只做加载与解析）。
 *
 * 数据来源：src/data/admin-preorder.json（运营后台发布时写入，空配置 = 无预售商品，前台零改动）。
 * 兼容两种加载环境：Next/webpack（JSON 有 default 导出）与 build 脚本 CJS 直载（module.exports 即 JSON 本体）。
 * 注意：不要在本文件引入 SHOPIFY_MAP 全量表——会打进客户端包（First Load +70kB）。
 * shopifyHandle 由 admin 发布时反查 shopify-map.ts 写入 JSON（发布即定，勿在此重复解析）。
 *
 * 口径（2026-11-11 领导确认）：承诺 35 天到货（内部 38 天缓冲）；上船前免费取消、
 * 上船后转 store credit；延期主动邮件 + 全额退款选项（FTC 30 天规则合规）。
 *
 * 价格结构：Shopify 现价即"预售专享价"（结算价 = 展示价，无需折扣码同步），
 * regularPrice 为划线原价（<50 美元 30% 档、≥100 美元 25% 档）。
 */

export interface PreorderConfig {
  /** 站内 handle（/products/{handle}/，PDP/PLP 匹配用） */
  handle: string;
  /** Shopify 商品 handle（cart/MiniCart 的 CartLine 匹配用；admin 发布时自动解析） */
  shopifyHandle?: string;
  /** 划线原价（预售专享价 = Shopify 现价，不在此重复） */
  regularPrice: string;
  /** 到货窗口（具体日期区间） */
  arrivesLabel: string;
  /** 交期短标签（PLP 卡片 / 购物车单行用） */
  arrivesShort: string;
  /** 预售价截止（ISO + 时区，客户端倒计时用） */
  deadline: string;
  /** 截止日静态文案（SSG 水合前显示；改截止日时与 deadline 一起改） */
  deadlineLabel: string;
  /** 一句话理由（真实工序，防"无理由等待"） */
  reason: string;
  /** 已售数量（2026-11-26 首页进度条用；admin 发布时写入，缺省不渲染进度条） */
  claimed?: number;
}

import * as adminPreorderNs from './admin-preorder.json';

type AdminPreorderFile = {
  generatedAt?: string;
  sale?: { deadline: string; deadlineLabel: string; bannerLine?: string };
  configs?: PreorderConfig[];
};

// Next/webpack 下 JSON 有 default 导出；build 脚本 CJS 直载时 namespace 即 JSON 本体
const adminPreorderFile: AdminPreorderFile =
  (adminPreorderNs as unknown as { default?: AdminPreorderFile }).default ??
  (adminPreorderNs as unknown as AdminPreorderFile);

/** 全站横幅口径（后台可改；活动到期前端自动回退免邮文案） */
export const PREORDER_SALE_DEADLINE = adminPreorderFile.sale?.deadline ?? '2026-11-17T23:59:00-08:00';
/** 横幅静态截止日文案（SSG 水合前帧） */
export const PREORDER_SALE_DEADLINE_LABEL = adminPreorderFile.sale?.deadlineLabel ?? 'Nov 17';
/** 横幅主文案 */
export const PREORDER_BANNER_LINE = adminPreorderFile.sale?.bannerLine ?? 'Pre-Order Event · Up to 30% Off';

export const PREORDER_CONFIGS: PreorderConfig[] = adminPreorderFile.configs ?? [];

/** 首发每款限量（2026-11-26 用户确认的运营承诺数字；进度条分母，改数字需同步 /pre-order 页文案） */
export const PREORDER_LIMIT_PER_DROP = 50;

const BY_HANDLE = new Map<string, PreorderConfig>();
for (const c of PREORDER_CONFIGS) {
  BY_HANDLE.set(c.handle, c);
  if (c.shopifyHandle) BY_HANDLE.set(c.shopifyHandle, c);
}

/** 按任一 handle 查预售配置：站内 handle（PDP/PLP/相关卡）与 Shopify handle（cart/MiniCart）都能命中 */
export function preorderOf(handle: string | undefined): PreorderConfig | undefined {
  return handle ? BY_HANDLE.get(handle) : undefined;
}

/**
 * 预售卡同款合并（2026-11-27 用户定）：一个款式不管几个尺寸变体，预售卡只出一张，
 * 标题标注全部可售尺寸（"Queen/King"），进度条按全组口径合计。
 * 归组键 = handle 尾部的 SKU 段（mk- 前缀）去掉尺寸尾缀；无 mk- SKU 尾缀的老配置各自成组（不合并）。
 */

/** handle 尾部 SKU 段：mk-xxx[-color]-size → { base: 'mk-xxx[-color]', size: 'queen' } */
const SKU_SIZE_TAIL = /(mk-[a-z0-9]+(?:-[a-z0-9]+)*?)-(twin|full|queen|king|cal-king)$/i;

export interface MergedPreorder {
  /** 代表 handle（组内配置顺序首个，用于取卡图/跳转 PDP） */
  repHandle: string;
  configs: PreorderConfig[];
  /** 全部可售尺寸标签（如 "Queen/King"）；单尺寸组为 undefined（标题沿用自身尺寸） */
  sizesLabel?: string;
  /** 全组合计已售 */
  claimed: number;
  /** 全组合计限量（每变体 PREORDER_LIMIT_PER_DROP） */
  total: number;
}

let MERGED_CACHE: MergedPreorder[] | undefined;
let MERGED_BY_HANDLE: Map<string, MergedPreorder> | undefined;

function buildMerged(): void {
  const groups = new Map<string, MergedPreorder>();
  for (const c of PREORDER_CONFIGS) {
    const m = c.handle.match(SKU_SIZE_TAIL);
    const key = m ? m[1].toLowerCase() : c.handle;
    let g = groups.get(key);
    if (!g) {
      g = { repHandle: c.handle, configs: [], claimed: 0, total: 0 };
      groups.set(key, g);
    }
    g.configs.push(c);
    if (typeof c.claimed === 'number') g.claimed += c.claimed;
    g.total += PREORDER_LIMIT_PER_DROP;
  }
  MERGED_BY_HANDLE = new Map();
  const list: MergedPreorder[] = [];
  groups.forEach((g) => {
    const sizes: string[] = [];
    for (const c of g.configs) {
      const s = c.handle.match(SKU_SIZE_TAIL)?.[2];
      if (s) {
        const label = s[0].toUpperCase() + s.slice(1).toLowerCase();
        if (!sizes.includes(label)) sizes.push(label);
      }
    }
    if (sizes.length > 1) g.sizesLabel = sizes.join('/');
    for (const c of g.configs) MERGED_BY_HANDLE!.set(c.handle, g);
    list.push(g);
  });
  MERGED_CACHE = list;
}

/** 全部预售合并组（配置顺序） */
export function mergedPreorderGroups(): MergedPreorder[] {
  if (!MERGED_CACHE) buildMerged();
  return MERGED_CACHE!;
}

/** 按组内任一 handle 查所属合并组 */
export function mergedPreorderOf(handle: string | undefined): MergedPreorder | undefined {
  if (!handle) return undefined;
  if (!MERGED_BY_HANDLE) buildMerged();
  return MERGED_BY_HANDLE!.get(handle);
}
