import WaveProcessing from "../src/WaveProcessing";

describe("WaveProcessingのテスト", () => {
  test("RemoveDCOffset", () => {
    const wp = new WaveProcessing();

    expect(wp.RemoveDCOffset([0, 5, -5, 3, -3, 0])).toEqual([
      0, 5, -5, 3, -3, 0,
    ]); // 平均が0
    expect(wp.RemoveDCOffset([1, 6, -4, 4, -2, 1])).toEqual([
      0, 5, -5, 3, -3, 0,
    ]); // 平均が1
    expect(wp.RemoveDCOffset([-1, 4, -6, 2, -4, -1])).toEqual([
      0, 5, -5, 3, -3, 0,
    ]); // 平均が-1
    expect(wp.RemoveDCOffset([2, 6, -4, 5, -2, 2])).toEqual([
      1, 5, -5, 4, -3, 1,
    ]); // 平均が1.5
  });
});
