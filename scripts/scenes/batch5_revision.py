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


CS = "Coming Soon"

ROWS = [
    {
        "slug": "cottage-pompom-garden", "stem": "691fdb8e", "tag": "2-3·2-4 合并",
        "old": {"asin": "MK-TOWEL-LSC-SAGE-20X30", "title": "Long-Staple Cotton Towel, 20 x 30 in - Sage", "price": "$26.99 · in stock"},
        "new": {"asin": "MK-TOWEL-LSC-SAGE-40X70", "title": "Long-Staple Cotton Towel, 40 x 70 in - Sage", "price": "$69.99 · in stock"},
        "note": "两条同家族毛巾锚点合并为一条（用户指正）",
    },
    {
        "slug": "cottage-pompom-garden", "stem": "691fdb8e", "tag": "2-5 删除",
        "old": {"asin": "1688-1052742241013-C24", "title": "Faux Cashmere Persian Area Rug, BS-12, 180 x 250cm", "price": CS},
        "new": None,
        "note": "波斯地毯非完美匹配（与 3-3 / 9-2 一并处理），删除锚点",
    },
    {
        "slug": "lakeside-gingham-cabin", "stem": "69d22132", "tag": "3-1 替换",
        "old": {"asin": "1688-1071466105053-C2", "title": "Cotton Feel Gingham Bedding Set, 4 Piece, Blue, Queen", "price": CS},
        "new": {"asin": "PERCALEJAC-HAZE-QUEEN", "title": "Cotton Percale Jacquard Bedding Set, 4 Piece, Dusty Blue, Queen", "price": CS},
        "note": "蓝色条纹提花 ≠ 蓝色方格（用户指正），换雾蓝提花四件套",
    },
    {
        "slug": "lakeside-gingham-cabin", "stem": "69d22132", "tag": "3-3 删除",
        "old": {"asin": "1688-1052742241013-C24", "title": "Faux Cashmere Persian Area Rug, BS-12, 180 x 250cm", "price": CS},
        "new": None,
        "note": "目录无穗边地毯（用户指正），删除锚点",
    },
    {
        "slug": "olive-terrace-patio", "stem": "7e90c293", "tag": "4-1 重定位",
        "old": {"asin": "CHUNKYTHROW-CREAM-127", "title": "Chunky Knit Throw Blanket, Cream White, 50 x 68 in", "price": CS},
        "new": {"asin": "B0CBT7RFK2", "title": "Corduroy, Tufted, with Ties - 95x45cm, Coffee", "price": "$28.99 · in stock"},
        "note": "篮筐内看不清 → 主体是坐垫：灯芯绒拉扣绑带结构一致，咖啡色最接近赤陶橙",
    },
    {
        "slug": "olive-terrace-patio", "stem": "7e90c293", "tag": "4-2 重定位",
        "old": {"asin": "KNITTHROW-GREY", "title": "Openwork Knit Throw Blanket, Light Grey", "price": CS},
        "new": {"asin": "1688-1016436401519", "title": "Imitation Sisal Non-Slip Cut-to-Fit Door Mats, Set of 2", "price": "$19.99 · in stock"},
        "note": "另一主体是编织地毯：剑麻纹理矩形毯匹配",
    },
    {
        "slug": "olive-terrace-patio", "stem": "7e90c293", "tag": "4 · 新增3",
        "old": None,
        "new": {"asin": "B0CC5VNQY3", "title": "Outdoor Cushions, 95 x 45cm - Tulip", "price": "$39.99 · in stock"},
        "note": "右侧躺椅郁金香印花坐垫 → 目录 95x45 Tulip 款完全对应（用户追问后补配）",
    },
    {
        "slug": "onsen-grey-ritual", "stem": "80928ee6", "tag": "7 · 整场删除",
        "old": {"asin": "MK-TOWEL-LSC-LIGHTGREY-40X70", "title": "Long-Staple Cotton Towel, 40 x 70 in - Light Grey", "price": "$69.99 · in stock"},
        "new": None,
        "note": "整场删除（用户否决：庭院摆毛巾场景不合理），4 个锚点一并移除",
    },
    {
        "slug": "ivory-gothic-library", "stem": "87d0a59d", "tag": "9-2 删除",
        "old": {"asin": "1688-1052742241013-C24", "title": "Faux Cashmere Persian Area Rug, BS-12, 180 x 250cm", "price": CS},
        "new": None,
        "note": "波斯地毯非完全匹配（用户指正），删除锚点",
    },
    {
        "slug": "ivory-gothic-library", "stem": "87d0a59d", "tag": "9 · 新增2",
        "old": None,
        "new": {"asin": "MK-PC-CORD-DUSTYROSE-45", "title": "Corduroy Pillow Cases, Set of 2, 45x45cm - Dusty Rose", "price": "$19.99 · in stock"},
        "note": "酒红丝绒枕 → 玫瑰粉灯芯绒（目录无正红，用户选定）",
    },
    {
        "slug": "ivory-gothic-library", "stem": "87d0a59d", "tag": "9 · 新增3",
        "old": None,
        "new": {"asin": "MK-PC-CORD-OLIVE-45", "title": "Corduroy Pillow Cases, Set of 2, 45x45cm - Olive", "price": "$19.99 · in stock"},
        "note": "墨绿丝绒枕 → 橄榄绿灯芯绒（用户选定）",
    },
    {
        "slug": "rose-towels-soak", "stem": "880511fc", "tag": "10-2·10-3 删除",
        "old": {"asin": "MK-TOWEL-LSC-DUSTYROSE-30X56", "title": "Long-Staple Cotton Towel, 30 x 56 in - Dusty Rose", "price": "$44.99 · in stock"},
        "new": None,
        "note": "三条同家族毛巾重复 → 只保留椅背浴巾一条（用户指正）",
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
    if th > 340:
        th = 340
    rows_prepared.append((r, im, th))

cards_x = MARGIN + THUMB_W + 22
note_x = cards_x + CARD_W + ARROW_W + CARD_W + 22
canvas_h = HEAD + sum(max(th, CARD_H + 24) + 26 for _, _, th in rows_prepared) + 64
canvas = Image.new("RGB", (W, canvas_h), WHITE)
d = ImageDraw.Draw(canvas)

d.text((MARGIN, 22), "Shop the Look · 第 5 批修订图（人工审核后修正）", font=f(F_CN_BOLD, 32), fill=INK)
d.text((MARGIN, 70), "2026-11-02 · 6 处替换/重定位 + 4 处删除 + 3 个新增，含 1 整场删除；29→22 锚点 · 修订后总图见 batch5-mapping.jpg", font=f(F_CN, 15), fill=MUTED)

y = HEAD
for r, im, th in rows_prepared:
    row_h = max(th, CARD_H + 24) + 26
    ty = y + (row_h - th) // 2
    im2 = im.resize((THUMB_W, th), Image.LANCZOS)
    canvas.paste(im2, (MARGIN, ty))
    dd = ImageDraw.Draw(canvas)
    dd.rectangle((MARGIN, ty, MARGIN + THUMB_W - 1, ty + th - 1), outline=BORDER, width=2)
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
            dd2.text((x + 52, cy + 17), f"锚点 {r['tag']} · 已删除", font=f(F_CN_BOLD, 13), fill=edge)
            dd2.text((x + 14, cy + 76), "该锚点本轮人工审核后删除", font=f(F_CN, 14), fill=MUTED)
            dd2.line((x + 14, cy + 100, x + CARD_W - 14, cy + 130), fill=BORDER, width=3)
            return
        label = {
            "old": f"锚点 {r['tag']} · 原",
            "new": f"锚点 {r['tag']} · 修正后",
            "add": f"锚点 {r['tag']} · 新增",
            "del": f"锚点 {r['tag']} · 已删除",
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
        draw_card(cards_x, r["old"], "del")
        draw_card(cards_x + ARROW_W + CARD_W, None, "del")
    elif r["old"]:
        draw_card(cards_x, r["old"], "old")
        draw_card(cards_x + ARROW_W + CARD_W, r["new"], "new")
    else:
        draw_card(cards_x, None, "old")
        draw_card(cards_x + ARROW_W + CARD_W, r["new"], "add")

    ax = cards_x + CARD_W + 8
    dd.ellipse((ax, cy + CARD_H // 2 - 20, ax + 40, cy + CARD_H // 2 + 20), fill=CARD, outline=BORDER, width=2)
    dd.text((ax + 12, cy + CARD_H // 2 - 11), "→", font=f(F_EN_BOLD, 18), fill=INK)

    dd.text((note_x, cy + 40), truncate(dd, r["note"], f(F_CN_BOLD, 16), W - note_x - 24), font=f(F_CN_BOLD, 16), fill=INK)

    dd.line((MARGIN, y + row_h - 8, W - MARGIN, y + row_h - 8), fill=(238, 232, 222), width=1)
    y += row_h

fy = y + 10
dd.text((MARGIN, fy), "红框=原选择 / 绿框=修正后 / 红框删=本轮删除 · 已构建并在 http://localhost:3000/scenes/ 验证", font=f(F_CN, 13), fill=MUTED)

out = REPORT / "batch5-revision.jpg"
canvas.save(out, quality=90)
print(out, canvas.size)
