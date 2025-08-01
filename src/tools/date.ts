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

export const get_date_string = (date: Date, format: date_formats = 'dd/mm/yyyy', pad = false) => {
  const [dt, mn, yr] = [date.getUTCDate(), date.getUTCMonth() + 1, date.getUTCFullYear()];
  if (format === 'yyyy-mm-dd') {
    const month = pad ? mn.toString().padStart(2, '0') : mn;
    const dt1 = pad ? dt.toString().padStart(2, '0') : dt;
    return `${yr}-${month}-${dt1}`;
  }
  const month = pad ? mn.toString().padStart(2, '0') : mn;
  const dt1 = pad ? dt.toString().padStart(2, '0') : dt;
  return `${dt1}/${month}/${yr}`;
};

const get_date_format = (date: string): date_formats | undefined => {
  if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(date)) return 'dd/mm/yyyy';
  else if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(date)) return 'yyyy-mm-dd';
};

const prefix_zeros = (n: number) => `${n < 10 ? '0' : ''}${n}`;

export const get_utc_date_string = (val: string) => {
  let date: number = 0,
    month: number = 0,
    year: number = 0;
  const format = get_date_format(val)!;
  if (format === 'dd/mm/yyyy') [date, month, year] = val.split('/').map((v) => parseInt(v));
  else if (format === 'yyyy-mm-dd') [year, month, date] = val.split('-').map((v) => parseInt(v));
  return `${year}-${prefix_zeros(month)}-${prefix_zeros(date)}T00:00Z`;
};

export const get_utc_date = (val: string) => {
  return new Date(get_utc_date_string(val));
};

export const clone_date = (date: Date) => {
  return new Date(date.toISOString());
};

/**
 * Set `sort_key` to `null` if you have `Date[]`
 */
export const sort_date_helper = (dt1: any, dt2: any, sort_key: string | null, order: -1 | 1) => {
  let [date1, date2] = !sort_key ? [dt1, dt2] : [dt1[sort_key], dt2[sort_key]];
  const [day1, month1, year1] = [
    date1.getUTCDate(),
    date1.getUTCMonth() + 1,
    date1.getUTCFullYear()
  ];
  const [day2, month2, year2] = [
    date2.getUTCDate(),
    date2.getUTCMonth() + 1,
    date2.getUTCFullYear()
  ];
  if (year1 !== year2) return (year1 - year2) * order;
  if (month1 !== month2) return (month1 - month2) * order;
  return (day1 - day2) * order;
};

export const convert_to_dd_mm_yyyy = (val: string, pad = false) => {
  const [yr, mn, dt] = val.split('-').map((v) => parseInt(v));
  const month = pad ? mn.toString().padStart(2, '0') : mn;
  const dt1 = pad ? dt.toString().padStart(2, '0') : dt;
  return `${dt1}/${month}/${yr}`;
};

export const convert_to_yyyy_mm_dd = (val: string, pad = true) => {
  const [dt, mn, yr] = val.split('/').map((v) => parseInt(v));
  const month = pad ? mn.toString().padStart(2, '0') : mn;
  const dt1 = pad ? dt.toString().padStart(2, '0') : dt;
  return `${yr}-${month}-${dt1}`;
};

export const pad_month_string = (val: string) => {
  const [yr, mn] = val.split('-');
  const month = mn.toString().padStart(2, '0');
  return `${yr}-${month}`;
};
