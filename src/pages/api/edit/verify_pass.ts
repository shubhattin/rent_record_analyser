import type { APIRoute } from "astro";
import { puShTi } from "@tools/hash";
import { base_get } from "@tools/deta";
import { JSONResponse } from "@tools/responses";
import { z } from "zod";

export const POST: APIRoute = async ({ request }) => {
  const body_parse = z
    .object({ key: z.string().min(4) })
    .safeParse(await request.json());
  if (!body_parse.success)
    return JSONResponse({ verified: false, detail: "error_parsing_request" });
  const { key } = body_parse.data;

  const hash = (await base_get("others", "passkey"))["value"];
  const verified = puShTi(key, hash);
  const data: {
    verified: boolean;
  } = { verified: verified };
  return JSONResponse(data);
};
