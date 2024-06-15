import Wave from "../src/Wave";
import { GenerateWave } from "../src/Wave";
import fs from "fs";

describe("Waveのテスト", () => {
  test("read_only_header", () => {
    // 44Byteの正常waveヘッダ、データ部無し
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00,
    ]);
    const wave = new Wave(safeData.buffer);
    expect(wave.chunksize).toBe(516132);
    expect(wave.channels).toBe(1);
    expect(wave.sampleRate).toBe(44100);
    expect(wave.bytePerSec).toBe(88200);
    expect(wave.blockSize).toBe(2);
    expect(wave.bitDepth).toBe(16);
    expect(wave.data).toBe(null);
    expect(wave.rData).toBe(null);
  });
  test("read_only_header", () => {
    // 44Byteの正常waveヘッダ、欠損データ有
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00, 0x00,
    ]);
    const wave = new Wave(safeData.buffer);
    expect(wave.chunksize).toBe(516132);
    expect(wave.channels).toBe(1);
    expect(wave.sampleRate).toBe(44100);
    expect(wave.bytePerSec).toBe(88200);
    expect(wave.blockSize).toBe(2);
    expect(wave.bitDepth).toBe(16);
    expect(wave.data).toBe(null);
    expect(wave.rData).toBe(null);
  });
  test("read_8bit_mono", () => {
    // 44Byteの正常waveヘッダ、bitDepth8、1ch、4frame
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x01, 0x00, 0x08, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00, 0x00, 0x01, 0xff, 0x03,
    ]);
    const wave = new Wave(safeData.buffer);
    expect(wave.chunksize).toBe(516132);
    expect(wave.channels).toBe(1);
    expect(wave.sampleRate).toBe(44100);
    expect(wave.bytePerSec).toBe(88200);
    expect(wave.blockSize).toBe(1);
    expect(wave.bitDepth).toBe(8);
    expect(wave.data).toEqual([0, 1, -1, 3]);
    expect(wave.rData).toBe(null);
  });
  test("read_8bit_stereo", () => {
    // 44Byteの正常waveヘッダ、bitDepth8、2ch、2frame
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x02, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x08, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00, 0x00, 0x01, 0xff, 0x03,
    ]);
    const wave = new Wave(safeData.buffer);
    expect(wave.chunksize).toBe(516132);
    expect(wave.channels).toBe(2);
    expect(wave.sampleRate).toBe(44100);
    expect(wave.bytePerSec).toBe(88200);
    expect(wave.blockSize).toBe(2);
    expect(wave.bitDepth).toBe(8);
    expect(wave.data).toEqual([0, -1]);
    expect(wave.rData).toEqual([1, 3]);
  });
  test("read_16bit_mono", () => {
    // 44Byteの正常waveヘッダ、bitDepth16、1ch、4frame
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00, 0x00, 0x00, 0x01, 0x00,
      0xff, 0xff, 0x03, 0x00,
    ]);
    const wave = new Wave(safeData.buffer);
    expect(wave.chunksize).toBe(516132);
    expect(wave.channels).toBe(1);
    expect(wave.sampleRate).toBe(44100);
    expect(wave.bytePerSec).toBe(88200);
    expect(wave.blockSize).toBe(2);
    expect(wave.bitDepth).toBe(16);
    expect(wave.data).toEqual([0, 1, -1, 3]);
    expect(wave.rData).toBe(null);
  });
  test("read_16bit_stereo", () => {
    // 44Byteの正常waveヘッダ、bitDepth16、2ch、4frame
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x02, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x04, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00, 0x00, 0x00, 0x01, 0x00,
      0xff, 0xff, 0x03, 0x00,
    ]);
    const wave = new Wave(safeData.buffer);
    expect(wave.chunksize).toBe(516132);
    expect(wave.channels).toBe(2);
    expect(wave.sampleRate).toBe(44100);
    expect(wave.bytePerSec).toBe(88200);
    expect(wave.blockSize).toBe(4);
    expect(wave.bitDepth).toBe(16);
    expect(wave.data).toEqual([0, -1]);
    expect(wave.rData).toEqual([1, 3]);
  });
  test("read_24bit_mono", () => {
    // 44Byteの正常waveヘッダ、bitDepth24、1ch、4frame
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x03, 0x00, 0x18, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0xff, 0xff, 0xff, 0x03, 0x00, 0x00,
    ]);
    const wave = new Wave(safeData.buffer);
    expect(wave.chunksize).toBe(516132);
    expect(wave.channels).toBe(1);
    expect(wave.sampleRate).toBe(44100);
    expect(wave.bytePerSec).toBe(88200);
    expect(wave.blockSize).toBe(3);
    expect(wave.bitDepth).toBe(24);
    expect(wave.data).toEqual([0, 1, -1, 3]);
    expect(wave.rData).toBe(null);
  });
  test("setChannels", () => {
    // 44Byteの正常waveヘッダ、bitDepth16、1ch、4frame
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00, 0x00, 0x00, 0x01, 0x00,
      0xff, 0xff, 0x03, 0x00,
    ]);
    const wave = new Wave(safeData.buffer);
    expect(wave.channels).toBe(1);
    expect(wave.blockSize).toBe(2);
    expect(wave.bytePerSec).toBe(88200);
    expect(wave.data).toEqual([0, 1, -1, 3]);
    expect(wave.rData).toBe(null);
    wave.channels = 2;
    expect(wave.channels).toBe(2);
    expect(wave.blockSize).toBe(4);
    expect(wave.bytePerSec).toBe(176400);
    expect(wave.data).toEqual([0, 1, -1, 3]);
    expect(wave.rData).toEqual([0, 1, -1, 3]);
    wave.channels = 1;
    expect(wave.channels).toBe(1);
    expect(wave.blockSize).toBe(2);
    expect(wave.bytePerSec).toBe(88200);
    expect(wave.data).toEqual([0, 1, -1, 3]);
    expect(wave.rData).toBe(null);
  });
  test("setBitDepth", () => {
    // 44Byteの正常waveヘッダ、bitDepth16、1ch、4frame
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00, 0x00, 0x00, 0x00, 0x10,
      0x00, 0xf0, 0x00, 0x30,
    ]);
    const wave = new Wave(safeData.buffer);
    expect(wave.bitDepth).toBe(16);
    expect(wave.data).toEqual([0, 4096, -4096, 12288]);
    expect(wave.blockSize).toBe(2);
    expect(wave.bytePerSec).toBe(88200);
    // 8,16,24,32以外の時何もしない。
    wave.bitDepth = 7;
    expect(wave.bitDepth).toBe(16);
    expect(wave.data).toEqual([0, 4096, -4096, 12288]);
    expect(wave.blockSize).toBe(2);
    expect(wave.bytePerSec).toBe(88200);
    // 変換確認
    wave.bitDepth = 8;
    expect(wave.bitDepth).toBe(8);
    expect(wave.data).toEqual([0, 16, -16, 48]);
    expect(wave.blockSize).toBe(1);
    expect(wave.bytePerSec).toBe(44100);
    wave.bitDepth = 24;
    expect(wave.bitDepth).toBe(24);
    expect(wave.data).toEqual([0, 1048576, -1048576, 3145728]);
    expect(wave.blockSize).toBe(3);
    expect(wave.bytePerSec).toBe(132300);
    // ステレオ確認
    wave.channels = 2;
    wave.bitDepth = 8;
    expect(wave.bitDepth).toBe(8);
    expect(wave.data).toEqual([0, 16, -16, 48]);
    expect(wave.rData).toEqual([0, 16, -16, 48]);
    expect(wave.blockSize).toBe(2);
    expect(wave.bytePerSec).toBe(88200);
  });

  test("setSampleRateMonoJust", () => {
    const buffer = fs.readFileSync("./__tests__/test_data/1Hzsin_48000_16.wav");
    const ab = new ArrayBuffer(buffer.length);
    const safeData = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; i++) {
      safeData[i] = buffer[i];
    }
    const wav = new Wave(safeData.buffer);
    expect(wav.bitDepth).toBe(16);
    expect(wav.sampleRate).toBe(48000);
    wav.sampleRate = 8000;
    expect(wav.sampleRate).toBe(8000);
    expect(wav.data?.slice(0, 4)).toEqual([1, 15, 27, 40]);
  });
  test("setSampleRateStereoJust", () => {
    const buffer = fs.readFileSync("./__tests__/test_data/1Hzsin_48000_16.wav");
    const ab = new ArrayBuffer(buffer.length);
    const safeData = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; i++) {
      safeData[i] = buffer[i];
    }
    const wav = new Wave(safeData.buffer);
    expect(wav.bitDepth).toBe(16);
    expect(wav.sampleRate).toBe(48000);
    wav.channels = 2;
    wav.sampleRate = 8000;
    expect(wav.sampleRate).toBe(8000);
    expect(wav.data?.slice(0, 4)).toEqual([1, 15, 27, 40]);
    expect(wav.rData?.slice(0, 4)).toEqual([1, 15, 27, 40]);
  });
  test("setSampleRateMonoNotJust", () => {
    const buffer = fs.readFileSync("./__tests__/test_data/1Hzsin_44100_16.wav");
    const ab = new ArrayBuffer(buffer.length);
    const safeData = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; i++) {
      safeData[i] = buffer[i];
    }
    const wav = new Wave(safeData.buffer);
    expect(wav.bitDepth).toBe(16);
    expect(wav.sampleRate).toBe(44100);
    wav.sampleRate = 8000;
    expect(wav.sampleRate).toBe(8000);
    expect(wav.data?.slice(0, 4)).toEqual([1, 13, 24, 39]);
  });
  test("setSampleRateMonoAdd", () => {
    const buffer = fs.readFileSync("./__tests__/test_data/1Hzsin_48000_16.wav");
    const ab = new ArrayBuffer(buffer.length);
    const safeData = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; i++) {
      safeData[i] = buffer[i];
    }
    const wav = new Wave(safeData.buffer);
    expect(wav.bitDepth).toBe(16);
    expect(wav.sampleRate).toBe(48000);
    wav.sampleRate = 96000;
    expect(wav.sampleRate).toBe(96000);
    expect(wav.data?.slice(0, 8)).toEqual([1, 1, 0, 4, 8, 6, 3, 7]);
  });
  test("output_8bit_mono", () => {
    // 44Byteの正常waveヘッダ、bitDepth8、1ch、4frame
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x28, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x01, 0x00, 0x08, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x04, 0x00, 0x00, 0x00, 0x00, 0x01, 0xff, 0x03,
    ]);
    const wave = new Wave(safeData.buffer);
    expect(wave.chunksize).toBe(40);
    expect(wave.channels).toBe(1);
    expect(wave.sampleRate).toBe(44100);
    expect(wave.bytePerSec).toBe(88200);
    expect(wave.blockSize).toBe(1);
    expect(wave.bitDepth).toBe(8);
    expect(wave.data).toEqual([0, 1, -1, 3]);
    expect(wave.rData).toBe(null);
    expect(wave.Output()).toEqual(safeData.buffer);
  });
  test("output_8bit_stereo", () => {
    // 44Byteの正常waveヘッダ、bitDepth8、2ch、4frame
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x28, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x02, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x08, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x04, 0x00, 0x00, 0x00, 0x00, 0x01, 0xff, 0x03,
    ]);
    const wave = new Wave(safeData.buffer);
    expect(wave.chunksize).toBe(40);
    expect(wave.channels).toBe(2);
    expect(wave.sampleRate).toBe(44100);
    expect(wave.bytePerSec).toBe(88200);
    expect(wave.blockSize).toBe(2);
    expect(wave.bitDepth).toBe(8);
    expect(wave.data).toEqual([0, -1]);
    expect(wave.rData).toEqual([1, 3]);
    expect(wave.Output()).toEqual(safeData.buffer);
  });
  test("output_16bit_mono", () => {
    // 44Byteの正常waveヘッダ、bitDepth16、1ch、4frame
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x2c, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00,
      0xff, 0xff, 0x03, 0x00,
    ]);
    const safeData2 = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x30, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x02, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x04, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x00, 0xff, 0xff, 0xff, 0xff, 0x03, 0x00, 0x03, 0x00,
    ]);
    const wave = new Wave(safeData.buffer);
    expect(wave.chunksize).toBe(44);
    expect(wave.channels).toBe(1);
    expect(wave.sampleRate).toBe(44100);
    expect(wave.bytePerSec).toBe(88200);
    expect(wave.blockSize).toBe(2);
    expect(wave.bitDepth).toBe(16);
    expect(wave.data).toEqual([0, 1, -1, 3]);
    expect(wave.rData).toBe(null);
    expect(wave.Output()).toEqual(safeData.buffer);
    wave.channels = 2;
    expect(wave.channels).toBe(2);
    expect(wave.blockSize).toBe(4);
    expect(wave.Output()).toEqual(safeData2.buffer);
  });
  test("output_24bit_mono", () => {
    // 44Byteの正常waveヘッダ、bitDepth24、1ch、4frame
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x30, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x03, 0x00, 0x18, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0xff, 0xff, 0xff, 0x03, 0x00, 0x00,
    ]);
    const safeData2 = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x3c, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x02, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x06, 0x00, 0x18, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff,
      0xff, 0xff, 0x03, 0x00, 0x00, 0x03, 0x00, 0x00,
    ]);
    const wave = new Wave(safeData.buffer);
    expect(wave.chunksize).toBe(48);
    expect(wave.channels).toBe(1);
    expect(wave.sampleRate).toBe(44100);
    expect(wave.bytePerSec).toBe(88200);
    expect(wave.blockSize).toBe(3);
    expect(wave.bitDepth).toBe(24);
    expect(wave.data).toEqual([0, 1, -1, 3]);
    expect(wave.rData).toBe(null);
    expect(wave.Output()).toEqual(safeData.buffer);
    wave.channels = 2;
    expect(wave.channels).toBe(2);
    expect(wave.blockSize).toBe(6);
    expect(wave.Output()).toEqual(safeData2.buffer);
  });
  test("errordata_20240612", () => {
    const buffer = fs.readFileSync(
      "./__tests__/test_data/error_test_data_20240612.wav"
    );
    const ab = new ArrayBuffer(buffer.length);
    const safeData = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; i++) {
      safeData[i] = buffer[i];
    }
    const wav = new Wave(safeData.buffer);
    expect(wav.bitDepth).toBe(16);
    expect(wav.sampleRate).toBe(48000);
    wav.sampleRate = 44100;
    wav.Output();
  });
  test("generate_test", () => {
    const wave = GenerateWave(44100, 16, [0, 1, -1, 3]);
    expect(wave.chunksize).toBe(44);
    expect(wave.channels).toBe(1);
    expect(wave.sampleRate).toBe(44100);
    expect(wave.bytePerSec).toBe(88200);
    expect(wave.blockSize).toBe(2);
    expect(wave.bitDepth).toBe(16);
    expect(wave.data).toEqual([0, 1, -1, 3]);
    expect(wave.rData).toBe(null);
  });
  test("generate_test_stereo", () => {
    const wave = GenerateWave(44100, 16, [0, 1, -1, 3], [0, 2, -2, 5]);
    expect(wave.chunksize).toBe(52);
    expect(wave.channels).toBe(2);
    expect(wave.sampleRate).toBe(44100);
    expect(wave.bytePerSec).toBe(176400);
    expect(wave.blockSize).toBe(4);
    expect(wave.bitDepth).toBe(16);
    expect(wave.data).toEqual([0, 1, -1, 3]);
    expect(wave.rData).toEqual([0, 2, -2, 5]);
  });
});
