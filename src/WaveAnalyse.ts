/**
 * Waveを分析し、特徴量を返す。
 */

import Complex from "./Complex";
import { FFT } from "./lib/fft";
import { calc_spectrogram_with_rfft } from "@delta_kimigatame/fft-wasm-lib";

export default class WaveAnalyse {
  constructor() {}

  /**
   * 波形のパワーを返す
   * @param data 1で正規化されたwavのデータ
   * @param sampleRate wavのサンプリング周波数。default,44100
   * @param rangeSec パワーを計測する範囲秒。default,0.02
   * @param windowType 窓関数の種類、hanningもしくはhamming。default,hanning
   * @param windowSec 窓関数の長さ秒。default,0.01
   * @param preEmphasis プリエンファシスの強さ。default,0.97
   * @returns パワー
   */
  Power(
    data: Array<number>,
    sampleRate: number = 44100,
    rangeSec: number = 0.02,
    windowType: string = "hanning",
    windowSec: number = 0.01,
    preEmphasis: number = 0.97
  ): Array<number> {
    const power: Array<number> = new Array();
    const preEmphasisdData = this.PreEmphasis(data, preEmphasis);
    const rangeFrames = rangeSec * sampleRate;
    const windowFrames = windowSec * sampleRate;
    const window = this.MakeWindow(windowType, windowFrames);
    for (let i = 0; i < preEmphasisdData.length; i += windowFrames) {
      const targetFrames = preEmphasisdData.slice(i, i + rangeFrames);
      const tmp = targetFrames.map((t, i) => t * window[i % windowFrames]);
      const total = tmp.reduce((prev, current) => prev + current ** 2, 0);
      power.push(10 * Math.log10(total / targetFrames.length));
    }
    return power;
  }

  /**
   * スペクトログラムを返す \
   * 1次側は時間軸でframe数-fftSize個のデータがある。 \
   * 2次側は周波数方向の分解能でsampleRate/fftSizeの周波数毎のスペクトルを複素数で表す。
   * @param data 1で正規化されたwavのデータ
   * @param fftSize fftのフレーム数、2のべき乗である必要がある。default,512
   * @param windowType 窓関数の種類、hanningもしくはhamming。default,hamming
   * @param windowSize 窓関数のフレーム数。default,128
   * @param preEmphasis プリエンファシスの強さ。default,0.97
   * @returns スペクトログラム。
   */
  SpectrogramTS(
    data: Array<number>,
    fftSize: number = 512,
    windowType: string = "hamming",
    windowSize: number = 128,
    preEmphasis: number = 0.97
  ): Array<Array<number>> {
    const spectrogram: Array<Array<Complex>> = new Array();
    const preEmphasisdData: Float32Array = this.PreEmphasis(data, preEmphasis);
    const window = this.MakeWindow(windowType, windowSize);
    const f = new FFT(fftSize);
    for (let i = 0; i + fftSize < preEmphasisdData.length; i += windowSize) {
      const windowdData = preEmphasisdData
        .slice(i, i + fftSize)
        .map((t, i) => t * window[i % windowSize]);
      spectrogram.push(f.fftReal(windowdData));
    }
    /** 10 * Math.log10((s2.re ** 2 + s2.sub ** 2) ** 0.5と5 * Math.log10((s2.re ** 2 + s2.sub ** 2))は数学的に等価 */
    const logSpectrogram: Array<Array<number>> = spectrogram.map((s1) =>
      s1.map((s2) => 5 * Math.log10(s2.re * s2.re + s2.sub * s2.sub))
    );
    return logSpectrogram;
  }
  /**
   * スペクトログラムを返す \
   * 1次側は時間軸でframe数-fftSize個のデータがある。 \
   * 2次側は周波数方向の分解能でsampleRate/fftSizeの周波数毎のスペクトルを複素数で表す。
   * @param data 1で正規化されたwavのデータ
   * @param fftSize fftのフレーム数、2のべき乗である必要がある。default,512
   * @param windowType 窓関数の種類、hanningもしくはhamming。default,hamming
   * @param windowSize 窓関数のフレーム数。default,128
   * @param preEmphasis プリエンファシスの強さ。default,0.97
   * @returns スペクトログラム。
   */
  Spectrogram(
    data: Array<number>,
    fftSize: number = 512,
    windowType: string = "hamming",
    windowSize: number = 128,
    preEmphasis: number = 0.97
  ): Array<Array<number>> {
    // const spectrogram: Array<Spectrum> = new Array();
    const preEmphasisdData: Float32Array = this.PreEmphasis(data, preEmphasis);
    const window = this.MakeWindow(windowType, windowSize);
    const frameCount = Math.floor((data.length - fftSize) / windowSize) + 1;
    const flatLogSpectrogram = calc_spectrogram_with_rfft(
      fftSize,
      preEmphasisdData,
      window
    );
    const logSpectrogram = this.flatTo2D(
      flatLogSpectrogram,
      frameCount,
      fftSize / 2 + 1
    );
    return logSpectrogram;
  }
  /**
   * 1D の Float32Array を 2D の number[][] に変換する
   * @param flat   平坦化されたスペクトログラム（長さ = frameCount × freqCount）
   * @param frameCount 時間軸のフレーム数
   * @param freqCount  周波数ビン数（1 フレームあたりの要素数）
   */
  flatTo2D(
    flat: Float32Array,
    frameCount: number,
    freqCount: number
  ): number[][] {
    const out: number[][] = new Array(frameCount);
    for (let t = 0; t < frameCount; t++) {
      const row = new Array<number>(freqCount);
      const base = t * freqCount;
      for (let f = 0; f < freqCount; f++) {
        row[f] = flat[base + f];
      }
      out[t] = row;
    }
    return out;
  }
  /**
   * プリエンファシスフィルタ。高周波数帯を強調する効果がある。
   * @param data 1で正規化されたwavのデータ
   * @param p プリエンファシスの強さ。default,0.97
   * @returns プリエンファシスフィルタ適用済みのwavデータ
   */
  PreEmphasis(data: Array<number>, p: number = 0.97): Float32Array {
    const n = data.length;
    const out = new Float32Array(n);
    if (n === 0) return out;

    // out[0] は元データそのまま
    let prev = data[0];
    out[0] = prev;

    // i=1～ をループで回して一度のメモリ確保で済ませる
    for (let i = 1; i < n; i++) {
      const cur = data[i];
      // data[i] - p * data[i-1]
      const val = cur - p * prev;
      out[i] = val;
      prev = cur;
    }

    return out;
  }

