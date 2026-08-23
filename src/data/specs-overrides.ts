// 手工规格覆盖表（key = 小写 ASIN）
// 自动提取表 product-specs.ts 提取不准或缺失时在此补充，前台展示时此表字段优先。
// dimensionsCm 单位为 cm（2-3 维）；material 为展示字符串。
import type { ProductSpecs } from './product-specs';

export const SPECS_OVERRIDES: Record<string, ProductSpecs> = {
  // 示例：
  // "b0xxxxxxx": { dimensionsCm: [45, 45], material: "Polyester" },
};
