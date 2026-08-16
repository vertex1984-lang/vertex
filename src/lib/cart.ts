'use client';

import { shopifyClient } from './shopify';
import { CREATE_CART, ADD_TO_CART, GET_CART, UPDATE_CART_LINE, REMOVE_CART_LINES } from './queries';

const CART_ID_KEY = 'makimoo-cart-id';

function getCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CART_ID_KEY);
}

function setCartId(id: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_ID_KEY, id);
}

// cart 过期/失效时清除本地 cart-id，下次加购会重建
function clearCartId() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_ID_KEY);
}

// Local cart for products not yet in Shopify
export interface LocalCartItem {
  id: string;
  title: string;
  image: string;
  price: string;
  quantity: number;
  handle: string;
}

export function getLocalCart(): LocalCartItem[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('makimoo-cart');
  return saved ? JSON.parse(saved) : [];
}

// Notify listeners (e.g. Header cart badge) that the cart changed
export function notifyCartUpdated() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('makimoo:cart-updated'));
}

export function addToLocalCart(item: LocalCartItem) {
  const cart = getLocalCart();
  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  localStorage.setItem('makimoo-cart', JSON.stringify(cart));
  notifyCartUpdated();
}

export function removeFromLocalCart(id: string) {
  const cart = getLocalCart().filter((i) => i.id !== id);
  localStorage.setItem('makimoo-cart', JSON.stringify(cart));
  notifyCartUpdated();
  return cart;
}

export function updateLocalCartQuantity(id: string, quantity: number) {
  const cart = getLocalCart();
  if (quantity < 1) {
    return cart.filter((i) => i.id !== id);
  }
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.quantity = quantity;
  }
  localStorage.setItem('makimoo-cart', JSON.stringify(cart));
  notifyCartUpdated();
  return cart;
}

// Shopify Cart API (requires products to exist in Shopify)
export async function addToShopifyCart(merchandiseId: string, quantity: number = 1) {
  const cartId = getCartId();
  if (!cartId) {
    return createShopifyCart([{ merchandiseId, quantity }]);
  }

  try {
    const { data, errors } = await shopifyClient.request(ADD_TO_CART, {
      variables: {
        cartId,
        lines: [{ merchandiseId, quantity }],
      },
    });
    if (errors || !data?.cartLinesAdd?.cart) {
      // 已有 cart 可能已过期被 Shopify 删除：清掉旧 cart-id，重建购物车重试一次
      console.warn('Add to existing cart failed, retrying with a new cart:', errors || data?.cartLinesAdd?.userErrors);
      clearCartId();
      return createShopifyCart([{ merchandiseId, quantity }]);
    }
    return data.cartLinesAdd.cart;
  } catch (e) {
    console.error('Add to cart failed:', e);
    return null;
  }
}

async function createShopifyCart(lines: { merchandiseId: string; quantity: number }[]) {
  try {
    const { data, errors } = await shopifyClient.request(CREATE_CART, {
      variables: { input: { lines } },
    });
    if (errors || !data?.cartCreate?.cart) {
      console.error('Cart create errors:', errors || data?.cartCreate?.userErrors);
      return null;
    }
    const cart = data.cartCreate.cart;
    setCartId(cart.id);
    return cart;
  } catch (e) {
    console.error('Create cart failed:', e);
    return null;
  }
}

export async function getShopifyCart() {
  const cartId = getCartId();
  if (!cartId) return null;

  try {
    const { data, errors } = await shopifyClient.request(GET_CART, {
      variables: { cartId },
    });
    if (errors) {
      console.error('Get cart errors:', errors);
      return null;
    }
    if (!data?.cart) {
      // cart 已过期/被删除（Shopify 返回 cart: null，无 error）：清掉失效的 cart-id
      console.warn('Shopify cart no longer exists, clearing stored cart id');
      clearCartId();
      return null;
    }
    return data.cart;
  } catch (e) {
    console.error('Get cart failed:', e);
    return null;
  }
}

// 更新 Shopify 购物车行数量（quantity < 1 时由调用方走 remove）
export async function updateShopifyCartLine(lineId: string, quantity: number) {
  const cartId = getCartId();
  if (!cartId) return null;

  try {
    const { data, errors } = await shopifyClient.request(UPDATE_CART_LINE, {
      variables: { cartId, lines: [{ id: lineId, quantity }] },
    });
    if (errors || !data?.cartLinesUpdate?.cart) {
      console.error('Update cart line errors:', errors || data?.cartLinesUpdate?.userErrors);
      return null;
    }
    notifyCartUpdated();
    return data.cartLinesUpdate.cart;
  } catch (e) {
    console.error('Update cart line failed:', e);
    return null;
  }
}

// 删除 Shopify 购物车行
export async function removeShopifyCartLine(lineId: string) {
  const cartId = getCartId();
  if (!cartId) return null;

  try {
    const { data, errors } = await shopifyClient.request(REMOVE_CART_LINES, {
      variables: { cartId, lineIds: [lineId] },
    });
    if (errors || !data?.cartLinesRemove?.cart) {
      console.error('Remove cart line errors:', errors || data?.cartLinesRemove?.userErrors);
      return null;
    }
    notifyCartUpdated();
    return data.cartLinesRemove.cart;
  } catch (e) {
    console.error('Remove cart line failed:', e);
    return null;
  }
}

export function getCheckoutUrl(cart: { checkoutUrl?: string } | null): string {
  return cart?.checkoutUrl || '#';
}
