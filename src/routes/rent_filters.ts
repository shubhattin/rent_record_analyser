type rent_data_type = {
  month: Date;
  date: Date;
  amount: number;
  rent_type: 'rent' | 'electricity';
  is_not_verified: number | null;
}[];

export const get_year_list = (rent_data: rent_data_type) => {
  const years: number[] = [];
  const amounts: number[] = [];
  for (let dt of rent_data) {
    const yr = dt.month.getUTCFullYear();
    const index = years.indexOf(yr);
    const factor = dt.rent_type === 'rent' ? 1 : -1;
    if (index === -1) {
      years.push(yr);
      amounts.push(dt.amount * factor);
    } else amounts[index] += dt.amount * factor;
  }
  return [years, amounts];
};

export const get_month_list = (rent_data: rent_data_type, year: number) => {
  const months: number[] = [];
  const amounts: number[] = [];
  for (let dt of rent_data) {
    if (year !== dt.month.getUTCFullYear()) continue;
    const month = dt.month.getUTCMonth() + 1;
    const index = months.indexOf(month);
    const factor = dt.rent_type === 'rent' ? 1 : -1;
    if (index === -1) {
      months.push(month);
      amounts.push(dt.amount * factor);
    } else amounts[index] += dt.amount * factor;
  }
  return [months, amounts];
};

export const get_date_list = (rent_data: rent_data_type, year: number, month: number) => {
  const date_records: rent_data_type[] = [];
  for (let dt of rent_data) {
    if (year !== dt.month.getUTCFullYear()) continue;
    if (month !== dt.month.getUTCMonth() + 1) continue;

    const index = (() => {
      const date = dt.date.toLocaleDateString();
      for (let i = 0; i < date_records.length; i++)
        if (date_records[i][0].date.toLocaleDateString() === date) return i;
      return -1;
    })();
    if (index === -1) {
      date_records.push([dt]);
    } else {
      date_records[index].push(dt);
    }
  }
  return date_records;
};

export const get_total_sum_for_type = (
  date_records: rent_data_type[],
  type: 'rent' | 'electricity'
) => {
  return date_records
    .map((dts) =>
      dts.filter((dt) => dt.rent_type === type).reduce((total, amnt) => total + amnt.amount, 0)
    )
    .reduce((total, amount) => total + amount, 0);
};
