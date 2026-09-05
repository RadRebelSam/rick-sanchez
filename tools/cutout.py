"""
Asset pipeline for the Rick site.

Usage:
  python tools/cutout.py <input> <output.png> [--tear TOP_FRACTION] [--trim] [--max SIZE]

Steps:
  1. Remove the flat navy background by flood-filling from the image border
     (keeps navy areas that are enclosed inside the subject).
  2. Optional --trim crops to the alpha bounding box with a small margin.
  3. Optional --tear splits the image into two files along a jagged line at
     TOP_FRACTION of the height: <output>-face.png (bottom, with torn top edge)
     and <output>-cap.png (top, with torn bottom edge).
  4. Optional --max resizes so the longest side is SIZE px.
"""
import sys, random, math
from collections import deque
from PIL import Image, ImageFilter, ImageDraw

def parse_args(argv):
    args = {"tear": None, "trim": False, "max": None, "tol": 42}
    pos = []
    i = 0
    while i < len(argv):
        a = argv[i]
        if a == "--tear":
            args["tear"] = float(argv[i + 1]); i += 2
        elif a == "--trim":
            args["trim"] = True; i += 1
        elif a == "--max":
            args["max"] = int(argv[i + 1]); i += 2
        elif a == "--tol":
            args["tol"] = int(argv[i + 1]); i += 2
        else:
            pos.append(a); i += 1
    return pos, args

def remove_flat_bg(img, tol):
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()
    # Background colour estimated from the four corners.
    corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    bg = tuple(sum(c[k] for c in corners) // 4 for k in range(3))

    def close(p):
        return (abs(p[0] - bg[0]) + abs(p[1] - bg[1]) + abs(p[2] - bg[2])) <= tol

    mask = Image.new("L", (w, h), 255)  # 255 = keep
    mpx = mask.load()
    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if close(px[x, y]) and not seen[y * w + x]:
                seen[y * w + x] = 1; q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if close(px[x, y]) and not seen[y * w + x]:
                seen[y * w + x] = 1; q.append((x, y))
    while q:
        x, y = q.popleft()
        mpx[x, y] = 0
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and close(px[nx, ny]):
                seen[ny * w + nx] = 1; q.append((nx, ny))

    # Soften the edge by one pixel and shrink slightly to kill the navy fringe.
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    out = img.copy()
    out.putalpha(mask)
    return out

def trim(img, margin=12):
    bbox = img.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    if not bbox:
        return img
    l, t, r, b = bbox
    l = max(0, l - margin); t = max(0, t - margin)
    r = min(img.width, r + margin); b = min(img.height, b + margin)
    return img.crop((l, t, r, b))

def tear_line(w, y0, seed=7):
    """Jagged torn-paper polyline across the width at height y0."""
    rnd = random.Random(seed)
    pts = []
    x = 0
    amp = max(6, w * 0.035)
    while x <= w:
        jitter = rnd.uniform(-amp, amp) + math.sin(x / w * math.pi * 6) * amp * 0.4
        pts.append((x, y0 + jitter))
        x += rnd.uniform(w * 0.012, w * 0.03)
    pts.append((w, y0 + rnd.uniform(-amp, amp)))
    return pts

def split_tear(img, frac):
    w, h = img.size
    y0 = int(h * frac)
    line = tear_line(w, y0)
    # Bottom (face): keep below the line.
    face_mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(face_mask)
    d.polygon(line + [(w, h), (0, h)], fill=255)
    # Top (cap): keep above the line.
    cap_mask = Image.new("L", (w, h), 0)
    d2 = ImageDraw.Draw(cap_mask)
    d2.polygon([(0, 0), (w, 0)] + list(reversed(line)), fill=255)

    a = img.getchannel("A")
    face = img.copy(); face.putalpha(Image.fromarray(__import__("numpy").minimum(__import__("numpy").array(a), __import__("numpy").array(face_mask))))
    cap = img.copy();  cap.putalpha(Image.fromarray(__import__("numpy").minimum(__import__("numpy").array(a), __import__("numpy").array(cap_mask))))
    return trim(face), trim(cap)

def fit_max(img, size):
    if size and max(img.size) > size:
        s = size / max(img.size)
        img = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    return img

def main():
    pos, args = parse_args(sys.argv[1:])
    src, dst = pos[0], pos[1]
    img = Image.open(src)
    img = remove_flat_bg(img, args["tol"])
    if args["trim"]:
        img = trim(img)
    img = fit_max(img, args["max"])
    if args["tear"] is not None:
        face, cap = split_tear(img, args["tear"])
        base = dst[:-4] if dst.lower().endswith(".png") else dst
        face.save(base + "-face.png", optimize=True)
        cap.save(base + "-cap.png", optimize=True)
        print("wrote", base + "-face.png", face.size, "and", base + "-cap.png", cap.size)
    else:
        img.save(dst, optimize=True)
        print("wrote", dst, img.size)

if __name__ == "__main__":
    main()
