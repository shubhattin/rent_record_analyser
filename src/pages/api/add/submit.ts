import type { APIRoute } from "astro";
import { JSONResponse } from "@tools/responses";
import { compare_dates, unNormaliseDate, normaliseDate } from "@tools/date";
import { base_get, base_put } from "@tools/deta";
import { puShTi } from "@tools/hash";

export const POST: APIRoute = async ({ request }) => {
  let { key, date, amount }: { key: string; date: string; amount: number } =
    await request.json();

  // verifying for correct key
  const verified = puShTi(key, (await base_get("others", "passkey"))["value"]);
  if (!verified) return JSONResponse({ status: "wrong_key" });

  date = normaliseDate(date); // normalizing to store in database
  let date_data_ref = await base_get("rent_data", date);
  let data;
  if ("amount" in date_data_ref) {
    // if date already exists
    data = date_data_ref;
    data.amount.push(amount);
  } else {
    data = { key: date, amount: [amount] };
  }
  base_put("rent_data", [data]);

  return JSONResponse({ status: "success" });
};
