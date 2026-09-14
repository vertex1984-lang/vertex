import Link from 'next/link';
import { COLOR_RULES, SCENE_RULES } from '@/data/product-tags';
import { v2url } from '@/lib/v2paths';
import { ALL, sceneKeysWithProducts, colorKeysWithProducts } from './tagged';

/**
 * 吸顶筛选栏 = 分类导航：scene 单选 pill（All 回主页）+ color chip，
 * 点击跳转对应静态分类页（/featured-products/scene/<key>/、/featured-products/color/<key>/），
 * 不再做页内 state 过滤。只展示有 ≥1 个产品的分类（空分类无对应页面）。
 */
export default function FilterBar({
  activeScene,
  activeColor,
}: {
  /** 主页传 'all'；分类页传当前 key */
  activeScene?: string;
  activeColor?: string;
}) {
  const sceneKeys = sceneKeysWithProducts();
  const colorKeys = colorKeysWithProducts();
  return (
    <div className="sticky top-20 lg:top-24 z-30 bg-cream/95 backdrop-blur border-b border-warm-gray">
      <div className="px-6 lg:px-10 py-4 space-y-3">
        {/* 场景行 */}
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-light flex-shrink-0 w-14">
            Scene
          </span>
          <Link
            href={v2url('/featured-products/')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition border ${
              activeScene === 'all'
                ? 'bg-charcoal text-cream border-charcoal'
                : 'bg-white text-charcoal-light border-warm-gray hover:border-charcoal/40'
            }`}
          >
            All
          </Link>
          {SCENE_RULES.filter((s) => sceneKeys.includes(s.key)).map((s) => {
            const count = ALL.filter((p) => p.sceneTag.key === s.key).length;
            const active = activeScene === s.key;
            return (
              <Link
                key={s.key}
                href={v2url(`/featured-products/scene/${s.key}/`)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition border ${
                  active
                    ? 'bg-charcoal text-cream border-charcoal'
                    : 'bg-white text-charcoal-light border-warm-gray hover:border-charcoal/40'
                }`}
              >
                {s.label}
                <span className={`ml-1.5 ${active ? 'text-cream/60' : 'text-charcoal-light/60'}`}>
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
        {/* 色系行 */}
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-light flex-shrink-0 w-14">
            Color
          </span>
          {COLOR_RULES.filter((c) => colorKeys.includes(c.key)).map((c) => {
            const active = activeColor === c.key;
            const count = ALL.filter((p) => p.colorTag?.key === c.key).length;
            return (
              <Link
                key={c.key}
                href={v2url(`/featured-products/color/${c.key}/`)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition border ${
                  active
                    ? 'bg-brand text-cream border-brand'
                    : 'bg-white text-charcoal-light border-warm-gray hover:border-brand/50'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-charcoal/20"
                  style={{ backgroundColor: c.hex }}
                />
                {c.label}
                <span className={active ? 'text-cream/60' : 'text-charcoal-light/60'}>
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
