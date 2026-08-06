const request = require("supertest");
const app = require("../src/app");

describe("Users API", () => {
  it("GET /users debe responder 200", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
  });

  it("POST /users sin email → 400", async () => {
    const res = await request(app)
      .post("/users")
      .send({ name: "Test" });

    expect(res.statusCode).toBe(400);
  });
});