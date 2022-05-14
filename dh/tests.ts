import {KeyStore} from "./dh"

function Test_DH() {
    let aliceKeyStore = new KeyStore();
    let bobKeyStore = new KeyStore();

    aliceKeyStore.generatePrivateKey();
    bobKeyStore.generatePrivateKey();

    if (aliceKeyStore.privateKey == bobKeyStore.privateKey){
        throw "private keys should not be equals " + aliceKeyStore.privateKey + " " + bobKeyStore.privateKey
    }

    aliceKeyStore.generatePublicKey();
    bobKeyStore.generatePublicKey();

    if (aliceKeyStore.publicKey == bobKeyStore.publicKey){
        throw "public keys should not be equals"
    }

    aliceKeyStore.generateSharedKey(bobKeyStore.publicKey)
    bobKeyStore.generateSharedKey(aliceKeyStore.publicKey)

    if (aliceKeyStore.sharedKey != bobKeyStore.sharedKey){
        throw "shared keys should be equals"
    }
}

try {
    Test_DH();
}
catch(e){
    console.log(e)
}