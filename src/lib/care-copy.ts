/**
 * PDP 护理文案映射（新版/老版详情页共用）。
 * spec = 规格表 Care 行短句；long = Care & Maintenance 手风琴长句。
 * 地毯按标题关键词特判（productType "Mats" 混合了地毯与门垫/厨房垫，不能只按分类）。
 * 文案口径调整只需改这一处映射。
 */

export type CareCopy = { spec: string; long: string };

const CARE_RUG: CareCopy = {
  spec: 'Vacuum regularly; spot-clean spills promptly',
  long: 'The low-pile surface stands up to daily foot traffic and is simple to vacuum. Spot-clean spills quickly to preserve the colors.',
};

const CARE_BY_TYPE: Record<string, CareCopy> = {
  towels: {
    spec: 'Machine wash warm with like colors; tumble dry low; do not bleach',
    long: 'Machine wash warm with like colors and tumble dry low. Skip fabric softener to keep the fibers absorbent.',
  },
  bedding: {
    spec: 'Machine wash cold on gentle; tumble dry low',
    long: 'Machine wash cold on a gentle cycle and tumble dry low. Wash separately before first use.',
  },
  blankets: {
    spec: 'Machine wash cold on gentle; lay flat or tumble dry low',
    long: 'Machine wash cold on a gentle cycle, then lay flat or tumble dry low to keep it soft and plush.',
  },
  pillows: {
    spec: 'Fluff regularly; spot-clean or hand wash cover',
    long: 'Fluff regularly to keep the fill lofty. Spot-clean or hand-wash the cover and air dry fully.',
  },
  cushions: {
    spec: 'Spot-clean cover; air dry; fluff to restore shape',
    long: 'Spot-clean the cover with mild detergent and air dry. Fluff regularly to restore the shape.',
  },
  mats: {
    spec: 'Machine wash cold; air dry flat',
    long: 'Machine wash cold and air dry flat. Shake out loose dirt regularly.',
  },
};

const CARE_DEFAULT: CareCopy = {
  spec: 'Follow the care label on your product',
  long: 'For best results, follow the care instructions on the product label. Questions? We are happy to help.',
};

const RUG_TITLE_RE = /\b(rugs?|carpets?)\b/i;

export { RUG_TITLE_RE };

export function getCareCopy(productType: string, title: string): CareCopy {
  if (RUG_TITLE_RE.test(title)) return CARE_RUG;
  return CARE_BY_TYPE[(productType || '').toLowerCase()] ?? CARE_DEFAULT;
}
