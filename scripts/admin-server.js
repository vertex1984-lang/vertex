/* 本地分类管理工具（仅本地使用，不上线）：
 * 浏览产品、管理自定义类目/Tag（taxonomy.json）、
 * 管理色系/场景规则（tag-rules-overrides.json）与产品 color/scene 手工配置（product-tags.json）、
 * 管理材质词表与产品材质覆盖（material-overrides.json）、手工 Pack 件数（product-tags.json 的 manualPieces）、
 * 权重打分与权重范围（weight-boosts.json，构建期由 build-weights.js 烘焙进排序，改完需重建生效）。
 * 用法：node scripts/admin-server.js  →  http://localhost:8090 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const ts = require('typescript');

require.extensions['.ts'] = function (m, f) {
  const src = fs.readFileSync(f, 'utf8');
  const out = ts.transpileModule(src, {
    compilerOptions: { module: 'commonjs', target: 'es2020', jsx: 'react' },
  }).outputText;
  m._compile(out, f);
};
const Module = require('module');
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  if (request.startsWith('@/')) request = path.join(process.cwd(), 'src', request.slice(2));
  return origResolve.call(this, request, ...args);
};

const ROOT = process.cwd();
const TAXONOMY_PATH = path.join(ROOT, 'src/data/taxonomy.json');
const PRODUCT_TAGS_PATH = path.join(ROOT, 'src/data/product-tags.json');
const TAG_RULES_PATH = path.join(ROOT, 'src/data/tag-rules-overrides.json');
const MATERIAL_OVERRIDES_PATH = path.join(ROOT, 'src/data/material-overrides.json');
const WEIGHT_BOOSTS_PATH = path.join(ROOT, 'src/data/weight-boosts.json');
const OUT_DIR = path.join(ROOT, 'out');
const PORT = 8090;

const { PRODUCTS_DATA, enrichProductsWithShopifyData } = require(path.join(ROOT, 'src/data/products.ts'));
const { BASE_COLOR_RULES, BASE_SCENE_RULES } = require(path.join(ROOT, 'src/data/product-tags.ts'));
const { PRODUCT_SPECS } = require(path.join(ROOT, 'src/data/product-specs.ts'));
const { SPECS_OVERRIDES } = require(path.join(ROOT, 'src/data/specs-overrides.ts'));

function loadProductTags() {
  try {
    return JSON.parse(fs.readFileSync(PRODUCT_TAGS_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function readMaterialOverrides() {
  try {
    const o = JSON.parse(fs.readFileSync(MATERIAL_OVERRIDES_PATH, 'utf8'));
    return {
      materials: Array.isArray(o.materials) ? o.materials : [],
      assignments: o.assignments && typeof o.assignments === 'object' && !Array.isArray(o.assignments) ? o.assignments : {},
    };
  } catch {
    return { materials: [], assignments: {} };
  }
}

function readWeightBoosts() {
  try {
    const o = JSON.parse(fs.readFileSync(WEIGHT_BOOSTS_PATH, 'utf8'));
    const limits = o.limits && Number.isInteger(o.limits.min) && Number.isInteger(o.limits.max)
      ? { min: o.limits.min, max: o.limits.max }
      : { min: -30, max: 30 };
    return {
      limits,
      boosts: o.boosts && typeof o.boosts === 'object' && !Array.isArray(o.boosts) ? o.boosts : {},
    };
  } catch {
    return { limits: { min: -30, max: 30 }, boosts: {} };
  }
}

// 规格材质（自动提取 + specs-overrides 合并，不含产品级材质覆盖）
function specMaterial(asin) {
  const s = { ...(PRODUCT_SPECS[asin] || {}), ...(SPECS_OVERRIDES[asin] || {}) };
  return s.material || null;
}

// 生效材质（与 src/lib/specs.ts 的 getProductSpecs 合并顺序一致，
// 但每次请求从磁盘重读 material-overrides，避免 require 缓存脏数据）
function effectiveMaterial(asin, mo) {
  const assign = mo.assignments[asin];
  if (assign && assign.length > 0) return assign.join(', ');
  return specMaterial(asin);
}

function readTagRuleOverrides() {
  try {
    const o = JSON.parse(fs.readFileSync(TAG_RULES_PATH, 'utf8'));
    return {
      disabledColors: Array.isArray(o.disabledColors) ? o.disabledColors : [],
      disabledScenes: Array.isArray(o.disabledScenes) ? o.disabledScenes : [],
      customColors: Array.isArray(o.customColors) ? o.customColors : [],
      customScenes: Array.isArray(o.customScenes) ? o.customScenes : [],
    };
  } catch {
    return { disabledColors: [], disabledScenes: [], customColors: [], customScenes: [] };
  }
}

// 生效规则 = 内置未被禁用 + 自定义追加在后（与 product-tags.ts 的合成逻辑一致，
// 但每次请求从磁盘重读 override，避免 require 缓存导致保存后看不到新规则）
function effectiveColorRules(ov) {
  return [
    ...BASE_COLOR_RULES.filter((c) => !ov.disabledColors.includes(c.key)).map((c) => ({ key: c.key, label: c.label, hex: c.hex, custom: false })),
    ...ov.customColors.map((c) => ({ key: c.key, label: c.label, hex: c.hex, custom: true })),
  ];
}
function effectiveSceneRules(ov) {
  return [
    ...BASE_SCENE_RULES.filter((s) => !ov.disabledScenes.includes(s.key)).map((s) => ({ key: s.key, label: s.label, custom: false })),
    ...ov.customScenes.map((s) => ({ key: s.key, label: s.label, custom: true })),
  ];
}

function buildProducts() {
  const tags = loadProductTags();
  const mo = readMaterialOverrides();
  const wb = readWeightBoosts();
  return enrichProductsWithShopifyData(PRODUCTS_DATA).map((p) => {
    const asin = p.asin.toLowerCase();
    const t = tags[asin] || {};
    return {
      asin,
      title: p.title,
      productType: p.productType || '',
      subcategory: p.subcategory || null,
      inStock: !!(p.hasShopifyData && p.shopifyAvailable),
      image: (p.images && p.images[0] && p.images[0].url) || null,
      color: t.color || null,
      scene: t.scene || null,
      pieces: t.pieces ?? null,
      piecesManual: !!t.manualPieces,
      material: effectiveMaterial(asin, mo),
      materialSpec: specMaterial(asin),
      materialAssigned: mo.assignments[asin] || null,
      weightBoost: wb.boosts[asin] ?? null,
    };
  });
}

const splitMaterials = (s) => (s ? s.split(/,\s*/).filter(Boolean) : []);

// 原子材质词表 = 全部产品生效材质逗号拆分去重 ∪ 用户词表，按使用次数降序（同次数按字母序）
function buildMaterialOptions(products, mo) {
  const counts = {};
  products.forEach((p) => {
    splitMaterials(p.material).forEach((m) => { counts[m] = (counts[m] || 0) + 1; });
  });
  mo.materials.forEach((m) => { if (!(m in counts)) counts[m] = 0; });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
    .map(([m]) => m);
}

function readTaxonomy() {
  try {
    const t = JSON.parse(fs.readFileSync(TAXONOMY_PATH, 'utf8'));
    return {
      categories: Array.isArray(t.categories) ? t.categories : [],
      tags: Array.isArray(t.tags) ? t.tags : [],
      assignments: t.assignments && typeof t.assignments === 'object' ? t.assignments : {},
    };
  } catch {
    return { categories: [], tags: [], assignments: {} };
  }
}

const KEY_RE = /^[a-z0-9-]+$/;

function validateTaxonomy(t) {
  if (!t || typeof t !== 'object') return 'body 必须是 JSON 对象';
  if (!Array.isArray(t.categories) || !Array.isArray(t.tags)) return 'categories/tags 必须是数组';
  if (!t.assignments || typeof t.assignments !== 'object' || Array.isArray(t.assignments)) {
    return 'assignments 必须是对象';
  }
  const seen = new Set();
  for (const list of [t.categories, t.tags]) {
    for (const item of list) {
      if (!item || typeof item.key !== 'string' || typeof item.label !== 'string' || !item.label.trim()) {
        return '类目/Tag 必须有 key 和非空 label';
      }
      if (!KEY_RE.test(item.key)) return `非法 key: "${item.key}"（只允许小写字母/数字/连字符）`;
      if (seen.has(item.key)) return `key 重复: "${item.key}"`;
      seen.add(item.key);
    }
  }
  const catKeys = new Set(t.categories.map((c) => c.key));
  const tagKeys = new Set(t.tags.map((tg) => tg.key));
  for (const [asin, a] of Object.entries(t.assignments)) {
    if (typeof asin !== 'string' || asin !== asin.toLowerCase()) return `asin 必须小写: "${asin}"`;
    if (!a || typeof a !== 'object') return `assignments["${asin}"] 必须是对象`;
    if (a.category !== null && a.category !== undefined) {
      if (typeof a.category !== 'string' || !catKeys.has(a.category)) {
        return `assignments["${asin}"].category 引用了不存在的类目: "${a.category}"`;
      }
    }
    if (a.tags !== undefined) {
      if (!Array.isArray(a.tags)) return `assignments["${asin}"].tags 必须是数组`;
      for (const k of a.tags) {
        if (typeof k !== 'string' || !tagKeys.has(k)) {
          return `assignments["${asin}"].tags 引用了不存在的 tag: "${k}"`;
        }
      }
    }
  }
  return null;
}

