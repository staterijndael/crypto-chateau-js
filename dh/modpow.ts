export function modPow (b: bigint, e: bigint, n: bigint): bigint {
    b = toZn(b, n)
  
    if (e < 0n) {
      throw "negative e"
    }
  
    let r = 1n
    while (e > 0) {
      if ((e % 2n) === 1n) {
        r = r * b % n
      }
      e = e / 2n
      b = b ** 2n % n
    }
    return r
  }

  function toZn (a: number|bigint, n: number|bigint): bigint {
    if (typeof a === 'number') a = BigInt(a)
    if (typeof n === 'number') n = BigInt(n)
  
    if (n <= 0n) {
      throw new RangeError('n must be > 0')
    }
  
    const aZn = a % n
    return (aZn < 0n) ? aZn + n : aZn
  }