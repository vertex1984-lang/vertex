/**
 * 产品标签体系：色系 + 场景（Complete the Look 主题，/featured-products 使用）
 *
 * 规则（2026-09 用户定）：color 和 scene 是产品的必要 tag，每个产品恰好一个 color 和一个 scene。
 * **Others / Decor / Dining 类目不参与 color/scene 分类**（2026-09 用户定）：打标脚本跳过这些类目，
 * 前端展示（Complete the Look / Shop by Color / Shop by Scene）同步排除，见 generate-tags.js / tagged.ts。
 *
 * - 色系（主色原则）：纯色/花色一视同仁，取标题中位置最靠前的颜色词作为主色
 *   （如 "(Khaki Floral)" → Khaki、"Orange Red Striped" → Orange）；
 *   标题完全无颜色词的少数产品走 COLOR_OVERRIDES 人工指定（看图定主色）。
 * - 场景：按 SCENE_PRIORITY（具体 → 宽泛）取第一个命中的场景；
 *   标题无场景词时按 productType 兜底（TYPE_FALLBACK），最终兜底 Living Room。
 * - 匹配用词边界正则（允许复数 s），避免 "red" 误中 "covered"、"door mat" 误中 "outdoor"。
 *
 * 规则覆盖机制（2026-09 新增，本地管理工具 scripts/admin-server.js 维护）：
 * tag-rules-overrides.json 可禁用内置色系/场景（disabledColors/disabledScenes）
 * 或追加自定义项（customColors/customScenes）。下方导出的 COLOR_RULES/SCENE_RULES
 * 均为「内置未被禁用 + 自定义追加在后」的生效合集；SCENE_PRIORITY 把自定义场景插到最前
 * （用户自定义 = 更具体），并过滤掉被禁用的 key。
 */

// 注意用 namespace import：本地脚本（scripts/*.js）的 TS shim 不开 esModuleInterop，
// default import 编译成 require(...).default 会取不到值；namespace import 两种环境都拿到 JSON 本体
import * as TAG_RULE_OVERRIDES from './tag-rules-overrides.json';

export interface ColorTag {
  key: string;
  label: string;
  hex: string;
}

export interface SceneTag {
  key: string;
  label: string;
}

interface ColorRule extends ColorTag {
  words: string[];
}

interface SceneRule extends SceneTag {
  words: string[];
}

/** 不参与 color/scene 标签与 Featured/榜单配额的一级类目（productType 值） */
export const NO_TAG_TYPES: ReadonlySet<string> = new Set(['Others', 'Decor', 'Dining']);

// 内置色系表（顺序即展示顺序）；生效合集见下方导出的 COLOR_RULES
export const BASE_COLOR_RULES: ColorRule[] = [
  { key: 'white', label: 'White', hex: '#FFFFFF', words: ['white', 'off white'] },
  { key: 'cream', label: 'Cream', hex: '#F3E9D2', words: ['cream', 'ivory', 'ecru', 'beige white'] },
  { key: 'beige', label: 'Beige', hex: '#D9C7A7', words: ['beige', 'tan', 'sand'] },
  { key: 'khaki', label: 'Khaki', hex: '#B7A077', words: ['khaki'] },
  { key: 'grey', label: 'Grey', hex: '#9A9A9A', words: ['grey', 'gray', 'silver', 'charcoal'] },
  { key: 'black', label: 'Black', hex: '#222222', words: ['black'] },
  { key: 'blue', label: 'Blue', hex: '#4A6FA5', words: ['blue', 'navy', 'denim'] },
  { key: 'green', label: 'Green', hex: '#6B8F71', words: ['green', 'sage', 'olive'] },
  { key: 'pink', label: 'Pink', hex: '#E3A6B0', words: ['pink', 'blush'] },
  { key: 'yellow', label: 'Yellow', hex: '#E5C04B', words: ['yellow', 'mustard'] },
  { key: 'purple', label: 'Purple', hex: '#9B7EB8', words: ['purple', 'lavender', 'lilac', 'violet'] },
  { key: 'red', label: 'Red', hex: '#B4443C', words: ['red', 'burgundy', 'wine'] },
  { key: 'orange', label: 'Orange', hex: '#C96F4A', words: ['orange', 'terracotta', 'rust'] },
  { key: 'brown', label: 'Brown', hex: '#8B5A2B', words: ['brown', 'camel', 'coffee', 'chocolate', 'taupe', 'wicker', 'rattan'] },
];

/**
 * 色系人工指定表（key = 小写产品标识）：标题无颜色词的产品在这里定主色。
 * 由用户看图确认后填入；分析脚本 scripts/ 会列出缺颜色的产品。
 */
export const COLOR_OVERRIDES: Record<string, string> = {
  b0d9lh1y55: 'yellow', // 黄铜研磨器，金色（看图定）
  b0bbzsgdbq: 'red',
  b0bbzw4lzr: 'red',
  b0c33lfhn1: 'pink',
  b0c3b265xj: 'pink',
  b0cc5vnqy3: 'red',
  b0cc5y77dc: 'blue',
  b0gd93xkhr: 'pink',
  b0dsgfxldv: 'blue',
  b0dsgckwxw: 'red',
  b0cw17pzyt: 'white',
  b0cjhl4lzp: 'yellow',
  '1688-1046667161713': 'brown',
  '1688-1044064113195-c2': 'cream',
  '1688-745181807454': 'beige',
  '1688-1052742241013-c4': 'red',
  '1688-745181807454-c4': 'white',
  '1688-745181807454-c6': 'blue',
  'linen3-oatmeal-twin': 'beige', // 燕麦色亚麻套件（看图定，浅燕麦归 Beige）
  'linen3-oatmeal-full': 'beige',
  'linen3-oatmeal-queen': 'beige',
  'linen3-oatmeal-king': 'beige',
};

