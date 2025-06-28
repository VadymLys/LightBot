import { handlerCore } from "../handlers/handleCore"; // змінити під свій шлях
import { toISODate, today, tomorrow } from "../utils/DateConverter";
import { describe, it, expect } from "vitest";
describe("Telegram command /getdata", () => {
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
    const parsed = JSON.parse(result.body);

    expect(parsed.data).toBeDefined();
    expect(Array.isArray(parsed.data)).toBe(true);
    expect(parsed.data.length).toBeGreaterThan(0);
  });
});
