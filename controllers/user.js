import { ctrlWrapper } from "../helpers/index.js";
import { User } from "../models/user.js";

const updateUser = async (req, res) => {
  console.log(req.auth);
  const userId = req.auth._id;

  await User.findByIdAndUpdate(userId, {
    goal: "lose weight",
    gender: "male",
    age: 0,
    weight: 0,
    height: 0,
    ...req.body,
  });
  res.json({ message: "updated" });
};
export default {
  updateUser: ctrlWrapper(updateUser),
};