// 内置场景表（顺序即展示顺序）；生效合集见下方导出的 SCENE_RULES
export const BASE_SCENE_RULES: SceneRule[] = [
  { key: 'living-room', label: 'Living Room', words: ['sofa', 'couch', 'area rug', 'throw pillow', 'blanket', 'rug'] },
  { key: 'bedroom', label: 'Bedroom', words: ['duvet', 'bedding', 'comforter', 'quilt', 'fitted sheet', 'bed sheet', 'bed pillow', 'pillow insert', 'pillowcase', 'pillow case', 'blanket', 'throw'] },
  { key: 'kitchen', label: 'Kitchen', words: ['kitchen', 'pepper', 'grinder', 'mill'] },
  { key: 'bathroom', label: 'Bathroom', words: ['bath', 'hand towel', 'face towel', 'washcloth', 'shower', 'towel set'] },
  { key: 'dining-room', label: 'Dining Room', words: ['dining'] },
  { key: 'garden-lawn', label: 'Garden & Lawn', words: ['outdoor', 'patio', 'rocking', 'high-back', 'high back', 'bench', 'porch', 'wicker', 'bicycle', 'bike', 'lawn', 'hanging', 'cauldron'] },
  { key: 'entryway', label: 'Entryway', words: ['door mat', 'doormat', 'entryway', 'entrance'] },
  { key: 'beach-pool', label: 'Beach & Pool', words: ['beach'] },
  { key: 'travel', label: 'Travel', words: ['travel', 'neck pillow'] },
];

// 场景判定优先级（内置）：具体 → 宽泛（blanket 同时命中 living/bedroom 时归 Bedroom，以此类推）
const BASE_SCENE_PRIORITY = [
  'travel', 'beach-pool', 'entryway', 'dining-room', 'kitchen',
  'bathroom', 'garden-lawn', 'bedroom', 'living-room',
];

// ---- 规则覆盖合成（tag-rules-overrides.json，由 scripts/admin-server.js 维护）----
// 显式标注类型：JSON 为四个空数组时 resolveJsonModule 会推断成 never[]
interface TagRuleOverrides {
  disabledColors: string[];
  disabledScenes: string[];
  customColors: ColorRule[];
  customScenes: SceneRule[];
}
const OVERRIDES: TagRuleOverrides = TAG_RULE_OVERRIDES;
const DISABLED_COLORS = new Set<string>(OVERRIDES.disabledColors ?? []);
const DISABLED_SCENES = new Set<string>(OVERRIDES.disabledScenes ?? []);

/** 生效色系：内置未被禁用的 + 自定义追加在后（顺序即展示顺序） */
export const COLOR_RULES: ColorRule[] = [
  ...BASE_COLOR_RULES.filter((c) => !DISABLED_COLORS.has(c.key)),
  ...(OVERRIDES.customColors ?? []),
];

/** 生效场景：内置未被禁用的 + 自定义追加在后（顺序即展示顺序） */
export const SCENE_RULES: SceneRule[] = [
  ...BASE_SCENE_RULES.filter((s) => !DISABLED_SCENES.has(s.key)),
  ...(OVERRIDES.customScenes ?? []),
];

// 生效优先级：自定义场景插到最前（用户自定义 = 更具体），过滤被禁用的内置 key
const SCENE_PRIORITY = [
  ...(OVERRIDES.customScenes ?? []).map((s) => s.key),
  ...BASE_SCENE_PRIORITY.filter((k) => !DISABLED_SCENES.has(k)),
];

// 标题无场景词时按一级类目兜底
const TYPE_FALLBACK: Record<string, string> = {
  Bedding: 'bedroom',
  Blankets: 'bedroom',
  Pillows: 'bedroom',
  Towels: 'bathroom',
  Mats: 'living-room',
  Cushions: 'living-room',
  Others: 'living-room',
};

const wordRegex = (word: string) =>
  // 允许复数 s 结尾（如 "bed pillow" 命中 "Bed Pillows"）
  new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?\\b`, 'i');

/** 唯一色系标签：主色原则（标题中最靠前的颜色词）→ COLOR_OVERRIDES 人工指定兜底 */
export function getColorTag(title: string, asin?: string): ColorTag | null {
  const override = asin ? COLOR_OVERRIDES[asin.toLowerCase()] : undefined;
  if (override) {
    const rule = COLOR_RULES.find((c) => c.key === override);
    if (rule) return { key: rule.key, label: rule.label, hex: rule.hex };
  }
  let best: { rule: ColorRule; idx: number } | null = null;
  for (const rule of COLOR_RULES) {
    for (const w of rule.words) {
      const idx = title.search(wordRegex(w));
      if (idx !== -1 && (best === null || idx < best.idx)) best = { rule, idx };
    }
  }
  if (!best) return null;
  const { key, label, hex } = best.rule;
  return { key, label, hex };
}

/** 唯一场景标签：优先级命中 → productType 兜底 → Living Room */
export function getSceneTag(title: string, productType?: string): SceneTag {
  for (const key of SCENE_PRIORITY) {
    const rule = SCENE_RULES.find((s) => s.key === key);
    if (rule && rule.words.some((w) => wordRegex(w).test(title))) {
      return { key: rule.key, label: rule.label };
    }
  }
  const fallbackKey = (productType && TYPE_FALLBACK[productType]) || 'living-room';
  const rule = SCENE_RULES.find((s) => s.key === fallbackKey) || SCENE_RULES[0];
  return { key: rule.key, label: rule.label };
}
