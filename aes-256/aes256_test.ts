import {Encrypt, Decrypt} from "./aes256"

function Test_Encrypt() {
    try{
	const data = "Дарова"

	const rndSymbols = makeid(10)
    const sha256Hash = hash(rndSymbols)
    let key = new TextEncoder().encode(sha256Hash);
    key = key.subarray(0, key.length / 2)

	const encryptedData = Encrypt(data, key)

	const decryptedData = Decrypt(encryptedData, key)
    const decryptedDataString = new TextDecoder("utf-8").decode(decryptedData);
    if (data != decryptedDataString){
        throw "decrypted data and original data is not equals original: " + data + " decrypted: " + decryptedDataString
    }

    console.log(decryptedDataString)
    console.log(decryptedDataString.length)
}catch(e){
    throw e
}
}

try{
    Test_Encrypt()
}catch(e){
    console.log(e)
}

function hash(hash: string): string {
    const { createHash } = require('crypto');
    return createHash('sha256').update(hash).digest('hex');
}

function makeid(length: number): string {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}