import { Schema, model } from "mongoose";
import Joi from "joi";

const mealList = ["lunch", "breakfast", "dinner", "snack"];

const foodSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  dishName: {
    type: String,
    required: true,
  },
  mealType: {
    type: String,
    enum: mealList,
    required: true,
  },
  protein: {
    type: Number,
    min: 1,
    max: 5000,
    required: [true, "Enter the value of the protein used"],
  },
  fat: {
    type: Number,
    min: 1,
    max: 5000,
    required: [true, "Enter the value of the fat used"],
  },
  carbonohidrates: {
    type: Number,
    min: 1,
    max: 5000,
    required: [true, "Enter the value of the carbonohidrates used"],
  },
  calories: {
    type: Number,
    min: 1,
    max: 5000,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

export const foodAddSchema = Joi.object({
  dishName: Joi.string().required(),
  mealType: Joi.string().required(),
  calories: Joi.string().required(),
  date: Joi.string().required(),
  carbonohidrates: Joi.string().required(),
  fat: Joi.string().required(),
  protein: Joi.string().required(),
});

export const Food = model("food", foodSchema);

export default Food;
