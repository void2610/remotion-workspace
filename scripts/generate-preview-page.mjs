/**
 * Generates an HTML preview page for rendered Remotion videos.
 *
 * Reads composition IDs from the COMPOSITIONS environment variable (space-separated).
 * Writes _site/index.html with embedded video players.
 */
import { writeFileSync, mkdirSync } from "node:fs";

const compositions = (process.env.COMPOSITIONS || "")
  .split(/\s+/)
  .filter(Boolean);

if (compositions.length === 0) {
  console.error("No compositions specified in COMPOSITIONS env var");
  process.exit(1);
}

const videoCards = compositions
  .map(
    (id) => `    <div class="video-card">
      <h2>${id}</h2>
      <video controls muted loop>
        <source src="${id}.mp4" type="video/mp4">
      </video>
    </div>`,
  )
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Remotion Video Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0a; color: #fff; font-family: system-ui, sans-serif; padding: 2rem; }
    .container { max-width: 1280px; margin: 0 auto; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; color: #a5b4fc; text-align: center; }
    .meta { text-align: center; color: #6b7280; font-size: 0.875rem; margin-bottom: 2rem; }
    .video-card { margin-bottom: 2rem; }
    .video-card h2 { font-size: 1.25rem; color: #c7d2fe; margin-bottom: 0.5rem; }
    video { width: 100%; max-width: 1280px; border-radius: 12px; box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3); }
    a { color: #818cf8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Remotion Video Preview</h1>
    <p class="meta">Rendered with <a href="https://remotion.dev">Remotion</a> via GitHub Actions</p>
${videoCards}
  </div>
</body>
</html>`;

mkdirSync("_site", { recursive: true });
writeFileSync("_site/index.html", html);
console.log(`Generated preview page with ${compositions.length} video(s)`);
