"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mulBy0e = exports.mulBy0d = exports.mulBy0b = exports.mulBy09 = exports.mulBy03 = exports.mulBy02 = void 0;
function mulBy02(num) {
    var res;
    if (num < 0x80) {
        res = num << 1;
    }
    else {
        res = (num << 1) ^ 0x1b;
    }
    return res % 0x100;
}
exports.mulBy02 = mulBy02;
function mulBy03(num) {
    return mulBy02(num) ^ num;
}
exports.mulBy03 = mulBy03;
function mulBy09(num) {
    return mulBy02(mulBy02(mulBy02(num))) ^ num;
}
exports.mulBy09 = mulBy09;
function mulBy0b(num) {
    return mulBy02(mulBy02(mulBy02(num))) ^ mulBy02(num) ^ num;
}
exports.mulBy0b = mulBy0b;
function mulBy0d(num) {
    return mulBy02(mulBy02(mulBy02(num))) ^ mulBy02(mulBy02(num)) ^ num;
}
exports.mulBy0d = mulBy0d;
function mulBy0e(num) {
    return mulBy02(mulBy02(mulBy02(num))) ^ mulBy02(mulBy02(num)) ^ mulBy02(num);
}
exports.mulBy0e = mulBy0e;
