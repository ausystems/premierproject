"""Share images in full colour, for the site and for every blog post.

The studio still (the hero's first frame) sits under the mark, and each post's question is set over it
in Inter Tight, the site's typeface. A soft shade keeps the type readable; nothing is desaturated.

Run from the project root after adding a post:  python3 scripts/share-images.py
Needs Python 3 with Pillow, fontTools and brotli (pip install pillow fonttools brotli).
"""
import json
import os
import subprocess
import tempfile
from itertools import combinations

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

W, H, M = 1200, 630, 76
INK, PAPER = (11, 11, 11), (242, 242, 240)

# Pillow reads TrueType and the site ships WOFF2: unpack the variable font once into a temp file.
FONT = os.path.join(tempfile.gettempdir(), "project-premier-inter-tight.ttf")
if not os.path.exists(FONT):
    ttf = TTFont("public/fonts/inter-tight.woff2")
    ttf.flavor = None
    ttf.save(FONT)


def studio():
    """The hero still, cover-fitted to the card."""
    im = Image.open("public/project-premier-recording-studio-guitars.jpg").convert("RGB")
    scale = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    left, top = (im.width - W) // 2, (im.height - H) // 2
    return im.crop((left, top, left + W, top + H))


def shade(img, stops):
    """Darken towards ink along a vertical gradient; stops are (height fraction, opacity)."""
    mask = Image.new("L", (W, H))
    px = mask.load()
    for y in range(H):
        f = y / (H - 1)
        for (y0, a0), (y1, a1) in zip(stops, stops[1:]):
            if y0 <= f <= y1:
                a = a0 + (a1 - a0) * ((f - y0) / ((y1 - y0) or 1))
                break
        for x in range(W):
            px[x, y] = round(a * 255)
    return Image.composite(Image.new("RGB", (W, H), INK), img, mask)


def font(size):
    f = ImageFont.truetype(FONT, size)
    f.set_variation_by_axes([450])
    return f


def wrap(draw, text, f, width):
    """Fewest lines that fit, then the breaks that make those lines most even (no orphans)."""
    words = text.split()
    for n in range(1, 5):
        best = None
        for cuts in combinations(range(1, len(words)), n - 1):
            bounds = (0, *cuts, len(words))
            lines = [" ".join(words[bounds[i]:bounds[i + 1]]) for i in range(n)]
            widths = [draw.textlength(line, font=f) for line in lines]
            if max(widths) > width:
                continue
            score = max(widths) - min(widths)
            if best is None or score < best[0]:
                best = (score, lines)
        if best:
            return best[1]
    return [text]


def save(img, path):
    img.save(path, "JPEG", quality=86, optimize=True, progressive=True)
    print(path, os.path.getsize(path), "bytes")


mark = Image.open("public/project-premier-logo.png").convert("RGBA").crop((60, 21, 310, 241))

# The site's card: the studio in colour, the mark at its centre.
card = shade(studio(), [(0, 0.12), (0.5, 0.28), (1, 0.42)])
big = mark.resize((round(mark.width * 300 / mark.height), 300), Image.LANCZOS)
card.paste(big, ((W - big.width) // 2, (H - big.height) // 2 - 6), big)
save(card, "public/project-premier-youth-music-program-toronto.jpg")

# One card per post: the question over the studio, the mark above it, one string between.
posts = json.loads(subprocess.check_output([
    "node", "-e",
    'import("./src/content/posts.js").then(({POSTS}) => console.log(JSON.stringify(POSTS.map((p) => ({ slug: p.slug, title: p.title })))))',
]))
small = mark.resize((round(mark.width * 112 / mark.height), 112), Image.LANCZOS)
backdrop = shade(studio(), [(0, 0.15), (0.42, 0.35), (1, 0.78)])
os.makedirs("public/blog", exist_ok=True)
for post in posts:
    img = backdrop.copy()
    draw = ImageDraw.Draw(img)
    img.paste(small, (M - 6, M - 14), small)
    for size in (76, 70, 64, 58, 52):
        f = font(size)
        lines = wrap(draw, post["title"], f, W - 2 * M)
        if len(lines) <= 3:
            break
    lh = round(size * 1.04)
    y = H - M - lh * len(lines) + round(size * 0.12)
    rule = y - round(size * 0.55)
    draw.line([(M, rule), (W - M, rule)], fill=(150, 150, 146), width=1)
    for i, line in enumerate(lines):
        draw.text((M - 2, y + i * lh), line, font=f, fill=PAPER, anchor="la")
    save(img, f"public/blog/{post['slug']}.jpg")
