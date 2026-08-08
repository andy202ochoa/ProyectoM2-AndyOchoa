const request = require("supertest");

const app = require("../src/app");

describe("Authors API", () => {
  test("GET /authors should return 200", async () => {
    const response = await request(app)
      .get("/authors");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /authors/:id should return 404 for non-existing author", async () => {
    const response = await request(app)
      .get("/authors/999999");

    expect(response.statusCode).toBe(404);
  });

  test("POST /authors should return 400 without name", async () => {
    const response = await request(app)
      .post("/authors")
      .send({
        email: "test@example.com",
        bio: "Test",
      });

    expect(response.statusCode).toBe(400);
  });

  test("POST /authors should create an author", async () => {
    const uniqueEmail =
      `test-${Date.now()}@example.com`;

    const response = await request(app)
      .post("/authors")
      .send({
        name: "Test Author",
        email: uniqueEmail,
        bio: "Test bio",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Test Author");
  });
});
// TEMPORAL
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const pool = require("../src/config/db");

afterAll(async () => {
  await pool.end();
});