import WaveHeader from "../src/WaveHeader";

describe("WaveHeaderのテスト", () => {
  test("length_check", () => {
    // 43Byteの欠損waveヘッダ
    const errorData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07,
    ]);
    expect(() => new WaveHeader(errorData.buffer)).toThrow(RangeError);
    expect(() => new WaveHeader(errorData.buffer)).toThrow(
      "waveヘッダに欠損があるか、waveファイルではありません。"
    );
  });
  test("riff_check", () => {
    //44Byte以上あり、頭がRiffでないwave
    const errorData = new Uint8Array([
      0x51, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00,
    ]);
    expect(() => new WaveHeader(errorData.buffer)).toThrow(
      "このデータはwaveファイルではありません。RIFF識別子がありません。"
    );
  });
  test("wave_check", () => {
    //44Byte以上あり、wave識別子が無いwave
    const errorData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x56, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00,
    ]);
    expect(() => new WaveHeader(errorData.buffer)).toThrow(
      "このデータはwaveファイルではありません。WAVE識別子がありません。"
    );
  });
  test("fmt_check", () => {
    //44Byte以上あり、fmt識別子が無いwave
    const errorData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x65, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00,
    ]);
    expect(() => new WaveHeader(errorData.buffer)).toThrow(
      "このデータはwaveファイルではありません。fmt 識別子がありません。"
    );
  });
  test("length_check_fmt_shift", () => {
    // 44Byteあるが、WAVEとfmtの間にジャンクがあり、欠損のあるwaveヘッダ
    const errorData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x00, 0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01,
      0x00, 0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10,
      0x00, 0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07,
    ]);
    expect(() => new WaveHeader(errorData.buffer)).toThrow(RangeError);
    expect(() => new WaveHeader(errorData.buffer)).toThrow(
      "waveヘッダに欠損があります。"
    );
  });
  test("length_check_data_shift", () => {
    // 44Byteあるが、WAVEとfmtの間にジャンクがあり、欠損のあるwaveヘッダ
    const errorData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x00, 0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07,
    ]);
    expect(() => new WaveHeader(errorData.buffer)).toThrow(RangeError);
    expect(() => new WaveHeader(errorData.buffer)).toThrow(
      "waveヘッダに欠損があります。"
    );
  });
  test("read_header", () => {
    // 44Byteの正常waveヘッダ
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00,
    ]);
    const whd = new WaveHeader(safeData.buffer);
    expect(whd.chunksize).toBe(516132);
    expect(whd.fmtChunkSize).toBe(16);
    expect(whd.format).toBe(1);
    expect(whd.channels).toBe(1);
    expect(whd.sampleRate).toBe(44100);
    expect(whd.bytePerSec).toBe(88200);
    expect(whd.blockSize).toBe(2);
    expect(whd.bitDepth).toBe(16);
    expect(whd.dataChunkSize).toBe(516096);
  });
  test("read_header_shift_fmt", () => {
    // WAVEとfmtの間に3バイトのジャンクが入った47バイトのヘッダ
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x00, 0x00, 0x00, 0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x01, 0x00, 0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02,
      0x00, 0x10, 0x00, 0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00,
    ]);
    const whd = new WaveHeader(safeData.buffer);
    expect(whd.chunksize).toBe(516132);
    expect(whd.fmtChunkSize).toBe(16);
    expect(whd.format).toBe(1);
    expect(whd.channels).toBe(1);
    expect(whd.sampleRate).toBe(44100);
    expect(whd.bytePerSec).toBe(88200);
    expect(whd.blockSize).toBe(2);
    expect(whd.bitDepth).toBe(16);
    expect(whd.dataChunkSize).toBe(516096);
  });
  test("read_header_shift_data", () => {
    // fmtとdataの間に3バイトのジャンクが入った47バイトのヘッダ
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x00, 0x00, 0x00, 0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00,
    ]);
    const whd = new WaveHeader(safeData.buffer);
    expect(whd.chunksize).toBe(516132);
    expect(whd.fmtChunkSize).toBe(16);
    expect(whd.format).toBe(1);
    expect(whd.channels).toBe(1);
    expect(whd.sampleRate).toBe(44100);
    expect(whd.bytePerSec).toBe(88200);
    expect(whd.blockSize).toBe(2);
    expect(whd.bitDepth).toBe(16);
    expect(whd.dataChunkSize).toBe(516096);
  });
  test("read_header_a-law", () => {
    // 44Byteの正常waveヘッダ,a-law
    const errorData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x06, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00,
    ]);
    expect(() => new WaveHeader(errorData.buffer)).toThrow(
      "このwavファイルはA-lawコーデックで圧縮されており、読み込みできません。"
    );
  });
  test("read_header_u-law", () => {
    // 44Byteの正常waveヘッダ,u-law
    const errorData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x07, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00,
    ]);
    expect(() => new WaveHeader(errorData.buffer)).toThrow(
      "このwavファイルはu-lawコーデックで圧縮されており、読み込みできません。"
    );
  });
  test("read_header_unknown", () => {
    // 44Byteの正常waveヘッダ,unknown
    const errorData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00,
    ]);
    expect(() => new WaveHeader(errorData.buffer)).toThrow(
      "このwavファイルは未知のコーデックで圧縮されており、読み込みできません。"
    );
  });
  test("data_check", () => {
    //44Byte以上あり、data識別子が無いwave
    const errorData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x63, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00,
    ]);
    expect(() => new WaveHeader(errorData.buffer)).toThrow(
      "このデータはwaveファイルではありません。data識別子がありません。"
    );
  });
  test("set_param", () => {
    // 44Byteの正常waveヘッダ
    const safeData = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xe0, 0x07, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xe0, 0x07, 0x00,
    ]);
    const whd = new WaveHeader(safeData.buffer);
    expect(whd.chunksize).toBe(516132);
    expect(whd.fmtChunkSize).toBe(16);
    expect(whd.format).toBe(1);
    expect(whd.channels).toBe(1);
    expect(whd.sampleRate).toBe(44100);
    expect(whd.bytePerSec).toBe(88200);
    expect(whd.blockSize).toBe(2);
    expect(whd.bitDepth).toBe(16);
    expect(whd.dataChunkSize).toBe(516096);
    whd.chunksize = 1;
    whd.channels = 2;
    whd.sampleRate = 3;
    whd.bytePerSec = 4;
    whd.blockSize = 5;
    whd.bitDepth = 6;
    whd.dataChunkSize = 7;
    expect(whd.chunksize).toBe(1);
    expect(whd.fmtChunkSize).toBe(16);
    expect(whd.format).toBe(1);
    expect(whd.channels).toBe(2);
    expect(whd.sampleRate).toBe(3);
    expect(whd.bytePerSec).toBe(4);
    expect(whd.blockSize).toBe(5);
    expect(whd.bitDepth).toBe(6);
    expect(whd.dataChunkSize).toBe(7);
  });
});
