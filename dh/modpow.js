"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modPow = void 0;
function modPow(b, e, n) {
    b = toZn(b, n);
    if (e < 0n) {
        throw "negative e";
    }
    let r = 1n;
    while (e > 0) {
        if ((e % 2n) === 1n) {
            r = r * b % n;
        }
        e = e / 2n;
        b = b ** 2n % n;
    }
    return r;
}
exports.modPow = modPow;
function toZn(a, n) {
    if (typeof a === 'number')
        a = BigInt(a);
    if (typeof n === 'number')
        n = BigInt(n);
    if (n <= 0n) {
        throw new RangeError('n must be > 0');
    }
    const aZn = a % n;
    return (aZn < 0n) ? aZn + n : aZn;
}
