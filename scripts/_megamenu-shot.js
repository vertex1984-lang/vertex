// CDP 截图：首页 → 点击 Bedding 导航 → 截 mega menu 下拉
const CDP_PORT = 9334;
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

  // 点击桌面导航的 Bedding（header 内文本完全匹配的 a/button）
  const clicked = await evalJs(`(() => {
    const els = [...document.querySelectorAll('header a, header button, nav a, nav button')];
    const el = els.find((e) => e.textContent.trim() === 'Bedding');
    if (!el) return false;
    el.click();
    return true;
  })()`);
  console.log('clicked Bedding:', clicked);
  await sleep(1200);

  const menuText = await evalJs(`(() => {
    const m = [...document.querySelectorAll('div')].find((d) => d.className.includes('absolute') && d.innerText.includes('FABRIC'));
    return m ? m.innerText.slice(0, 500) : 'MENU NOT FOUND';
  })()`);
  console.log('menu text:', menuText);

  const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  require('fs').writeFileSync('scripts/_shots/megamenu-fabric.png', Buffer.from(shot.result.data, 'base64'));
  console.log('screenshot saved');

  ws.close();
  chrome.kill();
  process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
