import Water from "../models/Water.js";
import Food from "../models/Food.js";
import {
  calculateDailyFulfillment,
  formatDate,
  calculateLeft,
  calculateAmount,
  regroupedDataByDays,
  HttpError,
} from "../helpers/index.js";
import ControllerWrapper from "../utils/ControllerWrapper.js";
import formatTime from "../helpers/formatDateBD.js";
// import { array } from "joi";

const getStatsForMonth = async (req, res) => {
  const { _id: owner } = req.auth;
  const { monthNumber } = req.params;
  // console.log(req.params);
  // console.log(req);
  // console.log(monthNumber);
  const adjustedMonth = parseInt(monthNumber);

  const startOfMonth = new Date();
  startOfMonth.setMonth(adjustedMonth, 1);
  startOfMonth.setHours(0, 0, 0, 0); // Устанавливает первое число месяца

  const endOfMonth = new Date();
  endOfMonth.setMonth(adjustedMonth + 1, 0); // Устанавливает последний день месяца
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

  const filteredWaterArray = Object.values(
    regroupedDataByDays(waterInputsForThisMonth)
  );

  const filteredFoodArray = Object.values(
    regroupedDataByDays(waterInputsForThisMonth)
  );

  // const waterResult = filteredWaterArray.map((array) => {
  //     const formattedDate = formatDate(array[0].date);

  // })

  //   const result = filteredArray.map((array) => {
  //     const formattedDate = formatDate(array[0].date);

  //     const formattedWaterRate = waterDailyNorma / 1000;

  //     const dailyNormFulfillment = calculateDailyFulfillment(
  //       array,
  //       waterDailyNorma
  //     );

  //     return {
  //       data: formattedDate,
  //       waterDailyNorma: formattedWaterRate,
  //       dailyNormFulfillment,
  //       servingOfWater: array.length,
  //     };
  //   });
  //   console.log(result);

  // const result = {
  //     water: ,

  // }

  res.json(result);
};

const getStatsForToday = async (req, res) => {
  const { _id: owner, waterDailyNorma, caloriesDayilyNorma } = req.auth;
  //   const { day, month } = req.params;
  //   const adjustedDay = parseInt(day);
  //   const adjustedMonth = parseInt(month) - 1;

  const date = new Date();
  //   date.setMonth(adjustedMonth);
  //   date.setDate(adjustedDay);

  const waterServings = await Water.find({ date, owner });
  const foodServings = await Food.find({ date, owner });

  const dailyNormFulfillment = calculateDailyFulfillment(
    waterServings,
    waterDailyNorma
  );

  const caloriesAmount = calculateAmount(foodServings);
  const waterAmount = calculateAmount(waterServings);

  const waterLeft = calculateLeft(waterAmount, waterDailyNorma);
  const caloriesLeft = calculateLeft(caloriesAmount, caloriesDayilyNorma);

  res.json({
    food: {
      caloriesDayilyNorma,
      caloriesAmount,
    },
    water: {
      waterDailyNorma,
      dailyNormFulfillment,
      waterLeft,
      waterAmount,
      // waterServings,
    },
  });
};

const addMeal = async (req, res) => {
  const { _id: owner } = req.auth;

  const result = await Food.create({ owner, ...req.body });
  res.status(201).json(result);
};

const addWater = async (req, res) => {
  console.log(req.auth);
  const { _id: owner } = req.auth;

  const result = await Water.create({ owner, ...req.body });
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

  //   getByMonth: ControllerWrapper(getByMonth),
};
