declare function wyhash(b: Uint8Array, seed: bigint): bigint;
declare function wyhash_str(s: string, seed: bigint): bigint;

export { wyhash, wyhash_str };
