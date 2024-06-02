import WaveAnalyse from "../src/WaveAnalyse";

describe("WaveAnalyseのテスト", () => {
  test("PreEmphasis", () => {
    const wa = new WaveAnalyse();
    const result1 = wa.PreEmphasis([0.1, 0.2, 0.3, 0.4, 0.5]);
    const answer1 = new Array(0.1, 0.103, 0.106, 0.109, 0.112);
    for (let i = 0; i < result1.length; i++) {
      expect(result1[i]).toBeCloseTo(answer1[i]);
    }
    const result2 = wa.PreEmphasis([0.1, 0.2, 0.3, 0.4, 0.5], 0.5);
    const answer2 = new Array(0.1, 0.15, 0.2, 0.25, 0.3);
    for (let i = 0; i < result1.length; i++) {
      expect(result2[i]).toBeCloseTo(answer2[i]);
    }
  });

  test("makeWindow_none", () => {
    const wa = new WaveAnalyse();
    expect(wa.MakeWindow("a", 10)).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  });
  test("makeWindow_hanning", () => {
    const wa = new WaveAnalyse();
    const result1 = wa.MakeWindow("hanning", 10);
    const answer1 = new Array(
      0,
      0.095492,
      0.345492,
      0.654508,
      0.904508,
      1,
      0.904508,
      0.654508,
      0.345492,
      0.095492
    );
    for (let i = 0; i < result1.length; i++) {
      expect(result1[i]).toBeCloseTo(answer1[i]);
    }
  });
  test("makeWindow_hamming", () => {
    const wa = new WaveAnalyse();
    const result1 = wa.MakeWindow("hamming", 10);
    const answer1 = new Array(
      0.08,
      0.167852,
      0.397852,
      0.682148,
      0.912148,
      1,
      0.912148,
      0.682148,
      0.397852,
      0.167852
    );
    for (let i = 0; i < result1.length; i++) {
      expect(result1[i]).toBeCloseTo(answer1[i]);
    }
  });
  test("power", () => {
    const wa = new WaveAnalyse();
    const result1 = wa.Power(
      [0.1, -0.2, 0.3, -0.4, 0.5, -0.6, 0.7, -0.8, 0.9, -1],
      1,
      3,
      "a",
      1,
      0
    );
    const answer1 = new Array(
      -13.30993219,
      -10.14723257,
      -7.781512504,
      -5.906305295,
      -4.357285696,
      -3.039349863,
      -1.893195248,
      -0.879551704,
      -0.433514208,
      0
    );
    for (let i = 0; i < result1.length; i++) {
      expect(result1[i]).toBeCloseTo(answer1[i]);
    }
  });
  test("power_pre", () => {
    const wa = new WaveAnalyse();
    const result1 = wa.Power(
      [0.1, -0.2, 0.3, -0.4, 0.5, -0.6, 0.7, -0.8, 0.9, -1],
      1,
      3,
      "a",
      1
    );
    const answer1 = new Array(
      -9.427841427,
      -5.687831702,
      -2.981267634,
      -0.891533473,
      0.803008845,
      2.22559542,
      3.450429657,
      4.525298798,
      4.994880999,
      5.450755548
    );
    for (let i = 0; i < result1.length; i++) {
      expect(result1[i]).toBeCloseTo(answer1[i]);
    }
  });
  test("power_pre_hanning", () => {
    const wa = new WaveAnalyse();
    const result1 = wa.Power(
      [0.1, -0.2, 0.3, -0.4, 0.5, -0.6, 0.7, -0.8, 0.9, -1],
      1,
      3,
      "hanning",
      10
    );
    const answer1 = new Array(
      -20.00961685,
      -17.04655174,
      -14.83780483,
      -13.0771239,
      -11.61332274,
      -10.3607038,
      -9.266002417,
      -8.293852074,
      -17.96020462,
      -Infinity
    );
    for (let i = 0; i < result1.length; i++) {
      expect(result1[i]).toBeCloseTo(answer1[i]);
    }
  });
});
