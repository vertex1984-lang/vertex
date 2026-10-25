// 本地预览 Makimoo 网站（Next.js 静态导出）。
// 默认服务本目录的 out/（headless-store-ins 内独立副本，2026-10-24 从 ../serve-out.mjs 复制）。
// 要求（见 headless-store-ins/AGENTS.md「本地预览」）：
//  - 全响应 Cache-Control: no-store（防浏览器启发式缓存旧 HTML + 已删 JS chunk 导致水合失败）
//  - /index.html（含子路径）一律 301 到干净 URL（Next 客户端路由表没有 index.html 路由）
// 用法：node serve-out.mjs [out目录]  →  http://localhost:8080
import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.argv[2]
  ? resolve(process.argv[2])
  : normalize(join(fileURLToPath(import.meta.url), '..', 'out'));
const PORT = 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.mp4': 'video/mp4',
};

function send(res, status, headers, body) {
  res.writeHead(status, { 'Cache-Control': 'no-store', ...headers });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  } catch {
    return send(res, 400, {}, 'Bad Request');
  }

  // /index.html（含子路径）→ 301 到干净 URL
  if (/(^|\/)index\.html$/.test(pathname)) {
    const target = pathname.replace(/index\.html$/, '') || '/';
    return send(res, 301, { Location: target }, '');
  }

  // 防目录穿越
  const filePath = normalize(join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) return send(res, 403, {}, 'Forbidden');

  // 依次尝试：精确文件 → .html → /index.html（目录）→ 404.html
  const candidates = [filePath, filePath + '.html', join(filePath, 'index.html')];
  let found = null;
  for (const c of candidates) {
    if (existsSync(c) && statSync(c).isFile()) {
      found = c;
      break;
    }
  }
  if (!found) {
    const notFound = join(ROOT, '404.html');
    if (existsSync(notFound)) {
      res.writeHead(404, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-store' });
      return createReadStream(notFound).pipe(res);
    }
    return send(res, 404, {}, 'Not Found');
  }

  res.writeHead(200, {
    'Content-Type': MIME[extname(found).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  createReadStream(found).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Serving ${ROOT} at http://localhost:${PORT} (cache disabled, index.html → clean URL)`);
});
