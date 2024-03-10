<script lang="ts">
  import { client } from '@api/client';
  import { type Writable } from 'svelte/store';
  import Spinner from './Spinner.svelte';

  export let user_id: Writable<number>;
  export let password: Writable<string>;
  export let is_verified: Writable<boolean>;
  export let users_data: {
    id: number;
    name: string;
  }[];

  let pass_input_spinner_show = false;

  const check_pass = async () => {
    if ($password === '') return;
    pass_input_spinner_show = true;
    const { verified } = await client.verify_pass.query({
      user_id: $user_id,
      password: $password
    });
    pass_input_spinner_show = false;
    if (!verified) $password = '';
    else $is_verified = true;
  };
</script>

{#if !$is_verified}
  <form on:submit|preventDefault={check_pass} class="grid">
    <select bind:value={$user_id}>
      {#each users_data as user}
        <option value={user.id}>
          {user.id}
          →
          {user.name}
        </option>
      {/each}
    </select>
    <input type="password" bind:value={$password} placeholder="गूढपद" required />
    <button type="submit">
      <Spinner show={pass_input_spinner_show} />
      Submit
    </button>
  </form>
{/if}
