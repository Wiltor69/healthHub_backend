const express = require("express");
const ctrl = require("../../controllers/auth");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/auth");

const router = express.Router();

router.post("/signup", validateBody(schemas.registerSchema), ctrl.register);
router.post("/signin", validateBody(schemas.loginSchema), ctrl.login);

router.post("/signout", authenticate, ctrl.logout);

module.exports = router;
