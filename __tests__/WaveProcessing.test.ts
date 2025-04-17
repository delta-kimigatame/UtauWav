import { describe, expect, it } from "vitest";
import WaveProcessing from "../src/WaveProcessing";

describe("WaveProcessingのテスト", () => {
  it("RemoveDCOffset", () => {
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
  it("VolumeNormalize", () => {
    const wp = new WaveProcessing();

    expect(wp.VolumeNormalize([0, 4, -5, 3, -3, 0], 8)).toEqual([
      0, 102, -127, 76, -76, 0,
    ]);
    expect(wp.VolumeNormalize([0, 4, -5, 3, -3, 0], 16)).toEqual([
      0, 26214, -32767, 19660, -19660, 0,
    ]);
  });
  it("LogicalNormalize", () => {
    const wp = new WaveProcessing();

    expect(wp.LogicalNormalize([0, 4, -5, 3, -3, 0], 8)).toEqual([
      0, 0.03125, -0.0390625, 0.0234375, -0.0234375, 0,
    ]);
    expect(wp.LogicalNormalize([0, 4, -5, 3, -3, 0], 16)).toEqual([
      0, 0.0001220703125, -0.000152587890625, 0.000091552734375,
      -0.000091552734375, 0,
    ]);
  });
  it("InverseLogicalNormalize", () => {
    const wp = new WaveProcessing();

    expect(
      wp.InverseLogicalNormalize(
        wp.LogicalNormalize([0, 4, -5, 3, -3, 0], 8),
        8
      )
    ).toEqual([0, 4, -5, 3, -3, 0]);
    expect(
      wp.InverseLogicalNormalize(
        wp.LogicalNormalize([0, 4, -5, 3, -3, 0], 16),
        16
      )
    ).toEqual([0, 4, -5, 3, -3, 0]);
  });
});
