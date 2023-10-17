export interface dtType {
    key: string;
    amount: number[];
  }
  
  export const MONTH_NAMES_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  export const MONTH_NAMES = [
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
  
  export const NUMBER_SUFFIX = [
    "st",
    "nd",
    "rd",
    "th",
    "th",
    "th",
    "th",
    "th",
    "th",
  ];
  
  /**
   * Return array in the form of `[year list, amount list]`
   */
  export const get_year_list = (data: dtType[]): [number[], number[]] => {
    const years: number[] = [];
    const amounts: number[] = [];
    for (let dt of data) {
      const yr = parseInt(dt.key.split("/")[2]);
      const amount = dt.amount.reduce((a, b) => a + b);
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
      const yr = parseInt(dt.key.split("/")[2]);
      if (yr !== year) continue;
      const mn = parseInt(dt.key.split("/")[1]);
      const amount = dt.amount.reduce((a, b) => a + b);
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
  ): [number[], number[][]] => {
    const dates: number[] = [];
    const amounts: number[][] = [];
    for (let dt of data) {
      const yr = parseInt(dt.key.split("/")[2]);
      if (yr !== year) continue;
      const mn = parseInt(dt.key.split("/")[1]);
      if (mn !== month) continue;
      const date = parseInt(dt.key.split("/")[0]);
      const amount = dt.amount;
      // pushing date directly as  it will be unique for a particular year and a month
      dates.push(date);
      amounts.push(amount);
    }
    return sort_items(dates, amounts) as [number[], number[][]];
  };
  
  const sort_items = (num_lst: number[], data_lst: any[]) => {
    const srt_num_lst = [...num_lst]; //cloning
    srt_num_lst.sort((a, b) => b - a); // sorting in descending order
    const srt_data_lst = srt_num_lst.map((v) => data_lst[num_lst.indexOf(v)]);
    return [srt_num_lst, srt_data_lst];
  };
  