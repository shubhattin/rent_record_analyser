<script lang="ts">
  import { Popover, Modal } from '@skeletonlabs/skeleton-svelte';
  import Icon from '~/tools/Icon.svelte';
  import { BiLogOut } from 'svelte-icons-pack/bi';
  import { user_info } from '~/state/user.svelte';
  import { VscAccount } from 'svelte-icons-pack/vsc';
  import { AiOutlineUser } from 'svelte-icons-pack/ai';
  import { createMutation } from '@tanstack/svelte-query';
  import { authClient } from '$lib/auth-client';

  let user_info_popover_status = $state(false);
  let logout_modal_status = $state(false);

  const logout_mut = createMutation({
    mutationFn: async () => {
      await authClient.signOut();
    },
    onSuccess() {}
  });

  const log_out_func = async () => {
    logout_modal_status = false;
    $logout_mut.mutate();
  };
</script>

<Popover
  open={user_info_popover_status}
  onOpenChange={(e) => (user_info_popover_status = e.open)}
  triggerBase="btn m-2 p-0 select-none outline-none"
  contentBase="card z-40 pt-1 px-1 shadow-2xl bg-surface-100-900 rounded-lg"
  positioning={{ placement: 'left-start' }}
>
  {#snippet trigger()}
    <Icon class="hover:text-gray-6200 text-3xl dark:hover:text-gray-400" src={VscAccount} />
  {/snippet}
  {#snippet content()}
    <div class="space-y-2 p-1 select-none">
      <div class="text-center text-base font-bold">
        <Icon class="-mt-1 text-2xl" src={AiOutlineUser} />
        {$user_info!.name}
        <!-- <span class="text-sm text-gray-500 dark:text-gray-400">(#{$user_info!.id})</span> -->
      </div>
      <div class="space-y-2 p-1 select-none">
        <Modal
          open={logout_modal_status}
          onOpenChange={(e) => (logout_modal_status = e.open)}
          contentBase="card z-50 space-y-2 rounded-lg px-3 py-2 shadow-xl bg-surface-100-900"
          backdropBackground="backdrop-blur-sm"
        >
          {#snippet trigger()}
            <span
              class="btn bg-error-600 m-0 gap-1 rounded-md pt-0 pr-2 pb-1 pl-1 font-bold text-white"
            >
              <Icon class="text-2xl" src={BiLogOut} />
              <span>Logout</span>
            </span>
          {/snippet}
          {#snippet content()}
            <div class="text-lg font-bold">Are you sure to logout ?</div>
            <div class="space-x-2">
              <button
                class="btn preset-filled-surface-300-700 rounded-lg font-semibold"
                onclick={log_out_func}
              >
                Confirm
              </button>
              <button
                onclick={() => (logout_modal_status = false)}
                class="btn preset-outlined-surface-800-200 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          {/snippet}
        </Modal>
      </div>
    </div>
  {/snippet}
</Popover>
