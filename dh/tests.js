"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dh_1 = require("./dh");
function Test_DH() {
    let aliceKeyStore = new dh_1.KeyStore();
    let bobKeyStore = new dh_1.KeyStore();
    aliceKeyStore.generatePrivateKey();
    bobKeyStore.generatePrivateKey();
    if (aliceKeyStore.privateKey == bobKeyStore.privateKey) {
        throw "private keys should not be equals " + aliceKeyStore.privateKey + " " + bobKeyStore.privateKey;
    }
    aliceKeyStore.generatePublicKey();
    bobKeyStore.generatePublicKey();
    if (aliceKeyStore.publicKey == bobKeyStore.publicKey) {
        throw "public keys should not be equals";
    }
    aliceKeyStore.generateSharedKey(bobKeyStore.publicKey);
    bobKeyStore.generateSharedKey(aliceKeyStore.publicKey);
    if (aliceKeyStore.sharedKey != bobKeyStore.sharedKey) {
        throw "shared keys should be equals";
    }
}
try {
    Test_DH();
}
catch (e) {
    console.log(e);
}
