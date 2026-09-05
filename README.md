# Rick Sanchez — fan site, made with Motion.page

Live: https://ricksanchez.radrebeldeveloper.com

A fan-made concept site for the smartest man in the universe, built as an entry
for the [Motion.page animation contest](https://motion.page/contest/). Layout
and motion language are inspired by [trevornoah.com](https://www.trevornoah.com/)
by itsoffbrand. Every animation is a Motion.page Builder timeline; the site
itself is plain HTML and CSS with no framework and no build step.

## What moves

- Page-load intro: name letters flip in, portal spins up, Rick's skull opens and
  his gadgets pop out of it
- Pupils that follow the mouse, gadgets and portal parallax on mouse move
- Scroll-scrubbed hero: name fades, gadgets fly, wordmark appears
- Watch section: cards fly in, then the flask tilts and pours. The liquid is a
  separate masked layer that counter-rotates so its surface stays level
- Wubba Lubba Dub-Dub scroll marquee, split-line reveals on every section,
  per-card 3D tilt on hover, hover-to-expand "New Season" card, fanned shop
  cards, full-screen menu, footer face

18 timelines in total, all authored in Motion.page Desktop and published into
`mp-timeline.js`.

## Files

| File | Purpose |
|---|---|
| `index.html`, `styles.css` | the page |
| `terms.html` | disclaimer and takedown contact |
| `script.js` | menu overlay and the theme-music button only, no animation code |
| `mp-sdk.js`, `mp-timeline.js` | Motion.page runtime and the published timelines |
| `assets/` | cutouts, props, official links' key art, favicon, theme sting |
| `tools/` | helpers used during the build (see below) |

## Tools

Python 3 with Pillow and numpy, Node with Playwright.

- `tools/cutout.py` flat-background removal and torn-edge split
- `tools/outline.py` black stroke + white sticker border
- `tools/build_head.py` builds the hero head layers and the tracking pupils from a cutout
- `tools/install_bundle.py` installs a Motion.page `site_publish` result and fixes the
  mouse-axis node split
- `tools/verify.mjs`, `tools/eyes.mjs`, `tools/pour.mjs` Playwright screenshots
  used to check the animations

## Run locally

```bash
python -m http.server 5177
```

Open http://localhost:5177/.

## Rights

Fan project. Not affiliated with Adult Swim, Cartoon Network or Warner Bros.
Discovery. Rick and Morty and all characters are trademarks of their owners.
Character art is fan art or AI-generated for this project; the episode still and
Season 9 key art are reproduced from adultswim.com only to link to the official
content. See `terms.html`. The HTML, CSS and tool scripts in this repo are MIT;
the artwork and audio are not.
