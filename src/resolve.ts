import { assetIndex } from "./names";

/**
 * Resolve a user-supplied symbol to its canonical HyperLiquid symbol.
 * Case-insensitive, but preserves mixed-case names like `kPEPE` / `kSHIB`.
 */
export function resolveAsset(asset: string): string | undefined {
  const key = asset.toUpperCase();
  return Object.prototype.hasOwnProperty.call(assetIndex, key)
    ? assetIndex[key]
    : undefined;
}
