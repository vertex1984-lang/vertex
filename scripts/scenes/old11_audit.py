import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(r"E:\Makimoo-Local\vertex")
REPORT = ROOT / "report" / "scenes"
PUBLIC = ROOT / "public"

F_CN_BOLD = "C:/Windows/Fonts/msyhbd.ttc"
F_CN = "C:/Windows/Fonts/msyh.ttc"
F_EN_BOLD = "C:/Windows/Fonts/arialbd.ttf"
F_EN = "C:/Windows/Fonts/arial.ttf"

INK = (31, 41, 55)
MUTED = (107, 114, 128)
RED = (185, 28, 28)
RED_BG = (254, 226, 226)
GREEN = (21, 128, 61)
GREEN_BG = (220, 252, 231)
AMBER = (180, 83, 9)
AMBER_BG = (254, 243, 199)
GREY = (75, 85, 99)
GREY_BG = (229, 231, 235)
CARD = (251, 249, 245)
BORDER = (229, 222, 211)
LOG_BG = (247, 244, 239)
WHITE = (255, 255, 255)


def f(path, size):
    return ImageFont.truetype(path, size)


def textlen(d, text, font):
    return d.textlength(text, font=font)


def truncate(d, text, font, maxw):
    if textlen(d, text, font) <= maxw:
        return text
    while text and textlen(d, text + "…", font) > maxw:
        text = text[:-1]
    return text.rstrip() + "…"


def wrap(d, text, font, maxw, maxlines=3):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        cand = (cur + " " + w).strip()
        if textlen(d, cand, font) <= maxw:
            cur = cand
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    if len(lines) > maxlines:
        lines = lines[:maxlines]
        lines[-1] = truncate(d, lines[-1], font, maxw)
    return lines


def draw_para(d, text, x, y, font, fill, maxw, maxlines=3, lh=None):
    lines = wrap(d, text, font, maxw, maxlines)
    lh = lh or font.size + 5
    for i, line in enumerate(lines):
        d.text((x, y + i * lh), line, font=font, fill=fill)
    return y + len(lines) * lh


def rounded(d, box, r, fill, outline=None, width=1):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


def badge(d, x, y, text, color, bg, w=None):
    w = w or int(textlen(d, text, f(F_CN_BOLD, 14))) + 24
    rounded(d, (x, y, x + w, y + 30), 15, bg)
    d.text((x + 12, y + 5), text, font=f(F_CN_BOLD, 14), fill=color)
    return w


