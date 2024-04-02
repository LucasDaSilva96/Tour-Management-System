const { compareAsc } = require('date-fns');

// ** This function is for checking if the input-date is in the past
exports.dateCheckFunc = (yyyy_mm_dd) => {
  // EX: 2024-04-24
  const date = new Date();
  const currentYear = date.getFullYear();

  const currentMonth = date.getMonth();
  const currentDay = date.getDate();
  const [yyyy, mm, dd] = yyyy_mm_dd.toISOString().split('T')[0].split('-');

  const compare = compareAsc(
    new Date(yyyy, mm, dd),
    new Date(currentYear, currentMonth, currentDay)
  );

  // return compare > -1;
  return compare;
};
