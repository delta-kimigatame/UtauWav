/**
 * Wavデータを扱います。
 * Wavにはコーデックを用いてデータ部を圧縮しているものもありますが、ここでは無圧縮の物のみを扱うこととします。
 */
export default class Wave {
    /**waveヘッダ */
    private header;
    /**wavデータ */
    private data_;
    /**wavデータのRch、UTAUでは通常使用しない */
    private rData_;
    /**
     *
     * @param data RIFFから始まるバイト列。最小で44Byteある。データ部は含まれていてもいなくてもよい。
     */
    constructor(data: ArrayBuffer);
    /**
     * wavデータを出力する。
     * @returns リトルエンディアンのwavデータ。ヘッダ部は不要データを含まず44Byte
     */
    Output(): ArrayBuffer;
    /**
     * 24bitのwavデータを整数に変換する
     * @param dv wavのデータ部
     * @param index 読込開始バイト、このindexから3バイト分を読み込む
     * @returns frameの値
     */
    GetInt24(dv: DataView, index: number): number;
    /**
     * 24bitの整数をバイナリに変換する。
     * @param dv 書き込むDataView
     * @param index 書き込み開始バイト、このindexから3バイト分書き込む
     * @param value 書き込む値。Int24
     */
    SetInt24(dv: DataView, index: number, value: number): void;
    /**wavの総バイト数-8 */
    get chunksize(): number;
    /**チャンネル数 */
    get channels(): number;
    /**
     * チャンネル数
     * this.channels===valueの場合何もしない。
     * this.channels===2,value===1の場合、this.rDataをnullにする。
     * this.channels===1,value===2の場合、this.dataをthis.rDataに複製する。
     * チャンネル数を変更した場合、this.blockSizeやthis.bytePerSecも変更する。
     * @param value 1か2
     */
    set channels(value: number);
    /**サンプリング周波数 */
    get sampleRate(): number;
    /**
     * サンプリング周波数
     * this.data、this.rData部分はサンプリング周波数の変換結果に基づいて線形補完する。
     * this.header.bytePerSec、thid.header.dataChunkSize,this.header.chunkSizeを合わせて変更する。
     * @param value
     */
    set sampleRate(value: number);
    /**1秒間のバイト数 サンプリング周波数 * ブロックサイズ*/
    get bytePerSec(): number;
    /**ブロックサイズ チャンネル数 * 1サンプルあたりのビット数 / 8*/
    get blockSize(): number;
    /**ビット深度 */
    get bitDepth(): number;
    /**
     * ビット深度
     * this.data、this.rData、this.blockSize,this.bytePerSecもあわせて変更する。
     * data部分の変更は、data = data / (2 ** (this.bitDepth-1)) *  (2 ** (value-1))
     * @param value 8か16か24。それ以外の値の場合何もしない。
     */
    set bitDepth(value: number);
    /**データ部分 */
    get data(): Array<number> | null;
    /**wavデータのRch、UTAUでは通常使用しない */
    get rData(): Array<number> | null;
}
