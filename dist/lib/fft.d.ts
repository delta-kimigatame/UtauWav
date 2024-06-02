/**fftを計算するために必要な関数を実装する。 */
import Complex from "../Complex";
/**
 * 高速フーリエ変換、f.lengthが2のべき乗である必要がある。
 * @param f 実部がwavのフレームデータ、虚部が0の複素数
 * @returns 周波数スペクトル
 */
export declare const fft: (f: Array<Complex>) => Array<Complex>;
/**
 * 逆高速フーリエ変換、F.lengthが2のべき乗である必要がある。
 * @param F 周波数スペクトル
 * @returns 実部がwavのフレームデータ、虚部がほぼ0
 */
export declare const ifft: (F: Array<Complex>) => Array<Complex>;
