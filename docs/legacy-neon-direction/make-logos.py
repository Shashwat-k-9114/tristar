"""
TRISTAR logo-system generator (concept stage — NOT approved final logos).

Single source of truth for every logo vector. Emits:
  public/brand/*.svg          standalone concept files
  src/components/brand/paths.ts   the same geometry for inline React use

Letterforms: TRISTAR wordmark is hand-constructed (monoline geometry, no font).
Segment wordmarks are outlined from OFL Google fonts (Rozha One, Syne, Instrument Serif)
so the SVGs have no font dependency. Run:  python scripts/make-logos.py <fontdir>
"""
import json, math, os, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

FONTDIR = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_SVG = os.path.join(ROOT, "public", "brand")
OUT_TS = os.path.join(ROOT, "src", "components", "brand", "paths.ts")
os.makedirs(OUT_SVG, exist_ok=True)
os.makedirs(os.path.dirname(OUT_TS), exist_ok=True)

# ── Palette (concept) ───────────────────────────────────────────
INK = "#0A0806"
BONE = "#F3EDE2"
EMBER, COPPER, GOLD = "#FF6A1F", "#C26A2E", "#FFB938"
CORAL, PINK, FRY = "#FF4B5C", "#FF2D95", "#F2B544"
LIME, FOREST, BRONZE = "#C8FF3A", "#0F3B26", "#B4773A"


def f(n):
    return f"{n:.1f}".rstrip("0").rstrip(".")


def outline(fontfile, text, size_cap, tracking=0, skew=0.0, replace=None):
    """Return (list of (char, d, x0, x1), total_width, cap_height_units) with baseline y=0 (up = -y)."""
    font = TTFont(os.path.join(FONTDIR, fontfile))
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    cap = getattr(font["OS/2"], "sCapHeight", 0) or 700
    k = size_cap / cap
    x = 0
    out = []
    for ch in text:
        gname = cmap[ord(ch)]
        g = gs[gname]
        pen = SVGPathPen(gs, ntos=f)
        # flip y; optional skew so slanted wordmarks stay on one baseline
        tp = TransformPen(pen, (k, 0, skew * -k, -k, x, 0))
        g.draw(tp)
        out.append((ch, pen.getCommands(), x, x + g.width * k))
        x += g.width * k + tracking
    return out, x - tracking, size_cap


# ─────────────────────────────────────────────────────────────
# TRISTAR — parent identity
# ─────────────────────────────────────────────────────────────
SW = 16  # stroke weight of the constructed wordmark


def tristar_wordmark():
    """Monoline, cap height 100. The A's crossbar is split into three bars: one per kitchen."""
    parts = []  # (role, d, kind) kind: 'stroke' | 'fill'
    x = 0
    gap = 22

    def add(d):
        parts.append(("ink", d, "stroke"))

    # T
    add(f"M{x} 8H{x+68}M{x+34} 8V100"); x += 68 + gap
    # R
    add(f"M{x+8} 100V8H{x+38}Q{x+60} 8 {x+60} 30Q{x+60} 52 {x+38} 52H{x+8}M{x+36} 52L{x+62} 100"); x += 68 + gap
    # I
    add(f"M{x+8} 0V100"); x += 16 + gap
    # S
    add(
        f"M{x+54} 22Q{x+54} 8 {x+32} 8Q{x+8} 8 {x+8} 28Q{x+8} 46 {x+32} 50"
        f"Q{x+56} 54 {x+56} 72Q{x+56} 92 {x+32} 92Q{x+8} 92 {x+6} 76"
    ); x += 62 + gap
    # T
    add(f"M{x} 8H{x+68}M{x+34} 8V100"); x += 68 + 8
    # A — apex + legs; crossbar in three brand-colour segments
    ax = x
    add(f"M{ax+2} 100L{ax+38} 4L{ax+74} 100")
    bar_y = 70
    seg = 17
    x0 = ax + 38 - 25.5
    parts.append(("a", f"M{x0} {bar_y}h{seg}", "stroke"))
    parts.append(("b", f"M{x0+17} {bar_y}h{seg}", "stroke"))
    parts.append(("c", f"M{x0+34} {bar_y}h{seg}", "stroke"))
    x += 76 + 12
    # R
    add(f"M{x+8} 100V8H{x+38}Q{x+60} 8 {x+60} 30Q{x+60} 52 {x+38} 52H{x+8}M{x+36} 52L{x+62} 100"); x += 68
    return parts, x  # width


def tristar_mark():
    """Three blades, 120° apart, tip outward — three kitchens meeting at one point. Viewbox 100x100."""
    blades = []
    cx, cy = 47, 58
    for ang, role in ((0, "a"), (120, "b"), (240, "c")):
        pts = [(0, 0), (0, -48), (25, -13)]
        a = math.radians(ang)
        rot = [(cx + px * math.cos(a) - py * math.sin(a), cy + px * math.sin(a) + py * math.cos(a)) for px, py in pts]
        d = "M" + "L".join(f"{f(px)} {f(py)}" for px, py in rot) + "Z"
        blades.append((role, d, "fill"))
    return blades


