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


def wrap(d, text, font, maxw, max_lines=3):
    lines = []
    cur = ""
    for ch in text:
        if d.textlength(cur + ch, font=font) <= maxw:
            cur += ch
        else:
            lines.append(cur)
            cur = ch
            if len(lines) == max_lines:
                break
    if cur and len(lines) < max_lines:
        lines.append(cur)
    if len(lines) == max_lines and text and "".join(lines) != text:
        last = lines[-1]
        while last and d.textlength(last + "…", font=font) > maxw:
            last = last[:-1]
        lines[-1] = last.rstrip() + "…"
    return lines


CS = "Coming Soon"

ROWS = [
    {
        "slug": "golden-swirl-suite", "stem": "ccbd64cb", "tag": "1-1 替换",
        "old": {"asin": "POMPOM4-SWIRL-QUEEN", "title": "Embossed Velvet Bedding Set, 4 Piece, Caramel Swirl, Queen", "price": CS},
        "new": {"asin": "POMPOM4-VINE-QUEEN", "title": "Embossed Velvet Bedding Set, 4 Piece, Olive Vine, Queen", "price": CS},
        "note": "颜色不对（用户指正+给 URL）：SWIRL 实图=漩涡纹+浅绿绒球+焦糖反面；VINE=奶油大马士革+棕绒球+橄榄绿反面，逐项吻合——对照表升级：绒球床品必须 tile 核证花色",
    },
    {
        "slug": "terracotta-chaise-patio", "stem": "d3e4d35f", "tag": "5 · 整场删除",
        "old": {"asin": "B0CC5VNQY3", "title": "Outdoor Cushions, 95 x 45cm - Tulip（+Coffee 坐垫+Sisal 垫）", "price": "$39.99 · in stock"},
        "new": None,
        "note": "与第 5 批 olive-terrace-patio 概念重复（同产品三件套、同 look 藤椅+郁金香垫+九重葛）——新防线：上线前按 anchor handle 集合做跨批次去重",
    },
    {
        "slug": "tropic-sunroom-patio", "stem": "f0fefb2b", "tag": "12-3 替换",
        "old": {"asin": "MK-CUSHION-CORD-CREAM", "title": "Corduroy, Tufted, with Ties - 95x45cm, Cream", "price": "$39.99 · in stock"},
        "new": {"asin": "MK-PC-CORD-CARAMEL-45", "title": "Corduroy Pillow Cases, Set of 2, 45 x 45cm - Caramel", "price": "$19.99 · in stock"},
        "note": "识别错误（用户指正）：热点 3 改右摇椅焦橙灯芯绒方枕（CARAMEL 比 DUSTYROSE 更近，retro-sunset 先例）；棕榈印花坐垫无匹配记 skipped（corduroy45 全 5 色核过）",
    },
    {
        "slug": "nordic-white-loft", "stem": "f7d3ee4e", "tag": "14 · 新增4",
        "old": None,
        "new": {"asin": "1688-996768645117-C2", "title": "Faux Fur Oval Area Rug, Grey Tie-Dye, 100 x 200 cm", "price": CS + " (list $26.99)"},
        "note": "用户指认+给 URL：地面灰毯即椭圆 tie-dye 长绒毯（椭圆随场景形状先例第 2 次）；注意该家族 c2~c8 均不在 shopify-map，站内 Coming Soon",
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

d.text((MARGIN, 22), "Shop the Look · 第 8 批修订图（人工审核后修正）", font=f(F_CN_BOLD, 32), fill=INK)
d.text((MARGIN, 70), "2026-11-03 · 2 处替换 + 1 整场删除 + 1 新增；29→27 锚点 · 13→12 场景 · 全站 85 · 修订后全量核验见图内页实测", font=f(F_CN, 15), fill=MUTED)

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

    note_font = f(F_CN_BOLD, 14)
    note_lines = wrap(dd, r["note"], note_font, W - note_x - 24, max_lines=4)
    for li, line in enumerate(note_lines):
        dd.text((note_x, cy + 30 + li * 24), line, font=note_font, fill=INK)

    dd.line((MARGIN, y + row_h - 8, W - MARGIN, y + row_h - 8), fill=(238, 232, 222), width=1)
    y += row_h

fy = y + 10
dd.text((MARGIN, fy), "红框=原选择 / 绿框=修正后 / 红框删=本轮删除 · 已构建并在 http://localhost:3000/scenes/ 验证", font=f(F_CN, 13), fill=MUTED)

out = REPORT / "batch8-revision.jpg"
canvas.save(out, quality=90)
print(out, canvas.size)
