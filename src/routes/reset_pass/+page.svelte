<script lang="ts">
  import Spinner from '@components/Spinner.svelte';
  import type { PageData } from './$types';
  import { client, setJwtToken } from '@api/client';
  import { get_with_key } from '@tools/kry';

  export let data: PageData;
  let users = data.users;
  $: users = data.users;

  let user: number;
  let old_password: string;
  let new_password: string;

  let is_old_pass_verified = false;
  let pass_reset_status = false;
  let submit_spinner_show_status = false;

  const handle_sumbit = async () => {
    if (!is_old_pass_verified) {
      if (old_password === '') return;
      submit_spinner_show_status = true;
      const resp = await client.verify_pass.query({
        password: old_password,
        user_id: user
      });
      submit_spinner_show_status = false;
      if (!resp.verified) old_password = '';
      else {
        setJwtToken(resp.jwt_token);
        is_old_pass_verified = true;
      }
    } else {
      if (new_password === '') return;
      submit_spinner_show_status = true;
      const { status } = await client.reset_pass.mutate({
        new_password
      });
      submit_spinner_show_status = false;
      if (status !== 'success') new_password = '';
      else pass_reset_status = true;
    }
  };
</script>

<svelte:head>
  <title>Reset Password</title>
</svelte:head>
{#if !pass_reset_status}
  <form on:submit|preventDefault={handle_sumbit}>
    <select bind:value={user} disabled={is_old_pass_verified}>
      {#each users as user}
        <option value={user.id}>
          {user.id}
          →
          {user.name}
        </option>
      {/each}
    </select>
    <input
      type="password"
      bind:value={old_password}
      placeholder="पुरागूढपद"
      required
      disabled={is_old_pass_verified}
    />
    {#if !is_old_pass_verified}
      <button type="submit">
        <Spinner show={submit_spinner_show_status} />
        Verify Old Password
      </button>
    {:else}
      <input type="password" bind:value={new_password} placeholder="नवगूढपद" required />
      <button type="submit">
        <Spinner show={submit_spinner_show_status} />
        Set New Password
      </button>
    {/if}
  </form>
{:else}
  {@const user_info = get_with_key(users, 'id', user)}
  Password Successfully Changed for User {user_info?.id} → {user_info?.name}
{/if}
