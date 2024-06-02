/**fftを計算するために必要な関数を実装する。 */

import Complex from "../Complex";

/**
 * 2進数の順序逆転
 * @param k 桁数
 * @param n 数
 * @returns 2進数で順序を逆転した数
 */
const revBit = (k: number, n: number): number => {
  let r = 0;
  for (let i = 0; i < k; i++) {
    r = (r << 1) | ((n >>> i) & 1);
  }
  return r;
};

/**
 * FFTとiFFTの共通処理部分
 * @param c 変換元データ
 * @param T
 * @param N 要素数
 * @returns
 */
const fftin = (c: Array<Complex>, T: number, N: number): Array<Complex> => {
  const k: number = Math.log2(N);
  const rec: Array<Complex> = c.map((_, i: number) => c[revBit(k, i)]);
  for (let Nh = 1; Nh < N; Nh *= 2) {
    T /= 2;
    for (let s = 0; s < N; s += Nh * 2) {
      for (let i = 0; i < Nh; i++) {
        const l = rec[s + i];
        const re = rec[s + i + Nh].Mul(new Complex().Expi(T * i));
        [rec[s + i], rec[s + i + Nh]] = [l.Add(re), l.Sub(re)];
      }
    }
  }
  return rec;
};

/**
 * 高速フーリエ変換、f.lengthが2のべき乗である必要がある。
 * @param f 実部がwavのフレームデータ、虚部が0の複素数
 * @returns 周波数スペクトル
 */
export const fft = (f: Array<Complex>): Array<Complex> => {
  const N = f.length;
  const T = -2 * Math.PI;
  return fftin(f, T, N);
};

/**
 * 逆高速フーリエ変換、F.lengthが2のべき乗である必要がある。
 * @param F 周波数スペクトル
 * @returns 実部がwavのフレームデータ、虚部がほぼ0
 */
export const ifft = (F: Array<Complex>): Array<Complex> => {
  const N = F.length;
  const T = 2 * Math.PI;
  const result = fftin(F, T, N).map((c) => new Complex(c.re / N, c.sub / N));
  return result;
};
