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

export const get_date_string = (date: Date, format: 'yyyy-mm-dd' | 'dd/mm/yyyy' = 'dd/mm/yyyy') => {
  const [dt, mn, yr] = [date.getDate(), date.getMonth() + 1, date.getFullYear()];
  if (format === 'yyyy-mm-dd') return `${yr}-${mn}-${dt}`;
  return `${dt}/${mn}/${yr}`;
};
