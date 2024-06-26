/**
 * Waveのヘッダを扱います。
 * WAVEヘッダは、RIFFフォーマットにおけるRIFF識別子 ～ dataサイズまでで、特に拡張されていなければ44Byteのバイナリデータです。
 */

export default class WaveHeader {
  /**wavの総バイト数-8 */
  private chunksize_: number;
  /**fmtチャンクのバイト数 */
  private fmtChunkSize_: number;
  /**フォーマット */
  private format_: number;
  /**チャンネル数 */
  private channels_: number;
  /**サンプリング周波数 */
  private sampleRate_: number;
  /**1秒間のバイト数 サンプリング周波数 * ブロックサイズ*/
  private bytePerSec_: number;
  /**ブロックサイズ チャンネル数 * 1サンプルあたりのビット数 / 8*/
  private blockSize_: number;
  /**ビット深度 */
  private bitDepth_: number;
  /**dataチャンクのバイト数 */
  private dataChunkSize_: number;
  /**dataの開始バイト */
  private dataIndex_: number;

  /**
   *
   * @param data RIFFから始まるバイト列。最小で44Byteある。データ部は含まれていてもいなくてもよい。
   * @throws RangeError 引数のバイト長が44Byte未満の場合
   * @throws Error waveヘッダのフォーマットが不正だった場合
   */
  constructor(data: ArrayBuffer) {
    const td = new TextDecoder();
    const dv = new DataView(data);
    let fmtStart: number = 12;
    let dataStart: number = 36;
    if (data.byteLength < 44) {
      throw new RangeError(
        "waveヘッダに欠損があるか、waveファイルではありません。"
      );
    } else if (td.decode(data.slice(0, 4)) !== "RIFF") {
      throw new Error(
        "このデータはwaveファイルではありません。RIFF識別子がありません。"
      );
    }
    this.chunksize_ = dv.getUint32(4, true);
    if (td.decode(data.slice(8, 12)) !== "WAVE") {
      throw new Error(
        "このデータはwaveファイルではありません。WAVE識別子がありません。"
      );
    }
    while (td.decode(data.slice(fmtStart, fmtStart + 4)) !== "fmt ") {
      fmtStart++;
      if (fmtStart + 4 > data.byteLength) {
        throw new Error(
          "このデータはwaveファイルではありません。fmt 識別子がありません。"
        );
      }
    }
    if (fmtStart + 32 > data.byteLength) {
      // fmt 以降32Byte以上なければ、絶対に文字数が足りない。
      throw new RangeError("waveヘッダに欠損があります。");
    }

    this.fmtChunkSize_ = dv.getUint32(fmtStart + 4, true);
    this.format_ = dv.getUint16(fmtStart + 8, true);
    if (this.format_ === 3) {
      throw new Error(
        "このwavファイルは32bit floatで記録されており、読み込みできません。"
      );
    } else if (this.format_ === 6) {
      throw new Error(
        "このwavファイルはA-lawコーデックで圧縮されており、読み込みできません。"
      );
    } else if (this.format_ === 7) {
      throw new Error(
        "このwavファイルはu-lawコーデックで圧縮されており、読み込みできません。"
      );
    } else if (this.format_ !== 1) {
      throw new Error(
        "このwavファイルは未知のコーデックで圧縮されており、読み込みできません。"
      );
    }
    this.channels_ = dv.getUint16(fmtStart + 10, true);
    this.sampleRate_ = dv.getUint32(fmtStart + 12, true);
    this.bytePerSec_ = dv.getUint32(fmtStart + 16, true);
    this.blockSize_ = dv.getUint16(fmtStart + 20, true);
    this.bitDepth_ = dv.getUint16(fmtStart + 22, true);

    while (td.decode(data.slice(dataStart, dataStart + 4)) !== "data") {
      dataStart++;
      if (dataStart + 4 > data.byteLength) {
        throw new Error(
          "このデータはwaveファイルではありません。data識別子がありません。"
        );
      }
    }
    if (dataStart + 8 > data.byteLength) {
      // data以降8Byte以上なければ、絶対に文字数が足りない。
      throw new RangeError("waveヘッダに欠損があります。");
    }
    this.dataChunkSize_ = dv.getUint32(dataStart + 4, true);
    this.dataIndex_ = dataStart + 8;
  }

