import { handlerCore } from "../handlers/handleCore"; // змінити під свій шлях
import { toISODate, today, tomorrow } from "../utils/DateConverter";
import { describe, it, expect } from "vitest";
describe("Whatsapp command світло", () => {
  it("should return valid electricity prices", async () => {
    const event = {
      queryStringParameters: {
        id: "1001",
        start_date: toISODate(today),
        end_date: toISODate(tomorrow),
        geo_agg: "sum",
        time_trunc: "hour",
      },
    };

    const result = await handlerCore(event as any);
    console.log("🚀 ~ it ~ result:", result);
    const parsed = JSON.parse(result.body);

    expect(parsed.data).toBeDefined();
    expect(Array.isArray(parsed.data)).toBe(true);
    expect(parsed.data.length).toBeGreaterThan(0);
    expect(parsed.data[0]).toMatch(/\d+(\.\d+)?/);
    expect(parsed.data[0]).toContain("MWh");
  });
});
