import { isValidObjectId } from "mongoose";

import { HttpError } from "../helpers/index.js";

const isValidId = (req, res, next) => {
  const { waterId, mealId } = req.params;
  if (!isValidObjectId(waterId) && !isValidObjectId(mealId)) {
    return next(HttpError(404, `${waterId} not valid id`));
  }
  next();
};

export default isValidId;
