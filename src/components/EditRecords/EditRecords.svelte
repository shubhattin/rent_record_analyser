<script lang="ts">
  import type { dtType } from "@components/get_data";
  import Edit from "./Edit.svelte";
  import { fetch_post } from "@tools/fetch";
  import { z } from "zod";

  export let data: dtType[];

  let ediatble = true;
  let pass_verify_show_status = false;
  let passKey = "";

  const check_pass = async () => {
    if (passKey === "") return;
    const req = fetch_post("/api/edit/verify_pass", {
      json: {
        key: passKey,
      },
    });
    const resp = await req;
    if (!resp.ok) {
      passKey = "";
      return;
    }
    const { verified } = z
      .object({ verified: z.boolean() })
      .parse(await resp.json());
    if (!verified) passKey = "";
    else {
      ediatble = true;
    }
  };
</script>

{#if !ediatble}
  {#if pass_verify_show_status}
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
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="edit_btn" on:click={() => (pass_verify_show_status = true)}>
      ✏️
    </div>
  {/if}
{/if}
<Edit {data} {ediatble} {passKey} />

<style>
  .edit_btn {
    font-size: 1.25rem;
  }
</style>