function writeTaxonomy(t) {
  const normalized = {
    categories: t.categories,
    tags: t.tags,
    assignments: Object.fromEntries(
      Object.entries(t.assignments)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([asin, a]) => [asin, { category: a.category ?? null, tags: a.tags ?? [] }])
    ),
  };
  atomicWriteJson(TAXONOMY_PATH, normalized);
}

function atomicWriteJson(file, obj) {
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  fs.renameSync(tmp, file);
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

function validateTagRules(tr) {
  if (!tr || typeof tr !== 'object') return 'tagRules 必须是对象';
  for (const f of ['disabledColors', 'disabledScenes', 'customColors', 'customScenes']) {
    if (!Array.isArray(tr[f])) return `tagRules.${f} 必须是数组`;
  }
  const baseColorKeys = new Set(BASE_COLOR_RULES.map((c) => c.key));
  const baseSceneKeys = new Set(BASE_SCENE_RULES.map((s) => s.key));
  const checkDisabled = (list, baseKeys, name) => {
    const seen = new Set();
    for (const k of list) {
      if (typeof k !== 'string' || !baseKeys.has(k)) return `${name} 含不存在的内置 key: "${k}"`;
      if (seen.has(k)) return `${name} 重复: "${k}"`;
      seen.add(k);
    }
    return null;
  };
  let err = checkDisabled(tr.disabledColors, baseColorKeys, 'disabledColors');
  if (err) return err;
  err = checkDisabled(tr.disabledScenes, baseSceneKeys, 'disabledScenes');
  if (err) return err;
  const checkCustom = (list, baseKeys, name, needHex) => {
    const seen = new Set();
    for (const item of list) {
      if (!item || typeof item.key !== 'string' || typeof item.label !== 'string' || !item.label.trim()) {
        return `${name} 每项必须有 key 和非空 label`;
      }
      if (!KEY_RE.test(item.key)) return `非法 key: "${item.key}"（只允许小写字母/数字/连字符）`;
      if (baseKeys.has(item.key)) return `${name} 的 key 与内置规则冲突: "${item.key}"`;
      if (seen.has(item.key)) return `${name} key 重复: "${item.key}"`;
      seen.add(item.key);
      if (needHex && (typeof item.hex !== 'string' || !HEX_RE.test(item.hex))) {
        return `色系 "${item.key}" 的 hex 非法（需要 #RRGGBB）: "${item.hex}"`;
      }
      if (item.words !== undefined && (!Array.isArray(item.words) || item.words.some((w) => typeof w !== 'string'))) {
        return `${name}["${item.key}"].words 必须是字符串数组`;
      }
    }
    return null;
  };
  err = checkCustom(tr.customColors, baseColorKeys, 'customColors', true);
  if (err) return err;
  err = checkCustom(tr.customScenes, baseSceneKeys, 'customScenes', false);
  if (err) return err;
  return null;
}

function writeTagRules(tr) {
  const normalized = {
    disabledColors: tr.disabledColors,
    disabledScenes: tr.disabledScenes,
    // 自定义项可不给 words，默认 words=[key]（自动打标按 key 词匹配标题）
    customColors: tr.customColors.map((c) => ({ key: c.key, label: c.label.trim(), hex: c.hex, words: c.words ?? [c.key] })),
    customScenes: tr.customScenes.map((s) => ({ key: s.key, label: s.label.trim(), words: s.words ?? [s.key] })),
  };
  atomicWriteJson(TAG_RULES_PATH, normalized);
  return normalized;
}

function validateTagAssignments(ta, colorKeys, sceneKeys) {
  if (!ta || typeof ta !== 'object' || Array.isArray(ta)) return 'tagAssignments 必须是对象';
  for (const [asin, a] of Object.entries(ta)) {
    if (typeof asin !== 'string' || asin !== asin.toLowerCase()) return `asin 必须小写: "${asin}"`;
    if (!a || typeof a !== 'object') return `tagAssignments["${asin}"] 必须是对象`;
    if (a.color !== null && a.color !== undefined && !colorKeys.has(a.color)) {
      return `tagAssignments["${asin}"].color 引用了不存在的色系: "${a.color}"`;
    }
    if (a.scene !== null && a.scene !== undefined && !sceneKeys.has(a.scene)) {
      return `tagAssignments["${asin}"].scene 引用了不存在的场景: "${a.scene}"`;
    }
  }
  return null;
}

// ---- 材质词表 / 材质指派 / Pack 件数 ----

function validateMaterials(materials) {
  if (materials === undefined) return null; // 缺省 = 不变
  if (!Array.isArray(materials)) return 'materials 必须是数组';
  const seen = new Set();
  for (const m of materials) {
    if (typeof m !== 'string' || !m.trim() || m.trim().length > 40) {
      return `材质词必须是 1-40 字符的非空字符串: ${JSON.stringify(m)}`;
    }
    if (seen.has(m.trim())) return `材质词重复: "${m}"`;
    seen.add(m.trim());
  }
  return null;
}

// 生效材质词表 = 规格数据（自动提取 + specs-overrides）全部原子材质 ∪ 用户词表
function effectiveMaterialVocab(userMaterials) {
  const vocab = new Set(userMaterials);
  const asins = new Set([...Object.keys(PRODUCT_SPECS), ...Object.keys(SPECS_OVERRIDES)]);
  for (const asin of asins) {
    splitMaterials(specMaterial(asin)).forEach((m) => vocab.add(m));
  }
  return vocab;
}

function validateMaterialAssignments(ma, vocab) {
  if (ma === undefined) return null;
  if (!ma || typeof ma !== 'object' || Array.isArray(ma)) return 'materialAssignments 必须是对象';
  for (const [asin, arr] of Object.entries(ma)) {
    if (typeof asin !== 'string' || asin !== asin.toLowerCase()) return `asin 必须小写: "${asin}"`;
    if (arr === null) continue; // null = 删除覆盖，回退自动规格
    if (!Array.isArray(arr)) return `materialAssignments["${asin}"] 必须是数组或 null`;
    for (const m of arr) {
      if (typeof m !== 'string' || !vocab.has(m)) {
        return `materialAssignments["${asin}"] 引用了不在词表中的材质: "${m}"`;
      }
    }
  }
  return null;
}

function validatePiecesAssignments(pa) {
  if (pa === undefined) return null;
  if (!pa || typeof pa !== 'object' || Array.isArray(pa)) return 'piecesAssignments 必须是对象';
  for (const [asin, v] of Object.entries(pa)) {
    if (typeof asin !== 'string' || asin !== asin.toLowerCase()) return `asin 必须小写: "${asin}"`;
    if (v === null) continue; // null = pieces 置 null 并去掉 manualPieces
    if (!Number.isInteger(v) || v < 1 || v > 20) {
      return `piecesAssignments["${asin}"] 必须是 1-20 的整数或 null: ${JSON.stringify(v)}`;
    }
  }
  return null;
}

// 写 material-overrides.json：materials 全量替换（缺省=保持）；materialAssignments 增量应用；
// 从词表移除的用户材质词同步从所有 assignments 数组剔除（数组空了则删除该 asin 条目）
function writeMaterialOverrides(materials, materialAssignments) {
  const mo = readMaterialOverrides();
  const newMaterials = materials === undefined ? mo.materials : materials.map((m) => m.trim());
  const removed = mo.materials.filter((m) => !newMaterials.includes(m));
  const assignments = { ...mo.assignments };
  if (materialAssignments) {
    for (const [asin, arr] of Object.entries(materialAssignments)) {
      if (arr === null || (Array.isArray(arr) && arr.length === 0)) delete assignments[asin];
      else assignments[asin] = arr;
    }
  }
  if (removed.length > 0) {
    for (const [asin, arr] of Object.entries(assignments)) {
      const filtered = arr.filter((m) => !removed.includes(m));
      if (filtered.length === 0) delete assignments[asin];
      else if (filtered.length !== arr.length) assignments[asin] = filtered;
    }
  }
  const sorted = {};
  Object.keys(assignments).sort().forEach((k) => { sorted[k] = assignments[k]; });
  atomicWriteJson(MATERIAL_OVERRIDES_PATH, { materials: newMaterials, assignments: sorted });
}

// 写 product-tags.json 的 pieces：设值时加 manualPieces（保留已有 color/scene/manual 字段），
// null 时 pieces 置 null 并去掉 manualPieces
function applyPiecesAssignments(pa) {
  if (!pa) return;
  const tags = loadProductTags();
  for (const [asin, v] of Object.entries(pa)) {
    let entry = tags[asin];
    if (v === null) {
      if (!entry) continue;
      entry.pieces = null;
      delete entry.manualPieces;
    } else {
      if (!entry) {
        entry = { color: null, scene: null, pieces: null };
        tags[asin] = entry;
      }
      entry.pieces = v;
      entry.manualPieces = true;
    }
  }
  const sorted = {};
  Object.keys(tags).sort().forEach((k) => { sorted[k] = tags[k]; });
  atomicWriteJson(PRODUCT_TAGS_PATH, sorted);
}

// ---- 权重打分（weight-boosts.json，构建期由 build-weights.js 消费）----

function validateWeightLimits(wl) {
  if (wl === undefined) return null; // 缺省 = 不变
  if (!wl || typeof wl !== 'object') return 'weightLimits 必须是对象';
  const { min, max } = wl;
  if (!Number.isInteger(min) || !Number.isInteger(max)) return 'weightLimits 的 min/max 必须是整数';
  if (min < -200 || max > 200) return 'weightLimits 范围必须在 -200..200 之间';
  if (min >= max) return `weightLimits 要求 min < max（当前 ${min} >= ${max}）`;
  return null;
}

function validateWeightBoosts(wb, limits) {
  if (wb === undefined) return null;
  if (!wb || typeof wb !== 'object' || Array.isArray(wb)) return 'weightBoosts 必须是对象';
  for (const [asin, v] of Object.entries(wb)) {
    if (typeof asin !== 'string' || asin !== asin.toLowerCase()) return `asin 必须小写: "${asin}"`;
    if (v === null) continue; // null = 删除手工分
    if (!Number.isInteger(v)) return `weightBoosts["${asin}"] 必须是整数或 null: ${JSON.stringify(v)}`;
    if (v < limits.min || v > limits.max) {
      return `weightBoosts["${asin}"]=${v} 超出允许范围 ${limits.min}..${limits.max}`;
    }
  }
  return null;
}

// 写 weight-boosts.json：limits 全量替换（缺省=保持）；boostsDiff 增量应用（null=删除）。
// 调用前需保证合并后的 boosts 全部落在 limits 范围内（handleSave 里校验）。
function writeWeightBoosts(limits, boostsDiff) {
  const cur = readWeightBoosts();
  const newLimits = limits ?? cur.limits;
  const boosts = { ...cur.boosts };
  if (boostsDiff) {
    for (const [asin, v] of Object.entries(boostsDiff)) {
      if (v === null) delete boosts[asin];
      else boosts[asin] = v;
    }
  }
  const sorted = {};
  Object.keys(boosts).sort().forEach((k) => { sorted[k] = boosts[k]; });
  atomicWriteJson(WEIGHT_BOOSTS_PATH, { limits: newLimits, boosts: sorted });
}

// 把手工 color/scene 写入 product-tags.json；清理被禁用/删除规则的引用。
// staleColorKeys/staleSceneKeys：本次保存后不再生效的 key（被禁用或自定义被删除）。
function applyTagAssignments(ta, staleColorKeys, staleSceneKeys) {
  const tags = loadProductTags();
  // 1) 清理失效引用：引用被禁用/删除 key 的条目对应字段置 null，并去掉 manual 标记（回到自动打标）
  for (const entry of Object.values(tags)) {
    if (entry && typeof entry === 'object') {
      let touched = false;
      if (entry.color && staleColorKeys.has(entry.color)) { entry.color = null; touched = true; }
      if (entry.scene && staleSceneKeys.has(entry.scene)) { entry.scene = null; touched = true; }
      if (touched) delete entry.manual;
    }
  }
  // 2) 应用手工配置：保留 pieces；任一项非 null 则标记 manual；两项都 null 则去掉 manual
  for (const [asin, a] of Object.entries(ta)) {
    const color = a.color ?? null;
    const scene = a.scene ?? null;
    let entry = tags[asin];
    if (!entry) {
      if (!color && !scene) continue; // 无条目且两项都未设置，无需创建
      entry = { color: null, scene: null, pieces: null };
      tags[asin] = entry;
    }
    entry.color = color;
    entry.scene = scene;
    if (!color && !scene) delete entry.manual;
    else entry.manual = true;
  }
  const sorted = {};
  Object.keys(tags).sort().forEach((k) => { sorted[k] = tags[k]; });
  atomicWriteJson(PRODUCT_TAGS_PATH, sorted);
}

function handleSave(body, res) {
  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    return sendJson(res, 400, { ok: false, error: 'body 不是合法 JSON' });
  }
  const { taxonomy, tagRules, tagAssignments, materials, materialAssignments, piecesAssignments, weightLimits, weightBoosts } = payload || {};
  // 全部校验通过后再写任何文件
  let err = validateTaxonomy(taxonomy);
  if (err) return sendJson(res, 400, { ok: false, error: err });
  err = validateTagRules(tagRules);
  if (err) return sendJson(res, 400, { ok: false, error: err });
  const colorKeys = new Set([
    ...BASE_COLOR_RULES.filter((c) => !tagRules.disabledColors.includes(c.key)).map((c) => c.key),
    ...tagRules.customColors.map((c) => c.key),
  ]);
  const sceneKeys = new Set([
    ...BASE_SCENE_RULES.filter((s) => !tagRules.disabledScenes.includes(s.key)).map((s) => s.key),
    ...tagRules.customScenes.map((s) => s.key),
  ]);
  err = validateTagAssignments(tagAssignments, colorKeys, sceneKeys);
  if (err) return sendJson(res, 400, { ok: false, error: err });
  err = validateMaterials(materials);
  if (err) return sendJson(res, 400, { ok: false, error: err });
  const userMaterials = materials === undefined ? readMaterialOverrides().materials : materials.map((m) => m.trim());
  err = validateMaterialAssignments(materialAssignments, effectiveMaterialVocab(userMaterials));
  if (err) return sendJson(res, 400, { ok: false, error: err });
  err = validatePiecesAssignments(piecesAssignments);
  if (err) return sendJson(res, 400, { ok: false, error: err });
  err = validateWeightLimits(weightLimits);
  if (err) return sendJson(res, 400, { ok: false, error: err });
  const effLimits = weightLimits ?? readWeightBoosts().limits;
  err = validateWeightBoosts(weightBoosts, effLimits);
  if (err) return sendJson(res, 400, { ok: false, error: err });
  // limits 收紧时：合并本次 weightBoosts 后的全部手工分必须仍在新范围内，否则拒绝并列出超范围 asin
  if (weightLimits !== undefined) {
    const merged = { ...readWeightBoosts().boosts };
    if (weightBoosts) {
      for (const [asin, v] of Object.entries(weightBoosts)) {
        if (v === null) delete merged[asin];
        else merged[asin] = v;
      }
    }
    const outOfRange = Object.entries(merged)
      .filter(([, v]) => v < effLimits.min || v > effLimits.max)
      .map(([asin, v]) => `${asin}=${v}`);
    if (outOfRange.length > 0) {
      return sendJson(res, 400, {
        ok: false,
        error: `新范围 ${effLimits.min}..${effLimits.max} 会导致 ${outOfRange.length} 个现有打分超范围，请先调整: ${outOfRange.join(', ')}`,
      });
    }
  }
  try {
    writeTaxonomy(taxonomy);
    const oldRules = readTagRuleOverrides();
    writeTagRules(tagRules);
    const removedCustomColors = oldRules.customColors.filter((c) => !tagRules.customColors.some((n) => n.key === c.key)).map((c) => c.key);
    const removedCustomScenes = oldRules.customScenes.filter((s) => !tagRules.customScenes.some((n) => n.key === s.key)).map((s) => s.key);
    applyTagAssignments(
      tagAssignments,
      new Set([...tagRules.disabledColors, ...removedCustomColors]),
      new Set([...tagRules.disabledScenes, ...removedCustomScenes])
    );
    if (materials !== undefined || materialAssignments !== undefined) {
      writeMaterialOverrides(materials, materialAssignments);
    }
    applyPiecesAssignments(piecesAssignments);
    if (weightLimits !== undefined || weightBoosts !== undefined) {
      writeWeightBoosts(weightLimits, weightBoosts);
    }
  } catch (e) {
    return sendJson(res, 500, { ok: false, error: '写入失败: ' + e.message });
  }
  sendJson(res, 200, { ok: true });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function sendJson(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

// CSRF 防护：带 Origin 的跨站请求一律拒绝（无 Origin 的非浏览器客户端放行）
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

// 收集 POST body；超过 10MB 先回 413 再断开，回调不再触发
function collectBody(req, res, cb) {
  let body = '';
  let tooLarge = false;
  req.on('data', (c) => {
    body += c;
    if (!tooLarge && body.length > 10 * 1024 * 1024) {
      tooLarge = true;
      sendJson(res, 413, { ok: false, error: '请求体过大（上限 10MB）' });
      req.destroy();
    }
  });
  req.on('end', () => { if (!tooLarge) cb(body); });
}

function serveStatic(res, urlPath) {
  let rel;
  try {
    rel = decodeURIComponent(urlPath);
  } catch {
    res.writeHead(404).end('not found');
    return;
  }
  const file = path.normalize(path.join(OUT_DIR, rel));
  if (!file.startsWith(OUT_DIR + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}

const PAGE = buildPage();

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');
  if (req.method === 'POST' && !sameOrigin(req)) {
    return sendJson(res, 403, { ok: false, error: '跨站请求被拒绝' });
  }
  if (req.method === 'GET' && u.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(PAGE);
    return;
  }
  if (req.method === 'GET' && u.pathname === '/api/data') {
    const ov = readTagRuleOverrides();
    const mo = readMaterialOverrides();
    const products = buildProducts();
    sendJson(res, 200, {
      products,
      taxonomy: readTaxonomy(),
      colorRules: effectiveColorRules(ov),
      sceneRules: effectiveSceneRules(ov),
      baseColors: BASE_COLOR_RULES.map((c) => ({ key: c.key, label: c.label, hex: c.hex })),
      baseScenes: BASE_SCENE_RULES.map((s) => ({ key: s.key, label: s.label })),
      tagRules: ov,
      materialOptions: buildMaterialOptions(products, mo),
      materials: mo.materials,
      weightLimits: readWeightBoosts().limits,
    });
    return;
  }
  if (req.method === 'POST' && u.pathname === '/api/save') {
    collectBody(req, res, (body) => handleSave(body, res));
    return;
  }
  if (req.method === 'POST' && u.pathname === '/api/taxonomy') {
    collectBody(req, res, (body) => {
      let t;
      try {
        t = JSON.parse(body);
      } catch {
        return sendJson(res, 400, { ok: false, error: 'body 不是合法 JSON' });
      }
      const err = validateTaxonomy(t);
      if (err) return sendJson(res, 400, { ok: false, error: err });
      try {
        writeTaxonomy(t);
      } catch (e) {
        return sendJson(res, 500, { ok: false, error: '写入失败: ' + e.message });
      }
      sendJson(res, 200, { ok: true });
    });
    return;
  }
  if (req.method === 'GET') {
    serveStatic(res, u.pathname);
    return;
  }
  res.writeHead(405).end('method not allowed');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`分类管理工具（仅本地使用）: http://localhost:${PORT}`);
  console.log('数据写入 src/data/taxonomy.json');
});

function buildPage() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>分类管理工具（本地）</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font: 14px/1.5 -apple-system, "Segoe UI", "Microsoft YaHei", sans-serif; color: #222; background: #f5f5f4; }
  header { background: #2d2a26; color: #fff; padding: 10px 16px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  header h1 { font-size: 16px; margin: 0; }
  header .note { font-size: 12px; color: #d6c9b8; }
  #saveBtn { margin-left: auto; padding: 6px 18px; border: 0; border-radius: 4px; background: #b4443c; color: #fff; font-size: 14px; cursor: pointer; }
  #saveBtn:disabled { background: #999; cursor: default; }
  #dirty { color: #e5c04b; font-size: 13px; display: none; }
  #toast { position: fixed; top: 12px; right: 12px; background: #2d6a4f; color: #fff; padding: 8px 16px; border-radius: 4px; display: none; z-index: 99; }
  #toast.err { background: #b4443c; }
  .layout { display: flex; align-items: flex-start; }
  aside { width: 270px; flex: none; background: #fff; border-right: 1px solid #e3e0da; min-height: calc(100vh - 44px); padding: 12px; position: sticky; top: 0; }
  aside h2 { font-size: 13px; margin: 14px 0 6px; color: #6b655c; text-transform: uppercase; letter-spacing: .05em; }
  .item { display: flex; align-items: center; gap: 6px; padding: 4px 6px; border-radius: 4px; }
  .item:hover { background: #f0ede8; }
  .item .lbl { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .item .cnt { color: #999; font-size: 12px; }
  .item button { border: 0; background: none; cursor: pointer; color: #8a8378; font-size: 12px; padding: 0 2px; }
  .item button:hover { color: #b4443c; }
  .swatch { width: 14px; height: 14px; border-radius: 3px; border: 1px solid #ccc; flex: none; display: inline-block; }
  .badge { font-size: 10px; color: #fff; background: #b7a077; border-radius: 3px; padding: 0 4px; flex: none; }
  .addRow { display: flex; gap: 6px; margin-top: 4px; }
  .addRow input { flex: 1; min-width: 0; padding: 4px 6px; border: 1px solid #d6d0c6; border-radius: 4px; }
  .addRow input[type=color] { flex: none; width: 34px; height: 29px; padding: 1px 2px; background: #fff; cursor: pointer; }
  .addRow button { padding: 4px 10px; border: 0; border-radius: 4px; background: #2d2a26; color: #fff; cursor: pointer; flex: none; }
  main { flex: 1; padding: 12px 16px; min-width: 0; }
  .filters { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 10px; background: #fff; padding: 10px; border-radius: 6px; border: 1px solid #e3e0da; }
  .filters select, .filters input[type=search] { padding: 5px 8px; border: 1px solid #d6d0c6; border-radius: 4px; }
  .filters input[type=search] { width: 220px; }
  #batchBar { display: none; position: sticky; top: 0; z-index: 30; background: #fff8ec; border: 1px solid #e5c04b; border-radius: 6px; padding: 8px 10px; margin-bottom: 10px; align-items: center; gap: 8px; flex-wrap: wrap; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  #batchBar .bLbl { font-weight: 700; color: #8a6d1a; }
  #batchBar select, #batchBar input[type=number] { padding: 4px 6px; border: 1px solid #d6d0c6; border-radius: 4px; background: #fff; max-width: 150px; }
  #batchBar input[type=number] { width: 64px; }
  #batchBar button.bApply { padding: 4px 10px; border: 0; border-radius: 4px; background: #2d2a26; color: #fff; cursor: pointer; }
  #batchBar button.bGhost { padding: 4px 10px; border: 1px solid #d6d0c6; border-radius: 4px; background: #fff; cursor: pointer; }
  table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e3e0da; }
  th, td { padding: 6px 8px; border-bottom: 1px solid #eeeae3; text-align: left; vertical-align: middle; }
  th { font-size: 12px; color: #6b655c; background: #faf9f7; }
  th.selCol, td.selCol { width: 26px; text-align: center; padding: 6px 2px; }
  td img { width: 48px; height: 48px; object-fit: cover; border-radius: 4px; background: #eee; display: block; transition: transform .15s ease, box-shadow .15s ease; transform-origin: left center; }
  td img:hover { transform: scale(4.5); position: relative; z-index: 60; box-shadow: 0 6px 24px rgba(0,0,0,.35); border-radius: 6px; cursor: zoom-in; }
  .ttl { max-width: 240px; }
  .small { font-size: 12px; color: #999; }
  .asin { font-family: monospace; font-size: 12px; }
  select.cat, select.cs { max-width: 130px; padding: 3px 4px; border: 1px solid #d6d0c6; border-radius: 4px; }
  .tagbox { position: relative; display: inline-block; }
  .tagbox > button { padding: 3px 8px; border: 1px solid #d6d0c6; border-radius: 4px; background: #fff; cursor: pointer; max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .tagbox > button .mMark { color: #b4443c; }
  .tagbox .pop { display: none; position: absolute; z-index: 40; background: #fff; border: 1px solid #d6d0c6; border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,.12); padding: 6px; min-width: 170px; max-height: 260px; overflow: auto; }
  .tagbox.open .pop { display: block; }
  .tagbox .pop label { display: flex; gap: 6px; align-items: center; padding: 3px 4px; font-size: 13px; cursor: pointer; border-radius: 3px; }
  .tagbox .pop label:hover { background: #f0ede8; }
  .matAdd { display: flex; gap: 4px; padding: 5px 2px 2px; border-top: 1px solid #eeeae3; margin-top: 4px; }
  .matAdd input { flex: 1; min-width: 0; padding: 3px 6px; border: 1px solid #d6d0c6; border-radius: 4px; font-size: 12px; }
  .matAdd button { padding: 3px 8px; border: 0; border-radius: 4px; background: #2d2a26; color: #fff; cursor: pointer; font-size: 12px; flex: none; }
  .matReset { background: none !important; color: #b4443c !important; text-decoration: underline; padding: 3px 2px !important; font-size: 12px; }
  .pwrap select.piecesPreset { width: 84px; padding: 3px 2px; border: 1px solid #d6d0c6; border-radius: 4px; background: #fff; }
  .pwrap input.piecesCustom { width: 56px; padding: 3px 4px; border: 1px solid #d6d0c6; border-radius: 4px; }
  .pwrap select:disabled, .pwrap input:disabled { background: #f0ede8; color: #b5aea2; cursor: not-allowed; }
  .pwrap.manual select.piecesPreset, .pwrap.manual input.piecesCustom { font-weight: 700; border-color: #b7a077; background: #fdf6ec; }
  .pwrap.manual select:disabled, .pwrap.manual input:disabled { background: #f5efe2; color: #8a6d1a; }
  .pwrap .mMark { color: #b4443c; font-size: 11px; margin-left: 2px; }
  .pwrap .unit { font-size: 12px; color: #999; margin-left: 2px; }
  input.wscore { width: 60px; padding: 3px 4px; border: 1px solid #d6d0c6; border-radius: 4px; text-align: right; }
  input.wscore.filled { font-weight: 700; border-color: #b7a077; background: #fdf6ec; }
  tr.changed td { background: #fdf6ec; }
  .empty { color: #999; font-size: 12px; padding: 2px 0; }
  #count { color: #6b655c; font-size: 12px; margin-left: auto; }
</style>
</head>
<body>
<header>
  <h1>分类管理工具</h1>
  <span class="note">本工具仅本地使用，不上线；数据写入 src/data/taxonomy.json / tag-rules-overrides.json / material-overrides.json / product-tags.json / weight-boosts.json</span>
  <span id="dirty">● 有未保存的改动</span>
  <button id="saveBtn">保存</button>
</header>
<div id="toast"></div>
<div class="layout">
  <aside>
    <h2>自定义类目</h2>
    <div id="catList"></div>
    <div class="addRow">
      <input id="newCat" placeholder="新类目名称">
      <button id="addCatBtn">新增</button>
    </div>
    <h2>自定义 Tag</h2>
    <div id="tagList"></div>
    <div class="addRow">
      <input id="newTag" placeholder="新 Tag 名称">
      <button id="addTagBtn">新增</button>
    </div>
    <h2>色系 Color</h2>
    <div id="colorList"></div>
    <div class="addRow">
      <input id="newColorLabel" placeholder="新色系名称">
      <input type="color" id="newColorHex" value="#cccccc" title="选择颜色">
      <button id="addColorBtn">新增</button>
    </div>
    <h2>场景 Scene</h2>
    <div id="sceneList"></div>
    <div class="addRow">
      <input id="newSceneLabel" placeholder="新场景名称">
      <button id="addSceneBtn">新增</button>
    </div>
    <h2>权重范围</h2>
    <div class="addRow">
      <input type="number" id="wMin" step="1" title="权重最小值">
      <input type="number" id="wMax" step="1" title="权重最大值">
    </div>
    <div class="empty" style="margin-top:4px">打分超出范围会被拒绝；保存并重新构建后生效</div>
  </aside>
  <main>
    <div class="filters">
      <label>一级类目 <select id="fType"><option value="">全部</option></select></label>
      <label>自定义类目 <select id="fCat"><option value="">全部</option><option value="__none__">未分配</option></select></label>
      <input type="search" id="fSearch" placeholder="搜索标题 / ASIN">
      <label><input type="checkbox" id="fStock" checked> 只看在售</label>
      <span id="count"></span>
    </div>
    <div id="batchBar">
      <span class="bLbl" id="bCount">已选 0 个</span>
      <select id="bCat"></select>
      <select id="bTagAdd"></select>
      <select id="bTagDel"></select>
      <select id="bColor"></select>
      <select id="bScene"></select>
      <span class="tagbox"><button type="button">选材质 ▾</button><span class="pop" id="bMatPop"></span></span>
      <button type="button" class="bApply" id="bMatReplaceBtn">替换材质</button>
      <button type="button" class="bApply" id="bMatAppendBtn">追加材质</button>
      <input type="number" id="bPieces" min="1" max="20" placeholder="Pack">
      <button type="button" class="bApply" id="bPiecesApply">设 Pack</button>
      <button type="button" class="bGhost" id="bPiecesClear">清空 Pack</button>
      <input type="number" id="bWeight" step="1" placeholder="权重">
      <button type="button" class="bApply" id="bWeightApply">设权重</button>
      <button type="button" class="bGhost" id="bWeightClear">清空权重</button>
      <button type="button" class="bGhost" id="bClear">清除所选改动</button>
      <button type="button" class="bGhost" id="bDeselect">取消选择</button>
    </div>
    <table>
      <thead><tr>
        <th class="selCol"><input type="checkbox" id="selAll" title="全选/取消当前筛选结果"></th><th>图</th><th>标题</th><th>ASIN</th><th>权重</th><th>现有类目</th><th>Color</th><th>Scene</th><th>材质 / Pack</th><th>自定义类目</th><th>自定义 Tag</th>
      </tr></thead>
      <tbody id="tbody"></tbody>
    </table>
  </main>
</div>
<script>
let products = [];
let taxonomy = { categories: [], tags: [], assignments: {} };
let tagRules = { disabledColors: [], disabledScenes: [], customColors: [], customScenes: [] };
let baseColors = [], baseScenes = [];
let materialOptions = [], materialsList = [];
let tagAssignDiff = {};   // asin -> { color, scene }（只记录改动过的产品）
let matAssignDiff = {};   // asin -> string[] | null（null = 删除材质覆盖，回退自动规格）
let piecesDiff = {};      // asin -> number | null（null = pieces 置空并去掉 manualPieces）
let weightDiff = {};      // asin -> number | null（null = 删除手工打分）
let weightLimits = { min: -30, max: 30 };       // 当前权重范围（未保存的改动直接改这里）
let savedWeightLimits = { min: -30, max: 30 };  // 已保存的权重范围
const PACK_PRESETS = [1, 2, 3, 4, 6, 8];        // Pack 预设下拉选项
let savedTaxonomyJson = '', savedTagRulesJson = '', savedMaterialsJson = '';
const selected = new Set(); // 批量操作：勾选的 asin
let bMats = new Set();      // 批量材质勾选

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// 生效规则 = 内置未禁用 + 自定义在后（与服务端合成一致）
const effColors = () => [
  ...baseColors.filter(c => !tagRules.disabledColors.includes(c.key)).map(c => ({ ...c, custom: false })),
  ...tagRules.customColors.map(c => ({ key: c.key, label: c.label, hex: c.hex, custom: true })),
];
const effScenes = () => [
  ...baseScenes.filter(s => !tagRules.disabledScenes.includes(s.key)).map(s => ({ ...s, custom: false })),
  ...tagRules.customScenes.map(s => ({ key: s.key, label: s.label, custom: true })),
];

// 产品当前的 color/scene：未保存改动优先，否则用持久化值
const curAssign = (p) => tagAssignDiff[p.asin] || { color: p.color, scene: p.scene };
function setTagAssign(asin, field, value) {
  const p = products.find(x => x.asin === asin);
  const cur = { ...curAssign(p) };
  cur[field] = value || null;
  if (cur.color === p.color && cur.scene === p.scene) delete tagAssignDiff[asin];
  else tagAssignDiff[asin] = cur;
}

// ---- 材质 / Pack 当前值与改动 ----
const splitMat = (s) => (s ? s.split(/,\\s*/).filter(Boolean) : []);
const specMats = (p) => splitMat(p.materialSpec);
const baseMats = (p) => (p.materialAssigned ? [...p.materialAssigned] : specMats(p)); // 已保存的当前值
const curMats = (p) => matAssignDiff[p.asin] !== undefined
  ? (matAssignDiff[p.asin] === null ? specMats(p) : matAssignDiff[p.asin])
  : baseMats(p);
const isMatManual = (p) => matAssignDiff[p.asin] !== undefined ? matAssignDiff[p.asin] !== null : !!p.materialAssigned;
const sameSet = (a, b) => a.length === b.length && [...a].sort().join('|') === [...b].sort().join('|');
function setMatAssign(asin, arr) { // arr = null 表示删除覆盖（回退自动规格）
  const p = products.find(x => x.asin === asin);
  if (arr === null) {
    if (!p.materialAssigned) delete matAssignDiff[asin];
    else matAssignDiff[asin] = null;
  } else if (sameSet(arr, baseMats(p))) {
    delete matAssignDiff[asin];
  } else {
    matAssignDiff[asin] = arr;
  }
}
const curPieces = (p) => piecesDiff[p.asin] !== undefined ? piecesDiff[p.asin] : p.pieces;
const isPiecesManual = (p) => piecesDiff[p.asin] !== undefined ? piecesDiff[p.asin] !== null : p.piecesManual;
function setPieces(asin, raw) {
  const p = products.find(x => x.asin === asin);
  if (raw === '') {
    if (p.pieces === null || p.pieces === undefined) delete piecesDiff[asin];
    else piecesDiff[asin] = null;
    return;
  }
  const n = parseInt(raw, 10);
  if (!Number.isInteger(n) || n < 1 || n > 20) return; // 客户端忽略非法输入，服务端兜底校验
  if (n === p.pieces) delete piecesDiff[asin];
  else piecesDiff[asin] = n;
}

// ---- 权重打分当前值与改动 ----
const curWeight = (p) => weightDiff[p.asin] !== undefined ? weightDiff[p.asin] : p.weightBoost;
// raw 为空串 = 清除打分（回到未设置）；返回错误消息（null = 成功）
function setWeight(asin, raw) {
  const p = products.find(x => x.asin === asin);
  if (raw === '') {
    if (p.weightBoost === null || p.weightBoost === undefined) delete weightDiff[asin];
    else weightDiff[asin] = null;
    return null;
  }
  const n = Number(raw);
  if (!Number.isInteger(n)) return '权重必须是整数';
  if (n < weightLimits.min || n > weightLimits.max) {
    return '权重 ' + n + ' 超出允许范围 ' + weightLimits.min + ' ~ ' + weightLimits.max + '，本次打分未生效';
  }
  if (n === p.weightBoost) delete weightDiff[asin];
  else weightDiff[asin] = n;
  return null;
}
// 权重范围输入框改动：非法或会挤出已有打分时拒绝并还原输入框
function onLimitsChange() {
  const min = Number($('wMin').value), max = Number($('wMax').value);
  const revert = () => { $('wMin').value = weightLimits.min; $('wMax').value = weightLimits.max; };
  if (!Number.isInteger(min) || !Number.isInteger(max) || min < -200 || max > 200 || min >= max) {
    toast('权重范围需为 -200..200 的整数且 最小值 < 最大值', true);
    return revert();
  }
  const offending = products.filter(p => {
    const w = curWeight(p);
    return w != null && (w < min || w > max);
  }).map(p => p.asin);
  if (offending.length > 0) {
    toast('新范围 ' + min + ' ~ ' + max + ' 会导致 ' + offending.length + ' 个现有打分超范围，请先调整: ' + offending.slice(0, 5).join(', ') + (offending.length > 5 ? ' 等' : ''), true);
    return revert();
  }
  weightLimits = { min, max };
  markDirty();
  renderTable(); // 行内输入框的 min/max 跟随新范围
}
const weightLimitsChanged = () => weightLimits.min !== savedWeightLimits.min || weightLimits.max !== savedWeightLimits.max;
function addMaterialWord(asin, input) {
  const v = input.value.trim();
  if (!v || v.length > 40) return;
  if (!materialOptions.includes(v)) { materialOptions.push(v); materialsList.push(v); }
  const p = products.find(x => x.asin === asin);
  const cur = new Set(curMats(p));
  cur.add(v);
  setMatAssign(asin, [...cur]);
  markDirty(); renderTable();
}

function getAssign(asin) {
  let a = taxonomy.assignments[asin];
  if (!a) a = { category: null, tags: [] };
  return a;
}
function setAssign(asin, a) {
  if (!a.category && (!a.tags || a.tags.length === 0)) delete taxonomy.assignments[asin];
  else taxonomy.assignments[asin] = a;
  markDirty();
}
function markDirty() {
  const dirty = JSON.stringify(taxonomy) !== savedTaxonomyJson
    || JSON.stringify(tagRules) !== savedTagRulesJson
    || JSON.stringify(materialsList) !== savedMaterialsJson
    || Object.keys(tagAssignDiff).length > 0
    || Object.keys(matAssignDiff).length > 0
    || Object.keys(piecesDiff).length > 0
    || Object.keys(weightDiff).length > 0
    || weightLimitsChanged();
  $('dirty').style.display = dirty ? 'inline' : 'none';
}
function toast(msg, isErr) {
  const t = $('toast');
  t.textContent = msg;
  t.className = isErr ? 'err' : '';
  t.style.display = 'block';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => (t.style.display = 'none'), 4000);
}

function makeKey(label, existing) {
  let base = label.trim().toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!base) base = 'item';
  let key = base, n = 2;
  while (existing.has(key)) key = base + '-' + n++;
  return key;
}
function allKeys() {
  return new Set([...taxonomy.categories.map(c => c.key), ...taxonomy.tags.map(t => t.key)]);
}
function ruleKeys(kind) {
  return kind === 'colors'
    ? new Set([...baseColors.map(c => c.key), ...tagRules.customColors.map(c => c.key)])
    : new Set([...baseScenes.map(s => s.key), ...tagRules.customScenes.map(s => s.key)]);
}

function addItem(kind, label) {
  label = label.trim();
  if (!label) return;
  const key = makeKey(label, allKeys());
  taxonomy[kind].push({ key, label });
  markDirty(); renderSidebar(); renderTable();
}
function renameItem(kind, key) {
  const item = taxonomy[kind].find(x => x.key === key);
  const label = prompt('重命名为：', item.label);
  if (!label || !label.trim() || label.trim() === item.label) return;
  item.label = label.trim();
  markDirty(); renderSidebar(); renderTable();
}
function deleteItem(kind, key) {
  const item = taxonomy[kind].find(x => x.key === key);
  if (!confirm('确定删除「' + item.label + '」？' + (kind === 'categories' ? '该类目下产品的自定义类目将变为未分配。' : '所有产品的该 Tag 将被移除。'))) return;
  taxonomy[kind] = taxonomy[kind].filter(x => x.key !== key);
  for (const [asin, a] of Object.entries(taxonomy.assignments)) {
    if (kind === 'categories' && a.category === key) a.category = null;
    if (kind === 'tags' && a.tags) a.tags = a.tags.filter(k => k !== key);
    if (!a.category && (!a.tags || a.tags.length === 0)) delete taxonomy.assignments[asin];
  }
  markDirty(); renderSidebar(); renderTable();
}

function addRule(kind, label, hex) {
  label = label.trim();
  if (!label) return;
  const key = makeKey(label, ruleKeys(kind));
  if (kind === 'colors') tagRules.customColors.push({ key, label, hex, words: [key] });
  else tagRules.customScenes.push({ key, label, words: [key] });
  markDirty(); renderSidebar(); renderTable();
}
function deleteRule(kind, key) {
  const field = kind === 'colors' ? 'color' : 'scene';
  const item = (kind === 'colors' ? effColors() : effScenes()).find(x => x.key === key);
  const n = products.filter(p => curAssign(p)[field] === key).length;
  if (!confirm('确定删除「' + item.label + '」？引用该标签的 ' + n + ' 个产品将被清空。')) return;
  if (item.custom) {
    // 自定义项：彻底移除
    tagRules[kind === 'colors' ? 'customColors' : 'customScenes'] =
      tagRules[kind === 'colors' ? 'customColors' : 'customScenes'].filter(x => x.key !== key);
  } else {
    // 内置项：加入 disabled 列表
    tagRules[kind === 'colors' ? 'disabledColors' : 'disabledScenes'].push(key);
  }
  // 内存中引用该 key 的产品同步清空（存量数据由服务端保存时清理）
  products.forEach(p => { if (curAssign(p)[field] === key) setTagAssign(p.asin, field, null); });
  markDirty(); renderSidebar(); renderTable();
}

function renderSidebar() {
  const counts = { categories: {}, tags: {}, color: {}, scene: {} };
  for (const a of Object.values(taxonomy.assignments)) {
    if (a.category) counts.categories[a.category] = (counts.categories[a.category] || 0) + 1;
    (a.tags || []).forEach(k => counts.tags[k] = (counts.tags[k] || 0) + 1);
  }
  products.forEach(p => {
    const a = curAssign(p);
    if (a.color) counts.color[a.color] = (counts.color[a.color] || 0) + 1;
    if (a.scene) counts.scene[a.scene] = (counts.scene[a.scene] || 0) + 1;
  });
  const draw = (el, kind) => {
    el.innerHTML = taxonomy[kind].map(item =>
      '<div class="item"><span class="lbl" title="' + esc(item.key) + '">' + esc(item.label) + '</span>' +
      '<span class="cnt">' + (counts[kind][item.key] || 0) + '</span>' +
      '<button data-act="rename" data-kind="' + kind + '" data-key="' + esc(item.key) + '">改名</button>' +
      '<button data-act="del" data-kind="' + kind + '" data-key="' + esc(item.key) + '">删除</button></div>'
    ).join('') || '<div class="empty">暂无</div>';
  };
  draw($('catList'), 'categories');
  draw($('tagList'), 'tags');
  // 色系 / 场景规则列表
  $('colorList').innerHTML = effColors().map(c =>
    '<div class="item"><span class="swatch" style="background:' + esc(c.hex) + '"></span>' +
    '<span class="lbl" title="' + esc(c.key) + '">' + esc(c.label) + '</span>' +
    (c.custom ? '' : '<span class="badge">内置</span>') +
    '<span class="cnt">' + (counts.color[c.key] || 0) + '</span>' +
    '<button data-act="delrule" data-kind="colors" data-key="' + esc(c.key) + '">删除</button></div>'
  ).join('') || '<div class="empty">暂无</div>';
  $('sceneList').innerHTML = effScenes().map(s =>
    '<div class="item"><span class="lbl" title="' + esc(s.key) + '">' + esc(s.label) + '</span>' +
    (s.custom ? '' : '<span class="badge">内置</span>') +
    '<span class="cnt">' + (counts.scene[s.key] || 0) + '</span>' +
    '<button data-act="delrule" data-kind="scenes" data-key="' + esc(s.key) + '">删除</button></div>'
  ).join('') || '<div class="empty">暂无</div>';
  // 筛选下拉的自定义类目选项
  const sel = $('fCat'), cur = sel.value;
  sel.innerHTML = '<option value="">全部</option><option value="__none__">未分配</option>' +
    taxonomy.categories.map(c => '<option value="' + esc(c.key) + '">' + esc(c.label) + '</option>').join('');
  sel.value = [...sel.options].some(o => o.value === cur) ? cur : '';
}

function passFilters(p) {
  const type = $('fType').value, cat = $('fCat').value, q = $('fSearch').value.trim().toLowerCase();
  if ($('fStock').checked && !p.inStock) return false;
  if (type && p.productType !== type) return false;
  const a = taxonomy.assignments[p.asin];
  if (cat === '__none__' && a && a.category) return false;
  if (cat && cat !== '__none__' && (!a || a.category !== cat)) return false;
  if (q && !(p.title.toLowerCase().includes(q) || p.asin.includes(q))) return false;
  return true;
}

// ---- 批量操作 ----
// 逐行复用单行的 diff 逻辑（视同用户手工逐行操作）
function batchApply(fn, msg) {
  if (selected.size === 0) return;
  let n = 0;
  selected.forEach(asin => {
    const p = products.find(x => x.asin === asin);
    if (p) { fn(p); n++; }
  });
  markDirty();
  renderTable();
  toast(msg + '：' + n + ' 个产品（未保存，点「保存」统一提交）');
}
// 撤销某行全部未保存改动（taxonomy 改动恢复为已保存值，各 diff 条目删除）
function clearRowChanges(asin) {
  delete tagAssignDiff[asin];
  delete matAssignDiff[asin];
  delete piecesDiff[asin];
  delete weightDiff[asin];
  const savedAssign = savedTaxonomyJson ? (JSON.parse(savedTaxonomyJson).assignments || {}) : {};
  if (savedAssign[asin]) taxonomy.assignments[asin] = JSON.parse(JSON.stringify(savedAssign[asin]));
  else delete taxonomy.assignments[asin];
}
function updateBatchBar() {
  const n = selected.size;
  $('batchBar').style.display = n > 0 ? 'flex' : 'none';
  $('bCount').textContent = '已选 ' + n + ' 个';
  // 下拉选项（应用后即重置为占位项）
  $('bCat').innerHTML = '<option value="">设自定义类目…</option><option value="__none__">未设置</option>' +
    taxonomy.categories.map(c => '<option value="' + esc(c.key) + '">' + esc(c.label) + '</option>').join('');
  $('bTagAdd').innerHTML = '<option value="">加 Tag…</option>' +
    taxonomy.tags.map(t => '<option value="' + esc(t.key) + '">' + esc(t.label) + '</option>').join('');
  $('bTagDel').innerHTML = '<option value="">移除 Tag…</option>' +
    taxonomy.tags.map(t => '<option value="' + esc(t.key) + '">' + esc(t.label) + '</option>').join('');
  $('bColor').innerHTML = '<option value="">设 Color…</option><option value="__none__">未设置</option>' +
    effColors().map(c => '<option value="' + esc(c.key) + '">' + esc(c.label) + '</option>').join('');
  $('bScene').innerHTML = '<option value="">设 Scene…</option><option value="__none__">未设置</option>' +
    effScenes().map(s => '<option value="' + esc(s.key) + '">' + esc(s.label) + '</option>').join('');
  $('bMatPop').innerHTML = materialOptions.map(m =>
    '<label><input type="checkbox" class="bMat" value="' + esc(m) + '"' + (bMats.has(m) ? ' checked' : '') + '> ' + esc(m) + '</label>').join('') +
    '<div class="matAdd"><input id="bNewMat" placeholder="+ 新增材质" maxlength="40">' +
    '<button type="button" id="bMatAddBtn">加</button></div>';
  // 表头全选状态（针对当前筛选结果）
  const rows = products.filter(passFilters);
  const selInRows = rows.filter(p => selected.has(p.asin)).length;
  const sa = $('selAll');
  sa.checked = rows.length > 0 && selInRows === rows.length;
  sa.indeterminate = selInRows > 0 && selInRows < rows.length;
}

function renderTable() {
  const rows = products.filter(passFilters);
  const savedAssign = savedTaxonomyJson ? (JSON.parse(savedTaxonomyJson).assignments || {}) : {};
  const colors = effColors(), scenes = effScenes();
  const mkOpts = (rules, cur) => {
    let opts = '<option value="">未设置</option>' + rules.map(r =>
      '<option value="' + esc(r.key) + '"' + (cur === r.key ? ' selected' : '') + '>' + esc(r.label) + '</option>').join('');
    // 当前值已不在生效规则中（如被禁用但尚未保存清理）时，显示占位项
    if (cur && !rules.some(r => r.key === cur)) {
      opts = '<option value="' + esc(cur) + '" selected>' + esc(cur) + '（已失效）</option>' + opts;
    }
    return opts;
  };
  $('count').textContent = rows.length + ' / ' + products.length + ' 个产品';
  $('tbody').innerHTML = rows.map(p => {
    const a = getAssign(p.asin);
    const cs = curAssign(p);
    const changed = JSON.stringify(taxonomy.assignments[p.asin] || null) !== JSON.stringify(savedAssign[p.asin] || null)
      || !!tagAssignDiff[p.asin]
      || matAssignDiff[p.asin] !== undefined
      || piecesDiff[p.asin] !== undefined
      || weightDiff[p.asin] !== undefined;
    const catOpts = '<option value="">未分配</option>' + taxonomy.categories.map(c =>
      '<option value="' + esc(c.key) + '"' + (a.category === c.key ? ' selected' : '') + '>' + esc(c.label) + '</option>').join('');
    const tagLabels = (a.tags || []).map(k => { const t = taxonomy.tags.find(x => x.key === k); return t ? t.label : k; });
    const tagBtn = tagLabels.length ? esc(tagLabels.join(', ')) : '选择 Tag';
    const tagPop = taxonomy.tags.length
      ? taxonomy.tags.map(t => '<label><input type="checkbox" data-asin="' + p.asin + '" value="' + esc(t.key) + '"' + ((a.tags || []).includes(t.key) ? ' checked' : '') + '> ' + esc(t.label) + '</label>').join('')
      : '<div class="empty" style="padding:4px">暂无 Tag，请先在左侧新增</div>';
    // 材质：checklist 多选 + 新增材质输入框；被人工覆盖时按钮带 ● 标记
    const mats = curMats(p);
    const matManual = isMatManual(p);
    const matBtn = (matManual ? '<span class="mMark">●</span> ' : '') + (mats.length ? esc(mats.join(', ')) : '选择材质');
    const matPop = materialOptions.map(m =>
      '<label><input type="checkbox" data-mat="1" data-asin="' + p.asin + '" value="' + esc(m) + '"' + (mats.includes(m) ? ' checked' : '') + '> ' + esc(m) + '</label>').join('') +
      '<div class="matAdd"><input class="newMat" data-asin="' + p.asin + '" placeholder="+ 新增材质" maxlength="40">' +
      '<button type="button" data-act="addmat" data-asin="' + p.asin + '">加</button></div>' +
      (matManual ? '<div class="matAdd"><button type="button" class="matReset" data-act="matreset" data-asin="' + p.asin + '">↺ 恢复自动规格</button></div>' : '');
    // Pack：预设下拉 + 自定义数字框二选一——选预设则清空禁用自定义框，自定义值（非预设）则复位禁用预设下拉
    const pc = curPieces(p), pm = isPiecesManual(p);
    const pcIsPreset = pc != null && PACK_PRESETS.includes(pc);
    const piecesHtml = '<span class="pwrap' + (pm ? ' manual' : '') + '">' +
      '<select class="piecesPreset" data-asin="' + p.asin + '"' + (pc != null && !pcIsPreset ? ' disabled' : '') + '>' +
      '<option value="">未设置</option>' +
      PACK_PRESETS.map(n => '<option value="' + n + '"' + (pcIsPreset && pc === n ? ' selected' : '') + '>' + n + ' Pack</option>').join('') +
      '</select>' +
      '<input type="number" class="piecesCustom" data-asin="' + p.asin + '" min="1" max="20" placeholder="自定义" value="' + (pc != null && !pcIsPreset ? pc : '') + '"' + (pcIsPreset ? ' disabled' : '') + '>' +
      '<span class="unit">Pack</span>' + (pm ? '<span class="mMark" title="手工设置">●</span>' : '') + '</span>';
    // 权重：分数输入框，范围跟随左侧「权重范围」设置
    const wb = curWeight(p);
    const weightHtml = '<input type="number" class="wscore' + (wb != null ? ' filled' : '') + '" data-asin="' + p.asin + '" step="1"' +
      ' min="' + weightLimits.min + '" max="' + weightLimits.max + '" value="' + (wb == null ? '' : wb) + '" placeholder="—"' +
      ' title="权重范围 ' + weightLimits.min + ' ~ ' + weightLimits.max + '，留空 = 未设置">';
    return '<tr data-asin="' + p.asin + '"' + (changed ? ' class="changed"' : '') + '>' +
      '<td class="selCol"><input type="checkbox" class="rowSel" data-asin="' + p.asin + '"' + (selected.has(p.asin) ? ' checked' : '') + '></td>' +
      '<td>' + (p.image ? '<img loading="lazy" src="' + esc(p.image) + '" alt="">' : '') + '</td>' +
      '<td class="ttl">' + esc(p.title) + '</td>' +
      '<td class="asin">' + esc(p.asin) + '</td>' +
      '<td>' + weightHtml + '</td>' +
      '<td class="small">' + esc(p.productType) + (p.subcategory ? ' / ' + esc(p.subcategory) : '') + '</td>' +
      '<td><select class="cs" data-asin="' + p.asin + '" data-field="color">' + mkOpts(colors, cs.color) + '</select></td>' +
      '<td><select class="cs" data-asin="' + p.asin + '" data-field="scene">' + mkOpts(scenes, cs.scene) + '</select></td>' +
      '<td><div style="margin-bottom:4px"><span class="tagbox"><button type="button">' + matBtn + ' ▾</button><span class="pop">' + matPop + '</span></span></div>' + piecesHtml + '</td>' +
      '<td><select class="cat" data-asin="' + p.asin + '">' + catOpts + '</select></td>' +
      '<td><span class="tagbox"><button type="button">' + tagBtn + ' ▾</button><span class="pop">' + tagPop + '</span></span></td>' +
      '</tr>';
  }).join('');
  updateBatchBar();
}

// 事件委托
$('tbody').addEventListener('change', (e) => {
  const asin = e.target.dataset.asin;
  if (!asin) return;
  if (e.target.classList.contains('rowSel')) {
    e.target.checked ? selected.add(asin) : selected.delete(asin);
    updateBatchBar();
    return;
  }
  if (e.target.matches('select.cs')) {
    setTagAssign(asin, e.target.dataset.field, e.target.value);
    markDirty();
    renderTable();
    return;
  }
  if (e.target.matches('select.piecesPreset')) {
    // 选预设（含「未设置」= 清空）：重渲染后自定义框自动清空/解禁
    setPieces(asin, e.target.value);
    markDirty();
    renderTable();
    return;
  }
  if (e.target.matches('input.piecesCustom')) {
    const raw = e.target.value.trim();
    if (raw !== '') {
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 1 || n > 20) {
        toast('Pack 必须是 1-20 的整数', true);
        renderTable(); // 还原显示
        return;
      }
    }
    setPieces(asin, raw); // 非预设值重渲染后预设下拉自动复位禁用
    markDirty();
    renderTable();
    return;
  }
  if (e.target.matches('input.wscore')) {
    const err = setWeight(asin, e.target.value.trim());
    if (err) {
      toast(err, true);
      renderTable(); // 还原显示
      return;
    }
    markDirty();
    renderTable();
    return;
  }
  if (e.target.dataset.mat) {
    const p = products.find(x => x.asin === asin);
    const cur = new Set(curMats(p));
    e.target.checked ? cur.add(e.target.value) : cur.delete(e.target.value);
    setMatAssign(asin, [...cur]);
    markDirty();
    renderTable();
    return;
  }
  const a = getAssign(asin);
  if (e.target.matches('select.cat')) {
    a.category = e.target.value || null;
  } else if (e.target.type === 'checkbox') {
    const set = new Set(a.tags || []);
    e.target.checked ? set.add(e.target.value) : set.delete(e.target.value);
    a.tags = [...set];
  }
  setAssign(asin, a);
  renderTable();
});
// 新增材质输入框：Enter 添加
$('tbody').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('newMat')) {
    e.preventDefault();
    addMaterialWord(e.target.dataset.asin, e.target);
  }
});
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  // 点击 tagbox 按钮展开/收起；点击其他区域收起全部
  if (btn && btn.parentElement.classList.contains('tagbox')) {
    const box = btn.parentElement;
    const was = box.classList.contains('open');
    document.querySelectorAll('.tagbox.open').forEach(b => b.classList.remove('open'));
    if (!was) box.classList.add('open');
    return;
  }
  if (!e.target.closest('.tagbox')) document.querySelectorAll('.tagbox.open').forEach(b => b.classList.remove('open'));
  if (btn && btn.dataset.act === 'rename') renameItem(btn.dataset.kind, btn.dataset.key);
  if (btn && btn.dataset.act === 'del') deleteItem(btn.dataset.kind, btn.dataset.key);
  if (btn && btn.dataset.act === 'delrule') deleteRule(btn.dataset.kind, btn.dataset.key);
  if (btn && btn.dataset.act === 'addmat') {
    const input = btn.parentElement.querySelector('.newMat');
    if (input) addMaterialWord(btn.dataset.asin, input);
  }
  if (btn && btn.dataset.act === 'matreset') {
    setMatAssign(btn.dataset.asin, null);
    markDirty(); renderTable();
  }
});

// 表头全选：全选/取消当前筛选结果（表格一次渲染全部筛选行）
$('selAll').addEventListener('change', (e) => {
  const rows = products.filter(passFilters);
  if (e.target.checked) rows.forEach(p => selected.add(p.asin));
  else rows.forEach(p => selected.delete(p.asin));
  renderTable();
});

// 批量操作栏事件（下拉选中即应用；材质/Pack 点按钮应用）
$('batchBar').addEventListener('change', (e) => {
  const t = e.target;
  if (t.classList.contains('bMat')) {
    t.checked ? bMats.add(t.value) : bMats.delete(t.value);
    return;
  }
  const v = t.value;
  if (!v) return;
  if (t.id === 'bCat') {
    batchApply(p => { const a = getAssign(p.asin); a.category = v === '__none__' ? null : v; setAssign(p.asin, a); }, '已设自定义类目');
  } else if (t.id === 'bTagAdd') {
    batchApply(p => { const a = getAssign(p.asin); a.tags = [...new Set([...(a.tags || []), v])]; setAssign(p.asin, a); }, '已加 Tag');
  } else if (t.id === 'bTagDel') {
    batchApply(p => { const a = getAssign(p.asin); a.tags = (a.tags || []).filter(k => k !== v); setAssign(p.asin, a); }, '已移除 Tag');
  } else if (t.id === 'bColor') {
    batchApply(p => setTagAssign(p.asin, 'color', v === '__none__' ? null : v), '已设 Color');
  } else if (t.id === 'bScene') {
    batchApply(p => setTagAssign(p.asin, 'scene', v === '__none__' ? null : v), '已设 Scene');
  }
});
// 批量栏新增材质词：写入词表（materialsList）并自动勾选，配合「替换/追加材质」应用到已选产品
function addBatchMaterialWord() {
  const input = $('bNewMat');
  const v = (input.value || '').trim();
  if (!v || v.length > 40) return toast('材质词需为 1-40 个字符', true);
  if (!materialOptions.includes(v)) { materialOptions.push(v); materialsList.push(v); }
  bMats.add(v);
  markDirty();
  updateBatchBar();
  toast('已添加材质「' + v + '」并勾选，点「替换材质 / 追加材质」应用到已选产品');
}
$('batchBar').addEventListener('click', (e) => {
  if (e.target.id === 'bMatAddBtn') addBatchMaterialWord();
});
$('batchBar').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.id === 'bNewMat') {
    e.preventDefault();
    addBatchMaterialWord();
  }
});
$('bMatReplaceBtn').onclick = () => {
  if (bMats.size === 0) return toast('请先在「选材质」里勾选材质', true);
  const arr = materialOptions.filter(m => bMats.has(m));
  batchApply(p => setMatAssign(p.asin, arr), '已替换材质');
};
$('bMatAppendBtn').onclick = () => {
  if (bMats.size === 0) return toast('请先在「选材质」里勾选材质', true);
  batchApply(p => setMatAssign(p.asin, [...new Set([...curMats(p), ...bMats])]), '已追加材质');
};
$('bPiecesApply').onclick = () => {
  const raw = $('bPieces').value.trim();
  if (!raw) return toast('请输入 1-20 的件数，或点「清空 Pack」', true);
  const n = parseInt(raw, 10);
  if (!Number.isInteger(n) || n < 1 || n > 20) return toast('Pack 必须是 1-20 的整数', true);
  batchApply(p => setPieces(p.asin, String(n)), '已设 Pack');
};
$('bPiecesClear').onclick = () => batchApply(p => setPieces(p.asin, ''), '已清空 Pack');
$('bWeightApply').onclick = () => {
  const raw = $('bWeight').value.trim();
  if (!raw) return toast('请输入权重分数，或点「清空权重」', true);
  const n = Number(raw);
  if (!Number.isInteger(n)) return toast('权重必须是整数', true);
  if (n < weightLimits.min || n > weightLimits.max) return toast('权重 ' + n + ' 超出允许范围 ' + weightLimits.min + ' ~ ' + weightLimits.max, true);
  batchApply(p => setWeight(p.asin, String(n)), '已设权重');
};
$('bWeightClear').onclick = () => batchApply(p => setWeight(p.asin, ''), '已清空权重');
$('bClear').onclick = () => batchApply(p => clearRowChanges(p.asin), '已清除未保存改动');
$('bDeselect').onclick = () => { selected.clear(); renderTable(); };

$('addCatBtn').onclick = () => { addItem('categories', $('newCat').value); $('newCat').value = ''; };
$('addTagBtn').onclick = () => { addItem('tags', $('newTag').value); $('newTag').value = ''; };
$('addColorBtn').onclick = () => { addRule('colors', $('newColorLabel').value, $('newColorHex').value); $('newColorLabel').value = ''; };
$('addSceneBtn').onclick = () => { addRule('scenes', $('newSceneLabel').value); $('newSceneLabel').value = ''; };
$('newCat').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('addCatBtn').click(); });
$('newTag').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('addTagBtn').click(); });
$('newColorLabel').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('addColorBtn').click(); });
$('newSceneLabel').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('addSceneBtn').click(); });
['fType', 'fCat', 'fStock'].forEach(id => $(id).addEventListener('change', renderTable));
$('fSearch').addEventListener('input', renderTable);
$('wMin').addEventListener('change', onLimitsChange);
$('wMax').addEventListener('change', onLimitsChange);

$('saveBtn').onclick = async () => {
  $('saveBtn').disabled = true;
  try {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taxonomy, tagRules,
        tagAssignments: tagAssignDiff,
        materials: materialsList,
        materialAssignments: matAssignDiff,
        piecesAssignments: piecesDiff,
        // 权重：无改动时不带字段，服务端按「缺省 = 不变」处理
        weightBoosts: Object.keys(weightDiff).length > 0 ? weightDiff : undefined,
        weightLimits: weightLimitsChanged() ? weightLimits : undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || res.status);
    await loadData(); // 保存后重拉，重置全部内存状态（含清空选择）
    toast('已保存，重新构建网站后全站生效');
  } catch (err) {
    toast('保存失败：' + err.message, true);
  } finally {
    $('saveBtn').disabled = false;
  }
};

async function loadData() {
  const data = await (await fetch('/api/data')).json();
  products = data.products;
  taxonomy = data.taxonomy;
  tagRules = data.tagRules;
  baseColors = data.baseColors;
  baseScenes = data.baseScenes;
  materialOptions = data.materialOptions || [];
  materialsList = data.materials || [];
  tagAssignDiff = {};
  matAssignDiff = {};
  piecesDiff = {};
  weightDiff = {};
  weightLimits = data.weightLimits || { min: -30, max: 30 };
  savedWeightLimits = { ...weightLimits };
  $('wMin').value = weightLimits.min;
  $('wMax').value = weightLimits.max;
  selected.clear(); // 保存成功后清空选择
  bMats = new Set();
  savedTaxonomyJson = JSON.stringify(taxonomy);
  savedTagRulesJson = JSON.stringify(tagRules);
  savedMaterialsJson = JSON.stringify(materialsList);
  const types = [...new Set(products.map(p => p.productType))].sort();
  $('fType').innerHTML = '<option value="">全部</option>' + types.map(t => '<option>' + esc(t) + '</option>').join('');
  renderSidebar();
  renderTable();
  markDirty();
}
loadData();
</script>
</body>
</html>`;
}
