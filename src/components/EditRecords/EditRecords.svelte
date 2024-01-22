<script lang="ts">
  import type { dtType } from '@components/get_data';
  import Edit from './Edit.svelte';
  import { fetch_post } from '@tools/fetch';
  import { z } from 'zod';
  import { writable } from 'svelte/store';
  import { slide, scale } from 'svelte/transition';
  import Modal from '@components/Modal.svelte';
  import { onMount } from 'svelte';

  export let data: dtType[];

  let editable = writable(false);
  let pass_enterer_status = writable(false);
  let passKey = writable('');

  onMount(() => {
    window.addEventListener('beforeunload', function (e) {
      if ((import.meta as any).env.PROD && $editable && typeof window !== 'undefined') {
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        e.returnValue = ''; // Chrome requires returnValue to be set
      }
    });
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
    const resp = await req;
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
      <input type="submit" value="Submit" />
    </form>
  </Modal>
  {#if !$pass_enterer_status}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      in:scale
      class="edit_btn"
      on:click={() => {
        $pass_enterer_status = true;
        setTimeout(() => {
          pass_input_elmnt.focus();
        }, 100);
      }}
    >
      ✏️
    </div>
  {/if}
{/if}

<Edit {data} {editable} {passKey} />

<style>
  .edit_btn {
    font-size: 1.5rem;
    position: fixed;
    right: 0;
    bottom: 0;
  }
</style>
