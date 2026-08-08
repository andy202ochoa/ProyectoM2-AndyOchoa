const authorsService = require("../services/authors.service");

const getAuthors = async (req, res, next) => {
  try {
    const authors = await authorsService.getAllAuthors();

    res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
};

const getAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const author = await authorsService.getAuthorById(id);

    if (!author) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
};

const createAuthor = async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const author = await authorsService.createAuthor(
      name.trim(),
      email.trim(),
      bio || null
    );

    res.status(201).json(author);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    next(error);
  }
};

const updateAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, bio } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const author = await authorsService.updateAuthor(
      id,
      name.trim(),
      email.trim(),
      bio || null
    );

    if (!author) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    res.status(200).json(author);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    next(error);
  }
};

const deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const author = await authorsService.deleteAuthor(id);

    if (!author) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};