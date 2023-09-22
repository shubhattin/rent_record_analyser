import { Base } from "@/tools/deta";

export default async function Home() {
  return (
    <>
      <div>
        Last Date 1 :-{" "}
        {(await Base("others").get("last_date"))!["value"] as string}
      </div>
    </>
  );
}
