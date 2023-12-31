import { ctrlWrapper } from "../helpers/index.js";
import { User } from "../models/user.js";
export const BMRMaleOrFemale = (user, gender) => {
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

export const waterPlus = (activity) => {
  if (activity == 1.25) {
    return 0;
  } else if (activity == 1.45 || activity == 1.65 || activity == 1.85) {
    return 0.3;
  } else {
    return 0.7;
  }
};
const updateUser = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  req.user = user;
  let BMR = req.user.caloriesDayilyNorma;
  let waterDailyNorma = req.user.waterDailyNorma;
  const {
    name = undefined,
    gender = undefined,
    age = undefined,
    height = undefined,
    weight = undefined,
    userActivity = undefined,
  } = req.body;
  if (name) {
    user.name = name;
  }
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
    const dateNow = new Date();
    const monthNow = dateNow.getMonth();
    const dayNow = dateNow.getDate();
    const arrForWholeTime = req.user.arrForWholeTime;
    const needMonth = arrForWholeTime.find(
      (year) => year.month == monthNow + 1
    ).dates;
    let needDay = needMonth.find((day) => day.date == dayNow).weight;
    needDay = weight;
    req.user.arrForWholeTime
      .find((year) => year.month == monthNow + 1)
      .dates.find((day) => day.date == dayNow).weight = needDay;
    user.arrForWholeTime = req.user.arrForWholeTime;
  }
  if (userActivity) {
    user.userActivity = userActivity;
    BMR = BMRMaleOrFemale(user, gender);
    waterDailyNorma = user.weight * 0.03 + waterPlus(user.userActivity);
  }
  if (gender) {
    user.gender = gender;
    BMR = BMRMaleOrFemale(user, gender);
  }
  await User.findByIdAndUpdate(userId, {
    ...req.body,
    caloriesDayilyNorma: BMR,
    waterDailyNorma,
    arrForWholeTime: req.user.arrForWholeTime,
  });
  res.json({ message: `user updated` });
};

const updateGoal = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  req.user = user;
  const { goal } = req.body;
  const BMR = req.user.caloriesDayilyNorma;
  let macroelementsProporsion = {};
  const onePercent = BMR / 100;
  const countGoal = (percForProtein, percForFat) => {
    user.goal = goal;
    macroelementsProporsion.protein = Math.round(
      (onePercent * percForProtein) / 4.1
    );
    macroelementsProporsion.fat = Math.round((onePercent * percForFat) / 9.3);
    macroelementsProporsion.carbonohidrates = Math.round(
      (BMR -
        macroelementsProporsion.protein * 4.1 -
        macroelementsProporsion.fat * 9.3) /
        4.1
    );
    user.macroelementsProporsion = macroelementsProporsion;
  };
  if (goal == "Lose fat") {
    countGoal(25, 20);
  }
  if (goal == "Maintain") {
    countGoal(20, 25);
  }
  if (goal == "Gain Muscle") {
    countGoal(30, 20);
  }
  await User.findByIdAndUpdate(userId, {
    goal,
    macroelementsProporsion,
  });
  res.json({ macroelementsProporsion });
};

const getUserCurrent = async (req, res) => {
  const id = req.user._id;
  try {
    const user = await User.findById(id).exec();

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  if (req.file === undefined) {
    throw HTTPError(400, "Image is undefined");
  }
  const avatarURL = req.file.path;

  await User.findByIdAndUpdate(_id, { avatarURL }, { new: true }).exec();
  res.status(200).json({ avatarURL, message: "User's avatar updated" });
};
async function doSomethingEveryDay() {
  try {
    const dateNow = new Date();
    const monthNow = dateNow.getMonth() + 1;
    const dayNow = dateNow.getDate();

    // Fetch all users from the database
    const allUsers = await User.find();

    // Loop through each user and update their information
    const updatePromises = allUsers.map(async (user) => {
      const weight = user.weight;
      const arrForWholeTime = user.arrForWholeTime || [];

      const monthEntry = arrForWholeTime.find(
        (entry) => entry.month === monthNow
      );

      if (monthEntry) {
        const newDay = {
          date: dayNow,
          weight,
        };
        monthEntry.dates.push(newDay);
      } else {
        const newMonth = {
          month: monthNow,
          dates: [
            {
              date: dayNow,
              weight,
            },
          ],
        };
        arrForWholeTime.push(newMonth);
      }

      // Update the user document in the database
      return User.findByIdAndUpdate(user._id, {
        arrForWholeTime,
      });
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    console.log("All user documents updated successfully.");
  } catch (error) {
    console.error("Error updating user documents:", error);
    throw error; // Re-throw the error for further handling
  }
}

function checkAndExecute() {
  // Отримуємо поточний час
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  // Перевірка, чи настав новий день
  if (currentHour === 0 && currentMinutes === 18) {
    // Викликаємо функцію, якщо настав новий день
    doSomethingEveryDay();
  }
}

// Визиваємо функцію кожну хвилину
setInterval(checkAndExecute, 60000);
// const changeWeight = async (req, res) => {
//   const { weight } = req.body;
//   const dateNow = new Date();
//   const monthNow = dateNow.getMonth();
//   const dayNow = dateNow.getDate();
//   const userId = req.user._id;
//   const user = await User.findById(userId);
//   req.user = user;
//   const arrForWholeTime = req.user.arrForWholeTime;
//   const needMonth = arrForWholeTime.find(
//     (year) => year.month == monthNow + 1
//   ).dates;
//   let needDay = needMonth.find((day) => day.date == dayNow).weight;
//   needDay = weight;
//   req.user.arrForWholeTime
//     .find((year) => year.month == monthNow + 1)
//     .dates.find((day) => day.date == dayNow).weight = needDay;
//   await User.findByIdAndUpdate(userId, {
//     arrForWholeTime: req.user.arrForWholeTime,
//   });
//   res.json({
//     arrForWholeTime: req.user.arrForWholeTime.find(
//       (year) => year.month == monthNow + 1
//     ),
//   });
// };
const getMonthWeight = async (req, res) => {
  const { month } = req.params;
  const arrForWholeTime = req.user.arrForWholeTime;
  const data = arrForWholeTime.find((year) => year.month == month).dates;
  res.json(data);
};
export default {
  getUserCurrent: ctrlWrapper(getUserCurrent),
  updateUser: ctrlWrapper(updateUser),
  updateGoal: ctrlWrapper(updateGoal),
  updateAvatar: ctrlWrapper(updateAvatar),
  getMonthWeight: ctrlWrapper(getMonthWeight),
};
