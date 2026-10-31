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
CARD = (250, 247, 242)
BORDER = (229, 222, 211)
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
    lh = lh or font.size + 5
    for i, line in enumerate(wrap(d, text, font, maxw, maxlines)):
        d.text((x, y + i * lh), line, font=font, fill=fill)
    return y + len(wrap(d, text, font, maxw, maxlines)) * lh


def rounded(d, box, r, fill, outline=None, width=1):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


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


# ---------------------------------------------------------------- mismatch audit
MISMATCHES = [
    {
        "slug": "slow-morning-bedroom",
        "title": "The Slow Morning Bedroom",
        "style": "Cream",
        "hotspot": "End of the bed",
        "image": "images/pdp-lifestyle/pillow-boucle-bed.webp",
        "x": 83,
        "y": 84,
        "correct": {
            "asin": "KNITTHROW-KHAKI",
            "title": "Openwork Knit Throw Blanket, Khaki",
            "status": "Coming Soon",
            "handle": "makimoo-openwork-knit-throw-blanket-with-tassels-50-x-71-in-khaki",
            "note": "图中是焦糖/卡其色粗针织，不是奶油黄绒毯。",
        },
    },
    {
        "slug": "sunny-reading-nook",
        "title": "The Sunny Reading Nook",
        "style": "Nordic Airy",
        "hotspot": "Over the edge",
        "image": "images/pdp-lifestyle/pillow-boucle-nook.webp",
        "x": 88,
        "y": 58,
        "correct": {
            "asin": "CHUNKYTHROW-CREAM-127",
            "title": "Chunky Knit Throw Blanket, Cream White, 50 x 68 in",
            "status": "Coming Soon",
            "handle": "makimoo-chunky-knit-throw-blanket-with-tassels-50-x-68-in-cream",
            "note": "奶油色粗针织 + 长流苏，已按你确认改 Cream。",
        },
    },
    {
        "slug": "sage-sofa-afternoon",
        "title": "A Sage Sofa Afternoon",
        "style": "Soft Sage",
        "hotspot": "Over the armrest",
        "image": "images/pdp-lifestyle/pillow-boucle-sofa.webp",
        "x": 15,
        "y": 55,
        "correct": {
            "asin": "CHUNKYTHROW-OAT-127",
            "title": "Chunky Knit Throw Blanket, Khaki Oat, 50 x 68 in",
            "status": "Coming Soon",
            "handle": "makimoo-chunky-knit-throw-blanket-with-tassels-50-x-68-in-oat",
            "note": "按图中偏暖的燕麦色判断选 Oat；要统一 Cream 可改。",
        },
    },
    {
        "slug": "cat-nap-bed",
        "title": "The Cat-Nap Bed",
        "style": "Warm Minimal",
        "hotspot": "Across the bed",
        "image": "images/pdp-lifestyle/pillow-lifestyle-tall.webp",
        "x": 67,
        "y": 68,
        "ring_x": 72,
        "ring_y": 78,
        "ring_note": "原圆点 67% , 68%；红圈标在毯子实际位置",
        "correct": {
            "asin": "CHUNKYTHROW-CREAM-127",
            "title": "Chunky Knit Throw Blanket, Cream White, 50 x 68 in",
            "status": "Coming Soon",
            "handle": "makimoo-chunky-knit-throw-blanket-with-tassels-50-x-68-in-cream",
            "note": "白/奶油色粗针织，按图判断选 Cream。",
        },
    },
]

WRONG = {
    "asin": "1688-969627065032-C26",
    "title": "Faux Rabbit Fur Throw Blanket, Cream Yellow, 150 x 200cm",
    "status": "$29.99 · In Stock",
    "handle": "luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c26",
}

W, ROW = 1500, 510
HEAD = 118
canvas = Image.new("RGB", (W, HEAD + ROW * len(MISMATCHES) + 96), WHITE)
d = ImageDraw.Draw(canvas)

d.text((28, 22), "Shop the Look · 旧场景热区错配清单", font=f(F_CN_BOLD, 32), fill=INK)
d.text((28, 68), "2026-10-27 · 仅记录，不改代码 · 圆点为错配位置", font=f(F_CN, 15), fill=MUTED)
rounded(d, (1160, 26, 1250, 58), 16, RED_BG)
d.text((1174, 32), "现在（错）", font=f(F_CN_BOLD, 14), fill=RED)
rounded(d, (1270, 26, 1360, 58), 16, GREEN_BG)
d.text((1284, 32), "应为（对）", font=f(F_CN_BOLD, 14), fill=GREEN)
d.text((1374, 32), "×4", font=f(F_EN_BOLD, 22), fill=MUTED)

