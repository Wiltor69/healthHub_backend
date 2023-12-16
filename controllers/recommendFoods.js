import { RecomFood } from "../models/recommendFoods.js";
import { ctrlWrapper } from "../helpers/index.js";

const getFoods = async (req, res) => {
  const result = await RecomFood.find({}, "-createdAt -updatedAt");

  res.json(result);
};

export default {
  getFoods: ctrlWrapper(getFoods),
};
