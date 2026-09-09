// LLM 导购 API 客户端：前端与聊天代理通信的唯一通道，UI 组件不直接碰 fetch。
// 设计：无状态——每次发送"当前消息 + 最近历史"，返回回复文本 + 产品卡；
// 任何失败都抛异常，由调用方（ChatWidget）负责降级到本地剧本引擎。
import type { ProductCard } from "../config/chat-script";
import { CONTACT_CONFIG } from "../config/contact";

export type LlmHistoryTurn = { role: "user" | "assistant"; content: string };

type LlmProxyReply = {
  reply?: string;
  products?: { handle: string; title: string; price: string; image: string; url: string }[];
  error?: string;
};

/** 询问 AI 导购。成功返回 { text, products }；失败抛异常。 */
export async function askShoppingAssistant(
  message: string,
  history: LlmHistoryTurn[],
): Promise<{ text: string; products: ProductCard[] }> {
  const { baseUrl, timeoutMs } = CONTACT_CONFIG.llm;
  const res = await fetch(`${baseUrl}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`聊天代理 HTTP ${res.status}`);
  const data = (await res.json()) as LlmProxyReply;
  if (!data.reply) throw new Error(data.error || "聊天代理未返回内容");
  const products = (data.products ?? []).map<ProductCard>((p) => ({
    title: p.title,
    price: p.price,
    image: p.image,
    url: p.url,
  }));
  return { text: data.reply, products };
}

/** 把最近的消息转成 LLM 历史格式（只保留文本，忽略产品卡），historyLimit 条以内 */
export function toLlmHistory(
  msgs: { from: "bot" | "user"; text?: string }[],
  historyLimit = 8,
): LlmHistoryTurn[] {
  return msgs
    .filter((m) => m.text)
    .slice(-historyLimit)
    .map((m) => ({
      role: m.from === "user" ? ("user" as const) : ("assistant" as const),
      content: m.text as string,
    }));
}
