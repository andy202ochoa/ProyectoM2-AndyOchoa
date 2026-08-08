require("dotenv").config();

const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const usersRoutes = require("./routes/users.routes");
const postsRoutes = require("./routes/posts.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

// Swagger UI
const swaggerDocument = YAML.load(path.join(__dirname, "..", "openapi.yaml"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/users", usersRoutes);
app.use("/posts", postsRoutes);

app.get("/", (req, res) => {
  res.send("MiniBlog API 🚀");
});

app.use(errorHandler);

module.exports = app;