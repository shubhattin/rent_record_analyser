<script lang="ts">
  import { fetch_post } from "@tools/fetch";
  import AddRentData from "./AddRentData.svelte";

  let passUnlocked = false;
  let passKey = "";

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
    } = await resp.json();
    if (!json.verified) passKey = "";
    else {
      passUnlocked = true;
    }
  };
</script>

<div class="container">
  {#if !passUnlocked}
    <form on:submit|preventDefault={check_pass} class="grid">
      <input
        type="password"
        bind:value={passKey}
        placeholder="गूढपद"
        required
      />
      <input type="submit" value="Submit" />
    </form>
  {:else}
    <AddRentData {passKey} />
  {/if}
</div>
