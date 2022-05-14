"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftRows = exports.mixColumns = exports.addRoundKey = exports.keyExpansion = exports.subBytes = void 0;
const multiply_1 = require("./multiply");
const params_1 = require("./params");
function subBytes(state) {
    for (var i = 0; i < state.length; i++) {
        for (var j = 0; j < state[i].length; j++) {
            const row = Math.floor(state[i][j] / 0x10);
            const col = state[i][j] % 0x10;
            const sboxElem = params_1.Sbox[16 * row + col];
            state[i][j] = sboxElem;
        }
    }
    return state;
}
exports.subBytes = subBytes;
function keyExpansion(key) {
    if (key.length != 4 * params_1.Nk) {
        throw "incorrect len of secret key(should be 32(4 * nk))";
    }
    let keySchedule = new Array(4);
    for (var r = 0; r < 4; r++) {
        keySchedule[r] = new Uint16Array((params_1.Nr + 1) * 4);
        for (var c = 0; c < params_1.Nk; c++) {
            keySchedule[r][c] = key[r + 4 * c];
        }
    }
    for (var col = params_1.Nk; col < params_1.Nb * (params_1.Nr + 1); col++) {
        if (col % params_1.Nk == 0) {
            let tmpPrevCol = new Uint8Array(4);
            for (var row = 1; row < 4; row++) {
                tmpPrevCol[row - 1] = keySchedule[row][col - 1];
            }
            tmpPrevCol[4] = keySchedule[0][col - 1];
            for (var i = 0; i < tmpPrevCol.length; i++) {
                const sboxElem = params_1.Sbox[tmpPrevCol[i]];
                tmpPrevCol[i] = sboxElem;
            }
            for (var row = 0; row < 4; row++) {
                const s = keySchedule[row][col - 4] ^ tmpPrevCol[row] ^ params_1.Rcon[row][col / params_1.Nk - 1];
                keySchedule[row][col] = s;
            }
        }
        else {
            for (var row = 0; row < 4; row++) {
                const s = keySchedule[row][col - 4] ^ keySchedule[row][col - 1];
                keySchedule[row][col] = s;
            }
        }
    }
    return keySchedule;
}
exports.keyExpansion = keyExpansion;
function addRoundKey(state, keySchedule, round) {
    for (var col = 0; col < params_1.Nb; col++) {
        for (var row = 0; row < params_1.Nb; row++) {
            const s = state[row][col] ^ keySchedule[row][params_1.Nb * round + col];
            state[row][col] = s;
        }
    }
    return state;
}
exports.addRoundKey = addRoundKey;
function mixColumns(state) {
    for (var row = 0; row < params_1.Nb; row++) {
        const s0 = (0, multiply_1.mulBy02)(state[0][row]) ^ (0, multiply_1.mulBy03)(state[1][row]) ^ state[2][row] ^ state[3][row];
        const s1 = state[0][row] ^ (0, multiply_1.mulBy02)(state[1][row]) ^ (0, multiply_1.mulBy03)(state[2][row]) ^ state[3][row];
        const s2 = state[0][row] ^ state[1][row] ^ (0, multiply_1.mulBy02)(state[2][row]) ^ (0, multiply_1.mulBy03)(state[3][row]);
        const s3 = (0, multiply_1.mulBy03)(state[0][row]) ^ state[1][row] ^ state[2][row] ^ (0, multiply_1.mulBy02)(state[3][row]);
        state[0][row] = s0;
        state[1][row] = s1;
        state[2][row] = s2;
        state[3][row] = s3;
    }
    return state;
}
exports.mixColumns = mixColumns;
function shiftRows(state) {
    for (var row = 1; row < params_1.Nb; row++) {
        let res = new Uint16Array(4);
        for (var col = 0; col < 4; col++) {
            let shift = (4 - 1 - col - row) % 4;
            if (shift < 0) {
                shift = 4 + shift;
            }
            res[shift] = state[row][4 - 1 - col];
        }
        state[row] = res;
    }
    return state;
}
exports.shiftRows = shiftRows;
