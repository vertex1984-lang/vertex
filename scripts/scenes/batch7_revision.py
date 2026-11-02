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
        "slug": "coastal-blue-spa", "stem": "a51dfe54", "tag": "2 · 整场删除",
        "old": {"asin": "MK-TOWEL-LSC-DUSTYBLUE-40X70", "title": "Long-Staple Cotton Towel, 40 x 70 in - Dusty Blue", "price": "$69.99 · in stock"},
        "new": None,
        "note": "整场删除（用户否决：卧室带浴缸+大窗场景不合理），3 个锚点一并移除",
    },
    {
        "slug": "rose-check-cabin", "stem": "a7c4f917", "tag": "3-3 删除",
        "old": {"asin": "KNITTHROW-GREY", "title": "Openwork Knit Throw Blanket, Light Grey", "price": CS},
        "new": None,
        "note": "非主体，删除锚点（用户指正）",
    },
    {
        "slug": "rose-check-cabin", "stem": "a7c4f917", "tag": "3 · 新增1",
        "old": None,
        "new": {"asin": "PERCALEJAC-ROSE-QUEEN", "title": "Cotton Percale Jacquard Bedding Set, 4 Piece, Dusty Pink, Queen", "price": CS},
        "note": "补锚被罩：粉格感床品即玫瑰提花——对照表升级：格纹感皱布床品按色查 PERCALEJAC 家族（蓝=HAZE / 粉=ROSE）",
    },
    {
        "slug": "champagne-dark-suite", "stem": "af5b019f", "tag": "4 · 新增2",
        "old": None,
        "new": {"asin": "MK-PC-CORD-CHARCOAL-45", "title": "Corduroy Pillow Cases, Set of 2, 45 x 45cm - Charcoal", "price": "$19.99 · in stock"},
        "note": "用户要求加锚黑枕：目录无丝绒枕，炭灰灯芯绒最接近（用户拍板）",
    },
    {
        "slug": "greenhouse-oat-room", "stem": "b4f1b679", "tag": "7-2 替换",
        "old": {"asin": "BOHOTHROW-OLIVE-127", "title": "Bohemian Chevron Knit Throw, Khaki Olive, 50 x 71 in", "price": CS},
        "new": {"asin": "MK-CUSHION-CORD-CREAM", "title": "Corduroy, Tufted, with Ties - 95x45cm, Cream", "price": "$39.99 · in stock"},
        "note": "针织毯花纹不匹配（用户指正），改锚左下角奶油拉扣椅垫",
    },
    {
        "slug": "greenhouse-oat-room", "stem": "b4f1b679", "tag": "7-3 删除",
        "old": {"asin": "1688-996768645117-C3", "title": "Faux Fur Oval Area Rug, White", "price": "$25.99 · in stock"},
        "new": None,
        "note": "场景圆毯 vs 商品椭圆——目录确认无圆形毛绒毯（用户提出并核实），圆绒毯场景一律不锚",
    },
    {
        "slug": "cream-knit-bench", "stem": "bea46cbb", "tag": "9 · 新增2",
        "old": None,
        "new": {"asin": "1688-1016436401519", "title": "Imitation Sisal Non-Slip Cut-to-Fit Door Mats, Set of 2", "price": "$19.99 · in stock"},
        "note": "用户指认：地面编织垫即剑麻纹门垫（复用 olive-terrace 同款）",
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

d.text((MARGIN, 22), "Shop the Look · 第 7 批修订图（人工审核后修正）", font=f(F_CN_BOLD, 32), fill=INK)
d.text((MARGIN, 70), "2026-11-02 · 2 处替换/补锚 + 3 处新增 + 2 处删除，含 1 整场删除；26→24 锚点 · 修订后总图见 batch7-mapping.jpg", font=f(F_CN, 15), fill=MUTED)

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

    dd.text((note_x, cy + 40), truncate(dd, r["note"], f(F_CN_BOLD, 15), W - note_x - 24), font=f(F_CN_BOLD, 15), fill=INK)

    dd.line((MARGIN, y + row_h - 8, W - MARGIN, y + row_h - 8), fill=(238, 232, 222), width=1)
    y += row_h

fy = y + 10
dd.text((MARGIN, fy), "红框=原选择 / 绿框=修正后 / 红框删=本轮删除 · 已构建并在 http://localhost:3000/scenes/ 验证", font=f(F_CN, 13), fill=MUTED)

out = REPORT / "batch7-revision.jpg"
canvas.save(out, quality=90)
print(out, canvas.size)
