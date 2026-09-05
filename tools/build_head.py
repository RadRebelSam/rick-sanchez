"""Build the hero head layers from one transparent cutout of Rick.

usage: python tools/build_head.py <cutout.png> [--tear 0.27]

Steps: keep the largest opaque component (drops signatures/specks), split it
along a torn line into cap (top) and face (bottom), paint the pupils out of the
face and remember where they were, add the black+white sticker outline to both
layers, write assets/head-face.png + assets/head-cap.png, and patch styles.css
(.head-scene aspect, .head-face / .head-cap positions) and index.html (image
dimensions, pupil positions).
"""
import argparse
import re
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, "tools")
from cutout import fit_max, split_tear, tear_line, trim  # noqa: E402
from outline import outline  # noqa: E402

BLACK, WHITE = 4, 12
PAD = BLACK + WHITE + 2


def components(mask):
    H, W = mask.shape
    lab = np.zeros((H, W), int)
    comps = []
    cur = 0
    for y in range(H):
        for x in range(W):
            if mask[y, x] and lab[y, x] == 0:
                cur += 1
                q = deque([(y, x)])
                lab[y, x] = cur
                pts = []
                while q:
                    cy, cx = q.popleft()
                    pts.append((cy, cx))
                    for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
                        if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and lab[ny, nx] == 0:
                            lab[ny, nx] = cur
                            q.append((ny, nx))
                ys = [p[0] for p in pts]
                xs = [p[1] for p in pts]
                comps.append(dict(id=cur, n=len(pts), x0=min(xs), y0=min(ys), x1=max(xs) + 1, y1=max(ys) + 1))
    return lab, comps


def largest_component(img):
    a = np.array(img.convert("RGBA")).astype(int)
    al = a[..., 3]
    lab, comps = components(al > 60)
    big = max(comps, key=lambda c: c["n"])["id"]
    al[lab != big] = 0
    a[..., 3] = al
    return trim(Image.fromarray(a.astype("uint8"), "RGBA"))


def find_pupils(face, band=(0.05, 0.6), xband=(0, 1)):
    """Two dark blobs in the upper half: (x0,y0,x1,y1) each, left then right."""
    a = np.array(face.convert("RGBA")).astype(int)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    H, W = al.shape
    dark = ((r + g + b) < 200) & (al > 200)
    m = Image.fromarray((dark * 255).astype("uint8"))
    lab, comps = components(np.array(m) > 0)
    cands = [c for c in comps if 6 < c["n"] < 4000 and H * band[0] < c["y0"] < H * band[1] and W * xband[0] < c["x0"] < W * xband[1] and (c["x1"] - c["x0"]) < W * 0.12]
    print("pupil candidates", [(c["x0"], c["y0"], c["x1"], c["y1"], c["n"]) for c in cands][:12])
    # pupils are solid dots, not eye-outline rings
    cands = [c for c in cands if c["n"] / max(1, (c["x1"] - c["x0"]) * (c["y1"] - c["y0"])) > 0.5]
    # pupils are roughly round: width ~ height
    cands = [c for c in cands if 0.5 < (c["x1"] - c["x0"]) / max(1, c["y1"] - c["y0"]) < 2.0]
    # pick the pair that sits on the same row with similar size (two eyes), not the mouth
    best_pair, best_score = None, 1e9
    for i in range(len(cands)):
        for j in range(i + 1, len(cands)):
            a, b = cands[i], cands[j]
            dy = abs((a["y0"] + a["y1"]) - (b["y0"] + b["y1"])) / 2 / H
            dx = abs((a["x0"] + a["x1"]) - (b["x0"] + b["x1"])) / 2 / W
            size = abs(a["n"] - b["n"]) / max(a["n"], b["n"])
            if dy > 0.04 or dx < 0.03 or dx > 0.5:
                continue
            score = dy * 10 + size
            if score < best_score:
                best_pair, best_score = (a, b), score
    if not best_pair:
        raise SystemExit(f"pupil detection found no eye pair: {cands[:8]}")
    best = sorted(best_pair, key=lambda c: c["x0"])
    return [(c["x0"], c["y0"], c["x1"], c["y1"]) for c in best]


