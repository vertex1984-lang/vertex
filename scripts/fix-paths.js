const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../out');

/**
 * 计算从 HTML 文件到 dist 根目录的相对路径前缀
 * e.g. dist/index.html → './'
 *      dist/about/index.html → '../'
 *      dist/products/handle/index.html → '../../'
 */
function getDepthPrefix(filePath) {
  const relative = path.relative(DIST_DIR, filePath);
  const parts = relative.split(path.sep).filter(Boolean);
  if (parts.length <= 1) return './';
  parts.pop(); // remove filename
  return parts.map(() => '../').join('');
}

/**
 * 修复单个 HTML 文件中的路径，使其在 file:// 协议下可以正常工作
 */
function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const prefix = getDepthPrefix(filePath);

  let fixed = content;

  // ===== 第一步：修复 HTML 属性中的资源绝对路径 =====

  // 图片和资源路径（src/href/url 三种形式）
  fixed = fixed.replace(/href="\/images\//g, `href="${prefix}images/`);
  fixed = fixed.replace(/src="\/images\//g, `src="${prefix}images/`);
  fixed = fixed.replace(/url\(\/images\//g, `url(${prefix}images/`);

  // _next 资源路径
  fixed = fixed.replace(/href="\/_next\//g, `href="${prefix}_next/`);
  fixed = fixed.replace(/src="\/_next\//g, `src="${prefix}_next/`);
  fixed = fixed.replace(/url\(\/_next\//g, `url(${prefix}_next/`);

  // favicon
  fixed = fixed.replace(/href="\/favicon\.ico"/g, `href="${prefix}favicon.ico"`);

  // ===== 第二步：修复导航链接（同时处理有/无尾随斜杠的格式）=====

  // / → prefix (首页)
  fixed = fixed.replace(/href="\/"/g, `href="${prefix}index.html"`);

  // /products (无尾随斜杠) → 必须在带尾随斜杠的版本之前处理
  fixed = fixed.replace(/href="\/products"/g, `href="${prefix}products/index.html"`);

  // /products?cat=xxx (无尾随斜杠，有 query string)
  fixed = fixed.replace(/href="\/products\?([^"]*)"/g, (match, query) => {
    return `href="${prefix}products/index.html?${query}"`;
  });

  // /products/ (带尾随斜杠)
  fixed = fixed.replace(/href="\/products\/"/g, `href="${prefix}products/index.html"`);

  // /products/?cat=xxx (带尾随斜杠 + query string)
  fixed = fixed.replace(/href="\/products\/\?([^"]*)"/g, (match, query) => {
    return `href="${prefix}products/index.html?${query}"`;
  });

  // /products/handle/ → prefix + products/handle/index.html
  fixed = fixed.replace(/href="\/products\/([^"?#][^"?]*)\/"/g, (match, handle) => {
    return `href="${prefix}products/${handle}/index.html"`;
  });

  // /about (无尾随斜杠)
  fixed = fixed.replace(/href="\/about"/g, `href="${prefix}about/index.html"`);

  // /about/ (带尾随斜杠)
  fixed = fixed.replace(/href="\/about\/"/g, `href="${prefix}about/index.html"`);

  // /about#anchor
  fixed = fixed.replace(/href="\/about#([^"]*)"/g, (match, anchor) => {
    return `href="${prefix}about/index.html#${anchor}"`;
  });

  // /about/#anchor
  fixed = fixed.replace(/href="\/about\/#([^"]*)"/g, (match, anchor) => {
    return `href="${prefix}about/index.html#${anchor}"`;
  });

  // /cart (无尾随斜杠)
  fixed = fixed.replace(/href="\/cart"/g, `href="${prefix}cart/index.html"`);

  // /cart/ (带尾随斜杠)
  fixed = fixed.replace(/href="\/cart\/"/g, `href="${prefix}cart/index.html"`);

  // ===== 第三步：修复残留的相对路径目录链接 =====

  // href="./xxx/" → href="./xxx/index.html"
  fixed = fixed.replace(/href="(\.\.?\/(?:\.\.\/)*)([\w-]+)\/"/g, (match, base, dir) => {
    if (dir === '_next' || dir === 'images') return match;
    return `href="${base}${dir}/index.html"`;
  });

  // href="../" → href="../index.html"
  fixed = fixed.replace(/href="(\.\.\/+)"/g, (match, dots) => {
    return `href="${dots}index.html"`;
  });

  // 带 query string 的相对路径: ./products/?cat=xxx
  fixed = fixed.replace(/href="(\.\.?\/(?:\.\.\/)*[\w-]+)\/(\?[^"]*)"/g, (match, base, query) => {
    return `href="${base}/index.html${query}"`;
  });

  // 带锚点的相对路径: ./about/#xxx
  fixed = fixed.replace(/href="(\.\.?\/(?:\.\.\/)*[\w-]+)\/(#[^"]*)"/g, (match, base, anchor) => {
    return `href="${base}/index.html${anchor}"`;
  });

  // ===== 第四步：修复 RSC 数据中的绝对路径 =====
  // RSC 数据在 <script> 标签中，使用 JSON 格式
  // 注意：RSC 中使用 \" 转义引号，模式为 \"href\":\"/path\"

  // RSC 资源路径: \"src\":\"/images/...\"
  fixed = fixed.replace(/\\"src\\":\\"\/images\//g, `\\"src\\":\\"${prefix}images/`);

  // RSC 资源路径: \"href\":\"/_next/...\"
  fixed = fixed.replace(/\\"href\\":\\"\/_next\//g, `\\"href\\":\\"${prefix}_next/`);

  // RSC favicon
  fixed = fixed.replace(/\\"href\\":\\"\/favicon\.ico\\"/g, `\\"href\\":\\"${prefix}favicon.ico\\"`);

  // RSC /products (无尾随斜杠)
  fixed = fixed.replace(/\\"href\\":\\"\/products\\"/g, `\\"href\\":\\"${prefix}products/index.html\\"`);

  // RSC /products?cat=xxx
  fixed = fixed.replace(/\\"href\\":\\"\/products\?([^\\]*)\\"/g, (match, query) => {
    return `\\"href\\":\\"${prefix}products/index.html?${query}\\"`;
  });

  // RSC /products/handle/
  fixed = fixed.replace(/\\"href\\":\\"\/products\/([^"\\]+)\/\\"/g, (match, handle) => {
    return `\\"href\\":\\"${prefix}products/${handle}/index.html\\"`;
  });

  // RSC /about
  fixed = fixed.replace(/\\"href\\":\\"\/about\\"/g, `\\"href\\":\\"${prefix}about/index.html\\"`);

  // RSC /about#anchor
  fixed = fixed.replace(/\\"href\\":\\"\/about#([^\\]*)\\"/g, (match, anchor) => {
    return `\\"href\\":\\"${prefix}about/index.html#${anchor}\\"`;
  });

  // RSC /cart
  fixed = fixed.replace(/\\"href\\":\\"\/cart\\"/g, `\\"href\\":\\"${prefix}cart/index.html\\"`);

  // RSC / (首页)
  fixed = fixed.replace(/\\"href\\":\\"\/\\"/g, `\\"href\\":\\"${prefix}index.html\\"`);

  fs.writeFileSync(filePath, fixed);
  console.log(`Fixed: ${path.relative(DIST_DIR, filePath)} (prefix: ${prefix})`);
}

/**
 * 为每个 HTML 文件注入 window.__NEXT_BASE_PATH__ 脚本
 * 这样客户端 JS（如 ProductCard）可以用它将绝对路径转为相对路径
 */
function injectBasePath(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const prefix = getDepthPrefix(filePath);

  // 在 <head> 的第一个 <script> 之前注入
  const injection = `<script>window.__NEXT_BASE_PATH__="${prefix}";</script>`;

  if (content.includes('__NEXT_BASE_PATH__')) {
    // 已经注入过，跳过
    return;
  }

  // 在 </head> 之前注入
  const fixed = content.replace('</head>', `${injection}</head>`);
  fs.writeFileSync(filePath, fixed);
  console.log(`Injected __NEXT_BASE_PATH__="${prefix}" into ${path.relative(DIST_DIR, filePath)}`);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.name.endsWith('.html')) {
      fixFile(fullPath);
      injectBasePath(fullPath);
    }
  }
}

walk(DIST_DIR);
console.log('\nAll paths fixed!');
