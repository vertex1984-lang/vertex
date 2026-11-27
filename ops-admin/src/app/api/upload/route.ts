import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { imageSize } from 'image-size';
import { VERTEX_PUBLIC } from '@/lib/env';

const ALLOWED = new Set(['.webp', '.png', '.jpg', '.jpeg']);
const MAX_BYTES = 8 * 1024 * 1024;

/**
 * 图片上传（本地演示版）：直写 vertex/public/images/<bucket>/<folder>/
 * multipart 字段：slug（目录名）、files（多文件）、bucket（可选：products 默认=上货向导 / orders=订单实拍图，批次 1）
 */
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: '请求格式错误' }, { status: 400 });

  const rawSlug = String(form.get('slug') || '');
  const slug = rawSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  if (!slug) return NextResponse.json({ error: '缺少目录标识（系列 slug）' }, { status: 400 });

  const bucket = String(form.get('bucket') || 'products') === 'orders' ? 'orders' : 'products';

  const files = form.getAll('files').filter((f): f is File => f instanceof File);
  if (files.length === 0) return NextResponse.json({ error: '没有收到文件' }, { status: 400 });

  const dir = path.join(VERTEX_PUBLIC, 'images', bucket, slug);
  fs.mkdirSync(dir, { recursive: true });

  const urls: { url: string; width: number; height: number }[] = [];
  let index = 1;
  for (const file of files) {
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED.has(ext)) {
      return NextResponse.json({ error: `不支持的格式：${file.name}（仅 webp/png/jpg）` }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: `文件过大（>8MB）：${file.name}` }, { status: 400 });
    }
    const buf = Buffer.from(await file.arrayBuffer());
    let width = 1000;
    let height = 1000;
    try {
      const dim = imageSize(buf);
      width = dim.width;
      height = dim.height;
    } catch {
      // 尺寸解析失败不阻断上传，用默认值
    }
    const name = `${index}${ext === '.jpeg' ? '.jpg' : ext}`;
    fs.writeFileSync(path.join(dir, name), buf);
    urls.push({ url: `/images/${bucket}/${slug}/${name}`, width, height });
    index++;
  }

  return NextResponse.json({ ok: true, urls });
}
