import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { VERTEX_PUBLIC } from '@/lib/env';

const MIME: Record<string, string> = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
};

/** vertex public 目录图片代理：/api/asset/images/products/xxx/1.webp */
export async function GET(_req: NextRequest, { params }: { params: { path: string[] } }) {
  const rel = params.path.join('/');
  const resolved = path.resolve(VERTEX_PUBLIC, rel);
  if (!resolved.startsWith(path.resolve(VERTEX_PUBLIC))) {
    return NextResponse.json({ error: '路径不合法' }, { status: 400 });
  }
  try {
    const buf = fs.readFileSync(resolved);
    const type = MIME[path.extname(resolved).toLowerCase()] || 'application/octet-stream';
    return new Response(new Uint8Array(buf), {
      headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=86400' },
    });
  } catch {
    return NextResponse.json({ error: '资源不存在' }, { status: 404 });
  }
}
