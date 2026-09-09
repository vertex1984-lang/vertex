// 聊天代理 · LLM 客户端层：只负责和 DeepSeek 的 HTTP 通信 + 回复解析校验。
// 不关心目录从哪来、服务怎么起——由 server 层组装。
const stripCodeFence = (s) =>
  s.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

/**
 * 调 DeepSeek /chat/completions（OpenAI 兼容格式）。
 * 返回 { content, finishReason }；思考型模型可能把 token 花在推理上，finishReason 便于诊断。
 */
export async function chatCompletion({ apiKey, baseUrl, model, messages, timeoutMs, jsonMode = true }) {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.4,
      max_tokens: 4000,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      stream: false,
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`LLM HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const choice = data.choices?.[0];
  return {
    content: choice?.message?.content ?? "",
    finishReason: choice?.finish_reason ?? "unknown",
  };
}

/** 解析并校验 LLM 回复 → { reply, recommendations }。格式不合格直接抛错（由上层决定重试/降级）。 */
export function parseLlmReply(content) {
  const cleaned = stripCodeFence(String(content));
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) {
    throw new Error(`LLM 回复中没有 JSON 对象（原文前 120 字: "${cleaned.slice(0, 120)}"）`);
  }
  let obj;
  try {
    obj = JSON.parse(cleaned.slice(start, end + 1));
  } catch (err) {
    throw new Error(`LLM 回复 JSON 解析失败: ${err.message}（原文前 160 字: "${cleaned.slice(0, 160)}"）`);
  }
  const reply = typeof obj.reply === "string" ? obj.reply.trim() : "";
  if (!reply) throw new Error(`LLM 回复缺少 reply 字段（原文前 160 字: "${cleaned.slice(0, 160)}"）`);
  const recommendations = Array.isArray(obj.recommendations)
    ? obj.recommendations.filter((h) => typeof h === "string" && h.length > 0)
    : [];
  return { reply, recommendations };
}
