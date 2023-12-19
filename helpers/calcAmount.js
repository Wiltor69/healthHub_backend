const calculateCaloriesAmount = (data) => {
  return data.reduce((sum, el) => sum + el.calories, 0);
};

const calculateWaterAmount = (data) => {
  return data.reduce((sum, el) => sum + el.amount, 0);
};

const calculateFatAmount = (data) => {
  return data.reduce((sum, el) => sum + el.fat, 0);
};

const calculateProteinAmount = (data) => {
  return data.reduce((sum, el) => sum + el.protein, 0);
};

const calculateCarbonohidratesAmount = (data) => {
  return data.reduce((sum, el) => sum + el.carbonohidrates, 0);
};

export default {
  calculateCaloriesAmount,
  calculateWaterAmount,
  calculateFatAmount,
  calculateProteinAmount,
  calculateCarbonohidratesAmount,
};
