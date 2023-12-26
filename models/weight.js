import { Schema, model } from "mongoose";
import Joi from "joi";

const weightSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  weight: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

export const weightAddSchema = Joi.object({
  weight: Joi.number().required(),
  date: Joi.string().required(),
});

export const Weight = model("weight", weightSchema);

// export default Weight;
