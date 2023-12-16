import { Schema, model } from "mongoose";
import Joi from "joi";

const foodSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  dishName: {
    type: String,
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
  date: {
    type: Date,
    required: true,
  },
});

export const foodAddSchema = Joi.object({
  date: Joi.string().required(),
});

const Food = model("food", foodSchema);

export default Food;
