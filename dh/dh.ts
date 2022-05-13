import {randBetween} from "./rand"
import {Generator, Prime} from "./params"
import { isMobile } from "./global";

export class KeyStore {
    privateKey = 0n ;
    publicKey = 0n;
    sharedKey = 0n;

    generatePrivateKey(){
        this.privateKey = randBetween(Prime);
    }

    generatePublicKey(){
        if (!isKeyValid(this.privateKey)){
            return new Error("private key is invalid");
        }

        this.publicKey = (BigInt(Generator) ** this.privateKey) % BigInt(Prime)
    }

    generateSharedKey(receivedPublicKey: BigInt){
        if (!isKeyValid(this.privateKey)){
            return new Error("private key is invalid")
        }

        if (!isKeyValid(receivedPublicKey)){
            return new Error("received public key is invalid")
        }

        this.sharedKey = (BigInt(receivedPublicKey) ** this.privateKey) % BigInt(Prime)
    }
}

function isKeyValid(key: BigInt): boolean{
    if (key == BigInt(0) || key == undefined){
        return false;
    }

    return true;
}

