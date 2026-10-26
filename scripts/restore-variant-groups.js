/**
 * restore-variant-groups.js
 * 事故恢复：variant-groups.ts 被 archive-hidden-products-2.js 误删 21 个组。
 * 策略：以 git HEAD 为基底，仅移除"隐藏 handle / 隐藏前缀"的组成员，
 * 再移除移除后真正为空的组。其余一律保留 HEAD 原样（含行尾）。
 * 同时重写 archive 的 variant-groups.members / variant-groups.empty-groups 记录。
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const VG_PATH = path.join(ROOT, 'src/data/variant-groups.ts');
const ARCHIVE_DIR = path.join(ROOT, 'archive/removed-products/2026-10-26/data');

// 1) 从当前 products.ts 解析隐藏清单（与 build-sitemap.js 同口径）
const productsSrc = fs.readFileSync(path.join(ROOT, 'src/data/products.ts'), 'utf8');
const hiddenSet = new Set();
const setMatch = productsSrc.match(/const HIDDEN_HANDLES = new Set\(\[([\s\S]*?)\]\)/);
if (!setMatch) throw new Error('HIDDEN_HANDLES not found');
for (const m of setMatch[1].matchAll(/'([^']+)'/g)) hiddenSet.add(m[1]);
const prefixes = [];
const preMatch = productsSrc.match(/HIDDEN_HANDLE_PREFIXES\s*=\s*\[([\s\S]*?)\]/);
if (preMatch) for (const m of preMatch[1].matchAll(/'([^']+)'/g)) prefixes.push(m[1]);
const isHidden = (h) => hiddenSet.has(h) || prefixes.some((p) => h.startsWith(p));
console.log(`hidden handles: ${hiddenSet.size}, prefixes: ${prefixes.length}`);

// 2) 取 HEAD 版本为基底
const head = execSync('git show HEAD:src/data/variant-groups.ts', { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 }).toString('utf8');

// 3) 移除隐藏成员（成员对象无嵌套花括号）
const removedMembers = [];
const memberRe = /\{[^{}]*?handle:\s*'([^']+)'[^{}]*?\},?/g;
let text = head.replace(memberRe, (whole, handle) => {
  if (isHidden(handle)) {
    removedMembers.push(whole);
    return '';
  }
  return whole;
});
console.log(`removed members: ${removedMembers.length}`);

// 4) 括号平衡扫描，切出 VARIANT_GROUPS 顶层元素，丢弃无成员的组
const arrStart = text.indexOf('export const VARIANT_GROUPS');
const eqIdx = text.indexOf('=', arrStart);
const openIdx = text.indexOf('[', eqIdx);
// 找数组结束（深度归零）
function scanElements(src, start) {
  const elements = [];
  let depth = 0, i = start, elStart = -1, inStr = false, strCh = '';
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === strCh) inStr = false;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { inStr = true; strCh = c; continue; }
    if (c === '/' && src[i + 1] === '/') { // 行注释
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') { // 块注释
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i++;
      continue;
    }
    if (c === '{') {
      if (depth === 0) elStart = i;
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0 && elStart >= 0) {
        // 元素结束于 } 加上可能的逗号
        let end = i + 1;
        while (end < src.length && (src[end] === ',' || src[end] === ' ' || src[end] === '\t' || src[end] === '\r' || src[end] === '\n')) {
          if (src[end] === ',') { end++; break; }
          end++;
        }
        elements.push({ start: elStart, end });
        elStart = -1;
      }
    } else if (c === ']' && depth === 0) {
      break;
    }
  }
  return { elements, closeIdx: i };
}
const { elements, closeIdx } = scanElements(text, openIdx + 1);
console.log(`groups in HEAD: ${elements.length}`);

const removedGroups = [];
const keepMask = new Array(elements.length).fill(true);
elements.forEach((el, idx) => {
  const chunk = text.slice(el.start, el.end);
  if (!/handle:\s*'/.test(chunk)) {
    keepMask[idx] = false;
    const idm = chunk.match(/id:\s*'([^']+)'/);
    removedGroups.push({ id: idm ? idm[1] : '?', chunk });
  }
});
console.log(`empty groups removed: ${removedGroups.length}`);
console.log('removed group ids:', removedGroups.map((g) => g.id).join(', '));

// 重组文本：倒序删除
let out = text;
for (let idx = elements.length - 1; idx >= 0; idx--) {
  if (!keepMask[idx]) {
    const el = elements[idx];
    out = out.slice(0, el.start) + out.slice(el.end);
  }
}

fs.writeFileSync(VG_PATH, out);
console.log('written:', VG_PATH);

// 5) 重写归档记录
fs.writeFileSync(path.join(ARCHIVE_DIR, 'variant-groups.members'),
  removedMembers.map((m) => m.trim()).join('\n') + '\n');
fs.writeFileSync(path.join(ARCHIVE_DIR, 'variant-groups.empty-groups'),
  removedGroups.map((g) => `=== ${g.id} ===\n${g.chunk.trim()}\n`).join('\n') + '\n');
console.log('archive records updated');

// 6) 校验：关键组必须存在
for (const id of ['LINEN3', 'LINEN3-DUVET', 'DUVSET', 'DUVSET-DUVET', 'BEDSET4', 'SATEEN4', 'VELSTRIPE', 'PERCALE-DUVET']) {
  const exists = out.includes(`id: '${id}'`);
  console.log(`group ${id}: ${exists ? 'OK' : 'GONE'}`);
}
