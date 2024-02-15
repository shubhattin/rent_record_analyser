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
type date_formats = 'yyyy-mm-dd' | 'dd/mm/yyyy';

export const get_date_string = (date: Date, format: date_formats = 'dd/mm/yyyy') => {
  const [dt, mn, yr] = [date.getUTCDate(), date.getUTCMonth() + 1, date.getUTCFullYear()];
  if (format === 'yyyy-mm-dd') return `${yr}-${mn}-${dt}`;
  return `${dt}/${mn}/${yr}`;
};

const prefix_zeros = (n: number) => `${n < 10 ? '0' : ''}${n}`;

export const get_utc_date_string = (val: string, format: date_formats) => {
  let date: number = 0,
    month: number = 0,
    year: number = 0;
  if (format === 'dd/mm/yyyy') [date, month, year] = val.split('/').map((v) => parseInt(v));
  else if (format === 'yyyy-mm-dd') [year, month, date] = val.split('-').map((v) => parseInt(v));
  return `${year}-${prefix_zeros(month)}-${prefix_zeros(date)}T00:00Z`;
};

export const get_utc_date = (val: string, format: date_formats) => {
  return new Date(get_utc_date_string(val, format));
};

export const clone_date = (date: Date) => {
  return new Date(date.toISOString());
};
