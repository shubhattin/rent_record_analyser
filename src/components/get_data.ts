import { sort_dates } from "@tools/date";
import { base_fetch } from "@tools/deta";
import { z } from "zod";

export const dataSchema = z.object({
  key: z.string(),
  // format :- dd/mm/yyyy
  date: z.string().regex(/\d?\d\/\d?\d\/\d{4}/),
  // format :- mm-yyyy
  amount: z.number().int(),
  month: z.string().regex(/\d?\d-\d{4}/),
});
export type dtType = z.infer<typeof dataSchema>;

export const get_rent_record_data = async () => {
  const sort_data_based_on_date = (dates: dtType[], order: 1 | -1 = 1) => {
    const compareDates = (data1: dtType, data2: dtType): number => {
      const date1 = data1.date;
      const date2 = data2.date;
      const [day1, month1, year1] = date1.split("/").map(Number);
      const [day2, month2, year2] = date2.split("/").map(Number);

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
  const filter_items = (lst: any[]): dtType[] => {
    const filtered: dtType[] = [];
    for (let x of lst) {
      const parse = dataSchema.safeParse(x);
      if (parse.success) filtered.push(parse.data);
    }
    return filtered;
  };
  let lst: any[] = [];
  let last: string = null!;
  while (true) {
    const dt = await base_fetch("data", last);
    lst = lst.concat(filter_items(dt.items));
    last = dt.paging.last!;
    if (!last) break;
  }
  lst = sort_data_based_on_date(lst, -1) as dtType[];
  return lst;
};

/**
 * Return array in the form of `[year list, amount list]`
 */
export const get_year_list = (data: dtType[]): [number[], number[]] => {
  const years: number[] = [];
  const amounts: number[] = [];
  for (let dt of data) {
    // will be differemtiated using month and not date
    const yr = parseInt(dt.month.split("-")[1]);
    const amount = dt.amount;
    let index = years.indexOf(yr);
    if (index === -1) {
      index = years.length;
      years[index] = yr;
      amounts[index] = amount;
    } else amounts[index] += amount;
  }
  return sort_items(years, amounts) as [number[], number[]];
};
/**
 * Return array in the form of `[month list, amount list]`
 */
export const get_month_list = (
  year: number,
  data: dtType[]
): [number[], number[]] => {
  const months: number[] = [];
  const amounts: number[] = [];
  for (let dt of data) {
    const yr = parseInt(dt.month.split("-")[1]);
    if (yr !== year) continue;
    const mn = parseInt(dt.month.split("-")[0]);
    const amount = dt.amount;
    let index = months.indexOf(mn);
    if (index === -1) {
      index = months.length;
      months[index] = mn;
      amounts[index] = amount;
    } else amounts[index] += amount;
  }
  return sort_items(months, amounts) as [number[], number[]];
};
/**
 * Return array in the form of `[date list, amount list]`
 */
export const get_date_list = (
  year: number,
  month: number,
  data: dtType[]
): [number[], number[][], number[]] => {
  const dates: number[] = [];
  const amounts: number[][] = [] as any;
  const full_dates: string[] = [];

  for (let dt of data) {
    const yr = parseInt(dt.month.split("-")[1]);
    if (yr !== year) continue;
    const mn = parseInt(dt.month.split("-")[0]);
    if (mn !== month) continue;
    // only date to be determined by 'date'
    const date = parseInt(dt.date.split("/")[0]);
    // pushing date directly as  it will be unique for a particular year and a month
    const full_date_index = full_dates.indexOf(dt.date);
    if (full_date_index != -1) {
      // record of that date already there in array
      amounts[full_date_index].push(dt.amount);
      continue;
    }
    dates.push(date);
    amounts.push([dt.amount]);
    full_dates.push(dt.date);
  }

  const sorted_full_dates = sort_dates(full_dates, -1);
  // if (year === 2023 && month === 8) console.log(full_dates, sorted_full_dates);
  const sorted_dates = sorted_full_dates.map(
    (v) => dates[full_dates.indexOf(v)]
  );
  const sorted_amounts = sorted_full_dates.map(
    (v) => amounts[full_dates.indexOf(v)]
  );
  // actual months
  const sorted_months = sorted_full_dates.map((v) => parseInt(v.split("/")[1]));
  return [sorted_dates, sorted_amounts, sorted_months];
};

const sort_items = (num_lst: number[], data_lst: any[]) => {
  const srt_num_lst = [...num_lst]; //cloning
  srt_num_lst.sort((a, b) => b - a); // sorting in descending order
  const srt_data_lst = srt_num_lst.map((v) => data_lst[num_lst.indexOf(v)]);
  return [srt_num_lst, srt_data_lst];
};
