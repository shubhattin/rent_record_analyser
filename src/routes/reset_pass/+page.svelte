<script lang="ts">
  import Spinner from '~/components/Spinner.svelte';
  import type { PageData } from './$types';
  import { client, setJwtToken } from '~/api/client';
  import { get_val_with_key } from '~/tools/kry';
  import { cl_join } from '~/tools/cl_join';

  let { data }: { data: PageData } = $props();
  let users = $derived(data.users);

  let user = $state(1); // 1 user(admin);
  let old_password = $state('');
  let new_password = $state('');

  let old_password_elmnt = $state<HTMLInputElement>(null!);

  let wrong_pass_status = $state(false);
  $effect(() => {
    wrong_pass_status && setTimeout(() => (wrong_pass_status = false), 800);
  });

  const verify_pass = client.pass.verify_pass.mutation({
    onSuccess: (data) => {
      if (data.verified) {
        setJwtToken(data.jwt_token);
      } else {
        old_password_elmnt.focus();
        old_password = '';
        wrong_pass_status = true;
      }
    }
  });
  let is_old_pass_verified = $derived($verify_pass.isSuccess && $verify_pass.data.verified);

  const reset_pass = client.pass.reset_pass.mutation({
    onSuccess: (data) => {
      if (data.status !== 'success') new_password = '';
    }
  });

  const handle_sumbit_func = async (e: Event) => {
    e.preventDefault();
    if (!is_old_pass_verified) {
      if (old_password === '') return;
      $verify_pass.mutate({ password: old_password, user_id: user });
    } else {
      if (new_password === '') return;
      $reset_pass.mutate({ new_password });
    }
  };
</script>

<svelte:head>
  <title>Reset Password</title>
</svelte:head>
{#if !($reset_pass.isSuccess && $reset_pass.data.status === 'success')}
  <form onsubmit={handle_sumbit_func} class="mt-4 space-y-3">
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
        'input',
        wrong_pass_status && 'preset-tonal-error',
        is_old_pass_verified && 'preset-tonal-success'
      )}
      type="password"
      bind:value={old_password}
      bind:this={old_password_elmnt}
      placeholder="पुरागूढपद"
      required
      disabled={is_old_pass_verified}
    />
    {#if !is_old_pass_verified}
      <button
        type="submit"
        class="btn gap-0 rounded-lg px-0 py-1 pr-1.5 preset-filled-secondary-400-600"
      >
        <Spinner show={$verify_pass.isPending} />
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
      <button
        type="submit"
        class="btn gap-0 py-1 pl-0 pr-1.5 font-semibold preset-filled-primary-400-600"
      >
        <Spinner show={$reset_pass.isPending} />
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