  /**
   * wavヘッダを書き出す。
   * @returns 不要なチャンクを含まない44Byte リトルエンディアンのwavヘッダ
   */
  Output(): ArrayBuffer {
    const data = new ArrayBuffer(44);
    const dv = new DataView(data);
    dv.setUint8(0, "R".charCodeAt(0));
    dv.setUint8(1, "I".charCodeAt(0));
    dv.setUint8(2, "F".charCodeAt(0));
    dv.setUint8(3, "F".charCodeAt(0));
    dv.setUint32(4, this.chunksize, true);
    dv.setUint8(8, "W".charCodeAt(0));
    dv.setUint8(9, "A".charCodeAt(0));
    dv.setUint8(10, "V".charCodeAt(0));
    dv.setUint8(11, "E".charCodeAt(0));
    dv.setUint8(12, "f".charCodeAt(0));
    dv.setUint8(13, "m".charCodeAt(0));
    dv.setUint8(14, "t".charCodeAt(0));
    dv.setUint8(15, " ".charCodeAt(0));
    dv.setUint32(16, this.fmtChunkSize, true);
    dv.setUint16(20, this.format, true);
    dv.setUint16(22, this.channels, true);
    dv.setUint32(24, this.sampleRate, true);
    dv.setUint32(28, this.bytePerSec, true);
    dv.setUint16(32, this.blockSize, true);
    dv.setUint16(34, this.bitDepth, true);
    dv.setUint8(36, "d".charCodeAt(0));
    dv.setUint8(37, "a".charCodeAt(0));
    dv.setUint8(38, "t".charCodeAt(0));
    dv.setUint8(39, "a".charCodeAt(0));
    dv.setUint32(40, this.dataChunkSize, true);
    return data;
  }

  /**wavの総バイト数-8 */
  get chunksize(): number {
    return this.chunksize_;
  }

  /**wavの総バイト数-8。Waveクラスからの呼び出しを想定。データ部を書き換えずにここだけを変更することはない。 */
  set chunksize(value: number) {
    this.chunksize_ = value;
  }

  /**fmtチャンクのバイト数 */
  get fmtChunkSize(): number {
    return this.fmtChunkSize_;
  }

  /**フォーマット */
  get format(): number {
    return this.format_;
  }
  /**チャンネル数 */
  get channels(): number {
    return this.channels_;
  }
  /**チャンネル数。Waveクラスからの呼び出しを想定。データ部を書き換えずにここだけを変更してはいけない。 */
  set channels(value: number) {
    this.channels_ = value;
  }

  /**サンプリング周波数 */
  get sampleRate(): number {
    return this.sampleRate_;
  }
  /**サンプリング周波数。Waveクラスからの呼び出しを想定。データ部を書き換えずにここだけを変更してはいけない。 */
  set sampleRate(value: number) {
    this.sampleRate_ = value;
  }
  /**1秒間のバイト数 サンプリング周波数 * ブロックサイズ*/
  get bytePerSec(): number {
    return this.bytePerSec_;
  }
  /**1秒間のバイト数 サンプリング周波数 * ブロックサイズ。Waveクラスからの呼び出しを想定。データ部を書き換えずにここだけを変更してはいけない。 */
  set bytePerSec(value: number) {
    this.bytePerSec_ = value;
  }
  /**ブロックサイズ チャンネル数 * 1サンプルあたりのビット数 / 8*/
  get blockSize(): number {
    return this.blockSize_;
  }
  /**ブロックサイズ チャンネル数 * 1サンプルあたりのビット数 / 8。Waveクラスからの呼び出しを想定。データ部を書き換えずにここだけを変更してはいけない。 */
  set blockSize(value: number) {
    this.blockSize_ = value;
  }
  /**ビット深度 */
  get bitDepth(): number {
    return this.bitDepth_;
  }
  /**ビット深度。Waveクラスからの呼び出しを想定。データ部を書き換えずにここだけを変更してはいけない。 */
  set bitDepth(value: number) {
    this.bitDepth_ = value;
  }
  /**dataチャンクのバイト数 */
  get dataChunkSize(): number {
    return this.dataChunkSize_;
  }
  /**dataチャンクのバイト数。Waveクラスからの呼び出しを想定。データ部を書き換えずにここだけを変更してはいけない。 */
  set dataChunkSize(value: number) {
    this.dataChunkSize_ = value;
  }
  /**dataの開始バイト */
  get dataIndex(): number {
    return this.dataIndex_;
  }
}
