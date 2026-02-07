/**
 * Detects which Remotion compositions need re-rendering based on changed files.
 *
 * Reads changed file paths from stdin (one per line).
 * Parses src/Root.tsx to map component imports to composition IDs.
 * Outputs space-separated composition IDs to stdout.
 */
import { readFileSync, existsSync } from "node:fs";

const input = readFileSync("/dev/stdin", "utf8").trim();
const changedFiles = input ? input.split("\n").filter(Boolean) : [];

if (changedFiles.length === 0) {
  process.exit(0);
}

const root = readFileSync("src/Root.tsx", "utf8");
const allIds = [...root.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);

// Core files or public assets changed → render all compositions
if (
  changedFiles.some(
    (f) =>
      f === "src/Root.tsx" ||
      f === "src/index.ts" ||
      f.startsWith("public/"),
  )
) {
  console.log(allIds.join(" "));
  process.exit(0);
}

// Build import map: local component name → source file path
const imports = {};
for (const m of root.matchAll(
  /import\s*\{([^}]+)\}\s*from\s*["']\.\/([^"']+)["']/g,
)) {
  const names = m[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const name of names) {
    const asMatch = name.match(/(\w+)\s+as\s+(\w+)/);
    const localName = asMatch ? asMatch[2] : name;
    for (const ext of [".tsx", ".ts"]) {
      const path = `src/${m[2]}${ext}`;
      if (existsSync(path)) {
        imports[localName] = path;
        break;
      }
    }
  }
}

// Match <Composition> declarations to changed files
const blocks = root.match(/<Composition[\s\S]*?\/>/g) || [];
const result = [];
for (const block of blocks) {
  const id = block.match(/id="([^"]+)"/)?.[1];
  const comp = block.match(/component=\{(\w+)\}/)?.[1];
  if (id && comp && imports[comp] && changedFiles.includes(imports[comp])) {
    result.push(id);
  }
}

if (result.length > 0) {
  console.log(result.join(" "));
}
