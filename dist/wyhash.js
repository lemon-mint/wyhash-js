// wyhash.ts
function _mul64(x, y) {
  x = BigInt.asUintN(64, x);
  y = BigInt.asUintN(64, y);
  const mask32 = BigInt.asUintN(64, (BigInt(1) << BigInt(32)) - BigInt(1));
  const x0 = BigInt.asUintN(64, x & mask32);
  const x1 = BigInt.asUintN(64, x >> BigInt(32));
  const y0 = BigInt.asUintN(64, y & mask32);
  const y1 = BigInt.asUintN(64, y >> BigInt(32));
  const w0 = BigInt.asUintN(64, x0 * y0);
  const t = BigInt.asUintN(
    64,
    BigInt.asUintN(64, x1 * y0) + BigInt.asUintN(64, w0 >> BigInt(32))
  );
  let w1 = BigInt.asUintN(64, t & mask32);
  const w2 = BigInt.asUintN(64, t >> BigInt(32));
  w1 += BigInt.asUintN(64, x0 * y1);
  w1 = BigInt.asUintN(64, w1);
  const hi = BigInt.asUintN(
    64,
    BigInt.asUintN(64, BigInt.asUintN(64, x1 * y1) + w2) + BigInt.asUintN(64, w1 >> BigInt(32))
  );
  const lo = BigInt.asUintN(64, x * y);
  return [hi, lo];
}
function _wymix(a, b) {
  a = BigInt.asUintN(64, a);
  b = BigInt.asUintN(64, b);
  [b, a] = _mul64(a, b);
  return BigInt.asUintN(64, a ^ b);
}
function _wyr8(p, offset) {
  return BigInt.asUintN(
    64,
    BigInt(p[offset + 0]) | BigInt(p[offset + 1]) << BigInt(8) | BigInt(p[offset + 2]) << BigInt(16) | BigInt(p[offset + 3]) << BigInt(24) | BigInt(p[offset + 4]) << BigInt(32) | BigInt(p[offset + 5]) << BigInt(40) | BigInt(p[offset + 6]) << BigInt(48) | BigInt(p[offset + 7]) << BigInt(56)
  );
}
function _wyr4(p, offset) {
  return BigInt.asUintN(
    64,
    BigInt(p[offset + 0]) | BigInt(p[offset + 1]) << BigInt(8) | BigInt(p[offset + 2]) << BigInt(16) | BigInt(p[offset + 3]) << BigInt(24)
  );
}
function _wyr3(p, offset, k) {
  return BigInt.asUintN(
    64,
    BigInt.asUintN(
      64,
      BigInt.asUintN(64, BigInt(p[offset + 0])) << BigInt(16)
    ) | BigInt.asUintN(
      64,
      BigInt.asUintN(64, BigInt(p[offset + (k >> 1)])) << BigInt(8)
    ) | BigInt.asUintN(64, BigInt(p[offset + k - 1]))
  );
}
var _wyp = [
  BigInt("0xa0761d6478bd642f"),
  BigInt("0xe7037ed1a0b428db"),
  BigInt("0x8ebc6af09c88c6e3"),
  BigInt("0x589965cc75374cc3")
];
function _wyhash(key, seed, secret) {
  let p = 0;
  const len = key.length;
  seed ^= secret[0];
  let a = BigInt(0);
  let b = BigInt(0);
  if (len <= 16) {
    if (len >= 4) {
      a = BigInt.asUintN(
        64,
        _wyr4(key, p) << BigInt(32) | _wyr4(key, p + (len >>> 3 << 2))
      );
      b = BigInt.asUintN(
        64,
        _wyr4(key, p + len - 4) << BigInt(32) | _wyr4(key, p + len - 4 - (len >>> 3 << 2))
      );
    } else if (len > 0) {
      a = _wyr3(key, p, len);
      b = BigInt(0);
    }
  } else {
    let i = len;
    if (i > 48) {
      let see1 = seed;
      let see2 = seed;
      do {
        seed = _wymix(_wyr8(key, p) ^ secret[1], _wyr8(key, p + 8) ^ seed);
        see1 = _wymix(
          _wyr8(key, p + 16) ^ secret[2],
          _wyr8(key, p + 24) ^ see1
        );
        see2 = _wymix(
          _wyr8(key, p + 32) ^ secret[3],
          _wyr8(key, p + 40) ^ see2
        );
        p = p + 48;
        i -= 48;
      } while (i > 48);
      seed ^= see1 ^ see2;
    }
    while (i > 16) {
      seed = _wymix(_wyr8(key, p) ^ secret[1], _wyr8(key, p + 8) ^ seed);
      i -= 16;
      p = p + 16;
    }
    a = _wyr8(key, p + i - 16);
    b = _wyr8(key, p + i - 8);
  }
  return _wymix(secret[1] ^ BigInt(len), _wymix(a ^ secret[1], b ^ seed));
}
function wyhash(b, seed) {
  return _wyhash(b, seed, _wyp);
}
function wyhash_str(s, seed) {
  return _wyhash(new TextEncoder().encode(s), seed, _wyp);
}
export {
  wyhash,
  wyhash_str
};
//# sourceMappingURL=wyhash.js.map