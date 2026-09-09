// 手工规格覆盖表（key = 小写 ASIN）
// 自动提取表 product-specs.ts 提取不准或缺失时在此补充，前台展示时此表字段优先。
// dimensionsCm 单位为 cm（2-3 维）；material 为展示字符串。
import type { ProductSpecs } from './product-specs';

export const SPECS_OVERRIDES: Record<string, ProductSpecs> = {
  // 示例：
  // "b0xxxxxxx": { dimensionsCm: [45, 45], material: "Polyester" },
  "1688-595229918569": { material: "Faux Rabbit Fur" },
  "1688-595229918569-c2": { material: "Faux Rabbit Fur" },
  "1688-595229918569-c3": { material: "Faux Rabbit Fur" },
  "1688-1052742241013": { material: "Faux Cashmere" },
  "1688-1052742241013-c2": { material: "Faux Cashmere" },
  "1688-1052742241013-c3": { material: "Faux Cashmere" },
  "1688-1052742241013-c4": { material: "Faux Cashmere" },
  "1688-1052742241013-c5": { material: "Faux Cashmere" },
  "1688-1052742241013-c6": { material: "Faux Cashmere" },
  "1688-996768645117-c2": { material: "Polyester Shaggy" },
  "1688-996768645117-c3": { material: "Polyester Shaggy" },
  "1688-745181807454": { material: "Printed Polyester" },
  "1688-745181807454-c2": { material: "Printed Polyester" },
  "1688-745181807454-c3": { material: "Printed Polyester" },
  "1688-745181807454-c4": { material: "Printed Polyester" },
  "1688-745181807454-c5": { material: "Printed Polyester" },
  "1688-745181807454-c6": { material: "Printed Polyester" },
  "1688-745181807454-c7": { material: "Printed Polyester" },
  "1688-745181807454-c8": { material: "Printed Polyester" },
};
