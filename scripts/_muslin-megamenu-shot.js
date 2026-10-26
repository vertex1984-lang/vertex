// CDP 截图：首页 → 点击 Bedding 导航 → 截 mega menu（验证 Cotton Blend 已去置灰、链接 /bedding/cotton-blend/）
const CDP_PORT = 9335;
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

  await send('Page.navigate', { url: 'http://localhost:8080/' });
  await sleep(5000);

  const clicked = await evalJs(`(() => {
    const els = [...document.querySelectorAll('header a, header button, nav a, nav button')];
    const el = els.find((e) => e.textContent.trim() === 'Bedding');
    if (!el) return false;
    el.click();
    return true;
  })()`);
  console.log('clicked Bedding:', clicked);
  await sleep(1200);

  // 抓 Fabric 列里 Cotton Blend 项的 href / 是否置灰
  const info = await evalJs(`(() => {
    const links = [...document.querySelectorAll('a')].filter((a) => a.textContent.includes('Cotton Blend'));
    return links.map((a) => ({ href: a.getAttribute('href'), cls: a.className.slice(0, 120), text: a.innerText.replace(/\\n/g, ' | ') }));
  })()`);
  console.log('Cotton Blend menu links:', JSON.stringify(info, null, 2));

  const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  require('fs').writeFileSync('scripts/_shots/muslin-megamenu.png', Buffer.from(shot.result.data, 'base64'));
  console.log('screenshot saved');

  ws.close();
  chrome.kill();
  process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
