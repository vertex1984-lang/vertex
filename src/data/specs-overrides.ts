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
  // ── Bedding：bedset4/duvset 系列全部为 Microfiber（同系列已提取的兄弟款即 Microfiber）──
  "bedset4-gray-queen": { material: "Microfiber" },
  "bedset4-pink-queen": { material: "Microfiber" },
  "bedset4-pink-full": { material: "Microfiber" },
  "bedset4-white-full": { material: "Microfiber" },
  "duvset-gray-king": { material: "Microfiber" },
  "duvset-gray-full": { material: "Microfiber" },
  "duvset-gray-twin": { material: "Microfiber" },
  "duvset-beige-king": { material: "Microfiber" },
  "duvset-beige-twin": { material: "Microfiber" },
  "duvset-white-full": { material: "Microfiber" },
  "duvset-white-twin": { material: "Microfiber" },
  "bedset4-lilac-king": { material: "Microfiber" },
  "bedset4-tan-twin": { material: "Microfiber" },
  "bedset4-tan-full": { material: "Microfiber" },
  "bedset4-tan-king": { material: "Microfiber" },
  "bedset4-sage-twin": { material: "Microfiber" },
  "bedset4-sage-full": { material: "Microfiber" },
  "bedset4-sage-king": { material: "Microfiber" },
  "bedset4-mauve-twin": { material: "Microfiber" },
  "bedset4-mauve-full": { material: "Microfiber" },
  "bedset4-mauve-king": { material: "Microfiber" },
  "bedset4-moss-twin": { material: "Microfiber" },
  "bedset4-moss-full": { material: "Microfiber" },
  "bedset4-moss-queen": { material: "Microfiber" },
  "bedset4-moss-king": { material: "Microfiber" },
  "bedset4-coffee-twin": { material: "Microfiber" },
  "bedset4-coffee-full": { material: "Microfiber" },
  "bedset4-coffee-queen": { material: "Microfiber" },
  "bedset4-blue-full": { material: "Microfiber" },
  "bedset4-blue-queen": { material: "Microfiber" },
  "bedset4-blue-king": { material: "Microfiber" },
  "bedset4-plaid-full": { material: "Microfiber" },
  "bedset4-plaid-queen": { material: "Microfiber" },
  "bedset4-plaid-king": { material: "Microfiber" },

  // ── Bedding：Linen 误报修正（标题里的 "bed linen" 造成假 Linen，实为 Microfiber）──
  "bedset4-beige-full": { material: "Microfiber" },   // 原 "Linen, Rattan"
  "bedset4-beige-queen": { material: "Microfiber" },  // 原 "Linen"
  "bedset4-beige-twin": { material: "Microfiber" },   // 原 "Linen"
  "bedset4-tan-queen": { material: "Microfiber" },    // 原 "Linen"
  "bedset4-coffee-king": { material: "Microfiber" },  // 原 "Microfiber, Linen"
  // linen3 系列是真 100% Linen，仅去掉 Rattan 误报
  "linen3-charcoal-king": { material: "Linen" },      // 原 "Linen, Rattan"

  // ── Pillows：补材质 ──
  "b0f62y59cw": { material: "Hollowfibre" },
  "b0grj9sdtf": { material: "Hollowfibre" },
  "b0gjlsdz52": { material: "Microfiber" },  // 浮雕系列
  "b0gjlmc6z4": { material: "Microfiber" },  // 浮雕系列
  "b0gjlgxtl4": { material: "Microfiber" },  // 浮雕系列
  "b0gd843wmn": { material: "Microfiber" },  // 标题含 Microfibre
};
