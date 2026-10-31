import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
SRC = Path(r"D:\opencode_workspace\图")
OUT = ROOT / "report" / "scenes"


def font(size):
    for name in ("arialbd.ttf", "arial.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def grid(name):
    im = Image.open(SRC / name).convert("RGB")
    w, h = im.size
    d = ImageDraw.Draw(im, "RGBA")
    fs = max(18, w // 55)
    f = font(fs)
    for i in range(1, 10):
        x = round(w * i / 10)
        y = round(h * i / 10)
        d.line([(x, 0), (x, h)], fill=(255, 0, 0, 110), width=max(2, w // 500))
        d.line([(0, y), (w, y)], fill=(255, 0, 0, 110), width=max(2, w // 500))
        d.text((x + 8, 8), str(i * 10), font=f, fill=(255, 0, 0, 255), stroke_width=3, stroke_fill=(255, 255, 255, 255))
        d.text((8, y + 4), str(i * 10), font=f, fill=(255, 0, 0, 255), stroke_width=3, stroke_fill=(255, 255, 255, 255))
    out = OUT / f"grid-{Path(name).stem[:8]}.jpg"
    im.save(out, quality=88)
    print(f"{im.size} -> {out}")


def hotspots(name, spec_file):
    im = Image.open(SRC / name).convert("RGB")
    w, h = im.size
    d = ImageDraw.Draw(im)
    f = font(max(26, w // 38))
    for i, spot in enumerate(json.loads(Path(spec_file).read_text(encoding="utf-8-sig")), 1):
        x = w * spot["x"] / 100
        y = h * spot["y"] / 100
        r = max(18, w // 60)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(190, 30, 45), outline=(255, 255, 255), width=max(3, r // 6))
        d.text((x - r * 0.32, y - r * 0.72), str(i), font=f, fill=(255, 255, 255))
    out = OUT / f"overlay-{Path(name).stem[:8]}.jpg"
    im.save(out, quality=88)
    print(f"{im.size} -> {out}")


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "grid":
        for n in sys.argv[2:]:
            grid(n)
    elif cmd == "hotspots":
        hotspots(sys.argv[2], sys.argv[3])
