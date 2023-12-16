import { ctrlWrapper } from "../helpers/index.js";
import { User } from "../models/user.js";

const updateUser = async (req, res) => {
  const userId = req.auth._id;
  const user = User.findById(userId);

  console.log(user.weight);
  await User.findByIdAndUpdate(userId, {
    ...req.body,
  });
  res.json({ message: `updated` });
};
export default {
  updateUser: ctrlWrapper(updateUser),
};
