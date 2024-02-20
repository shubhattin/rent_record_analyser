<script lang="ts">
  import AddRentData from './AddRentData.svelte';
  import Spinner from '@components/Spinner.svelte';
  import { client } from '@api/client';

  let passUnlocked = false;
  let pass_input_spinner_show = false;
  let passKey = '';

  const check_pass = async () => {
    if (passKey === '') return;
    pass_input_spinner_show = true;
    const { verified } = await client.add_data.verify_pass.query({ password: passKey });
    pass_input_spinner_show = false;
    if (!verified) passKey = '';
    else passUnlocked = true;
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
