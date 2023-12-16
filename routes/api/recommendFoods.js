import express from "express";
import ctrl from "../../controllers/recommendFoods.js";

const router = express.Router();
// const jsonParser = express.json();

router.get("/api/recommended-food", ctrl.getFoods);

export default router;
