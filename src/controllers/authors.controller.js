const authorsService = require("../services/authors.service");
const {
  parseId,
  isNonEmptyString,
  isValidEmail,
} = require("../utils/validators");

// Valida el body de crear/actualizar autor. Devuelve un mensaje de error o null.
const validateAuthorBody = ({ name, email, bio }) => {
  if (!isNonEmptyString(name)) {
    return "Name is required";
  }

  if (name.trim().length > 100) {
    return "Name must be at most 100 characters";
  }

  if (!isNonEmptyString(email)) {
    return "Email is required";
  }

  if (!isValidEmail(email) || email.trim().length > 150) {
    return "Email is not valid";
  }

  if (bio !== undefined && bio !== null && typeof bio !== "string") {
    return "Bio must be a string";
  }

  return null;
};

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
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid author id",
      });
    }

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
    const { name, email, bio } = req.body ?? {};

    const validationError = validateAuthorBody({ name, email, bio });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
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
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid author id",
      });
    }

    const { name, email, bio } = req.body ?? {};

    const validationError = validateAuthorBody({ name, email, bio });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
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
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid author id",
      });
    }

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
