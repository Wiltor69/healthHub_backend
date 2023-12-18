const calculateAmount = (data) => {
  return data.reduce((sum, el) => sum + el.calories, 0);
};

export default calculateAmount;
