/**
 * out/ 本地预览服务器（临时自测用，仅本机；纪律：全响应 no-store 防 HTML/JS 启发式缓存；
 * /index.html 一律 301 到干净 URL——Next 客户端路由无 index.html 路由，直访会水合失败）。
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'out');
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json',
  '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.txt': 'text/plain', '.xml': 'application/xml',
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath.endsWith('/index.html') || urlPath.endsWith('/index')) {
    const clean = urlPath.replace(/index(\.html)?$/, '');
    res.writeHead(301, { Location: clean === '' ? '/' : clean });
    return res.end();
  }
  let fp = path.join(ROOT, urlPath);
  if (urlPath.endsWith('/')) fp = path.join(fp, 'index.html');
  fs.readFile(fp, (err, data) => {
    if (err) {
      // 无尾斜杠的目录式 URL（/cart → out/cart/index.html）：301 补斜杠（与静态托管行为一致）
      if (!path.extname(urlPath) && fs.existsSync(path.join(ROOT, urlPath, 'index.html'))) {
        res.writeHead(301, { Location: urlPath + '/', 'Cache-Control': 'no-store' });
        return res.end();
      }
      res.writeHead(404, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' });
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(8080, '0.0.0.0', () => console.log('preview on http://localhost:8080 （局域网可访问，手机用电脑 IP 直连）'));
