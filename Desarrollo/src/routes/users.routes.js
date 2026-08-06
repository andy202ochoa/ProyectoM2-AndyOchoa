const { Router } = require("express");
const controller = require("../controllers/users.controller");

const router = Router();

router.get("/", controller.getUsers);
router.post("/", controller.createUser);

module.exports = router;