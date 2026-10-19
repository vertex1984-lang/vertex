'use client';

import { useMemo } from 'react';
import { MakimooProduct } from '@/data/products';
import { buildBlanketFamilies, blanketSectionOf, BLANKET_SECTIONS, BlanketFamily } from '@/data/blanket-families';
import BeddingSetCard from '@/components/v2/BeddingSetCard';
import { sortByWeight } from '@/lib/weights';

/**
 * /products?cat=blankets 选购视图：
 * - 2026-09-27 用户定：家族卡网格（复用 BeddingSetCard：From 价 + 尺寸带，sizesSuffix="cm" 统一补单位）
 * - 2026-10-19 用户定：按 bedding/towels 页标准重构——按系列分区（分区注册表 BLANKET_SECTIONS，
 *   与页头 hero 快链同口径，见 V2BlanketsShop 的分区锚点 = section.key），
 *   卡面加标题下浅色颜色行（同 bedding/pillows/cushions/towels）；排序固定 Featured（权重序）
 * 无筛选条/排序下拉（blanketsMode 在 page.tsx 已豁免）；卡片不叠 badge（全站开关关闭中）。
 */
/** 卡面标题 = 代表品短标题去掉尾部「, 尺寸」和「, 颜色」段（颜色移到标题下 colorLine，
 *  尺寸由尺寸带表达；同 towels 的 towelCardTitle 思路） */
function blanketCardTitle(f: BlanketFamily): string {
  const esc = f.color.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (f.rep.title || '')
    .replace(/,\s*\d+\s*x\s*\d+\s*(cm|in)$/i, '')
    .replace(new RegExp(`,\\s*${esc}$`, 'i'), '');
}

export default function V2BlanketsShop({ products }: { products: MakimooProduct[] }) {
  const families = useMemo(() => buildBlanketFamilies(products), [products]);

  // 固定 Featured 序：按权重降序（与 V2BeddingShop 一致）
  const sorted = useMemo(() => {
    const reps = sortByWeight(families.map((f) => f.rep));
    const byRep = new Map(families.map((f) => [f.rep.id, f]));
    return reps.map((r) => byRep.get(r.id)!).filter(Boolean);
  }, [families]);

  // 按系列分区（无产品的分区不出；顺序 = BLANKET_SECTIONS 注册表）
  const sections = BLANKET_SECTIONS
    .map((def) => ({ def, list: sorted.filter((f) => blanketSectionOf(f) === def.key) }))
    .filter((s) => s.list.length > 0);

  return (
    <div>
      {sections.map((s, i) => (
        <section
          key={s.def.key}
          id={s.def.key}
          className={`py-8 lg:py-12 scroll-mt-24 lg:scroll-mt-28 ${
            i === 0 ? 'pt-0' : 'border-t border-[#E8E2DA]'
          }`}
        >
          <div className="mb-5 lg:mb-8">
            <h2 className="text-lg lg:text-2xl font-extrabold text-charcoal">{s.def.label}</h2>
            {s.def.blurb && <p className="mt-1 text-xs lg:text-sm text-[#999]">{s.def.blurb}</p>}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {s.list.map((f) => (
              <BeddingSetCard
                key={f.key}
                family={{
                  ...f,
                  titleOverride: blanketCardTitle(f),
                  // 2026-10-19 用户定：blankets 卡也加标题下浅色颜色行（同 bedding/pillows/cushions/towels）
                  colorLine: f.color || undefined,
                }}
                sizesSuffix="cm"
                compactText
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
