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


def product_tile(asin, size=132):
    p = PUBLIC / "images" / "products" / asin / "1.webp"
    im = Image.open(p).convert("RGB")
    im.thumbnail((size - 10, size - 10), Image.LANCZOS)
    tile = Image.new("RGB", (size, size), WHITE)
    tile.paste(im, ((size - im.width) // 2, (size - im.height) // 2))
    d = ImageDraw.Draw(tile)
    d.rectangle((0, 0, size - 1, size - 1), outline=BORDER, width=2)
    return tile


matches = json.loads((REPORT / "batch3-matches.json").read_text(encoding="utf-8"))

W = 1500
HEAD = 118
margin = 28
scene_w = 360
card_w = 330
gap = 18
cards_x = margin + scene_w + 24

rows = []
for sc in matches:
    stem = Path(sc["scene"]).stem[:8]
    overlay = REPORT / f"overlay-{stem}.jpg"
    im = Image.open(overlay).convert("RGB")
    ratio = im.height / im.width
    disp_w = scene_w
    disp_h = int(scene_w * ratio)
    if disp_h > 440:
        disp_h = 440
        disp_w = int(440 / ratio)
    scene_card_h = max(disp_h + 50, 230)
    row_h = max(scene_card_h, 300) + 30
    rows.append((sc, im, disp_w, disp_h, scene_card_h, row_h))

canvas = Image.new("RGB", (W, HEAD + sum(r[5] for r in rows) + 90), WHITE)
d = ImageDraw.Draw(canvas)
d.text((margin, 22), "Shop the Look · 第 3 批 10 张热区映射", font=f(F_CN_BOLD, 32), fill=INK)
d.text((margin, 68), "2026-10-28 · 26 个锚点（sceneShape 全声明） · 绿=High，橙=Medium · 关键词/形状/浅色检查 0 缺失", font=f(F_CN, 15), fill=MUTED)
d.text((1160, 28), "Coming Soon = 暂无 Shopify 变体", font=f(F_CN, 12), fill=MUTED)

y = HEAD
for sc, im, dw, dh, sch, rh in rows:
    scene_y = y + (rh - sch) // 2
    rounded(d, (margin, scene_y, margin + scene_w, scene_y + sch), 14, CARD, BORDER, 2)
    im2 = im.resize((dw, dh), Image.LANCZOS)
    canvas.paste(im2, (margin + (scene_w - dw) // 2, scene_y + 14))
    d.text((margin + 14, scene_y + 18 + dh), sc["slug"], font=f(F_EN, 11), fill=MUTED)

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

fy = HEAD + sum(r[5] for r in rows) + 2
d.text((margin, fy + 8), "完整 PDP 链接见 report/scenes/batch3-matching.md；预览 http://localhost:3000/scenes/", font=f(F_CN, 12), fill=MUTED)

out = REPORT / "batch3-mapping.jpg"
canvas.save(out, quality=90)
print(out)

md = ["# 第 3 批 10 张场景匹配（2026-10-28）", ""]
md.append("- 图片：`public/images/scenes/`（宽图 blush 2400，其余 1600）")
md.append("- 锚点 26 个：sceneShape 全声明；关键词/形状/浅色检查 0 缺失、0 折中")
md.append("- Coming Soon 8 个（粗针织毯 / 佩斯利毯 / 芥末缎面 / 雪杉橄榄毯 / 天鹅绒提花暂无 Shopify 变体）")
md.append("- 预览：<http://localhost:3000/scenes/> · 对照图：`batch3-mapping.jpg` / `verify-*.jpg`")
md.append("")
for sc in matches:
    md.append(f"## {sc['slug']}")
    md.append("")
    md.append("| 圆点 | 站内产品 | PDP | 价格 / 状态 | 置信度 |")
    md.append("|---|---|---|---|---|")
    for i, it in enumerate(sc["items"], 1):
        md.append(
            f'| {i} | {it["title"]} | `/products/{it["handle"]}/` | {it["price"]} | {it["conf"]}（{it["note"]}） |'
        )
    md.append("")
(REPORT / "batch3-matching.md").write_text("\n".join(md) + "\n", encoding="utf-8")
print(REPORT / "batch3-matching.md")
