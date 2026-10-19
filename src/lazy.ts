import { assets } from "./names";
import { resolveAsset } from "./resolve";
import { loaders } from "./loaders";

/**
 * Lazily load a single asset's inline SVG.
 *
 * Only the requested module is loaded (dynamic `import()`), so bundlers that
 * enable code-splitting (and Node itself) only pay for the icons you use.
 * Prefer this — or a direct per-asset import
 * (`import BTC from "hyperliquid-coin-svgs/BTC"`) — over the full `svgMap`.
 *
 * @returns the SVG markup, or `undefined` if the asset is not bundled.
 */
export async function loadAsset(asset: string): Promise<string | undefined> {
  const name = resolveAsset(asset);
  return name ? loaders[name]() : undefined;
}

/** Does this package ship an inline SVG for `asset`? Case-insensitive. */
export function hasAsset(asset: string): boolean {
  return resolveAsset(asset) !== undefined;
}

/** Every asset shipped with an inline SVG, in HyperLiquid's listing order. */
export { assets };
