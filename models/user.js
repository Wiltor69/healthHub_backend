import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/index.js";
import Joi from "joi";
const goalList = ["Lose fat", "Maintain", "Gain Muscle"];
const genderList = ["Male", "Female"];
const activityList = [1.25, 1.45, 1.65, 1.85, 2];
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
      default: 2,
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
  goal: Joi.string(),
  userActivity: Joi.string(),
  gender: Joi.string(),
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
