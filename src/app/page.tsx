import type { Metadata } from "next";
import { base_fetch } from "@/tools/deta";
import { type dtType } from "./get_data";
import RentRecord from "./RentRecord";

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
  return <RentRecord data={data} />;
}
