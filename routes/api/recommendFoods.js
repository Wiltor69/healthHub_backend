import express from "express";
import ctrl from "../../controllers/recommendFoods.js";

const router = express.Router();

router.get("/recommended-food", ctrl.getFoods);

export default router;
