<script lang="ts">
  import Edit from './Edit.svelte';
  import { fetch_post } from '@tools/fetch';
  import { z } from 'zod';
  import { writable } from 'svelte/store';
  import { slide } from 'svelte/transition';
  import Modal from '@components/Modal.svelte';
  import { onMount } from 'svelte';
  import Spinner from '@components/Spinner.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  let rent_data = data.rent_data;
  $: rent_data = data.rent_data;

  let editable = writable(false);
  let pass_enterer_status = writable(false);
  let passKey = writable('');
  let pass_verify_spinner_show = false;

  onMount(() => {
    window.addEventListener('beforeunload', function (e) {
      if ((import.meta as any).env.PROD && $editable && typeof window !== 'undefined') {
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        e.returnValue = ''; // Chrome requires returnValue to be set
      }
    });
    document.querySelector('html')?.setAttribute('data-theme', 'dark'); // enforcing dark theme on this page
  });
  $: {
  }
  const check_pass = async () => {
    if ($passKey === '') return;
    const req = fetch_post('/api/edit/verify_pass', {
      json: {
        key: $passKey
      }
    });
    pass_verify_spinner_show = true;
    const resp = await req;
    pass_verify_spinner_show = false;
    if (!resp.ok) {
      $passKey = '';
      return;
    }
    const { verified } = z.object({ verified: z.boolean() }).parse(await resp.json());
    if (!verified) $passKey = '';
    else {
      $pass_enterer_status = false;
      $editable = true;
    }
  };

  let pass_input_elmnt: HTMLInputElement;
</script>

<svelte:head>
  <title>Rent Record Editor</title>
</svelte:head>

{#if !$editable}
  <Modal modal_open={pass_enterer_status}>
    <form on:submit|preventDefault={check_pass} transition:slide>
      <input
        bind:this={pass_input_elmnt}
        type="password"
        bind:value={$passKey}
        placeholder="गूढपद"
        required
      />
      <button type="submit">
        <Spinner show={pass_verify_spinner_show} />
        Submit
      </button>
    </form>
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
          pass_input_elmnt.focus();
        }, 500);
      }}
    >
      ✏️
    </div>
  {/if}
{/if}

<Edit data={rent_data} {editable} {passKey} />

<style>
  .edit_btn {
    font-size: 1.75rem;
    position: fixed;
    right: 0;
    bottom: 0;
  }
</style>
