---
name: generate-art
description: Fill missing art for the D&D adventure + characters — NPC portraits, scene establishing art, monsters, the cover, handout props, and Foundry tokens. Wraps the design-assets:ai-image-generator skill with this project's house style, ready-to-use prompt templates, aspect ratios, save locations, and a "what's missing" checklist, so generated art is consistent and drops straight into the GM doc (Homebrewery or the brew CLI) or Foundry. Use whenever a doc references an image that doesn't exist yet, when theming the module, or when the user asks to "generate/make/fill in art, portraits, a cover, a map, or tokens."
---

# Generate Adventure Art

Reliably fill images that don't exist yet for **Stillwater Hold** (and the
pregen characters), in a single consistent style that sits well on parchment and
drops into the GM docs or Foundry.

> **Note on the rename:** this adventure was formerly "Rescue at the Moon Gate."
> The compound is now **Stillwater Hold**, and the place/location references
> (the village, the cistern, the perimeter) follow from that. The **cast** is
> unchanged — Marn, Edrin, Captain Veyran, Mother Reed, the Prince, Sergeant
> Pell, Clerk Saben, Nera, Tailor Mirel. The on-disk module dir is still
> `rescue_at_the_moon_gate_module/` (it may be renamed later — adjust the save
> paths below if/when it is).

## Engine + prerequisites

This skill is the **art direction**; the **engine** is the registered
`design-assets:ai-image-generator` skill (Gemini / OpenAI image APIs). It needs an
API key in the environment — set **one** before generating:

- `GEMINI_API_KEY` — scenes, portraits, monsters (best painterly results, cheap).
- `OPENAI_API_KEY` — the cover/anything with **readable text** (GPT Image 2), and
  **transparent** Foundry tokens (GPT Image 1.5).

If no key is set, stop and tell the user which to set (aistudio.google.com/apikey
or platform.openai.com/api-keys) — don't fabricate images.

### API-key preflight

Check the key for the model you're about to use **before** building prompts, and
fail clearly with the signup URL. Quick check:

```bash
# Gemini path (scenes / portraits / monsters)
[ -n "$GEMINI_API_KEY" ] || { echo "Set GEMINI_API_KEY → https://aistudio.google.com/apikey"; exit 1; }

# OpenAI path (cover / readable text / transparent tokens)
[ -n "$OPENAI_API_KEY" ] || { echo "Set OPENAI_API_KEY → https://platform.openai.com/api-keys"; exit 1; }
```

Or in Node (matches the script style in `scripts/`):

```js
const key = process.env.GEMINI_API_KEY; // or OPENAI_API_KEY for the cover/tokens
if (!key) {
  console.error("Missing GEMINI_API_KEY — get one at https://aistudio.google.com/apikey");
  process.exit(1); // OPENAI_API_KEY → https://platform.openai.com/api-keys
}
```

Only check the key that the chosen model needs — Gemini work doesn't require an
OpenAI key, and vice-versa. (Battlemaps via `generate-map` need **no** key.)

**Model pick:** Gemini for art with no text · GPT Image 2 for the cover/title or any
labels · GPT Image 1.5 (`background:"transparent"`) for cut-out tokens. Verify
current model IDs (they change) — see the ai-image-generator skill.

### Maps — no API key required
**Battlemaps** are the exception: the Foundry MCP bridge tool
`mcp__foundry-mcp__generate-map` runs **D&D Battlemaps SDXL** on the bridge's own
backend (no key param), creating the scene directly in Foundry. Use it for any
scene/battlemap — keyless, and the output is *your* art (safe to host/share, unlike
purchased maps). The generated file also lands in the Foundry data dir, so it can be
referenced as a local image in the brew CLI doc. Reserve the keyed image API for
**portraits, the cover, monster art, handout props, and tokens** — `generate-map`
only does top-down battlemaps.

## House style — prepend this to every prompt

Consistency comes from a shared style preamble. Put the **subject** after it.

> **STYLE:** Painterly high-fantasy illustration in the style of a classic D&D
> sourcebook — soft ink linework with loose watercolour washes, muted earthy palette
> (parchment tan, oxblood red, iron grey, moss green, candle gold), warm low-key
> lighting, slightly desaturated so it reads on aged paper. Hand-painted, textured,
> not glossy or 3D-rendered. Grounded medieval-fantasy world, no modern elements.
> **No text, no watermarks, no borders, no UI.**

(For the cover only, allow title text and use GPT Image 2.)

## Art types — templates, ratios, where to save

Save under `rescue_at_the_moon_gate_module/art/<type>/` (the current module dir —
may be renamed when the dir is renamed for Stillwater Hold; keep it pointed at the
real module dir). Create subfolders as needed; tokens go to the character art
namespace. Use kebab-case names matching the doc reference.

| Type | Ratio | Model | Save to |
|---|---|---|---|
| NPC / PC portrait (bust) | 3:4 | Gemini | `art/portraits/<name>.png` |
| Scene establishing art | 16:9 | Gemini | `art/scenes/scene-<n>-<slug>.png` |
| Monster (the tracker) | 4:3 | Gemini | `art/monsters/<name>.png` |
| Cover splash (with title) | 3:4 | GPT Image 2 | `art/cover.png` |
| Handout prop (ledger, token, note) | varies | Gemini | `art/handouts/<name>.png` |
| Foundry token (transparent, top-down or bust) | 1:1 | GPT Image 1.5 | `public/assets/characters/<class>-<gender>-token.png` |

**Portrait template:** *STYLE… A head-and-shoulders portrait of [who: age, build, dress, expression, one telling detail]. Plain shadowed background. Warm candlelight from one side.*

