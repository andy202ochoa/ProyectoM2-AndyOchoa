const request = require("supertest");

const app = require("../src/app");
const pool = require("../src/config/db");

// Autor temporal para crear posts de prueba (se borra al final junto con sus posts)
let testAuthorId;

beforeAll(async () => {
  const result = await pool.query(
    "INSERT INTO authors (name, email) VALUES ($1, $2) RETURNING id",
    ["Posts Test Author", `posts-test-${Date.now()}@example.com`]
  );

  testAuthorId = result.rows[0].id;
});

afterAll(async () => {
  // ON DELETE CASCADE borra también los posts de este autor
  await pool.query("DELETE FROM authors WHERE id = $1", [testAuthorId]);
  await pool.end();
});

describe("Posts API", () => {
  test("GET /posts should return 200", async () => {
    const response = await request(app).get("/posts");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /posts/:id should return 404 for non-existing post", async () => {
    const response = await request(app).get("/posts/999999");

    expect(response.statusCode).toBe(404);
  });

  test("GET /posts/:id should return 400 for invalid id", async () => {
    const response = await request(app).get("/posts/abc");

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid post id");
  });

  test("POST /posts should return 400 without title", async () => {
    const response = await request(app).post("/posts").send({
      author_id: 1,
      content: "Content without title",
    });

    expect(response.statusCode).toBe(400);
  });

  test("POST /posts should return 400 when published is not boolean", async () => {
    const response = await request(app).post("/posts").send({
      author_id: 1,
      title: "Test post",
      content: "Test content",
      published: "si",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Published must be true or false");
  });

  test("POST /posts should return 400 with non-existing author", async () => {
    const response = await request(app).post("/posts").send({
      author_id: 999999,
      title: "Test post",
      content: "Test content",
    });

    expect(response.statusCode).toBe(400);
  });

  test("GET /posts/author/:authorId should return 200", async () => {
    const response = await request(app).get("/posts/author/1");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /posts should create a post", async () => {
    const response = await request(app).post("/posts").send({
      author_id: testAuthorId,
      title: "Post de prueba",
      content: "Contenido de prueba",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.author_id).toBe(testAuthorId);
    expect(response.body.published).toBe(false);
  });

  test("PUT /posts/:id should keep published when it is not sent", async () => {
    const created = await request(app).post("/posts").send({
      author_id: testAuthorId,
      title: "Publicado",
      content: "Contenido",
      published: true,
    });

    const response = await request(app).put(`/posts/${created.body.id}`).send({
      author_id: testAuthorId,
      title: "Publicado (editado)",
      content: "Contenido editado",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Publicado (editado)");
    expect(response.body.published).toBe(true);
  });

  test("DELETE /posts/:id should return 404 for non-existing post", async () => {
    const response = await request(app).delete("/posts/999999");

    expect(response.statusCode).toBe(404);
  });
});
