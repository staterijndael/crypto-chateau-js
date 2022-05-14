export function mulBy02(num: number): number {
	var res: number

	if (num < 0x80) {
		res = num << 1
	} else {
		res = (num << 1) ^ 0x1b
	}

	return res % 0x100
}

export function mulBy03(num: number): number {
	return mulBy02(num) ^ num
}

export function mulBy09(num: number): number {
	return mulBy02(mulBy02(mulBy02(num))) ^ num
}

export function mulBy0b(num: number): number {
	return mulBy02(mulBy02(mulBy02(num))) ^ mulBy02(num) ^ num
}

export function mulBy0d(num: number): number {
	return mulBy02(mulBy02(mulBy02(num))) ^ mulBy02(mulBy02(num)) ^ num
}

export function mulBy0e(num: number): number {
	return mulBy02(mulBy02(mulBy02(num))) ^ mulBy02(mulBy02(num)) ^ mulBy02(num)
}