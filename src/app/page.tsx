import type { Metadata } from "next";
import { base_fetch } from "@/tools/deta";
import {
  get_year_list,
  type dtType,
  get_month_list,
  MONTH_NAMES,
  get_date_list,
  NUMBER_SUFFIX,
  MONTH_NAMES_SHORT,
} from "./get_data";

export const metadata: Metadata = {
  title: "Rent Record Analyser",
  description: "A Simple House Rent Record Analyser",
};

const getRawData = async () => {
  let lst: any[] = [];
  let last: string = null!;
  while (true) {
    const dt = await base_fetch("rent_data", last);
    lst = lst.concat(dt.items);
    last = dt.paging.last!;
    if (!last) break;
  }
  return lst as dtType[];
};

export default async function Home() {
  const data = await getRawData();
  const [year_list, amount_list] = get_year_list(data);

  return year_list.map((yr, i) => (
    <>
      <h5 style={{ marginBottom: "10px" }}>
        Year {yr}, Total <sup>₹</sup>
        {amount_list[i]}
      </h5>
      <Monthy year={yr} data={data} />
    </>
  ));
}

const Monthy = ({ year, data }: { year: number; data: dtType[] }) => {
  const [month_list, amount_list] = get_month_list(year, data);
  return month_list.map((mn, i) => (
    <div style={{ marginBottom: "5px" }}>
      <div style={{ fontWeight: "bold" }}>
        {MONTH_NAMES[mn - 1]}, Total = <sup>₹</sup>
        {amount_list[i]}
      </div>
      <DateWise data={data} month={mn} year={year} />
    </div>
  ));
};

const DateWise = ({
  year,
  month,
  data,
}: {
  year: number;
  month: number;
  data: dtType[];
}) => {
  const [date_list, amount_list] = get_date_list(year, month, data);
  return date_list.map((date, i) => (
    <div>
      {date}
      <sup>{date % 10 === 0 ? "th" : NUMBER_SUFFIX[(date % 10) - 1]}</sup>{" "}
      {MONTH_NAMES_SHORT[month - 1]} :-{" "}
      {amount_list[i].map((v) => `₹ ${v}`).join(", ")}
    </div>
  ));
};
