import { shopifyClient, customerClient } from './shopify';
import { CUSTOMER_CREATE } from './queries';

export type SubscribeResult = 'success' | 'taken' | 'error';

// customerCreate 要求密码：随机生成，用户不可见（仅用于满足 API 必填字段）
function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let pwd = '';
  const arr = new Uint32Array(24);
  crypto.getRandomValues(arr);
  for (let i = 0; i < arr.length; i++) {
    pwd += chars[arr[i] % chars.length];
  }
  return pwd + '1aA';
}

/**
 * Newsletter 订阅：通过 customerCreate 创建 acceptsMarketing 客户
 * - 邮箱已注册（taken）视为订阅成功
 * - 其他错误返回 'error'
 */
export async function subscribeCustomer(email: string): Promise<SubscribeResult> {
  try {
    const { data, errors } = await shopifyClient.request(CUSTOMER_CREATE, {
      variables: {
        input: {
          email,
          password: generatePassword(),
          acceptsMarketing: true,
        },
      },
    });
    if (errors) {
      console.error('Customer create errors:', errors);
      return 'error';
    }
    if (data?.customerCreate?.customer) {
      return 'success';
    }
    const userErrors: { field?: string[]; message?: string; code?: string }[] =
      data?.customerCreate?.customerUserErrors ?? [];
    const taken = userErrors.some(
      (e) => e.code === 'TAKEN' || (e.message ?? '').toLowerCase().includes('taken')
    );
    if (taken) return 'taken';
    console.error('Customer create userErrors:', userErrors);
    return 'error';
  } catch (e) {
    console.error('Customer create failed:', e);
    return 'error';
  }
}

/* ============================================================================
 * 买家账号 MVP（2026-11-12 批次 2；2026-11-12 验收修复，见 验收报告-批次2-20261112.md）：
 * Shopify Storefront Customer API 封装——**全部走 customerClient（API 2024-04）**。
 *
 * 为什么锁 2024-04（验收 P0-1/P0-2/P0-3 实测结论）：
 * - 项目主版本 2025-07 已移除 customerAccessTokenCreate，登录拿不到 token；
 * - 经典形态的 customer 查询 / customerUpdate / 地址类 mutation 只在旧版本可用；
 * - token 以 `$customerAccessToken` 查询变量传递（**不是** X-Shopify-Customer-Access-Token
 *   header——那是另一代 API 形态，与经典 token 混用会被 Shopify 直接拒绝）。
 * 字段注意：**Order 没有 createdAt**（用 processedAt）；addresses/orders 是 connection
 * （套 edges.node）；Customer 顶层有 createdAt。
 *
 * token 存 localStorage（key: makimoo-customer-token，含 expiry）。
 * 敏感度中等可接受；正式版评估 httpOnly cookie + 后台会话（闸门 A 后台常驻时迁移）。
 * ========================================================================== */

// ── token 存取 ──

const TOKEN_KEY = 'makimoo-customer-token';

export interface CustomerToken {
  accessToken: string;
  /** ISO；过期前 1 小时视为失效，避免临界竞态 */
  expiresAt: string;
}

export function getCustomerToken(): CustomerToken | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const t = JSON.parse(raw) as CustomerToken;
    if (!t.accessToken || !t.expiresAt) return null;
    if (new Date(t.expiresAt).getTime() - Date.now() < 3600_000) return null;
    return t;
  } catch {
    return null;
  }
}

export function setCustomerToken(token: CustomerToken): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

export function clearCustomerToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

// ── 统一结果结构（页面据此渲染用户可读错误）──

export type CustomerResult<T> =
  | { ok: true; data: T }
  | { ok: false; code?: string; message: string };

interface ShopifyUserError {
  field?: string[];
  message?: string;
  code?: string;
}

/** userErrors → 用户可读 message（覆盖常见 code；其余透传 Shopify 原文） */
function toResult<T>(payload: T | null | undefined, userErrors: ShopifyUserError[] | undefined, fallback: string): CustomerResult<T> {
  if (payload) return { ok: true, data: payload };
  const e = userErrors?.[0];
  const code = e?.code;
  let message = e?.message || fallback;
  if (code === 'TAKEN' || /already.*associated|taken/i.test(message)) message = 'An account with this email already exists.';
  else if (code === 'UNIDENTIFIED_CUSTOMER' || /incorrect|no customer found|cannot find customer/i.test(message)) message = 'Incorrect email or password.';
  else if (/password/i.test(message) && /short|minimum|invalid/i.test(message)) message = 'Password must be at least 5 characters.';
  else message = message.charAt(0).toUpperCase() + message.slice(1);
  return { ok: false, code, message };
}

