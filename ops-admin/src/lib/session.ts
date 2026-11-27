/**
 * 会话令牌：HMAC-SHA256 签名的 base64url 载荷。
 * 只用 Web Crypto（crypto.subtle），Node 路由与 Edge middleware 两端通用。
 */
const SESSION_COOKIE = 'makimoo_session';
const SESSION_TTL_MS = 7 * 24 * 3600 * 1000;

const enc = new TextEncoder();

function getSecret(): string {
  return process.env.SESSION_SECRET || 'dev-only-secret';
}

function b64url(input: string | Uint8Array): string {
  const bytes = typeof input === 'string' ? enc.encode(input) : input;
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s: string): string {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return bin;
}

async function hmac(data: Uint8Array): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, data as unknown as ArrayBuffer);
  return new Uint8Array(sig);
}

export interface SessionPayload {
  u: string; // username
  exp: number;
}

export async function signSession(username: string): Promise<string> {
  const payload: SessionPayload = { u: username, exp: Date.now() + SESSION_TTL_MS };
  const data = b64url(JSON.stringify(payload));
  const sig = await hmac(enc.encode(data));
  return `${data}.${b64url(sig)}`;
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token || !token.includes('.')) return null;
  const [data, sig] = token.split('.');
  try {
    const expected = await hmac(enc.encode(data));
    const expectedStr = b64url(expected);
    if (expectedStr !== sig) return null;
    const payload = JSON.parse(fromB64url(data)) as SessionPayload;
    if (!payload?.u || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
