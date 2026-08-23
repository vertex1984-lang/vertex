// 规格展示：重量/尺寸双单位格式化，自动提取表 + 手工覆盖表合并
import { PRODUCT_SPECS, ProductSpecs } from '@/data/product-specs';
import { SPECS_OVERRIDES } from '@/data/specs-overrides';

export function getProductSpecs(asin: string): ProductSpecs | undefined {
  const key = asin.toLowerCase();
  const generated = PRODUCT_SPECS[key];
  const override = SPECS_OVERRIDES[key];
  if (!generated && !override) return undefined;
  return { ...generated, ...override };
}

// 两位小数、去尾零（1.20 → "1.2"，450.00 → "450"）
const round2 = (v: number) => String(Math.round(v * 100) / 100);
// 四舍五入到最近的 0.5 或整数（43.3 → "43.5"，21.7 → "21.5"，55 → "55"）
const roundHalf = (v: number) => String(Math.round(v * 2) / 2);

const KG_PER_LB = 0.453592;
const KG_PER_OZ = 0.0283495;

/**
 * 重量双单位展示：≥1kg 用 kg/lb，<1kg 用 g/oz，均两位小数（去尾零）。
 * 重量为 0 或未设置时返回 null（该行不显示）。
 */
export function formatWeightDual(weight: number | undefined, unit: string | undefined): string | null {
  if (!weight || weight <= 0) return null;
  let kg: number;
  switch (unit) {
    case 'GRAMS': kg = weight / 1000; break;
    case 'POUNDS': kg = weight * KG_PER_LB; break;
    case 'OUNCES': kg = weight * KG_PER_OZ; break;
    case 'KILOGRAMS':
    default: kg = weight; break;
  }
  if (kg >= 1) return `${round2(kg)} kg / ${round2(kg / KG_PER_LB)} lb`;
  return `${round2(kg * 1000)} g / ${round2(kg / KG_PER_OZ)} oz`;
}

/** 尺寸双单位展示：cm 和 in 各自四舍五入到最近的 0.5，如 "110 x 55 cm / 43.5 x 21.5 in" */
export function formatDimensionsDual(dimsCm: number[] | undefined): string | null {
  if (!dimsCm || dimsCm.length === 0) return null;
  const cm = dimsCm.map(roundHalf).join(' x ');
  const inch = dimsCm.map(d => roundHalf(d / 2.54)).join(' x ');
  return `${cm} cm / ${inch} in`;
}
