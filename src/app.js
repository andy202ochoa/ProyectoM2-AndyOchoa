const express = require("express");
const cors = require('cors');
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const authorsRoutes = require("./routes/authors.routes");
const postsRoutes = require("./routes/posts.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(cors());

app.use(express.json());

// Cargar especificación OpenAPI desde el archivo swagger.yaml en la raíz
const swaggerDocument = YAML.load(path.join(__dirname, "..", "swagger.yaml"));
// En Vercel los archivos estáticos de Swagger UI no se incluyen en la función,
// así que se cargan desde un CDN. En local se usan los de node_modules.
const SWAGGER_CDN = "https://unpkg.com/swagger-ui-dist@5";
const swaggerOptions = process.env.VERCEL
  ? {
      customCssUrl: `${SWAGGER_CDN}/swagger-ui.css`,
      customJs: [
        `${SWAGGER_CDN}/swagger-ui-bundle.js`,
        `${SWAGGER_CDN}/swagger-ui-standalone-preset.js`,
      ],
    }
  : {};

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

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