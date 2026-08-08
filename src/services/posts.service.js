const pool = require("../config/db");

const getAllPosts = async () => {
  const result = await pool.query(
    `
    SELECT
      posts.id,
      posts.author_id,
      posts.title,
      posts.content,
      posts.published,
      posts.created_at
    FROM posts
    ORDER BY posts.id ASC
    `
  );

  return result.rows;
};

const getPostById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      posts.id,
      posts.author_id,
      posts.title,
      posts.content,
      posts.published,
      posts.created_at
    FROM posts
    WHERE posts.id = $1
    `,
    [id]
  );

  return result.rows[0];
};

const getPostsByAuthor = async (authorId) => {
  const result = await pool.query(
    `
    SELECT
      posts.id,
      posts.title,
      posts.content,
      posts.published,
      posts.created_at,
      authors.id AS author_id,
      authors.name AS author_name,
      authors.email AS author_email,
      authors.bio AS author_bio
    FROM posts
    INNER JOIN authors
      ON posts.author_id = authors.id
    WHERE posts.author_id = $1
    ORDER BY posts.id ASC
    `,
    [authorId]
  );

  return result.rows;
};

const createPost = async (
  authorId,
  title,
  content,
  published = false
) => {
  const result = await pool.query(
    `
    INSERT INTO posts (
      author_id,
      title,
      content,
      published
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [authorId, title, content, published]
  );

  return result.rows[0];
};

const updatePost = async (
  id,
  authorId,
  title,
  content,
  published
) => {
  const result = await pool.query(
    `
    UPDATE posts
    SET author_id = $1,
        title = $2,
        content = $3,
        published = $4
    WHERE id = $5
    RETURNING *
    `,
    [authorId, title, content, published, id]
  );

  return result.rows[0];
};

const deletePost = async (id) => {
  const result = await pool.query(
    "DELETE FROM posts WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
};

module.exports = {
  getAllPosts,
  getPostById,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost,
};