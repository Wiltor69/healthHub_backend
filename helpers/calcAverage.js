import { calculateAmount } from "../helpers/index.js";

const calculateAverage = (data, month) => {
  const currentYear = new Date().getFullYear();
  const date = new Date(currentYear, month, 0).getDate();
  //   console.log(date);
  //   console.log(data);
  if (data[0]?.calories) {
    const amount = calculateAmount.calculateCaloriesAmount(data);
    const result = Math.round(amount / date);
    // console.log(result);
    return result;
  }
  if (data[0]?.amount) {
    const amount = calculateAmount.calculateWaterAmount(data);
    const result = Math.round(amount / date);
    return result;
  }
  return 0;
};

export default calculateAverage;
