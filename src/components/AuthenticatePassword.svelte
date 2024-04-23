<script lang="ts">
  import { client, setJwtToken } from '@api/client';
  import { writable, type Writable } from 'svelte/store';
  import Spinner from './Spinner.svelte';

  export let on_verify: (verified: boolean, jwt_token: string) => void = null!;
  export let is_verified: Writable<boolean>;
  export let show_always = false;
  export let pass_input_element: Writable<HTMLInputElement> = writable(null!);

  export let users_data: {
    id: number;
    name: string;
  }[];

  let user_id: number = 1; // 1st user(admin)
  let password: string;
  let pass_input_spinner_show = false;

  const check_pass = async () => {
    if (password === '') return;
    pass_input_spinner_show = true;
    const res = await client.pass.verify_pass.query({
      user_id: user_id,
      password: password
    });
    pass_input_spinner_show = false;
    if (!res.verified) password = '';
    else {
      $is_verified = true;
      setJwtToken(res.jwt_token);
      if (on_verify) on_verify($is_verified, res.jwt_token);
    }
  };
</script>

{#if show_always || !$is_verified}
  <form on:submit|preventDefault={check_pass}>
    <select bind:value={user_id}>
      {#each users_data as user}
        <option value={user.id}>
          {user.id}
          →
          {user.name}
        </option>
      {/each}
    </select>
    <input
      type="password"
      bind:value={password}
      placeholder="गूढपद"
      required
      bind:this={$pass_input_element}
    />
    <button type="submit">
      <Spinner show={pass_input_spinner_show} />
      Submit
    </button>
    <div>
      <a href="/reset_pass">
        <small>
          <small>Reset Password</small>
        </small>
      </a>
    </div>
  </form>
{/if}
