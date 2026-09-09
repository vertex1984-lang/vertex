// 聊天代理 · 服务层：HTTP 路由 + 各模块组装。只做编排，不含业务逻辑。
//   GET  /health   → 存活检查（前端/人工探活）
//   GET  /catalog  → 当前目录（调试用）
//   POST /chat     → { message, history } → { reply, products: [卡片] }
// 任何 /chat 内部失败都返回 5xx，前端据此自动降级到本地剧本引擎。
import http from "node:http";
import { DATA_FILES, LLM_BASE_URL, MAX_HISTORY, MAX_RECS, MODEL, PORT, REQUEST_TIMEOUT_MS, readApiKey } from "./config.mjs";
import { buildCatalog, watchCatalog } from "./catalog.mjs";
import { buildSystemPrompt } from "./prompt.mjs";
import { chatCompletion, parseLlmReply } from "./llm.mjs";

const state = { catalog: null, byHandle: new Map(), apiKey: "" };

function rebuild() {
  const next = buildCatalog();
  state.catalog = next;
  state.byHandle = new Map(next.products.map((p) => [p.handle, p]));
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(body);
}

function cleanHistory(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((t) => t && typeof t.content === "string" && (t.role === "user" || t.role === "assistant"))
    .map((t) => ({ role: t.role, content: t.content.slice(0, 800) }))
    .slice(-MAX_HISTORY * 2);
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function handleChat(message, history) {
  if (!message || typeof message !== "string") throw new HttpError(400, "message 必填");
  const catalog = state.catalog;
  const messages = [
    { role: "system", content: buildSystemPrompt(catalog) },
    ...cleanHistory(history),
    { role: "user", content: message.slice(0, 1200) },
  ];
  const common = {
    apiKey: state.apiKey,
    baseUrl: LLM_BASE_URL,
    model: MODEL,
    timeoutMs: REQUEST_TIMEOUT_MS,
  };
  let parsed;
  try {
    const { content } = await chatCompletion({ ...common, messages, jsonMode: true });
    parsed = parseLlmReply(content);
  } catch (first) {
    // 重试策略：去掉 json_format 约束再试（部分思考型模型在 json 模式下会输出空正文）
    console.warn("[chat] 首次调用失败，换宽松模式重试:", first.message);
    const { content } = await chatCompletion({ ...common, jsonMode: false, messages });
    parsed = parseLlmReply(content);
  }
  const products = parsed.recommendations
    .slice(0, MAX_RECS)
    .map((h) => state.byHandle.get(h))
    .filter(Boolean)
    .map((p) => ({ handle: p.handle, title: p.title, price: p.price, image: p.image, url: p.url, size: p.size, material: p.material, available: p.available }));
  return { reply: parsed.reply, products };
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (req.method === "OPTIONS") return sendJson(res, 204, {});
  const started = Date.now();
  try {
    if (req.method === "GET" && url.pathname === "/health") {
      return sendJson(res, 200, {
        ok: true,
        model: MODEL,
        products: state.catalog.products.length,
        builtAt: state.catalog.builtAt,
      });
    }
    if (req.method === "GET" && url.pathname === "/catalog") {
      return sendJson(res, 200, { builtAt: state.catalog.builtAt, count: state.catalog.products.length, products: state.catalog.products });
    }
    if (req.method === "POST" && url.pathname === "/chat") {
      const body = await readJsonBody(req);
      const out = await handleChat(body.message, body.history);
      console.log(`[chat] ${Date.now() - started}ms recs=${out.products.length} q="${String(body.message).slice(0, 40)}"`);
      return sendJson(res, 200, out);
    }
    sendJson(res, 404, { error: "not found" });
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 502;
    console.error(`[chat] ${Date.now() - started}ms ERROR:`, err.message);
    sendJson(res, status, { error: err.message });
  }
});

// ---- 启动 ----
state.apiKey = readApiKey();
rebuild();
watchCatalog(
  () => state.catalog,
  () => rebuild(),
);
server.listen(PORT, () => {
  console.log(`[chat-proxy] http://localhost:${PORT} | 模型 ${MODEL} | 目录 ${state.catalog.products.length} 款`);
  console.log(`[chat-proxy] 数据源: ${Object.values(DATA_FILES).join(", ")}`);
});
