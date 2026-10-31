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


def two_lines(d, text, font, maxw):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        cand = (cur + " " + w).strip()
        if d.textlength(cand, font=font) <= maxw:
            cur = cand
        else:
            if cur:
                lines.append(cur)
            cur = w
        if len(lines) == 2:
            break
    if cur and len(lines) < 2:
        lines.append(cur)
    if len(lines) == 2 and words and " ".join(lines) != text:
        lines[1] = truncate(d, lines[1], font, maxw)
    elif len(lines) == 1:
        lines[0] = truncate(d, lines[0], font, maxw)
    return lines


def product_tile(asin, size=100):
    p = PUBLIC / "images" / "products" / asin / "1.webp"
    im = Image.open(p).convert("RGB")
    im.thumbnail((size - 8, size - 8), Image.LANCZOS)
    tile = Image.new("RGB", (size, size), WHITE)
    tile.paste(im, ((size - im.width) // 2, (size - im.height) // 2))
    dd = ImageDraw.Draw(tile)
    dd.rectangle((0, 0, size - 1, size - 1), outline=BORDER, width=2)
    return tile


def status_color(price):
    return GREEN if "in stock" in price else AMBER


OVAL_RUG = {"asin": "1688-996768645117-C3", "title": "Faux Fur Oval Area Rug, White", "price": "$25.99 · in stock"}
BOUCLE_WHITE = {"asin": "MK-PC-BOUCLE-WHITE-45", "title": "Boucle Pillow Cases, Set of 2, 45x45cm - White", "price": "$19.99 · in stock"}
VELJAC = {"asin": "VELJAC-IVORY-QUEEN", "title": "Jacquard Velvet Bedding Set, 4 Piece, Ivory White", "price": "Coming Soon"}
BEDSET_LILAC = {"asin": "BEDSET4-LILAC-QUEEN", "title": "Linen-Like 4-Piece Bedding Set, Lilac Floral", "price": "$34.99 · in stock"}
LINEN_OAT_OLD = {"asin": "LINEN3-OATMEAL-QUEEN", "title": "100% Linen Duvet Cover Set, 4 Piece, Oatmeal", "price": "$129.99 · in stock"}
BEDSET_MAUVE = {"asin": "BEDSET4-MAUVE-QUEEN", "title": "Linen-Like 4-Piece Bedding Set, Mauve Lace Floral", "price": "$34.99 · in stock"}
KNIT_CREAM = {"asin": "KNITTHROW-CREAM", "title": "Openwork Knit Throw Blanket, Cream White", "price": "Coming Soon"}
BOHO_OLIVE = {"asin": "BOHOTHROW-OLIVE-127", "title": "Bohemian Chevron Knit Throw, Khaki Olive, 50 x 71 in", "price": "Coming Soon"}

SHEETS = [
    {
        "out": "final-audit-06-15.jpg",
        "title": "Shop the Look · 第 6–15 张（第 2 批）终版对照图",
        "sub": "2026-10-28 · 红=原选择，绿=修正后/新增，黑=未改动 · 关键词/形状/浅色检查 0 缺失",
        "json": "batch2-matches.json",
        "scenes": [
            {"slug": "sunrise-oat-linen-room", "stem": "11acfdd4", "changes": {2: OVAL_RUG}},
            {"slug": "book-nook-window-seat", "stem": "1439a58a", "changes": {2: OVAL_RUG}},
            {"slug": "art-deco-gold-suite", "stem": "1b666ebb", "changes": {}},
            {"slug": "japandi-sage-suite", "stem": "1d872898", "changes": {1: BOUCLE_WHITE}},
            {"slug": "shabby-lavender-tea", "stem": "1db8691a", "changes": {0: VELJAC, 1: BEDSET_LILAC}, "moved": [1]},
            {"slug": "boho-terracotta-dusk", "stem": "25932d56", "changes": {}},
            {"slug": "spanish-courtyard-sage", "stem": "279ec504", "changes": {}},
            {"slug": "manor-cream-suite", "stem": "2cc23cf9", "changes": {}, "adds": [1, 2]},
            {"slug": "bali-canopy-dusk", "stem": "3005088f", "changes": {}},
            {"slug": "library-oat-hour", "stem": "31f31619", "changes": {1: OVAL_RUG}},
        ],
    },
    {
        "out": "final-audit-16-25.jpg",
        "title": "Shop the Look · 第 16–25 张（第 3 批）终版对照图",
        "sub": "2026-10-28 · 红=原选择，绿=修正后，黑=未改动 · 关键词/形状/浅色检查 0 缺失",
        "json": "batch3-matches.json",
        "scenes": [
            {"slug": "cottage-check-bedroom", "stem": "361b650e", "changes": {0: LINEN_OAT_OLD}},
            {"slug": "snowy-teahouse-bedroom", "stem": "36676edf", "changes": {}},
            {"slug": "rose-boudoir-corner", "stem": "36f3f706", "changes": {0: BEDSET_MAUVE}, "deleted": OVAL_RUG if False else {"asin": "1688-595229918569-C2", "title": "Plush Faux Rabbit Fur Area Rug, 160x200cm", "price": "$199.00 · in stock"}},
            {"slug": "stone-attic-daybed", "stem": "392f97f6", "changes": {}},
            {"slug": "study-in-denim", "stem": "393bdab9", "changes": {2: KNIT_CREAM}, "moved": [2]},
            {"slug": "amber-panel-room", "stem": "3d369049", "changes": {2: BOHO_OLIVE}},
            {"slug": "pompom-quilt-morning", "stem": "3dada3c2", "changes": {0: VELJAC}},
            {"slug": "three-colours-second-light", "stem": "3fcb0155", "changes": {}},
            {"slug": "zen-sage-tatami", "stem": "421b1e9d", "changes": {}},
            {"slug": "blush-bobble-bedroom", "stem": "4546651e", "changes": {}, "deleted": {"asin": "1688-595229918569-C2", "title": "Plush Faux Rabbit Fur Area Rug, 160x200cm", "price": "$199.00 · in stock"}},
        ],
    },
]

W = 1500
HEAD = 118
MARGIN = 28
THUMB_W = 240
NORM_W, NORM_H = 272, 170
CHG_W, CHG_H = 436, 190
DEL_W, DEL_H = 240, 170
GAP = 14
X0 = MARGIN + THUMB_W + 20

d_font_cache = {}


def get_font(path, size):
    return ImageFont.truetype(path, size)


def badge(dd, x, y, text, color, size=26):
    dd.ellipse((x, y, x + size, y + size), fill=color)
    fs = 15 if len(text) == 1 else 11
    fnt = get_font(F_CN_BOLD if any(ord(c) > 127 for c in text) else F_EN_BOLD, fs)
    tw = dd.textlength(text, font=fnt)
    dd.text((x + (size - tw) / 2, y + size / 2 - fs / 2 - 2), text, font=fnt, fill=WHITE)


def main():
    for sheet in SHEETS:
        matches = json.loads((REPORT / sheet["json"]).read_text(encoding="utf-8"))
        by_slug = {sc["slug"]: sc for sc in matches}

        rows = []
        for spec in sheet["scenes"]:
            sc = by_slug[spec["slug"]]
            im = Image.open(REPORT / f"overlay-{spec['stem']}.jpg").convert("RGB")
            ratio = im.height / im.width
            th = int(THUMB_W * ratio)
            rows.append((spec, sc, im, th))

        canvas_h = HEAD + sum(max(th + 22, CHG_H + 26) + 22 for _, _, _, th in rows) + 56
        canvas = Image.new("RGB", (W, canvas_h), WHITE)
        d = ImageDraw.Draw(canvas)
        d.text((MARGIN, 22), sheet["title"], font=get_font(F_CN_BOLD, 32), fill=INK)
        d.text((MARGIN, 70), sheet["sub"], font=get_font(F_CN, 15), fill=MUTED)
        d.text((1130, 28), "Coming Soon = 暂无 Shopify 变体", font=get_font(F_CN, 12), fill=MUTED)

        y = HEAD
        for spec, sc, im, th in rows:
            row_h = max(th + 22, CHG_H + 26) + 22
            ty = y + (row_h - th) // 2
            im2 = im.resize((THUMB_W, th), Image.LANCZOS)
            canvas.paste(im2, (MARGIN, ty))
            d.rectangle((MARGIN, ty, MARGIN + THUMB_W - 1, ty + th - 1), outline=BORDER, width=2)
            d.text((MARGIN + 4, ty + th + 2), spec["slug"], font=get_font(F_EN, 11), fill=MUTED)

            changes = spec.get("changes", {})
            adds = set(spec.get("adds", []))
            moved = set(spec.get("moved", []))

            # measure widths
            widths = []
            for i in range(len(sc["items"])):
                if i in changes:
                    widths.append(CHG_W)
                else:
                    widths.append(NORM_W)
            if spec.get("deleted"):
                widths.append(DEL_W)
            total = sum(widths) + GAP * (len(widths) - 1)
            scale_ok = total <= (W - MARGIN - X0)

            cx = X0
            row_y = y + (row_h - max(NORM_H, CHG_H)) // 2
            for i, it in enumerate(sc["items"]):
                if i in changes:
                    draw_change(canvas, d, cx, row_y, i + 1, changes[i], it, i in moved)
                    cx += CHG_W + GAP
                else:
                    kind = "add" if i in adds else "norm"
                    draw_normal(canvas, d, cx, row_y, i + 1, it, kind)
                    cx += NORM_W + GAP
            if spec.get("deleted"):
                draw_del(canvas, d, cx, row_y, spec["deleted"])

            d.line((MARGIN, y + row_h - 8, W - MARGIN, y + row_h - 8), fill=(238, 232, 222), width=1)
            y += row_h

        fy = y + 8
        d.text((MARGIN, fy), "预览 http://localhost:3000/scenes/ · 修订明细见 batch2-revision.jpg / batch3-revision.jpg · PDP 链接见 batch2/3-matching.md", font=get_font(F_CN, 13), fill=MUTED)

        out = REPORT / sheet["out"]
        canvas.save(out, quality=90)
        print(out, canvas.size)


def draw_normal(canvas, d, x, y, num, it, kind):
    d.rounded_rectangle((x, y, x + NORM_W, y + NORM_H), 12, WHITE, BORDER, 2)
    if kind == "add":
        badge(d, x + 10, y + 10, "增", GREEN)
        d.text((x + 46, y + 14), "新增锚点", font=get_font(F_CN_BOLD, 13), fill=GREEN)
    else:
        badge(d, x + 10, y + 10, str(num), INK)
    lines = two_lines(d, it["title"], get_font(F_EN_BOLD, 11), NORM_W - (60 if kind == "add" else 76))
    tx = x + (46 if kind == "add" else 48)
    for j, ln in enumerate(lines[:2]):
        d.text((tx, y + 14 + j * 15), ln, font=get_font(F_EN_BOLD, 11), fill=INK)
    tile = product_tile(it["asin"], 100)
    canvas.paste(tile, (x + 12, y + 50))
    c = status_color(it["price"])
    d.text((x + 122, y + 56), it["price"], font=get_font(F_EN_BOLD, 12), fill=c)
    conf_c = GREEN if it["conf"] == "High" else AMBER
    d.text((x + 122, y + 78), f'{it["conf"]} confidence', font=get_font(F_EN_BOLD, 11), fill=conf_c)
    d.text((x + 122, y + 98), it["asin"], font=get_font(F_EN, 8), fill=MUTED)


def draw_change(canvas, d, x, y, num, old, new, moved):
    d.rounded_rectangle((x, y, x + CHG_W, y + CHG_H), 12, WHITE, RED, 2)
    d.line((x + 218, y + 10, x + 218, y + CHG_H - 10), fill=BORDER, width=2)
    # old pane
    badge(d, x + 8, y + 8, "原", RED)
    tile = product_tile(old["asin"], 80)
    canvas.paste(tile, (x + 10, y + 40))
    lines = two_lines(d, old["title"], get_font(F_EN_BOLD, 9), 118)
    for j, ln in enumerate(lines[:2]):
        d.text((x + 96, y + 42 + j * 12), ln, font=get_font(F_EN_BOLD, 9), fill=INK)
    d.text((x + 96, y + 70), old["price"], font=get_font(F_EN_BOLD, 9), fill=status_color(old["price"]))
    d.text((x + 96, y + 86), old["asin"], font=get_font(F_EN, 7), fill=MUTED)
    d.text((x + 10, y + CHG_H - 22), "原选择", font=get_font(F_CN, 10), fill=MUTED)
    # arrow
    d.ellipse((x + 200, y + CHG_H // 2 - 16, x + 236, y + CHG_H // 2 + 16), fill=CARD, outline=BORDER, width=2)
    d.text((x + 208, y + CHG_H // 2 - 10), "→", font=get_font(F_EN_BOLD, 15), fill=INK)
    # new pane
    badge(d, x + 246, y + 8, "修", GREEN)
    badge(d, x + CHG_W - 34, y + 8, str(num), INK)
    tile = product_tile(new["asin"], 80)
    canvas.paste(tile, (x + 248, y + 40))
    lines = two_lines(d, new["title"], get_font(F_EN_BOLD, 9), 118)
    for j, ln in enumerate(lines[:2]):
        d.text((x + 334, y + 42 + j * 12), ln, font=get_font(F_EN_BOLD, 9), fill=INK)
    d.text((x + 334, y + 70), new["price"], font=get_font(F_EN_BOLD, 9), fill=status_color(new["price"]))
    d.text((x + 334, y + 86), new["asin"], font=get_font(F_EN, 7), fill=MUTED)
    if moved:
        d.text((x + 246, y + CHG_H - 22), "修正后 · 热区已移动", font=get_font(F_CN, 10), fill=RED)
    else:
        d.text((x + 246, y + CHG_H - 22), "修正后", font=get_font(F_CN, 10), fill=MUTED)


def draw_del(canvas, d, x, y, old):
    d.rounded_rectangle((x, y, x + DEL_W, y + DEL_H), 12, WHITE, RED, 2)
    badge(d, x + 8, y + 8, "删", RED)
    d.text((x + 44, y + 13), "锚点已删除", font=get_font(F_CN_BOLD, 12), fill=RED)
    tile = product_tile(old["asin"], 70)
    canvas.paste(tile, (x + 10, y + 42))
    lines = two_lines(d, old["title"], get_font(F_EN_BOLD, 8), 130)
    for j, ln in enumerate(lines[:2]):
        d.text((x + 88, y + 44 + j * 11), ln, font=get_font(F_EN_BOLD, 8), fill=INK)
    d.text((x + 88, y + 68), old["price"], font=get_font(F_EN_BOLD, 8), fill=status_color(old["price"]))
    d.text((x + 10, y + DEL_H - 22), "无同花纹/同色产品", font=get_font(F_CN, 10), fill=MUTED)


main()
