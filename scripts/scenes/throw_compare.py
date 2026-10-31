from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

root = Path(r"E:\Makimoo-Local\vertex")
out = root / "report" / "scenes"

def crop(p, box):
    im = Image.open(root / p).convert("RGB")
    w, h = im.size
    return im.crop((int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h)))

def fit(im, size):
    im.thumbnail(size, Image.LANCZOS)
    return im

tiles = [
    ("Sunny nook throw", crop("public/images/pdp-lifestyle/pillow-boucle-nook.webp", (0.70, 0.42, 1.0, 0.86))),
    ("Sage sofa throw", crop("public/images/pdp-lifestyle/pillow-boucle-sofa.webp", (0.0, 0.28, 0.32, 0.92))),
    ("Chunky Cream", Image.open(root / "public/images/products/CHUNKYTHROW-CREAM-127/1.webp").convert("RGB")),
    ("Chunky Oat", Image.open(root / "public/images/products/CHUNKYTHROW-OAT-127/1.webp").convert("RGB")),
]

W, H = 480, 620
canvas = Image.new("RGB", (W * 4, H + 40), "white")
d = ImageDraw.Draw(canvas)
font = ImageFont.truetype("arial.ttf", 22)
for i, (label, im) in enumerate(tiles):
    im = fit(im, (W - 20, H - 20))
    canvas.paste(im, (i * W + (W - im.width) // 2, 10))
    d.text((i * W + 10, H + 6), label, font=font, fill="black")
canvas.save(out / "throw-compare.jpg", quality=90)
print(out / "throw-compare.jpg")
