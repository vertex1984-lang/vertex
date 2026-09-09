// 聊天代理 · 配置层：路径 / 端口 / 模型 / 安全参数。改配置只动这个文件。
// 安全约定：API Key 一律放仓库外文件（或环境变量），绝不进 git。
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** headless-store 站点根目录（本文件位于 scripts/chat-proxy/ 下，向上两级） */
export const SITE_ROOT = path.resolve(__dirname, "..", "..");

export const PORT = Number(process.env.CHAT_PROXY_PORT || 8787);
export const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
export const LLM_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

/** Key 文件默认放仓库外（D:\opencode_workspace\secrets\），可用环境变量覆盖 */
export const KEY_FILE =
  process.env.DEEPSEEK_KEY_FILE || "D:\\opencode_workspace\\secrets\\deepseek-key.txt";

export const REQUEST_TIMEOUT_MS = Number(process.env.CHAT_PROXY_TIMEOUT || 30000);

/** 回传给 LLM 的历史轮数上限（轮 = 一问一答） */
export const MAX_HISTORY = 8;
/** 单次回复推荐产品上限 */
export const MAX_RECS = 3;

/** 站点数据文件（目录的唯一数据源 = 网站真实在卖的东西） */
export const DATA_FILES = {
  materials: path.join(SITE_ROOT, "src", "data", "products-materials.ts"),
  shopifyMap: path.join(SITE_ROOT, "src", "data", "shopify-map.ts"),
  shortTitles: path.join(SITE_ROOT, "src", "data", "short-titles.ts"),
  shortBullets: path.join(SITE_ROOT, "src", "data", "materials-short-bullets.ts"),
  specs: path.join(SITE_ROOT, "src", "data", "product-specs.ts"),
  specsOverrides: path.join(SITE_ROOT, "src", "data", "specs-overrides.ts"),
};

export function readApiKey() {
  if (process.env.DEEPSEEK_API_KEY) return process.env.DEEPSEEK_API_KEY.trim();
  if (!existsSync(KEY_FILE)) {
    throw new Error(`API Key 文件不存在: ${KEY_FILE}（或设置环境变量 DEEPSEEK_API_KEY）`);
  }
  const key = readFileSync(KEY_FILE, "utf8").trim();
  if (!key) throw new Error(`API Key 文件为空: ${KEY_FILE}`);
  return key;
}
