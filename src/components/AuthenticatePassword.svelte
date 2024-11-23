<script lang="ts">
  import { client, setJwtToken } from '@api/client';
  import Spinner from './Spinner.svelte';
  import { cl_join } from '@tools/cl_join';
  import { Combobox } from '@skeletonlabs/skeleton-svelte';

  let {
    show_always = false,
    is_verified = $bindable(),
    pass_input_element = $bindable(),
    on_verify,
    users_data
  }: {
    show_always?: boolean;
    is_verified: boolean;
    on_verify?: (verified: boolean, jwt_token: string) => void;
    pass_input_element?: HTMLInputElement;
    users_data: {
      id: number;
      name: string;
    }[];
  } = $props();

  let user_id = $state(1); // 1st user(admin)
  let password = $state('');

  const pass_verify = client.pass.verify_pass.mutation({
    onSuccess(data) {
      if (!data.verified) {
        password = '';
        pass_input_element && pass_input_element.focus();
        wrong_pass_status = true;
      } else {
        is_verified = true;
        setJwtToken(data.jwt_token);
        if (on_verify) on_verify(is_verified, data.jwt_token);
      }
    }
  });

  let wrong_pass_status = $state(false);
  $effect(() => {
    wrong_pass_status && setTimeout(() => (wrong_pass_status = false), 1000);
  });

  const check_pass_func = async () => {
    if (password === '') return;
    $pass_verify.mutate({ user_id, password });
  };
</script>

{#if show_always || !is_verified}
  <div class="font-bold text-orange-600 dark:text-yellow-500">Authentication</div>
  <form onsubmit={check_pass_func} class="mt-2 space-y-2.5">
    <select bind:value={user_id} class="select select-none rounded-xl font-bold">
      {#each users_data as user}
        <option value={user.id} class="font-semibold">
          {user.id}
          →
          {user.name}
        </option>
      {/each}
    </select>
    <input
      class={cl_join('input', wrong_pass_status && 'input-error')}
      type="password"
      bind:value={password}
      placeholder="गूढपद"
      required
      bind:this={pass_input_element}
    />
    <button
      type="submit"
      class="btn rounded-lg py-0 pl-0 font-semibold preset-filled-primary-300-700"
    >
      <Spinner show={$pass_verify.isPending} />
      Submit
    </button>
    <div>
      <a
        class="btn rounded-lg px-1.5 py-0 text-sm preset-filled-surface-200-800"
        href="/reset_pass"
      >
        Reset Password
      </a>
    </div>
  </form>
{/if}
