// 临时验证（2026-11-05 批次）：mats 单网格 / 地毯拆分 PDP / PILE 卡移除 / lookbook 回归
const CDP_PORT = 9337;
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
    console.log(r.result.result.value ?? JSON.stringify(r.result));
  };

  await check('mats 单网格', 'http://localhost:8080/products?cat=mats', `(() => {
    const headings = [...document.querySelectorAll('h2')].map(h => h.textContent.trim());
    const nav = document.querySelector('nav[aria-label="Mats categories"], [aria-label="Mats categories"]');
    const grid = document.querySelector('.grid.grid-cols-2');
    const cards = grid ? grid.querySelectorAll('a[href*="/products/"]').length : 0;
    const text = document.body.innerText;
    return JSON.stringify({
      sectionHeadings: headings,
      heroNavExists: !!nav,
      cardCount: cards,
      berberCardMentions: (text.match(/Berber Diamond/g) || []).length,
      nordicCardMentions: (text.match(/Nordic Grey/g) || []).length,
      patchworkCardMentions: (text.match(/Floral Patchwork/g) || []).length,
      hasKitchenMats: text.includes('Kitchen Mats'),
    });
  })()`, 6000);

  await check('PDP c7 Sage Medallion', 'http://localhost:8080/products/vintage-persian-area-rug-faux-cashmere-bohemian-non-slip-1052742241013-c7/', `(() => {
    const text = document.body.innerText;
    const swatches = [...document.querySelectorAll('a.rounded-full, a[class*="rounded-full"]')].length;
    const specRows = [...document.querySelectorAll('td')].map(t => t.textContent.trim());
    const colorIdx = specRows.findIndex(t => t === 'Color');
    return JSON.stringify({
      pileQuickCard: text.includes('PILE'),
      pileHeightRow: specRows.includes('Pile Height'),
      colorValue: colorIdx >= 0 ? specRows[colorIdx + 1] : null,
      swatchLinks: swatches,
      hasSizeSelector: /\bSize\b/.test(text),
      hasReviews: /Reviews|reviews/.test(text),
      title: document.querySelector('h1')?.textContent?.trim(),
    });
  })()`);

  await check('PDP c3 Pastel Damask', 'http://localhost:8080/products/elegant-distressed-oriental-vintage-area-rug-traditional-745181807454-c3/', `(() => {
    const text = document.body.innerText;
    const specRows = [...document.querySelectorAll('td')].map(t => t.textContent.trim());
    const colorIdx = specRows.findIndex(t => t === 'Color');
    const pileIdx = specRows.findIndex(t => t === 'Pile Height');
    const swatches = [...document.querySelectorAll('a.rounded-full, a[class*="rounded-full"]')].length;
    return JSON.stringify({
      pileQuickCard: text.includes('PILE'),
      pileHeightValue: pileIdx >= 0 ? specRows[pileIdx + 1] : null,
      colorValue: colorIdx >= 0 ? specRows[colorIdx + 1] : null,
      swatchLinks: swatches,
      hasReviews: /Reviews|reviews/.test(text),
      title: document.querySelector('h1')?.textContent?.trim(),
    });
  })()`);

  await check('GT010 Berber Diamond PDP', 'http://localhost:8080/products/vintage-persian-area-rug-diamond-medallion-745181807454-gt010/', `(() => {
    const text = document.body.innerText;
    const specRows = [...document.querySelectorAll('td')].map(t => t.textContent.trim());
    const colorIdx = specRows.findIndex(t => t === 'Color');
    const imgs = [...document.querySelectorAll('img')];
    const broken = imgs.filter(i => i.complete && i.naturalWidth === 0).length;
    return JSON.stringify({
      colorValue: colorIdx >= 0 ? specRows[colorIdx + 1] : null,
      pileQuickCard: text.includes('PILE'),
      imgCount: imgs.length, brokenImgs: broken,
      title: document.querySelector('h1')?.textContent?.trim(),
    });
  })()`);

  await check('/scenes/ 回归', 'http://localhost:8080/scenes/', `(() => {
    const dots = document.querySelectorAll('button[aria-label^="Shop "]').length;
    const cards = document.querySelectorAll('a[href*="/scenes/"]').length;
    return JSON.stringify({ dots, sceneCards: cards });
  })()`, 6000);

  await check('/inspiration/ 回归', 'http://localhost:8080/inspiration/', `(() => {
    const dots = document.querySelectorAll('button[aria-label^="Shop "]').length;
    const cards = [...document.querySelectorAll('a')].filter(a => /\/scenes\//.test(a.getAttribute('href') || '')).length;
    return JSON.stringify({ dots, sceneCards: cards });
  })()`, 6000);

  await check('首页 + bedding 抽查', 'http://localhost:8080/', `(() => {
    return JSON.stringify({ productLinks: document.querySelectorAll('a[href*="/products/"]').length });
  })()`, 5000);

  await check('bedding 抽查', 'http://localhost:8080/products?cat=bedding', `(() => {
    return JSON.stringify({ productLinks: document.querySelectorAll('a[href*="/products/"]').length });
  })()`, 6000);

  ws.close(); chrome.kill(); process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
