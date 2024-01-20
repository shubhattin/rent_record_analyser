import type { APIRoute } from "astro";
import { base_get } from "@tools/deta";

export const GET: APIRoute = async ({ params, redirect }) => {
  // redirect to the database page for manual editing
  return redirect((await base_get("others", "db_page"))["value"]);
};
