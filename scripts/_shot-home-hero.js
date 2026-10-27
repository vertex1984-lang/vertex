// CDP 截图：首页 hero 效果图（桌面 1440x900 + 移动 390x844）
const CDP_PORT = 9335;
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

  await send('Page.navigate', { url: 'http://localhost:8080/' });
  await sleep(5000);
  let shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  require('fs').writeFileSync('scripts/_shots/home-hero-v3-desktop.png', Buffer.from(shot.result.data, 'base64'));
  console.log('desktop saved');

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Page.navigate', { url: 'http://localhost:8080/' });
  await sleep(5000);
  shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  require('fs').writeFileSync('scripts/_shots/home-hero-v3-mobile.png', Buffer.from(shot.result.data, 'base64'));
  console.log('mobile saved');

  ws.close();
  chrome.kill();
  process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
