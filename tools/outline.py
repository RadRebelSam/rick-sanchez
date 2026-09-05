"""Sticker outline: black stroke hugging the cutout, then a white border outside it.

usage: python tools/outline.py in.png out.png [--black 3] [--white 10]
Widths are in pixels at the image's own resolution.
"""
import argparse
from PIL import Image, ImageFilter, ImageChops


def dilate(alpha, px):
    if px <= 0:
        return alpha
    size = px * 2 + 1
    return alpha.filter(ImageFilter.MaxFilter(size))


def outline(img, black=3, white=10):
    img = img.convert("RGBA")
    a = img.getchannel("A")
    # hard alpha so the strokes are crisp
    a_hard = a.point(lambda v: 255 if v > 60 else 0)
    black_a = dilate(a_hard, black)
    white_a = dilate(black_a, white)
    pad = black + white + 2
    w, h = img.size
    canvas = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    white_layer = Image.new("RGBA", img.size, (255, 255, 255, 255))
    white_layer.putalpha(white_a)
    black_layer = Image.new("RGBA", img.size, (12, 12, 16, 255))
    black_layer.putalpha(black_a)
    canvas.alpha_composite(white_layer, (pad, pad))
    canvas.alpha_composite(black_layer, (pad, pad))
    canvas.alpha_composite(img, (pad, pad))
    return canvas


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--black", type=int, default=3)
    ap.add_argument("--white", type=int, default=10)
    args = ap.parse_args()
    out = outline(Image.open(args.src), args.black, args.white)
    out.save(args.dst)
    print("wrote", args.dst, out.size)
