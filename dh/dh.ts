import {randBetween} from "./rand"
import {Generator, Prime} from "./params"
import { isMobile } from "./global";
import {modPow} from "./modpow"

export class KeyStore {
    privateKey = 0n;
    publicKey = 0n;
    sharedKey = 0n;

    generatePrivateKey(){
        this.privateKey = randBetween(Prime);
    }

    generatePublicKey(){
        if (!isKeyValid(this.privateKey)){
            return new Error("private key is invalid");
        }

        this.publicKey = modPow(BigInt(Generator), this.privateKey, Prime)
    }

    generateSharedKey(receivedPublicKey: bigint){
        if (!isKeyValid(this.privateKey)){
            return new Error("private key is invalid")
        }

        if (!isKeyValid(receivedPublicKey)){
            return new Error("received public key is invalid")
        }

        this.sharedKey = modPow(receivedPublicKey, this.privateKey, Prime)
    }
}

export function isKeyValid(key: BigInt): boolean{
    if (key == BigInt(0) || key == undefined){
        return false;
    }

    return true;
}