def find_pupils_by_whites(face, band=(0.05, 0.6), xband=(0, 1)):
    """Locate the two eye-white blobs, then the dark marks inside each = pupils."""
    a = np.array(face.convert("RGBA")).astype(int)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    H, W = al.shape
    white = (r > 225) & (g > 225) & (b > 225) & (al > 200)
    lab, comps = components(white)
    whites = [c for c in comps if c["n"] > 400 and H * band[0] < c["y0"] < H * band[1] and W * xband[0] < c["x0"] < W * xband[1]]
    whites.sort(key=lambda c: -c["n"])
    whites = sorted(whites[:2], key=lambda c: c["x0"])
    if len(whites) != 2:
        raise SystemExit(f"eye whites not found: {whites}")
    out = []
    for c in whites:
        region = lab[c["y0"]:c["y1"], c["x0"]:c["x1"]] == c["id"]
        sub = (r + g + b)[c["y0"]:c["y1"], c["x0"]:c["x1"]]
        # a pupil pixel is dark AND has eye-white on all four sides within the blob's box
        left = np.cumsum(region, axis=1) > 0
        right = np.cumsum(region[:, ::-1], axis=1)[:, ::-1] > 0
        up = np.cumsum(region, axis=0) > 0
        down = np.cumsum(region[::-1, :], axis=0)[::-1, :] > 0
        dark = (sub < 300) & left & right & up & down & ~region
        ys, xs = np.where(dark)
        if len(xs) == 0:
            raise SystemExit("no pupil inside eye white")
        out.append((c["x0"] + xs.min(), c["y0"] + ys.min(), c["x0"] + xs.max() + 1, c["y0"] + ys.max() + 1))
    return out


