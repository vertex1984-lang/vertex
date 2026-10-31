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
GREEN = (21, 128, 61)
AMBER = (180, 83, 9)
RED = (178, 34, 52)
CARD = (251, 249, 245)
BORDER = (229, 222, 211)
WHITE = (255, 255, 255)


def f(path, size):
    return ImageFont.truetype(path, size)


def truncate(d, text, font, maxw):
    if d.textlength(text, font=font) <= maxw:
        return text
    while text and d.textlength(text + "…", font=font) > maxw:
        text = text[:-1]
    return text.rstrip() + "…"


def product_tile(asin, size=120):
    p = PUBLIC / "images" / "products" / asin / "1.webp"
    im = Image.open(p).convert("RGB")
    im.thumbnail((size - 8, size - 8), Image.LANCZOS)
    tile = Image.new("RGB", (size, size), WHITE)
    tile.paste(im, ((size - im.width) // 2, (size - im.height) // 2))
    dd = ImageDraw.Draw(tile)
    dd.rectangle((0, 0, size - 1, size - 1), outline=BORDER, width=2)
    return tile


def empty_tile(size=120):
    tile = Image.new("RGB", (size, size), (247, 245, 241))
    dd = ImageDraw.Draw(tile)
    dd.rectangle((0, 0, size - 1, size - 1), outline=BORDER, width=2)
    dd.line((12, 12, size - 12, size - 12), fill=BORDER, width=3)
    dd.line((size - 12, 12, 12, size - 12), fill=BORDER, width=3)
    return tile


OLD_RUG = {
    "asin": "1688-595229918569-C2",
    "title": "Plush Faux Rabbit Fur Area Rug, 160x200cm, Off White",
    "price": "$199.00 · in stock",
}

ROWS = [
    {
        "slug": "yacht-taupe-cabin", "stem": "4ca336fa", "tag": "7-2",
        "old": {"asin": "1688-969627065032-C28", "title": "Faux Rabbit Fur Throw Blanket, Cream Yellow, 180 x 200cm", "price": "$29.99 · in stock"},
        "new": {"asin": "1688-595229918569", "title": "Ultra Soft Faux Rabbit Fur Area Rug, 160x200cm, Light Camel", "price": "$199.00 · in stock"},
        "note": "颜色识别错（黄毯）→ 换浅驼兔毛地毯，热区精调",
        "old_mark": (24, 48),
    },
    {
        "slug": "stone-bath-grey", "stem": "54dcde18", "tag": "8-2",
        "old": None,
        "new": {"asin": "1688-1016436401519", "title": "Imitation Sisal Non-Slip Cut-to-Fit Door Mats, Set of 2", "price": "$19.99 · in stock"},
        "note": "新增浴室垫：仿剑麻可水洗 + 防滑抓瓷砖（材质已验证，文案定位玄关）",
    },
    {
        "slug": "lilac-window-seat", "stem": "5bc8d28d", "tag": "9-1",
        "old": {"asin": "BEDSET4-LILAC-QUEEN", "title": "Linen-Like 4-Piece Bedding Set, Lilac Floral", "price": "$34.99 · in stock"},
        "new": {"asin": "1688-969627065032-C43", "title": "Faux Rabbit Fur Throw Blanket, Purple, 180 x 200cm", "price": "$29.99 · in stock"},
        "note": "场景是沙发（无沙发罩产品）→ 锚到丁香盖毯，热区重定位（55,60 → 64,70）",
        "old_mark": (55, 60),
    },
    {
        "slug": "palace-ivory-suite", "stem": "624ad901", "tag": "10-2",
        "old": None,
        "new": {"asin": "1688-1052742241013-C24", "title": "Faux Cashmere Persian Area Rug, BS-12, 180 x 250cm", "price": "$65.99 · in stock"},
        "note": "BS-12 与场景地毯纹理吻合 → 新增锚点",
    },
    {
        "slug": "palace-ivory-suite", "stem": "624ad901", "tag": "10-3",
        "old": None,
        "new": {"asin": "MK-PC-CORD-OLIVE-45", "title": "Corduroy Pillow Cases, Set of 2, 45x45cm, Olive", "price": "$19.99 · in stock"},
        "note": "墨绿枕补锚点（橄榄灯芯绒最近似）",
    },
]

W = 1500
HEAD = 118
MARGIN = 28
THUMB_W = 250
CARD_W = 296
CARD_H = 176
ARROW_W = 56

rows_prepared = []
for r in ROWS:
    im = Image.open(REPORT / f"overlay-{r['stem']}.jpg").convert("RGB")
    ratio = im.height / im.width
    th = int(THUMB_W * ratio)
    rows_prepared.append((r, im, th))

cards_x = MARGIN + THUMB_W + 22
note_x = cards_x + CARD_W + ARROW_W + CARD_W + 22
canvas_h = HEAD + sum(max(th, CARD_H + 24) + 26 for _, _, th in rows_prepared) + 64
canvas = Image.new("RGB", (W, canvas_h), WHITE)
d = ImageDraw.Draw(canvas)

d.text((MARGIN, 22), "Shop the Look · 第 4 批修订图（人工审核后修正）", font=f(F_CN_BOLD, 32), fill=INK)
d.text((MARGIN, 70), "2026-10-29 · 2 处替换 + 3 个新增锚点（含 1 处删除原床品锚），覆盖 4 张场景 · 修订后总图见 batch4-mapping.jpg", font=f(F_CN, 15), fill=MUTED)

y = HEAD
for r, im, th in rows_prepared:
    row_h = max(th, CARD_H + 24) + 26
    ty = y + (row_h - th) // 2
    im2 = im.resize((THUMB_W, th), Image.LANCZOS)
    canvas.paste(im2, (MARGIN, ty))
    dd = ImageDraw.Draw(canvas)
    dd.rectangle((MARGIN, ty, MARGIN + THUMB_W - 1, ty + th - 1), outline=BORDER, width=2)
    if "old_mark" in r:
        ox = MARGIN + THUMB_W * r["old_mark"][0] / 100
        oy = ty + th * r["old_mark"][1] / 100
        rr = 13
        dd.ellipse((ox - rr, oy - rr, ox + rr, oy + rr), outline=RED, width=3)
        xx = f(F_EN_BOLD, 15)
        dd.text((ox - 5, oy - 9), "×", font=xx, fill=RED)
    dd.text((MARGIN + 4, ty + th + 3), f"{r['slug']}", font=f(F_EN, 11), fill=MUTED)

    cy = y + (row_h - CARD_H) // 2

    def draw_card(x, data, kind):
        dd2 = ImageDraw.Draw(canvas)
        edge = RED if kind in ("old", "del") else GREEN
        dd2.rounded_rectangle((x, cy, x + CARD_W, cy + CARD_H), 12, WHITE, edge, 2)
        badge = {"old": "原", "new": "修", "add": "增", "del": "删"}[kind]
        bw = 30
        dd2.ellipse((x + 12, cy + 12, x + 12 + bw, cy + 12 + bw), fill=edge)
        dd2.text((x + 12 + 8, cy + 12 + 5), badge, font=f(F_CN_BOLD, 15), fill=WHITE)
        if not data:
            dd2.rounded_rectangle((x, cy, x + CARD_W, cy + CARD_H), 12, (247, 245, 241), GREEN, 2)
            dd2.text((x + 52, cy + 17), f"锚点 {r['tag']} · 原无", font=f(F_CN_BOLD, 13), fill=GREEN)
            dd2.text((x + 14, cy + 76), "该位置原本没有锚点", font=f(F_CN, 14), fill=MUTED)
            dd2.text((x + 14, cy + 100), "本轮人工审核后新增", font=f(F_CN, 14), fill=MUTED)
            return
        label = {
            "old": f"锚点 {r['tag']} · 原",
            "new": f"锚点 {r['tag']} · 修正后",
        }[kind]
        dd2.text((x + 52, cy + 17), label, font=f(F_CN_BOLD, 13), fill=edge)
        tile = product_tile(data["asin"])
        canvas.paste(tile, (x + 14, cy + 44))
        tx = x + 144
        dd2.text((tx, cy + 46), truncate(dd2, data["title"], f(F_EN_BOLD, 12), CARD_W - 158), font=f(F_EN_BOLD, 12), fill=INK)
        status_color = GREEN if "in stock" in data["price"] else AMBER
        dd2.text((tx, cy + 92), data["price"], font=f(F_EN_BOLD, 12), fill=status_color)
        dd2.text((tx, cy + 112), data["asin"], font=f(F_EN, 9), fill=MUTED)
        dd2.text((tx, cy + 132), "/products/" + data["asin"].lower() + "/", font=f(F_EN, 8), fill=MUTED)

    if r["new"] is None:
        draw_card(cards_x, r["old"], "old")
        draw_card(cards_x + ARROW_W + CARD_W, None, "del")
    else:
        draw_card(cards_x, r["old"], "old")
        draw_card(cards_x + ARROW_W + CARD_W, r["new"], "new")

    ax = cards_x + CARD_W + 8
    d.ellipse((ax, cy + CARD_H // 2 - 20, ax + 40, cy + CARD_H // 2 + 20), fill=CARD, outline=BORDER, width=2)
    d.text((ax + 12, cy + CARD_H // 2 - 11), "→", font=f(F_EN_BOLD, 18), fill=INK)

    note = r["note"]
    d.text((note_x, cy + 40), truncate(d, note, f(F_CN_BOLD, 16), W - note_x - 24), font=f(F_CN_BOLD, 16), fill=INK)

    d.line((MARGIN, y + row_h - 8, W - MARGIN, y + row_h - 8), fill=(238, 232, 222), width=1)
    y += row_h

fy = y + 10
d.text((MARGIN, fy), "红框=原选择 / 绿框=修正后 / 虚线叉=热区移出位置 · 已构建并在 http://localhost:3000/scenes/ 验证", font=f(F_CN, 13), fill=MUTED)

out = REPORT / "batch4-revision.jpg"
canvas.save(out, quality=90)
print(out, canvas.size)
