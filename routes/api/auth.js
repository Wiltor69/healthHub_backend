const express = require("express");
const ctrl = require("../../controllers/auth");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/auth");

const router = express.Router();

router.post("/singup", validateBody(schemas.registerSchema), ctrl.register);
router.post("/singin", validateBody(schemas.loginSchema), ctrl.login);

router.post("/singout", authenticate, ctrl.logout);

module.exports = router;
