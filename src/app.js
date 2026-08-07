const express = require("express");
const usersRoutes = require("./routes/users.routes");
const postsRoutes = require("./routes/posts.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

app.use("/users", usersRoutes);
app.use("/posts", postsRoutes);

app.get("/", (req, res) => {
  res.send("MiniBlog API 🚀");
});

app.use(errorHandler);

module.exports = app;