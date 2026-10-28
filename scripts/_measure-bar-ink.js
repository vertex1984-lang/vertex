// 公告条墨迹居中测量：固定 DSF=1 截图，量 bar 高度与墨迹上下留白
const CDP_PORT = 9357;
const { spawn } = require('child_process');
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', '--remote-debugging-port=' + CDP_PORT,
  '--force-device-scale-factor=1',
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
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  await new Promise((r) => { ws.onopen = r; });
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:8080/' });
  await sleep(5000);
  const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true, clip: { x: 0, y: 0, width: 1440, height: 60, scale: 1 } });
  require('fs').writeFileSync('scripts/_shots/bar-ink.png', Buffer.from(shot.result.data, 'base64'));
  ws.close(); chrome.kill();

  const sharp = require('sharp');
  const { data, info } = await sharp('scripts/_shots/bar-ink.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const x = Math.round(W * 0.2);
  let barTop = -1, barBottom = -1;
  for (let y = 0; y < H; y++) {
    const i = (y * W + x) * 4;
    const isBrown = Math.abs(data[i] - 139) < 18 && Math.abs(data[i + 1] - 90) < 18 && Math.abs(data[i + 2] - 43) < 18;
    if (isBrown) { if (barTop < 0) barTop = y; barBottom = y; }
  }
  const rows = [];
  for (let y = Math.max(0, barTop); y <= barBottom; y++) {
    let cream = 0, n = 0;
    for (let xx = Math.round(W * 0.35); xx < W * 0.9; xx += 2) {
      const i = (y * W + xx) * 4;
      if (data[i] > 225 && data[i + 1] > 215 && data[i + 2] > 195) cream++;
      n++;
    }
    if (cream / n > 0.015) rows.push(y);
  }
  console.log(`bar: ${barBottom - barTop + 1}px (y${barTop}-${barBottom}) | 墨迹: 上${rows[0] - barTop}px 下${barBottom - rows[rows.length - 1]}px`);
  process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
