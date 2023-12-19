import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/index.js";
import Joi from "joi";
const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const authSchema = new Schema(
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
  },
  { versionKey: false, timestamps: true }
);

authSchema.post("save", handleMongooseError);

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

export const schemas = {
  registerSchema,
  loginSchema,
  updSubscriptionSchema,
  emailSchema,
};
export const Auth = model("auth", authSchema);

// export default { Auth, schemas };
