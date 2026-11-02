// CDP 截图：分类页标题与 logo 左侧对齐检查（桌面 1440 + 移动 390）
const CDP_PORT = 9336;
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

  await new Promise((r) => { ws.onopen = r; });
  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: 'http://localhost:8080/products/?cat=bedding' });
  await sleep(5000);
  // 量 logo 与页面标题的左边缘
  let r = await send('Runtime.evaluate', { expression: `
    (() => {
      const logo = document.querySelector('header img[alt="Makimoo"]');
      const h1 = document.querySelector('h1');
      const crumb = document.querySelector('.px-3.lg\\\\:px-10 > nav, .px-3 > nav');
      const g = (el) => el ? Math.round(el.getBoundingClientRect().left) : null;
      return JSON.stringify({ logo: g(logo), h1: g(h1), h1text: h1 && h1.textContent });
    })()
  ` });
  console.log('desktop:', r.result.result.value);
  let shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  require('fs').writeFileSync('scripts/_shots/cat-align-desktop.png', Buffer.from(shot.result.data, 'base64'));

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Page.navigate', { url: 'http://localhost:8080/products/?cat=bedding' });
  await sleep(5000);
  r = await send('Runtime.evaluate', { expression: `
    (() => {
      const logo = document.querySelector('header img[alt="Makimoo"]');
      const g = (el) => el ? Math.round(el.getBoundingClientRect().left) : null;
      // 移动端 h1 隐藏，量面包屑里标题 span
      const spans = [...document.querySelectorAll('span')].filter(s => /bedding/i.test(s.textContent) && s.children.length === 0);
      return JSON.stringify({ logo: g(logo), crumbSpans: spans.slice(0,3).map(g) });
    })()
  ` });
  console.log('mobile:', r.result.result.value);
  shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  require('fs').writeFileSync('scripts/_shots/cat-align-mobile.png', Buffer.from(shot.result.data, 'base64'));

  ws.close();
  chrome.kill();
  process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
