const calculateLeft = (amount, norma) => {
  let rest = norma - amount;
  if (rest < 0) {
    rest = 0;
  }
  return rest;
};

export default calculateLeft;
