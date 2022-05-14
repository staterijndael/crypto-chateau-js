"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvSubBytes = exports.InvMixColumns = exports.InvShiftRows = void 0;
const multiply_1 = require("./multiply");
const params_1 = require("./params");
function InvShiftRows(state) {
    for (var row = 1; row < params_1.Nb; row++) {
        let res = new Uint16Array(4);
        for (var col = 0; col < 4; col++) {
            res[(col + row) % 4] = state[row][col];
        }
        state[row] = res;
    }
    return state;
}
exports.InvShiftRows = InvShiftRows;
function InvMixColumns(state) {
    for (var row = 0; row < params_1.Nb; row++) {
        const s0 = (0, multiply_1.mulBy0e)(state[0][row]) ^ (0, multiply_1.mulBy0b)(state[1][row]) ^ (0, multiply_1.mulBy0d)(state[2][row]) ^ (0, multiply_1.mulBy09)(state[3][row]);
        const s1 = (0, multiply_1.mulBy09)(state[0][row]) ^ (0, multiply_1.mulBy0e)(state[1][row]) ^ (0, multiply_1.mulBy0b)(state[2][row]) ^ (0, multiply_1.mulBy0d)(state[3][row]);
        const s2 = (0, multiply_1.mulBy0d)(state[0][row]) ^ (0, multiply_1.mulBy09)(state[1][row]) ^ (0, multiply_1.mulBy0e)(state[2][row]) ^ (0, multiply_1.mulBy0b)(state[3][row]);
        const s3 = (0, multiply_1.mulBy0b)(state[0][row]) ^ (0, multiply_1.mulBy0d)(state[1][row]) ^ (0, multiply_1.mulBy09)(state[2][row]) ^ (0, multiply_1.mulBy0e)(state[3][row]);
        state[0][row] = s0;
        state[1][row] = s1;
        state[2][row] = s2;
        state[3][row] = s3;
    }
    return state;
}
exports.InvMixColumns = InvMixColumns;
function InvSubBytes(state) {
    for (var i = 0; i < state.length; i++) {
        for (var j = 0; j < state[i].length; j++) {
            const sboxElem = params_1.InvSbox[state[i][j]];
            state[i][j] = sboxElem;
        }
    }
    return state;
}
exports.InvSubBytes = InvSubBytes;
