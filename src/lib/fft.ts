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
 * @param T 回転因子
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

/**
 * FFTに必要な計算のうち、fftsizeに依存する計算を各フレームで共有することで高速化を図る。
 */
export class FFT {
  /** fftsize。2のべき乗 */
  size: number;

  /** fftsizeが2の何乗か? */
  k: number;

  /** fft用の回転因子。fftsizeに依存する複素数の列 */
  twiddle: Array<Complex>;

  /** ifft用の回転因子。fftsizeに依存する複素数の列 */
  itwiddle: Array<Complex>;

  /** ビット逆転用のインデックス */
  revIndices: Array<number>;

  constructor(size: number) {
    this.size = size;
    this.k = Math.log2(this.size);
    const T = (-2 * Math.PI) / this.size;
    const iT = (2 * Math.PI) / this.size;
    this.twiddle = [...new Array(this.size)].map((_, i) =>
      new Complex().Expi(T * i)
    );
    this.itwiddle = [...new Array(this.size)].map((_, i) =>
      new Complex().Expi(iT * i)
    );
    this.revIndices = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.revIndices[i] = revBit(this.k, i);
    }
  }

  /**
   * FFTとiFFTの共通処理部分
   * @param c 変換元データ
   * @param twiddle 回転因子
   * @returns
   */
  fftin = (c: Array<Complex>, twiddle: Array<Complex>): Array<Complex> => {
    const rec: Array<Complex> = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      rec[i] = c[this.revIndices[i]];
    }
    let T = this.size;
    for (let Nh = 1; Nh < this.size; Nh *= 2) {
      T /= 2;
      for (let s = 0; s < this.size; s += Nh * 2) {
        for (let i = 0; i < Nh; i++) {
          const l = rec[s + i];
          const re = rec[s + i + Nh].Mul(twiddle[T * i]);
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
  fft = (f: Array<Complex>): Array<Complex> => {
    return this.fftin(f, this.twiddle);
  };

  /**
   * 逆高速フーリエ変換、F.lengthが2のべき乗である必要がある。
   * @param F 周波数スペクトル
   * @returns 実部がwavのフレームデータ、虚部がほぼ0
   */
  ifft = (F: Array<Complex>): Array<Complex> => {
    const result = this.fftin(F, this.itwiddle).map(
      (c) => new Complex(c.re / this.size, c.sub / this.size)
    );
    return result;
  };

  /**
   * FFTとiFFTの共通処理部分。変換元データを実数にする
   * @param c 変換元データ
   * @param twiddle 回転因子
   * @returns
   */
  fftinReal = (c: Array<number>|Float32Array, twiddle: Array<Complex>): Array<Complex> => {
    const rec: Array<Complex> = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      rec[i] = new Complex(c[this.revIndices[i]]);
    }
    let T = this.size;
    for (let Nh = 1; Nh < this.size; Nh *= 2) {
      T /= 2;
      for (let s = 0; s < this.size; s += Nh * 2) {
        for (let i = 0; i < Nh; i++) {
          const l = rec[s + i];
          const re = rec[s + i + Nh].Mul(twiddle[T * i]);
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
  fftReal = (f: Array<number>|Float32Array): Array<Complex> => {
    return this.fftinReal(f, this.twiddle);
  };

  /**
   * 逆高速フーリエ変換、F.lengthが2のべき乗である必要がある。
   * @param F 周波数スペクトル
   * @returns 実部がwavのフレームデータ、虚部がほぼ0
   */
  ifftReal = (F: Array<number>): Array<Complex> => {
    const result = this.fftinReal(F, this.itwiddle).map(
      (c) => new Complex(c.re / this.size, c.sub / this.size)
    );
    return result;
  };
  /**
   * 逆高速フーリエ変換、F.lengthが2のべき乗である必要がある。
   * @param F 周波数スペクトル
   * @returns 実部がwavのフレームデータ、虚部がほぼ0
   */
  ifftRealtoReal = (F: Array<number>): Array<number> => {
    const result = this.fftinReal(F, this.itwiddle).map(
      (c) => c.re / this.size
    );
    return result;
  };
}
