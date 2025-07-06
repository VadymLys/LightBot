import request from "supertest";
import app from "./serverTest.js";
import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";

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
  it("checking authorization with JWT", async () => {
    const token = jwt.sign({ userId: 123 }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const res = await request(app)
      .get("/indicators")
      .set("Authorization", `Bearer ${token}`)
      .set("x-api-key", process.env.API_KEY || "");

    expect(res.statusCode).toBe(200);
    expect(res.headers).toHaveProperty("Authorization");
    expect(res.headers["Authorization"]).toBe(`Bearer${token}`);
  });
});
