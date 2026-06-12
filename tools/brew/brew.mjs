#!/usr/bin/env node
/**
 * brew — render a Markdown adventure doc to a PHB-styled PDF using the local
 * Chrome (headless --print-to-pdf). No Puppeteer/Chromium download. Local images
 * work: relative `![](path)` is resolved to an absolute file:// URL, and
 * `![alt](src){.wide}` / `{.portrait}` apply the phb-lite image classes.
 *
 *   node brew.mjs <input.md> [output.pdf] [flags]
 *
 * Flags (may appear anywhere; the first two non-flag args stay input/output):
 *   --strict   exit non-zero BEFORE rendering if any local image is missing.
 *   --watch    re-render whenever the input .md or phb-lite.css changes.
 *
 * Also writes <output>.html beside the PDF (open it in a browser to tweak live).
 */
import { readFileSync, writeFileSync, existsSync, statSync, watch } from "node:fs";
import { dirname, resolve, basename, extname, join, relative } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import MarkdownIt from "markdown-it";

const LARGE_IMAGE_BYTES = 6 * 1024 * 1024; // ~6 MB → warn (PDF bloat)
const WATCH_DEBOUNCE_MS = 200;

// --- arg parsing (flags tolerant of position) ---------------------------------
const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith("--")));
const positional = argv.filter((a) => !a.startsWith("--"));
const [inArg, outArg] = positional;
const STRICT = flags.has("--strict");
const WATCH = flags.has("--watch");

const KNOWN_FLAGS = new Set(["--strict", "--watch"]);
const unknown = [...flags].filter((f) => !KNOWN_FLAGS.has(f));
if (unknown.length) {
  console.error(`unknown flag(s): ${unknown.join(", ")}`);
  console.error("usage: node brew.mjs <input.md> [output.pdf] [--strict] [--watch]");
  process.exit(1);
}

if (!inArg) {
  console.error("usage: node brew.mjs <input.md> [output.pdf] [--strict] [--watch]");
  process.exit(1);
}
const inPath = resolve(inArg);
if (!existsSync(inPath)) {
  console.error(`not found: ${inPath}`);
  process.exit(1);
}
const mdDir = dirname(inPath);
const outPdf = resolve(outArg ?? join(mdDir, basename(inPath, extname(inPath)) + ".pdf"));
const outHtml = outPdf.replace(/\.pdf$/i, ".html");
const cssPath = join(dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "phb-lite.css");

const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  process.env.LOCALAPPDATA ? `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe` : null,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].filter(Boolean);
const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error("No Chrome/Edge found for --print-to-pdf. Install Chrome or edit CHROME_CANDIDATES.");
  process.exit(1);
}

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

/** Human-readable file size. */
function fmtSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

/**
 * Render the markdown → HTML, resolving local <img src> to file:// URLs and
 * applying {.class} markers. Returns { html, images } where images is the
 * pre-flight report for local images.
 */
function buildHtml() {
  let body = md.render(readFileSync(inPath, "utf8"));

  // `![alt](src){.wide}` → add the class to the preceding <img>
  body = body.replace(/<img([^>]*?)>\s*\{\.([a-z0-9_-]+)\}/gi, (_m, attrs, cls) => `<img${attrs} class="${cls}">`);

  const images = []; // { src, abs, exists, size }

  // resolve relative image src → absolute file:// (so Chrome loads local maps/art)
  body = body.replace(/<img([^>]*?)\ssrc="([^"]+)"([^>]*)>/gi, (m, pre, src, post) => {
    if (/^(https?:|data:|file:)/i.test(src)) return m; // remote/inline — not our concern
    const abs = resolve(mdDir, src.replace(/\\/g, "/"));
    const exists = existsSync(abs);
    let size = 0;
    if (exists) {
      try {
        size = statSync(abs).size;
      } catch {
        size = 0;
      }
    }
    images.push({ src, abs, exists, size });
    return `<img${pre} src="${pathToFileURL(abs).href}"${post}>`;
  });

  const css = existsSync(cssPath) ? readFileSync(cssPath, "utf8") : "";
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body class="phb">${body}</body></html>`;
  return { html, images };
}

/**
 * Print the pre-flight summary and return the list of missing images.
 * Also warns on oversized local images.
 */
function preflight(images) {
  const missing = images.filter((i) => !i.exists);
  const ok = images.length - missing.length;
  const noun = images.length === 1 ? "image" : "images";

  if (missing.length === 0) {
    console.log(`images: ${ok} ok, 0 MISSING (${images.length} local ${noun})`);
  } else {
    console.log(`images: ${ok} ok, ${missing.length} MISSING (${images.length} local ${noun})`);
    for (const i of missing) {
      console.log(`  MISSING  ${i.src}`);
    }
  }

  // large-image warning (only existing files have a real size)
  const large = images.filter((i) => i.exists && i.size > LARGE_IMAGE_BYTES);
  for (const i of large) {
    console.warn(`  large    ${i.src} (${fmtSize(i.size)}) — may bloat the PDF`);
  }

  return missing;
}

/** Render once. Returns true on success, false on failure (non-strict). */
function renderOnce() {
  const { html, images } = buildHtml();
  const missing = preflight(images);

  if (missing.length && STRICT) {
    console.error(`--strict: ${missing.length} missing image(s); aborting before render.`);
    if (!WATCH) process.exit(2);
    return false;
  }

  writeFileSync(outHtml, html, "utf8");

  const args = [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=12000",
    `--print-to-pdf=${outPdf}`,
    pathToFileURL(outHtml).href,
  ];
  console.log(`brewing → ${outPdf}`);
  const r = spawnSync(chrome, args, { encoding: "utf8" });
  if (r.status !== 0) {
    console.error("Chrome failed:", r.stderr || r.error || r.status);
    if (!WATCH) process.exit(1);
    return false;
  }
  if (existsSync(outPdf)) {
    console.log(`done: ${outPdf}\n  (html: ${outHtml})`);
    return true;
  }
  console.log("Chrome ran but no PDF was produced");
  return false;
}

// --- run ----------------------------------------------------------------------
renderOnce();

if (WATCH) {
  console.log(`watching ${relative(process.cwd(), inPath)} and phb-lite.css (Ctrl-C to exit)…`);
  let timer = null;
  const rebuild = (label) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      console.log(`\n[${new Date().toLocaleTimeString()}] change in ${label} → rebuilding`);
      renderOnce();
    }, WATCH_DEBOUNCE_MS);
  };

  // Watch the input .md. Some editors replace the file (rename), so also keep a
  // directory watcher as a fallback for the md basename.
  try {
    watch(inPath, () => rebuild(basename(inPath)));
  } catch (e) {
    console.warn(`! could not watch ${inPath}: ${e.message}`);
  }
  const mdName = basename(inPath);
  watch(mdDir, (_evt, fname) => {
    if (fname && fname === mdName) rebuild(mdName);
  });

  // Watch the CSS.
  if (existsSync(cssPath)) {
    try {
      watch(cssPath, () => rebuild("phb-lite.css"));
    } catch (e) {
      console.warn(`! could not watch ${cssPath}: ${e.message}`);
    }
  }

  // Keep the process alive until Ctrl-C.
  process.stdin.resume?.();
  process.on("SIGINT", () => {
    console.log("\nbye");
    process.exit(0);
  });
}
