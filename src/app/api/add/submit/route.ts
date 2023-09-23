import { NextResponse } from "next/server";
import { compare_dates, unNormaliseDate, normaliseDate } from "@/tools/date";
import { base_get, base_put } from "@/tools/deta";
import { puShTi } from "@/tools/hash";

export async function POST(req: Request) {
  let { key, date, amount }: { key: string; date: string; amount: number } =
    await req.json();

  // verifying for correct key
  if (!puShTi(key, (await base_get("others", "passkey"))["value"]))
    return NextResponse.json({ status: "wrong_key" });

  const last_date: string = (await base_get("others", "last_date"))["value"]; // noemalised date

  if (compare_dates(unNormaliseDate(last_date), date))
    return NextResponse.json({ status: "date_smaller" });

  date = normaliseDate(date); // normalizing to store in database
  let data = { key: date, amount: [amount] };
  if (last_date === date) {
    // if already exists
    data = await base_get("rent_data", date);
    data.amount.push(amount);
  }
  base_put("rent_data", [data]);
  base_put("others", [{ key: "last_date", value: date }]);

  return NextResponse.json({ status: "success" });
}
