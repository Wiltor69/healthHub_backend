import { ctrlWrapper } from "../helpers/index.js";
import { User } from "../models/user.js";

const updateUser = async (req, res) => {
  const userId = req.auth._id;
  const user = User.findById(userId);
  console.log(user);
  const {
    goal = undefined,
    gender = undefined,
    age = undefined,
    height = undefined,
    weight = undefined,
    userActivity = undefined,
  } = req.body;
  const BMR = (88.362 + 13.397 * weight + 4.799 * height - 5.677 * age) * 1.2;
  console.log(user.weight);
  await User.findByIdAndUpdate(userId, {
    ...req.body,
  });
  res.json({ message: `updated` });
};
export default {
  updateUser: ctrlWrapper(updateUser),
};
