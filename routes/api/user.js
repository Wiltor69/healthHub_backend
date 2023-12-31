import express from "express";
import { validateBody, upload } from "../../middlewares/index.js";
import { updateSchema } from "../../models/user.js";
import authenticate from "../../middlewares/authenticate.js";
import ctrl from "../../controllers/user.js";
const router = express.Router();

router.get("/current", authenticate, ctrl.getUserCurrent);
router.get("/weight/:month", authenticate, ctrl.getMonthWeight);
router.put(
  "/update",
  authenticate,
  validateBody(updateSchema),
  ctrl.updateUser
);
router.put("/goal", authenticate, validateBody(updateSchema), ctrl.updateGoal);

router.post(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

export default router;
