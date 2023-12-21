import express from "express";
import ctrl from "../../controllers/auth.js";
import { validateBody, authenticate, upload } from "../../middlewares/index.js";
import { schemas } from "../../models/user.js";

const router = express.Router();

router.post("/signup", validateBody(schemas.registerSchema), ctrl.register);
router.post("/signin", validateBody(schemas.loginSchema), ctrl.login);

router.post("/signout", authenticate, ctrl.logout);
router.post("/avatar", authenticate, upload.single("avatar"), ctrl.creatAvatar);
router.post("/forgot-password", authenticate, ctrl.forgotPassword);

export default router;
