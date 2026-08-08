const postsService = require("../services/posts.service");

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
    const { id } = req.params;

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
    const { authorId } = req.params;

    const posts = await postsService.getPostsByAuthor(authorId);

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const {
      author_id,
      title,
      content,
      published = false,
    } = req.body;

    if (
      author_id === undefined ||
      author_id === null ||
      author_id === ""
    ) {
      return res.status(400).json({
        message: "author_id is required",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    const post = await postsService.createPost(
      author_id,
      title.trim(),
      content.trim(),
      published
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
    const { id } = req.params;

    const {
      author_id,
      title,
      content,
      published,
    } = req.body;

    if (
      author_id === undefined ||
      author_id === null ||
      author_id === ""
    ) {
      return res.status(400).json({
        message: "author_id is required",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    const post = await postsService.updatePost(
      id,
      author_id,
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
    const { id } = req.params;

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