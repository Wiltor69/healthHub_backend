const express = require("express");
const { validateBody } = require("../../middlewares");
const { updateSchema } = require("../../models/user");
const authenticate = require("../../middlewares/authenticate");
const { updateUser } = require("../../controllers/user");
const router = express.Router();

router.put("/update", authenticate, validateBody(updateSchema), updateUser);

module.exports = router;
