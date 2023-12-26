import express from "express";
import { authenticate, isValidId } from "../../middlewares/index.js";
import { validateBody } from "../../middlewares/index.js";
import statsControllers from "../../controllers/stats-controllers.js";
import { waterAddSchema } from "../../models/Water.js";
import { foodAddSchema } from "../../models/Food.js";
const router = express.Router();

const waterAddValidate = validateBody(waterAddSchema);
const mealAddValidate = validateBody(foodAddSchema);

router.use(authenticate);

router.get("/today", statsControllers.getStatsForToday);

router.get("/month/:monthNumber", statsControllers.getStatsForMonth);

router.post("/water-intake", waterAddValidate, statsControllers.addWater);

router.post("/food-intake", mealAddValidate, statsControllers.addMeal);

router.delete(
  "/food-intake/:mealId",
  isValidId,
  statsControllers.deleteMealById
);

router.delete("/water-intake", statsControllers.deleteAllWater);

router.put(
  "/food-intake/:mealId",
  isValidId,
  waterAddValidate,
  statsControllers.updateMealById
);

export default router;
