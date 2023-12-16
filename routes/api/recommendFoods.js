import express from "express";
import ctrl from "../../controllers/recommendFoods.js";

const router = express.Router();

router.get("/", ctrl.getFoods);

export default router;
