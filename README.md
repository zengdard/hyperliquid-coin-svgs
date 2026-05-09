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

```ts
import { getAssetImage, getAssetSvg, assets, svgMap } from "hyperliquid-coin-svgs";

// URL to the SVG on HyperLiquid's CDN (no dependency needed)
getAssetImage("BTC");   // "https://app.hyperliquid.xyz/coins/BTC.svg"
getAssetImage("eth");   // lowercase also works

// SVG content as a string (bundled in the package)
getAssetSvg("BTC");     // '<svg xmlns="..." viewBox="0 0 ...">...</svg>'
getAssetSvg("SOL");     // '<svg width="56" height="56"...'

// List all available assets (231 coins have SVGs)
console.log(assets);    // ["BTC", "ETH", "SOL", "HYPE", ...]

// Raw map if you prefer
svgMap["BTC"];          // same as getAssetSvg("BTC")
```

### React example

```tsx
import { getAssetSvg } from "hyperliquid-coin-svgs";

function CoinIcon({ asset }: { asset: string }) {
  const svg = getAssetSvg(asset);
  if (!svg) return null;
  return <span dangerouslySetInnerHTML={{ __html: svg }} />;
}
```

### Vue example

```vue
<template>
  <span v-html="getAssetSvg(asset)" />
</template>

<script setup>
import { getAssetSvg } from "hyperliquid-coin-svgs";
defineProps({ asset: String });
</script>
```

## API

| Function | Returns | Description |
|---|---|---|
| `getAssetImage(asset)` | `string` | CDN URL of the SVG |
| `getAssetSvg(asset)` | `string \| undefined` | Inline SVG content |
| `assets` | `readonly string[]` | All assets with available SVGs |
| `svgMap` | `Record<string, string>` | Raw asset → SVG map |

## How it works

The package uses HyperLiquid's public API to fetch the list of all spot and perpetual assets, downloads the SVGs from `https://app.hyperliquid.xyz/coins/<ASSET>.svg`, and bundles them into a TypeScript source file at build time. No network requests happen when you import the package in your app.

The SVGs are auto-updated weekly via GitHub Actions (every Monday 06:00 UTC).

## Updating SVGs locally

```sh
# Fetch the latest asset list from HyperLiquid and re-download all SVGs
npm run fetch:live

# Rebuild the package
npm run build
```

## License

MIT
