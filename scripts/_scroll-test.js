// CDP 实测：bedding 列表 → 滚动 → 点进 PDP → 后退 → 检查 scrollY 是否恢复
const CDP_PORT = 9333;
const { spawn } = require('child_process');

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', `--remote-debugging-port=${CDP_PORT}`,
  '--window-size=1440,1000', 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
      const tabs = await res.json();
      const page = tabs.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(500);
  }
  throw new Error('CDP not ready');
}

(async () => {
  const ws = new WebSocket(await getWsUrl());
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  };
  const send = (method, params = {}) => new Promise((resolve) => {
    const mid = ++id;
    pending.set(mid, resolve);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  const evalJs = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return r.result?.result?.value;
  };

  await new Promise((r) => { ws.onopen = r; });
  await send('Page.enable');
  await send('Runtime.enable');

  // 1. 打开 bedding 列表
  await send('Page.navigate', { url: 'http://localhost:8080/products/?cat=bedding' });
  await sleep(6000); // 等客户端渲染
  const h1 = await evalJs('document.body.innerText.includes("Duvet Covers")');
  console.log('列表渲染:', h1);

  // 2. 滚动到 4000px
  await evalJs('window.scrollTo(0, 4000)');
  await sleep(800);
  const y1 = await evalJs('window.scrollY');
  console.log('滚动后 scrollY:', y1);

  // 3. 点击第一个产品卡链接进 PDP
  const href = await evalJs(`(document.querySelector('a[href*="/products/makimoo"]')||{}).href`);
  console.log('点击链接:', href);
  await evalJs(`document.querySelector('a[href*="/products/makimoo"]').click()`);
  await sleep(4000);
  console.log('PDP url:', await evalJs('location.pathname'));

  // 4. 后退
  await evalJs('history.back()');
  await sleep(5000);
  const y2 = await evalJs('window.scrollY');
  const path = await evalJs('location.pathname + location.search');
  console.log('后退后 url:', path, 'scrollY:', y2);
  console.log(Math.abs(y2 - 4000) < 200 ? 'PASS: 滚动位置已恢复' : 'FAIL: 未恢复');

  ws.close();
  chrome.kill();
  process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
