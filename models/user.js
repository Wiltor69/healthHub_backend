import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/index.js";
import Joi from "joi";
const goalList = ["Lose fat", "Maintain", "Gain Muscle"];
const genderList = ["male", "female"];
const activityList = [1.2, 1.375, 1.55, 1.725, 1.9];
const userSchema = new Schema(
  {
    goal: {
      type: String,
      enum: goalList,
    },
    gender: {
      type: String,
      enum: genderList,
    },
    age: { type: Number },
    height: { type: Number },
    weight: { type: Number },
    userActivity: {
      type: Number,
      enum: activityList,
    },
    BMR: { type: Number },
    macroelementsProporsion: {
      carbonohidrates: { type: Number },
      protein: { type: Number },
      fat: { type: Number },
    },

    waterDailyNorma: {
      type: Number,
      default: 2000,
    },
    caloriesDayilyNorma: {
      type: Number,
      default: 2000,
    },
  },
  { versionKey: false, timestamps: true }
);
userSchema.post("save", handleMongooseError);
export const updateSchema = Joi.object({
  age: Joi.number(),
  height: Joi.number(),
  weight: Joi.number(),
  BMR: Joi.number(),
  macroelementsProporsion: Joi.object({
    carbonohidrates: Joi.number(),
    protein: Joi.number(),
    fat: Joi.number(),
  }),
});
export const User = model("user", userSchema);
// module.exports = { User, updateSchema };
