// 聊天代理 · 护理信息层：从站点文案（精简五点 → 产品描述）提取洗护说明，独立模块。
// 原则：只提取商家自己的原文，不生成、不改写——AI 回答洗护问题的唯一依据。
import { readFileSync } from "node:fs";
import { DATA_FILES } from "./config.mjs";

const CARE_RE =
  /machine[\s-]?wash\w*|washable|hand[\s-]?wash|spot[\s-]?clean|vacuum|dry[\s-]?clean|air[\s-]?dry|tumble|easy[\s-]?care|maintenance|bleach/i;

/** 压缩句子到 cap 字符（在空格处截断） */
function compress(sentence, cap = 110) {
  const s = String(sentence).trim().replace(/\s+/g, " ");
  if (s.length <= cap) return s;
  const cut = s.slice(0, cap);
  const sp = cut.lastIndexOf(" ");
  return (sp > 50 ? cut.slice(0, sp) : cut).trim();
}

/** 从精简五点（字符串数组）里挑含护理关键词的一条 */
export function careFromBullets(bullets) {
  if (!Array.isArray(bullets)) return null;
  const hit = bullets.find((b) => CARE_RE.test(b));
  return hit ? compress(hit) : null;
}

/** 从产品描述里挑第一个含护理关键词的句子 */
export function careFromDescription(desc) {
  if (!desc) return null;
  for (const sentence of String(desc).split(/(?<=[.!?])\s+/)) {
    if (CARE_RE.test(sentence)) return compress(sentence);
  }
  return null;
}

/** 解析 materials-short-bullets.ts → Record<key, string[]>（本模块自用输入解析） */
export function loadShortBullets() {
  const source = readFileSync(DATA_FILES.shortBullets, "utf8");
  const out = {};
  const re = /"([a-z0-9][a-z0-9-]*)":\s*\[([^\]]*)\]/g;
  let m;
  while ((m = re.exec(source))) {
    const items = [...m[2].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => JSON.parse(`"${x[1]}"`));
    if (items.length) out[m[1]] = items;
  }
  return out;
}