  /**
   * 窓関数を生成する
   * @param type 窓関数の種類、"hanning"か"hamming"を指定する。それ以外の場合1を出力する。
   * @param size 窓関数のフレーム数
   * @returns 窓関数
   */
  MakeWindow(type: string, size: number): Float32Array {
    const window = new Float32Array(size);
    const twoPi = 2 * Math.PI;
    if (type === "hanning") {
      for (let i = 0; i < size; i++) {
        window[i] = 0.5 - 0.5 * Math.cos((twoPi * i) / size);
      }
    } else if (type === "hamming") {
      for (let i = 0; i < size; i++) {
        window[i] = 0.54 - 0.46 * Math.cos((twoPi * i) / size);
      }
    } else {
      // 矩形窓
      for (let i = 0; i < size; i++) {
        window[i] = 1;
      }
    }
    return window;
  }
  /**
   * 基本周波数を求める。
   * @param data 1で正規化されたwavのデータ
   * @param sampleRate wavのサンプリング周波数。default,44100
   * @param fftSize fftのフレーム数、2のべき乗である必要がある。default,9048
   * @param stepSize f0を求めるフレームの範囲
   * @param f0_floor 最低周波数
   * @param f0_ceil 最大周波数
   * @param threshold 推定値が有意かどうか判定する閾値
   * @returns `threshold`以上の有意な推定値が得られれば周波数、それ以外の場合0のArray
   */
  F0(
    data: Array<number>,
    sampleRate: number = 44100,
    fftSize: number = 9048,
    stepSize: number = 256,
    f0_floor: number = 40,
    f0_ceil: number = 800,
    threshold: number = 0.2
  ): Array<number> {
    const f0: Array<number> = new Array();
    /** fftした際の最低周波数に相当するインデックス */
    const T0_floor = Math.ceil(sampleRate / f0_floor);
    /** fftした際の最高周波数に相当するインデックス */
    const T0_ceil = Math.floor(sampleRate / f0_ceil);
    /** fftsizeの半分。複数回計算するため事前に算出しておく */
    const halfFftSize: number = Math.floor(fftSize / 2);
    /** padding用の配列、2回使用するため事前に代入しておく。 */
    const padding: Array<number> = new Array<number>(halfFftSize).fill(0);
    /** fft高速化用クラス */
    const f = new FFT(fftSize);
    /** fftに渡すためにwavのデータの前後にfftsizeに応じた0埋めをしたもの */
    const paddingData: Array<number> = padding.concat(data, padding);
    for (
      let i = halfFftSize;
      i < paddingData.length - halfFftSize;
      i += stepSize
    ) {
      /** 当該indexの範囲のデータ */
      const targetFrames = paddingData.slice(i - halfFftSize, i + halfFftSize);
      /** fftしたデータ */
      const spec = f.fftReal(targetFrames);
      /** fft結果のパワー */
      const power = spec.map((s) => s.re ** 2 + s.sub ** 2);
      /** iFFTした結果 */
      const autocorrelation_ = f.ifftRealtoReal(power);
      /** 最高周波数～最低周波数の間のiFFT結果の実部を1で正規化したもの */
      const autocorrelation = autocorrelation_
        .slice(0, halfFftSize)
        .map((a) => a / autocorrelation_[0]);
      /** ピーク値 */
      const max = autocorrelation.slice(T0_ceil, T0_floor).reduce(aryMax);
      /** ピーク値のindex */
      const maxIndex =
        autocorrelation.slice(T0_ceil, T0_floor).indexOf(max) + T0_ceil;
      if (max >= threshold) {
        /** maxが有意の場合倍音を用いて補正する。 */
        /** 倍音を用いて補正したindex */
        let nMaxIndex = maxIndex;
        for (let N = 2; N < Math.floor(halfFftSize / maxIndex) - 1; N++) {
          /** 現在のnMaxIndexから推定される、N倍音のインデックス */
          const nIndexCenter = Math.floor(nMaxIndex * N);
          if (nIndexCenter + 10 >= halfFftSize || nIndexCenter - 10 < 0) {
            break;
          }
          /** N倍音の最大値 */
          const nmax = autocorrelation
            .slice(nIndexCenter - 10, nIndexCenter + 10)
            .reduce(aryMax);
          /** N倍音のインデックス */
          const nn =
            autocorrelation
              .slice(nIndexCenter - 10, nIndexCenter + 10)
              .indexOf(nmax) +
            nIndexCenter -
            10;
          nMaxIndex = nn / N;
        }
        /** 倍音補正で求めた基準周波数 */
        const f0_ = sampleRate / nMaxIndex;
        if (f0_ >= f0_floor && f0_ <= f0_ceil) {
          /** 基準周波数が閾値の範囲内か? */
          f0.push(f0_);
        } else {
          f0.push(f0_floor);
        }
      } else {
        f0.push(f0_floor);
      }
    }
    return f0;
  }
}

const aryMax = (a: number, b: number): number => {
  return Math.max(a, b);
};
