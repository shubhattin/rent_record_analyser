import type { APIRoute } from "astro";
import { JSONResponse } from "@tools/responses";
import { normaliseDate } from "@tools/date";
import { base_get, base_put } from "@tools/deta";
import { puShTi } from "@tools/hash";
import { z } from "zod";
import { dataSchema } from "@components/get_data";

const requestSchema = dataSchema.merge(
  z.object({
    key: z.string().min(4),
  })
);
export const POST: APIRoute = async ({ request }) => {
  const req_parse = requestSchema.safeParse(await request.json());
  if (!req_parse.success)
    return JSONResponse({ status: "error_parsing_request" });
  let { key, date, amount, month } = req_parse.data;

  // verifying for correct key
  const verified = puShTi(key, (await base_get("others", "passkey"))["value"]);
  if (!verified) return JSONResponse({ status: "wrong_key" });

  date = normaliseDate(date); // normalizing to store in database
  let data = { amount: amount, month: month, date: date };
  base_put("data", [data]);

  return JSONResponse({ status: "success" });
};
