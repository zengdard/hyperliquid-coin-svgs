# hyperliquid-coin-svgs

[![npm version](https://img.shields.io/npm/v/hyperliquid-coin-svgs.svg)](https://www.npmjs.com/package/hyperliquid-coin-svgs)
[![npm downloads](https://img.shields.io/npm/dm/hyperliquid-coin-svgs.svg)](https://www.npmjs.com/package/hyperliquid-coin-svgs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

SVG icons for all assets listed on [HyperLiquid](https://app.hyperliquid.xyz) (spot + perp).  
The SVGs are **bundled directly** in the package — no network requests at runtime.

📦 [View on npm](https://www.npmjs.com/package/hyperliquid-coin-svgs)

## Install

```sh
npm install hyperliquid-coin-svgs
```

## Usage

The package is split into entry points so you only pay for what you import.
The default entry contains **no SVG data** (a few KB).

### One icon (recommended)

```ts
import BTC from "hyperliquid-coin-svgs/BTC";
// or
import SOL from "hyperliquid-coin-svgs/SOL";

element.innerHTML = BTC;
```

Each asset is its own module (~1–3 KB), so bundlers include only the icons you
actually import. Asset names are the HyperLiquid symbols, case-sensitive:
`BTC`, `ETH`, `HYPE`, `kPEPE`, `USDC`, `0G`, …

### Several icons, loaded on demand

```ts
import { loadAsset } from "hyperliquid-coin-svgs/lazy";

const svg = await loadAsset("BTC"); // string | undefined
```

The ESM build uses real dynamic `import()` calls, so bundlers can code-split
one chunk per icon: the entry stays ~20 KB and only the requested icon is
fetched.

### CDN URL only (zero payload)

```ts
import { getAssetImage } from "hyperliquid-coin-svgs";

getAssetImage("BTC"); // "https://app.hyperliquid.xyz/coins/BTC.svg"
```

### Dynamic lookup by name (heavy, opt-in)

If you need to resolve *any* asset from a runtime string, import the full map.
This pulls every SVG into your bundle — prefer the options above when possible.

```ts
import { getAssetSvg, svgMap } from "hyperliquid-coin-svgs/svgMap";

getAssetSvg("BTC");  // string | undefined (case-insensitive)
svgMap["ETH"];       // raw map
```

### Listing available assets

```ts
import { assets, hasAsset } from "hyperliquid-coin-svgs";

assets;          // ["USDC", "PURR", "BTC", ...]
hasAsset("btc"); // true (case-insensitive)
```

## API

| Entry point | Export | Returns | Payload |
|---|---|---|---|
| `hyperliquid-coin-svgs` | `getAssetImage(asset)` | `string` (CDN URL) | none |
| `hyperliquid-coin-svgs` | `assets` | `readonly string[]` | ~4 KB |
| `hyperliquid-coin-svgs` | `hasAsset(asset)` | `boolean` | none |
| `hyperliquid-coin-svgs/lazy` | `loadAsset(asset)` | `Promise<string \| undefined>` | one icon |
| `hyperliquid-coin-svgs/<ASSET>` | default export | `string` (SVG) | one icon |
| `hyperliquid-coin-svgs/svgMap` | `getAssetSvg(asset)` | `string \| undefined` | all icons |
| `hyperliquid-coin-svgs/svgMap` | `svgMap` | `Record<string, string>` | all icons |

All entry points work with both `import` and `require`.

### React example

```tsx
import BTC from "hyperliquid-coin-svgs/BTC";

function CoinIcon() {
  return <span dangerouslySetInnerHTML={{ __html: BTC }} />;
}
```

### Vue example

```vue
<template>
  <span v-html="btc" />
</template>

<script setup>
import btc from "hyperliquid-coin-svgs/BTC";
</script>
```

## Migrating from v1

v1 exported a single `getAssetSvg` / `svgMap` pair from the root, which pulled
every SVG (~14 MB) into any bundle that imported anything.

| v1 | v2 |
|---|---|
| `getAssetSvg("BTC")` | `import BTC from "hyperliquid-coin-svgs/BTC"` or `getAssetSvg` from `hyperliquid-coin-svgs/svgMap` |
| `svgMap` | `svgMap` from `hyperliquid-coin-svgs/svgMap` |
| `getAssetImage("BTC")` | unchanged (root) |
| `assets` | unchanged (root) |

## How it works

The package uses HyperLiquid's public API to fetch the list of all spot and
perpetual assets, downloads the SVGs from
`https://app.hyperliquid.xyz/coins/<ASSET>.svg`, minifies them with SVGO, and
generates one TypeScript module per asset at build time. No network requests
happen when you import the package in your app.

The SVGs are auto-updated weekly via GitHub Actions (every Monday 06:00 UTC).

## Updating SVGs locally

```sh
# Fetch the latest asset list from HyperLiquid and re-download all SVGs
npm run fetch:live

# Regenerate sources from the SVGs already on disk (no network)
npm run regenerate

# Build and verify both CJS and ESM entry points
npm run build && npm test
```

## License

MIT
