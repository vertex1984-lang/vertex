// 聊天代理 · 产品目录层：从站点数据文件实时解析出"AI 眼里的全站商品"。
// 单一数据源原则：网站展示用什么数据，AI 就看到什么数据（价格取 shopify-map，即站面显示价）。
// 支持 fs.watch 监听数据文件变化自动重建——新品上架后 AI 零操作自动认识。
import { existsSync, readFileSync, watch } from "node:fs";
import path from "node:path";
import { DATA_FILES, SITE_ROOT } from "./config.mjs";
import { careFromBullets, careFromDescription, loadShortBullets } from "./care.mjs";

/** 去掉 TS 数组/对象里的尾逗号，使其成为合法 JSON */
const stripTrailingCommas = (s) => s.replace(/,\s*([[\]}])/g, "$1");

/** 提取 TS 文件里 `= [` ... `];` 之间的数组字面量并 JSON.parse */
function parseTsArray(source) {
  const start = source.indexOf("= [");
  const end = source.lastIndexOf("];");
  if (start < 0 || end <= start) throw new Error("找不到 TS 数组字面量");
  return JSON.parse(stripTrailingCommas(source.slice(start + 2, end + 1)));
}

/** 解析 Record<string, {...}> 形态的 TS 对象（shopify-map / specs 等，值块内无嵌套花括号） */
function parseTsRecordBlocks(source) {
  const out = {};
  const re = /"([a-z0-9][a-z0-9-]*)":\s*\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(source))) out[m[1]] = m[2];
  return out;
}

function parseShortTitles(source) {
  const out = {};
  const re = /"([a-z0-9][a-z0-9-]*)":\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(source))) out[m[1]] = JSON.parse(`"${m[2]}"`);
  return out;
}

/** 从标题+材质提取颜色/风格标签，供 AI 理解"客户要蓝色毛绒的"这类需求 */
const TAG_KEYWORDS = [
  "grey", "gray", "beige", "white", "black", "navy", "blue", "teal", "rust", "orange",
  "pink", "red", "green", "sage", "yellow", "cream", "ivory", "brown", "taupe", "purple",
  "rainbow", "multicolor", "colorful", "gold", "silver",
  "faux fur", "shaggy", "shag", "plush", "low pile", "low-pile", "washable", "non-slip",
  "non slip", "faux cashmere", "faux rabbit", "vintage", "bohemian", "boho", "modern",
  "minimalist", "geometric", "oval", "round", "persian", "turkish", "tribal", "tie-dye",
];

function extractTags(text, cap = 8) {
  const t = text.toLowerCase();
  const tags = [];
  for (const kw of TAG_KEYWORDS) if (t.includes(kw) && !tags.includes(kw)) tags.push(kw);
  return tags.slice(0, cap);
}

/** 超长标题截断到 100 字符（与站内 autoShortenTitle 行为一致） */
function autoShorten(title) {
  if (title.length <= 100) return title;
  const cut = title.slice(0, 100);
  const sp = Math.max(cut.lastIndexOf(" "), cut.lastIndexOf(","));
  return (sp > 40 ? cut.slice(0, sp) : cut).trim();
}

/** 解析全部数据文件 → 目录行数组。任何单文件解析失败都直接抛错（宁可不起服务，不给 AI 喂脏目录）。 */
export function buildCatalog() {
  const materials = parseTsArray(readFileSync(DATA_FILES.materials, "utf8"));
  const mapSource = readFileSync(DATA_FILES.shopifyMap, "utf8");
  const shopifyBlocks = parseTsRecordBlocks(mapSource);
  const shopifyMap = {};
  for (const [key, body] of Object.entries(shopifyBlocks)) {
    const price = body.match(/price:\s*"([\d.]+)"/);
    const avail = body.match(/availableForSale:\s*(true|false)/);
    const image = body.match(/images:\s*\[\s*"([^"]+)"/);
    shopifyMap[key] = {
      price: price ? price[1] : null,
      available: avail ? avail[1] === "true" : false,
      image: image ? image[1] : null,
    };
  }
  const shortTitles = parseShortTitles(readFileSync(DATA_FILES.shortTitles, "utf8"));
  const specsBlocks = parseTsRecordBlocks(readFileSync(DATA_FILES.specs, "utf8"));
  const overrideBlocks = parseTsRecordBlocks(readFileSync(DATA_FILES.specsOverrides, "utf8"));
  const shortBullets = loadShortBullets();

  const products = [];
  const skipped = [];
  for (const entry of materials) {
    const key = String(entry.asin || "").toLowerCase();
    const handle = String(entry.handle || "");
    const shop = shopifyMap[key];
    if (!key || !handle || !shop) {
      skipped.push(key || entry.id || "?");
      continue;
    }
    const dims = overrideBlocks[key]?.match(/dimensionsCm:\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]/)
      || specsBlocks[key]?.match(/dimensionsCm:\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]/);
    const material =
      overrideBlocks[key]?.match(/material:\s*"([^"]+)"/)?.[1]
      || specsBlocks[key]?.match(/material:\s*"([^"]+)"/)?.[1]
      || null;
    const title = shortTitles[key] || autoShorten(String(entry.title || handle));
    const asinUpper = String(entry.asin).toUpperCase();
    const localImage = `/images/products/${asinUpper}/1.webp`;
    const hasLocalImage = existsSync(path.join(SITE_ROOT, "public", "images", "products", asinUpper, "1.webp"));
    const care = careFromBullets(shortBullets[key]) ?? careFromDescription(entry.description);
    products.push({
      handle,
      url: `/products/${handle}`,
      title,
      price: shop.price ? `$${shop.price}` : null,
      available: shop.available,
      size: dims ? `${dims[1]} x ${dims[2]}cm` : null,
      material,
      care,
      category: String(entry.productType || "Others"),
      tags: extractTags(`${title} ${material || ""}`),
      image: hasLocalImage ? localImage : shop.image || localImage,
    });
  }
  products.sort((a, b) => Number(b.available) - Number(a.available) || a.handle.localeCompare(b.handle));
  return { products, skipped, builtAt: new Date().toISOString() };
}

/** 监听数据文件变化自动重建（防抖），返回关闭函数 */
export function watchCatalog(current, rebuild, log = console.log) {
  const timers = new Map();
  const watchers = [];
  for (const file of Object.values(DATA_FILES)) {
    try {
      watchers.push(
        watch(file, () => {
          clearTimeout(timers.get(file));
          timers.set(
            file,
            setTimeout(() => {
              try {
                rebuild();
                log(`[catalog] 数据文件变更，目录已重建（${current().products.length} 款）`);
              } catch (err) {
                console.error("[catalog] 重建失败，沿用旧目录:", err.message);
              }
            }, 800),
          );
        }),
      );
    } catch {
      log(`[catalog] 无法监听 ${file}（不影响服务）`);
    }
  }
  return () => watchers.forEach((w) => w.close());
}
