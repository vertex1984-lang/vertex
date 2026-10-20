/**
 * bedding-34-split-images.js — 主图 1:1 回滚 + 3:4 另存（2026-10-19 用户定）
 * - 批量组（有 1-1x1-backup.webp）：1.webp(3:4) → 1-3x4.webp；备份恢复为 1.webp
 * - 手工组（PERCALE-COCONUT/SKY、LINEN3-SAGE-DUVET，无备份）：1.webp → 1-3x4.webp；从 git HEAD 恢复 1:1
 * - 输出拥有 1-3x4.webp 的 ASIN 清单到 src/data/pdp-main-34-asins.ts（PDP 主图覆盖用）
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const P = path.join(ROOT, 'public/images/products');
const GIT_DIRS = /^(PERCALE-(COCONUT|SKY)-(TWIN|FULL|QUEEN|KING)|LINEN3-SAGE-DUVET)$/;

let swapped = 0, gitRestored = 0;
const asins34 = [];
for (const dir of fs.readdirSync(P)) {
  const d = path.join(P, dir);
  if (!fs.statSync(d).isDirectory()) continue;
  const main = path.join(d, '1.webp');
  const backup = path.join(d, '1-1x1-backup.webp');
  const tall = path.join(d, '1-3x4.webp');
  if (!fs.existsSync(main) || fs.existsSync(tall)) continue;
  if (fs.existsSync(backup)) {
    fs.renameSync(main, tall);
    fs.renameSync(backup, main);
    swapped++;
    asins34.push(dir.toLowerCase());
  } else if (GIT_DIRS.test(dir)) {
    fs.renameSync(main, tall);
    const buf = execSync(`git show "HEAD:public/images/products/${dir}/1.webp"`, { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 });
    fs.writeFileSync(main, buf);
    gitRestored++;
    asins34.push(dir.toLowerCase());
  }
}
console.log(`批量组还原: ${swapped}，git 恢复: ${gitRestored}`);

const ts = `/**
 * pdp-main-34-asins.ts — PDP 主图使用 3:4 竖版（1-3x4.webp）的 ASIN 清单（2026-10-19 用户定）
 * PLP 卡片/其他位置用 1:1 主图（1.webp）；PDP 图集第一张用 3:4 新图。
 * 由 scripts/bedding-34-split-images.js 生成；sateen6+percale-lavender 充值补图后需重新生成此文件
 */
export const PDP_MAIN_34_ASINS = new Set<string>([
${asins34.sort().map((a) => `  '${a}',`).join('\n')}
]);
`;
fs.writeFileSync(path.join(ROOT, 'src/data/pdp-main-34-asins.ts'), ts);
console.log(`已写 src/data/pdp-main-34-asins.ts，共 ${asins34.length} 个 ASIN`);
