<script lang="ts">
  import Edit from './Edit.svelte';
  import { writable, type Writable } from 'svelte/store';
  import Modal from '@components/Modal.svelte';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import AuthenticatePassword from '@components/AuthenticatePassword.svelte';
  import { slide } from 'svelte/transition';
  import MainAppBar from '@components/MainAppBar.svelte';

  export let data: PageData;

  let editable = writable(false);
  let pass_enterer_status = writable(false);

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
</script>

<svelte:head>
  <title>Rent Record Editor</title>
</svelte:head>

<MainAppBar page_name="edit" />

{#if !$editable}
  <Modal modal_open={pass_enterer_status}>
    <AuthenticatePassword
      is_verified={writable(false)}
      show_always={true}
      users_data={data.users}
      pass_input_element={pass_input_elmnt}
      on_verify={(verified) => {
        if (verified) {
          $pass_enterer_status = false;
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
<div class="my-8">
  <Edit all_data={data} {editable} />
</div>

<style>
  .edit_btn {
    font-size: 1.75rem;
    position: fixed;
    right: 0;
    bottom: 0;
  }
</style>
