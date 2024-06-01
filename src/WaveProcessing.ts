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
    const frames = data.length;
    let total: number = 0;
    data.forEach((d) => {
      total = total + d;
    });
    const mean: number = total / frames;
    const newData: Array<number> = new Array();
    data.forEach((d) => {
      newData.push(Math.round(d - mean));
    });
    return newData;
  }
}
