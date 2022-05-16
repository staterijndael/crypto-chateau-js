import {Conn} from "./conn"
import {Generator, Prime} from "../dh/params"
import {KeyStore, isKeyValid} from "../dh/dh"
import {stringToUInt8} from "../utils/utils"

export function ServerHandshake(conn: Conn): Conn{
    const handshakeBytes = conn.read()
    if (String(handshakeBytes) != "handshake"){
        throw "incorrect init handshake message"
    }

    const dhParams = conn.read()
    const parsedDhParams =  parseMsg(dhParams, 2)
    if (parsedDhParams.length != 2){
        throw "got incorrect num of dh params"
    }

    const generator = BigInt(parsedDhParams[0])
    const prime = BigInt(parsedDhParams[1])

    if (generator != BigInt(Generator) || prime != Prime){
        throw "dh params on server and client is not equals"
    }
    var keyStore = new KeyStore();

    keyStore.generatePrivateKey();
    keyStore.generatePublicKey();

    const rawServerPublicKey = conn.read()
    const serverPublicKey = BigInt(rawServerPublicKey)
    if (!isKeyValid(serverPublicKey)){
        throw "incorrect server public key"
    }

    conn.write(toLittleEndian(keyStore.publicKey))

    keyStore.generateSharedKey(serverPublicKey)
    if (!isKeyValid(keyStore.sharedKey)){
        throw "incorrect shared key"
    }

    conn.encryption = true
    conn.sharedKey = toLittleEndian(keyStore.sharedKey)

    return conn
}

function toLittleEndian(bigNumber: bigint): Uint8Array {
    let result = new Uint8Array(64);
    let i = 0;
    while (bigNumber > 0n) {
        result[i] = Number(bigNumber % 256n);
        bigNumber = bigNumber / 256n;
        i += 1;
    }
    return result;
}

function formatMsg(...fields: string[]): string{
    if (fields.length == 0) {
		return ""
	}

	let result = ""

	for (var i = 0; i < fields.length; i++) {
		result += fields[i] + "|"
	}

	result += fields[fields.length - 1]

	return result
}

function parseMsg(msg: Uint8Array, paramsNum: number): Uint8Array[]{
    if (msg.length == 0) {
		throw "empty message"
	}
	let result: Uint8Array[] = new Array<Uint8Array>(paramsNum);

	let buf: Uint8Array = new Uint8Array(msg.length);
	let lastIndex = -1


    let currentResultIndex = 0
    let currentBufIndex = 0

    const delimSymb = stringToUInt8('|')[0]

	for (var i = 0; i < msg.length; i++) {
		if (msg[i] == delimSymb) {
			if (lastIndex+1 == i) {
				throw "incorrect message format"
			}

            if (currentResultIndex >= result.length){
                throw "incorrect params count"
            }

			result[currentResultIndex] = buf.slice(lastIndex + 1, currentBufIndex + 1)
            currentResultIndex++

			lastIndex = i
		}

		buf[currentBufIndex] = msg[i]
        currentBufIndex++
	}

	if (lastIndex == buf.length-1) {
		throw "incorrect message format"
	}

	result[currentResultIndex] = buf.slice(lastIndex + 1, currentBufIndex + 1)
    currentResultIndex++

	return result
}