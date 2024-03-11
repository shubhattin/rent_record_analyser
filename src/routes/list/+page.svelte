<script lang="ts">
  import Edit from './Edit.svelte';
  import { writable, type Writable } from 'svelte/store';
  import Modal from '@components/Modal.svelte';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import AuthenticatePassword from '@components/AuthenticatePassword.svelte';
  import { slide } from 'svelte/transition';
  import { z } from 'zod';

  export let data: PageData;

  let editable = writable(false);
  let pass_enterer_status = writable(false);
  let jwt_token = writable('');

  onMount(() => {
    window.addEventListener('beforeunload', function (e) {
      if ((import.meta as any).env.PROD && $editable && typeof window !== 'undefined') {
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        e.returnValue = ''; // Chrome requires returnValue to be set
      }
    });
    document.querySelector('html')?.setAttribute('data-theme', 'dark'); // enforcing dark theme on this page
  });

  let pass_input_elmnt: Writable<HTMLInputElement> = writable(null!);
  const user_info_schema = z.object({
    id: z.number().int(),
    is_admin: z.boolean()
  });
  let user_info: z.infer<typeof user_info_schema> = null!;
</script>

<svelte:head>
  <title>Rent Record Editor</title>
</svelte:head>

{#if !$editable}
  <Modal modal_open={pass_enterer_status}>
    <AuthenticatePassword
      is_verified={writable(false)}
      show_always={true}
      users_data={data.users}
      {jwt_token}
      pass_input_element={pass_input_elmnt}
      on_verify={(verified, jwt_token) => {
        if (verified) {
          user_info = user_info_schema.parse(JSON.parse(window.atob(jwt_token.split('.')[1])));
          $pass_enterer_status = false;
          if (!user_info.is_admin) {
            // editing not supported for non-admin users
            return;
          }
          $editable = true;
        }
      }}
    />
  </Modal>
  {#if !$pass_enterer_status}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      transition:slide
      class="edit_btn"
      on:click={() => {
        $pass_enterer_status = true;
        setTimeout(() => {
          $pass_input_elmnt.focus();
        }, 500);
      }}
    >
      ✏️
    </div>
  {/if}
{/if}

<Edit all_data={data} {editable} {jwt_token} />

<style>
  .edit_btn {
    font-size: 1.75rem;
    position: fixed;
    right: 0;
    bottom: 0;
  }
</style>
