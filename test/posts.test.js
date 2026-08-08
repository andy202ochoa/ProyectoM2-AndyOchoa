const request = require("supertest");

const app = require("../src/app");

describe("Posts API", () => {
  test("GET /posts should return 200", async () => {
    const response = await request(app)
      .get("/posts");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /posts/:id should return 404 for non-existing post", async () => {
    const response = await request(app)
      .get("/posts/999999");

    expect(response.statusCode).toBe(404);
  });

  test("POST /posts should return 400 without title", async () => {
    const response = await request(app)
      .post("/posts")
      .send({
        author_id: 1,
        content: "Content without title",
      });

    expect(response.statusCode).toBe(400);
  });

  test("POST /posts should return 400 with non-existing author", async () => {
    const response = await request(app)
      .post("/posts")
      .send({
        author_id: 999999,
        title: "Test post",
        content: "Test content",
      });

    expect(response.statusCode).toBe(400);
  });

  test("GET /posts/author/:authorId should return 200", async () => {
    const response = await request(app)
      .get("/posts/author/1");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
//TEMPORAL 
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const pool = require("../src/config/db");

afterAll(async () => {
  await pool.end();
});