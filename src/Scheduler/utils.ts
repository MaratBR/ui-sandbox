import base32Encode from "base32-encode";

export function encodeGroupKey(key: string) {
  return base32Encode(new TextEncoder().encode(key), "Crockford");
}

export function getGroupIndexVar(key: string) {
  return `--group-index-${encodeGroupKey(key)}`;
}
