# brew — markdown → PHB-styled PDF (with local images)

Renders a Markdown adventure doc to a parchment/PHB-flavored PDF using your local
**Chrome** (`--headless --print-to-pdf`). No Puppeteer/Chromium download. **Local
images work** — purchased maps and your own art stay on disk; nothing is uploaded.

This is the *CLI / private* route. For the pixel-perfect official-book look, paste
into [Homebrewery](https://homebrewery.naturalcrit.com/) instead (but that needs
public image URLs). Use this when you want your local maps/art embedded with no hosting.

## Use

```bash
node tools/brew/brew.mjs <input.md> [output.pdf] [--strict] [--watch]
# e.g.
node tools/brew/brew.mjs rescue_at_the_moon_gate_module/RESCUE_AT_THE_MOON_GATE_GM_RUN_EDITION.md
```

Writes `<output>.pdf` and a matching `<output>.html` (open the HTML in a browser to
tweak styling live). Requires Chrome or Edge installed (auto-detected).

Flags can appear anywhere; the first two non-flag arguments are still
`<input.md>` and `[output.pdf]`.

## Pre-flight image check

Before launching Chrome, brew scans every **local** `<img src>` (remote
`http(s):` / `data:` / `file:` URLs are skipped) and reports what it found:

```
images: 12 ok, 2 MISSING (14 local images)
  MISSING  art/scenes/scene-3-village.png
  MISSING  art/portraits/captain-veyran.png
  large    05_maps/compound.png (8.4 MB) — may bloat the PDF
```

- Paths are shown **markdown-relative** (exactly as written in the doc).
- Any existing local image over **~6 MB** gets a `large` warning (it isn't
  resized — that would need an extra dependency; shrink it yourself, e.g. via
  the `generate-art` skill's optimise step).

### `--strict`

If **any** local image is missing, exit non-zero (code `2`) **before** rendering
so a broken doc fails CI. Without `--strict` (the default), brew just warns and
renders anyway (today's behavior), leaving broken `<img>` placeholders in the PDF.

### `--watch`

Re-render whenever the input `.md` **or** `tools/brew/phb-lite.css` changes
(debounced ~200 ms, so a burst of saves rebuilds once). Prints a timestamped line
per rebuild; press **Ctrl-C** to exit. Combine with `--strict` to keep failing
fast on missing art while iterating.

## Images

Paths are **relative to the markdown file** and resolved to absolute `file://` at
render time, so local files just work:

```markdown
<!-- full-width map/figure with a caption -->
<figure class="wide"><img src="05_maps/scene1/haven-cross.jpg"><figcaption>Haven Cross — player map</figcaption></figure>

<!-- or a plain markdown image with the .wide class -->
![Haven Cross](05_maps/scene1/haven-cross.jpg){.wide}

<!-- a floated NPC portrait -->
![Captain Veyran](../public/assets/characters/fighter-male-avatar.png){.portrait}
```

- `{.wide}` — full column-spanning map/figure (bordered, max ~4in tall).
- `{.portrait}` — small framed image floated to the right of the text.
- No class — normal inline image, max 100% width.

## Styling

`phb-lite.css` controls the look: aged-paper background, maroon **Cinzel** headers
with a gold rule, **EB Garamond** body, two columns, read-aloud boxes (markdown
`>` blockquotes), PHB tables, and the image classes above. Edit that file to taste.
Fonts load from Google Fonts (serif fallbacks if offline).

## Notes

- The PDF auto-paginates the two-column flow across Letter pages — no manual page
  breaks needed (unlike Homebrewery's `\page`).
- It styles **plain** Markdown (headers, blockquotes, tables, lists, images). It does
  **not** parse Homebrewery's `{{descriptive}}` / `{{monster}}` / `\page` dialect —
  feed it the plain `…GM_RUN_EDITION.md`, not the `…HOMEBREWERY.md`.
- Generated/missing art: see the `generate-art` skill.
