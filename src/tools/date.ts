export const MONTH_NAMES_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const NUMBER_SUFFIX = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];

/**
 * Normalize Dates :- `2023-09-08` -> `8/9/2023`
 */
export const normaliseDate = (date: string) => {
  // This Normalization is useful while comparing dates
  // dd/mm/yyyy
  const lst = date.split('-').map((v) => parseInt(v));
  lst.reverse();
  return lst.join('/');
  // yyyy-mm-dd
};

/**
 * Normalize Dates :- `8/9/2023` -> `2023-9-8`
 */
export const unNormaliseDate = (date: string) => {
  // dd/mm/yyyy
  const lst = date.split('/').map((v) => parseInt(v));
  lst.reverse();
  return lst.join('-');
  // yyyy-mm-dd
};

/**
 * Evaluates `a > b` .Both dates should be in `yyyy-mm-dd` format
 */
export const compare_dates = (a: string, b: string) => new Date(a) > new Date(b);

export const sort_dates = (dates: string[], order: 1 | -1 = 1) => {
  const compareDates = (date1: string, date2: string): number => {
    const [day1, month1, year1] = date1.split('/').map(Number);
    const [day2, month2, year2] = date2.split('/').map(Number);

    // Compare years first
    if (year1 !== year2) {
      return (year1 - year2) * order;
    }

    // If years are the same, compare months
    if (month1 !== month2) {
      return (month1 - month2) * order;
    }

    // If months are the same, compare days
    return (day1 - day2) * order;
  };

  // Sort the dates using the custom comparator
  return dates.slice().sort(compareDates);
};
