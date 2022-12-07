import { wyhash } from "./wyhash.js";
function assert(cond) {
    if (!cond) {
        throw new Error("assertion failed");
    }
}
function B(s) {
    return new TextEncoder().encode(s);
}
function TEST(name, fn) {
    try {
        fn();
        console.log(`PASS ${name}`);
    }
    catch (e) {
        console.log(`FAIL ${name}`);
        console.error(e);
    }
}
TEST("msg=\"\"", () => {
    assert(wyhash(B(""), 0n) == 0x42bc986dc5eec4d3n);
});
TEST("msg=\"a\"", () => {
    assert(wyhash(B("a"), 1n) == 0x84508dc903c31551n);
});
TEST("msg=\"abc\"", () => {
    assert(wyhash(B("abc"), 2n) == 0x0bc54887cfc9ecb1n);
});
TEST("msg=\"message digest\"", () => {
    assert(wyhash(B("message digest"), 3n) == 0x6e2ff3298208a67cn);
});
TEST("msg=\"abcdefghijklmnopqrstuvwxyz\"", () => {
    assert(wyhash(B("abcdefghijklmnopqrstuvwxyz"), 4n) == 0x9a64e42e897195b9n);
});
TEST("msg=\"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\"", () => {
    assert(wyhash(B("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"), 5n) == 0x9199383239c32554n);
});
//# sourceMappingURL=wyhash.test.js.map