import { readFile, writeFile } from "node:fs/promises";

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  throw new Error("Usage: node normalize-analytics.mjs <input> <output>");
}

const data = JSON.parse(await readFile(inputPath, "utf8"));
if (
  data.windowDays !== 30 ||
  !Array.isArray(data.byEvent) ||
  !Array.isArray(data.byCountry) ||
  !Array.isArray(data.bySource) ||
  !Array.isArray(data.byPage)
) {
  throw new Error("The analytics API returned an unexpected response.");
}

const safeSnapshot = {
  windowDays: 30,
  generatedAt: data.generatedAt || new Date().toISOString(),
  sourceStatus: "live_api",
  privacy: data.privacy,
  totals: data.totals,
  byEvent: data.byEvent,
  byCountry: data.byCountry,
  byContinent: data.byContinent || [],
  bySource: data.bySource,
  byReferrer: data.byReferrer || [],
  byTarget: data.byTarget || [],
  byPage: data.byPage,
  daily: data.daily || []
};

await writeFile(outputPath, `${JSON.stringify(safeSnapshot, null, 2)}\n`, "utf8");
