const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formattedDate = `${date.getDate()}, ${monthNames[date.getMonth()]}`;
  return formattedDate;
};

export default formatDate;
