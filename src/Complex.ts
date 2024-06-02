/**
 * FFTに必要な複素数の計算を扱う。
 */

export default class Complex {
  /**実数部 */
  re: number;
  /** 虚数部 */
  sub: number;

  constructor(re: number = 0, sub: number = 0) {
    this.re = re;
    this.sub = sub;
  }

  /**
   * 実数から複素数を得る
   * @param theta 位相
   */
  Expi(theta: number) {
    this.re = Math.cos(theta);
    this.sub = Math.sin(theta);
  }

  /**
   * 複素数の足し算
   * @param value 複素数
   * @returns 複素数
   */
  Add(value: Complex): Complex {
    return new Complex(this.re + value.re, this.sub + value.sub);
  }
  /**
   * 複素数の引き算
   * @param value 複素数
   * @returns 複素数
   */
  Sub(value: Complex): Complex {
    return new Complex(this.re - value.re, this.sub - value.sub);
  }
  /**
   * 複素数の掛け算
   * @param value 複素数
   * @returns 複素数
   */
  Mul(value: Complex): Complex {
    return new Complex(
      this.re * value.re - this.sub * value.sub,
      this.re * value.sub + this.sub * value.re
    );
  }
}
