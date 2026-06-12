#!/usr/bin/env node
/**
 * find-missing-art — scan a Markdown or HTML doc for image references and report
 * which ones DON'T exist on disk (a generate-art worklist). Pure Node, no deps.
 *
 *   node find-missing-art.mjs <doc.md|doc.html> [--json]
 *
 * Extracts both Markdown images `![alt](src)` (incl. trailing `{.class}` /
 * `{width:…}`) and HTML `<img src="…">`. Each src is resolved RELATIVE TO THE
 * DOC. Remote (http/https/data/file:) refs are skipped — only local files are
 * checked. Exits non-zero if anything is missing (so it can gate CI).
 *
 * Output (default): a human worklist of the missing refs.
 * Output (--json):  { doc, total, ok, missing: [{ ref, resolved }], ... }
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";

const argv = process.argv.slice(2);
const JSON_OUT = argv.includes("--json");
const docArg = argv.find((a) => !a.startsWith("--"));

if (!docArg) {
  console.error("usage: node find-missing-art.mjs <doc.md|doc.html> [--json]");
  process.exit(1);
}
const docPath = resolve(docArg);
if (!existsSync(docPath) || !statSync(docPath).isFile()) {
  console.error(`not found (or not a file): ${docPath}`);
  process.exit(1);
}
const docDir = dirname(docPath);
const text = readFileSync(docPath, "utf8");

/** Skip remote / inline / absolute-protocol refs — we only check local files. */
function isLocal(src) {
  return !/^(https?:|data:|file:|mailto:|#)/i.test(src);
}

/** Strip a markdown image title: `path "Some Title"` → `path`. */
function stripTitle(src) {
  return src.replace(/\s+["'].*$/s, "").trim();
}

/**
 * Collect image refs in document order, de-duped, preserving first occurrence.
 * Returns array of raw src strings (still doc-relative, may contain `\`).
 */
function extractRefs(src) {
  const refs = [];
  const seen = new Set();
  const add = (raw) => {
    if (!raw) return;
    const cleaned = stripTitle(raw).replace(/\\/g, "/");
    if (!cleaned || seen.has(cleaned)) return;
    seen.add(cleaned);
    refs.push(cleaned);
  };

  // Markdown: ![alt](src) — src up to the first unescaped ) or whitespace+title.
  // (alt may contain brackets; we only need the (...) part.)
  const mdImg = /!\[[^\]]*\]\(\s*(<[^>]+>|[^)\s]+)([^)]*)\)/g;
  for (const m of src.matchAll(mdImg)) {
    let inner = m[1];
    if (inner.startsWith("<") && inner.endsWith(">")) inner = inner.slice(1, -1);
    add(inner);
  }

  // HTML: <img ... src="..."> or src='...'
  const htmlImg = /<img\b[^>]*?\ssrc\s*=\s*("([^"]*)"|'([^']*)')/gi;
  for (const m of src.matchAll(htmlImg)) {
    add(m[2] ?? m[3]);
  }

  return refs;
}

const allRefs = extractRefs(text);
const localRefs = allRefs.filter(isLocal);

const results = localRefs.map((ref) => {
  const resolved = resolve(docDir, ref);
  return { ref, resolved, exists: existsSync(resolved) };
});

const missing = results.filter((r) => !r.exists);
const okCount = results.length - missing.length;
const skipped = allRefs.length - localRefs.length;

if (JSON_OUT) {
  console.log(
    JSON.stringify(
      {
        doc: docPath,
        total: results.length,
        ok: okCount,
        missingCount: missing.length,
        skippedRemote: skipped,
        missing: missing.map((m) => ({
          ref: m.ref,
          resolved: m.resolved,
        })),
      },
      null,
      2,
    ),
  );
} else {
  const noun = results.length === 1 ? "local image" : "local images";
  console.log(`${relative(process.cwd(), docPath)} — ${results.length} ${noun} referenced`);
  console.log(`  ${okCount} ok, ${missing.length} MISSING${skipped ? `, ${skipped} remote (skipped)` : ""}`);
  if (missing.length) {
    console.log("\nWorklist (missing — needs generating):");
    for (const m of missing) console.log(`  - ${m.ref}`);
  } else {
    console.log("\nAll referenced local images exist. Nothing to generate.");
  }
}

process.exit(missing.length ? 1 : 0);