/** Customer API 请求（2024-04 customerClient）；经典形态 GraphQL 直接用，失败静默返回 null */
async function customerApiRequest<T>(
  document: string,
  variables: Record<string, unknown> | undefined
): Promise<T | null> {
  try {
    const { data } = await customerClient.request(document, { variables });
    return (data as T) ?? null;
  } catch (e) {
    console.error('Customer API request failed:', e);
    return null;
  }
}

// ── GraphQL 文档（经典形态，2024-04；与验收报告参考查询同源）──

const MUT_ACCESS_TOKEN_CREATE = `
  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { code field message }
    }
  }
`;

const MUT_CUSTOMER_CREATE = `
  mutation CustomerRegister($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id email }
      customerUserErrors { code field message }
    }
  }
`;

const MUT_CUSTOMER_RECOVER = `
  mutation CustomerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors { code field message }
    }
  }
`;

/** 经典形态：customerAccessToken + customer 两个参数（不是新式 input 包装） */
const MUT_CUSTOMER_UPDATE = `
  mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer { id }
      customerUserErrors { code field message }
    }
  }
`;

const MAILING_ADDRESS_FIELDS = `
  id
  firstName
  lastName
  company
  address1
  address2
  city
  province
  provinceCode
  country
  countryCode
  zip
  phone
`;

/** 客户全量查询（token 走 $customerAccessToken 变量；Order 用 processedAt——无 createdAt 字段） */
const CUSTOMER_QUERY = `
  query CustomerAccount($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      acceptsMarketing
      createdAt
      defaultAddress { ${MAILING_ADDRESS_FIELDS} }
      addresses(first: 20) { edges { node { ${MAILING_ADDRESS_FIELDS} } } }
      orders(first: 50, reverse: true) {
        edges { node {
          id
          orderNumber
          name
          processedAt
          financialStatus
          fulfillmentStatus
          statusUrl
          totalPrice { amount currencyCode }
          subtotalPrice { amount currencyCode }
          totalShippingPrice { amount currencyCode }
          totalTax { amount currencyCode }
          shippingAddress { ${MAILING_ADDRESS_FIELDS} }
          lineItems(first: 50) {
            edges { node {
              title
              quantity
              variant { title image { url } price { amount currencyCode } }
            } }
          }
        } }
      }
    }
  }
`;

const MUT_ADDRESS_CREATE = `
  mutation CustomerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress { id }
      customerUserErrors { code field message }
    }
  }
`;

const MUT_ADDRESS_UPDATE = `
  mutation CustomerAddressUpdate($customerAccessToken: String!, $address: MailingAddressInput!, $id: ID!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, address: $address, id: $id) {
      customerAddress { id }
      customerUserErrors { code field message }
    }
  }
`;

const MUT_ADDRESS_DELETE = `
  mutation CustomerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors { code field message }
    }
  }
`;

const MUT_DEFAULT_ADDRESS_UPDATE = `
  mutation CustomerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
      customer { id }
      customerUserErrors { code field message }
    }
  }
`;

// ── 模型 ──

export interface CustomerAddress {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  province?: string | null;
  provinceCode?: string | null;
  country?: string | null;
  countryCode?: string | null;
  zip?: string | null;
  phone?: string | null;
}

export interface CustomerOrderLine {
  title: string;
  quantity: number;
  variant?: {
    title?: string | null;
    image?: { url: string } | null;
    price?: { amount: string; currencyCode: string } | null;
  } | null;
}

export interface CustomerOrder {
  id: string;
  orderNumber: number;
  name: string;
  /** 下单/处理时间（Order 无 createdAt 字段，验收 P0-3） */
  processedAt?: string | null;
  /** PAID / PENDING / REFUNDED / VOIDED */
  financialStatus?: string | null;
  /** FULFILLED / UNFULFILLED / PARTIALLY_FULFILLED / ON_HOLD */
  fulfillmentStatus?: string | null;
  statusUrl?: string | null;
  totalPrice?: { amount: string; currencyCode: string } | null;
  subtotalPrice?: { amount: string; currencyCode: string } | null;
  totalShippingPrice?: { amount: string; currencyCode: string } | null;
  totalTax?: { amount: string; currencyCode: string } | null;
  shippingAddress?: CustomerAddress | null;
  lineItems: { edges: { node: CustomerOrderLine }[] };
}

