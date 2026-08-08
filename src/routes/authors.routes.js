const { Router } = require("express");
const ctrl = require("../controllers/users.controller");

const router = Router();

router.get("/", ctrl.getUsers);
router.get("/:id", ctrl.getUserById);
router.post("/", ctrl.createUser);
router.delete("/:id", ctrl.deleteUser);

module.exports = router;