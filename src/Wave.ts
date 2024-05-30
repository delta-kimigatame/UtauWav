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
  /**wavデータのRch、UTAUでは通常使用しない */
  private rData_: Array<number> | null;

  /**
   *
   * @param data RIFFから始まるバイト列。最小で44Byteある。データ部は含まれていてもいなくてもよい。
   */
  constructor(data: ArrayBuffer) {
    this.header = new WaveHeader(data);
    if (data.byteLength <= this.header.dataIndex) {
      console.warn("このwavはヘッダ部分しかありません。");
      this.data_ = null;
      this.rData_ = null;
      return;
    } else if (
      data.slice(this.header.dataIndex).byteLength % this.blockSize !==
      0
    ) {
      console.warn(
        "このwavのデータ部分に欠損があるため読み込まれませんでした。"
      );
      this.data_ = null;
      this.rData_ = null;
      return;
    }
    const frames: number =
      data.slice(this.header.dataIndex).byteLength / this.blockSize;
    const dv = new DataView(data.slice(this.header.dataIndex));
    this.data_ = new Array();
    if (this.channels === 2) {
      this.rData_ = new Array();
    } else {
      this.rData_ = null;
    }
    for (let i = 0; i < frames; i++) {
      if (this.bitDepth === 8) {
        this.data_.push(dv.getInt8(i * this.blockSize));
        if (this.channels === 2) {
          this.rData_?.push(dv.getInt8(i * this.blockSize + 1));
        }
      } else if (this.bitDepth === 16) {
        this.data_.push(dv.getInt16(i * this.blockSize, true));
        if (this.channels === 2) {
          this.rData_?.push(dv.getInt16(i * this.blockSize + 2, true));
        }
      } else if (this.bitDepth === 24) {
        this.data_.push(this.GetInt24(dv, i * this.blockSize));
        if (this.channels === 2) {
          this.rData_?.push(this.GetInt24(dv, i * this.blockSize + 3));
        }
      } 
    }
  }

  /**
   * 24bitのwavデータを整数に変換する
   * @param dv wavのデータ部
   * @param index 読込開始バイト、このindexから3バイト分を読み込む
   * @returns frameの値
   */
  GetInt24(dv: DataView, index: number): number {
    let value = dv.getUint16(index, true) + dv.getUint8(index + 2) * 256 ** 2;
    if (value >= 2 ** 23) {
      value = value - 2 ** 24;
    }
    return value;
  }

  /**wavの総バイト数-8 */
  get chunksize(): number {
    return this.header.chunksize;
  }
  /**チャンネル数 */
  get channels(): number {
    return this.header.channels;
  }

  /**
   * チャンネル数
   * this.channels===valueの場合何もしない。
   * this.channels===2,value===1の場合、this.rDataをnullにする。
   * this.channels===1,value===2の場合、this.dataをthis.rDataに複製する。
   * チャンネル数を変更した場合、this.blockSizeやthis.bytePerSecも変更する。
   * @param value 1か2
   */
  set channels(value: number) {
    if (this.channels === value) {
      return;
    } else if (value === 1) {
      this.header.channels = value;
      this.rData_ = null;
      this.header.blockSize = (value * this.bitDepth) / 8;
      this.header.bytePerSec = this.blockSize * this.sampleRate;
    } else if (value === 2) {
      if (this.data_ !== null) {
        this.header.channels = value;
        this.rData_ = [...this.data_];
        this.header.blockSize = (value * this.bitDepth) / 8;
        this.header.bytePerSec = this.blockSize * this.sampleRate;
      }
    }
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

  /**
   * ビット深度
   * this.data、this.rData、this.blockSize,this.bytePerSecもあわせて変更する。
   * data部分の変更は、data = data / (2 ** (this.bitDepth-1)) *  (2 ** (value-1))
   * @param value 8か16か24。それ以外の値の場合何もしない。
   */
  set bitDepth(value: number) {
    if (value % 8 !== 0 || value > 32) {
      //waveのbit深度は8,16,24,32のためそれ以外の値は何もせず返す。
      return;
    }
    const newData = new Array();
    this.data_?.forEach((d) => {
      newData.push((d / 2 ** this.bitDepth) * 2 ** value);
    });
    this.data_ = newData;
    if (this.rData !== null) {
      const newRData = new Array();
      this.rData_?.forEach((d) => {
        newRData.push((d / 2 ** (this.bitDepth - 1)) * 2 ** (value - 1));
      });
      this.rData_ = newRData;
    }
    this.header.bitDepth = value;
    this.header.blockSize = (this.channels * this.bitDepth) / 8;
    this.header.bytePerSec = this.blockSize * this.sampleRate;
  }
  /**データ部分 */
  get data(): Array<number> | null {
    return this.data_;
  }
  /**wavデータのRch、UTAUでは通常使用しない */
  get rData(): Array<number> | null {
    return this.rData_;
  }
}
