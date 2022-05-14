import {keyExpansion, addRoundKey, subBytes, shiftRows, mixColumns} from "./encrypt_steps"
import {InvShiftRows, InvMixColumns, InvSubBytes} from "./decrypt_steps"
import {Nk, Nb, Nr} from "./params"

export function Encrypt(inputString: string, key: Uint8Array): Uint8Array {
	if (inputString.length == 0) {
		throw "incorrect input bytes length"
	}
	if (key.length != 4*Nk) {
		throw "incorrect len of secret key(should be 32(4 * nk))"
	}
    const inputBytes = stringToUInt8(inputString)

    let startIndex = inputBytes.length
    let endIndex = inputBytes.length - 1

    for (;(endIndex + 1)%(Nb * 4) != 0;) {
		endIndex++
	}

    let correctedInputBytes = new Uint8Array(endIndex + 1);
    for (var i = 0; i < inputBytes.length; i++){
        correctedInputBytes[i] = inputBytes[i]
    }

    const spaceSymb = stringToUInt8(' ')[0]

	for (var i = startIndex; i <= endIndex; i++) {
		correctedInputBytes[i] = spaceSymb
	}

	let result = new Uint8Array(correctedInputBytes.length);

	for (var batch = 1; batch <= correctedInputBytes.length/(Nb*4); batch++) {
		var offset = (batch - 1) * Nb * 4
		var limit = offset + Nb*4

		var state = correctedInputBytes.subarray(offset, limit)

        let encryptedData: Uint8Array;
        try {
		    encryptedData = encrypt(state, key)
        }catch(e){
            throw e
        }
		
		for (var i = 0; i < encryptedData.length; i++){
            result[offset + i] = encryptedData[i]
        }
	}

	return result
}

export function Decrypt(cipher: Uint8Array, key: Uint8Array): Uint8Array {
	if (cipher.length == 0 || cipher.length%(Nb*4) != 0) {
		throw "incorrect input bytes length"
	}
	if (key.length != 4*Nk) {
		throw "incorrect len of secret key(should be 32(4 * nk))"
	}

	let result = new Uint8Array(cipher.length);

	for (var batch = 1; batch <= cipher.length/(Nb*4); batch++) {
		const offset = (batch - 1) * Nb * 4
		const limit = offset + Nb*4

		const state = cipher.subarray(offset, limit)
        let decryptedData: Uint8Array;
        try{
		    decryptedData = decrypt(state, key)
        }catch(e){
            throw e
        }
		
        for (var i = 0; i < decryptedData.length; i++){
            result[offset + i] = decryptedData[i]
        }
	}

    const spaceSymb = stringToUInt8(' ')[0]

	let finalIndex = result.length - 1
	for (i = result.length - 1; i >= 0; i--){
		if (result[i] != spaceSymb) {
			finalIndex = i + 1
			break
		}
	}

	result = result.subarray(0, finalIndex)

	return result
}

function encrypt(inputBytes: Uint8Array, key: Uint8Array): Uint8Array {
	if (inputBytes.length != 4*Nb) {
		throw "incorrect input bytes length"
	}

	let state = new Array<Uint16Array>(4);

	for (var r = 0; r < 4; r++) {
        state[r] = new Uint16Array(Nb);
		for (var c = 0; c < Nb; c++) {
			state[r][c] = inputBytes[r+4*c]
		}
	}
    let keySchedule: Uint16Array[]
    try {
	    keySchedule = keyExpansion(key)
    }catch(e){
        throw e
    }

    try{
	    state = addRoundKey(state, keySchedule, 0)
    }catch(e){
        throw e
    }

	var rnd: number = 1

	for (;rnd < Nr; rnd++) {
        try{
		    state = subBytes(state)
		    state = shiftRows(state)
		    state = mixColumns(state)
		    state = addRoundKey(state, keySchedule, rnd)
        }catch(e){
            throw(e)
        }
	}


    try {
	    state = subBytes(state)
	    state = shiftRows(state)
	    state = addRoundKey(state, keySchedule, rnd)
    }catch(e){
        throw e
    }

	let output = new Uint8Array(inputBytes.length)

	for (var row = 0; row < state.length; row++) {
		for (var col = 0; col < state[row].length; col++) {
			output[row+4*col] = state[row][col]
		}
	}

	return output
}

function decrypt(cipher: Uint8Array, key: Uint8Array): Uint8Array {
	let state = new Array<Uint16Array>(4);

	for (var r = 0; r < 4; r++) {
        state[r] = new Uint16Array(Nb);
		for (var c = 0; c < Nb; c++) {
			state[r][c] = cipher[r+4*c]
		}
	}

    let keySchedule: Uint16Array[];
    try {
	    keySchedule = keyExpansion(key)
    }catch(e){
        throw e
    }
	

	state = addRoundKey(state, keySchedule, Nr)

	var rnd = Nr - 1

	for (;rnd > 0; rnd--){
        try{
		    state = InvShiftRows(state)
		    state = InvSubBytes(state)
		    state = addRoundKey(state, keySchedule, rnd)
		    state = InvMixColumns(state)
        }catch(e){
            throw e
        }
	}

    try {
	    state = InvShiftRows(state)
	    state = InvSubBytes(state)
	    state = addRoundKey(state, keySchedule, rnd)
    }catch(e){
        throw e
    }

	let output = new Uint8Array(cipher.length);

	for (var row = 0; row < state.length; row++) {
		for (var col = 0; col < state[row].length; col++) {
			output[row+4*col] = state[row][col]
		}
	}

	return output
}

function stringToUInt8 (s: string): Uint8Array { 
    var util= require('util');
    return new util.TextEncoder("utf-8").encode(s)
  }