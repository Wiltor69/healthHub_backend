import { RecomFood } from "../models/recommendFoods.js";
import { ctrlWrapper } from "../helpers/index.js";

const getFoods = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await RecomFood.find({}, "-createdAt -updatedAt", {
    skip,
    limit,
  });

  res.json(result);
};

export default {
  getFoods: ctrlWrapper(getFoods),
};
