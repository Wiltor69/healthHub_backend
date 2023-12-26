import Water from "../models/Water.js";
import Food from "../models/Food.js";
import {
  calculateDailyFulfillment,
  formatDate,
  calculateLeft,
  calculateAmount,
  regroupedDataByDays,
  HttpError,
  calculateAverage,
} from "../helpers/index.js";
import ControllerWrapper from "../utils/ControllerWrapper.js";
import formatTime from "../helpers/formatDateBD.js";

const getStatsForMonth = async (req, res) => {
  const { _id: owner } = req.user;
  const { monthNumber } = req.params;
  const adjustedMonth = parseInt(monthNumber) - 1;

  const startOfMonth = new Date();
  startOfMonth.setMonth(adjustedMonth, 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date();
  endOfMonth.setMonth(adjustedMonth + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  const waterInputsForThisMonth = await Water.find({
    date: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
    owner,
  });

  const foodInputsForThisMonth = await Food.find({
    date: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
    owner,
  });

  const foodAverage = calculateAverage(foodInputsForThisMonth, monthNumber);
  const waterAverage = calculateAverage(waterInputsForThisMonth, monthNumber);
  // console.log(foodAverage);

  // console.log(startOfMonth);
  // console.log(endOfMonth);

  const filteredWaterArray = Object.values(
    regroupedDataByDays(waterInputsForThisMonth)
  );

  const filteredFoodArray = Object.values(
    regroupedDataByDays(foodInputsForThisMonth)
  );
  // console.log(foodInputsForThisMonth);
  // console.log(filteredFoodArray);

  const waterResult = filteredWaterArray.map((array) => {
    const formattedDate = formatDate(array[0].date);
    // console.log(array);
    return {
      data: formattedDate,
      water: calculateAmount.calculateWaterAmount(array),
    };
  });

  console.log(waterResult);

  const foodResult = filteredFoodArray.map((array) => {
    const formattedDate = formatDate(array[0].date);

    // console.log(array);

    return {
      data: formattedDate,
      food: calculateAmount.calculateCaloriesAmount(array),
    };
  });

  const result = {
    waterAverage,
    foodAverage,
    water: waterResult,
    food: foodResult,
  };

  res.json(result);
};

const getStatsForToday = async (req, res) => {
  const { _id: owner, waterDailyNorma, caloriesDayilyNorma } = req.user;

  const currentDate = new Date();
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(currentDate);
  endOfDay.setHours(23, 59, 59, 999);

  const waterServings = await Water.find({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    owner,
  });
  const foodServings = await Food.find({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    owner,
  });

  const dailyNormFulfillment = calculateDailyFulfillment(
    waterServings,
    waterDailyNorma
  );

  const caloriesAmount = calculateAmount.calculateCaloriesAmount(foodServings);
  const waterAmount = calculateAmount.calculateWaterAmount(waterServings);
  const fatAmount = calculateAmount.calculateFatAmount(foodServings);
  const proteinAmount = calculateAmount.calculateProteinAmount(foodServings);
  const carbonohidratesAmount =
    calculateAmount.calculateCarbonohidratesAmount(foodServings);

  const waterLeft = calculateLeft(waterAmount, waterDailyNorma);
  const caloriesLeft = calculateLeft(caloriesAmount, caloriesDayilyNorma);
  const fatLeft = calculateLeft(fatAmount, 100);
  const proteinLeft = calculateLeft(proteinAmount, 130);
  const carbonohidratesLeft = calculateLeft(carbonohidratesAmount, 200);

  res.json({
    food: {
      foodServings,
      caloriesDayilyNorma,
      caloriesAmount,
      fatAmount,
      proteinAmount,
      carbonohidratesAmount,
      caloriesLeft,
      fatLeft,
      proteinLeft,
      carbonohidratesLeft,
    },
    water: {
      waterDailyNorma,
      dailyNormFulfillment,
      waterLeft,
      waterAmount,
    },
  });
};

const addMeal = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Food.create({ owner, ...req.body });
  res.status(201).json(result);
};

const addWater = async (req, res) => {
  console.log(req.user);
  const { _id: owner } = req.user;

  const result = await Water.create({ owner, ...req.body });
  console.log(result);
  res.status(201).json(result);
};

const deleteWaterById = async (req, res) => {
  const { waterId } = req.params;
  const result = await Water.findByIdAndDelete(waterId);
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json({
    message: "Delete success",
  });
};

const deleteMealById = async (req, res) => {
  const { mealId } = req.params;
  const result = await Food.findByIdAndDelete(mealId);
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json({
    message: "Delete success",
  });
};

const updateMealById = async (req, res) => {
  const { mealId } = req.params;
  const result = await Water.findByIdAndUpdate(mealId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

export default {
  deleteWaterById: ControllerWrapper(deleteWaterById),
  deleteMealById: ControllerWrapper(deleteMealById),

  addWater: ControllerWrapper(addWater),
  addMeal: ControllerWrapper(addMeal),
  getStatsForToday: ControllerWrapper(getStatsForToday),
  updateMealById: ControllerWrapper(updateMealById),

  getStatsForMonth: ControllerWrapper(getStatsForMonth),
};
