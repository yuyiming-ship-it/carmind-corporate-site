import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, resolve } from "node:path";

const root = process.cwd();
const distDir = resolve(root, "dist");
const publicDir = resolve(root, "public");
const htmlPath = resolve(distDir, "index.html");
const outputPath = resolve(root, "Carmind-官网-对外分享版.html");

const mimeTypes = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".m4v": "video/x-m4v",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const dataUriCache = new Map();

function assetFile(assetPath) {
  const cleanPath = assetPath.split(/[?#]/, 1)[0];
  const normalized = cleanPath.replace(/^\//, "");
  const searchRoots = normalized.startsWith("media/") ? [publicDir, distDir] : [distDir, publicDir];

  for (const searchRoot of searchRoots) {
    const filePath = resolve(searchRoot, normalized);
    if (existsSync(filePath) && statSync(filePath).isFile()) return filePath;
  }

  return null;
}

function toDataUri(assetPath) {
  if (assetPath.startsWith("data:") || /^(https?:|mailto:|tel:|#)/.test(assetPath)) return assetPath;
  if (dataUriCache.has(assetPath)) return dataUriCache.get(assetPath);

  const filePath = assetFile(assetPath);
  if (!filePath) return assetPath;

  const mime = mimeTypes[extname(filePath).toLowerCase()];
  if (!mime) return assetPath;

  const dataUri = `data:${mime};base64,${readFileSync(filePath).toString("base64")}`;
  dataUriCache.set(assetPath, dataUri);
  return dataUri;
}

function inlineStaticAssets(source) {
  return source.replace(
 /https?:\/\/[^\s"'`()\\<>]+|((?:\/)?(?:(?:media|assets)\/[^\s"'`()\\]+?\.(?:avif|gif|ico|jpe?g|m4v|mp4|png|svg|webp|woff2?)|favicon\.svg))(?:[?#][^\s"'`()\\]+)?/gi,
    (assetPath) => toDataUri(assetPath),
  );
}

function inlineStyles(html) {
  return html.replace(/<link\b[^>]*href=["']([^"']+\.css)["'][^>]*>/gi, (_match, href) => {
    const stylesheet = assetFile(href);
    if (!stylesheet) return _match;
    return `<style>\n${inlineStaticAssets(readFileSync(stylesheet, "utf8"))}\n</style>`;
  });
}

function inlineScripts(html) {
  return html.replace(/<script\b([^>]*)\bsrc=["']([^"']+\.js)["']([^>]*)><\/script>/gi, (_match, before, src, after) => {
    const scriptFile = assetFile(src);
    if (!scriptFile) return _match;
    const script = inlineStaticAssets(readFileSync(scriptFile, "utf8")).replace(/<\/script/gi, "<\\/script");
    const attributes = `${before} ${after}`.replace(/\s+/g, " ").trim();
    return `<script${attributes ? ` ${attributes}` : ""}>\n${script}\n</script>`;
  });
}

if (!existsSync(htmlPath)) {
  throw new Error("Missing dist/index.html. Run the Vite build first.");
}

let html = readFileSync(htmlPath, "utf8");
html = inlineStyles(html);
html = inlineScripts(html);
html = inlineStaticAssets(html);
html = html.replace(
  "<head>",
  "<head>\n    <!-- Self-contained Carmind shareable build: styles, scripts, and media are embedded. -->",
);

writeFileSync(outputPath, html);
console.log(`Created ${outputPath}`);
