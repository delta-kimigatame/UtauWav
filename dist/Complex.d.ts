/**
 * FFTに必要な複素数の計算を扱う。
 */
export default class Complex {
    /**実数部 */
    re: number;
    /** 虚数部 */
    sub: number;
    constructor(re?: number, sub?: number);
    /**
     * 実数から複素数を得る
     * @param theta 位相
     */
    Expi(theta: number): Complex;
    /**
     * 複素数の足し算
     * @param value 複素数
     * @returns 複素数
     */
    Add(value: Complex): Complex;
    /**
     * 複素数の引き算
     * @param value 複素数
     * @returns 複素数
     */
    Sub(value: Complex): Complex;
    /**
     * 複素数の掛け算
     * @param value 複素数
     * @returns 複素数
     */
    Mul(value: Complex): Complex;
}
