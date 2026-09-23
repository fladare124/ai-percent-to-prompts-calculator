import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const host = "percenttoprompts.com";
const keyLocation = `https://${host}/indexnow-key.txt`;
const key = readFileSync(
  path.join(__dirname, "../public/indexnow-key.txt"),
  "utf8",
).trim();
const urls = [...new Set(process.argv.slice(2))];

if (urls.length === 0) {
  console.error("Pass one or more canonical https://percenttoprompts.com URLs.");
  process.exit(1);
}

for (const value of urls) {
  let url;
  try {
    url = new URL(value);
  } catch {
    console.error(`Invalid URL: ${value}`);
    process.exit(1);
  }

  if (url.protocol !== "https:" || url.hostname !== host || url.search || url.hash) {
    console.error(`URL must be a canonical HTTPS page on ${host}: ${value}`);
    process.exit(1);
  }
}

fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
})
  .then(async (response) => {
    if (!response.ok) {
      const detail = await response.text();
      console.error(`IndexNow returned HTTP ${response.status}: ${detail}`);
      process.exitCode = 1;
      return;
    }

    console.log(`IndexNow accepted ${urls.length} URLs (HTTP ${response.status}).`);
  })
  .catch((error) => {
    console.error(`IndexNow request failed: ${error.message}`);
    process.exitCode = 1;
  });
