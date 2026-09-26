import { SET_KIND_LABEL, SetFamily, SetKind } from '@/data/bedding-families';
import BeddingSetCard from '@/components/v2/BeddingSetCard';
import { sortByWeight } from '@/lib/weights';

/**
 * bedding 二级类目 PLP 选购区（2026-09 新增，/bedding/[slug]/ 三种页型共用）：
 * 页面上没有任何筛选条/标签，固定 Featured（权重）排序——
 * "数量 + 价格区间 + 排序下拉"一行 2026-09 用户定已移除。
 * 分区模式且分区数 > 1 时，页头下渲染分区锚点 chips（开屏即知有几个分类）。
 * 无交互（chips 为纯锚点），是服务端组件。
 * 卡片 badge（2026-09 用户定统一规则：叠「标题未表达的另一维度」）：类型页/Bed Sets 合并页
 * 标题是类型（x-Piece Sets）、页内多布料混排 → 卡片图上叠布料标签（materials[0]）；
 * 面料页整页同一布料（布料=页面标题、类型=分区标题，两维度都已表达）→ 不叠任何标签，
 * 调用方传 noBadges。
 */

const KIND_ORDER: SetKind[] = ['four', 'three', 'comforter'];

/** 布料标签：家族主材质（materials[0]，如 "100% Linen"），取不到材质则不叠 */
const fabricBadge = (f: SetFamily): string[] => (f.materials[0] ? [f.materials[0]] : []);

export default function V2FabricShop({
  families,
  flat = false,
  noBadges = false,
}: {
  families: SetFamily[];
  /** flat = 类型二级 PLP 用：全页同一类型，不分区不出小标题，单一网格平铺 */
  flat?: boolean;
  /** 面料页用：整页同一布料，卡片不叠任何标签（2026-09 用户定） */
  noBadges?: boolean;
}) {
  const cardBadges = (f: SetFamily): string[] => (noBadges ? [] : fabricBadge(f));
  // 固定 Featured 序：按权重降序
  const reps = sortByWeight(families.map((f) => f.rep));
  const byRep = new Map(families.map((f) => [f.rep.id, f]));
  const sorted = reps.map((r) => byRep.get(r.id)!).filter(Boolean);

  // 按类型分区（保持排序后的相对顺序；无产品的类型不出分区）
  const sections = KIND_ORDER.map((kind) => ({
    kind,
    list: sorted.filter((f) => f.kind === kind),
  })).filter((s) => s.list.length > 0);

  return (
    <div>
      {/* 分区锚点导航（2026-09 用户定：一页多分区时开屏即知有几个分类，点击平滑滚动到位；
          仅分区模式且分区数 > 1 时渲染；移动端横滑不折行） */}
      {!flat && sections.length > 1 && (
        <nav
          aria-label="Sections"
          className="flex gap-2 overflow-x-auto pb-1 mb-5 lg:mb-7 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((s) => (
            <a
              key={s.kind}
              href={`#sets-${s.kind}`}
              className="flex-shrink-0 px-3.5 lg:px-4 h-8 lg:h-9 inline-flex items-center rounded-full border border-[#E8E2DA] bg-white text-xs lg:text-sm font-medium text-charcoal-light hover:border-brand hover:text-brand transition-colors"
            >
              {SET_KIND_LABEL[s.kind]}s
              <span className="ml-1.5 text-[#999]">{s.list.length}</span>
            </a>
          ))}
        </nav>
      )}

      {flat ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
          {sorted.map((f) => (
            <BeddingSetCard key={f.key} family={f} badges={cardBadges(f)} />
          ))}
        </div>
      ) : (
        sections.map((s, i) => (
          <section
            key={s.kind}
            id={`sets-${s.kind}`}
            className={`py-8 lg:py-12 scroll-mt-24 lg:scroll-mt-28 ${i === 0 ? 'pt-0' : 'border-t border-[#E8E2DA]'}`}
          >
            {/* 标题只写类型等属性：面料名 hero/面包屑已表达，不重复（2026-09 用户定） */}
            <h2 className="mb-5 lg:mb-8 text-lg lg:text-2xl font-extrabold text-charcoal">
              {SET_KIND_LABEL[s.kind]}s
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
              {s.list.map((f) => (
                <BeddingSetCard
                  key={f.key}
                  family={f}
                  badges={cardBadges(f)}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
