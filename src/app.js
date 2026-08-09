const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const authorsRoutes = require("./routes/authors.routes");
const postsRoutes = require("./routes/posts.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

// Cargar especificación OpenAPI desde el archivo swagger.yaml en la raíz
const swaggerDocument = YAML.load(path.join(__dirname, "..", "swagger.yaml"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "MiniBlog API is running",
  });
});

app.use("/authors", authorsRoutes);
app.use("/posts", postsRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;