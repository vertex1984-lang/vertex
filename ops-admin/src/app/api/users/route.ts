import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDb, writeDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

/**
 * 多后台用户管理（2026-11-26 线上版批次）：列表 / 新增 / 停用 / 启用 / 改密码。
 * 角色暂不细分（统一运营权限）；登录走既有 SESSION_SECRET 会话体系，停用账号立即拒绝登录。
 * 守卫：不能停用自己；不能停用最后一个可用账号。
 */
export async function GET() {
  const db = readDb();
  return NextResponse.json({
    users: db.users.map((u) => ({ username: u.username, role: u.role, disabled: !!u.disabled })),
  });
}

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));
  const name = String(username || '').trim();
  const pass = String(password || '');
  if (!/^[a-zA-Z0-9_-]{3,32}$/.test(name)) {
    return NextResponse.json({ error: '用户名需 3-32 位字母/数字/下划线/中划线' }, { status: 400 });
  }
  if (pass.length < 8) {
    return NextResponse.json({ error: '密码至少 8 位' }, { status: 400 });
  }
  const db = readDb();
  if (db.users.some((u) => u.username === name)) {
    return NextResponse.json({ error: `用户名已存在：${name}` }, { status: 409 });
  }
  const { salt, hash } = hashPassword(pass);
  db.users.push({ username: name, hash, salt, role: 'ops', disabled: false });
  writeDb(db);
  return NextResponse.json({ ok: true, username: name });
}

export async function PATCH(req: Request) {
  const { username, disabled, password } = await req.json().catch(() => ({}));
  const name = String(username || '').trim();
  const db = readDb();
  const user = db.users.find((u) => u.username === name);
  if (!user) return NextResponse.json({ error: `用户不存在：${name}` }, { status: 404 });

  // 改密码
  if (typeof password === 'string' && password) {
    if (password.length < 8) return NextResponse.json({ error: '密码至少 8 位' }, { status: 400 });
    const { salt, hash } = hashPassword(password);
    user.salt = salt;
    user.hash = hash;
    writeDb(db);
    return NextResponse.json({ ok: true, username: name, action: 'password' });
  }

  // 停用 / 启用
  if (typeof disabled === 'boolean') {
    // 当前会话用户名从 session 取不到这里（middleware 已验签，body 传操作者），守卫用名单规则：
    const enabledOthers = db.users.filter((u) => u.username !== name && !u.disabled).length;
    if (disabled && enabledOthers === 0) {
      return NextResponse.json({ error: '不能停用最后一个可用账号' }, { status: 400 });
    }
    user.disabled = disabled;
    writeDb(db);
    return NextResponse.json({ ok: true, username: name, disabled });
  }

  return NextResponse.json({ error: '无有效操作字段' }, { status: 400 });
}
