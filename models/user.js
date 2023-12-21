import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/index.js";
import Joi from "joi";
const goalList = ["Lose fat", "Maintain", "Gain Muscle"];
const genderList = ["Male", "Female"];
const activityList = [1.25, 1.45, 1.65, 1.85, 2];
const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },

    avatarURL: {
      type: String,
      default:
        "https://res.cloudinary.com/duz9hwe05/image/upload/v1702814259/avatar_2_kvkaro.jpg",
    },

    token: {
      type: String,
      default: null,
    },
    waterDailyNorma: {
      type: Number,
      default: 2000,
    },
    caloriesDayilyNorma: {
      type: Number,
      default: 2000,
    },
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

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const updSubscriptionSchema = Joi.object({
  subscription: Joi.string().required(),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

export const updateSchema = Joi.object({
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

export const schemas = {
  registerSchema,
  loginSchema,
  updSubscriptionSchema,
  emailSchema,
};
export const User = model("user", userSchema);
// module.exports = { User, updateSchema };
