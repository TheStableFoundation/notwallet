#!/usr/bin/env python3
"""NotWallet icon exploration, round 1. Deterministic: no clocks, no randomness.
usage: python3 round1.py OUTDIR   -> writes NN-name.svg and NN-name.dark.svg"""
import hashlib, os, sys

# Palette from tailwind.config.js. Single accent: secondary.light.
PURPLE, PURPLE_LIGHT, PURPLE_DARK = "#9932CC", "#A64DFF", "#800080"
ACCENT = "#C792EA"
WHITE = "#FFFFFF"

THEMES = {
    "light": dict(tile=PURPLE, fg=WHITE, accent="#EBD0FF", hole=PURPLE),
    "dark": dict(tile="#1A1028", fg=ACCENT, accent=PURPLE_LIGHT, hole="#1A1028"),
}

# N geometry on the 1024 canvas: cap box 272..752 x 232..792, stroke weight 140.
X0, X1, Y0, Y1, W = 272, 752, 232, 792, 140


def svg(body, tile, defs="", radius=224):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">'
            f'<defs>{defs}</defs><rect width="1024" height="1024" rx="{radius}" fill="{tile}"/>{body}</svg>')


def n_parts(fg, diag=None):
    """Left stem, right stem, diagonal, clipped to the letter box so terminals are clean cuts."""
    diag = diag or fg
    return (f'<clipPath id="box"><rect x="{X0}" y="{Y0}" width="{X1-X0}" height="{Y1-Y0}"/></clipPath>'
            f'<g clip-path="url(#box)">'
            f'<rect x="{X0}" y="{Y0}" width="{W}" height="{Y1-Y0}" fill="{fg}"/>'
            f'<rect x="{X1-W}" y="{Y0}" width="{W}" height="{Y1-Y0}" fill="{fg}"/>'
            f'<polygon points="{X0},{Y0} {X0+W},{Y0} {X1},{Y1} {X1-W},{Y1}" fill="{diag}"/></g>')


def d01(t): return svg(n_parts(t["fg"]), t["tile"])
def d02(t): return svg(n_parts(t["fg"], t["accent"]), t["tile"])


def d03(t):  # coin cut from the lower right stem: hidden idea, gone by 32 px
    mask = (f'<mask id="m"><rect width="1024" height="1024" fill="#fff"/>'
            f'<circle cx="{X1-W//2}" cy="{Y1-130}" r="34" fill="#000"/></mask>')
    return svg(f'<g mask="url(#m)">{n_parts(t["fg"])}</g>', t["tile"], mask)


def d04(t): return svg(f'<g transform="rotate(8 512 512)">{n_parts(t["fg"])}</g>', t["tile"])


def d05(t):  # inverted: light tile, purple letter
    if t is THEMES["dark"]:
        return svg(n_parts("#1A1028"), ACCENT)
    return svg(n_parts(PURPLE), "#F7ECFF")


def d06(t):  # the current idea rebuilt: four rising bars, padded, last one accent
    bars, x, bw, gap = "", 232, 112, 44
    for i, h in enumerate((260, 360, 470, 600)):
        fill = t["accent"] if i == 3 else t["fg"]
        bars += f'<rect x="{x + i*(bw+gap)}" y="{792-h}" width="{bw}" height="{h}" fill="{fill}"/>'
    return svg(bars, t["tile"])


def d07(t):  # N whose right stem rises above cap height, in the accent
    body = (n_parts(t["fg"]) +
            f'<rect x="{X1-W}" y="{Y0-100}" width="{W}" height="100" fill="{t["accent"]}"/>')
    return svg(body, t["tile"])


def d08(t):  # continuity with the current icon: gradient tile
    g = (f'<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">'
         f'<stop offset="0" stop-color="{"#A64DFF" if t is THEMES["light"] else "#2A1442"}"/>'
         f'<stop offset="1" stop-color="{PURPLE if t is THEMES["light"] else "#120A1E"}"/></linearGradient>')
    return svg(n_parts(t["fg"]), "url(#g)", g)


def d09(t):  # odd: a card with the letter inside
    card = (f'<rect x="152" y="292" width="720" height="440" rx="56" fill="{t["fg"]}"/>')
    inner = (f'<clipPath id="b2"><rect x="392" y="372" width="240" height="280"/></clipPath>'
             f'<g clip-path="url(#b2)"><rect x="392" y="372" width="70" height="280" fill="{t["tile"]}"/>'
             f'<rect x="562" y="372" width="70" height="280" fill="{t["tile"]}"/>'
             f'<polygon points="392,372 462,372 632,652 562,652" fill="{t["tile"]}"/></g>')
    return svg(card + inner, t["tile"])


def d10(t):  # odd: hairline N (expected to die at small sizes)
    w = 28
    return svg(f'<clipPath id="box"><rect x="{X0}" y="{Y0}" width="{X1-X0}" height="{Y1-Y0}"/></clipPath>'
               f'<g clip-path="url(#box)"><rect x="{X0}" y="{Y0}" width="{w}" height="{Y1-Y0}" fill="{t["fg"]}"/>'
               f'<rect x="{X1-w}" y="{Y0}" width="{w}" height="{Y1-Y0}" fill="{t["fg"]}"/>'
               f'<polygon points="{X0},{Y0} {X0+w},{Y0} {X1},{Y1} {X1-w},{Y1}" fill="{t["fg"]}"/></g>', t["tile"])


DIRECTIONS = {
    "01-n-solid": d01, "02-n-accent-diagonal": d02, "03-n-coin-cut": d03, "04-n-tilt": d04,
    "05-n-inverted": d05, "06-bars-rebuilt": d06, "07-n-rising-stem": d07, "08-n-gradient": d08,
    "09-odd-card": d09, "10-odd-hairline": d10,
}

if __name__ == "__main__":
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    h = hashlib.sha256()
    for name, fn in DIRECTIONS.items():
        for theme, suffix in (("light", ""), ("dark", ".dark")):
            s = fn(THEMES[theme])
            h.update(s.encode())
            open(os.path.join(out, f"{name}{suffix}.svg"), "w").write(s)
    print("checksum", h.hexdigest()[:16])