export interface CustomerProfile {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  acceptsMarketing?: boolean | null;
  createdAt?: string | null;
  defaultAddress?: CustomerAddress | null;
  addresses: CustomerAddress[];
  orders: CustomerOrder[];
}

interface CustomerQueryData {
  customer: Omit<CustomerProfile, 'addresses' | 'orders'> & {
    addresses: { edges: { node: CustomerAddress }[] };
    orders: { edges: { node: CustomerOrder }[] };
  } | null;
}

function flattenCustomer(d: CustomerQueryData['customer']): CustomerProfile | null {
  if (!d) return null;
  return {
    ...d,
    addresses: (d.addresses?.edges ?? []).map((e) => e.node),
    orders: (d.orders?.edges ?? []).map((e) => e.node),
  };
}

// ── 认证 ──

/** 邮箱+密码登录（MVP 主通道；2024-04 mutation，2025-07 已移除——验收 P0-1） */
export async function customerAccessTokenCreate(email: string, password: string): Promise<CustomerResult<CustomerToken>> {
  const data = await customerApiRequest<{ customerAccessTokenCreate?: { customerAccessToken?: CustomerToken | null; customerUserErrors?: ShopifyUserError[] } }>(
    MUT_ACCESS_TOKEN_CREATE,
    { input: { email: email.trim(), password } }
  );
  if (!data) return { ok: false, message: 'Could not sign you in right now. Please try again.' };
  const payload = data.customerAccessTokenCreate;
  return toResult(payload?.customerAccessToken ?? null, payload?.customerUserErrors, 'Incorrect email or password.');
}

