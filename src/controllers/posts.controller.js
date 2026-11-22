const postsService = require("../services/posts.service");
const { parseId, isNonEmptyString } = require("../utils/validators");

// Valida el body de crear/actualizar post. Devuelve un mensaje de error o null.
const validatePostBody = ({ author_id, title, content, published }) => {
  if (author_id === undefined || author_id === null || author_id === "") {
    return "author_id is required";
  }

  if (!parseId(author_id)) {
    return "author_id must be a positive integer";
  }

  if (!isNonEmptyString(title)) {
    return "Title is required";
  }

  if (title.trim().length > 200) {
    return "Title must be at most 200 characters";
  }

  if (!isNonEmptyString(content)) {
    return "Content is required";
  }

  if (published !== undefined && typeof published !== "boolean") {
    return "Published must be true or false";
  }

  return null;
};

const getPosts = async (req, res, next) => {
  try {
    const posts = await postsService.getAllPosts();

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid post id",
      });
    }

    const post = await postsService.getPostById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const getPostsByAuthor = async (req, res, next) => {
  try {
    const authorId = parseId(req.params.authorId);

    if (!authorId) {
      return res.status(400).json({
        message: "Invalid author id",
      });
    }

    const posts = await postsService.getPostsByAuthor(authorId);

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { author_id, title, content, published } = req.body ?? {};

    const validationError = validatePostBody({
      author_id,
      title,
      content,
      published,
    });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const post = await postsService.createPost(
      parseId(author_id),
      title.trim(),
      content.trim(),
      published ?? false
    );

    res.status(201).json(post);
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({
        message: "Author does not exist",
      });
    }

    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid post id",
      });
    }

    const { author_id, title, content, published } = req.body ?? {};

    const validationError = validatePostBody({
      author_id,
      title,
      content,
      published,
    });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    // Si no envían "published", se mantiene el valor actual (ver posts.service.js)
    const post = await postsService.updatePost(
      id,
      parseId(author_id),
      title.trim(),
      content.trim(),
      published
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json(post);
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({
        message: "Author does not exist",
      });
    }

    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid post id",
      });
    }

    const post = await postsService.deletePost(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPost,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost,
};
