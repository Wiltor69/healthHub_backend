import express from "express";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";

// require("dotenv").config();

import authRouter from "./routes/api/auth.js";
import userRouter from "./routes/api/user.js";
import foodRouter from "./routes/api/recommendFoods.js";
import statsRouter from "./routes/api/stats-router.js";
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/recommended-food", foodRouter);
app.use("/api/stats", statsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export default app;
