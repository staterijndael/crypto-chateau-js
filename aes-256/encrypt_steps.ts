import { exit } from "process"
import {mulBy02, mulBy03, mulBy09, mulBy0b, mulBy0d, mulBy0e} from "./multiply"
import {Sbox, Nk, Nb, Nr, Rcon} from "./params"

export function subBytes(state: Uint16Array[]): Uint16Array[] {
	for (var i = 0; i < state.length; i++) {
		for (var j = 0; j < state[i].length; j++) {
			const row = Math.floor(state[i][j] / 0x10)
			const col = state[i][j] % 0x10

			const sboxElem = Sbox[16*row+col]
			state[i][j] = sboxElem
		}
	}

	return state
}

export function keyExpansion(key: Uint8Array): Uint16Array[] {
	if (key.length != 4*Nk) {
		throw "incorrect len of secret key(should be 32(4 * nk))"
	}

	let keySchedule: Uint16Array[] = new Array<Uint16Array>(4);

	for (var r = 0; r < 4; r++) {
        keySchedule[r] = new Uint16Array((Nr + 1) * 4)
		for (var c = 0; c < Nk; c++) {
			keySchedule[r][c] = key[r+4*c];
		}
	}

	for (var col = Nk; col < Nb*(Nr+1); col++) {
		if (col%Nk == 0) {
			let tmpPrevCol: Uint8Array = new Uint8Array(4);
			for (var row = 1; row < 4; row++) {
				tmpPrevCol[row - 1] = keySchedule[row][col-1]
			}

			tmpPrevCol[4] = keySchedule[0][col-1]

			for (var i = 0; i < tmpPrevCol.length; i++) {
				const sboxElem = Sbox[tmpPrevCol[i]]
				tmpPrevCol[i] = sboxElem
			}

			for (var row = 0; row < 4; row++) {
				const s = keySchedule[row][col-4] ^ tmpPrevCol[row] ^ Rcon[row][col/Nk-1]
				keySchedule[row][col] = s
			}
		} else {
			for (var row = 0; row < 4; row++) {
				const s = keySchedule[row][col-4] ^ keySchedule[row][col-1]
				keySchedule[row][col] = s
			}
		}
	}

	return keySchedule
}

export function addRoundKey(state: Uint16Array[], keySchedule: Uint16Array[], round: number): Uint16Array[] {
	for (var col = 0; col < Nb; col++) {
		for (var row = 0; row < Nb; row++) {
			const s = state[row][col] ^ keySchedule[row][Nb*round+col]

			state[row][col] = s
		}
	}

	return state
}

export function mixColumns(state: Uint16Array[]): Uint16Array[] {
	for (var row = 0; row < Nb; row++) {
		const s0 = mulBy02(state[0][row]) ^ mulBy03(state[1][row]) ^ state[2][row] ^ state[3][row]
		const s1 = state[0][row] ^ mulBy02(state[1][row]) ^ mulBy03(state[2][row]) ^ state[3][row]
		const s2 = state[0][row] ^ state[1][row] ^ mulBy02(state[2][row]) ^ mulBy03(state[3][row])
		const s3 = mulBy03(state[0][row]) ^ state[1][row] ^ state[2][row] ^ mulBy02(state[3][row])

		state[0][row] = s0
		state[1][row] = s1
		state[2][row] = s2
		state[3][row] = s3
	}

	return state
}

export function shiftRows(state: Uint16Array[]): Uint16Array[] {
	for (var row = 1; row < Nb; row++) {
		let res = new Uint16Array(4);
		for (var col = 0; col < 4; col++) {
			let shift = (4 - 1 - col - row) % 4
			if (shift < 0) {
				shift = 4 + shift
			}
			res[shift] = state[row][4-1-col]
		}

		state[row] = res
	}

	return state
}