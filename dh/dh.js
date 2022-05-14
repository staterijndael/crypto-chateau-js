"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyStore = void 0;
const rand_1 = require("./rand");
const params_1 = require("./params");
const modpow_1 = require("./modpow");
class KeyStore {
    constructor() {
        this.privateKey = 0n;
        this.publicKey = 0n;
        this.sharedKey = 0n;
    }
    generatePrivateKey() {
        this.privateKey = (0, rand_1.randBetween)(params_1.Prime);
    }
    generatePublicKey() {
        if (!isKeyValid(this.privateKey)) {
            return new Error("private key is invalid");
        }
        this.publicKey = (0, modpow_1.modPow)(BigInt(params_1.Generator), this.privateKey, params_1.Prime);
    }
    generateSharedKey(receivedPublicKey) {
        if (!isKeyValid(this.privateKey)) {
            return new Error("private key is invalid");
        }
        if (!isKeyValid(receivedPublicKey)) {
            return new Error("received public key is invalid");
        }
        this.sharedKey = (0, modpow_1.modPow)(receivedPublicKey, this.privateKey, params_1.Prime);
    }
}
exports.KeyStore = KeyStore;
function isKeyValid(key) {
    if (key == BigInt(0) || key == undefined) {
        return false;
    }
    return true;
}
