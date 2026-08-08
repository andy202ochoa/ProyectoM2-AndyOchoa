const { Router } = require("express");
const ctrl = require("../controllers/post.controller");

const router = Router();

router.get("/", ctrl.getPosts);
router.post("/", ctrl.createPost);

module.exports = router;