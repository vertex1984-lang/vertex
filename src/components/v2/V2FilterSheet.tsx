'use client';

import { useEffect } from 'react';

/**
 * 移动端筛选：Filter 按钮 + 底部弹层（2026-10-16 用户定：移动端下拉式筛选条统一替换，
 * 桌面端 lg+ 保持原有下拉不变）。视觉语言沿用 /products 页移动端筛选抽屉
 * （radio 圆圈行、z-[1600]/z-[1700] 分层、品牌色按钮）。
 *
 * 用法：各选购组件在 sticky 筛选条内渲染移动端 Filter 按钮行（flex lg:hidden），
 * 并在组件末尾渲染 <V2FilterSheet />；桌面端下拉内容包进 hidden lg:block。
 */

export interface FilterSheetOption {
  value: string;
  label: string;
  desc?: string; // 选项下一行小字（如 towels Fabric 的一句话简介）
}

export interface FilterSheetGroup {
  key: string; // 对应 values 的键
  title: string; // 组标题：Type / Fabric / Style / Filling
  allLabel: string; // 「全部」行文案：All / All Fabrics / All Fillings
  options: FilterSheetOption[];
}

export default function V2FilterSheet({
  open,
  onClose,
  groups,
  values,
  onChange,
  onClearAll,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  groups: FilterSheetGroup[];
  values: Record<string, string>;
  onChange: (groupKey: string, value: string) => void; // value='' 表示选 All
  onClearAll: () => void;
  resultCount: number;
}) {
  // 打开期间锁 body 滚动
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-[1600] lg:hidden" onClick={onClose} />
      )}
      <div
        className={`fixed inset-x-0 bottom-0 z-[1700] bg-white rounded-t-2xl flex flex-col max-h-[75vh] transition-transform duration-300 ease-out lg:hidden ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        role="dialog"
        aria-label="Filters"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E2DA] flex-shrink-0">
          <h2 className="text-lg font-bold text-[#333]">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-[#E8E2DA] flex items-center justify-center text-2xl text-[#333] hover:bg-[#F8F5F0] transition"
            aria-label="Close filters"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {groups.map((g) => {
            const current = values[g.key] || '';
            const rows: FilterSheetOption[] = [{ value: '', label: g.allLabel }, ...g.options];
            return (
              <div key={g.key} className="mb-5 last:mb-0">
                <p className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-2">{g.title}</p>
                <div>
                  {rows.map((o) => {
                    const active = current === o.value;
                    return (
                      <button
                        key={o.value || '__all__'}
                        type="button"
                        onClick={() => onChange(g.key, o.value)}
                        aria-pressed={active}
                        className="flex items-start gap-3 w-full py-2.5 text-left"
                      >
                        <span
                          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            active ? 'border-[#8B5A2B]' : 'border-[#D8D2C8]'
                          }`}
                        >
                          {active && (
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#8B5A2B' }} />
                          )}
                        </span>
                        <span>
                          <span className={`block text-sm ${active ? 'font-semibold text-[#333]' : 'text-[#555]'}`}>
                            {o.label}
                          </span>
                          {o.desc && <span className="block mt-0.5 text-xs text-[#999]">{o.desc}</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-[#E8E2DA] px-5 py-4 flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm font-semibold text-brand underline underline-offset-2 hover:text-brand-dark flex-shrink-0"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-full bg-brand text-cream text-sm font-bold transition hover:bg-brand-dark"
          >
            Show {resultCount} {resultCount === 1 ? 'style' : 'styles'}
          </button>
        </div>
      </div>
    </>
  );
}
