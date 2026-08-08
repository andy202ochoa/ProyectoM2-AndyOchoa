const express = require("express");

const authorsRoutes = require("./routes/authors.routes");
const postsRoutes = require("./routes/posts.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

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