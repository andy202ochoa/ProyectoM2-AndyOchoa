const { Router } = require("express");
const ctrl = require("../controllers/posts.controller");

const router = Router();

router.get("/", ctrl.getPosts);
router.post("/", ctrl.createPost);

module.exports = router;