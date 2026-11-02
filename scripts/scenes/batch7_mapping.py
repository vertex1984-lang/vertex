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


matches = json.loads((REPORT / "batch7-matches.json").read_text(encoding="utf-8"))
by_slug = {sc["slug"]: sc for sc in matches}

# 图片序号 → slug；None = 说明行（2=coastal 整场删除 / 5=boho 重复跳过）
ORDER = [
    (1, "snowy-pompom-cabin"),
    (2, None),
    (3, "rose-check-cabin"),
    (4, "champagne-dark-suite"),
    (5, None),
    (6, "seaside-sky-suite"),
    (7, "greenhouse-oat-room"),
    (8, "tatami-sage-summer"),
    (9, "cream-knit-bench"),
    (10, "oat-sunset-retreat"),
    (11, "blush-stripe-room"),
]

NOTES = {
    2: "2 · coastal-blue-spa 整场删除 — 卧室带浴缸+大窗场景不合理（用户否决）",
    5: "5 · boho-mauve-hearth 高清重复图 — 与第 6 批已上线场景相同，跳过不上线",
}

W = 1500
HEAD = 118
margin = 28
scene_w = 360
card_w = 330
gap = 18
cards_x = margin + scene_w + 24

# 预排版
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
d.text((margin, 22), "Shop the Look · 第 7 批对照图（#56–66 · 11 张图序号 1–11 · 修订后 9 场景）", font=f(F_CN_BOLD, 32), fill=INK)
d.text((margin, 68), "2026-11-02 · 修订后 24 锚点（2 号整场删除 / 5 号 boho 重复跳过） · 绿=High，橙=Medium · 检查 0 缺失", font=f(F_CN, 15), fill=MUTED)
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
d.text((margin, fy + 8), "完整 PDP 链接见 report/scenes/batch7-matching.md；预览 http://localhost:3000/scenes/", font=f(F_CN, 12), fill=MUTED)

out = REPORT / "batch7-mapping.jpg"
canvas.save(out, quality=90)
print(out, canvas.size)

md = ["# 第 7 批对照（#56–66 · 2026-11-02 初版 · 同日人工审核修订）", ""]
md.append("- 11 张图 → **9 个场景**上线（序号 2 = coastal 整场删除；序号 5 = boho 高清重复跳过）；全站 74 → 73 场景")
md.append("- 锚点 24 个（修订前 26；每图 ≤3；champagne-dark-suite 与 cream-knit-bench 各 2 锚）；检查 0 缺失、0 折中")
md.append("- 修订：2 整场删除、3-3 删灰针织毯 + 补锚 PERCALEJAC-ROSE 被罩（对照表升级：格纹感床品按色查 PERCALEJAC 家族）、4 加炭灰枕、7-2 换奶油拉扣椅垫、7-3 删圆毯（目录无圆形毛绒毯，已核实）、9 加剑麻垫；明细见 `batch7-revision.jpg`")
md.append("- 组合价（页面实测见预览）：rose-check / cream-knit 等修订场景以构建后页面为准")
md.append("- 预览：<http://localhost:3000/scenes/> · 对照图：`batch7-mapping.jpg`")
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
(REPORT / "batch7-matching.md").write_text("\n".join(md) + "\n", encoding="utf-8")
print(REPORT / "batch7-matching.md")
