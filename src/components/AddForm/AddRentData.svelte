<script lang="ts">
  import { normaliseDate } from "@tools/date";
  import { fetch_post } from "@tools/fetch";

  type lastDateIntoType = [string, number];
  export let passKey: string;

  let date = "";
  let amount: number;
  let errorStatus = false;
  let submitted = false;

  const sumbit_data = async () => {
    if (!date || date === "" || !amount || amount === 0) return;
    const req = fetch_post("/api/add/submit", {
      json: {
        key: passKey,
        date: date, // sending date without normalization in form yyyy-mm-dd
        amount: amount,
      },
    });
    const res = await req;
    if (!res.ok) return;
    const { status }: { status: string } = await res.json();
    if (status === "success") {
      submitted = true;
    }
  };
</script>

<section>
  <h4>Add New Entry</h4>
  {#if !errorStatus && !submitted}
    <form on:submit|preventDefault={sumbit_data}>
      <input type="date" required bind:value={date} />
      <input type="number" required bind:value={amount} />
      <input type="submit" value="Sumbit" />
    </form>
  {:else if errorStatus}
    <input
      type="text"
      readonly
      aria-invalid="true"
      value="Cannot Add Record before the Last Date"
    />
  {:else if submitted}
    <a href="/">Home Page</a>
    <div>
      <strong>
        Successfully Added Record of ₹ {amount} dated{" "}
        {normaliseDate(date)}.
      </strong>
    </div>
  {/if}
</section>
