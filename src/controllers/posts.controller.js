const pool = require("../db");

exports.getPosts = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, content, user_id } = req.body;

    if (!title || !user_id) {
      return res.status(400).json({ error: "title y user_id requeridos" });
    }

    const result = await pool.query(
      "INSERT INTO posts (title, content, user_id) VALUES ($1,$2,$3) RETURNING *",
      [title, content, user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};