def product_tile(asin, size=170):
    p = PUBLIC / "images" / "products" / asin / "1.webp"
    im = Image.open(p).convert("RGB")
    im.thumbnail((size - 12, size - 12), Image.LANCZOS)
    tile = Image.new("RGB", (size, size), WHITE)
    tile.paste(im, ((size - im.width) // 2, (size - im.height) // 2))
    d = ImageDraw.Draw(tile)
    d.rectangle((0, 0, size - 1, size - 1), outline=BORDER, width=2)
    return tile


def scene_crop(rel, xpct, ypct, side_frac=0.62):
    im = Image.open(PUBLIC / rel).convert("RGB")
    w, h = im.size
    side = int(min(w, h) * side_frac)
    cx, cy = w * xpct / 100, h * ypct / 100
    left = max(0, min(w - side, int(cx - side / 2)))
    top = max(0, min(h - side, int(cy - side / 2)))
    crop = im.crop((left, top, left + side, top + side)).resize((340, 340), Image.LANCZOS)
    rx = (cx - left) / side * 340
    ry = (cy - top) / side * 340
    over = Image.new("RGBA", (340, 340), (0, 0, 0, 0))
    od = ImageDraw.Draw(over)
    od.ellipse((rx - 34, ry - 34, rx + 34, ry + 34), outline=(255, 255, 255, 255), width=6)
    od.ellipse((rx - 26, ry - 26, rx + 26, ry + 26), fill=(220, 38, 38, 42), outline=(220, 38, 38, 255), width=6)
    return Image.alpha_composite(crop.convert("RGBA"), over).convert("RGB")


WRONG_THROW = {
    "asin": "1688-969627065032-C26",
    "title": "Faux Rabbit Fur Throw Blanket, Cream Yellow, 150 x 200cm",
    "price": "$29.99 · In Stock",
}

FIXES = [
    {
        "scene": "slow-morning-bedroom",
        "title": "The Slow Morning Bedroom",
        "style": "Cream",
        "spot": "End of the bed",
        "image": "images/pdp-lifestyle/pillow-boucle-bed.webp",
        "x": 83,
        "y": 84,
        "current": WRONG_THROW,
        "fix": {
            "asin": "KNITTHROW-KHAKI",
            "title": "Openwork Knit Throw Blanket, Khaki",
            "price": "Coming Soon",
            "note": "焦糖/卡其色粗针织，场景同款方向。",
        },
        "log": "Faux Rabbit Cream Yellow → Openwork Knit Khaki · Coming Soon",
    },
    {
        "scene": "sunny-reading-nook",
        "title": "The Sunny Reading Nook",
        "style": "Nordic Airy",
        "spot": "Over the edge",
        "image": "images/pdp-lifestyle/pillow-boucle-nook.webp",
        "x": 88,
        "y": 58,
        "current": WRONG_THROW,
        "fix": {
            "asin": "CHUNKYTHROW-CREAM-127",
            "title": "Chunky Knit Throw Blanket, Cream White, 50 x 68 in",
            "price": "Coming Soon",
            "note": "奶油色粗针织 + 长流苏。",
        },
        "log": "Faux Rabbit Cream Yellow → Chunky Knit Cream · Coming Soon",
    },
    {
        "scene": "sage-sofa-afternoon",
        "title": "A Sage Sofa Afternoon",
        "style": "Soft Sage",
        "spot": "Over the armrest",
        "image": "images/pdp-lifestyle/pillow-boucle-sofa.webp",
        "x": 15,
        "y": 55,
        "current": WRONG_THROW,
        "fix": {
            "asin": "CHUNKYTHROW-OAT-127",
            "title": "Chunky Knit Throw Blanket, Khaki Oat, 50 x 68 in",
            "price": "Coming Soon",
            "note": "按图中偏暖燕麦色选 Oat。",
        },
        "log": "Faux Rabbit Cream Yellow → Chunky Knit Oat · Coming Soon",
    },
    {
        "scene": "cat-nap-bed",
        "title": "The Cat-Nap Bed",
        "style": "Warm Minimal",
        "spot": "Across the bed",
        "image": "images/pdp-lifestyle/pillow-lifestyle-tall.webp",
        "x": 72,
        "y": 78,
        "caption": "原圆点 67,68；红圈在毯子实际位置",
        "current": WRONG_THROW,
        "fix": {
            "asin": "CHUNKYTHROW-CREAM-127",
            "title": "Chunky Knit Throw Blanket, Cream White, 50 x 68 in",
            "price": "Coming Soon",
            "note": "白/奶油色粗针织。",
        },
        "log": "Faux Rabbit Cream Yellow → Chunky Knit Cream · Coming Soon",
    },
    {
        "scene": "corner-cafe-chair",
        "title": "The Corner Café Chair",
        "style": "Vintage Warm",
        "spot": "On the bistro chair",
        "image": "images/pdp-lifestyle/cushion-lifestyle-cafe.webp",
        "x": 73,
        "y": 58,
        "current": {
            "asin": "MK-CUSHION-CORD-CREAM",
            "title": "Corduroy, Tufted, with Ties - 95x45cm, Cream",
            "price": "$39.99 · In Stock",
        },
        "fix": {
            "asin": "B0CBT7RFK2",
            "title": "Corduroy, Tufted, with Ties - 95x45cm, Coffee",
            "price": "$28.99 · In Stock",
            "note": "同款灯芯绒/绑带；目录无焦糖色，Coffee 最接近。",
        },
        "log": "Cushion Cream $39.99 → Cushion Coffee $28.99 · 已上线",
    },
    {
        "scene": "porch-at-dusk",
        "title": "The Porch at Dusk",
        "style": "Tropical Calm",
        "spot": "On the wicker chair",
        "image": "images/pdp-lifestyle/cushion-solids-porch.webp",
        "x": 55,
        "y": 64,
        "current": {
            "asin": "B0CBT7B1TY",
            "title": "Corduroy, Tufted, with Ties - 95x45cm, Blue",
            "price": "$29.99 · In Stock",
        },
        "fix": {
            "asin": "B0GJSTTGY5",
            "title": "Outdoor Cushions, 90 x 45cm - Dark Green",
            "price": "$27.99 · In Stock",
            "note": "户外线，深绿色绗缝形状最接近。",
        },
        "log": "Cushion Blue $29.99 → Outdoor Dark Green $27.99 · 已上线",
    },
    {
        "scene": "coastal-breakfast",
        "title": "Coastal Breakfast",
        "style": "Coastal Blue",
        "spot": "On the dining chair",
        "image": "images/pdp-lifestyle/cushion-solids-coastal.webp",
        "x": 88,
        "y": 58,
        "current": {
            "asin": "MK-CUSHION-CORD-DUSTYBLUE",
            "title": "Corduroy, Tufted, with Ties - 95x45cm, Dusty Blue",
            "price": "$39.99 · In Stock",
        },
        "fix": {
            "asin": "B0F1V8VMP4",
            "title": "Outdoor Cushions, 90 x 45cm - Navy Blue",
            "price": "$35.99 · In Stock",
            "note": "户外线，海军蓝最接近场景。",
        },
        "log": "Cushion Dusty Blue $39.99 → Outdoor Navy $35.99 · 已上线",
    },
]

EXTRA = [
    {
        "title": "The Vinyl Corner",
        "style": "Retro Warm",
        "spot": "Green knit pillow",
        "image": "images/pdp-lifestyle/pillow-lifestyle-wide.webp",
        "x": 76,
        "y": 42,
        "asin": "MK-PC-BOUCLE-SAGE-45",
        "product": "Boucle Pillow Cases, Set of 2, 45 x 45cm - Sage",
        "price": "$19.99 · In Stock",
        "mismatch": "场景为深绿粗针织；站内无绿色针织枕，当前是最接近的绿色款。",
        "result_note": "领导确认视觉可接受，保留不作修改。",
    },
    {
        "title": "The Vinyl Corner",
        "style": "Retro Warm",
        "spot": "Tassel pillow",
        "image": "images/pdp-lifestyle/pillow-lifestyle-wide.webp",
        "x": 40,
        "y": 55,
        "asin": "MK-PC-CTN-CREAM",
        "product": "Cotton-Like Pillow Cases, Set of 2, 40 x 40cm - Cream",
        "price": "$19.99 · In Stock",
        "mismatch": "场景为奶油刺绣 + 流苏枕；站内无同款，素面枕属错误链接。",
        "result_note": "热区已删除：图内不可点、不可加购；后续上架同款可随时恢复。",
    },
]

LOG_ROWS = [
    ("1", "Slow Morning · End of the bed", FIXES[0]["log"]),
    ("2", "Sunny Nook · Over the edge", FIXES[1]["log"]),
    ("3", "Sage Sofa · Over the armrest", FIXES[2]["log"]),
    ("4", "Cat-Nap · Across the bed", FIXES[3]["log"]),
    ("5", "Corner Café · bistro chair", FIXES[4]["log"]),
    ("6", "Porch · wicker chair", FIXES[5]["log"]),
    ("7", "Coastal · dining chair", FIXES[6]["log"]),
    ("8", "Vinyl Corner · Green knit pillow", "Boucle Sage 保留（领导确认 pass，不作修改）"),
    ("9", "Vinyl Corner · Tassel pillow", "素面 Cream 40×40 非同款，热区已删除（图内不可点）"),
    ("10", "其余锚点", "全部核对通过：Come On In · Golden Hour · Florist's Workshop 等"),
]

W = 1560
M = 28
HEADER = 128
SECTION = 46
ROW = 500
LOG_HEAD = 56
LOG_ROW = 34
canvas_h = (
    HEADER
    + SECTION
    + ROW * len(FIXES)
    + SECTION
    + ROW * len(EXTRA)
    + LOG_HEAD
    + LOG_ROW * len(LOG_ROWS)
    + 110
)
canvas = Image.new("RGB", (W, canvas_h), WHITE)
d = ImageDraw.Draw(canvas)

d.text((M, 22), "Shop the Look · 旧 11 场景错配对比 + 修正记录", font=f(F_CN_BOLD, 32), fill=INK)
d.text((M, 68), "2026-10-27 · 7 处错配已全部修正 + 2 条特殊处理，均已构建进本地预览 · 红圈=场景实际位置", font=f(F_CN, 15), fill=MUTED)
badge(d, 1120, 24, "原来", RED, RED_BG)
badge(d, 1210, 24, "已修正", GREEN, GREEN_BG)
badge(d, 1324, 24, "保留 / 已撤", GREY, GREY_BG)
d.text((1454, 28), "7 + 2", font=f(F_EN_BOLD, 20), fill=MUTED)


def section(y, title, sub):
    d.text((M, y + 2), title, font=f(F_CN_BOLD, 24), fill=INK)
    d.text((M, y + 32), sub, font=f(F_CN, 13), fill=MUTED)
    d.line((M, y + SECTION - 8, W - M, y + SECTION - 8), fill=(238, 232, 222), width=1)


def left_block(y, item):
    d.text((M, y + 8), item["title"], font=f(F_EN_BOLD, 20), fill=INK)
    d.text((M, y + 38), f'{item["style"]} · hotspot: {item["spot"]}', font=f(F_EN, 13), fill=MUTED)
    crop = scene_crop(item["image"], item["x"], item["y"])
    canvas.paste(crop, (M, y + 64))
    caption = item.get("caption", f'圆点坐标 {item["x"]}% , {item["y"]}%')
    d.text((M, y + 414), caption, font=f(F_CN, 12), fill=MUTED)


def product_block(y, x, w, asin, title, price, badge_text, color, bg, price_color, tail=None):
    rounded(d, (x - 12, y + 4, x + w + 12, y + 452), 14, CARD, BORDER, 1)
    badge(d, x, y + 16, badge_text, color, bg)
    canvas.paste(product_tile(asin, 170), (x + (w - 170) // 2 if w > 400 else x + 80, y + 58))
    ty = y + 240
    ty = draw_para(d, title, x, ty, f(F_EN_BOLD, 14), INK, w, 3, 18)
    d.text((x, ty + 4), price, font=f(F_EN_BOLD, 13), fill=price_color)
    if tail:
        d.text((x, ty + 28), tail, font=f(F_CN, 12), fill=MUTED)


y = HEADER
section(y, "A · 7 处错配 → 已全部修正", "左侧为场景原位（红圈），中为原错误产品，右为修正后线上产品")
y += SECTION

for item in FIXES:
    left_block(y, item)
    product_block(y, 480, 330, item["current"]["asin"], item["current"]["title"], item["current"]["price"], "原来", RED, RED_BG, RED, "已替换")
    d.text((826, y + 210), "→", font=f(F_EN_BOLD, 46), fill=(156, 163, 175))
    product_block(y, 880, 470, item["fix"]["asin"], item["fix"]["title"], item["fix"]["price"], "已修正", GREEN, GREEN_BG, GREEN)
    draw_para(d, item["fix"]["note"], 880, y + 352, f(F_CN, 12), MUTED, 470, 2, 18)
    d.line((M, y + ROW - 8, W - M, y + ROW - 8), fill=(238, 232, 222), width=1)
    y += ROW

section(y, "B · Vinyl Corner 特殊处理 2 条（保留 / 撤热区）", "经确认：绿色针织枕 pass 保留；奶油流苏枕无同款，热区已撤")
y += SECTION

for item in EXTRA:
    left_block(y, item)
    product_block(y, 480, 330, item["asin"], item["product"], item["price"], "现在（站内）", AMBER, (254, 243, 199), AMBER)
    d.text((826, y + 210), "→", font=f(F_EN_BOLD, 46), fill=(156, 163, 175))
    x = 880
    rounded(d, (x - 12, y + 4, x + 492, y + 452), 14, CARD, BORDER, 1)
    if item is EXTRA[0]:
        badge(d, x, y + 16, "结论：pass · 保留", GREEN, GREEN_BG)
        canvas.paste(product_tile(item["asin"], 170), (x + 150, y + 58))
        d.ellipse((x + 360, y + 80, x + 440, y + 160), outline=GREEN, width=8)
        d.line((x + 378, y + 122, x + 396, y + 142), fill=GREEN, width=8)
        d.line((x + 396, y + 142, x + 426, y + 98), fill=GREEN, width=8)
        ty = y + 240
        d.text((x, ty), "保留现状", font=f(F_CN_BOLD, 16), fill=GREEN)
        draw_para(d, item["mismatch"], x, ty + 30, f(F_CN, 12), MUTED, 470, 2, 18)
        draw_para(d, item["result_note"], x, ty + 70, f(F_CN, 12), INK, 470, 2, 18)
    else:
        badge(d, x, y + 16, "结论：热区已撤", GREY, GREY_BG)
        rounded(d, (x + 150, y + 58, x + 320, y + 228), 12, (247, 247, 247), BORDER, 2)
        d.line((x + 200, y + 108, x + 270, y + 178), fill=GREY, width=8)
        d.line((x + 270, y + 108, x + 200, y + 178), fill=GREY, width=8)
        ty = y + 240
        d.text((x, ty), "删除链接", font=f(F_CN_BOLD, 16), fill=GREY)
        draw_para(d, item["mismatch"], x, ty + 30, f(F_CN, 12), MUTED, 470, 2, 18)
        draw_para(d, item["result_note"], x, ty + 70, f(F_CN, 12), INK, 470, 2, 18)
    d.line((M, y + ROW - 8, W - M, y + ROW - 8), fill=(238, 232, 222), width=1)
    y += ROW

d.text((M, y + 2), "修正记录 · 2026-10-27（改动已构建进本地预览）", font=f(F_CN_BOLD, 24), fill=INK)
d.line((M, y + LOG_HEAD - 10, W - M, y + LOG_HEAD - 10), fill=(238, 232, 222), width=1)
y += LOG_HEAD
rounded(d, (M, y, W - M, y + LOG_ROW * len(LOG_ROWS) + 16), 12, LOG_BG, BORDER, 1)
ry = y + 8
for num, where, what in LOG_ROWS:
    d.text((M + 14, ry + 8), num, font=f(F_EN_BOLD, 13), fill=GREEN)
    d.text((M + 40, ry + 8), where, font=f(F_CN_BOLD, 13), fill=INK)
    d.text((M + 430, ry + 8), what, font=f(F_CN, 13), fill=INK)
    ry += LOG_ROW
y += LOG_ROW * len(LOG_ROWS) + 16

fy = y + 12
d.text((M, fy), "毛毯 4 处新链接均为 Coming Soon（站内暂无 Shopify 变体），场景组合价相应显示 2/3 可加购 $39.98；坐垫 3 处均在售。", font=f(F_CN, 12), fill=INK)
d.text((M, fy + 24), "完整新旧 PDP 链接见 report/scenes/old11-audit.md · 预览 http://localhost:3000/scenes/", font=f(F_CN, 12), fill=MUTED)

out = REPORT / "old11-audit.jpg"
canvas.save(out, quality=90)
print(out)

index = {p["asin"]: p for p in json.loads((REPORT / "product-index.json").read_text(encoding="utf-8-sig"))}


def link(asin):
    return "/products/" + index.get(asin, {}).get("handle", asin) + "/"


md = ["# 旧 11 场景错配对比 + 修正记录（2026-10-27 已全部处理）", ""]
md.append("## A. 已修正的 7 处")
md.append("| # | 场景 | 锚点 | 原来（错） | 修正后（已上线） |")
md.append("|---|---|---|---|---|")
for i, item in enumerate(FIXES, 1):
    cur = item["current"]
    fix = item["fix"]
    md.append(
        f'| {i} | {item["title"]} (`{item["scene"]}`) | {item["spot"]} | '
        f'[{cur["title"]}]({link(cur["asin"])}) · {cur["price"]} | '
        f'[{fix["title"]}]({link(fix["asin"])}) · {fix["price"]} |'
    )
md += [
    "",
    "## B. Vinyl Corner 特殊处理 2 条",
    "",
    f'1. **Green knit pillow** — 保留 [{EXTRA[0]["product"]}]({link(EXTRA[0]["asin"])})。{EXTRA[0]["mismatch"]}{EXTRA[0]["result_note"]}',
    f'2. **Tassel pillow** — 原链接 [{EXTRA[1]["product"]}]({link(EXTRA[1]["asin"])}) 已删除。{EXTRA[1]["mismatch"]}{EXTRA[1]["result_note"]}',
    "",
    "## 修正记录",
    "",
]
for num, where, what in LOG_ROWS:
    md.append(f"{num}. **{where}** — {what}")
md += [
    "",
    "说明：",
    "- 4 条毛毯新链接均为 Coming Soon（无 Shopify 变体），场景组合价显示 2/3 可加购 $39.98。",
    "- 3 条坐垫均在售；Coffee/Dark Green/Navy 为户外线产品，颜色/形状最接近场景。",
    "- 其余场景与锚点核对通过：Come On In / The Golden Hour Corner / The Florist's Workshop。",
    "- 对照图：`report/scenes/old11-audit.jpg`；本轮改动已构建进本地预览，未提交。",
]
(REPORT / "old11-audit.md").write_text("\n".join(md) + "\n", encoding="utf-8")
print(REPORT / "old11-audit.md")
