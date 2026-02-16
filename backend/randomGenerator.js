// Generatore lineare congruenziale (LCG)
// MMIX di Donald Knuth compilator

export class LCG {
  constructor(
    seed = Date.now(),
    m = 18446744073709551616,
    a = 6364136223846793005,
    c = 1442695040888963407,
  ) {
    // Parametri standard
    this.m = m //2^32
    this.a = a
    this.c = c
    this.state = seed
  }

  nextInt() {
    // Formula: X_{n+1} = (a * X_n + c) % m
    this.state = (this.a * this.state + this.c) % this.m
    return this.state
  }

  range(min, max) {
    const rowNumber = this.nextInt()
    const nBetween01 = rowNumber / this.m // Normalizzazione in numero tra 0 e 1
    const amplitidue = max - min + 1
    const redefinedNumber = nBetween01 * amplitidue // Numero ridefinito in base ampiezza
    const result = Math.floor(redefinedNumber) + min // Arrotonda per difetto

    return result
  }
}
