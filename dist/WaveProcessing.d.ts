/**
 * Wavデータになんらかの加工をして返します。
 */
export default class WaveProcessing {
    constructor();
    /**
     * wavデータのDCオフセットを除去する。
     * 理想的なwavデータは正と負の総量が均等 = 平均が0となるはずである。
     * データがそのような形になっていないのは、直流成分(DC)があると解釈し、その値を取り除く。
     * @param data waveのデータ部
     * @returns DCオフセット除去後のwaveのデータ部
     */
    RemoveDCOffset(data: Array<number>): Array<number>;
    /**
     * 音量ノーマライズ
     * @param data waveのデータ部
     * @param bitDepth waveのビット深度
     * @returns 絶対値の最大値が 2 ** (bitDepth-1) -1となるwavデータ
     */
    VolumeNormalize(data: Array<number>, bitDepth: number): Array<number>;
    /**
     * データ上のノーマライズ。 \
     * 当該bit深度での理論上の最大値が1となるよう正規化する。 \
     * 小数値となっているため、このままではwavへの書き出しはできない。
     * @param data waveのデータ部
     * @param bitDepth waveのビット深度
     * @returns 理論上の最大値が1となるwaveデータ
     */
    LogicalNormalize(data: Array<number>, bitDepth: number): Array<number>;
    /**
     * LogicalNormalize済のデータをintに戻す。
     * @param data LogicalNormalize済(最大値1)のwaveデータ
     * @param bitDepth waveのビット深度
     * @returns waveのデータ(int)
     */
    InverseLogicalNormalize(data: Array<number>, bitDepth: number): Array<number>;
}
