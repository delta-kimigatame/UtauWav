/**
 * Wavデータになんらかの加工をして返します。
 */

export default class WaveProcessing {
  constructor() {}

  /**
   * wavデータのDCオフセットを除去する。
   * 理想的なwavデータは正と負の総量が均等 = 平均が0となるはずである。
   * データがそのような形になっていないのは、直流成分(DC)があると解釈し、その値を取り除く。
   * @param data waveのデータ部
   * @returns DCオフセット除去後のwaveのデータ部
   */
  RemoveDCOffset(data: Array<number>): Array<number> {
    const total = data.reduce((prev, current) => prev + current, 0);
    const mean: number = total / data.length;
    return data.map((d) => Math.round(d - mean));
  }

  /**
   * 音量ノーマライズ
   * @param data waveのデータ部
   * @param bitDepth waveのビット深度
   * @returns 絶対値の最大値が 2 ** (bitDepth-1) -1となるwavデータ
   */
  VolumeNormalize(data: Array<number>, bitDepth: number): Array<number> {
    const maxValue = data.reduce(
      (prev, current) => Math.max(prev, Math.abs(current)),
      0
    );
    return data.map((d) =>
      Math.round((d / maxValue) * (2 ** (bitDepth - 1) - 1))
    );
  }

  /**
   * データ上のノーマライズ。 \
   * 当該bit深度での理論上の最大値が1となるよう正規化する。 \
   * 小数値となっているため、このままではwavへの書き出しはできない。
   * @param data waveのデータ部
   * @param bitDepth waveのビット深度
   * @returns 理論上の最大値が1となるwaveデータ
   */
  LogicalNormalize(data: Array<number>, bitDepth: number): Array<number> {
    return data.map((d) => d / 2 ** (bitDepth - 1));
  }

  /**
   * LogicalNormalize済のデータをintに戻す。
   * @param data LogicalNormalize済(最大値1)のwaveデータ
   * @param bitDepth waveのビット深度
   * @returns waveのデータ(int)
   */
  InverseLogicalNormalize(
    data: Array<number>,
    bitDepth: number
  ): Array<number> {
    return data.map((d) => Math.round(d * 2 ** (bitDepth - 1)));
  }
}
