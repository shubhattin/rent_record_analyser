import type { APIRoute } from "astro";
import { JSONResponse } from "@tools/responses";
import { compare_dates, unNormaliseDate, normaliseDate } from "@tools/date";
import { base_get, base_put } from "@tools/deta";
import { puShTi } from "@tools/hash";

export const POST: APIRoute = async ({ request }) => {
  let {
    key,
    date,
    amount,
    month,
  }: { key: string; date: string; amount: number; month: string } =
    await request.json();

  // verifying for correct key
  const verified = puShTi(key, (await base_get("others", "passkey"))["value"]);
  if (!verified) return JSONResponse({ status: "wrong_key" });

  date = normaliseDate(date); // normalizing to store in database
  let data = { amount: amount, month: month, date: date };
  base_put("data", [data]);

  return JSONResponse({ status: "success" });
};
