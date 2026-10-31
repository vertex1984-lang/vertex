from PIL import Image
from pathlib import Path

root = Path(r"E:\Makimoo-Local\vertex")


def avg(im, box):
    im = im.convert("RGB").crop(box)
    px = list(im.getdata())
    n = len(px)
    return tuple(round(sum(p[i] for p in px) / n) for i in range(3))


scenes = {
    "slow-morning": ("public/images/pdp-lifestyle/pillow-boucle-bed.webp", (0.55, 0.68, 1.0, 0.95)),
    "sunny-nook": ("public/images/pdp-lifestyle/pillow-boucle-nook.webp", (0.78, 0.42, 1.0, 0.80)),
    "sage-sofa": ("public/images/pdp-lifestyle/pillow-boucle-sofa.webp", (0.0, 0.38, 0.20, 0.85)),
    "cat-nap": ("public/images/pdp-lifestyle/pillow-lifestyle-tall.webp", (0.50, 0.60, 0.98, 0.88)),
}
for k, (p, b) in scenes.items():
    im = Image.open(root / p)
    w, h = im.size
    box = (int(b[0] * w), int(b[1] * h), int(b[2] * w), int(b[3] * h))
    print(k, im.size, avg(im, box))

print("--- products ---")
for asin in ["CHUNKYTHROW-CREAM-127", "CHUNKYTHROW-OAT-127", "KNITTHROW-KHAKI", "1688-969627065032-C26"]:
    p = root / "public/images/products" / asin / "1.webp"
    im = Image.open(p)
    w, h = im.size
    box = (int(0.25 * w), int(0.15 * h), int(0.75 * w), int(0.75 * h))
    print(asin, im.size, avg(im, box))
