<script lang="ts">
  import { client_q } from '~/api/client';
  import Spinner from './Spinner.svelte';
  import { cl_join } from '~/tools/cl_join';
  import { get_id_token_info, storeAuthInfo } from '~/tools/auth_tools';
  import { user_info } from '~/state/user.svelte';

  let {
    pass_input_element = $bindable(),
    users_data
  }: {
    on_verify?: (verified: boolean, jwt_token: string) => void;
    pass_input_element?: HTMLInputElement;
    users_data: {
      id: number;
      name: string;
    }[];
  } = $props();

  let user_id = $state(1); // 1st user(admin)
  let password = $state('');

  const pass_verify = client_q.auth.verify_pass.mutation({
    onSuccess(data) {
      if (!data.verified) {
        password = '';
        pass_input_element && pass_input_element.focus();
        wrong_pass_status = true;
      } else {
        storeAuthInfo(data);
        $user_info = get_id_token_info().user;
      }
    }
  });

  let wrong_pass_status = $state(false);
  $effect(() => {
    wrong_pass_status && setTimeout(() => (wrong_pass_status = false), 1000);
  });

  const check_pass_func = async (e: Event) => {
    e.preventDefault();
    if (password === '') return;
    $pass_verify.mutate({ id: user_id, password });
  };
</script>

<div class="font-bold text-orange-600 dark:text-yellow-500">Authentication</div>
<form onsubmit={check_pass_func} class="mt-2 space-y-2.5">
  <select bind:value={user_id} class="select rounded-xl font-bold select-none">
    {#each users_data as user}
      <option value={user.id} class="font-semibold">
        {user.id}
        →
        {user.name}
      </option>
    {/each}
  </select>
  <input
    class={cl_join('input', wrong_pass_status && 'preset-tonal-error')}
    type="password"
    bind:value={password}
    placeholder="गूढपद"
    required
    bind:this={pass_input_element}
  />
  <button
    type="submit"
    class="btn preset-filled-primary-400-600 gap-0 rounded-lg py-1 pr-4 pl-0 font-semibold"
  >
    <Spinner show={$pass_verify.isPending} />
    Submit
  </button>
  <div>
    <a
      type="button"
      class="btn preset-filled-secondary-400-600 h-5 rounded-lg px-1.5 py-0 text-sm"
      href="/reset_pass"
    >
      Reset Password
    </a>
  </div>
</form>