def svg_doc(vb, body, bg=None, title=""):
    w, h = vb
    bgrect = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(w)} {f(h)}" role="img" aria-label="{title}">'
        f"<title>{title}</title>{bgrect}{body}</svg>"
    )


def render(parts, colors, transform=""):
    s = []
    for role, d, kind in parts:
        c = colors[role]
        if kind == "stroke":
            s.append(f'<path d="{d}" fill="none" stroke="{c}" stroke-width="{SW}" stroke-linejoin="miter" stroke-miterlimit="8"/>')
        else:
            s.append(f'<path d="{d}" fill="{c}"/>')
    return f'<g{(" transform=" + chr(34) + transform + chr(34)) if transform else ""}>' + "".join(s) + "</g>"


registry = {}  # name -> {viewBox:[w,h], parts:[[role,d,kind]]}

# Parent wordmark
wm, wm_w = tristar_wordmark()
registry["tristarWordmark"] = {"viewBox": [wm_w, 100], "parts": wm, "stroke": SW}
mk = tristar_mark()
registry["tristarMark"] = {"viewBox": [100, 100], "parts": mk}

# Parent lockup: mark left of wordmark
lock_parts = []
scale = 1.0
mk_scaled = [(r, d, k) for r, d, k in mk]
registry["tristarLockup"] = {"viewBox": [wm_w + 150, 100], "mark": mk, "wordmarkOffset": 130}

cols_parent = {"ink": BONE, "a": EMBER, "b": CORAL, "c": LIME}
with open(os.path.join(OUT_SVG, "tristar-mark.svg"), "w") as fh:
    fh.write(svg_doc((100, 100), render(mk, cols_parent), BG := INK, "TRISTAR mark (concept)"))
with open(os.path.join(OUT_SVG, "tristar-wordmark.svg"), "w") as fh:
    pad = 24
    body = render(wm, cols_parent, f"translate({pad},{pad})")
    fh.write(svg_doc((wm_w + pad * 2, 100 + pad * 2), body, INK, "TRISTAR wordmark (concept)"))
with open(os.path.join(OUT_SVG, "tristar-lockup.svg"), "w") as fh:
    pad = 24
    body = render(mk, cols_parent, f"translate({pad},{pad})") + render(wm, cols_parent, f"translate({pad+130},{pad})")
    fh.write(svg_doc((wm_w + 130 + pad * 2, 100 + pad * 2), body, INK, "TRISTAR lockup (concept)"))

# ─────────────────────────────────────────────────────────────
# BIRYANI — heat / aroma / fire. Rozha One, handi with lifted lid, rising steam
# ─────────────────────────────────────────────────────────────
glyphs, w, cap = outline("rozha.ttf", "BIRYANI", 100, tracking=6)
b_word = [("ink", "".join(d for _, d, _, _ in glyphs), "fill")]
# emblem (viewBox 0 0 120 110): pot body, rim, lifted lid, knob, steam, heat arcs
b_emb = [
    ("b", "M16 64Q16 108 60 108Q104 108 104 64Z", "fill"),                      # handi body (copper)
    ("c", "M10 64H110V72H10Z", "fill"),                                          # rim (gold)
    ("a", "M30 54Q30 30 62 30Q94 30 94 54Z", "fill"),                            # lid (ember) — drawn then rotated in render
    ("c", "M58 18H70V30H58Z", "fill"),                                           # knob
]
steam = [
    "M42 20Q32 12 42 4Q52 -4 42 -12",
    "M60 14Q50 6 60 -2Q70 -10 60 -18",
    "M78 20Q68 12 78 4Q88 -4 78 -12",
]
registry["biryaniLogo"] = {
    "word": {"viewBox": [w, cap], "d": b_word[0][1]},
    "emblem": {"viewBox": [-4, -22, 128, 132], "parts": b_emb, "steam": steam},
}
bw_pad = 30
emb_w, emb_h = 128, 132
canvas_w = max(w, emb_w) + bw_pad * 2
ex = (canvas_w - emb_w) / 2 + 4
body = (
    f'<g transform="translate({f(ex-40)},{bw_pad+30}) scale(1.6)">'
    + "".join(f'<path d="{d}" fill="none" stroke="{EMBER}" stroke-width="5.5" stroke-linecap="round"/>' for d in steam)
    + render(b_emb[:2], {"a": EMBER, "b": COPPER, "c": GOLD})
    + render(b_emb[2:], {"a": EMBER, "b": COPPER, "c": GOLD}, "translate(14,-14) rotate(-16 94 54)")
    + "</g>"
    + f'<g transform="translate({f((canvas_w-w)/2)},{bw_pad+30+176+40+cap})"><path d="{b_word[0][1]}" fill="{BONE}"/></g>'
)
H = bw_pad + 30 + 176 + 40 + cap + bw_pad
with open(os.path.join(OUT_SVG, "biryani-logo.svg"), "w") as fh:
    fh.write(svg_doc((canvas_w, H), body, "#14100D", "BIRYANI logo concept"))

