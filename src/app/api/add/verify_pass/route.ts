import { NextResponse } from "next/server";
import { puShTi } from "@/tools/hash";
import { base_get } from "@/tools/deta";

export async function POST(req: Request) {
  const body: { key: string } = await req.json();
  const { key } = body;
  const hash = (await base_get("others", "passkey"))["value"];
  const verified = puShTi(key, hash);
  const data: {
    verified: boolean;
    last_date?: [string, number];
  } = { verified: verified };
  if (verified) {
    const last_date = (await base_get("others", "last_date"))["value"];
    const amount = (
      (await base_get("rent_data", last_date))["amount"] as number[]
    ).reduce((a, b) => a + b);
    data.last_date = [last_date, amount];
  }
  return NextResponse.json(data);
}
