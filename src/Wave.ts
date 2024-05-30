/**
 * Wavデータを扱います。
 * Wavにはコーデックを用いてデータ部を圧縮しているものもありますが、ここでは無圧縮の物のみを扱うこととします。
 */

import WaveHeader from "./WaveHeader";

export default class Wave {
  /**waveヘッダ */
  private header: WaveHeader;
  /**wavデータ */
  private data_: Array<number> | null;

  /**
   *
   * @param data RIFFから始まるバイト列。最小で44Byteある。データ部は含まれていてもいなくてもよい。
   */
  constructor(data: ArrayBuffer) {
    this.header = new WaveHeader(data);
    if (data.byteLength < this.header.dataIndex) {
      console.warn("このwavはヘッダ部分しかありません。");
      this.data_ = null;
    }else if(data.slice(this.header.dataIndex).byteLength % this.blockSize !==0){
        console.warn("このwavのデータ部分に欠損があります。");
        this.data_ = null;
    }else{
        this.data_=new Array();
    }
  }

  /**wavの総バイト数-8 */
  get chunksize(): number {
    return this.header.chunksize;
  }
  /**チャンネル数 */
  get channels(): number {
    return this.header.channels;
  }
  /**サンプリング周波数 */
  get sampleRate(): number {
    return this.header.sampleRate;
  }
  /**1秒間のバイト数 サンプリング周波数 * ブロックサイズ*/
  get bytePerSec(): number {
    return this.header.bytePerSec;
  }
  /**ブロックサイズ チャンネル数 * 1サンプルあたりのビット数 / 8*/
  get blockSize(): number {
    return this.header.blockSize;
  }
  /**ビット深度 */
  get bitDepth(): number {
    return this.header.bitDepth;
  }
}
