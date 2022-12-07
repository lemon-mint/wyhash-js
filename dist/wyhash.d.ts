/**
 * @preserve
 * @license UNLICENSED
 * @author lemon-mint
 * https://github.com/lemon-mint/wyhash-js/blob/main/LICENSE
 */
declare function wyhash(b: Uint8Array, seed: bigint): bigint;
declare function wyhash_str(s: string, seed: bigint): bigint;

export { wyhash, wyhash_str };
