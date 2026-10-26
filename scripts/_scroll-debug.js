// CDP 调试：后退后采样 scrollY 时间线 + sessionStorage + popstate 触发情况
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
    if (r.result?.exceptionDetails) console.log('JS ERR:', JSON.stringify(r.result.exceptionDetails).slice(0, 300));
    return r.result?.result?.value;
  };

  await new Promise((r) => { ws.onopen = r; });
  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: 'http://localhost:8080/products/?cat=bedding' });
  await sleep(6000);
  await evalJs('window.scrollTo(0, 4000)');
  await sleep(800);
  console.log('scrollY:', await evalJs('window.scrollY'));
  console.log('saved:', await evalJs(`sessionStorage.getItem('scroll:/products/?cat=bedding')`));

  await evalJs(`document.querySelector('a[href*="/products/makimoo"]').click()`);
  await sleep(4000);
  console.log('PDP:', await evalJs('location.pathname'));

  // 注入探针再后退
  await evalJs(`window.__pops=0; window.addEventListener('popstate',()=>window.__pops++); window.__timeline=[];`);
  await evalJs('history.back()');
  for (let i = 0; i < 16; i++) {
    await sleep(400);
    await evalJs(`window.__timeline.push([${Date.now()}, window.scrollY, document.body.innerText.length])`).catch?.(() => {});
  }
  console.log('popstate 次数(仅 PDP 页注入的探针, 后退后页面若重挂载则归零):', await evalJs('window.__pops'));
  console.log('timeline:', JSON.stringify(await evalJs('window.__timeline')));
  console.log('final url:', await evalJs('location.pathname + location.search'));
  console.log('final scrollY:', await evalJs('window.scrollY'));
  console.log('saved keys:', await evalJs('Object.keys(sessionStorage).filter(k=>k.startsWith("scroll:"))'));
  console.log('saved val:', await evalJs(`sessionStorage.getItem('scroll:/products/?cat=bedding')`));

  ws.close();
  chrome.kill();
  process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
