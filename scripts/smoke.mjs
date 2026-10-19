// Smoke test for the published package surface.
//
// Guards against the bug that shipped in 1.0.2: an extensionless ESM import
// inside a CommonJS package, which made BOTH `require` and `import` fail.
// Also checks the v2 split entry points (light root, per-asset, lazy, svgMap).
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

// 1. CommonJS root (must stay light: no svgMap, no loaders).
const cjs = require(join(dist, "index.js"));
assert.equal(typeof cjs.getAssetImage, "function", "getAssetImage missing (cjs)");
assert.equal(typeof cjs.hasAsset, "function", "hasAsset missing (cjs)");
assert.ok(Array.isArray(cjs.assets) && cjs.assets.length > 0, "assets empty (cjs)");
assert.equal(cjs.svgMap, undefined, "root entry should not expose svgMap");
assert.equal(cjs.loadAsset, undefined, "root entry should not expose loadAsset");
assert.equal(
  cjs.getAssetImage("btc"),
  "https://app.hyperliquid.xyz/coins/BTC.svg",
  "getAssetImage wrong (cjs)",
);
assert.equal(cjs.hasAsset("btc"), true, "hasAsset('btc') should be true");
assert.equal(cjs.hasAsset("NOT_A_COIN"), false, "hasAsset(unknown) should be false");

// 2. ES module root (must resolve without ERR_MODULE_NOT_FOUND).
const esm = await import(join(dist, "index.js"));
assert.equal(typeof esm.getAssetImage, "function", "getAssetImage missing (esm)");
assert.ok(esm.assets.includes("BTC"), "BTC missing from assets (esm)");

// 3. Per-asset module (`export =` so `require()` returns the string directly
//    and `import BTC from ...` also yields the string).
const btc = require(join(dist, "assets", "BTC.js"));
assert.ok(btc.includes("<svg"), "per-asset BTC did not export SVG (cjs)");
const btcEsm = await import(join(dist, "assets", "BTC.js"));
assert.ok(btcEsm.default.includes("<svg"), "per-asset BTC did not export SVG (esm)");

// 4. Lazy loader.
const lazy = require(join(dist, "lazy.js"));
assert.equal(lazy.hasAsset("btc"), true, "hasAsset('btc') should be true");
assert.equal(lazy.hasAsset("NOT_A_COIN"), false, "hasAsset(unknown) should be false");
assert.ok((await lazy.loadAsset("sol"))?.includes("<svg"), "loadAsset('sol') failed");
assert.equal(await lazy.loadAsset("NOT_A_COIN"), undefined, "loadAsset(unknown) failed");

// 4b. Mixed-case symbols must keep working case-insensitively.
for (const symbol of ["kPEPE", "KPEPE", "kpepe", "0G", "0g"]) {
  assert.equal(cjs.hasAsset(symbol), true, `hasAsset('${symbol}') should be true`);
  assert.ok(
    (await lazy.loadAsset(symbol))?.includes("<svg"),
    `loadAsset('${symbol}') failed`,
  );
}

// 5. Opt-in heavy map.
const map = require(join(dist, "svgMap.js"));
assert.equal(typeof map.getAssetSvg, "function", "getAssetSvg missing (svgMap)");
assert.ok(map.getAssetSvg("eth")?.includes("<svg"), "getAssetSvg('eth') failed");
assert.equal(
  Object.keys(map.svgMap).length,
  map.assets.length,
  "svgMap and assets disagree",
);

console.log(
  `OK — ${esm.assets.length} assets; root, per-asset, lazy and svgMap entry points work (CJS + ESM).`,
);
