import {KeyStore} from "./dh"

function Test_DH() {
    let aliceKeyStore = new KeyStore();
    let bobKeyStore = new KeyStore();

    aliceKeyStore.generatePrivateKey();
    bobKeyStore.generatePrivateKey();

    if (aliceKeyStore.privateKey == bobKeyStore.privateKey){
        throw "private keys should not be equals " + aliceKeyStore.privateKey + " " + bobKeyStore.privateKey
    }

    console.log(aliceKeyStore.privateKey)
    console.log(bobKeyStore.privateKey)
    console.log("------------")

    aliceKeyStore.generatePublicKey();
    aliceKeyStore.generatePublicKey();

    if (aliceKeyStore.publicKey == bobKeyStore.publicKey){
        throw "public keys should not be equals"
    }

    console.log(aliceKeyStore.publicKey)
    console.log(bobKeyStore.publicKey)
    console.log("------------")

    aliceKeyStore.generateSharedKey(bobKeyStore.publicKey)
    bobKeyStore.generateSharedKey(aliceKeyStore.publicKey)

    if (aliceKeyStore.sharedKey != bobKeyStore.sharedKey){
        throw "shared keys should be equals"
    }

    console.log(aliceKeyStore.sharedKey)
    console.log(bobKeyStore.sharedKey)
    console.log("------------")
}

try {
    Test_DH();
}
catch(e){
    console.log(e)
}