/** 注册（轻注册：邮箱+密码必填，姓名可选；邮箱重复返回 TAKEN 用户可读错误） */
export async function customerRegister(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<CustomerResult<{ id?: string; email?: string }>> {
  const data = await customerApiRequest<{ customerCreate?: { customer?: { id?: string; email?: string } | null; customerUserErrors?: ShopifyUserError[] } }>(
    MUT_CUSTOMER_CREATE,
    {
      input: {
        email: email.trim(),
        password,
        ...(firstName ? { firstName: firstName.trim() } : {}),
        ...(lastName ? { lastName: lastName.trim() } : {}),
      },
    }
  );
  if (!data) return { ok: false, message: 'Could not create your account right now. Please try again.' };
  const payload = data.customerCreate;
  return toResult(payload?.customer ?? null, payload?.customerUserErrors, 'Could not create your account.');
}

/** 登录并立即持久化 token（login/register 页共用） */
export async function loginCustomer(email: string, password: string): Promise<CustomerResult<CustomerToken>> {
  const r = await customerAccessTokenCreate(email, password);
  if (r.ok) setCustomerToken(r.data);
  return r;
}

/** 密码重置邮件（Shopify 原生邮件流） */
export async function customerRecover(email: string): Promise<CustomerResult<true>> {
  const data = await customerApiRequest<{ customerRecover?: { customerUserErrors?: ShopifyUserError[] } }>(
    MUT_CUSTOMER_RECOVER,
    { email: email.trim() }
  );
  if (!data) return { ok: false, message: 'Could not send the reset email right now. Please try again.' };
  const payload = data.customerRecover;
  // 防账号枚举：不存在的邮箱 Shopify 也返回空 userErrors（保持同样提示）
  return toResult(true as const, payload?.customerUserErrors, 'Could not send reset email.');
}

// ── 资料读取 / 更新 ──

/** 当前客户全量资料 + 订单 + 地址（token 变量传入；失效/无数据返回 UNAUTHORIZED） */
export async function customerGet(token: string): Promise<CustomerResult<CustomerProfile>> {
  const data = await customerApiRequest<CustomerQueryData>(CUSTOMER_QUERY, { customerAccessToken: token });
  if (!data?.customer) {
    return { ok: false, code: 'UNAUTHORIZED', message: 'Session expired. Please sign in again.' };
  }
  return { ok: true, data: flattenCustomer(data.customer)! };
}

/** 更新姓名/电话/密码（经典形态：customerAccessToken + customer 参数；不传密码字段则不改动） */
export async function customerUpdate(
  token: string,
  patch: { firstName?: string; lastName?: string; phone?: string; password?: string }
): Promise<CustomerResult<true>> {
  const data = await customerApiRequest<{ customerUpdate?: { customer?: { id: string } | null; customerUserErrors?: ShopifyUserError[] } }>(
    MUT_CUSTOMER_UPDATE,
    { customerAccessToken: token, customer: patch }
  );
  if (!data) return { ok: false, message: 'Could not save your changes right now. Please try again.' };
  const payload = data.customerUpdate;
  return toResult(payload?.customer ? (true as const) : null, payload?.customerUserErrors, 'Could not save your changes.');
}

/** 订单列表（分页 first，默认 10；reverse: true 最新在前） */
export async function customerOrders(token: string, first = 10): Promise<CustomerResult<CustomerOrder[]>> {
  const r = await customerGet(token);
  if (!r.ok) return r;
  return { ok: true, data: r.data.orders.slice(0, first) };
}

/** 订单详情：按 id 从全量（≤50）里取（静态导出无独立 order query；>50 条旧单不做，MVP 够用） */
export async function customerOrderById(token: string, id: string): Promise<CustomerResult<CustomerOrder>> {
  const r = await customerGet(token);
  if (!r.ok) return r;
  const order = r.data.orders.find((o) => o.id === id);
  if (!order) return { ok: false, message: 'Order not found.' };
  return { ok: true, data: order };
}

// ── 地址簿（经典形态：customerAccessToken 入参）──

export type AddressInput = Omit<CustomerAddress, 'id'>;

export async function customerAddressCreate(token: string, address: AddressInput): Promise<CustomerResult<{ id: string }>> {
  const data = await customerApiRequest<{ customerAddressCreate?: { customerAddress?: { id: string } | null; customerUserErrors?: ShopifyUserError[] } }>(
    MUT_ADDRESS_CREATE,
    { customerAccessToken: token, address }
  );
  const payload = data?.customerAddressCreate;
  return toResult(payload?.customerAddress ?? null, payload?.customerUserErrors, 'Could not add the address.');
}

export async function customerAddressUpdate(token: string, id: string, address: AddressInput): Promise<CustomerResult<{ id: string }>> {
  const data = await customerApiRequest<{ customerAddressUpdate?: { customerAddress?: { id: string } | null; customerUserErrors?: ShopifyUserError[] } }>(
    MUT_ADDRESS_UPDATE,
    { customerAccessToken: token, address, id }
  );
  const payload = data?.customerAddressUpdate;
  return toResult(payload?.customerAddress ?? null, payload?.customerUserErrors, 'Could not save the address.');
}

export async function customerAddressDelete(token: string, id: string): Promise<CustomerResult<string>> {
  const data = await customerApiRequest<{ customerAddressDelete?: { deletedCustomerAddressId?: string | null; customerUserErrors?: ShopifyUserError[] } }>(
    MUT_ADDRESS_DELETE,
    { customerAccessToken: token, id }
  );
  const payload = data?.customerAddressDelete;
  const r = toResult(payload?.deletedCustomerAddressId ?? null, payload?.customerUserErrors, 'Could not delete the address.');
  // Storefront token 缺 unauthenticated_write_customers scope 时 Shopify 返回顶层 ACCESS_DENIED
  //（创建/编辑/设默认不需要该 scope，实测可用）——给出运维可读提示
  if (!r.ok && /access denied/i.test(r.message)) {
    return { ok: false, code: r.code, message: 'Deleting addresses is temporarily unavailable (store token scope). Please contact support.' };
  }
  return r;
}

export async function customerDefaultAddressUpdate(token: string, addressId: string): Promise<CustomerResult<true>> {
  const data = await customerApiRequest<{ customerDefaultAddressUpdate?: { customer?: { id: string } | null; customerUserErrors?: ShopifyUserError[] } }>(
    MUT_DEFAULT_ADDRESS_UPDATE,
    { customerAccessToken: token, addressId }
  );
  const payload = data?.customerDefaultAddressUpdate;
  return toResult(payload?.customer ? (true as const) : null, payload?.customerUserErrors, 'Could not set the default address.');
}