**Scene template:** *STYLE… A wide establishing shot of [place + time of day + mood]. [2–3 concrete details]. Atmospheric depth, a clear focal point, room for tokens (uncluttered foreground).*

**Cover template (GPT Image 2):** *A D&D adventure cover. [evocative scene: the Stillwater Hold compound at night, a thin servant at the treeline]. Title "Stillwater Hold" in an ornate fantasy serif at the top; "Game Master's Edition" small beneath. Painterly, oxblood-and-gold palette.*

**Transparent token (GPT Image 1.5):** *STYLE… A [top-down circular | bust] token of [who]. Centered, isolated subject, **transparent background**, clean edges, no base ring.* Set `background:"transparent"`, `output_format:"png"`.

## Workflow

1. **Find the gap.** A doc references an image that 404s, a scene/NPC has no art, or the user asks. Run the auto-detector (below) to list what's missing, then cross-check against the backlog checklist.
2. **Pick model + ratio** from the table. Confirm the API key for that model is set.
3. **Build the prompt:** style preamble + the type template + specifics. One subject per image; end with the exclusions.
4. **Generate** via the ai-image-generator skill's API call. For exploration, GPT Image 2 can batch 10 variants.
5. **QA** (optional but recommended): send the result to a vision model — "AI artifacts? off-style? text leaking in?" Regenerate with the issue appended as negative guidance.
6. **Save** to the location above; optimize if large (`Pillow` → WebP, or resize maps so the PDF stays reasonable).
7. **Wire it in:**
   - **Homebrewery:** images need a public URL — host the file (e.g. GitHub raw) and use `![](url){width:…}`. Fine for your own art; **don't** publicly host purchased maps.
   - **brew CLI** (`tools/brew`): just reference the local path — `![alt](art/scenes/scene-1.png){.wide}` or `{.portrait}`. No hosting; renders into the PDF.
   - **Foundry:** drop transparent tokens into the token namespace; the importer applies class art automatically (see the bundle convention below).

### Bundle asset-manifest wiring (Foundry auto-import)

Foundry pulls art in via the **character-forge** module (the importer lives at
`../character-forge` — don't edit it; just follow its convention). The convention
is **path + naming**, not a hand-maintained list: save into the bundle's character
art namespace with the names the importer expects, and it wires the art on import.

- **Tokens / portraits → `public/assets/characters/`**, kebab-case as
  `<class>-<gender>-token.png` and `<class>-<gender>-avatar.png`. On import,
  `-token` becomes the actor's **prototype token** and `-avatar` becomes the
  **portrait** — automatically, no per-file config. (Transparent PNGs for tokens.)
- **NPC / scene / handout art** that ships with the module stays under the module's
  `art/<type>/` dir and is referenced from the doc by relative path; the bundle's
  asset manifest carries those paths so they travel with the export. Match the
  filename to the doc reference (kebab-case) so nothing dangles.
- After saving, run `find-missing-art.mjs` against the doc to confirm every
  reference resolves before you export/import the bundle.

## Auto "what's-missing" detection

Don't eyeball it — let a script build the worklist. `scripts/find-missing-art.mjs`
(pure Node, no deps) scans a `.md` or `.html` doc, extracts every image reference
(`![](…)` **and** `<img src="…">`), resolves each one **relative to the doc**, and
prints the refs that don't exist on disk. Remote (`http(s):` / `data:` / `file:`)
refs are skipped; duplicate refs are de-duped. Exit code is non-zero when anything
is missing, so it can gate a build.

```bash
# human worklist
node skills/generate-art/scripts/find-missing-art.mjs \
  rescue_at_the_moon_gate_module/RESCUE_AT_THE_MOON_GATE_GM_RUN_EDITION.md

# machine-readable (for piping / CI)
node skills/generate-art/scripts/find-missing-art.mjs path/to/doc.html --json
```

It pairs with the **brew CLI's** own pre-flight (`tools/brew/brew.mjs` reports
`images: N ok, M MISSING` and `--strict` fails the render) — use this script to
plan the art *before* you render, and brew's pre-flight to catch regressions *at*
render time. Run it against the GM run-edition doc (or the generated `.html`) to
get the current backlog, then generate down the list.

## What's missing for Stillwater Hold

A ready backlog to fill (verify against the auto-detector — many may not exist yet):

- **Cover** — the Stillwater Hold compound at night / a servant at the treeline (GPT Image 2, with title).
- **Cast portraits** — Marn (nervous, coin-counting, hopeful), Edrin (a groom, shown only as a memory/effects), Captain Veyran (gloved, cold), Mother Reed (kind old washerwoman — nothing overtly monstrous), the Prince, Sergeant Pell, Clerk Saben, Nera, Tailor Mirel.
- **Scene art** — one establishing shot per scene (road ambush, shade house, village wash-lane with the cistern, the Stillwater Hold perimeter wall, the compound interior, the cell block, the night escape, the dawn epilogue).
- **The Slithering Tracker** — a semiliquid ooze with a half-formed grieving face surfacing in it (Appendix C).
- **Handout flavor** — aged ledger page, Mother Reed's vial-token, Marn's note (as textured props; the *text* stays typeset).
- **Portrait/token gaps** — any pregen lacking art, or transparent Foundry tokens for the NPCs above.

## Guardrails

- One API key required; never invent images without it.
- Keep the **style preamble** on every prompt so the set matches.
- Don't render text via Gemini (it can't) — use GPT Image 2 for the cover/labels.
- Purchased maps: generate *replacements* if you want shareable art, but never publicly host the commercial originals.
- QA faces (hags/NPCs): Mother Reed should look *kind*, not monstrous — the horror is the reveal, not the portrait.
