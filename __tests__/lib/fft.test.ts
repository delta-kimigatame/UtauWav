import { fft, ifft } from "../../src/lib/fft";
import Complex from "../../src/Complex";

describe("fftのテスト", () => {
  test("fft", () => {
    const value: Array<Complex> = new Array();
    const baseData: Array<number> = new Array(
      1,
      3,
      4,
      2,
      5,
      6,
      2,
      4,
      0,
      1,
      3,
      4,
      5,
      62,
      2,
      3
    );
    const answerRe: Array<number> = new Array(
      107,
      23.29589166141268,
      -53.5477272147525,
      -49.21391810443094,
      3.6127080574846916e-15,
      49.799704542057846,
      35.54772721475249,
      -19.8816780990396,
      -63,
      -19.881678099039586,
      35.5477272147525,
      49.799704542057846,
      -3.6127080574846916e-15,
      -49.21391810443094,
      -53.54772721475249,
      23.295891661412693
    );
    const answerSub: Array<number> = new Array(
      0,
      51.72985581,
      42.96194078,
      -25.67438446,
      -59,
      -24.26017089,
      48.96194078,
      53.14406937,
      0,
      -53.14406937,
      -48.96194078,
      24.26017089,
      59,
      25.67438446,
      -42.96194078,
      -51.72985581
    );

    baseData.forEach((d) => {
      value.push(new Complex(d));
    });
    const result1 = fft(value);
    for (let i = 0; i < result1.length; i++) {
      expect(result1[i].re).toBeCloseTo(answerRe[i]);
      expect(result1[i].sub).toBeCloseTo(answerSub[i]);
    }
  });
  test("ifft", () => {
    const value: Array<Complex> = new Array();
    const baseData: Array<number> = new Array(
      1,
      3,
      4,
      2,
      5,
      6,
      2,
      4,
      0,
      1,
      3,
      4,
      5,
      62,
      2,
      3
    );
    baseData.forEach((d) => {
      value.push(new Complex(d));
    });
    const result1 = fft(value);
    const result2 = ifft(result1);
    console.log(result2);
    for (let i = 0; i < result2.length; i++) {
      expect(result2[i].re).toBeCloseTo(baseData[i]);
    }
  });
});
