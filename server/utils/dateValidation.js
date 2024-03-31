const { compareAsc } = require('date-fns');

// ** This function is for checking if the input-date is in the past
exports.dateCheckFunc = (yyyy, mm, dd) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const currentDay = date.getDate();

  const compare = compareAsc(
    new Date(yyyy, mm, dd),
    new Date(currentYear, currentMonth, currentDay)
  );

  // return compare > -1;
  return compare;
};
