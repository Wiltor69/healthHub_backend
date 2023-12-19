import { ctrlWrapper } from "../helpers/index.js";
import { User } from "../models/user.js";
const BMRMaleOrFemale = (user, gender) => {
  if (gender == "Male") {
    return Math.round(
      (88.362 + 13.397 * user.weight + 4.799 * user.height - 5.677 * user.age) *
        user.userActivity
    );
  } else {
    return Math.round(
      (447.593 + 9.247 * user.weight + 3.098 * user.height - 4.33 * user.age) *
        user.userActivity,
      1
    );
  }
};

const waterPlus = (activity) => {
  if (activity == 1.25) {
    return 0;
  } else if (activity == 1.45 || activity == 1.65 || activity == 1.85) {
    return 0.3;
  } else {
    return 0.7;
  }
};
const updateUser = async (req, res) => {
  const userId = req.auth._id;
  const user = await User.findById(userId);

  req.user = user;
  let BMR = req.user.caloriesDayilyNorma;
  let waterDailyNorma = req.user.waterDailyNorma;
  const {
    gender = undefined,
    age = undefined,
    height = undefined,
    weight = undefined,
    userActivity = undefined,
  } = req.body;
  if (age) {
    user.age = age;
    BMR = BMRMaleOrFemale(user, gender);
  }
  if (height) {
    user.height = height;
    BMR = BMRMaleOrFemale(user, gender);
  }
  if (weight) {
    user.weight = weight;
    BMR = BMRMaleOrFemale(user, gender);
    waterDailyNorma = (
      user.weight * 0.03 +
      waterPlus(user.userActivity)
    ).toFixed(1);

    console.log(waterDailyNorma);
  }
  if (userActivity) {
    user.userActivity = userActivity;
    BMR = BMRMaleOrFemale(user, gender);
    waterDailyNorma = (
      user.weigth * 0.3 +
      waterPlus(user.userActivity)
    ).toFixed(1);
  }
  if (gender) {
    user.gender = gender;
    BMR = BMRMaleOrFemale(user, gender);
  }
  console.log(BMR);
  await User.findByIdAndUpdate(userId, {
    ...req.body,
    caloriesDayilyNorma: BMR,
    waterDailyNorma,
  });
  res.json({ message: `updated` });
};
export default {
  updateUser: ctrlWrapper(updateUser),
};
