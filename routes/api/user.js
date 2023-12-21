import express from "express";
import { validateBody } from "../../middlewares/index.js";
import { updateSchema } from "../../models/user.js";
import authenticate from "../../middlewares/authenticate.js";
import userControllers from "../../controllers/user.js";

const router = express.Router();

router.get("/current", authenticate, userControllers.getUserCurrent);

router.put(
  "/update",
  authenticate,
  validateBody(updateSchema),
  userControllers.updateUser
);

export default router;
