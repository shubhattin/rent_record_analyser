<script lang="ts">
  import Edit from './Edit.svelte';
  import { Modal } from '@skeletonlabs/skeleton-svelte';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import AuthenticatePassword from '@components/AuthenticatePassword.svelte';
  import { slide } from 'svelte/transition';
  import MainAppBar from '@components/MainAppBar.svelte';
  import { FiEdit3 } from 'svelte-icons-pack/fi';
  import Icon from '@tools/Icon.svelte';

  let { data }: { data: PageData } = $props();

  let editable = $state(false);
  let pass_enterer_status = $state(false);

  onMount(() => {
    window.addEventListener('beforeunload', function (e) {
      if ((import.meta as any).env.PROD && editable && typeof window !== 'undefined') {
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        e.returnValue = ''; // Chrome requires returnValue to be set
      }
    });
    document.querySelector('html')?.setAttribute('data-theme', 'dark'); // enforcing dark theme on this page
  });

  let pass_input_elmnt = $state<HTMLInputElement>(null!);
</script>

<svelte:head>
  <title>Rent Record Editor</title>
</svelte:head>

<MainAppBar page_name="edit" />

{#if !editable}
  <Modal
    bind:open={pass_enterer_status}
    contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
    backdropClasses="backdrop-blur-sm"
  >
    {#snippet content()}
      <AuthenticatePassword
        is_verified={false}
        show_always={true}
        users_data={data.users}
        bind:pass_input_element={pass_input_elmnt}
        on_verify={(verified) => {
          if (verified) {
            pass_enterer_status = false;
            editable = true;
          }
        }}
      />
    {/snippet}
  </Modal>
  {#if !pass_enterer_status}
    <button
      transition:slide
      class="fixed bottom-2 right-2 cursor-default text-3xl"
      onclick={() => {
        pass_enterer_status = true;
        setTimeout(() => {
          pass_input_elmnt.focus();
        }, 500);
      }}
    >
      <Icon src={FiEdit3} class="hover:text-blue-500 active:text-red-500" />
    </button>
  {/if}
{/if}
<div class="my-8">
  <Edit all_data={data} {editable} />
</div>