y = HEAD
for row in MISMATCHES:
    x0 = 28
    d.text((x0, y + 4), row["title"], font=f(F_EN_BOLD, 21), fill=INK)
    d.text((x0, y + 36), f'{row["style"]} · hotspot: {row["hotspot"]}', font=f(F_CN, 13), fill=MUTED)
    crop = scene_crop(row["image"], row.get("ring_x", row["x"]), row.get("ring_y", row["y"]))
    canvas.paste(crop, (x0, y + 64))
    caption = f'圆点坐标 {row["x"]}% , {row["y"]}%'
    if row.get("ring_note"):
        caption = row["ring_note"]
    d.text((x0, y + 412), caption, font=f(F_CN, 12), fill=MUTED)

    # wrong
    wx = 480
    rounded(d, (wx, y + 8, wx + 112, y + 38), 15, RED_BG)
    d.text((wx + 12, y + 13), "现在（错）", font=f(F_CN_BOLD, 14), fill=RED)
    canvas.paste(product_tile(WRONG["asin"], 170), (wx + 80, y + 50))
    ty = y + 232
    ty = draw_para(d, WRONG["title"], wx, ty, f(F_EN_BOLD, 14), INK, 330, 3, 18)
    d.text((wx, ty + 4), WRONG["status"], font=f(F_EN_BOLD, 13), fill=RED)
    d.text((wx, ty + 26), "PDP …/" + WRONG["handle"][-34:], font=f(F_EN, 10), fill=MUTED)

    d.text((818, y + 210), "→", font=f(F_EN_BOLD, 46), fill=(156, 163, 175))

    # correct
    cx = 880
    rounded(d, (cx, y + 8, cx + 112, y + 38), 15, GREEN_BG)
    d.text((cx + 12, y + 13), "应为（对）", font=f(F_CN_BOLD, 14), fill=GREEN)
    correct = row["correct"]
    canvas.paste(product_tile(correct["asin"], 170), (cx + 125, y + 50))
    ty = y + 232
    ty = draw_para(d, correct["title"], cx, ty, f(F_EN_BOLD, 14), INK, 410, 3, 18)
    d.text((cx, ty + 4), correct["status"], font=f(F_EN_BOLD, 13), fill=AMBER)
    d.text((cx, ty + 26), "PDP …/" + correct["handle"][-34:], font=f(F_EN, 10), fill=MUTED)
    draw_para(d, correct["note"], cx, ty + 48, f(F_CN, 12), MUTED, 410, 2, 18)

    d.line((28, y + ROW - 8, W - 28, y + ROW - 8), fill=(238, 232, 222), width=1)
    y += ROW

fy = HEAD + ROW * len(MISMATCHES) + 4
d.text((28, fy + 10), "说明：这 4 处本轮不修改，只记录；5 张试点已排在 /scenes/ 最前，映射见 pilot-mapping.jpg。", font=f(F_CN, 13), fill=INK)
d.text((28, fy + 36), "完整 PDP 链接与影响说明见 mismatch-audit.md；预览 http://localhost:3000/scenes/", font=f(F_CN, 12), fill=MUTED)

out = REPORT / "mismatch-audit.jpg"
canvas.save(out, quality=90)
print(out)

# ---------------------------------------------------------------- pilot mapping
pilot = json.loads((REPORT / "pilot-matches.json").read_text(encoding="utf-8"))
pindex = {p["asin"]: p for p in json.loads((REPORT / "product-index.json").read_text(encoding="utf-8"))}
PW = 1500
HEADP = 118
margin = 28
scene_w = 360
card_w = 330
card_h = 300
gap = 18
cards_x = margin + scene_w + 24
row_heights = []
rows = []
for sc in pilot:
    stem = Path(sc["scene"]).stem[:8]
    overlay = REPORT / f"overlay-{stem}.jpg"
    im = Image.open(overlay).convert("RGB")
    ratio = im.height / im.width
    disp_w = scene_w
    disp_h = int(scene_w * ratio)
    max_h = 440
    if disp_h > max_h:
        disp_h = max_h
        disp_w = int(max_h / ratio)
    scene_card_h = max(disp_h + 50, 230)
    row_h = max(scene_card_h, card_h) + 30
    row_heights.append(row_h)
    rows.append((sc, im, disp_w, disp_h, scene_card_h, row_h))

canvas2 = Image.new("RGB", (PW, HEADP + sum(row_heights) + 90), WHITE)
d2 = ImageDraw.Draw(canvas2)
d2.text((margin, 22), "Shop the Look · 5 张试点热区映射", font=f(F_CN_BOLD, 32), fill=INK)
d2.text((margin, 68), "2026-10-27 · 每张 3 个锚点 · 绿=High，橙=Medium · 点击圆点即弹同款", font=f(F_CN, 15), fill=MUTED)
d2.text((1160, 28), "Coming Soon = 暂无 Shopify 变体", font=f(F_CN, 12), fill=MUTED)

