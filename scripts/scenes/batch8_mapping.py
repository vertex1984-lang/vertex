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
CARD = (251, 249, 245)
BORDER = (229, 222, 211)
WHITE = (255, 255, 255)
NUMBG = (13, 84, 61)


def f(path, size):
    return ImageFont.truetype(path, size)


def truncate(d, text, font, maxw):
    if d.textlength(text, font=font) <= maxw:
        return text
    while text and d.textlength(text + "…", font=font) > maxw:
        text = text[:-1]
    return text.rstrip() + "…"


def draw_para(d, text, x, y, font, fill, maxw, maxlines=3, lh=None):
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
    if cur:
        lines.append(cur)
    lh = lh or font.size + 4
    if len(lines) > maxlines:
        lines = lines[:maxlines]
        lines[-1] = truncate(d, lines[-1], font, maxw)
    for i, line in enumerate(lines):
        d.text((x, y + i * lh), line, font=font, fill=fill)
    return y + len(lines) * lh


def rounded(d, box, r, fill, outline=None, width=1):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


def num_badge(d, x, y, num, size=44):
    d.ellipse((x, y, x + size, y + size), fill=NUMBG, outline=WHITE, width=3)
    fs = 20 if num < 10 else 17
    fnt = f(F_EN_BOLD, fs)
    tw = d.textlength(str(num), font=fnt)
    d.text((x + (size - tw) / 2, y + size / 2 - fs / 2 - 2), str(num), font=fnt, fill=WHITE)


