<script lang="ts">
  import Spinner from '@components/Spinner.svelte';
  import type { PageData } from './$types';
  import { client_raw, setJwtToken } from '@api/client';
  import { get_val_with_key } from '@tools/kry';
  import MainAppBar from '@components/MainAppBar.svelte';
  import { delay } from '@tools/delay';
  import { cl_join } from '@tools/cl_join';

  export let data: PageData;
  let users = data.users;
  $: users = data.users;

  let user: number = 1; // 1 user(admin);
  let old_password: string;
  let new_password: string;

  let is_old_pass_verified = false;
  let wrong_pass_status = false;
  $: wrong_pass_status && setTimeout(() => (wrong_pass_status = false), 800);
  let pass_reset_status = false;
  let submit_spinner_show_status = false;

  const handle_sumbit = async () => {
    if (!is_old_pass_verified) {
      if (old_password === '') return;
      submit_spinner_show_status = true;
      const resp = await client_raw.pass.verify_pass.query({
        password: old_password,
        user_id: user
      });
      await delay(500);
      submit_spinner_show_status = false;
      if (!resp.verified) {
        old_password = '';
        wrong_pass_status = true;
      } else {
        setJwtToken(resp.jwt_token);
        is_old_pass_verified = true;
      }
    } else {
      if (new_password === '') return;
      submit_spinner_show_status = true;
      const { status } = await client_raw.pass.reset_pass.mutate({
        new_password
      });
      await delay(500);
      submit_spinner_show_status = false;
      if (status !== 'success') new_password = '';
      else pass_reset_status = true;
    }
  };
</script>

<svelte:head>
  <title>Reset Password</title>
</svelte:head>
<MainAppBar page_name="reset_pass">
  <span slot="start" class="text-lg font-bold text-cyan-800 dark:text-indigo-400">
    Reset Password
  </span>
</MainAppBar>
{#if !pass_reset_status}
  <form on:submit|preventDefault={handle_sumbit} class="space-y-3">
    <select class="select" bind:value={user} disabled={is_old_pass_verified}>
      {#each users as user}
        <option value={user.id}>
          {user.id}
          →
          {user.name}
        </option>
      {/each}
    </select>
    <input
      class={cl_join(
        'input variant-form-material',
        wrong_pass_status && 'input-error',
        is_old_pass_verified && 'input-success'
      )}
      type="password"
      bind:value={old_password}
      placeholder="पुरागूढपद"
      required
      disabled={is_old_pass_verified}
    />
    {#if !is_old_pass_verified}
      <button type="submit" class="variant-filled-tertiary btn rounded-lg py-1 pl-0 pr-1.5">
        <Spinner show={submit_spinner_show_status} />
        Verify Old Password
      </button>
    {:else}
      <input
        class={cl_join('input rounded-lg')}
        type="password"
        bind:value={new_password}
        placeholder="नवगूढपद"
        required
      />
      <button type="submit" class="variant-filled-secondary btn py-1 pl-0 pr-1.5 font-semibold">
        <Spinner show={submit_spinner_show_status} />
        Set New Password
      </button>
    {/if}
  </form>
{:else}
  {@const user_info = get_val_with_key('id', user, users)}
  <div class="my-4 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
    Password Successfully Changed for User
    <span class="text-teal-500 dark:text-teal-300">
      {user_info?.id} → {user_info?.name}
    </span>
  </div>
{/if}
