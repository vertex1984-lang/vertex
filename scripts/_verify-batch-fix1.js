// 补充验证：c7/c3 色点行与尺寸选择器、/inspiration/ 圆点
const CDP_PORT = 9338;
const { spawn } = require('child_process');
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', `--remote-debugging-port=${CDP_PORT}`,
  '--window-size=1440,900', 'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
      const page = (await res.json()).find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(500);
  }
  throw new Error('CDP not ready');
}
(async () => {
  const ws = new WebSocket(await getWsUrl());
  let id = 0; const pending = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  };
  const send = (method, params = {}) => new Promise((resolve) => {
    const mid = ++id; pending.set(mid, resolve);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  await new Promise((r) => { ws.onopen = r; });
  await send('Page.enable'); await send('Runtime.enable');
  const check = async (name, url, expr, wait = 5000) => {
    await send('Page.navigate', { url });
    await sleep(wait);
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true });
    console.log(`\n== ${name} ==`);
    console.log(r.result.result.value ?? JSON.stringify(r.result).slice(0, 300));
  };
  const pdpExpr = `(() => {
    // 色点行 = "Color:" 标签 + 一排跳兄弟色 handle 的链接；拆分后应不存在
    const bodyText = document.body.innerText;
    const siblingLinks = [...document.querySelectorAll('a[href]')]
      .map(a => a.getAttribute('href'))
      .filter(h => /1052742241013-c\d|745181807454-c\d|gt010|gt029|gt070/.test(h || ''));
    // 尺寸选择器 = 含 "Size" 标签的按钮
    const sizeBtn = [...document.querySelectorAll('button')].find(b => {
      const s = b.querySelector('span');
      return s && s.textContent.trim() === 'Size';
    });
    const sizeOptions = [...document.querySelectorAll('a,button')].filter(el => /\d+\s*[×x]/.test(el.textContent || '')).length;
    return JSON.stringify({
      hasColorLabel: bodyText.includes('Color:'),
      siblingColorLinks: siblingLinks.slice(0, 5),
      siblingColorLinkCount: siblingLinks.length,
      hasSizeButton: !!sizeBtn,
      sizeButtonText: sizeBtn ? sizeBtn.textContent.trim().slice(0, 60) : null,
    });
  })()`;
  await check('PDP c7', 'http://localhost:8080/products/vintage-persian-area-rug-faux-cashmere-bohemian-non-slip-1052742241013-c7/', pdpExpr);
  await check('PDP c3', 'http://localhost:8080/products/elegant-distressed-oriental-vintage-area-rug-traditional-745181807454-c3/', pdpExpr);
  await check('/inspiration/', 'http://localhost:8080/inspiration/', `(() => {
    const dots = document.querySelectorAll('button[aria-label^="Shop "]').length;
    const imgs = document.querySelectorAll('img').length;
    return JSON.stringify({ dots, imgs });
  })()`, 6000);
  ws.close(); chrome.kill(); process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
