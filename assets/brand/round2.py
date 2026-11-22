#!/usr/bin/env python3
"""NotWallet icon exploration, round 2. Imports round 1 geometry. Deterministic.
usage: python3 round2.py OUTDIR"""
import hashlib, os, sys
import round1 as r1
from round1 import THEMES, PURPLE, ACCENT, svg, n_parts, X0, X1, Y0, Y1, W

DEEP = "#4B1272"          # a darker purple than the OneNote-like #9932CC square


def bars(t, heights, x0, bw, gap, accent_last=True, base=792, extra=""):
    out = ""
    for i, h in enumerate(heights):
        fill = t["accent"] if (accent_last and i == len(heights) - 1) else t["fg"]
        out += f'<rect x="{x0 + i*(bw+gap)}" y="{base-h}" width="{bw}" height="{h}" fill="{fill}"/>'
    return out + extra


def b1(t):  # three rising bars, accent tallest: the simplest chart
    return svg(bars(t, (280, 440, 620), 262, 150, 50), t["tile"])


def b2(t):  # five bars with the dip of today's icon, padded, last bar accent
    return svg(bars(t, (300, 400, 220, 500, 620), 212, 96, 36), t["tile"])


def b3(t):  # four rising bars on a baseline rule
    rule = f'<rect x="212" y="812" width="600" height="28" fill="{t["fg"]}"/>'
    return svg(bars(t, (240, 340, 460, 580), 232, 112, 40, base=788, extra=rule), t["tile"])


def b4(t):  # four rising bars in a circle container (no square tile at all)
    body = bars(t, (200, 290, 390, 500), 292, 96, 32, base=732)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">'
            f'<circle cx="512" cy="512" r="512" fill="{t["tile"]}"/>{body}</svg>')


def n_deep(t):  # 02 on a deeper tile: further from the OneNote purple
    tile = DEEP if t is THEMES["light"] else "#1A1028"
    return svg(n_parts(t["fg"], ACCENT if t is THEMES["light"] else t["accent"]), tile)


def n_circle(t):  # 02 in a circle container
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">'
            f'<circle cx="512" cy="512" r="512" fill="{t["tile"]}"/>{n_parts(t["fg"], t["accent"])}</svg>')


def n_split(t):  # white N on a tile split along its own diagonal
    a, b = (PURPLE, "#7A1FA6") if t is THEMES["light"] else ("#241438", "#120A1E")
    split = (f'<clipPath id="tile"><rect width="1024" height="1024" rx="224"/></clipPath>'
             f'<polygon points="0,1024 1024,0 1024,1024" fill="{b}" clip-path="url(#tile)"/>')
    return svg(split + n_parts(t["fg"], t["fg"]), a)


def n_underline(t):  # N with an accent rule under it: a ledger line
    rule = f'<rect x="{X0}" y="{Y1+60}" width="{X1-X0}" height="40" fill="{t["accent"]}"/>'
    return svg(f'<g transform="translate(0,-40)">{n_parts(t["fg"])}{rule}</g>', t["tile"])


DIRECTIONS = {
    "01-bars-three": b1, "02-bars-five-dip": b2, "03-bars-baseline": b3, "04-bars-circle": b4,
    "05-n-deep-tile": n_deep, "06-n-circle": n_circle, "07-n-split-tile": n_split, "08-n-underline": n_underline,
}

if __name__ == "__main__":
    out = sys.argv[1]; os.makedirs(out, exist_ok=True); h = hashlib.sha256()
    for name, fn in DIRECTIONS.items():
        for theme, suffix in (("light", ""), ("dark", ".dark")):
            s = fn(THEMES[theme]); h.update(s.encode())
            open(os.path.join(out, f"{name}{suffix}.svg"), "w").write(s)
    print("checksum", h.hexdigest()[:16])
