// Generatore lineare congruenziale (LCG)
// Random class nelle API di Java

export class LCG {
  constructor(seed = Date.now(), m = 281474976710656, a = 25214903917, c = 11) {
    // Parametri standard
    this.m = m //2^64
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
