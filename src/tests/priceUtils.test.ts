import { describe, it, expect } from "vitest";
import { finalPrice, finalValues } from "../utils/PricesUtils.js";
import { IndicatorValue } from "../types/types.js";

describe("finalPrice", () => {
  it("calculate final price correctly", () => {
    const price = finalPrice(100);
    expect(price).toBeCloseTo(0.1272, 4);
  });

  it("returns 0 for 0 input", () => {
    expect(finalPrice(0)).toBe(0);
  });

  it("returns negative final price for negative input", () => {
    expect(finalPrice(-50)).toBeCloseTo(-0.0636, 4);
  });

  it("returns a NaN for non-numeric input", () => {
    expect(Number.isNaN(finalPrice(NaN))).toBe(true);
  });

  it("returns a undefined for undefined input", () => {
    expect(Number.isNaN(finalPrice(undefined as any))).toBe(true);
  });
});

describe("finalValues", () => {
  it("response have all necessary fields", () => {
    const mock: IndicatorValue = {
      value: 42,
      datetime: "2025-06-18T15:00:00.000Z",
      geo_id: 8741,
    };

    const result = finalValues(mock);
    expect(result).toHaveProperty("datetime", mock.datetime);
    expect(result).toHaveProperty("baseValue", mock.value);
    expect(result).toHaveProperty("finalValue");
    expect(result).toHaveProperty("display");
  });

  it("correct display format", () => {
    const mock: IndicatorValue = {
      value: 100,
      datetime: "2025-06-18T15:00:00.000Z",
      geo_id: 8741,
    };

    const result = finalValues(mock);
    expect(result.baseValue).toBe(100);
    expect(typeof result.baseValue).toBe("number");
    expect(result.datetime).toBe(mock.datetime);
    expect(typeof result.datetime).toBe("string");
  });

  it("value is NaN", () => {
    const mock: IndicatorValue = {
      value: NaN,
      datetime: "2025-06-18T15:00:00.000Z",
      geo_id: 8741,
    };

    const result = finalValues(mock);
    expect(Number.isNaN(result.finalValue)).toBe(true);
  });

  it("datetime edge values", () => {
    const mock: IndicatorValue = {
      value: 42,
      datetime: "bad-date",
      geo_id: 8741,
    };

    const date = new Date(mock.datetime);

    const result = finalValues(mock);
    expect(result.display).toBe("Invalid Date");

    expect(isNaN(date.getTime())).toBe(true);
  });

  it("Min and Max values", () => {
    const mock: IndicatorValue = {
      value: Number.MAX_VALUE,
      datetime: "2025-06-18T15:00:00.000Z",
      geo_id: 8741,
    };

    const result = finalValues(mock);
    expect(result.baseValue).toBe(Number.MAX_VALUE);

    const mock2 = {
      value: Number.MIN_VALUE,
      datetime: "2024-01-01T00:00:00Z",
      geo_id: 8741,
    };

    const result2 = finalValues(mock2);
    expect(result2.baseValue).toBe(Number.MIN_VALUE);
  });
});
