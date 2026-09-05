"""Install a Motion.page site_publish result into the site.

usage: python tools/install_bundle.py <path-to-site_publish-result.json>

Writes mp-timeline.js and mp-sdk.js, then applies one fix to the generated
code: for mouseMove timelines in Axis mode the builder emits, per node, an
`axis: 'x'` entry carrying BOTH x and y values and an empty `axis: 'y'` entry.
The SDK drives axis-x entries from mouse X and axis-y entries from mouse Y, so
the y values are moved into the axis-y entry. Nothing else is changed.
"""
import json
import re
import sys

src = sys.argv[1]
data = json.loads(open(src, encoding="utf8").read())["data"]
code = data["code"]
open("mp-sdk.js", "w", encoding="utf8").write(data["sdkBundle"])


def split_props(block):
    """'{ x: '-70%', y: '-45%' }' -> ({x}, {y}) as strings."""
    inner = block.strip()[1:-1]
    parts = [p.strip() for p in re.split(r",(?![^(]*\))", inner) if p.strip()]
    xs = [p for p in parts if p.startswith("x:")]
    ys = [p for p in parts if p.startswith("y:")]
    other = [p for p in parts if not (p.startswith("x:") or p.startswith("y:"))]
    return xs + other, ys


pair = re.compile(
    r"(\{ target: '(?P<t>[^']+)', from: (?P<from>\{[^}]*\}), to: (?P<to>\{[^}]*\}), duration: (?P<d>[\d.]+), ease: '(?P<e>[^']+)', axis: 'x', position: (?P<p>[\d.]+) \}),\n"
    r"  \{ target: '(?P=t)', duration: (?P=d), axis: 'y', position: (?P=p) \}"
)


def fix(m):
    fx, fy = split_props(m.group("from"))
    tx, ty = split_props(m.group("to"))
    if not fy and not ty:
        return m.group(0)
    t, d, e, p = m.group("t"), m.group("d"), m.group("e"), m.group("p")
    x_line = f"{{ target: '{t}', from: {{ {', '.join(fx)} }}, to: {{ {', '.join(tx)} }}, duration: {d}, ease: '{e}', axis: 'x', position: {p} }}"
    y_line = f"  {{ target: '{t}', from: {{ {', '.join(fy)} }}, to: {{ {', '.join(ty)} }}, duration: {d}, ease: '{e}', axis: 'y', position: {p} }}"
    return x_line + ",\n" + y_line


patched, n = pair.subn(fix, code)
open("mp-timeline.js", "w", encoding="utf8").write(patched)
names = re.findall(r"Motion\('([^']+)'", patched)
print(f"installed {len(names)} timelines, {n} mouse-axis node pairs fixed")
