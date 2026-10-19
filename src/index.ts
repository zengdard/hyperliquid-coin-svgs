// Lightweight entry point — no SVG data is pulled in here.
//
// - For a CDN URL with zero payload, use `getAssetImage`.
// - For one or a few icons, import them per asset:
//     import BTC from "hyperliquid-coin-svgs/BTC";
// - To load icons on demand, import the lazy entry point:
//     import { loadAsset } from "hyperliquid-coin-svgs/lazy";
// - For dynamic lookup of ANY asset (bundles every SVG), use:
//     import { svgMap, getAssetSvg } from "hyperliquid-coin-svgs/svgMap";

import { assets } from "./names";
import { resolveAsset } from "./resolve";

export { assets, resolveAsset };

/** Does this package ship an inline SVG for `asset`? Case-insensitive. */
export function hasAsset(asset: string): boolean {
  return resolveAsset(asset) !== undefined;
}

/** URL of the asset's SVG hosted on HyperLiquid's CDN (no data bundled). */
export function getAssetImage(asset: string): string {
  return `https://app.hyperliquid.xyz/coins/${resolveAsset(asset) ?? asset}.svg`;
}
