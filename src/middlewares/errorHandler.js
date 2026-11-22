const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // JSON mal escrito en el body (por ejemplo, falta una comilla o una coma)
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Invalid JSON body",
    });
  }

  console.error(err);

  res.status(500).json({
    message: "Internal server error",
  });
};

module.exports = errorHandler;
