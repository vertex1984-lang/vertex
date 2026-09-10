"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { CONTACT_CONFIG, isServiceOpenNow, serviceHoursLabel } from "../config/contact";
import { askShoppingAssistant, toLlmHistory } from "../lib/chat-llm";
import {
  handleUserInput,
  type ChatFlow,
  type ChatMemory,
  type ChatReply,
  type FlowChip,
  type ProductCard,
} from "../config/chat-script";

type Msg = {
  id: number;
  from: "bot" | "user";
  text?: string;
  products?: ProductCard[];
};

function ChatIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function Avatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-[#8B5A2B] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
      M
    </div>
  );
}

function MsgRow({ m }: { m: Msg }) {
  if (m.from === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-[#8B5A2B] text-white text-sm rounded-2xl rounded-tr-sm px-3.5 py-2 whitespace-pre-line">
          {m.text}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <Avatar />
        {m.text && (
          <div className="max-w-[80%] bg-white text-[#333] text-sm rounded-2xl rounded-tl-sm px-3.5 py-2 whitespace-pre-line shadow-sm">
            {m.text}
          </div>
        )}
      </div>
      {m.products && (
        <div className="flex gap-2 overflow-x-auto pb-1 pl-9">
          {m.products.map((p) => (
            <a
              key={p.url}
              href={p.url}
              className="w-32 flex-shrink-0 bg-white rounded-xl border border-[#eee] p-2 hover:border-[#8B5A2B] transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.title} className="w-full aspect-square object-cover rounded-lg" width={120} height={120} loading="lazy" />
              <p className="text-[11px] font-semibold text-[#333] mt-1.5 line-clamp-2 leading-snug">{p.title}</p>
              <p className="text-xs font-bold text-[#8B5A2B] mt-0.5">{p.price}</p>
              <p className="text-[11px] text-[#8B5A2B] font-semibold mt-1">View details →</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function TypingRow() {
  return (
    <div className="flex items-start gap-2">
      <Avatar />
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="w-1.5 h-1.5 rounded-full bg-[#c9b8a3] animate-bounce"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [online, setOnline] = useState(true);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [flow, setFlow] = useState<ChatFlow>("idle");
  const [flowChips, setFlowChips] = useState<FlowChip[] | null>(null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [hasReplied, setHasReplied] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const pathname = usePathname();
  const isPDP = pathname?.startsWith("/products/") ?? false;
  /** AI 导购模式：开启后 24/7 由 LLM 接待，服务时间仅作为"人工跟进时段"文案 */
  const aiMode = CONTACT_CONFIG.llm.enabled;
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  // 推荐记忆：当前主题 + 已推荐产品 + 跨品类软推荐标记，传给引擎实现"再来点"轮换
  const memoryRef = useRef<ChatMemory>({ lastTopic: null, shown: [], crossSold: false });

  const nextId = () => ++idRef.current;

  useEffect(() => () => { timersRef.current.forEach((t) => window.clearTimeout(t)); }, []);

  // 每 60 秒刷新在线状态（跨服务时段自动切换 Online/Offline）
  useEffect(() => {
    if (!open) return;
    setOnline(isServiceOpenNow());
    const t = window.setInterval(() => setOnline(isServiceOpenNow()), 60_000);
    return () => window.clearInterval(t);
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  const startConversation = useCallback(() => {
    setOnline(isServiceOpenNow());
    if (!started) {
      const isOpen = isServiceOpenNow();
      const greeting = aiMode
        ? CONTACT_CONFIG.greetingAi
        : isOpen
          ? CONTACT_CONFIG.greetingOnline
          : CONTACT_CONFIG.greetingOffline;
      setMessages([
        { id: nextId(), from: "bot", text: greeting },
        { id: nextId(), from: "bot", text: CONTACT_CONFIG.askMessage },
      ]);
      setStarted(true);
    }
  }, [started]);

  const pushReplies = useCallback((replies: ChatReply[], next: ChatFlow, chips?: FlowChip[]) => {
    setTyping(true);
    const delay = 450 + Math.min(1100, replies.reduce((n, r) => n + r.text.length, 0) * 6);
    const timer = window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        ...replies.map((r) => ({ id: nextId(), from: "bot" as const, text: r.text, products: r.products })),
      ]);
      for (const r of replies) {
        for (const p of r.products ?? []) {
          if (!memoryRef.current.shown.includes(p.url)) memoryRef.current.shown.push(p.url);
        }
      }
      setFlow(next);
      setFlowChips(next === "idle" ? null : chips ?? null);
    }, delay);
    timersRef.current.push(timer);
  }, []);

  const runScriptEngine = (text: string) => {
    const result = handleUserInput(text, flow, online, memoryRef.current);
    if (result.topic !== undefined) memoryRef.current.lastTopic = result.topic;
    if (result.crossSold) memoryRef.current.crossSold = true;
    pushReplies(result.replies, result.nextFlow, result.chips);
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    setMessages((prev) => [...prev, { id: nextId(), from: "user", text }]);
    setInput("");
    setFlowChips(null);
    setHasReplied(true);
    setTopicsOpen(false);
    // 留言走剧本（本地保存，人工跟进）；其余场景 AI 24/7 接待，失败降级剧本（按真实人工在线状态处理）
    if (!aiMode || text === "Leave a message") {
      runScriptEngine(text);
      return;
    }
    setTyping(true);
    const history = toLlmHistory(messages);
    askShoppingAssistant(text, history)
      .then(({ text: reply, products }) => {
        setTyping(false);
        setMessages((prev) => [...prev, { id: nextId(), from: "bot", text: reply, products }]);
        for (const p of products) {
          if (!memoryRef.current.shown.includes(p.url)) memoryRef.current.shown.push(p.url);
        }
        setFlow("idle");
        setFlowChips(null);
      })
      .catch((err) => {
        console.warn("[chat] LLM 不可用，降级剧本引擎:", err?.message);
        setTyping(false);
        runScriptEngine(text);
      });
  };

  const defaultChips: FlowChip[] = CONTACT_CONFIG.quickReplies.map((q) => ({
    label: q.label,
    value: q.label,
  }));
  const chips: FlowChip[] = typing
    ? []
    : flow !== "idle"
      ? flowChips ?? []
      : !hasReplied || topicsOpen
        ? defaultChips
        : [];

  return (
    <div
      className={`fixed right-4 z-50 flex flex-col items-end ${isPDP ? "bottom-[calc(7rem+env(safe-area-inset-bottom))] md:bottom-6" : "bottom-6"}`}
    >
      {open && (
        <div
          className={`mb-3 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#e8e2d9] ${
            expanded
              ? "w-[min(28rem,calc(100vw-2rem))] h-[min(640px,80vh)]"
              : "w-[min(22rem,calc(100vw-2rem))] h-[min(540px,72vh)]"
          }`}
          role="dialog"
          aria-label="Makimoo live chat"
        >
          {/* 头部：AI 在线状态 + 人工跟进时段 */}
          <div className="bg-[#8B5A2B] text-white px-4 py-3 flex items-center gap-2.5 flex-shrink-0">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${aiMode || online ? "bg-emerald-300" : "bg-white/40"}`} />
            <div className="flex-1 min-w-0">
              <p className="font-bold leading-tight">{CONTACT_CONFIG.brand}</p>
              {aiMode ? (
                <>
                  <p className="text-[11px] text-white/80 truncate">AI assistant · online 24/7</p>
                  <p className="text-[10px] text-white/60 truncate">Staff replies {serviceHoursLabel()}</p>
                </>
              ) : (
                <p className="text-[11px] text-white/80 truncate">
                  {online ? `Online now · ${serviceHoursLabel()}` : "Offline · leave a message"}
                </p>
              )}
            </div>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="hidden md:block p-1.5 rounded-full hover:bg-white/15 transition-colors"
              aria-label="Toggle chat size"
            >
              <ExpandIcon />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/15 transition-colors"
              aria-label="Close chat"
            >
              <CloseIcon />
            </button>
          </div>

          {/* 消息流 */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto bg-[#F8F5F0] px-4 py-4 space-y-3">
            {messages.map((m) => (
              <MsgRow key={m.id} m={m} />
            ))}
            {typing && <TypingRow />}
          </div>

          {/* 快捷回复 */}
          {!typing && chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-3 pt-2.5 bg-white">
              {chips.map((c) => (
                <button
                  key={c.label}
                  onClick={() => send(c.value)}
                  className="rounded-full border border-[#8B5A2B]/40 text-[#8B5A2B] bg-white px-3 py-1.5 text-xs font-medium hover:bg-[#8B5A2B] hover:text-white transition-colors"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {/* 收起后的话题入口 */}
          {!typing && flow === "idle" && hasReplied && (
            <div className="px-3 pt-2 bg-white">
              <button
                onClick={() => setTopicsOpen((v) => !v)}
                className="text-[11px] font-medium text-[#8B5A2B] hover:underline"
                aria-expanded={topicsOpen}
              >
                {topicsOpen ? "Hide topics ▴" : "Quick topics ▾"}
              </button>
            </div>
          )}

          {/* 输入区 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 bg-white px-3 py-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 min-w-0 rounded-full border border-[#ddd] bg-[#faf8f5] px-4 py-2 text-sm focus:outline-none focus:border-[#8B5A2B]"
              aria-label="Message"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="w-9 h-9 flex-shrink-0 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center hover:bg-[#7a4d24] transition-colors"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => {
          if (open) setOpen(false);
          else {
            startConversation();
            setOpen(true);
          }
        }}
        aria-label="Chat with us"
        aria-expanded={open}
        className="w-14 h-14 rounded-full bg-[#8B5A2B] text-white shadow-lg flex items-center justify-center hover:bg-[#7a4d24] transition-colors"
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
}
