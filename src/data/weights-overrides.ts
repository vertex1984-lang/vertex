/**
 * 产品权重人工赋权表（key = 小写产品标识 asin / 1688-xxx / bedset4-xxx 等）
 *
 * 与 COLOR_OVERRIDES、specs-overrides.ts 同一套人工表模式：
 * 日常跟运营说"给 XX +20 / 把 XX 置顶"，改这里 → 重跑 scripts/build-weights.js → 重建生效。
 *
 * 字段：
 *  - boost   常规加减分，范围 ±30（超出会被 clamp），并入总分
 *  - pin     硬置顶位次（1 起），凌驾于一切排序；全站同时最多 3 个，超出脚本告警
 *  - bury    true = 沉底（排在在售组末尾、缺货组之前）
 *  - exclude true = 从所有权重排序场景排除（类目页/Best Sellers/推荐位均不展示）
 *  - until   限时权重截止日（'YYYY-MM-DD'），过期整条忽略并打印提醒
 *  - note    必填：为什么加权，半年后可追溯；缺失脚本告警
 *
 * 管理工具打分（2026-09 新增）：weight-boosts.json 的 boosts（asin → 分数，由本地
 * 管理工具 scripts/admin-server.js 维护，limits 限定可打范围）会合入下方导出的
 * WEIGHT_OVERRIDES（转成 { boost, note: '管理工具打分' }）；**同一 asin 两边都有时
 * JSON（管理工具）优先**——TS 条目保留 pin/bury/exclude 等其余字段，仅 boost 让位。
 */
// 注意用 namespace import：本地脚本（scripts/*.js）的 TS shim 不开 esModuleInterop，
// default import 编译成 require(...).default 会取不到值；namespace import 两种环境都拿到 JSON 本体
import * as WEIGHT_BOOSTS_JSON from './weight-boosts.json';

export interface WeightOverride {
  boost?: number;
  pin?: number;
  bury?: boolean;
  exclude?: boolean;
  until?: string;
  note?: string;
}

// 显式标注类型：JSON boosts 为空对象时 resolveJsonModule 推断不出 value 类型
interface WeightBoostsFile {
  limits: { min: number; max: number };
  boosts: Record<string, number>;
}
const BOOSTS_FILE: WeightBoostsFile = WEIGHT_BOOSTS_JSON;

const BASE_WEIGHT_OVERRIDES: Record<string, WeightOverride> = {
  // 示例（取消注释即生效）：
  // 'b0cqc5qjfj': { boost: 20, note: 'Q4 主推枕芯' },
  // 'linen3-oatmeal-queen': { pin: 3, note: '新品主推，置顶到第 3 位', until: '2026-10-31' },
  // 'b0f1y91hpr': { bury: true, note: '转化差，沉底观察' },
};

/** 生效人工赋权表 = TS 原有条目 + weight-boosts.json 打分（同 asin 时 JSON 优先） */
export const WEIGHT_OVERRIDES: Record<string, WeightOverride> = (() => {
  const jsonBoosts = BOOSTS_FILE.boosts ?? {};
  const merged: Record<string, WeightOverride> = {};
  for (const [asin, o] of Object.entries(BASE_WEIGHT_OVERRIDES)) {
    if (jsonBoosts[asin] !== undefined) {
      const rest = { ...o };
      delete rest.boost; // JSON（管理工具）打分优先，TS 里的 boost 让位，其余字段保留
      merged[asin] = rest;
    } else {
      merged[asin] = o;
    }
  }
  for (const [asin, boost] of Object.entries(jsonBoosts)) {
    merged[asin] = { ...merged[asin], boost, note: merged[asin]?.note || '管理工具打分' };
  }
  return merged;
})();

/**
 * 分组加权规则：命中的每个产品都加 boost（可与单品 boost 叠加，合计 ±30 封顶）。
 * match 字段全部可选，多个条件同时满足才命中：
 *  - productType    一级类目（Bedding / Pillows / Cushions / Towels / Mats / Blankets / Others）
 *  - subcategory    二级类目（如 rocking / hb-medium / basic / quilted / area-rugs）
 *  - materialIncludes  材质包含（product-specs 提取字符串，如 'Microfiber'）
 *  - asinIncludes   标识包含（如 'linen3-'、'-queen'，多个为 AND）
 *  - titleIncludesAny  完整标题包含任一词（如 ['45 x 45', '45x45']，尺寸类规则用）
 */
export interface GroupBoostRule {
  match: {
    productType?: string;
    subcategory?: string;
    materialIncludes?: string;
    asinIncludes?: string[];
    titleIncludesAny?: string[];
  };
  boost: number;
  note: string;
  until?: string;
}

export const GROUP_BOOSTS: GroupBoostRule[] = [
  // 2026-09-14 用户要求：旧分组加权规则全部清零，人工权重只保留管理工具的单品打分（weight-boosts.json）
];

