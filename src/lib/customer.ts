import { shopifyClient } from './shopify';
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