def product_tile(asin, size=132):
    p = PUBLIC / "images" / "products" / asin / "1.webp"
    im = Image.open(p).convert("RGB")
    im.thumbnail((size - 10, size - 10), Image.LANCZOS)
    tile = Image.new("RGB", (size, size), WHITE)
    tile.paste(im, ((size - im.width) // 2, (size - im.height) // 2))
    d = ImageDraw.Draw(tile)
    d.rectangle((0, 0, size - 1, size - 1), outline=BORDER, width=2)
    return tile


matches = json.loads((REPORT / "batch8-matches.json").read_text(encoding="utf-8"))
by_slug = {sc["slug"]: sc for sc in matches}

# 图片序号 → slug；None = 说明行
ORDER = [
    (1, "golden-swirl-suite"),
    (2, None),
    (3, "artist-attic-studio"),
    (4, "dusk-rose-loft"),
    (5, "terracotta-chaise-patio"),
    (6, "academy-ivory-study"),
    (7, "retro-sunset-room"),
    (8, "riad-oat-towels"),
    (9, None),
    (10, "santorini-blue-pool"),
    (11, "sage-pink-morning"),
    (12, "tropic-sunroom-patio"),
    (13, "sage-minimal-bath"),
    (14, "nordic-white-loft"),
    (15, None),
    (16, "alpine-cabin-bath"),
]

NOTES = {
    2: "2 · cream-knit-bench 竖版重复图 — 与第 7 批已上线场景相同，跳过不上线",
    9: "9 · sundown-persian-lounge 竖版重复图 — 与第 7 批已上线场景相同，跳过不上线",
    15: "15 · golden-swirl-suite 横版重复图 — 同批 1 号已上线，跳过不上线",
}

W = 1500
HEAD = 118
margin = 28
scene_w = 360
card_w = 330
gap = 18
cards_x = margin + scene_w + 24

rows = []
for num, slug in ORDER:
    if slug is None:
        rows.append({"num": num, "skip": True, "row_h": 74})
        continue
    sc = by_slug[slug]
    stem = Path(sc["scene"]).stem[:8]
    im = Image.open(REPORT / f"overlay-{stem}.jpg").convert("RGB")
    ratio = im.height / im.width
    disp_w = scene_w
    disp_h = int(scene_w * ratio)
    if disp_h > 440:
        disp_h = 440
        disp_w = int(440 / ratio)
    scene_card_h = max(disp_h + 50, 230)
    row_h = max(scene_card_h, 300) + 30
    rows.append({"num": num, "skip": False, "sc": sc, "im": im, "dw": disp_w, "dh": disp_h, "sch": scene_card_h, "row_h": row_h})

canvas = Image.new("RGB", (W, HEAD + sum(r["row_h"] for r in rows) + 90), WHITE)
d = ImageDraw.Draw(canvas)
d.text((margin, 22), "Shop the Look · 第 8 批对照图（#67–82 · 16 张图序号 1–16 · 修订后 13 场景）", font=f(F_CN_BOLD, 32), fill=INK)
d.text((margin, 68), "2026-11-02 · 29 锚点（2/9/15 号为已上线场景重复图，跳过） · 绿=High，橙=Medium · 检查 0 缺失", font=f(F_CN, 15), fill=MUTED)
d.text((1160, 28), "Coming Soon = 暂无 Shopify 变体", font=f(F_CN, 12), fill=MUTED)

y = HEAD
for r in rows:
    if r["skip"]:
        rounded(d, (margin, y + 12, W - margin, y + 62), 12, CARD, BORDER, 2)
        num_badge(d, margin + 14, y + 15, r["num"], 36)
        d.text((margin + 70, y + 24), NOTES[r["num"]], font=f(F_CN_BOLD, 16), fill=MUTED)
        y += r["row_h"]
        continue
    sc, im, dw, dh, sch, rh = r["sc"], r["im"], r["dw"], r["dh"], r["sch"], r["row_h"]
    scene_y = y + (rh - sch) // 2
    rounded(d, (margin, scene_y, margin + scene_w, scene_y + sch), 14, CARD, BORDER, 2)
    im2 = im.resize((dw, dh), Image.LANCZOS)
    canvas.paste(im2, (margin + (scene_w - dw) // 2, scene_y + 14))
    num_badge(d, margin + 12, scene_y + 12, r["num"])
    d.text((margin + 64, scene_y + 20 + dh), sc["slug"], font=f(F_EN, 11), fill=MUTED)

    for i, it in enumerate(sc["items"]):
        cx = cards_x + i * (card_w + gap)
        cy = y + (rh - 300) // 2
        rounded(d, (cx, cy, cx + card_w, cy + 300), 14, WHITE, BORDER, 2)
        d.ellipse((cx + 14, cy + 14, cx + 38, cy + 38), fill=INK)
        d.text((cx + 21, cy + 17), str(i + 1), font=f(F_EN_BOLD, 14), fill=WHITE)
        draw_para(d, it["title"], cx + 46, cy + 14, f(F_EN_BOLD, 12), INK, 270, 3, 16)

        canvas.paste(product_tile(it["asin"], 128), (cx + 14, cy + 76))

        tx = cx + 154
        status_color = GREEN if "in stock" in it["price"] else AMBER
        d.text((tx, cy + 80), it["price"], font=f(F_EN_BOLD, 12), fill=status_color)
        conf_color = GREEN if it["conf"] == "High" else AMBER
        d.text((tx, cy + 102), f'{it["conf"]} confidence', font=f(F_EN_BOLD, 11), fill=conf_color)
        d.text((tx, cy + 120), it["asin"], font=f(F_EN, 9), fill=MUTED)

        handle = it.get("handle", "")
        d.text((cx + 14, cy + 210), "PDP  …/" + handle[-33:], font=f(F_EN, 8), fill=MUTED)
        draw_para(d, it["note"], cx + 14, cy + 232, f(F_EN, 9), MUTED, 300, 2, 12)

    d.line((margin, y + rh - 6, W - margin, y + rh - 6), fill=(238, 232, 222), width=1)
    y += rh

fy = HEAD + sum(r["row_h"] for r in rows) + 2
d.text((margin, fy + 8), "完整 PDP 链接见 report/scenes/batch8-matching.md；预览 http://localhost:3000/scenes/", font=f(F_CN, 12), fill=MUTED)

out = REPORT / "batch8-mapping.jpg"
canvas.save(out, quality=90)
print(out, canvas.size)

md = ["# 第 8 批对照（#67–82 · 2026-11-02）", ""]
md.append("- 16 张图 → **13 个新场景**上线（序号 2/9/15 = 已上线场景重复图，跳过）；全站 73 → 86 场景，82 张素材图全部消化完毕")
md.append("- 锚点 29 个（每图 ≤3；毛巾特写类 1 锚、dusk-rose 2 锚）；检查 0 缺失、0 折中")
md.append("- 对照表命中：绒球床品→POMPOM4-SWIRL（棕绒球焦糖）、chevron 暖调→BOHO-SUNSET、格纹感→PERCALEJAC（本批无）、燕麦毛巾→LSC-OATMEAL；灰白床品→PERCALE-COCONUT（椰奶白）")
md.append("- 跳过未锚：#70 奶油毛毯（目录无奶油色 fur throw）、#72 绿针毯+圆绿绒毯+小波斯毯、#73 橙色长毛毯（目录无橙色 shag）、#78 棕榈印花高背垫（目录无热带色）、#79 浴垫（颜色不可核实）、#80 圆灰绒毯（圆绒毯规则）、#82 羊皮垫（异形无匹配）")
md.append("- 预览：<http://localhost:3000/scenes/> · 对照图：`batch8-mapping.jpg`")
md.append("")
for num, slug in ORDER:
    if slug is None:
        continue
    sc = by_slug[slug]
    md.append(f"## {num}. {sc['slug']}")
    md.append("")
    md.append("| 圆点 | 站内产品 | PDP | 价格 / 状态 | 置信度 |")
    md.append("|---|---|---|---|---|")
    for i, it in enumerate(sc["items"], 1):
        md.append(
            f'| {i} | {it["title"]} | `/products/{it["handle"]}/` | {it["price"]} | {it["conf"]}（{it["note"]}） |'
        )
    if "skipped" in sc:
        md.append("")
        md.append(f"> 跳过未锚：{sc['skipped']}")
    md.append("")
(REPORT / "batch8-matching.md").write_text("\n".join(md) + "\n", encoding="utf-8")
print(REPORT / "batch8-matching.md")