# ─────────────────────────────────────────────────────────────
# SAMOSA — crunch / energy / impact. Syne ExtraBold, the O is a broken samosa triangle
# ─────────────────────────────────────────────────────────────
glyphs, w, cap = outline("syne.ttf", "SAMOSA", 100, tracking=4, skew=0.0)
# build with the 4th char (O) swapped for a triangle of the same advance
parts_d, tri = [], None
for ch, d, x0, x1 in glyphs:
    if ch == "O":
        tri = (x0, x1)
    parts_d.append(d)
x0, x1 = tri
tw = x1 - x0
# triangle with a zig-zag "bitten" hypotenuse; sits on baseline (y=0), height = cap
tri_main = f"M{f(x0+tw*0.27)} -{cap*0.2}L{f(x0+tw/2)} -{cap*0.78}L{f(x1-tw*0.27)} -{cap*0.2}Z"
crack = (
    f"M{f(x0+tw*0.5)} -{cap*0.76}L{f(x0+tw*0.44)} -{cap*0.6}L{f(x0+tw*0.55)} -{cap*0.5}"
    f"L{f(x0+tw*0.47)} -{cap*0.38}L{f(x0+tw*0.53)} -{cap*0.26}"
)
registry["samosaLogo"] = {
    "word": {"viewBox": [w, cap], "d": "".join(parts_d), "triangle": tri_main, "crack": crack, "triX": [x0, x1]},
}
pad = 30
slant = -10  # skewX
cw = w + pad * 2 + 24
H = cap + pad * 2
body = (
    f'<g transform="translate({pad+12},{pad+cap}) skewX({slant})">'
    f'<path d="{"".join(parts_d)}" fill="{BONE}"/>'
    f'<path d="{tri_main}" fill="{CORAL}"/>'
    f'<path d="{crack}" fill="none" stroke="#0D0A0C" stroke-width="3.5" stroke-linejoin="miter"/>'
    f"</g>"
    f'<g transform="skewX({slant})"><rect x="{pad+36}" y="{pad+cap+14}" width="{f(w)}" height="7" fill="{PINK}"/></g>'
)
with open(os.path.join(OUT_SVG, "samosa-logo.svg"), "w") as fh:
    fh.write(svg_doc((cw, H + 22), body, "#0D0A0C", "SAMOSA logo concept"))

# ─────────────────────────────────────────────────────────────
# THALI — feast / abundance / comfort. Overhead plate of six bowls + Instrument Serif
# ─────────────────────────────────────────────────────────────
glyphs, w, cap = outline("instr-i.ttf", "Thali", 64, tracking=2)
t_word = "".join(d for _, d, _, _ in glyphs)
# emblem viewBox 0 0 120 120: plate ring, six katori, centre
cx = cy = 60
bowls = []
for i in range(6):
    a = math.radians(i * 60 - 90)
    bowls.append((cx + 33 * math.cos(a), cy + 33 * math.sin(a)))
registry["thaliLogo"] = {
    "word": {"viewBox": [w, cap], "d": t_word},
    "emblem": {"viewBox": [120, 120], "bowls": [[round(x, 1), round(y, 1)] for x, y in bowls]},
}
pad = 30
cw = max(w, 120) + pad * 2
emb = (
    f'<g transform="translate({f((cw-120)/2)},{pad})">'
    f'<circle cx="60" cy="60" r="57" fill="none" stroke="{BRONZE}" stroke-width="3"/>'
    f'<circle cx="60" cy="60" r="50" fill="{FOREST}" stroke="{LIME}" stroke-width="1.5"/>'
    + "".join(f'<circle cx="{f(x)}" cy="{f(y)}" r="12" fill="none" stroke="{LIME}" stroke-width="3"/>' for x, y in bowls)
    + f'<circle cx="60" cy="60" r="13" fill="{LIME}"/>'
    + "</g>"
)
body = emb + f'<g transform="translate({f((cw-w)/2)},{pad+120+34+cap})"><path d="{t_word}" fill="{BONE}"/></g>'
H = pad + 120 + 34 + cap + pad
with open(os.path.join(OUT_SVG, "thali-logo.svg"), "w") as fh:
    fh.write(svg_doc((cw, H), body, "#07140D", "THALI logo concept"))

# ── TS export ──
with open(OUT_TS, "w", encoding="utf-8") as fh:
    fh.write("// GENERATED by scripts/make-logos.py — do not edit by hand.\n")
    fh.write("// Concept-stage logo geometry; final logos require owner approval.\n")
    fh.write("export const logoGeometry = " + json.dumps(registry, separators=(",", ":")) + " as const;\n")
print("ok", {k: (v.get("viewBox") or v.get("word", {}).get("viewBox")) for k, v in registry.items()})
