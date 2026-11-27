'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateDrafts, slugify, type WizardPayload } from '@/lib/newproduct';
import { assetSrc } from '@/lib/asset';

const CATEGORIES = ['Bedding', 'Mats', 'Blankets', 'Pillows', 'Cushions', 'Towels', 'Decor'];
const MAX_RECORDS = 100;

const STEP_TITLES = ['基础信息', '尺寸 × 花色', '图片', '价格与上架'];

export default function NewProductPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');

  // step 1
  const [seriesTitle, setSeriesTitle] = useState('');
  const [productType, setProductType] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [tagsText, setTagsText] = useState('');
  // step 2
  const [sizesText, setSizesText] = useState('');
  const [colorsText, setColorsText] = useState('');
  // step 3
  const [imageUrls, setImageUrls] = useState<{ url: string; width: number; height: number }[]>([]);
  const [uploading, setUploading] = useState(false);
  // step 4
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [launch, setLaunch] = useState<'coming_soon' | 'live'>('coming_soon');
  const [submitting, setSubmitting] = useState(false);

  const payload: WizardPayload = useMemo(
    () => ({
      seriesTitle: seriesTitle.trim(),
      productType,
      subcategory: subcategory.trim() || undefined,
      tags: tagsText.split(/[,，]/).map((s) => s.trim()).filter(Boolean),
      description: description.trim(),
      sizes: sizesText.split('\n').map((s) => s.trim()).filter(Boolean),
      colors: colorsText.split('\n').map((s) => s.trim()).filter(Boolean),
      price: price.trim(),
      compareAtPrice: compareAtPrice.trim() || null,
      launch,
      imageUrls,
    }),
    [seriesTitle, productType, subcategory, description, tagsText, sizesText, colorsText, price, compareAtPrice, launch, imageUrls]
  );

  const preview = useMemo(() => {
    if (!payload.seriesTitle) return [];
    try {
      return generateDrafts(payload);
    } catch {
      return [];
    }
  }, [payload]);

  function validateStep(s: number): string {
    if (s === 0) {
      if (!seriesTitle.trim()) return '请填写系列名称（英文展示名）';
      if (!productType) return '请选择类目';
      if (!description.trim()) return '请填写商品描述';
    }
    if (s === 1) {
      if (preview.length > MAX_RECORDS) return `一次最多生成 ${MAX_RECORDS} 条，当前 ${preview.length} 条`;
    }
    if (s === 3) {
      if (launch === 'live' && !(Number(price) > 0)) return '直接上架必须填写大于 0 的价格（未定价请选 Coming Soon）';
    }
    return '';
  }

  function next() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep((v) => Math.min(3, v + 1));
  }

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);
    const fd = new FormData();
    fd.append('slug', slugify(seriesTitle) || 'new-series');
    Array.from(files).forEach((f) => fd.append('files', f));
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json().catch(() => ({}));
    setUploading(false);
    if (!res.ok) {
      setError(data.error || '上传失败');
      return;
    }
    setImageUrls((prev) => [...prev, ...data.urls]);
  }

  async function submit() {
    const err = validateStep(3);
    if (err) {
      setError(err);
      return;
    }
    setSubmitting(true);
    setError('');
    const res = await fetch('/api/products/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error || '提交失败');
      return;
    }
    router.push('/changes');
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold">上新商品</h1>
      <p className="mt-1 text-sm text-zinc-500">
        填写一次表单，按尺寸 × 花色矩阵批量生成商品。提交后进入「变更与发布」，发布才会写入站点。
      </p>

      {/* 步骤条 */}
      <div className="mt-6 flex items-center gap-2">
        {STEP_TITLES.map((t, i) => (
          <div key={t} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                i === step ? 'bg-brand-600 text-white' : i < step ? 'bg-brand-100 text-brand-700' : 'bg-zinc-200 text-zinc-500'
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-sm ${i === step ? 'font-medium' : 'text-zinc-400'}`}>{t}</span>
            {i < STEP_TITLES.length - 1 && <div className="mx-1 h-px w-8 bg-zinc-300" />}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6">
        {/* Step 1 基础信息 */}
        {step === 0 && (
          <div className="space-y-4 text-sm">
            <div>
              <label className="mb-1 block font-medium">系列名称（英文展示名）*</label>
              <input
                value={seriesTitle}
                onChange={(e) => setSeriesTitle(e.target.value)}
                placeholder="例：Soft Microfiber Sheet Set"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500"
              />
              <p className="mt-1 text-xs text-zinc-400">
                商品标题将生成为「Makimoo {seriesTitle || '…'}（花色）+ 尺寸」；handle / 内部编号由它自动派生
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block font-medium">类目 *</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500"
                >
                  <option value="">请选择…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium">子类（可选）</label>
                <input
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="例：Sheet Sets"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block font-medium">商品描述 *（每个分段一行，上线后可在商品编辑里改）</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="卖点描述，英文…"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">标签（可选，逗号分隔）</label>
              <input
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="例：microfiber, wrinkle-free"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500"
              />
            </div>
          </div>
        )}

        {/* Step 2 尺寸 × 花色 */}
        {step === 1 && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block font-medium">尺寸（每行一个，可留空）</label>
                <textarea
                  value={sizesText}
                  onChange={(e) => setSizesText(e.target.value)}
                  rows={6}
                  placeholder={'Twin\nFull\nQueen\nKing'}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium">花色（每行一个，可留空 = 单品）</label>
                <textarea
                  value={colorsText}
                  onChange={(e) => setColorsText(e.target.value)}
                  rows={6}
                  placeholder={'Sage\nIvory'}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500"
                />
              </div>
            </div>
            <div className="rounded-lg bg-brand-50 px-4 py-3 text-brand-700">
              将生成 <span className="text-lg font-semibold">{preview.length}</span> 条商品记录
              {preview.length > 0 && (
                <span className="ml-2 text-xs text-brand-600">
                  （handle 例：<code>{preview[0]?.handle}</code>）
                </span>
              )}
            </div>
          </div>
        )}

        {/* Step 3 图片 */}
        {step === 2 && (
          <div className="space-y-4 text-sm">
            <div>
              <label className="mb-1 block font-medium">上传图片（该系列共用一套，webp/png/jpg，每张 ≤8MB）</label>
              <input
                type="file"
                multiple
                accept=".webp,.png,.jpg,.jpeg"
                onChange={(e) => upload(e.target.files)}
                disabled={uploading}
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1"
              />
              {uploading && <p className="mt-2 text-xs text-zinc-500">上传中…</p>}
            </div>
            {imageUrls.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {imageUrls.map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.url}
                    src={assetSrc(img.url)}
                    alt=""
                    className="h-16 w-16 rounded-lg border border-zinc-200 object-cover"
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400">
                不上传也可继续——先无图上架（前台商品卡显示占位），图片到位后在「商品管理」里补。
              </p>
            )}
          </div>
        )}

        {/* Step 4 价格与上架 */}
        {step === 3 && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block font-medium">价格 ($)</label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={launch === 'coming_soon' ? 'Coming Soon 不需要价格' : '39.99'}
                  disabled={launch === 'coming_soon'}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500 disabled:bg-zinc-50"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium">划线价 ($，可选)</label>
                <input
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="49.99"
                  disabled={launch === 'coming_soon'}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500 disabled:bg-zinc-50"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block font-medium">上架方式</label>
              <div className="space-y-2">
                <label className="flex items-start gap-2 rounded-lg border border-zinc-200 p-3 has-[:checked]:border-brand-500">
                  <input
                    type="radio"
                    checked={launch === 'coming_soon'}
                    onChange={() => setLaunch('coming_soon')}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="font-medium">Coming Soon（推荐先走这步）</span>
                    <span className="block text-xs text-zinc-500">价格位显示 Coming Soon，页面/搜索/类目先就位，定价后一键转在售</span>
                  </span>
                </label>
                <label className="flex items-start gap-2 rounded-lg border border-zinc-200 p-3 has-[:checked]:border-brand-500">
                  <input type="radio" checked={launch === 'live'} onChange={() => setLaunch('live')} className="mt-0.5" />
                  <span>
                    <span className="font-medium">直接上架</span>
                    <span className="block text-xs text-zinc-500">需要填写价格，发布后即可购买（演示版无购物车联动，仅展示）</span>
                  </span>
                </label>
              </div>
            </div>

            {/* 提交前预览 */}
            <div>
              <label className="mb-1 block font-medium">将生成 {preview.length} 条记录：</label>
              <div className="max-h-64 overflow-auto rounded-lg border border-zinc-200">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-zinc-50 text-left text-zinc-500">
                    <tr>
                      <th className="px-3 py-2">标题</th>
                      <th className="px-3 py-2">handle</th>
                      <th className="px-3 py-2">内部编号</th>
                      <th className="px-3 py-2">价格</th>
                      <th className="px-3 py-2">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((d) => (
                      <tr key={d.handle} className="border-t border-zinc-100">
                        <td className="max-w-[220px] truncate px-3 py-1.5">{d.title}</td>
                        <td className="max-w-[240px] truncate px-3 py-1.5 text-zinc-500">{d.handle}</td>
                        <td className="px-3 py-1.5 text-zinc-500">{d.asin}</td>
                        <td className="px-3 py-1.5">{d.price === '0.00' ? '—' : `$${d.price}`}</td>
                        <td className="px-3 py-1.5">{d.status === 'coming_soon' ? 'Coming Soon' : '在售'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {/* 底部按钮 */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setStep((v) => Math.max(0, v - 1))}
            disabled={step === 0}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm disabled:opacity-40"
          >
            上一步
          </button>
          {step < 3 ? (
            <button onClick={next} className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700">
              下一步
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting}
              className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {submitting ? '提交中…' : `提交 ${preview.length} 条新品（进待发布清单）`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