y = HEADP
for sc, im, dw, dh, sch, rh in rows:
    scene_y = y + (rh - sch) // 2
    rounded(d2, (margin, scene_y, margin + scene_w, scene_y + sch), 14, CARD, BORDER, 2)
    im2 = im.resize((dw, dh), Image.LANCZOS)
    canvas2.paste(im2, (margin + (scene_w - dw) // 2, scene_y + 14))
    d2.text((margin + 14, scene_y + 18 + dh), sc["slug"], font=f(F_EN, 11), fill=MUTED)

    for i, it in enumerate(sc["items"]):
        cx = cards_x + i * (card_w + gap)
        cy = y + (rh - card_h) // 2
        rounded(d2, (cx, cy, cx + card_w, cy + card_h), 14, WHITE, BORDER, 2)
        d2.ellipse((cx + 14, cy + 14, cx + 38, cy + 38), fill=INK)
        d2.text((cx + 21, cy + 17), f'{i + 1}', font=f(F_EN_BOLD, 14), fill=WHITE)
        draw_para(d2, it["title"], cx + 46, cy + 14, f(F_EN_BOLD, 12), INK, 270, 3, 16)

        tile = product_tile(it["asin"], 128)
        canvas2.paste(tile, (cx + 14, cy + 76))

        tx = cx + 154
        status_color = GREEN if "in stock" in it["price"] else AMBER
        d2.text((tx, cy + 80), it["price"], font=f(F_EN_BOLD, 12), fill=status_color)
        conf_color = GREEN if it["conf"] == "High" else AMBER
        d2.text((tx, cy + 102), f'{it["conf"]} confidence', font=f(F_EN_BOLD, 11), fill=conf_color)
        d2.text((tx, cy + 120), it["asin"], font=f(F_EN, 9), fill=MUTED)

        handle = pindex.get(it["asin"], {}).get("handle", "")
        d2.text((cx + 14, cy + 210), "PDP  …/" + handle[-33:], font=f(F_EN, 8), fill=MUTED)
        draw_para(d2, it["note"], cx + 14, cy + 232, f(F_EN, 9), MUTED, 300, 2, 12)

    d2.line((margin, y + rh - 6, PW - margin, y + rh - 6), fill=(238, 232, 222), width=1)
    y += rh

fy = HEADP + sum(row_heights) + 2
d2.text((margin, fy + 8), "完整 PDP 链接见 report/scenes/pilot-matching.md；预览 http://localhost:3000/scenes/", font=f(F_CN, 12), fill=MUTED)
out2 = REPORT / "pilot-mapping.jpg"
canvas2.save(out2, quality=90)
print(out2)

# ---------------------------------------------------------------- markdown index
md = ["# 旧场景热区错配清单（2026-10-27 已全部修正）", ""]
md.append("> **更新**：下表 4 处毛毯已于 2026-10-27 全部修正并构建进本地预览，详见 `old11-audit.md` / `old11-audit.jpg`。下表保留作原始排查记录。")
md.append("")
md.append("| # | 场景 | 热区 | 现在（错） | 应为（对） | 影响 |")
md.append("|---|---|---|---|---|---|")
for i, row in enumerate(MISMATCHES, 1):
    c = row["correct"]
    md.append(
        f'| {i} | {row["title"]} (`{row["slug"]}`) | {row["hotspot"]} | '
        f'[Faux Rabbit Fur, Cream Yellow, 150 x 200cm](/products/{WRONG["handle"]}/) · $29.99 · 可加购 | '
        f'[{c["title"]}](/products/{c["handle"]}/) · {c["status"]} | '
        f'毯子变 Coming Soon；组合价显示 From，Add All 只加可购商品 |'
    )
md += [
    "",
    "说明：",
    "- 4 处旧场景**本轮不改**，仅记录。",
    "- Sage Sofa 的「应为」按图片色温判断为 Chunky Oat；若要和 Sunny Nook 统一为 Cream，告诉我再改。",
    "- 5 张试点已排在 `/scenes/` 最前，试点映射图：`report/scenes/pilot-mapping.jpg`，明细：`report/scenes/pilot-matching.md`。",
    "- 预览：<http://localhost:3000/scenes/>",
]
(REPORT / "mismatch-audit.md").write_text("\n".join(md) + "\n", encoding="utf-8")
print(REPORT / "mismatch-audit.md")
