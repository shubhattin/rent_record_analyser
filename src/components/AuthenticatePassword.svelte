<script lang="ts">
  import Spinner from './Spinner.svelte';
  import { cl_join } from '~/tools/cl_join';
  import { authClient } from '$lib/auth-client';
  import { createMutation } from '@tanstack/svelte-query';

  let {
    pass_input_element = $bindable()
  }: {
    on_verify?: (verified: boolean, jwt_token: string) => void;
    pass_input_element?: HTMLInputElement;
  } = $props();

  let user_id = $state(''); // 1st user(admin)
  let password = $state('');

  const pass_verify = createMutation({
    mutationFn: async () => {
      return await authClient.signIn.username({
        username: user_id,
        password,
        fetchOptions: {
          method: 'POST'
        }
      });
    },
    onSuccess(data) {
      if (data.error) {
        if (data.error.code === 'INVALID_USERNAME_OR_PASSWORD') {
          wrong_pass_status = true;
          password = '';
          pass_input_element && pass_input_element.focus();
        } else throw data.error;
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
    $pass_verify.mutate();
  };
</script>

<div class="font-bold text-orange-600 dark:text-yellow-500">Authentication</div>
<form onsubmit={check_pass_func} class="mt-2 space-y-2.5">
  <input type="text" name="userid" class="input" placeholder="User ID" bind:value={user_id} />
  <input
    class={cl_join('input', wrong_pass_status && 'preset-tonal-error')}
    type="password"
    bind:value={password}
    placeholder="Password"
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
</form>
