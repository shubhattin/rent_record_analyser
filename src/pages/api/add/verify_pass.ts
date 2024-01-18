import type { APIRoute } from "astro";
import { puShTi } from "@tools/hash";
import { base_get } from "@tools/deta";
import { JSONResponse } from "@tools/responses";

export const POST: APIRoute = async ({ request }) => {
  const body: { key: string } = await request.json();
  const { key } = body;
  const hash = (await base_get("others", "passkey"))["value"];
  const verified = puShTi(key, hash);
  const data: {
    verified: boolean;
  } = { verified: verified };
  return JSONResponse(data);
};
