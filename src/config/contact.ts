// 客服配置层：服务时间 / 快捷回复 / 人工邮箱 / 线上接口入口。
// 原则：改配置不改 UI——服务时间、话术、快捷回复都在这里调整。
// 时区约定：服务窗口以中国时间（值班同事的时钟）为准；买家侧展示动态换算为美区 CT。

export type ServiceWindow = { start: string; end: string };
export type QuickReply = { intent: string; label: string };

export const CONTACT_CONFIG = {
  brand: "Makimoo",
  agentName: "Mia",
  // AI 导购模式（llm.enabled）下的问候语：全天候在线口径
  greetingAi:
    "Hi! I'm Mia, Makimoo's AI shopping assistant — I'm online 24/7 and know every item in our store. Looking for something cozy for your home?",
  greetingOnline:
    "Hi there! I'm Mia, Makimoo's shopping assistant. Looking for something cozy for your home?",
  greetingOffline:
    "Hi there! Our team is offline right now — leave a message and we'll get back to you by email.",
  askMessage: "What do you need help with today?",
  email: "support@makimoo.com",
  serviceHours: {
    // 语义 = 人工跟进时段（值班同事时钟）。AI 导购不受此限制（24/7）；
    // 该窗口仅用于：前端徽标文案 + LLM 失败降级剧本时的人工在线判断。
    timeZone: "Asia/Shanghai",
    windows: [
      { start: "20:00", end: "01:00" },
      { start: "08:00", end: "12:00" },
    ] as ServiceWindow[],
  },
  quickReplies: [
    { intent: "choose_rug", label: "Help me choose a rug" },
    { intent: "size_guide", label: "What size do I need?" },
    { intent: "material_care", label: "Material & care advice" },
    { intent: "beyond", label: "Beyond rugs — more finds" },
    { intent: "order_support", label: "Shipping & order questions" },
    { intent: "leave_message", label: "Leave a message" },
  ] as QuickReply[],
  // LLM 导购配置：构建时经环境变量注入（NEXT_PUBLIC_* 在打包时内联），两个变量齐全才启用 AI 模式。
  // 任一缺失（如 Vercel 未配置）→ enabled 为 false，ChatWidget 全程走本地剧本引擎，不发任何网络请求。
  // 本地演示：项目根目录 .env.local（已被 .gitignore 忽略）配置两项，指向本地代理 npm run chat-proxy。
  llm: {
    enabled:
      process.env.NEXT_PUBLIC_CHAT_LLM_ENABLED === "true" &&
      !!process.env.NEXT_PUBLIC_CHAT_LLM_BASE_URL,
    baseUrl: process.env.NEXT_PUBLIC_CHAT_LLM_BASE_URL ?? "",
    timeoutMs: 30000,
  },
};

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** 当前是否在服务时间内（按配置时区判断，跨午夜窗口安全） */
export function isServiceOpenNow(): boolean {
  const { timeZone, windows } = CONTACT_CONFIG.serviceHours;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? "0");
  const cur = get("hour") * 60 + get("minute");
  return windows.some(({ start, end }) => {
    const s = toMinutes(start);
    const e = toMinutes(end);
    return s <= e ? cur >= s && cur < e : cur >= s || cur < e;
  });
}

function zoneOffsetMinutes(timeZone: string): number {
  const now = new Date();
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts: Record<string, number> = {};
  for (const p of dtf.formatToParts(now)) {
    if (p.type !== "literal") parts[p.type] = Number(p.value);
  }
  const asUTC = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
  return Math.round((asUTC - now.getTime()) / 60000);
}

/** 服务窗口换算成美区 CT 时段文案（夏令时自动跟随），如 "6am–11am & 6pm–10pm CT" */
export function serviceHoursLabel(): string {
  const offset =
    zoneOffsetMinutes("America/Chicago") - zoneOffsetMinutes(CONTACT_CONFIG.serviceHours.timeZone);
  const fmt = (mins: number): string => {
    const m = ((mins % 1440) + 1440) % 1440;
    let h = Math.floor(m / 60);
    const mm = m % 60;
    const ap = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    return mm ? `${h}:${String(mm).padStart(2, "0")}${ap}` : `${h}${ap}`;
  };
  return (
    CONTACT_CONFIG.serviceHours.windows
      .map(({ start, end }) => `${fmt(toMinutes(start) + offset)}–${fmt(toMinutes(end) + offset)}`)
      .join(" & ") + " CT"
  );
}
