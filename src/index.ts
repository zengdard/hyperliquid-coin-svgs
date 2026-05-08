import { svgMap, assets as _assets } from "./_assets";

export function getAssetImage(asset: string): string {
  return `https://app.hyperliquid.xyz/coins/${asset.toUpperCase()}.svg`;
}

export function getAssetSvg(asset: string): string | undefined {
  return svgMap[asset.toUpperCase()];
}

export const assets: readonly string[] = _assets;

export { svgMap };
