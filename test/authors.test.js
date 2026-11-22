const request = require("supertest");

const app = require("../src/app");
const pool = require("../src/config/db");

// Autores creados en las pruebas, para borrarlos al final
const createdAuthorIds = [];

afterAll(async () => {
  if (createdAuthorIds.length > 0) {
    await pool.query("DELETE FROM authors WHERE id = ANY($1::int[])", [
      createdAuthorIds,
    ]);
  }

  await pool.end();
});

describe("Authors API", () => {
  test("GET /authors should return 200", async () => {
    const response = await request(app).get("/authors");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /authors/:id should return 404 for non-existing author", async () => {
    const response = await request(app).get("/authors/999999");

    expect(response.statusCode).toBe(404);
  });

  test("GET /authors/:id should return 400 for invalid id", async () => {
    const response = await request(app).get("/authors/abc");

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid author id");
  });

  test("POST /authors should return 400 without name", async () => {
    const response = await request(app).post("/authors").send({
      email: "test@example.com",
      bio: "Test",
    });

    expect(response.statusCode).toBe(400);
  });

  test("POST /authors should return 400 with invalid email", async () => {
    const response = await request(app).post("/authors").send({
      name: "Test Author",
      email: "no-es-un-correo",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Email is not valid");
  });

  test("POST /authors should return 400 with invalid JSON", async () => {
    const response = await request(app)
      .post("/authors")
      .set("Content-Type", "application/json")
      .send('{"name": "Test",');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid JSON body");
  });

  test("DELETE /authors/:id should return 404 for non-existing author", async () => {
    const response = await request(app).delete("/authors/999999");

    expect(response.statusCode).toBe(404);
  });

  test("POST /authors should create an author", async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    const response = await request(app).post("/authors").send({
      name: "Test Author",
      email: uniqueEmail,
      bio: "Test bio",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Test Author");

    createdAuthorIds.push(response.body.id);

    // El autor recién creado se puede obtener por su id
    const getResponse = await request(app).get(`/authors/${response.body.id}`);

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body.email).toBe(uniqueEmail);
  });

  test("POST /authors should return 400 with duplicated email", async () => {
    const email = `dup-${Date.now()}@example.com`;

    const first = await request(app)
      .post("/authors")
      .send({ name: "Dup Author", email });

    createdAuthorIds.push(first.body.id);

    const second = await request(app)
      .post("/authors")
      .send({ name: "Dup Author 2", email });

    expect(second.statusCode).toBe(400);
    expect(second.body.message).toBe("Email already exists");
  });
});
