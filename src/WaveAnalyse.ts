/**
 * Waveを分析し、特徴量を返す。
 */

import Complex from "./Complex";
import { FFT } from "./lib/fft";

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
    const preEmphasisdData: Array<number> = this.PreEmphasis(data, preEmphasis);
    const rangeFrames = rangeSec * sampleRate;
    const windowFrames = windowSec * sampleRate;
    const window: Array<number> = this.MakeWindow(windowType, windowFrames);
    for (let i = 0; i < preEmphasisdData.length; i += windowFrames) {
      let total = 0;
      const targetFrames = preEmphasisdData.slice(i, i + rangeFrames);
      for (let j = 0; j < targetFrames.length; j++) {
        const tmp = targetFrames[j] * window[j % windowFrames];
        total = total + tmp ** 2;
      }
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
  Spectrogram(
    data: Array<number>,
    fftSize: number = 512,
    windowType: string = "hamming",
    windowSize: number = 128,
    preEmphasis: number = 0.97
  ): Array<Array<number>> {
    const spectrogram: Array<Array<Complex>> = new Array();
    const preEmphasisdData: Array<number> = this.PreEmphasis(data, preEmphasis);
    const window: Array<number> = this.MakeWindow(windowType, windowSize);
    const f=new FFT(fftSize)
    for (let i = 0; i + fftSize < preEmphasisdData.length; i += windowSize) {
      const targetFrames = preEmphasisdData.slice(i, i + fftSize);
      const complexValue: Array<Complex> = new Array();
      for (let j = 0; j < targetFrames.length; j++) {
        complexValue.push(
          new Complex(targetFrames[j] * window[j % windowSize])
        );
      }
      spectrogram.push(f.fft(complexValue));
    }
    const logSpectrogram: Array<Array<number>> = new Array();
    spectrogram.forEach((s1) => {
      const s: Array<number> = new Array();
      s1.forEach((s2) => {
        s.push(10 * Math.log10((s2.re ** 2 + s2.sub ** 2) ** 0.5));
      });
      logSpectrogram.push(s);
    });

    return logSpectrogram;
  }

  /**
   * プリエンファシスフィルタ。高周波数帯を強調する効果がある。
   * @param data 1で正規化されたwavのデータ
   * @param p プリエンファシスの強さ。default,0.97
   * @returns プリエンファシスフィルタ適用済みのwavデータ
   */
  PreEmphasis(data: Array<number>, p: number = 0.97): Array<number> {
    const newData: Array<number> = new Array();

    newData.push(data[0]);
    for (let i = 1; i < data.length; i++) {
      newData.push(data[i] - p * data[i - 1]);
    }

    return newData;
  }

  /**
   * 窓関数を生成する
   * @param type 窓関数の種類、"hanning"か"hamming"を指定する。それ以外の場合1を出力する。
   * @param size 窓関数のフレーム数
   * @returns 窓関数
   */
  MakeWindow(type: string, size: number): Array<number> {
    const window = new Array<number>();
    for (let i = 0; i < size; i++) {
      if (type === "hanning") {
        window.push(0.5 - 0.5 * Math.cos((2 * Math.PI * i) / size));
      } else if (type === "hamming") {
        window.push(0.54 - 0.46 * Math.cos((2 * Math.PI * i) / size));
      } else {
        window.push(1);
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
    /** fftに渡すためにwavのデータを複素数にしたもの */
    const complexValue: Array<Complex> = new Array();
    /** fftした際の最低周波数に相当するインデックス */
    const T0_floor = Math.ceil(sampleRate / f0_floor);
    /** fftした際の最高周波数に相当するインデックス */
    const T0_ceil = Math.floor(sampleRate / f0_ceil);
    /** fft高速化用クラス */
    const f=new FFT(fftSize)
    data.forEach((v) => {
      complexValue.push(new Complex(v, 0));
    });
    const halfFftSize: number = Math.floor(fftSize / 2);
    for (let i = 0; i < halfFftSize; i++) {
      complexValue.unshift(new Complex(0, 0));
      complexValue.push(new Complex(0, 0));
    }
    for (
      let i = halfFftSize;
      i < complexValue.length - halfFftSize;
      // i < 1+halfFftSize;
      i += stepSize
    ) {
      /** 当該indexの範囲のデータ */
      const targetFrames = complexValue.slice(i - halfFftSize, i + halfFftSize);
      /** fftしたデータ */
      const spec = f.fft(targetFrames);
      /** fft結果のパワー */
      const power: Array<Complex> = new Array();
      spec.forEach((s) => {
        power.push(new Complex(s.re ** 2 + s.sub ** 2, 0));
      });
      /** iFFTした結果 */
      const autocorrelation_ = f.ifft(power);
      /** 最高周波数～最低周波数の間のiFFT結果の実部を1で正規化したもの */
      const autocorrelation: Array<number> = new Array();
      autocorrelation_.slice(0, fftSize / 2).forEach((a, i) => {
        if (i < T0_ceil || i > T0_floor) {
          autocorrelation.push(0);
        } else {
          autocorrelation.push(a.re / autocorrelation_[0].re);
        }
      });
      /** ピーク値 */
      const max = autocorrelation.reduce(aryMax);
      /** ピーク値のindex */
      const maxIndex = autocorrelation.indexOf(max);
      if (max >= threshold) {
        f0.push(sampleRate/maxIndex);
      } else {
        f0.push(0);
      }
    }
    return f0;
  }
}

const aryMax = (a: number, b: number): number => {
  return Math.max(a, b);
};
