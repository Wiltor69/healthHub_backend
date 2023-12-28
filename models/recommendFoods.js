import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/index.js";
import Joi from "joi";

const recomendFoodSchema = new Schema(
  {
    name: {
      type: String,
    },
    amount: {
      type: String,
    },
    img: {
      type: String,
    },
    calories: {
      type: Number,
    },
    nutrition: {
      carbohydrates: { type: Number },
      protein: { type: Number },
      fat: { type: Number },
    },
  },
  { versionKey: false, timestamps: true }
);
recomendFoodSchema.post("save", handleMongooseError);

export const getSchema = Joi.object({
  name: Joi.string(),
  amount: Joi.string(),
  img: Joi.string(),
  calories: Joi.number(),
  nutrition: Joi.object({
    carbohydrates: Joi.number(),
    protein: Joi.number(),
    fat: Joi.number(),
  }),
});

export const RecomFood = model("recommended-food", recomendFoodSchema);
