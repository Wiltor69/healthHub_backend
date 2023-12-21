import express from "express";
import { validateBody } from "../../middlewares/index.js";
import { updateSchema } from "../../models/user.js";
import authenticate from "../../middlewares/authenticate.js";
import ctrl from "../../controllers/user.js";

const router = express.Router();

router.get("/current", authenticate, ctrl.getUserCurrent);

router.put(
  "/update",
  authenticate,
  validateBody(updateSchema),
  ctrl.updateUser
);

export default router;
