<script lang="ts">
  import { client, setJwtToken } from '@api/client';
  import { writable, type Writable } from 'svelte/store';
  import Spinner from './Spinner.svelte';
  import { cl_join } from '@tools/cl_join';

  export let on_verify: (verified: boolean, jwt_token: string) => void = null!;
  export let is_verified: Writable<boolean>;
  export let pass_input_element: Writable<HTMLInputElement> = writable(null!);

  export let users_data: {
    id: number;
    name: string;
  }[];

  let user_id: number = 1; // 1st user(admin)
  let password: string = '';

  const pass_verify = client.pass.verify_pass.mutation({
    onSuccess(data) {
      if (!data.verified) {
        password = '';
        wrong_pass_status = true;
      } else {
        $is_verified = true;
        setJwtToken(data.jwt_token);
        if (on_verify) on_verify($is_verified, data.jwt_token);
      }
    }
  });

  let wrong_pass_status = false;
  $: wrong_pass_status && setTimeout(() => (wrong_pass_status = false), 1000);

  const check_pass_func = async () => {
    if (password === '') return;
    $pass_verify.mutate({ user_id, password });
  };
</script>

{#if !$is_verified}
  <div class="font-bold text-orange-600 dark:text-yellow-500">Authentication</div>
  <form on:submit|preventDefault={check_pass_func} class="mt-2 space-y-2.5">
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
      class={cl_join('input variant-form-material', wrong_pass_status && 'input-error')}
      type="password"
      bind:value={password}
      placeholder="गूढपद"
      required
      bind:this={$pass_input_element}
    />
    <button
      type="submit"
      class="variant-filled-secondary btn rounded-lg py-1 pl-0 pr-4 font-semibold"
    >
      <Spinner show={$pass_verify.isPending} />
      Submit
    </button>
    <div>
      <a class="py- variant-filled-tertiary btn rounded-lg px-1.5 py-0 text-sm" href="/reset_pass">
        Reset Password
      </a>
    </div>
  </form>
{/if}
