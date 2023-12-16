import { Food } from "../models/Food.js";
import { ctrlWrapper } from "../helpers/index.js";

const getFoods = async (req, res) => {
  const result = await Food.find({}, "-createdAt -updatedAt");

  res.json(result);
};

export default {
  getFoods: ctrlWrapper(getFoods),
};
