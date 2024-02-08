<script lang="ts">
  import { fetch_post } from '@tools/fetch';
  import AddRentData from './AddRentData.svelte';
  import Spinner from '@components/Spinner.svelte';
  import { z } from 'zod';

  let passUnlocked = false;
  let pass_input_spinner_show = false;
  let passKey = '';

  const check_pass = async () => {
    if (passKey === '') return;
    const req = fetch_post('/api/add/verify_pass', {
      json: {
        key: passKey
      }
    });
    pass_input_spinner_show = true;
    const resp = await req;
    pass_input_spinner_show = false;
    if (!resp.ok) {
      passKey = '';
      return;
    }
    const { verified } = z.object({ verified: z.boolean() }).parse(await resp.json());
    if (!verified) passKey = '';
    else {
      passUnlocked = true;
    }
  };
</script>

<svelte:head>
  <title>Add Rent Record</title>
</svelte:head>
{#if !passUnlocked}
  <form on:submit|preventDefault={check_pass} class="grid">
    <input type="password" bind:value={passKey} placeholder="गूढपद" required />
    <button type="submit">
      <Spinner show={pass_input_spinner_show} />
      Submit
    </button>
  </form>
{:else}
  <AddRentData {passKey} />
{/if}
