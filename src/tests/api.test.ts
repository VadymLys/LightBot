import request from "supertest";
import app from "./server.js";
import { describe, it, expect } from "vitest";

describe("Test Api", () => {
  it("should return 200 for GET /", async () => {
    const res = await request(app)
      .get("/indicators")
      .set("x-api-key", process.env.API_KEY || "");

    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("testing wrong route", async () => {
    const res = await request(app).get("/123");
    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({});
  });

  it("bad query parameters", async () => {
    const res = await request(app).get("/indicators/1001?start_date=bad_date");
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(typeof res.body).toBe("object");
  });

  it("reject with wrong key", async () => {
    const res = await request(app)
      .get("/indicators")
      .set("x-api-key", "WRONG_KEY");

    expect(res.status).toBe(401);
    expect(typeof res.body).toBe("object");
  });
});
