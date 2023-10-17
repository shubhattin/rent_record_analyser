<script lang="ts">
  import { fetch_post } from "@tools/fetch";
  import AddRentData from "./AddRentData.svelte";

  let passUnlocked = false;
  let passKey = "";

  type lastDateIntoType = [string, number];
  let last_date_data: lastDateIntoType = null!;

  const check_pass = async () => {
    if (passKey === "") return;
    const req = fetch_post("/api/add/verify_pass", {
      json: {
        key: passKey,
      },
    });
    const resp = await req;
    if (!resp.ok) {
      passKey = "";
      return;
    }
    const json: {
      verified: boolean;
      last_date?: lastDateIntoType;
    } = await resp.json();
    if (!json.verified) passKey = "";
    else {
      passUnlocked = true;
      last_date_data = json.last_date!;
    }
  };
</script>

{#if !passUnlocked}
  <form on:submit|preventDefault={check_pass}>
    <input type="password" bind:value={passKey} placeholder="गूढपद" required />
    <input type="submit" value="Submit" />
  </form>
{:else}
  <AddRentData {passKey} {last_date_data} />
{/if}
