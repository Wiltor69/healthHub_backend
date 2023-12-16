import express from "express";
import ctrl from "../../controllers/recommendFoods.js";

const router = express.Router();
const jsonParser = express.json();

router.get("/api/recommended-food", jsonParser, ctrl.getFoods);

export default router;
