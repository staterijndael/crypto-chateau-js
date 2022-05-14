"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decrypt = exports.Encrypt = void 0;
const encrypt_steps_1 = require("./encrypt_steps");
const decrypt_steps_1 = require("./decrypt_steps");
const params_1 = require("./params");
function Encrypt(inputString, key) {
    if (inputString.length == 0) {
        throw "incorrect input bytes length";
    }
    if (key.length != 4 * params_1.Nk) {
        throw "incorrect len of secret key(should be 32(4 * nk))";
    }
    const inputBytes = stringToUInt8(inputString);
    let startIndex = inputBytes.length;
    let endIndex = inputBytes.length - 1;
    for (; (endIndex + 1) % (params_1.Nb * 4) != 0;) {
        endIndex++;
    }
    let correctedInputBytes = new Uint8Array(endIndex + 1);
    for (var i = 0; i < inputBytes.length; i++) {
        correctedInputBytes[i] = inputBytes[i];
    }
    const spaceSymb = stringToUInt8(' ')[0];
    for (var i = startIndex; i <= endIndex; i++) {
        correctedInputBytes[i] = spaceSymb;
    }
    let result = new Uint8Array(correctedInputBytes.length);
    for (var batch = 1; batch <= correctedInputBytes.length / (params_1.Nb * 4); batch++) {
        var offset = (batch - 1) * params_1.Nb * 4;
        var limit = offset + params_1.Nb * 4;
        var state = correctedInputBytes.subarray(offset, limit);
        let encryptedData;
        try {
            encryptedData = encrypt(state, key);
        }
        catch (e) {
            throw e;
        }
        for (var i = 0; i < encryptedData.length; i++) {
            result[offset + i] = encryptedData[i];
        }
    }
    return result;
}
exports.Encrypt = Encrypt;
function Decrypt(cipher, key) {
    if (cipher.length == 0 || cipher.length % (params_1.Nb * 4) != 0) {
        throw "incorrect input bytes length";
    }
    if (key.length != 4 * params_1.Nk) {
        throw "incorrect len of secret key(should be 32(4 * nk))";
    }
    let result = new Uint8Array(cipher.length);
    for (var batch = 1; batch <= cipher.length / (params_1.Nb * 4); batch++) {
        const offset = (batch - 1) * params_1.Nb * 4;
        const limit = offset + params_1.Nb * 4;
        const state = cipher.subarray(offset, limit);
        let decryptedData;
        try {
            decryptedData = decrypt(state, key);
        }
        catch (e) {
            throw e;
        }
        for (var i = 0; i < decryptedData.length; i++) {
            result[offset + i] = decryptedData[i];
        }
    }
    const spaceSymb = stringToUInt8(' ')[0];
    let finalIndex = result.length - 1;
    for (i = result.length - 1; i >= 0; i--) {
        if (result[i] != spaceSymb) {
            finalIndex = i + 1;
            break;
        }
    }
    result = result.subarray(0, finalIndex);
    return result;
}
exports.Decrypt = Decrypt;
function encrypt(inputBytes, key) {
    if (inputBytes.length != 4 * params_1.Nb) {
        throw "incorrect input bytes length";
    }
    let state = new Array(4);
    for (var r = 0; r < 4; r++) {
        state[r] = new Uint16Array(params_1.Nb);
        for (var c = 0; c < params_1.Nb; c++) {
            state[r][c] = inputBytes[r + 4 * c];
        }
    }
    let keySchedule;
    try {
        keySchedule = (0, encrypt_steps_1.keyExpansion)(key);
    }
    catch (e) {
        throw e;
    }
    try {
        state = (0, encrypt_steps_1.addRoundKey)(state, keySchedule, 0);
    }
    catch (e) {
        throw e;
    }
    var rnd = 1;
    for (; rnd < params_1.Nr; rnd++) {
        try {
            state = (0, encrypt_steps_1.subBytes)(state);
            state = (0, encrypt_steps_1.shiftRows)(state);
            state = (0, encrypt_steps_1.mixColumns)(state);
            state = (0, encrypt_steps_1.addRoundKey)(state, keySchedule, rnd);
        }
        catch (e) {
            throw (e);
        }
    }
    try {
        state = (0, encrypt_steps_1.subBytes)(state);
        state = (0, encrypt_steps_1.shiftRows)(state);
        state = (0, encrypt_steps_1.addRoundKey)(state, keySchedule, rnd);
    }
    catch (e) {
        throw e;
    }
    let output = new Uint8Array(inputBytes.length);
    for (var row = 0; row < state.length; row++) {
        for (var col = 0; col < state[row].length; col++) {
            output[row + 4 * col] = state[row][col];
        }
    }
    return output;
}
function decrypt(cipher, key) {
    let state = new Array(4);
    for (var r = 0; r < 4; r++) {
        state[r] = new Uint16Array(params_1.Nb);
        for (var c = 0; c < params_1.Nb; c++) {
            state[r][c] = cipher[r + 4 * c];
        }
    }
    let keySchedule;
    try {
        keySchedule = (0, encrypt_steps_1.keyExpansion)(key);
    }
    catch (e) {
        throw e;
    }
    state = (0, encrypt_steps_1.addRoundKey)(state, keySchedule, params_1.Nr);
    var rnd = params_1.Nr - 1;
    for (; rnd > 0; rnd--) {
        try {
            state = (0, decrypt_steps_1.InvShiftRows)(state);
            state = (0, decrypt_steps_1.InvSubBytes)(state);
            state = (0, encrypt_steps_1.addRoundKey)(state, keySchedule, rnd);
            state = (0, decrypt_steps_1.InvMixColumns)(state);
        }
        catch (e) {
            throw e;
        }
    }
    try {
        state = (0, decrypt_steps_1.InvShiftRows)(state);
        state = (0, decrypt_steps_1.InvSubBytes)(state);
        state = (0, encrypt_steps_1.addRoundKey)(state, keySchedule, rnd);
    }
    catch (e) {
        throw e;
    }
    let output = new Uint8Array(cipher.length);
    for (var row = 0; row < state.length; row++) {
        for (var col = 0; col < state[row].length; col++) {
            output[row + 4 * col] = state[row][col];
        }
    }
    return output;
}
function stringToUInt8(s) {
    var util = require('util');
    return new util.TextEncoder("utf-8").encode(s);
}
