import crypto from 'crypto';
import { readDb } from './db';
import { SESSION_COOKIE, signSession } from './session';

/** 密码散列（scrypt，无原生依赖） */
export function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, s, 32).toString('hex');
  return { salt: s, hash };
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  const candidate = crypto.scryptSync(password, salt, 32).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(hash, 'hex'));
}

/** 校验登录并返回会话 cookie 值；失败返回 null（停用账号同样拒绝） */
export function login(username: string, password: string): Promise<string | null> {
  const db = readDb();
  const user = db.users.find((u) => u.username === username);
  if (!user || user.disabled || !verifyPassword(password, user.salt, user.hash)) return Promise.resolve(null);
  return signSession(username);
}

export { SESSION_COOKIE };
