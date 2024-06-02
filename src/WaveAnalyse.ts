/**
 * Waveを分析し、特徴量を返す。
 */

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
    console.log(preEmphasisdData);
    for (let i = 0; i < preEmphasisdData.length; i++) {
      let total = 0;
      const targetFrames = preEmphasisdData.slice(i, i + rangeFrames);
      console.log(targetFrames);
      for (let j = 0; j < targetFrames.length; j++) {
        const tmp = targetFrames[j] * window[j % windowFrames];
        total = total + tmp ** 2;
      }
      power.push(10 * Math.log10(total / targetFrames.length));
    }
    return power;
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

  
}
