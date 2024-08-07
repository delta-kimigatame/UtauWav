/**
 * Waveを分析し、特徴量を返す。
 */
export default class WaveAnalyse {
    constructor();
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
    Power(data: Array<number>, sampleRate?: number, rangeSec?: number, windowType?: string, windowSec?: number, preEmphasis?: number): Array<number>;
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
    Spectrogram(data: Array<number>, fftSize?: number, windowType?: string, windowSize?: number, preEmphasis?: number): Array<Array<number>>;
    /**
     * プリエンファシスフィルタ。高周波数帯を強調する効果がある。
     * @param data 1で正規化されたwavのデータ
     * @param p プリエンファシスの強さ。default,0.97
     * @returns プリエンファシスフィルタ適用済みのwavデータ
     */
    PreEmphasis(data: Array<number>, p?: number): Array<number>;
    /**
     * 窓関数を生成する
     * @param type 窓関数の種類、"hanning"か"hamming"を指定する。それ以外の場合1を出力する。
     * @param size 窓関数のフレーム数
     * @returns 窓関数
     */
    MakeWindow(type: string, size: number): Array<number>;
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
    F0(data: Array<number>, sampleRate?: number, fftSize?: number, stepSize?: number, f0_floor?: number, f0_ceil?: number, threshold?: number): Array<number>;
}
