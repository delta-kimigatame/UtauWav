import Complex from "../src/Complex";

describe("Complexのテスト", () => {
  test("constructer", () => {
    const c1 = new Complex();
    expect(c1.re).toBe(0);
    expect(c1.sub).toBe(0);
    const c2 = new Complex(1, 2);
    expect(c2.re).toBe(1);
    expect(c2.sub).toBe(2);
  });
  test("expi", () => {
    const c1 = new Complex();
    c1.Expi(0);
    expect(c1.re).toBeCloseTo(1);
    expect(c1.sub).toBeCloseTo(0);
    c1.Expi(Math.PI / 2);
    expect(c1.re).toBeCloseTo(0);
    expect(c1.sub).toBeCloseTo(1);
    c1.Expi(Math.PI / 4);
    expect(c1.re).toBeCloseTo(1 / Math.sqrt(2));
    expect(c1.sub).toBeCloseTo(1 / Math.sqrt(2));
  });
  test("add", () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(3, 4);
    const c3 = c1.Add(c2);
    expect(c3.re).toBe(4);
    expect(c3.sub).toBe(6);
  });
  test("sub", () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(5, 4);
    const c3 = c1.Sub(c2);
    expect(c3.re).toBe(-4);
    expect(c3.sub).toBe(-2);
  });
  test("mul", () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(5, 4);
    const c3 = c1.Mul(c2);
    expect(c3.re).toBe(-3);
    expect(c3.sub).toBe(14);
  });
});