def eye_white_colour(face, box):
    """Sample the eye white just outside the pupil box."""
    x0, y0, x1, y1 = box
    px = face.convert("RGBA").getpixel((min(face.width - 1, x1 + 6), (y0 + y1) // 2))
    return px if px[3] > 200 else (248, 250, 246, 255)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--tear", type=float, default=0.27)
    ap.add_argument("--max", type=int, default=1100)
    ap.add_argument("--cap-x", default="0,1", help="fraction range of width the cap may occupy (keeps raised arms out of the cap)")
    ap.add_argument("--eye-band", default="0.05,0.6", help="fraction range of face height to search for pupils")
    ap.add_argument("--eye-x", default="0,1", help="fraction range of face width to search for pupils")
    ap.add_argument("--no-cap", action="store_true", help="no lid layer: the whole figure is the face layer")
    ap.add_argument("--keep-all", action="store_true", help="keep every opaque component (do not drop small detached bits)")
    ap.add_argument("--drop-cap", action="store_true", help="tear the top off and discard it (open skull, no lid layer)")
    ap.add_argument("--by-whites", action="store_true", help="find pupils as dark marks inside the two eye-white blobs")
    args = ap.parse_args()

    full = trim(Image.open(args.src).convert("RGBA")) if args.keep_all else largest_component(Image.open(args.src))
    full = fit_max(full, args.max)
    FW, FH = full.size

    # split along a torn line; outside --cap-x everything stays on the face layer
    y0 = 0 if args.no_cap else int(FH * args.tear)
    line = tear_line(FW, y0)
    face_mask = Image.new("L", (FW, FH), 0)
    ImageDraw.Draw(face_mask).polygon(line + [(FW, FH), (0, FH)], fill=255)
    cap_mask = Image.new("L", (FW, FH), 0)
    ImageDraw.Draw(cap_mask).polygon([(0, 0), (FW, 0)] + list(reversed(line)), fill=255)
    full_a = np.array(full.getchannel("A"))
    fm = np.array(face_mask)
    cm = np.array(cap_mask)
    cx0f, cx1f = (1.0, 1.0) if args.no_cap else [float(v) for v in args.cap_x.split(",")]
    xs = np.arange(FW)[None, :].repeat(FH, 0)
    outside = (xs < FW * cx0f) | (xs > FW * cx1f)
    fm = np.where(outside, 255, fm)
    cm = np.where(outside, 0, cm)
    face = full.copy(); face.putalpha(Image.fromarray(np.minimum(full_a, fm).astype("uint8")))
    cap = full.copy();  cap.putalpha(Image.fromarray(np.minimum(full_a, cm).astype("uint8")))
    fb = face.getchannel("A").getbbox()
    cb = cap.getchannel("A").getbbox() or (0, 0, 1, 1)
    face = face.crop(fb)
    cap = cap.crop(cb)

    eb = [float(v) for v in args.eye_band.split(",")]
    ex = [float(v) for v in args.eye_x.split(",")]
    pupils = find_pupils_by_whites(face, eb, ex) if args.by_whites else find_pupils(face, eb, ex)
    d = ImageDraw.Draw(face)
    for box in pupils:
        col = eye_white_colour(face, box)
        x0, y0, x1, y1 = box
        d.ellipse((x0 - 3, y0 - 3, x1 + 3, y1 + 3), fill=col)
    pupil_px = max(12, int(np.mean([(b[2] - b[0]) for b in pupils])))

    face_o = outline(face, BLACK, WHITE)
    cap_o = outline(cap, BLACK, WHITE)
    face_o.save("assets/head-face.png")
    if not (args.no_cap or args.drop_cap):
        cap_o.save("assets/head-cap.png")

    pct = lambda v, t: round(v / t * 100, 2)
    fx0, fy0 = fb[0] - PAD, fb[1] - PAD
    cx0, cy0 = cb[0] - PAD, cb[1] - PAD

    css = open("styles.css", encoding="utf8").read()
    css = re.sub(r"aspect-ratio: \d+ / \d+;\n  transform: translate\(-50%, -48%\);", f"aspect-ratio: {FW} / {FH};\n  transform: translate(-50%, -48%);", css)
    css = re.sub(r"\.head-face \{\n  left: [^;]+; top: [^;]+; width: [^;]+; z-index: 3;", f".head-face {{\n  left: {pct(fx0, FW)}%; top: {pct(fy0, FH)}%; width: {pct(face_o.width, FW)}%; z-index: 3;", css)
    if not (args.no_cap or args.drop_cap):
        css = re.sub(r"\.head-cap  \{ left: [^;]+; top: [^;]+; width: [^;]+;", f".head-cap  {{ left: {pct(cx0, FW)}%; top: {pct(cy0, FH)}%; width: {pct(cap_o.width, FW)}%;", css)
    psize = pct(pupil_px * 1.05, face_o.width)
    css = re.sub(r"\.pupil \{ position: absolute; width: [^;]+; aspect-ratio: 1; margin: [^;]+;", f".pupil {{ position: absolute; width: {psize}%; aspect-ratio: 1; margin: -{psize/2:.2f}% 0 0 -{psize/2:.2f}%;", css)
    open("styles.css", "w", encoding="utf8").write(css)

    html = open("index.html", encoding="utf8").read()
    if not (args.no_cap or args.drop_cap):
        html = re.sub(r'(id="headCap"[^>]*width=")\d+(" height=")\d+', lambda m: m.group(1) + str(cap_o.width) + m.group(2) + str(cap_o.height), html)
    html = re.sub(r'(src="assets/head-face\.png"[^>]*width=")\d+(" height=")\d+', lambda m: m.group(1) + str(face_o.width) + m.group(2) + str(face_o.height), html)
    for cls, box in zip(("pupil-l", "pupil-r"), pupils):
        cx = (box[0] + box[2]) / 2 + PAD
        cy = (box[1] + box[3]) / 2 + PAD
        html = re.sub(r'(class="pupil ' + cls + r'" style=")[^"]*"', lambda m: m.group(1) + f"left:{pct(cx, face_o.width)}%;top:{pct(cy, face_o.height)}%\"", html)
    open("index.html", "w", encoding="utf8").write(html)

    prev = Image.new("RGB", (face_o.width + cap_o.width + 60, max(face_o.height, cap_o.height) + 40), (120, 70, 70))
    prev.paste(cap_o, (20, 20), cap_o)
    prev.paste(face_o, (cap_o.width + 40, 20), face_o)
    prev.thumbnail((900, 600))
    prev.save("assets/raw/_head_check.jpg")
    print("full", (FW, FH), "face", face_o.size, "cap", cap_o.size, "pupils", pupils, "pupil px", pupil_px)


if __name__ == "__main__":
    main()
