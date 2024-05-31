/**
 * Waveのヘッダを扱います。
 * WAVEヘッダは、RIFFフォーマットにおけるRIFF識別子 ～ dataサイズまでで、特に拡張されていなければ44Byteのバイナリデータです。
 */
export default class WaveHeader {
    /**wavの総バイト数-8 */
    private chunksize_;
    /**fmtチャンクのバイト数 */
    private fmtChunkSize_;
    /**フォーマット */
    private format_;
    /**チャンネル数 */
    private channels_;
    /**サンプリング周波数 */
    private sampleRate_;
    /**1秒間のバイト数 サンプリング周波数 * ブロックサイズ*/
    private bytePerSec_;
    /**ブロックサイズ チャンネル数 * 1サンプルあたりのビット数 / 8*/
    private blockSize_;
    /**ビット深度 */
    private bitDepth_;
    /**dataチャンクのバイト数 */
    private dataChunkSize_;
    /**dataの開始バイト */
    private dataIndex_;
    /**
     *
     * @param data RIFFから始まるバイト列。最小で44Byteある。データ部は含まれていてもいなくてもよい。
     * @throws RangeError 引数のバイト長が44Byte未満の場合
     * @throws Error waveヘッダのフォーマットが不正だった場合
     */
    constructor(data: ArrayBuffer);
    /**
     * wavヘッダを書き出す。
     * @returns 不要なチャンクを含まない44Byte リトルエンディアンのwavヘッダ
     */
    Output(): ArrayBuffer;
    /**wavの総バイト数-8 */
    get chunksize(): number;
    /**wavの総バイト数-8。Waveクラスからの呼び出しを想定。データ部を書き換えずにここだけを変更することはない。 */
    set chunksize(value: number);
    /**fmtチャンクのバイト数 */
    get fmtChunkSize(): number;
    /**フォーマット */
    get format(): number;
    /**チャンネル数 */
    get channels(): number;
    /**チャンネル数。Waveクラスからの呼び出しを想定。データ部を書き換えずにここだけを変更してはいけない。 */
    set channels(value: number);
    /**サンプリング周波数 */
    get sampleRate(): number;
    /**サンプリング周波数。Waveクラスからの呼び出しを想定。データ部を書き換えずにここだけを変更してはいけない。 */
    set sampleRate(value: number);
    /**1秒間のバイト数 サンプリング周波数 * ブロックサイズ*/
    get bytePerSec(): number;
    /**1秒間のバイト数 サンプリング周波数 * ブロックサイズ。Waveクラスからの呼び出しを想定。データ部を書き換えずにここだけを変更してはいけない。 */
    set bytePerSec(value: number);
    /**ブロックサイズ チャンネル数 * 1サンプルあたりのビット数 / 8*/
    get blockSize(): number;
    /**ブロックサイズ チャンネル数 * 1サンプルあたりのビット数 / 8。Waveクラスからの呼び出しを想定。データ部を書き換えずにここだけを変更してはいけない。 */
    set blockSize(value: number);
    /**ビット深度 */
    get bitDepth(): number;
    /**ビット深度。Waveクラスからの呼び出しを想定。データ部を書き換えずにここだけを変更してはいけない。 */
    set bitDepth(value: number);
    /**dataチャンクのバイト数 */
    get dataChunkSize(): number;
    /**dataチャンクのバイト数。Waveクラスからの呼び出しを想定。データ部を書き換えずにここだけを変更してはいけない。 */
    set dataChunkSize(value: number);
    /**dataの開始バイト */
    get dataIndex(): number;
}
