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
/**
 * FFTに必要な計算のうち、fftsizeに依存する計算を各フレームで共有することで高速化を図る。
 */
export declare class FFT {
    /** fftsize。2のべき乗 */
    size: number;
    /** fftsizeが2の何乗か? */
    k: number;
    /** fft用の回転因子。fftsizeに依存する複素数の列 */
    twiddle: Array<Complex>;
    /** ifft用の回転因子。fftsizeに依存する複素数の列 */
    itwiddle: Array<Complex>;
    constructor(size: number);
    /**
     * FFTとiFFTの共通処理部分
     * @param c 変換元データ
     * @param twiddle 回転因子
     * @returns
     */
    fftin: (c: Array<Complex>, twiddle: Array<Complex>) => Array<Complex>;
    /**
     * 高速フーリエ変換、f.lengthが2のべき乗である必要がある。
     * @param f 実部がwavのフレームデータ、虚部が0の複素数
     * @returns 周波数スペクトル
     */
    fft: (f: Array<Complex>) => Array<Complex>;
    /**
     * 逆高速フーリエ変換、F.lengthが2のべき乗である必要がある。
     * @param F 周波数スペクトル
     * @returns 実部がwavのフレームデータ、虚部がほぼ0
     */
    ifft: (F: Array<Complex>) => Array<Complex>;
    /**
     * FFTとiFFTの共通処理部分。変換元データを実数にする
     * @param c 変換元データ
     * @param twiddle 回転因子
     * @returns
     */
    fftinReal: (c: Array<number>, twiddle: Array<Complex>) => Array<Complex>;
    /**
     * 高速フーリエ変換、f.lengthが2のべき乗である必要がある。
     * @param f 実部がwavのフレームデータ、虚部が0の複素数
     * @returns 周波数スペクトル
     */
    fftReal: (f: Array<number>) => Array<Complex>;
    /**
     * 逆高速フーリエ変換、F.lengthが2のべき乗である必要がある。
     * @param F 周波数スペクトル
     * @returns 実部がwavのフレームデータ、虚部がほぼ0
     */
    ifftReal: (F: Array<number>) => Array<Complex>;
    /**
     * 逆高速フーリエ変換、F.lengthが2のべき乗である必要がある。
     * @param F 周波数スペクトル
     * @returns 実部がwavのフレームデータ、虚部がほぼ0
     */
    ifftRealtoReal: (F: Array<number>) => Array<number>;
}
