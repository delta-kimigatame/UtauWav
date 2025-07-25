/**
 * Wavデータを扱います。
 * Wavにはコーデックを用いてデータ部を圧縮しているものもありますが、ここでは無圧縮の物のみを扱うこととします。
 */

import WaveHeader from "./WaveHeader";
import WaveProcessing from "./WaveProcessing";

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
    }
    const frames: number = Math.floor(
      data.slice(
        this.header.dataIndex,
        this.header.dataIndex + this.header.dataChunkSize
      ).byteLength / this.blockSize
    );
    if (frames === 0) {
      console.warn(
        "このwavのデータ部分に欠損があるため読み込まれませんでした。"
      );
      this.data_ = null;
      this.rData_ = null;
      return;
    }
    const dv = new DataView(
      data.slice(
        this.header.dataIndex,
        this.header.dataIndex + this.header.dataChunkSize
      )
    );
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
   * wavデータを出力する。
   * @returns リトルエンディアンのwavデータ。ヘッダ部は不要データを含まず44Byte
   */
  Output(): ArrayBuffer {
    const body = new ArrayBuffer(this.header.dataChunkSize);
    const dv = new DataView(body);
    const frames: number = this.header.dataChunkSize / this.blockSize;
    for (let i = 0; i < frames; i++) {
      if (this.data === null) {
      } else if (this.bitDepth === 8) {
        dv.setInt8(i * this.blockSize, this.data[i]);
        if (this.channels === 2 && this.rData !== null) {
          dv.setInt8(i * this.blockSize + 1, this.rData[i]);
        }
      } else if (this.bitDepth === 16) {
        dv.setInt16(i * this.blockSize, this.data[i], true);
        if (this.channels === 2 && this.rData !== null) {
          dv.setInt16(i * this.blockSize + 2, this.rData[i], true);
        }
      } else if (this.bitDepth === 24) {
        this.SetInt24(dv, i * this.blockSize, this.data[i]);
        if (this.channels === 2 && this.rData !== null) {
          this.SetInt24(dv, i * this.blockSize + 3, this.rData[i]);
        }
      }
    }
    const header = this.header.Output();
    const data = new Uint8Array(header.byteLength + body.byteLength);
    data.set(new Uint8Array(header), 0);
    data.set(new Uint8Array(body), 44);
    return data.buffer;
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

  /**
   * 24bitの整数をバイナリに変換する。
   * @param dv 書き込むDataView
   * @param index 書き込み開始バイト、このindexから3バイト分書き込む
   * @param value 書き込む値。Int24
   */
  SetInt24(dv: DataView, index: number, value: number) {
    if (value < 0) {
      value = value + 2 ** 24;
    }
    dv.setUint16(index, value & 65535, true);
    dv.setUint8(index + 2, value & 16711680);
  }

  /**
   * wavデータのDCオフセットを除去する。
   * 理想的なwavデータは正と負の総量が均等 = 平均が0となるはずである。
   * データがそのような形になっていないのは、直流成分(DC)があると解釈し、その値を取り除く。
   * 2chの場合それぞれのチャンネルに処理する。
   */
  RemoveDCOffset() {
    const wp = new WaveProcessing();
    if (this.data !== null) {
      this.data_ = wp.RemoveDCOffset(this.data);
    }
    if (this.rData !== null) {
      this.rData_ = wp.RemoveDCOffset(this.rData);
    }
  }

  /**
   * 音量ノーマライズ
   * @param data waveのデータ部
   * @param bitDepth waveのビット深度
   * @returns 絶対値の最大値が 2 ** (bitDepth-1) -1となるwavデータ
   */
  VolumeNormalize() {
    const wp = new WaveProcessing();
    if (this.data !== null) {
      this.data_ = wp.VolumeNormalize(this.data, this.bitDepth);
    }
    if (this.rData !== null) {
      this.rData_ = wp.VolumeNormalize(this.rData, this.bitDepth);
    }
  }
  /**
   * データ上のノーマライズ。 \
   * 当該bit深度での理論上の最大値が1となるよう正規化する。 \
   * 小数値となっているため、このままではwavへの書き出しはできない。
   * @param targetChannels 対象チャンネル。1ならLch、2ならRch。wavのchannnelsが1の場合無視される。
   * @returns 理論上の最大値が1となるwaveデータ
   */
  LogicalNormalize(targetChannels: number): Array<number> | null {
    const wp = new WaveProcessing();
    if (this.data !== null && (this.channels === 1 || targetChannels === 1)) {
      return wp.LogicalNormalize(this.data, this.bitDepth);
    } else if (this.rData !== null && targetChannels === 2) {
      return wp.LogicalNormalize(this.rData, this.bitDepth);
    } else {
      return null;
    }
  }

  /**
   * LogicalNormalize済のデータをintに戻してwavにセットする。。
   * @param data LogicalNormalize済(最大値1)のwaveデータ
   * @param targetChannels 対象チャンネル。1ならLch、2ならRch。wavのchannnelsが1の場合無視される。
   */
  InverseLogicalNormalize(data: Array<number>, targetChannels: number) {
    const wp = new WaveProcessing();
    if (this.channels === 1 || targetChannels === 1) {
      this.data_ = wp.InverseLogicalNormalize(data, this.bitDepth);
    } else if (targetChannels === 2) {
      this.rData_ = wp.InverseLogicalNormalize(data, this.bitDepth);
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

  /**
   * サンプリング周波数
   * this.data、this.rData部分はサンプリング周波数の変換結果に基づいて線形補完する。
   * this.header.bytePerSec、thid.header.dataChunkSize,this.header.chunkSizeを合わせて変更する。
   * @param value
   */
  set sampleRate(value: number) {
    if (value === this.sampleRate) return;
    if (this.data !== null) {
      const wavsec: number = this.data.length / this.sampleRate;
      const framePerSec: number = 1 / this.sampleRate;
      const newFramePerSec: number = 1 / value;
      const newFlames: number = Math.ceil(wavsec * value);
      const newData: Array<number> = new Array();
      let newRData: Array<number> | null = null;
      if (this.channels === 2) {
        newRData = new Array();
      }
      for (let i = 0; i < newFlames; i++) {
        const startFlame: number = (newFramePerSec * i) / framePerSec;
        if (startFlame === Math.floor(startFlame)) {
          // 既存のframeと一致するポイント
          newData.push(this.data[startFlame]);
          if (newRData !== null && this.rData !== null) {
            newRData.push(this.rData[startFlame]);
          }
        } else {
          // 既存のframeと一致しないポイント(線形補完)
          const offsetFrames: number = startFlame - Math.floor(startFlame);
          newData.push(
            this.data[Math.floor(startFlame)] +
              Math.round(
                (this.data[
                  Math.min(Math.ceil(startFlame), this.data.length - 1)
                ] -
                  this.data[Math.floor(startFlame)]) *
                  offsetFrames
              )
          );
          if (newRData !== null && this.rData !== null) {
            newRData.push(
              this.rData[Math.floor(startFlame)] +
                Math.round(
                  (this.rData[Math.ceil(startFlame)] -
                    this.rData[Math.floor(startFlame)]) *
                    offsetFrames
                )
            );
          }
        }
      }
      this.data_ = newData;
      this.rData_ = newRData;
      this.header.sampleRate = value;
      this.header.bytePerSec = this.blockSize * this.sampleRate;
      const newDataChunkSize: number = this.blockSize * newFlames;
      this.header.chunksize =
        this.header.chunksize - this.header.dataChunkSize + newDataChunkSize;
      this.header.dataChunkSize = this.blockSize * newFlames;
    }
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
    if (value === this.bitDepth) return;
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

  /**
   * 新しいデータを与えてWaveオブジェクトを変更する。
   * ヘッダは与えられたデータにあわせて自動で変更される。
   * @param data wavのLchのデータ。
   * @param rData wavのRchのデータもしくはnull
   */
  SetDate(data: Array<number>, rData: Array<number> | null = null) {
    this.data_ = data;
    this.rData_ = rData;
    if (rData !== null) {
      this.channels = 2;
    } else {
      this.channels = 1;
    }
    const newDataChunkSize: number = this.blockSize * data.length;
    this.header.chunksize =
      this.header.chunksize - this.header.dataChunkSize + newDataChunkSize;
    this.header.dataChunkSize = newDataChunkSize;
  }
}

/**
 * 諸元を与えてWaveオブジェクトを生成する。
 * @param sampleRate サンプリング周波数
 * @param bitDepth ビット深度
 * @param data wavのLchのデータ。
 * @param rData wavのRchのデータもしくはnull
 * @returns waveオブジェクト
 */
export const GenerateWave = (
  sampleRate: number,
  bitDepth: number,
  data: Array<number>,
  rData: Array<number> | null = null
): Wave => {
  let channels = 1;
  if (rData !== null) {
    channels = 2;
  }
  const blockSize = (channels * bitDepth) / 8;
  const bytePerSec = blockSize * sampleRate;
  const headerData = new ArrayBuffer(44);
  const dataChunkSize = data.length * blockSize;
  const dv = new DataView(headerData);
  dv.setUint8(0, "R".charCodeAt(0));
  dv.setUint8(1, "I".charCodeAt(0));
  dv.setUint8(2, "F".charCodeAt(0));
  dv.setUint8(3, "F".charCodeAt(0));
  dv.setUint32(4, dataChunkSize + 36, true);
  dv.setUint8(8, "W".charCodeAt(0));
  dv.setUint8(9, "A".charCodeAt(0));
  dv.setUint8(10, "V".charCodeAt(0));
  dv.setUint8(11, "E".charCodeAt(0));
  dv.setUint8(12, "f".charCodeAt(0));
  dv.setUint8(13, "m".charCodeAt(0));
  dv.setUint8(14, "t".charCodeAt(0));
  dv.setUint8(15, " ".charCodeAt(0));
  dv.setUint32(16, 16, true);
  dv.setUint16(20, 1, true);
  dv.setUint16(22, channels, true);
  dv.setUint32(24, sampleRate, true);
  dv.setUint32(28, bytePerSec, true);
  dv.setUint16(32, blockSize, true);
  dv.setUint16(34, bitDepth, true);
  dv.setUint8(36, "d".charCodeAt(0));
  dv.setUint8(37, "a".charCodeAt(0));
  dv.setUint8(38, "t".charCodeAt(0));
  dv.setUint8(39, "a".charCodeAt(0));
  dv.setUint32(40, dataChunkSize, true);
  const wave = new Wave(headerData);
  wave.SetDate(data, rData);
  return wave;
};
