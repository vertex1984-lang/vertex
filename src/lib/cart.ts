'use client';

import { shopifyClient } from './shopify';
import { CREATE_CART, ADD_TO_CART, GET_CART } from './queries';

const CART_ID_KEY = 'makimoo-cart-id';

function getCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CART_ID_KEY);
}

function setCartId(id: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_ID_KEY, id);
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

export function addToLocalCart(item: LocalCartItem) {
  const cart = getLocalCart();
  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  localStorage.setItem('makimoo-cart', JSON.stringify(cart));
}

export function removeFromLocalCart(id: string) {
  const cart = getLocalCart().filter((i) => i.id !== id);
  localStorage.setItem('makimoo-cart', JSON.stringify(cart));
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
      console.error('Add to cart errors:', errors);
      return null;
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
      console.error('Cart create errors:', errors);
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
    if (errors || !data?.cart) {
      console.error('Get cart errors:', errors);
      return null;
    }
    return data.cart;
  } catch (e) {
    console.error('Get cart failed:', e);
    return null;
  }
}

export function getCheckoutUrl(cart: { checkoutUrl?: string } | null): string {
  return cart?.checkoutUrl || '#';
}
