'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { assetSrc } from '@/lib/asset';

interface Product {
  handle: string;
  asin: string;
  title: string;
  /** 当前生效描述（快照基线 + 已发布覆盖归并；批次 3+ 编辑页回填用） */
  description: string;
  productType: string;
  subcategory: string | null;
  price: number;
  compareAtPrice: number | null;
  available: boolean;
  hasShopifyData: boolean;
  images: string[];
  derivedStatus: string;
  status: string;
  pending: string[];
  published: string[];
}

interface ChangeEntry {
  id: string;
  field: string;
  oldValue: string;
  newValue: string;
  at: string;
  status: string;
  note?: string;
}

const FIELD_LABEL: Record<string, string> = {
  title: '标题',
  price: '价格',
  compareAtPrice: '划线价',
  status: '状态',
  description: '描述',
  featuredImage: '主图',
};

export default function ProductDetailPage() {
  const { handle } = useParams<{ handle: string }>();
  const router = useRouter();
  const [p, setP] = useState<Product | null>(null);
  const [changes, setChanges] = useState<ChangeEntry[]>([]);
  const [mainImg, setMainImg] = useState(0);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [status, setStatus] = useState('live');
  // 批次 3 任务 3.1/3.2：描述编辑 + 主图替换
  const [desc, setDesc] = useState('');
  // 回填基线（打开页面时的生效文案）：保存时与当前输入比对——未改动不发送，
  // 避免「只想改标题却顺手把预填描述存成覆盖」
  const [descBaseline, setDescBaseline] = useState('');
  const [featuredPending, setFeaturedPending] = useState('');
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() {
    const res = await fetch(`/api/products/${handle}`);
    if (!res.ok) return;
    const data = await res.json();
    const prod: Product = data.product;
    setP(prod);
    setChanges(data.changes || []);
    setTitle(prod.title);
    setPrice(String(prod.price));
    setCompareAtPrice(prod.compareAtPrice == null ? '' : String(prod.compareAtPrice));
    setStatus(prod.status);
    // 描述回填（批次 3+ 「打开即见当前生效文案」）：pending 草稿 > 生效基线
    // （prod.description = 快照原文 + 已发布覆盖归并）；主图 pending 供预览展示
    const chs: ChangeEntry[] = data.changes || [];
    const descPending = chs.find((c) => c.field === 'description' && c.status === 'pending');
    const backfill = descPending ? descPending.newValue : (prod.description ?? '');
    setDesc(backfill);
    setDescBaseline(backfill);
    const imgChange = chs.find((c) => c.field === 'featuredImage' && c.status === 'pending');
    setFeaturedPending(imgChange ? imgChange.newValue : '');
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle]);

  async function save() {
    setSaving(true);
    setMsg('');
    // 描述守卫：清空 = 撤销覆盖（原语义）；与回填基线相同 = 未改动不发送（防误存覆盖）；有改动才建 pending
    const descTrim = desc.trim();
    const descPayload =
      descTrim === '' ? '' : descTrim === descBaseline.trim() ? undefined : descTrim;
    const res = await fetch(`/api/products/${handle}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        price,
        compareAtPrice,
        status,
        ...(descPayload !== undefined ? { description: descPayload } : {}),
        note: note || undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setMsg(data.error || '保存失败');
      return;
    }
    setMsg(data.changed.length > 0 ? `已保存 ${data.changed.length} 项修改（待发布）✓` : '没有变化 ✓');
    setNote('');
    load();
    router.refresh();
  }

  /** 换主图（批次 3 任务 3.2）：上传直写 vertex/public/images/products/<asin>/，URL 进 featuredImage 覆盖 */
  async function uploadFeatured(file: File) {
    setUploading(true);
    setMsg('');
    const fd = new FormData();
    fd.set('slug', p?.asin || String(handle));
    fd.set('bucket', 'products');
    fd.set('files', file);
    try {
      const up = await fetch('/api/upload', { method: 'POST', body: fd });
      const upJ = await up.json().catch(() => ({}));
      if (!up.ok || !upJ.urls?.[0]) {
        setMsg(`上传失败：${upJ.error || up.status}`);
        return;
      }
      const url: string = upJ.urls[0].url;
      const res = await fetch(`/api/products/${handle}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featuredImage: url, note: note || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data.error || '主图覆盖保存失败');
        return;
      }
      setMsg(`主图已替换（${url}，待发布）✓`);
      load();
      router.refresh();
    } finally {
      setUploading(false);
    }
  }

  if (!p) {
    return <div className="text-sm text-zinc-400">加载中…</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <span>商品管理</span>
        <span>/</span>
        <span className="text-zinc-600">{p.asin}</span>
      </div>
      <h1 className="mt-1 text-xl font-semibold">{p.title}</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {p.handle} · {p.productType}
        {p.subcategory ? ` / ${p.subcategory}` : ''} · Shopify 数据：{p.hasShopifyData ? '已关联' : '无'}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        {/* 图片区 */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-medium text-zinc-700">图片（{p.images.length} 张；主图替换见下方上传）</h2>
          {p.images.length > 0 ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetSrc(featuredPending || p.images[mainImg])}
                alt=""
                className="mx-auto mt-3 max-h-96 rounded-lg border border-zinc-100 object-contain"
              />
              {featuredPending && (
                <p className="mt-2 text-xs text-blue-600">
                  主图覆盖（待发布）：{featuredPending}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {p.images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img + i}
                    src={assetSrc(img)}
                    alt=""
                    onClick={() => setMainImg(i)}
                    className={`h-16 w-16 cursor-pointer rounded-lg border object-cover ${
                      i === mainImg ? 'border-brand-500 ring-1 ring-brand-500' : 'border-zinc-200'
                    }`}
                  />
                ))}
              </div>
              {/* 批次 3 任务 3.2：换主图——上传直写 vertex/public/images/products/<asin>/，URL 进 featuredImage 覆盖 */}
              <div className="mt-4 rounded-lg border border-dashed border-zinc-300 p-3">
                <label className="mb-1 block text-xs font-medium text-zinc-500">替换主图（webp/png/jpg，≤8MB；发布后 PDP 主图生效）</label>
                <input
                  type="file"
                  accept=".webp,.png,.jpg,.jpeg"
                  disabled={uploading}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFeatured(f); }}
                  className="w-full text-xs text-zinc-500 file:mr-2 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-xs"
                />
                {uploading && <p className="mt-1 text-xs text-blue-600">上传中…</p>}
              </div>
            </>
          ) : (
            <div className="mt-3 text-sm text-zinc-400">该商品没有图片</div>
          )}
        </div>

        {/* 编辑区 */}
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-sm font-medium text-zinc-700">编辑商品信息</h2>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <label className="mb-1 block font-medium">描述（已预填当前生效文案，直接改；保存→发布后覆盖 PDP；清空保存 = 撤销覆盖回原文案）</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={5}
                  placeholder="留空保存 = 撤销覆盖（回站点原描述）"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500"
                />
                <p className="mt-1 text-xs text-zinc-400">纯文本即可（PDP 按句切分渲染成段落）；≤5000 字符；文案里保留尺寸/材质等参数句（参数展示位依赖）</p>
              </div>
              <div>
                <label className="mb-1 block font-medium">标题</label>
                <textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-medium">价格 ($)</label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium">划线价 ($，可空)</label>
                  <input
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block font-medium">上架状态</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500"
                >
                  <option value="live">在售</option>
                  <option value="coming_soon">Coming Soon（未开卖）</option>
                  <option value="hidden">已下架（前台不展示）</option>
                </select>
                <p className="mt-1 text-xs text-zinc-400">
                  库存售罄（{p.available ? '当前有货' : '当前无货'}）由 Shopify 快照决定，不在此修改
                  {/* TODO(闸门 A)：Admin API 到位后支持库存写回（售罄自动转 Coming Soon / 补货自动上架） */}
                </p>
              </div>
              <div>
                <label className="mb-1 block font-medium">修改备注（可选）</label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="例：换新文案"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={save}
                  disabled={saving}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
                >
                  {saving ? '保存中…' : '保存修改'}
                </button>
                {msg && <span className="text-xs text-zinc-500">{msg}</span>}
              </div>
              <p className="text-xs text-zinc-400">
                保存进入「变更与发布」待发布清单，发布后才写入站点数据文件。
              </p>
            </div>
          </div>

          {/* 该商品的历史修改 */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-sm font-medium text-zinc-700">该商品的修改记录</h2>
            {changes.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-400">暂无修改</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {changes.map((c) => (
                  <li key={c.id} className="rounded-lg bg-zinc-50 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{FIELD_LABEL[c.field] || c.field}</span>
                      <span className={`text-xs ${c.status === 'pending' ? 'text-blue-600' : 'text-zinc-400'}`}>
                        {c.status === 'pending' ? '待发布' : '已发布'}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      <span className="line-through">{c.oldValue || '（空）'}</span> → {c.newValue}
                    </div>
                    <div className="mt-0.5 text-xs text-zinc-400">
                      {new Date(c.at).toLocaleString('zh-CN')}
                      {c.note ? ` · ${c.note}` : ''}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
