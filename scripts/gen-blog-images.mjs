/**
 * Blog 主题图批量生成（CogView）
 *
 * 用法：node scripts/gen-blog-images.mjs
 * Key 约定与 chat-proxy 一致：仓库外文件 D:\opencode_workspace\secrets\zhipu-key.txt
 * 或环境变量 ZHIPU_API_KEY
 *
 * 输出：public/images/blog/raw/<name>.jpg（原始 1024/1440 宽图，未压缩）
 * 产物不进 git（raw/ 已在 .gitignore 声明，见仓库根 .gitignore）
 */
import { existsSync, readFileSync, mkdirSync, writeFileSync, appendFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "images", "blog", "raw");
const LOG = path.join(OUT_DIR, "gen.log");

const KEY_FILE = process.env.ZHIPU_KEY_FILE || "D:\\opencode_workspace\\secrets\\zhipu-key.txt";
const MODEL = process.env.COGVIEW_MODEL || "cogview-3-flash";
const BASE_URL = process.env.ZHIPU_BASE_URL || "https://open.bigmodel.cn/api/paas/v4";

function readKey() {
  if (process.env.ZHIPU_API_KEY) return process.env.ZHIPU_API_KEY.trim();
  if (existsSync(KEY_FILE)) return readFileSync(KEY_FILE, "utf8").trim();
  throw new Error(`No API key: set ZHIPU_API_KEY or create ${KEY_FILE}`);
}

/** 统一风格前缀：锁死整组图的调性 */
const STYLE =
  "Warm editorial interior photography for a premium home goods brand blog. " +
  "Soft natural window light, cream ivory and caramel brown palette, cozy minimalist styling, " +
  "photorealistic, high detail, shallow depth of field, high-end magazine quality. " +
  "No text, no watermark, no people, no logo.";

const IMAGES = [
  { name: "photo-hero", size: "1440x720", prompt: `Wide cozy living room with a plush cream area rug under a beige sofa, warm afternoon light across the floor, neutral textured cushions on the sofa. ${STYLE}` },
  { name: "photo-rug-materials", size: "1024x1024", prompt: `Extreme close-up macro of a plush faux rabbit fur rug in soft off-white, long fluffy fibers catching gentle light, deep soft pile texture filling the frame. ${STYLE}` },
  { name: "photo-rug-size-guide", size: "1024x1024", prompt: `Bright living room seen from standing height: a large low-pile area rug under the front legs of a beige sofa and a wooden coffee table, generous bare floor visible around the rug edges. ${STYLE}` },
  { name: "photo-cushion-materials", size: "1024x1024", prompt: `Close-up of a tufted dining chair seat cushion in warm caramel corduroy fabric, deep button tufting and soft plump fill, resting on a wooden chair, macro fabric texture detail. ${STYLE}` },
  { name: "photo-cushion-size-guide", size: "1024x1024", prompt: `A single wooden dining chair with a square taupe seat pad tied to it, photographed straight-on in a bright minimal dining room, warm wood floor. ${STYLE}` },
  { name: "photo-pillow-filling", size: "1024x1024", prompt: `Stack of plump white bed pillows with embossed microfiber shells on a neatly made bed, soft morning light, airy cream bedding, gentle shadows showing fullness of the fill. ${STYLE}` },
  { name: "photo-door-mats-101", size: "1024x1024", prompt: `A woven loop-pile entrance doormat in warm camel brown lying on a clean tiled floor in front of a wooden front door, soft daylight from the doorway. ${STYLE}` },
  { name: "photo-low-pile-vs-shag", size: "1024x1024", prompt: `Two rugs side by side on a warm wooden floor: one flat-woven low-pile printed rug and one deep fluffy shag rug, clear contrast between the low flat surface and the tall soft fibers. ${STYLE}` },
  { name: "photo-clean-soft-rug", size: "1024x1024", prompt: `A vacuum cleaner head gliding over a plush off-white shag rug leaving a clean swept path through the fluffy fibers, bright room, no people visible. ${STYLE}` },
  { name: "photo-persian-styling", size: "1024x1024", prompt: `A vintage faded persian style rug with navy and rust medallion pattern anchoring a modern minimalist living room, cream linen sofa, warm oak floor, styled with a brass lamp. ${STYLE}` },
  { name: "photo-nursery-rugs", size: "1024x1024", prompt: `Soft nursery corner with a round fluffy ivory rug on warm wooden floor beside a light wooden crib, sheer curtains diffusing morning light, a small knitted toy on the rug. ${STYLE}` },
];

const KEY = readKey();

async function genOne({ name, size, prompt }) {
  const res = await fetch(`${BASE_URL}/images/generations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, prompt, size }),
    signal: AbortSignal.timeout(120000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  const url = json?.data?.[0]?.url;
  if (!url) throw new Error(`no url in response: ${JSON.stringify(json).slice(0, 200)}`);
  const img = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!img.ok) throw new Error(`download HTTP ${img.status}`);
  const buf = Buffer.from(await img.arrayBuffer());
  writeFileSync(path.join(OUT_DIR, `${name}.jpg`), buf);
  return buf.length;
}

mkdirSync(OUT_DIR, { recursive: true });

// 断点续跑：已存在且 >10KB 的跳过（重跑不重复扣费）
const only = process.argv[2]; // 可传单个 name 只跑一张
for (const it of IMAGES) {
  if (only && it.name !== only) continue;
  const dest = path.join(OUT_DIR, `${it.name}.jpg`);
  if (existsSync(dest) && readFileSync(dest).length > 10240) {
    console.log(`skip  ${it.name} (exists)`);
    continue;
  }
  const t0 = Date.now();
  try {
    const bytes = await genOne(it);
    const line = `ok    ${it.name} ${(bytes / 1024).toFixed(0)}KB ${(Date.now() - t0) / 1000}s`;
    console.log(line);
    appendFileSync(LOG, line + "\n");
  } catch (e) {
    const line = `FAIL  ${it.name}: ${e.message}`;
    console.error(line);
    appendFileSync(LOG, line + "\n");
    process.exitCode = 1;
  }
}
