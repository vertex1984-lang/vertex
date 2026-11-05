// CDP 截图：blankets 类目页（规划毯子卡片验证）
const CDP_PORT = 9337;
const { spawn } = require('child_process');
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', `--remote-debugging-port=${CDP_PORT}`,
  '--window-size=1440,2400', 'about:blank',
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
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  await new Promise((r) => (ws.onopen = r));
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:8080/products/?cat=blankets' });
  await sleep(6000);
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  require('fs').writeFileSync('scripts/_shots/blankets-planned.png', Buffer.from(shot.result.data, 'base64'));
  console.log('saved scripts/_shots/blankets-planned.png');
  chrome.kill(); process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
