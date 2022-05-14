"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randBetween = void 0;
const global_1 = require("./global");
function randBetween(max, min = 1n) {
    if (max <= min)
        throw new RangeError('Arguments MUST be: max > min');
    const interval = BigInt(max) - BigInt(min);
    const bitLen = bitLength(interval);
    let rnd;
    do {
        const buf = randBitsSync(bitLen);
        rnd = fromBuffer(buf);
    } while (rnd > interval);
    return BigInt(rnd) + BigInt(min);
}
exports.randBetween = randBetween;
function randBitsSync(bitLength) {
    if (bitLength < 1)
        throw new RangeError('bitLength MUST be > 0');
    const byteLength = Math.ceil(bitLength / 8);
    const rndBytes = randBytesSync(byteLength);
    const bitLengthMod8 = bitLength % 8;
    if (bitLengthMod8 !== 0) {
        rndBytes[0] = rndBytes[0] & (2 ** bitLengthMod8 - 1);
    }
    return rndBytes;
}
function randBytesSync(byteLength) {
    if (byteLength < 1)
        throw new RangeError('byteLength MUST be > 0');
    if (global_1.isMobile) {
        const crypto = require('crypto');
        const buf = crypto.randomBytes(byteLength);
        return buf;
    }
    else {
        const buf = new Uint8Array(byteLength);
        self.crypto.getRandomValues(buf);
        return buf;
    }
}
function bitLength(a) {
    if (typeof a === 'number')
        a = BigInt(a);
    if (a === 1n) {
        return 1;
    }
    let bits = 1;
    do {
        bits++;
    } while ((a >>= 1n) > 1n);
    return bits;
}
function fromBuffer(buf) {
    let ret = BigInt(0);
    for (var i = 0; i < buf.length; i++) {
        const bi = BigInt(buf[i]);
        ret = (ret << 8n) + bi;
    }
    return ret;
}
