'use client';

import { useState } from 'react';
import {
  customerAddressCreate,
  customerAddressUpdate,
  customerAddressDelete,
  customerDefaultAddressUpdate,
  getCustomerToken,
  type CustomerAddress,
  type AddressInput,
} from '@/lib/customer';
import { useCustomer } from '@/lib/use-customer';

/**
 * /account/addresses（批次 2 B2）：列表 + 新增/编辑 + 删除 + 设默认。
 * 表单字段按 Shopify MailingAddress 模型；国家演示版默认 US 可改。
 */
const EMPTY: AddressInput = {
  firstName: '', lastName: '', company: '', address1: '', address2: '',
  city: '', province: '', zip: '', country: 'United States', phone: '',
};

const input = 'w-full h-10 px-3 rounded-lg border border-warm-gray bg-white text-sm text-charcoal placeholder:text-charcoal-light/50 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition';
const label = 'mb-1 block text-[11px] font-semibold uppercase tracking-wide text-charcoal-light';

export default function AccountAddressesPage() {
  const { profile, loading, refresh } = useCustomer();
  const [editing, setEditing] = useState<CustomerAddress | 'new' | null>(null);
  const [form, setForm] = useState<AddressInput>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  function openNew() {
    setForm(EMPTY);
    setEditing('new');
    setErr('');
  }
  function openEdit(a: CustomerAddress) {
    setForm({
      firstName: a.firstName ?? '', lastName: a.lastName ?? '', company: a.company ?? '',
      address1: a.address1 ?? '', address2: a.address2 ?? '', city: a.city ?? '',
      province: a.province ?? '', zip: a.zip ?? '', country: a.country || 'United States', phone: a.phone ?? '',
    });
    setEditing(a);
    setErr('');
  }

  async function save() {
    const token = getCustomerToken();
    if (!token) return;
    if (!form.address1?.trim() || !form.city?.trim() || !form.zip?.trim() || !form.country?.trim()) {
      setErr('Street, city, ZIP and country are required.');
      return;
    }
    setBusy(true);
    const payload: AddressInput = {
      firstName: form.firstName?.trim() || undefined as unknown as string,
      lastName: form.lastName?.trim() || undefined as unknown as string,
      company: form.company?.trim() || undefined as unknown as string,
      address1: form.address1.trim(),
      address2: form.address2?.trim() || undefined as unknown as string,
      city: form.city.trim(),
      province: form.province?.trim() || undefined as unknown as string,
      zip: form.zip.trim(),
      country: form.country.trim(),
      phone: form.phone?.trim() || undefined as unknown as string,
    };
    const r = editing === 'new'
      ? await customerAddressCreate(token.accessToken, payload)
      : await customerAddressUpdate(token.accessToken, (editing as CustomerAddress).id, payload);
    setBusy(false);
    if (!r.ok) {
      setErr(r.message);
      return;
    }
    setEditing(null);
    setMsg(editing === 'new' ? 'Address added.' : 'Address updated.');
    refresh();
  }

  async function remove(a: CustomerAddress) {
    const token = getCustomerToken();
    if (!token || !confirm(`Delete this address?\n${a.address1}, ${a.city}`)) return;
    setBusy(true);
    const r = await customerAddressDelete(token.accessToken, a.id);
    setBusy(false);
    setMsg(r.ok ? 'Address deleted.' : '');
    if (!r.ok) setErr(r.message);
    refresh();
  }

  async function makeDefault(a: CustomerAddress) {
    const token = getCustomerToken();
    if (!token) return;
    setBusy(true);
    const r = await customerDefaultAddressUpdate(token.accessToken, a.id);
    setBusy(false);
    setMsg(r.ok ? 'Default address updated.' : '');
    if (!r.ok) setErr(r.message);
    refresh();
  }

  if (loading || !profile) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-warm-gray rounded w-1/3" />
        <div className="h-24 bg-warm-gray rounded-2xl" />
        <div className="h-24 bg-warm-gray rounded-2xl" />
      </div>
    );
  }

  const addresses = profile.addresses;
  const defaultId = profile.defaultAddress?.id;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-charcoal">Address book ({addresses.length})</h2>
        {!editing && (
          <button onClick={openNew} className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-cream transition hover:bg-brand-dark">
            + Add address
          </button>
        )}
      </div>

      {msg && <p className="text-xs font-medium text-emerald-600">{msg}</p>}
      {err && <p className="text-xs font-medium text-red-600">{err}</p>}

      {/* 表单（新增/编辑） */}
      {editing && (
        <section className="rounded-2xl border border-warm-gray bg-white p-5">
          <h3 className="text-sm font-semibold text-charcoal mb-4">{editing === 'new' ? 'New address' : 'Edit address'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={label}>First name</label><input className={input} value={form.firstName ?? ''} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
            <div><label className={label}>Last name</label><input className={input} value={form.lastName ?? ''} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={label}>Company (optional)</label><input className={input} value={form.company ?? ''} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={label}>Address 1 *</label><input className={input} value={form.address1 ?? ''} onChange={(e) => setForm({ ...form, address1: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={label}>Address 2 (optional)</label><input className={input} value={form.address2 ?? ''} onChange={(e) => setForm({ ...form, address2: e.target.value })} /></div>
            <div><label className={label}>City *</label><input className={input} value={form.city ?? ''} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div><label className={label}>State / Province</label><input className={input} value={form.province ?? ''} onChange={(e) => setForm({ ...form, province: e.target.value })} /></div>
            <div><label className={label}>ZIP / Postal code *</label><input className={input} value={form.zip ?? ''} onChange={(e) => setForm({ ...form, zip: e.target.value })} /></div>
            <div><label className={label}>Country *</label><input className={input} value={form.country ?? ''} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={label}>Phone (optional)</label><input className={input} type="tel" value={form.phone ?? ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          </div>
          <div className="mt-4 flex gap-2.5">
            <button onClick={save} disabled={busy} className="rounded-full bg-brand px-6 py-2.5 text-xs font-semibold text-cream transition hover:bg-brand-dark disabled:opacity-50">
              {busy ? 'Saving…' : 'Save address'}
            </button>
            <button onClick={() => setEditing(null)} disabled={busy} className="rounded-full border border-warm-gray px-6 py-2.5 text-xs font-semibold text-charcoal-light transition hover:bg-off-white disabled:opacity-50">
              Cancel
            </button>
          </div>
        </section>
      )}

      {/* 列表 */}
      {addresses.length === 0 && !editing && (
        <div className="rounded-2xl border border-warm-gray bg-white p-8 text-center">
          <p className="text-sm text-charcoal-light">No saved addresses yet.</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {addresses.map((a) => {
          const isDefault = a.id === defaultId;
          return (
            <div key={a.id} className={`rounded-2xl border bg-white p-4 ${isDefault ? 'border-brand' : 'border-warm-gray'}`}>
              <div className="flex items-center justify-between">
                {isDefault ? (
                  <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cream">Default</span>
                ) : <span />}
                <div className="flex gap-2 text-[11px] font-semibold">
                  <button onClick={() => openEdit(a)} className="text-brand hover:underline underline-offset-2">Edit</button>
                  {!isDefault && <button onClick={() => makeDefault(a)} disabled={busy} className="text-charcoal-light hover:text-charcoal">Set default</button>}
                  <button onClick={() => remove(a)} disabled={busy} className="text-red-500 hover:underline underline-offset-2">Delete</button>
                </div>
              </div>
              <address className="mt-2 not-italic text-xs leading-relaxed text-charcoal-light">
                {a.firstName || a.lastName ? <span className="font-semibold text-charcoal">{[a.firstName, a.lastName].filter(Boolean).join(' ')}<br /></span> : null}
                {a.company && <>{a.company}<br /></>}
                {a.address1}<br />
                {a.address2 && <>{a.address2}<br /></>}
                {a.city}{a.province ? `, ${a.province}` : ''} {a.zip}<br />
                {a.country}
                {a.phone && <><br />{a.phone}</>}
              </address>
            </div>
          );
        })}
      </div>
    </div>
  );
}
